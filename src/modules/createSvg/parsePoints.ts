import {
	cartesianToLatLong,
	latLonToCartesian,
} from "@modules/applyRotation/transformCoordinates";
import { type ShapeType, shapeTypes } from "@projectTypes/shapeTypes";
import errorProcessing from "@utilities/errorProcessing";
import type Quaternion from "quaternion";

const CoordinatesRegex = /posList":"(?<coordinatelist>[0-9.\-\s]+)/gm;

const scaleMultiplier = 10;

type ProcessedPoint = {
	lat: number;
	long: number;
};

function crossingPoint(
	previousPoint: ProcessedPoint,
	currentPoint: ProcessedPoint,
): number {
	const { long: previousLong, lat: previousLat } = previousPoint;
	const { long: currentLong, lat: currentLat } = currentPoint;

	let x1: number;
	let x2: number;

	let y1: number;
	let y2: number;

	const baseY = Math.min(previousLat, currentLat);

	if (previousLong > currentLong) {
		x1 = previousLong;
		x2 = currentLong + 360;
		y1 = previousLat;
		y2 = currentLat;
	} else {
		x1 = currentLong;
		x2 = previousLong + 360;
		y1 = currentLat;
		y2 = previousLat;
	}

	if (y1 === y2) {
		return y1;
	}

	return ((y2 - y1) / (x2 - x1)) * (360 - x1) + baseY;
}

function shortDistanceCrosses360(
	previousLong: number,
	sourceLong: number,
): boolean {
	const lowPoint = Math.min(previousLong, sourceLong) + 360;
	const highPoint = Math.max(previousLong, sourceLong) + 360;

	return lowPoint + 360 - highPoint < highPoint - lowPoint;
}

function isFeatureValid(data: string): boolean | ShapeType {
	let isValid: boolean | ShapeType = false;
	for (const shapeType of shapeTypes) {
		if (data.includes(shapeType)) {
			isValid = shapeType as ShapeType;
		}
	}
	return isValid;
}

function createPointsArray(
	result: RegExpExecArray,
	finalRotation: Quaternion,
): ProcessedPoint[][] {
	const coordinateData = result[1].trim().split(" ");

	let previousPoint: ProcessedPoint | undefined;
	let mostRecentPath: ProcessedPoint[] = [];
	let currentPath: ProcessedPoint[] = [];

	coordinateData.forEach((dataPoint, index) => {
		// only work with complete pairs
		if (index % 2 === 1) {
			const incomingLon = Number.parseFloat(dataPoint);
			if (Number.isNaN(incomingLon)) {
				console.warn({ dataFloat: incomingLon }, { dataPoint }, "is NaN");
			} else {
				const incomingLat = Number.parseFloat(coordinateData[index - 1]);
				const point = latLonToCartesian(incomingLat, incomingLon);

				const qConjugate = finalRotation.conjugate();
				const result = finalRotation.mul(point).mul(qConjugate);
				let [sourceLat, sourceLong] = cartesianToLatLong(
					result.x,
					result.y,
					result.z,
				);

				sourceLat = 90 - sourceLat;
				sourceLong = sourceLong + 180;

				if (previousPoint) {
					const { long: previousLong } = previousPoint;

					if (shortDistanceCrosses360(previousLong, sourceLong)) {
						const borderY = crossingPoint(previousPoint, {
							lat: sourceLat,
							long: sourceLong,
						});

						const previousBorderX = previousLong > 180 ? 360 : 0;
						const currentBorderX = previousLong < 180 ? 360 : 0;

						currentPath.push({ long: previousBorderX, lat: borderY });
						const tempRecent = currentPath;
						if (mostRecentPath) {
							currentPath = mostRecentPath;
						} else {
							currentPath = [];
						}

						mostRecentPath = tempRecent;
						currentPath.push({ long: currentBorderX, lat: borderY });
						currentPath.push({ long: sourceLong, lat: sourceLat });
					} else {
						currentPath.push({ long: sourceLong, lat: sourceLat });
					}
				}

				previousPoint = {
					long: sourceLong,
					lat: sourceLat,
				};

				currentPath.push(previousPoint);
			}
		}
	});

	currentPath = currentPath.map(({ lat, long }) => {
		return { lat: lat * scaleMultiplier, long: long * scaleMultiplier };
	});

	return mostRecentPath.length ? [currentPath, mostRecentPath] : [currentPath];
}

function createPoints(currentPointsArray: ProcessedPoint[], color: string) {
	return currentPointsArray
		.map(
			(point: ProcessedPoint) =>
				`<circle cx="${point.long}" cy="${point.lat}" r="5" style="fill:${color}" />`,
		)
		.join("");
}

function createLine(
	currentPointsArray: ProcessedPoint[],
	color: string,
	metaData = "",
) {
	return `<polyline points="${currentPointsArray
		.map((point: ProcessedPoint) => `${point.long} ${point.lat}`)
		.join(
			" ",
		)}" fill="none" ${metaData ? `id="${metaData}"` : ""} style="stroke:${color}; stroke-width:2" />`;
}

function createShape(
	currentPointsArray: ProcessedPoint[],
	color: string,
	metaData = "",
) {
	return `<polygon points="${currentPointsArray
		.map((point: ProcessedPoint) => `${point.long} ${point.lat}`)
		.join(
			" ",
		)}" ${metaData ? `id="${metaData}"` : ""} style="fill:${color}" />`;
}

interface keyable {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[key: string]: any;
}

function parsePoints(
	outlineObject: unknown,
	color: string,
	finalRotation: Quaternion,
): string {
	try {
		const data = JSON.stringify(outlineObject);
		if (isFeatureValid(data) === false) {
			return "";
		}

		let metaData = "";

		const featureObject = outlineObject as keyable;

		if (featureObject.name) {
			metaData = featureObject.name;
		}

		const featureType: ShapeType = isFeatureValid(data) as ShapeType;
		const results = data.matchAll(CoordinatesRegex);

		if (!results) {
			return "";
		}

		let nodes = "";
		let currentStr = "";

		for (const result of results) {
			const currentPointArrays = createPointsArray(result, finalRotation);

			if (featureType === "LineString" || featureType === "OrientableCurve") {
				for (const currentPointArray of currentPointArrays) {
					currentStr += createLine(currentPointArray, color);
				}
			} else if (featureType === "MultiPoint" || featureType === "Point") {
				console.warn("Point and MultiPoint not implemented.");
				// currentPointArrays.forEach((currentPointArray) => {
				//   currentStr += createPoints(currentPointArray, color);
				// });
			} else {
				for (const currentPointArray of currentPointArrays) {
					currentStr += createShape(currentPointArray, color, metaData);
				}
			}

			nodes = `${nodes}${currentStr}`;
		}

		return nodes;
	} catch (err) {
		errorProcessing(err);
	}

	return "";
}

export default parsePoints;

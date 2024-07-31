import { filterForTime } from "@modules/findNodes/filterForTime";
import { parseToJson } from "@modules/findNodes/parseToJson";

import path from "node:path";
import type { CptRampRuleArray } from "@modules/validFiles/jsonFromCpt";
import type { RotationRecord } from "@projectTypes/rotationTypes";
import type { FeatureCollection } from "@projectTypes/timeTypes";
import { processedFileName } from "@utilities/processedFileName";
import { featureColorAndRotationFactory } from "./featureColorAndRotationFactory";

export async function convertRampedFileToGroup(
	filepath: string,
	rotationTimes: RotationRecord,
	colorRamp: CptRampRuleArray,
	time: number,
): Promise<string | undefined> {
	let featureArray: FeatureCollection[] | undefined =
		await parseToJson(filepath);

	if (!featureArray) {
		throw new Error("No features found in file");
	}

	// Finds all features that are valid at the given time
	featureArray = filterForTime(featureArray, time);
	const fileName = processedFileName(path.basename(filepath), false);

	const parsePointsWithRotation = featureColorAndRotationFactory(
		colorRamp,
		rotationTimes,
		time,
	);

	const svgFeatures = featureArray
		?.map((feature) => parsePointsWithRotation(feature))
		.join("");

	if (svgFeatures?.length) {
		return `<g id="${fileName}">${svgFeatures}</g>`;
	}

	return;
}

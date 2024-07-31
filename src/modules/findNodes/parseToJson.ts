import { promises as fs } from "node:fs";
import type { FeatureCollection } from "@projectTypes/timeTypes";
import errorProcessing from "@utilities/errorProcessing";
import { XMLParser } from "fast-xml-parser";

export async function parseToJson(
	sourcePath: string,
): Promise<Array<FeatureCollection> | undefined> {
	try {
		let data = await fs.readFile(sourcePath, "utf8");
		data = data.replace(/gml:/g, "");
		data = data.replace(/gpml:/g, "");
		const parser = new XMLParser();
		const parsedJson = parser.parse(data);

		if (parsedJson?.FeatureCollection) {
			const sourceJson = parsedJson.FeatureCollection;
			if (Array.isArray(sourceJson.featureMember)) {
				return sourceJson.featureMember;
			}
		}

		// throw new Error(`No FeatureCollection found in ${sourcePath}`);
		console.warn(`No FeatureCollection found in ${sourcePath}`);
		return;
	} catch (err: unknown) {
		errorProcessing(err);
	}
}

import fs from "node:fs";
import path from "node:path";

export function findFile(filePath: string, fileName: string): string | null {
	const absolutePath = path.resolve(filePath);
	const files = fs.readdirSync(absolutePath);

	for (const file of files) {
		const currentPath = path.join(absolutePath, file);
		const stats = fs.statSync(currentPath);

		if (stats.isFile() && file === fileName) {
			return currentPath;
		}

		if (stats.isDirectory()) {
			const foundPath = findFile(currentPath, fileName);
			if (foundPath) {
				return foundPath;
			}
		}
	}

	return null;
}

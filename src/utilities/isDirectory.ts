import { lstatSync } from "node:fs";

export const isDirectory = (path: string) => {
	try {
		return lstatSync(path) ? lstatSync(path).isDirectory() : false;
	} catch {
		return false;
	}
};

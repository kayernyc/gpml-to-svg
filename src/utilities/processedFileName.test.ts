import { expect, test } from "vitest";

import { processedFileName } from "./processedFileName";

test("fileName is correctly processed", () => {
	expect(processedFileName("testFolder/image.bob.svg")).toBe("image.bob.svg");
	expect(processedFileName("testFolder/image bob.svg")).toBe("image-bob.svg");
	expect(processedFileName("testFolder/.svg")).toBe(undefined);
});

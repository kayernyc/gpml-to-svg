import { describe, expect, it } from "vitest";
import { reduceFileArray } from "./parseRotationFile";

const test1Array = [
	"104  0.0   90.0    0.0    0.0  000 ! Continent 104",
	"104  1.0   29.3679  -52.6038  -21.8146  600 ! Drift Correction",
	"104 1080.0   29.3679  -52.6038  -21.8146  600 !",
	"104 1080.1   21.3566 -101.3875  -56.5157  000 !",
];

const test2Array = [
	"104  0.0   90.0    0.0    0.0  000 ! Continent 104",
	"104  1.0   29.3679  -52.6038  -21.8146  600 ! Drift Correction",
	"104 1100.0   21.0039 -107.4277  -62.8311  000 !",
	"104 1700.0   29.3798 -127.7932  -65.2611  000 !",
	"104 1750.0   35.5568 -135.7675  -52.8657  000 !",
	"104 1800.0   35.6842 -137.3212  -32.8451  000 !",
	"104 1850.0   25.8318 -133.3357  -24.6879  000 !",
	"104 1900.0   27.5706 -130.518  -19.5358  000 !",
	"104 1950.0   48.2895 -113.8924   -9.703  000 ! ",
	"104 2000.0   90.0    0.0    0.0  000 ! Continent 104",
	"",
];

describe("reduceFileArray", () => {
	it("should return an empty array if the input array is empty", () => {
		const result = reduceFileArray([]);
		expect(result).toEqual({});
	});

	it("should return a correctly parsed array", () => {
		const result = reduceFileArray(test1Array);
		expect(result).toEqual({
			"104": {
				"0": {
					lat_of_euler_pole: 90,
					lon_of_euler_pole: 0,
					relativePlateId: 0,
					rotation_angle: 0,
				},
				"1": {
					lat_of_euler_pole: 29.3679,
					lon_of_euler_pole: -52.6038,
					relativePlateId: 600,
					rotation_angle: -21.8146,
				},
				"1080": {
					lat_of_euler_pole: 29.3679,
					lon_of_euler_pole: -52.6038,
					relativePlateId: 600,
					rotation_angle: -21.8146,
				},
				"1080.1": {
					lat_of_euler_pole: 21.3566,
					lon_of_euler_pole: -101.3875,
					relativePlateId: 0,
					rotation_angle: -56.5157,
				},
			},
		});
	});

	it("should ignore empty lines", () => {
		const result = reduceFileArray(test2Array);
		expect(result).toEqual({
			"104": {
				"0": {
					lat_of_euler_pole: 90,
					lon_of_euler_pole: 0,
					relativePlateId: 0,
					rotation_angle: 0,
				},
				"1": {
					lat_of_euler_pole: 29.3679,
					lon_of_euler_pole: -52.6038,
					relativePlateId: 600,
					rotation_angle: -21.8146,
				},
				"1100": {
					lat_of_euler_pole: 21.0039,
					lon_of_euler_pole: -107.4277,
					relativePlateId: 0,
					rotation_angle: -62.8311,
				},
				"1700": {
					lat_of_euler_pole: 29.3798,
					lon_of_euler_pole: -127.7932,
					relativePlateId: 0,
					rotation_angle: -65.2611,
				},
				"1750": {
					lat_of_euler_pole: 35.5568,
					lon_of_euler_pole: -135.7675,
					relativePlateId: 0,
					rotation_angle: -52.8657,
				},
				"1800": {
					lat_of_euler_pole: 35.6842,
					lon_of_euler_pole: -137.3212,
					relativePlateId: 0,
					rotation_angle: -32.8451,
				},
				"1850": {
					lat_of_euler_pole: 25.8318,
					lon_of_euler_pole: -133.3357,
					relativePlateId: 0,
					rotation_angle: -24.6879,
				},
				"1900": {
					lat_of_euler_pole: 27.5706,
					lon_of_euler_pole: -130.518,
					relativePlateId: 0,
					rotation_angle: -19.5358,
				},
				"1950": {
					lat_of_euler_pole: 48.2895,
					lon_of_euler_pole: -113.8924,
					relativePlateId: 0,
					rotation_angle: -9.703,
				},
				"2000": {
					lat_of_euler_pole: 90,
					lon_of_euler_pole: 0,
					relativePlateId: 0,
					rotation_angle: 0,
				},
			},
		});
	});
});

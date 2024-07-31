export type TimeInstant = {
	timePosition: number | string;
};

export type TimePeriod = {
	begin: { TimeInstant: TimeInstant };
	end: { TimeInstant: TimeInstant };
};

export type FeatureCollection = {
	identity: string;
	revision: string;
	name: string;
	validTime: {
		TimePeriod: TimePeriod;
	};
	geometryImportTime: TimeInstant;
	reconstructionPlateId: {
		ConstantValue: {
			value: number;
		};
	};
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	outlineOf: {};
	featureType: string;
};

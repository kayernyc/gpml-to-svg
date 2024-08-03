export type TimeInstant = {
  timePosition: number | string;
};

export type TimePeriod = {
  begin: { TimeInstant: TimeInstant };
  end: { TimeInstant: TimeInstant };
};

export type GPlates_Feature = {
  identity: string;
  revision: string;
  name: string;
  validTime: {
    TimePeriod: TimePeriod;
  };
  processedTime: {
    begin: number;
    end: number;
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

export type FeatureCollection = Array<GPlates_Feature>;

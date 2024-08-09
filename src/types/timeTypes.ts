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
  outlineOf: {
    ConstantValue: {
      value: string;
    };
  };
  shapeType: string;
  featureType: string;
};

export function isGPlates_Feature(
  candidate: object,
): candidate is GPlates_Feature {
  const testCandidate = candidate as GPlates_Feature;
  if (
    testCandidate.featureType !== undefined &&
    testCandidate.validTime !== undefined &&
    testCandidate.outlineOf !== undefined
  ) {
    return true;
  }

  return false;
}

export type FeatureCollection = Array<GPlates_Feature>;

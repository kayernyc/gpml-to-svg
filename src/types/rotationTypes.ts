export type RotationRecord = {
  [key: number]: {
    x: number;
    y: number;
    rotation: number;
    relativePlateId: number;
  };
};

export type RotationDict = {
  [key: string]: RotationRecord;
};

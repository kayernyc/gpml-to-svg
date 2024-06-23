export type RotationDict = {
  [key: string]: {
    [key: number]: {
      x: number;
      y: number;
      rotation: number;
      relativePlateId: number;
    };
  };
};

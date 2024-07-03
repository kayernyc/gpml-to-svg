export type RotationNode = {
  lat_of_euler_pole: number;
  lon_of_euler_pole: number;
  rotation_angle: number;
  relativePlateId: number;
};

export type RotationRecord = {
  [key: number]: RotationNode;
};

export type RotationDict = {
  [key: string]: RotationRecord;
};

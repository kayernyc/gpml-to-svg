export type LinearRing = {
  posList: string;
};

export type Polygon = {
  exterior: LinearRing;
};

export type Shape = {
  value: Polygon;
  description: string;
  valueType: string;
};

/* 
https://github.com/GPlates/GPlates/blob/c4680ebe54f4535909085feacecd66410a91ff98/src/qt-resources/gpgim/gpgim.xml#L581C3-L601C20

ShapeTypes
  LineString  A list of latitude/longitude coordinate tuples defining a polyline.

  MultiPoint A list of latitude/longitude coordinate tuples defining an unordered set of points.

  OrientableCurve A list of latitude/longitude coordinate tuples defining a polyline and a '+' or '-' orientation.

  Point A single latitude/longitude coordinate tuple defining a point.

  Polygon  A list of latitude/longitude coordinate tuples defining a closed polyline exterior and zero or more lists of latitude/longitude coordinate tuples each defining an interior hole region.
*/

export const shapeTypes = [
  'LineString',
  'MultiPoint',
  'OrientableCurve',
  'Point',
  'Polygon',
] as const;

export type ShapeType = (typeof shapeTypes)[number];

export type LinearRing = {
  posList: string;
};

export type Polygon = {
  exterior: LinearRing;
};

export type Shape = {
  value: ShapeType;
  description: string;
  valueType: string;
};

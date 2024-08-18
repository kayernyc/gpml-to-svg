import { type ShapeType, shapeTypes } from '@projectTypes/shapeTypes';

export function isFeatureValid(data: string): boolean | ShapeType {
  let isValid: boolean | ShapeType = false;
  if (!data.length) {
    return false;
  }

  for (const shapeType of shapeTypes) {
    if (shapeType.includes(data)) {
      isValid = shapeType as ShapeType;
    }
  }
  return isValid;
}

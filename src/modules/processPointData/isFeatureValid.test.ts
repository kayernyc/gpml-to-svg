import { shapeTypes } from '@projectTypes/shapeTypes';
import { describe, expect, it, test } from 'vitest';
import { isFeatureValid } from './isFeatureValid';

describe('isFeatureValid', () => {
  const shapeTypeTestArray = shapeTypes.map((shapeType) => ({
    description: `it correctly passes ${shapeType}`,
    shapeType,
  }));
  test.each(shapeTypeTestArray)('$description', ({ shapeType }) => {
    const result = isFeatureValid(shapeType);
    expect(result).toBe(shapeType);
    expect(!!result).toBe(true);
  });
});

describe('isFeatureValid', () => {
  it('should return false for invalid feature data', () => {
    const invalidData = 'invalid feature data';
    const result = isFeatureValid(invalidData);
    expect(result).toBe(false);
  });

  it('should return false for empty feature data', () => {
    const emptyData = '';
    const result = isFeatureValid(emptyData);
    expect(result).toBe(false);
  });
});

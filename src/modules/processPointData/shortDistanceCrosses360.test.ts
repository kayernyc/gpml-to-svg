import { describe, expect, it } from 'vitest';
import { shortDistanceCrosses360 } from './shortDistanceCrosses360';

describe('shortDistanceCrosses360', () => {
  it('should return true when previousLong is 0 and sourceLong is 180', () => {
    const previousLong = 0;
    const sourceLong = 180;
    const result = shortDistanceCrosses360(previousLong, sourceLong);
    expect(result).toBe(false);
  });

  it('should return false when previousLong is 90 and sourceLong is 270', () => {
    const previousLong = 90;
    const sourceLong = 270;
    const result = shortDistanceCrosses360(previousLong, sourceLong);
    expect(result).toBe(false);
  });

  it('should return true when previousLong is 350 and sourceLong is 10', () => {
    const previousLong = 350;
    const sourceLong = 10;
    const result = shortDistanceCrosses360(previousLong, sourceLong);
    expect(result).toBe(true);
  });
});

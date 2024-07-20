import { describe, expect, test } from 'vitest';
import { validateFileName, ValidateFileNameResult } from './fileNameValidation';

describe('validateFileName', () => {
  test('should return Valid for a valid file name', () => {
    const fileName = 'valid_file_name';
    const result = validateFileName(fileName);
    expect(result.validationResult).toContain(ValidateFileNameResult.Valid);
  });

  test('should return InvalidCharacter for a file name with reserved characters', () => {
    const fileName = 'file<name>';
    const result = validateFileName(fileName);
    expect(result.validationResult).toContain(
      ValidateFileNameResult.InvalidCharacter,
    );
  });

  test('should return ReservedWord for a file name with reserved words', () => {
    const fileName = 'COM1';
    const result = validateFileName(fileName);
    expect(result.validationResult).toContain(
      ValidateFileNameResult.ReservedWord,
    );
  });

  test('should return TooShort for a file name that is too short', () => {
    const fileName = 'a';
    const result = validateFileName(fileName);
    expect(result.validationResult).toContain(ValidateFileNameResult.TooShort);
  });

  test('should return TooShort and InvisibleFile for a file name that is too short and begins with a period', () => {
    const fileName = '.a';
    const result = validateFileName(fileName);
    console.log(result.message);
    expect(result.message)
      .toBe(`The proposed filename ".a" is too short. Please make the filename at least 3 characters long.
File names should not begin or end with periods. In some file systems these files would become invisible.`);
    expect(result.validationResult).toContain(ValidateFileNameResult.TooShort);
    expect(result.validationResult).toContain(
      ValidateFileNameResult.InvisibleFile,
    );
  });

  test('should return InvisibleFile for a file name starting with a dot', () => {
    const fileName = '.hidden';
    const result = validateFileName(fileName);
    expect(result.validationResult).toContain(
      ValidateFileNameResult.InvisibleFile,
    );
  });

  test('should return InvisibleFile for a file name ending with a dot', () => {
    const fileName = 'hidden.';
    const result = validateFileName(fileName);
    expect(result.validationResult).toContain(
      ValidateFileNameResult.InvisibleFile,
    );
  });
});

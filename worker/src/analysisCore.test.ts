import { describe, it, expect } from 'vitest';
import { parsePackageJson } from './analysisCore';

describe('parsePackageJson', () => {
  it('should parse valid package.json', () => {
    const file = {
      name: 'package.json',
      content: JSON.stringify({
        dependencies: {
          react: '^18.0.0'
        }
      })
    };
    const result = parsePackageJson(file);
    expect(result).toEqual({
      dependencies: {
        react: '^18.0.0'
      }
    });
  });

  it('should return null for malformed JSON', () => {
    const file = {
      name: 'package.json',
      content: '{ malformed: json }'
    };
    const result = parsePackageJson(file);
    expect(result).toBeNull();
  });
});

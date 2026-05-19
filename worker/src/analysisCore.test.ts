import { describe, it, expect } from 'vitest';
import { buildLanguageProfile, RepoLanguageStats } from './analysisCore';

describe('buildLanguageProfile', () => {
  it('should handle an empty array of language stats', () => {
    const stats: RepoLanguageStats[] = [];
    const result = buildLanguageProfile(stats);

    expect(result).toEqual({
      totals: {},
      languages: [],
      languageTags: []
    });
  });

  it('should handle a single repository language stats', () => {
    const stats: RepoLanguageStats[] = [
      {
        TypeScript: 1000,
        HTML: 500
      }
    ];
    const result = buildLanguageProfile(stats);

    expect(result).toEqual({
      totals: { TypeScript: 1000, HTML: 500 },
      languages: [
        { name: 'TypeScript', bytes: 1000, pct: 67 },
        { name: 'HTML', bytes: 500, pct: 33 }
      ],
      languageTags: ['67% TypeScript', '33% HTML']
    });
  });

  it('should handle multiple repository language stats and aggregate same languages', () => {
    const stats: RepoLanguageStats[] = [
      {
        TypeScript: 1000,
        HTML: 500
      },
      {
        TypeScript: 2000,
        CSS: 1500
      }
    ];
    const result = buildLanguageProfile(stats);

    expect(result).toEqual({
      totals: { TypeScript: 3000, HTML: 500, CSS: 1500 },
      languages: [
        { name: 'TypeScript', bytes: 3000, pct: 60 },
        { name: 'CSS', bytes: 1500, pct: 30 },
        { name: 'HTML', bytes: 500, pct: 10 }
      ],
      languageTags: ['60% TypeScript', '30% CSS', '10% HTML']
    });
  });

  it('should filter out languages that round down to 0% and sort them descending by percentage', () => {
    const stats: RepoLanguageStats[] = [
      {
        TypeScript: 10000,
        JavaScript: 9000,
        C: 1
      }
    ];
    const result = buildLanguageProfile(stats);

    expect(result.totals).toEqual({ TypeScript: 10000, JavaScript: 9000, C: 1 });
    // TypeScript: 10000 / 19001 -> 53%
    // JavaScript: 9000 / 19001 -> 47%
    // C: 1 / 19001 -> 0% (filtered out)
    expect(result.languages).toEqual([
      { name: 'TypeScript', bytes: 10000, pct: 53 },
      { name: 'JavaScript', bytes: 9000, pct: 47 }
    ]);
    expect(result.languageTags).toEqual(['53% TypeScript', '47% JavaScript']);
  });

  it('should sort languages with same percentage by insertion order or maintain stable sort', () => {
    const stats: RepoLanguageStats[] = [
      {
        TypeScript: 1000,
        JavaScript: 1000
      }
    ];
    const result = buildLanguageProfile(stats);

    expect(result.totals).toEqual({ TypeScript: 1000, JavaScript: 1000 });
    expect(result.languages).toEqual([
      { name: 'TypeScript', bytes: 1000, pct: 50 },
      { name: 'JavaScript', bytes: 1000, pct: 50 }
    ]);
    expect(result.languageTags).toEqual(['50% TypeScript', '50% JavaScript']);
  });
});

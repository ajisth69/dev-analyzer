import { describe, it, expect } from 'vitest';
import { calculateDevIQ, parsePackageJson, buildLanguageProfile, RepoLanguageStats } from './analysisCore';

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

describe('calculateDevIQ', () => {
  it('should return 0 when there are no repos, languages, or followers', () => {
    const devIq = calculateDevIQ([], [], 0);
    expect(devIq).toBe(0);
  });

  it('should calculate DevIQ correctly for standard languages', () => {
    // JavaScript multiplier is 2.5, constant is 35
    // 3500 bytes of JS = (3500 / 35) = 100 lines
    // 100 lines * 2.5 multiplier = 250 DevIQ
    const devIq = calculateDevIQ([], [{ JavaScript: 3500 }], 0);
    expect(devIq).toBe(250);
  });

  it('should calculate DevIQ correctly for advanced languages', () => {
    // Rust multiplier is 6.0, constant is 25
    // 2500 bytes of Rust = (2500 / 25) = 100 lines
    // 100 lines * 6.0 multiplier = 600 DevIQ
    const devIq = calculateDevIQ([], [{ Rust: 2500 }], 0);
    expect(devIq).toBe(600);
  });

  it('should grant high data volume bonus and advanced language concentration bonus', () => {
    // Rust is > 3.2 multiplier
    // Need > 50,000 repoBytes to trigger bonus
    // 50,001 bytes of Rust = (50001 / 25) = 2000.04 lines
    // 2000.04 * 6.0 = 12000.24 DevIQ base
    // repoBytes > 50_000 but < 100_000, so bonus is 400
    // advanced ratio is 1.0 (all Rust)
    // bonus = 400 * (0.3 + 0.7 * 1.0) = 400
    // Total = 12000 + 400 = 12400
    const devIq = calculateDevIQ([], [{ Rust: 50001 }], 0);
    expect(devIq).toBe(12400); // Math.round at end
  });

  it('should handle unlisted languages with default constants and multipliers', () => {
    // Default constant = 40, Default multiplier = 2.2
    // 4000 bytes = 100 lines
    // 100 lines * 2.2 = 220 DevIQ
    const devIq = calculateDevIQ([], [{ "UnknownLang": 4000 }], 0);
    expect(devIq).toBe(220);
  });

  it('should grant highest data volume bonus', () => {
    // > 2_000_000 bytes triggers 15000 bonus
    const devIq = calculateDevIQ([], [{ HTML: 2000001 }], 0);
    // HTML is not advanced (multiplier < 3.2), advancedRatio = 0
    // Bonus = 15000 * (0.3 + 0.7 * 0) = 4500
    // Base = (2000001 / 45) * 1.0 = ~44444.46
    // Total = 4500 + 44444.46 = ~48944
    expect(devIq).toBe(48944);
  });

  it('should grant medium data volume bonus', () => {
    // > 500_000 bytes triggers 5000 bonus
    const devIq = calculateDevIQ([], [{ HTML: 500001 }], 0);
    // Base = (500001 / 45) * 1.0 = ~11111.13
    // Bonus = 5000 * 0.3 = 1500
    // Total = 11111.13 + 1500 = 12611
    expect(devIq).toBe(12611);
  });

  it('should grant low data volume bonus', () => {
    // > 100_000 bytes triggers 1500 bonus
    const devIq = calculateDevIQ([], [{ HTML: 100001 }], 0);
    // Base = (100001 / 45) * 1.0 = ~2222.24
    // Bonus = 1500 * 0.3 = 450
    // Total = 2222.24 + 450 = 2672
    expect(devIq).toBe(2672);
  });

  it('should fallback to default multiplier in condition if somehow undefined', () => {
    const devIq = calculateDevIQ([], [{ "UnknownLang": 4000 }], 0);
    expect(devIq).toBe(220);
  });

  it('should calculate repo point bonuses based on stargazers, forks, and license', () => {
    const repos = [
      {
        name: 'test-repo',
        stargazers_count: 10, // 10 * 50 = 500
        forks_count: 2,       // 2 * 150 = 300
        license: { spdx_id: 'MIT' } // 500
      }
    ];
    // Expected DevIQ = 500 + 300 + 500 = 1300
    const devIq = calculateDevIQ(repos, [], 0);
    expect(devIq).toBe(1300);
  });

  it('should grant longevity bonus for old repositories', () => {
    const repos = [
      {
        name: 'test-repo',
        created_at: new Date(Date.now() - 30 * 30 * 24 * 60 * 60 * 1000).toISOString(), // ~30 months ago
        updated_at: new Date().toISOString()
      }
    ];
    // > 6 months -> longevityMonths * 100 (30 * 100 = 3000)
    // > 24 months -> + 2000
    // Expected total roughly 5000 + base stats
    const devIq = calculateDevIQ(repos, [], 0);
    // Since longevity is calculated exactly based on Date.now, it can vary slightly
    // We expect it to be at least > 4000
    expect(devIq).toBeGreaterThan(4000);
  });

  it('should skip longevity bonus if dates are invalid', () => {
    const repos = [
      {
        name: 'test-repo',
        created_at: "invalid-date",
        updated_at: "invalid-date"
      }
    ];
    const devIq = calculateDevIQ(repos, [], 0);
    expect(devIq).toBe(0);
  });

  it('should grant bonus for low issue ratio', () => {
    const repos = [
      {
        name: 'test-repo',
        stargazers_count: 20, // 20 * 50 = 1000
        open_issues_count: 1  // ratio = 1/20 = 0.05 < 0.1, adds 300
      }
    ];
    // Expected = 1000 + 300 = 1300
    const devIq = calculateDevIQ(repos, [], 0);
    expect(devIq).toBe(1300);
  });

  it('should apply network multiplier based on followers', () => {
    // 3500 bytes JS = 250 DevIQ base
    // 50 followers -> multiplier = 1 + min(50/100, 1.5) = 1.5
    // Total = 250 * 1.5 = 375
    const devIq = calculateDevIQ([], [{ JavaScript: 3500 }], 50);
    expect(devIq).toBe(375);
  });

  it('should not exceed maximum network multiplier', () => {
    // 3500 bytes JS = 250 DevIQ base
    // 200 followers -> multiplier = 1 + min(200/100, 1.5) = 2.5
    // Total = 250 * 2.5 = 625
    const devIq = calculateDevIQ([], [{ JavaScript: 3500 }], 200);
    expect(devIq).toBe(625);
  });

  it('should return 0 if finalIq is NaN', () => {
    // Pass something that causes NaN in the calculations
    // For instance, followers as a non-number that coerces badly, though typescript prevents it.
    // Let's pass a string as any to followers
    const devIq = calculateDevIQ([], [], "NaN" as any);
    expect(devIq).toBe(0);
  });
});

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

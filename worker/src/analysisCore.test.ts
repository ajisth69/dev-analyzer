import { describe, it, expect } from 'vitest';
import { calculateDevIQ, RepoLanguageStats } from './analysisCore';

describe('calculateDevIQ', () => {
  it('should return 0 for empty inputs', () => {
    expect(calculateDevIQ([], [], 0)).toBe(0);
  });

  it('should calculate basic DevIQ for standard languages', () => {
    // JavaScript: constant = 35, multiplier = 2.5
    // lines = 350 / 35 = 10
    // devIq = 10 * 2.5 = 25
    const languagesArray: RepoLanguageStats[] = [{ JavaScript: 350 }];
    const repos = [{ stargazers_count: 0 }]; // No bonuses

    expect(calculateDevIQ(repos, languagesArray, 0)).toBe(25);
  });

  it('should apply data volume and advanced language bonuses', () => {
    // JavaScript: constant = 35, multiplier = 2.5 (repoBytes > 50k bonus test)
    const languagesArray: RepoLanguageStats[] = [{ JavaScript: 60000 }];
    const repos = [{}];

    // devIq from lines = (60000 / 35) * 2.5 = 1714.285... * 2.5 = 4285.714...
    // repoBytes = 60000 (> 50_000)
    // advancedRatio = 0 (JavaScript multiplier is 2.5 < 3.2)
    // dataVolumeBonus = 400
    // applied bonus = 400 * (0.3 + 0.7 * 0) = 120
    // total = 4285.714... + 120 = 4405.714...
    // rounded = 4406

    expect(calculateDevIQ(repos, languagesArray, 0)).toBe(4406);
  });

  it('should apply bonuses for repository properties', () => {
    const repos = [
      {
        stargazers_count: 10,
        forks_count: 2,
        license: { name: 'MIT' },
        created_at: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24 * 30).toISOString(), // ~30 months ago
        updated_at: new Date().toISOString(),
        open_issues_count: 0
      }
    ];

    // stargazers_count * 50 = 10 * 50 = 500
    // forks_count * 150 = 2 * 150 = 300
    // license = 500
    // longevityMonths = 30
    // longevity > 6 = 30 * 100 = 3000
    // longevity > 24 = 2000
    // Total repo bonus = 500 + 300 + 500 + 3000 + 2000 = 6300
    // open_issues ratio = 0 / 10 = 0 (< 0.1), but stargazers_count is exactly 10 (not > 10), so no 300 bonus.

    expect(calculateDevIQ(repos, [], 0)).toBe(6300);
  });

  it('should apply issue ratio bonus when stargazers > 10', () => {
    const repos = [
      {
        stargazers_count: 20,
        open_issues_count: 1
      }
    ];

    // stargazers_count = 20 * 50 = 1000
    // ratio = 1 / 20 = 0.05 (< 0.1) and stargazers > 10
    // bonus = 300
    // Total = 1300
    expect(calculateDevIQ(repos, [], 0)).toBe(1300);
  });

  it('should apply followers multiplier correctly', () => {
    const languagesArray: RepoLanguageStats[] = [{ JavaScript: 350 }]; // base = 25

    // followers = 50
    // multiplier = 1 + min(50/100, 1.5) = 1.5
    // total = 25 * 1.5 = 37.5 -> rounded to 38
    expect(calculateDevIQ([{}], languagesArray, 50)).toBe(38);

    // followers = 200
    // multiplier = 1 + min(200/100, 1.5) = 1 + 1.5 = 2.5
    // total = 25 * 2.5 = 62.5 -> rounded to 63
    expect(calculateDevIQ([{}], languagesArray, 200)).toBe(63);
  });

  it('should handle undefined or malformed inputs gracefully', () => {
    // Missing dates, negative followers, missing properties
    const repos = [
      { stargazers_count: undefined, created_at: "invalid date", updated_at: null },
      {}
    ];

    expect(calculateDevIQ(repos, [], -50)).toBe(0); // final result min calculation might adjust, let's see
  });
});

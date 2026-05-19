import { describe, it, expect } from "vitest";
import { collectDependencyQueries, type FileSignal } from "../analysisCore";

describe("collectDependencyQueries", () => {
  describe("Limits and Deduplication", () => {
    it("should deduplicate identical dependencies", () => {
      const files: FileSignal[] = [
        {
          name: "package.json",
          content: JSON.stringify({
            dependencies: { react: "^18.0.0" },
            devDependencies: { react: "^18.0.0" },
          }),
        },
      ];
      const queries = collectDependencyQueries(files);
      expect(queries).toHaveLength(1);
      expect(queries[0]).toEqual({
        ecosystem: "npm",
        packageName: "react",
        version: "18.0.0",
        manifest: "package.json",
      });
    });

    it("should respect the limit parameter", () => {
      const dependencies: Record<string, string> = {};
      for (let i = 0; i < 100; i++) {
        dependencies[`pkg-${i}`] = "1.0.0";
      }

      const files: FileSignal[] = [
        {
          name: "package.json",
          content: JSON.stringify({ dependencies }),
        },
      ];

      const defaultLimitQueries = collectDependencyQueries(files);
      expect(defaultLimitQueries).toHaveLength(80); // Default limit is 80

      const customLimitQueries = collectDependencyQueries(files, 10);
      expect(customLimitQueries).toHaveLength(10);
    });

    it("should deduplicate dependencies across different manifests if ecosystem, name, and version match", () => {
        // While technically different manifests, the deduplication key is:
        // `${query.ecosystem}:${query.packageName}:${query.version || ""}`
        // So they should be deduplicated even if from different files.
        const files: FileSignal[] = [
            {
              name: "package.json",
              content: JSON.stringify({ dependencies: { react: "18.0.0" } }),
            },
            {
              name: "frontend/package.json",
              content: JSON.stringify({ dependencies: { react: "18.0.0" } }),
            },
        ];

        const queries = collectDependencyQueries(files);
        expect(queries).toHaveLength(1);
        expect(queries[0].packageName).toBe("react");
    });
  });

  describe("package.json", () => {
    it("should parse all dependency types", () => {
      const files: FileSignal[] = [
        {
          name: "package.json",
          content: JSON.stringify({
            dependencies: { a: "1.0.0" },
            devDependencies: { b: "2.0.0" },
            optionalDependencies: { c: "3.0.0" },
            peerDependencies: { d: "4.0.0" },
          }),
        },
      ];
      const queries = collectDependencyQueries(files);
      expect(queries).toHaveLength(4);
      expect(queries.map((q) => q.packageName).sort()).toEqual(["a", "b", "c", "d"]);
    });

    it("should handle invalid JSON safely", () => {
      const files: FileSignal[] = [
        {
          name: "package.json",
          content: "{ invalid json ",
        },
      ];
      const queries = collectDependencyQueries(files);
      expect(queries).toHaveLength(0);
    });

    it("should normalize version ranges correctly", () => {
      const files: FileSignal[] = [
        {
          name: "package.json",
          content: JSON.stringify({
            dependencies: {
              "pkg-caret": "^1.2.3",
              "pkg-tilde": "~2.3.4",
              "pkg-exact": "3.4.5",
              "pkg-v-prefix": "v4.5.6",
              "pkg-range": ">=1.0.0 <2.0.0", // normalizer cleans leading spaces/ops and gets first sequence
            },
          }),
        },
      ];
      const queries = collectDependencyQueries(files);
      const versionMap = Object.fromEntries(queries.map((q) => [q.packageName, q.version]));

      expect(versionMap["pkg-caret"]).toBe("1.2.3");
      expect(versionMap["pkg-tilde"]).toBe("2.3.4");
      expect(versionMap["pkg-exact"]).toBe("3.4.5");
      expect(versionMap["pkg-v-prefix"]).toBe("4.5.6");
      expect(versionMap["pkg-range"]).toBe("1.0.0");
    });
  });

  describe("requirements.txt", () => {
    it("should parse valid python requirements and ignore comments and flags", () => {
      const files: FileSignal[] = [
        {
          name: "requirements.txt",
          content: `
            Flask==2.0.1
            requests>=2.25.1
            numpy~=1.21.0
            pytest # This is a comment
            -e .
            --extra-index-url https://test.pypi.org/simple/
            pandas<1.3.0
            scipy>1.7.0
          `,
        },
      ];
      const queries = collectDependencyQueries(files);
      const expected = {
        Flask: "2.0.1",
        requests: "2.25.1",
        numpy: "1.21.0",
        pytest: undefined,
        pandas: "1.3.0",
        scipy: "1.7.0",
      };

      expect(queries).toHaveLength(6);
      queries.forEach((q) => {
        expect(q.ecosystem).toBe("PyPI");
        expect(q.version).toBe(expected[q.packageName as keyof typeof expected]);
      });
    });
  });

  describe("cargo.toml", () => {
    it("should parse rust dependencies with different quote styles and spacing", () => {
      const files: FileSignal[] = [
        {
          name: "Cargo.toml", // Mixed case should be matched as lower
          content: `
[dependencies]
serde = "1.0"
tokio= '1.14'
reqwest  =  "0.11"
          `,
        },
      ];
      const queries = collectDependencyQueries(files);
      const expected = {
        serde: "1.0",
        tokio: "1.14",
        reqwest: "0.11",
      };

      expect(queries).toHaveLength(3);
      queries.forEach((q) => {
        expect(q.ecosystem).toBe("crates.io");
        expect(q.version).toBe(expected[q.packageName as keyof typeof expected]);
      });
    });
  });

  describe("go.mod", () => {
    it("should parse go dependencies and correctly extract modules and versions", () => {
      const files: FileSignal[] = [
        {
          name: "go.mod",
          content: `
module github.com/user/project

go 1.16

require (
	github.com/gin-gonic/gin v1.7.4
	golang.org/x/crypto v0.0.0-20210921155107-089bfa567519
	gopkg.in/yaml.v2 2.4.0 // no v prefix theoretically
)
          `,
        },
      ];
      const queries = collectDependencyQueries(files);
      const expected = {
        go: "1.16",
        "github.com/gin-gonic/gin": "1.7.4",
        "golang.org/x/crypto": "0.0.0-20210921155107-089bfa567519",
        "gopkg.in/yaml.v2": "2.4.0",
      };

      expect(queries).toHaveLength(4);
      queries.forEach((q) => {
        expect(q.ecosystem).toBe("Go");
        expect(q.version).toBe(expected[q.packageName as keyof typeof expected]);
      });
    });
  });

  describe("composer.json", () => {
    it("should parse php dependencies and ignore 'php' core requirement", () => {
      const files: FileSignal[] = [
        {
          name: "composer.json",
          content: JSON.stringify({
            require: {
              php: "^8.0",
              "guzzlehttp/guzzle": "^7.0",
            },
            "require-dev": {
              "phpunit/phpunit": "^9.5",
            },
          }),
        },
      ];
      const queries = collectDependencyQueries(files);
      const expected = {
        "guzzlehttp/guzzle": "7.0",
        "phpunit/phpunit": "9.5",
      };

      expect(queries).toHaveLength(2);
      queries.forEach((q) => {
        expect(q.ecosystem).toBe("Packagist");
        expect(q.version).toBe(expected[q.packageName as keyof typeof expected]);
      });
    });

    it("should handle invalid JSON safely in composer.json", () => {
      const files: FileSignal[] = [
        {
          name: "composer.json",
          content: "{ invalid php json ",
        },
      ];
      const queries = collectDependencyQueries(files);
      expect(queries).toHaveLength(0);
    });
  });
});

const assert = require("assert");
const { sanitizeBranchName, constructTargetDir } = require("../lib");

describe("sanitizeBranchName", () => {
  const cases = [
    { input: "Feature XYZ", expected: "feature-xyz" },
    { input: "Fix/bug#123", expected: "fix-bug-123" },
    { input: "  Leading and trailing  ", expected: "leading-and-trailing" },
    { input: "Multiple   spaces", expected: "multiple-spaces" },
    { input: "Special!@#Chars", expected: "special-chars" },
    { input: "UPPERCASE", expected: "uppercase" },
    { input: "already-good", expected: "already-good" },
    { input: "----hyphens---", expected: "hyphens" },
    { input: "MiXeD CaSe 123", expected: "mixed-case-123" },
    { input: "foo_bar.baz", expected: "foo-bar-baz" },
    { input: "a--b", expected: "a-b" },
    { input: "-start-and-end-", expected: "start-and-end" },
    { input: "___", expected: "" },
    { input: "a b c d e", expected: "a-b-c-d-e" },
    { input: "a!b@c#d$e%f^g&h*i(j)k", expected: "a-b-c-d-e-f-g-h-i-j-k" },
  ];

  cases.forEach(({ input, expected }) => {
    it(`should sanitize "${input}" to "${expected}"`, () => {
      assert.strictEqual(sanitizeBranchName(input), expected);
    });
  });

  it('should trim leading and trailing spaces', () => {
    assert.strictEqual(sanitizeBranchName('   foo-bar   '), 'foo-bar');
    assert.strictEqual(sanitizeBranchName('   foo   '), 'foo');
    assert.strictEqual(sanitizeBranchName('\n\tfoo\t\n'), 'foo');
  });
});

describe("constructTargetDir", () => {
  it("should join base, project, and title correctly", () => {
    const base = "/tmp/worktrees";
    const project = "myproj";
    const title = "feature-x";
    const expected = "/tmp/worktrees/myproj-feature-x";
    const result = constructTargetDir({ worktreeBaseDir: base, projectName: project, title });
    // On Windows, path.join uses backslashes, so normalize for test
    const normalized = require("path").normalize(expected);
    assert.strictEqual(result, normalized);
  });

  it("should handle spaces in title", () => {
    const base = "/tmp/wt";
    const project = "foo";
    const title = "bar baz";
    const expected = "/tmp/wt/foo-bar baz";
    const result = constructTargetDir({ worktreeBaseDir: base, projectName: project, title });
    const normalized = require("path").normalize(expected);
    assert.strictEqual(result, normalized);
  });

  it("should trim spaces in projectName and title", () => {
    const base = "/tmp/trim";
    const project = "   myproj   ";
    const title = "   feature-x   ";
    const expected = "/tmp/trim/myproj-feature-x";
    const result = constructTargetDir({ worktreeBaseDir: base, projectName: project, title });
    const normalized = require("path").normalize(expected);
    assert.strictEqual(result, normalized);
  });

  it("should trim tabs and newlines in projectName and title", () => {
    const base = "/tmp/trim2";
    const project = "\n\tfoo\t\n";
    const title = "\n\tbar\t\n";
    const expected = "/tmp/trim2/foo-bar";
    const result = constructTargetDir({ worktreeBaseDir: base, projectName: project, title });
    const normalized = require("path").normalize(expected);
    assert.strictEqual(result, normalized);
  });
});

// Run tests if this file is executed directly
if (require.main === module) {
  require("mocha/bin/_mocha");
}
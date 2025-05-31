#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { parseArgs } = require("util");
const { sanitizeBranchName, constructTargetDir } = require("./lib");

// Parse command line arguments
const { values, positionals } = parseArgs({
  options: {
    list: {
      type: "boolean",
      short: "l",
    },
    prune: {
      type: "boolean",
      short: "p",
    },
    info: {
      type: "boolean",
      short: "i",
    },
    help: {
      type: "boolean",
      short: "h",
    },
    rm: {
      type: "boolean",
      short: "r",
    },
    remove: {
      type: "boolean",
    },
    force: {
      type: "boolean",
      short: "f",
    },
  },
  allowPositionals: true,
});

// Handle help
if (values.help) {
  console.log("Usage: quicktree <title> [options]");
  console.log("       quicktree --rm <identifier> [options]");
  console.log("");
  console.log("Options:");
  console.log("  -l, --list    List all worktrees");
  console.log("  -i, --info    Show available worktrees (compact)");
  console.log("  -p, --prune   Prune worktrees");
  console.log("  -r, --rm      Remove worktree by identifier");
  console.log("  --remove      Remove worktree by identifier (long form)");
  console.log("  -f, --force   Force removal (with --rm/--remove)");
  console.log("  -h, --help    Show help");
  process.exit(0);
}

// Handle list command
if (values.list) {
  try {
    execSync("git worktree list", { stdio: "inherit" });
  } catch (error) {
    console.error("Error listing worktrees:", error.message);
    process.exit(1);
  }
  process.exit(0);
}

// Handle info command
if (values.info) {
  try {
    // Check if we're in a git repository
    execSync("git rev-parse --git-dir", { stdio: "pipe" });

    const output = execSync("git worktree list", { encoding: "utf8" });
    const lines = output.trim().split("\n");

    // Only show output if there are worktrees
    if (lines.length > 0 && lines[0]) {
      const worktrees = lines.map((line) => {
        const parts = line.split(/\s+/);
        return path.basename(parts[0]);
      });
      console.log(`Available worktrees: ${worktrees.join(", ")}`);
    }
  } catch (error) {
    // Silently exit if not in git repo or no worktrees
  }
  process.exit(0);
}

// Handle prune command
if (values.prune) {
  try {
    execSync("git worktree prune", { stdio: "inherit" });
    console.log("Worktrees pruned successfully");
  } catch (error) {
    console.error("Error pruning worktrees:", error.message);
    process.exit(1);
  }
  process.exit(0);
}

// Handle remove command
if (values.rm || values.remove) {
  if (positionals.length === 0) {
    console.error("Error: Remove command requires an identifier");
    console.error("Usage: quicktree --rm <identifier> [--force]");
    process.exit(1);
  }
  
  if (positionals.length > 1) {
    console.error("Error: Only one identifier is supported for remove command");
    process.exit(1);
  }

  const identifier = positionals[0];

  // Check if we're in a git repository
  try {
    execSync("git rev-parse --git-dir", { stdio: "pipe" });
  } catch (error) {
    console.error("Error: Not in a git repository");
    process.exit(1);
  }

  // Get current directory name (project name)
  const currentDir = process.cwd();
  const projectName = path.basename(currentDir);

  // Get worktree directory from environment or use default
  const worktreeBaseDir =
    process.env.QUICKTREE_DIR || path.join(os.homedir(), "worktrees");

  const worktreePath = constructTargetDir({
    worktreeBaseDir,
    projectName,
    title: identifier,
  });

  // Check if worktree exists
  if (!fs.existsSync(worktreePath)) {
    console.error(`Error: Worktree '${identifier}' not found at ${worktreePath}`);
    process.exit(1);
  }

  // Remove worktree
  try {
    const forceFlag = values.force ? " --force" : "";
    const command = `git worktree remove "${worktreePath}"${forceFlag}`;
    execSync(command, { stdio: "inherit" });
    console.log(`Worktree '${identifier}' removed successfully`);
  } catch (error) {
    console.error("Error removing worktree:", error.message);
    process.exit(1);
  }
  process.exit(0);
}

// Handle worktree creation
if (positionals.length === 0) {
  console.error("Usage: quicktree <title> [options]");
  console.error("Try 'quicktree --help' for more information.");
  process.exit(1);
}

if (positionals.length > 1) {
  console.error("Error: Only one argument (the title) is supported.");
  process.exit(1);
}

const title = positionals[0];

// Check if we're in a git repository
try {
  execSync("git rev-parse --git-dir", { stdio: "pipe" });
} catch (error) {
  console.error("Error: Not in a git repository");
  process.exit(1);
}

// Get current directory name (project name)
const currentDir = process.cwd();
const projectName = path.basename(currentDir);

// Get worktree directory from environment or use default
const worktreeBaseDir =
  process.env.QUICKTREE_DIR || path.join(os.homedir(), "worktrees");

const worktreePath = constructTargetDir({
  worktreeBaseDir,
  projectName,
  title,
});

// Check if worktree already exists
if (fs.existsSync(worktreePath)) {
  console.log(`Found existing worktree: ${worktreePath}`);
  console.log(`cd ${worktreePath}`);
  process.exit(0);
}

// Create worktree
try {
  // Ensure base directory exists
  if (!fs.existsSync(worktreeBaseDir)) {
    fs.mkdirSync(worktreeBaseDir, { recursive: true });
  }

  // Create worktree with new branch (sanitized name)
  const branchName = sanitizeBranchName(title);
  const command = `git worktree add "${worktreePath}" -b "${branchName}"`;
  execSync(command, { stdio: "inherit" });

  console.log(`\nWorktree created at: ${worktreePath}`);
  console.log(`cd ${worktreePath}`);
} catch (error) {
  console.error("Error creating worktree:", error.message);
  process.exit(1);
}

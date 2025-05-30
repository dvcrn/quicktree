#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: quicktree <title>");
  process.exit(1);
}

const title = args[0];

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

// Construct worktree path
const worktreePath = path.join(worktreeBaseDir, `${projectName}-${title}`);

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

  // Create worktree with new branch
  const command = `git worktree add "${worktreePath}" -b "${title}"`;
  execSync(command, { stdio: "inherit" });

  console.log(`\nWorktree created at: ${worktreePath}`);
  console.log(`cd ${worktreePath}`);
} catch (error) {
  console.error("Error creating worktree:", error.message);
  process.exit(1);
}

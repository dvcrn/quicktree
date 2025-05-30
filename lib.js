// Utility functions for quicktree

const path = require("path");

/**
 * Sanitize a string to be a valid git branch name.
 * Replaces spaces and special characters with hyphens, lowercases, and trims.
 * @param {string} name
 * @returns {string}
 */
function sanitizeBranchName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Construct the target directory for a worktree.
 * @param {object} opts
 * @param {string} opts.worktreeBaseDir
 * @param {string} opts.projectName
 * @param {string} opts.title
 * @returns {string}
 */
function constructTargetDir({ worktreeBaseDir, projectName, title }) {
  return path.join(worktreeBaseDir, `${projectName.trim()}-${title.trim()}`);
}

module.exports = {
  sanitizeBranchName,
  constructTargetDir,
};
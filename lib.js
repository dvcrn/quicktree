// Utility functions for quicktree

const path = require("path");

/**
 * Sanitize a string by replacing spaces and special characters with hyphens.
 * Converts to lowercase, trims whitespace, and normalizes hyphens.
 * @param {string} str
 * @returns {string}
 */
function sanitizeString(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Sanitize a string to be a valid git branch name.
 * @param {string} name
 * @returns {string}
 */
function sanitizeBranchName(name) {
  return sanitizeString(name);
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
  const sanitizedProject = sanitizeString(projectName);
  const sanitizedTitle = sanitizeString(title);
  return path.join(worktreeBaseDir, `${sanitizedProject}-${sanitizedTitle}`);
}

module.exports = {
  sanitizeString,
  sanitizeBranchName,
  constructTargetDir,
};

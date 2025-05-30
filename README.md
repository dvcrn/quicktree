# quicktree

A CLI tool for easier Git worktree management. Create, list, and prune Git worktrees with automatic directory organization and branch sanitization.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.3.0-brightgreen)](https://nodejs.org/)

## Features

- **Automatic worktree creation** with sanitized branch names
- **Organized directory structure** (`~/worktrees/<project>-<title>`)
- **List and prune worktrees** with simple commands
- **Handles spaces and special characters** in titles
- **Customizable base directory** via `QUICKTREE_DIR` environment variable

## Installation

### From source

```bash
npm install -g .
# or
just install
```

### From npm (when published)

```bash
npm install -g quicktree
```

## Usage

### Create a worktree

```bash
quicktree "feature xyz"    # Creates ~/worktrees/myproject-feature-xyz
quicktree "Bug Fix #123"   # Creates ~/worktrees/myproject-bug-fix-123
```

Creates a new worktree at `~/worktrees/<project>-<title>` (or `$QUICKTREE_DIR/<project>-<title>` if set).

### Other commands

```bash
quicktree --list     # List all worktrees (short: -l)
quicktree --prune    # Prune worktrees (short: -p)
quicktree --help     # Show help (short: -h)
```

## Examples

```bash
# Create worktrees with automatic sanitization
quicktree "Feature XYZ"     # → branch: feature-xyz, dir: myproject-feature-xyz
quicktree "Fix/bug #123"    # → branch: fix-bug-123, dir: myproject-fix-bug-123
quicktree "New Feature!"    # → branch: new-feature, dir: myproject-new-feature

# List all worktrees
quicktree -l

# Clean up stale worktree references
quicktree -p
```

## Configuration

### Custom base directory

Set the `QUICKTREE_DIR` environment variable to change the base directory:

```bash
export QUICKTREE_DIR="/path/to/my/worktrees"
quicktree "feature"  # Creates /path/to/my/worktrees/myproject-feature
```

## Requirements

- Node.js 18.3.0 or higher
- Git repository (must be run from within a Git repository)

## License

MIT © [David Mohl](https://github.com/dvcrn)

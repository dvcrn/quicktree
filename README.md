# quicktree

CLI tool for easier Git worktree management.

## Installation

```bash
npm install -g .
# or
just install
```

## Usage

```bash
quicktree <title>
```

Creates a new worktree at `~/worktrees/<project>-<title>` (or `$QUICKTREE_DIR/<project>-<title>` if set).

### Additional Commands

```bash
quicktree --list     # List all worktrees (short: -l)
quicktree --prune    # Prune worktrees (short: -p)
quicktree --help     # Show help (short: -h)
```

## Features

- Automatically creates worktrees in a standard location
- Handles titles with spaces
- Sanitizes branch names (removes special characters)
- Detects if worktree already exists
- Checks if you're in a git repository

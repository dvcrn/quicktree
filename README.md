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

## Auto-cd Setup

To automatically change directory into the worktree, add this function to your shell config (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
quicktree() {
    local output=$(command quicktree "$@" 2>&1)
    local exit_code=$?
    
    echo "$output"
    
    if [ $exit_code -eq 0 ]; then
        local cd_command=$(echo "$output" | grep "^cd " | tail -n 1)
        if [ -n "$cd_command" ]; then
            eval "$cd_command"
        fi
    fi
    
    return $exit_code
}
```

## Features

- Automatically creates worktrees in a standard location
- Handles titles with spaces
- Sanitizes branch names (removes special characters)
- Detects if worktree already exists
- Checks if you're in a git repository
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

```bash
npm install -g quicktree-cli
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
quicktree --info     # Show available worktrees (compact) (short: -i)
quicktree --prune    # Prune worktrees (short: -p)
quicktree --rm <identifier>    # Remove worktree by identifier (short: -r)
quicktree --remove <identifier> # Remove worktree by identifier (long form)
quicktree --help     # Show help (short: -h)
```

## Examples

```bash
# Create worktrees with automatic sanitization
quicktree "Feature XYZ"     # → branch: feature-xyz, dir: myproject-feature-xyz
quicktree "Fix/bug #123"    # → branch: fix-bug-123, dir: myproject-fix-bug-123
quicktree "New Feature!"    # → branch: new-feature, dir: myproject-new-feature

# Remove worktrees by identifier
quicktree --rm feature-xyz  # Remove the Feature XYZ worktree
quicktree -r fix-bug-123    # Remove the Fix/bug #123 worktree (short form)
quicktree --remove new-feature  # Remove the New Feature! worktree (long form)

# Force remove worktrees (skips safety checks)
quicktree --rm feature-xyz --force

# List all worktrees
quicktree -l

# Show available worktrees (compact)
quicktree -i  # Output: Available worktrees: myproject-main, myproject-feature-xyz, myproject-bug-fix

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

### Auto-show worktrees on directory change

To automatically display available worktrees when entering a Git repository, add the following to your shell configuration:

#### Bash (`~/.bashrc`)

```bash
cd() {
    builtin cd "$@"
    if git rev-parse --git-dir >/dev/null 2>&1; then
        quicktree -i 2>/dev/null
    fi
}
```

#### Zsh (`~/.zshrc`)

```zsh
cd() {
    builtin cd "$@"
    if git rev-parse --git-dir >/dev/null 2>&1; then
        quicktree -i 2>/dev/null
    fi
}
```

#### Fish (`~/.config/fish/config.fish`)

```fish
function cd
    builtin cd $argv
    if git rev-parse --git-dir >/dev/null 2>&1
        quicktree -i 2>/dev/null
    end
end
```

### Auto-cd into worktree directory

To automatically change into the worktree directory after creation or when finding an existing worktree, add the following wrapper functions to your shell configuration:

#### Bash (`~/.bashrc`)

```bash
quicktree() {
    # Check if this is a worktree creation/lookup command (no flags starting with -)
    if [[ $# -eq 1 && ! "$1" =~ ^- ]]; then
        local output=$(command quicktree --path-only "$@")
        local exit_code=$?
        
        if [ $exit_code -eq 0 ] && [ -n "$output" ]; then
            # Extract the path from the last line of output
            local path=$(echo "$output" | tail -n 1)
            # Print the output (minus the path line) for user feedback
            echo "$output" | head -n -1
            # Change to the worktree directory
            if [ -d "$path" ]; then
                echo "Changing to: $path"
                builtin cd "$path"
            fi
        fi
    else
        # For other commands (flags), use normal quicktree
        command quicktree "$@"
    fi
}
```

#### Zsh (`~/.zshrc`)

```zsh
quicktree() {
    # Check if this is a worktree creation/lookup command (no flags starting with -)
    if [[ $# -eq 1 && ! "$1" =~ ^- ]]; then
        local output=$(command quicktree --path-only "$@")
        local exit_code=$?
        
        if [ $exit_code -eq 0 ] && [ -n "$output" ]; then
            # Extract the path from the last line of output
            local path=$(echo "$output" | tail -n 1)
            # Print the output (minus the path line) for user feedback
            echo "$output" | head -n -1
            # Change to the worktree directory
            if [ -d "$path" ]; then
                echo "Changing to: $path"
                builtin cd "$path"
            fi
        fi
    else
        # For other commands (flags), use normal quicktree
        command quicktree "$@"
    fi
}
```

#### Fish (`~/.config/fish/config.fish`)

```fish
function quicktree
    # Check if this is a worktree creation/lookup command (single argument, no flags)
    if test (count $argv) -eq 1 -a (string sub -s 1 -l 1 $argv[1]) != "-"
        set -l output (command quicktree --path-only $argv)
        set -l exit_code $status
        
        if test $exit_code -eq 0 -a -n "$output"
            # Extract the path from the last line of output
            set -l path (echo "$output" | tail -n 1)
            # Print the output (minus the path line) for user feedback
            echo "$output" | head -n -1
            # Change to the worktree directory
            if test -d "$path"
                echo "Changing to: $path"
                builtin cd "$path"
            end
        end
    else
        # For other commands (flags), use normal quicktree
        command quicktree $argv
    end
end
```

## Requirements

- Node.js 18.3.0 or higher
- Git repository (must be run from within a Git repository)

## License

MIT © [David Mohl](https://github.com/dvcrn)

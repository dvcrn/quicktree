# Install globally
install:
  npm install -g .

# Uninstall globally
uninstall:
  npm uninstall -g quicktree

# Run locally without installing
run title:
  node quicktree.js {{title}}

# Link for development
link:
  npm link

# Unlink after development
unlink:
  npm unlink

# Run tests
test:
  npx mocha __tests__/lib.test.js
#!/bin/bash

#chmod +x publish.sh
#./publish.sh

# Exit immediately if a command exits with a non-zero status
set -e

# Check for uncommitted changes (working tree or staged)
if git diff --quiet && git diff --cached --quiet; then
  echo "No changes detected. Skipping publish."
  exit 0
else
  echo "Changes detected. Proceeding with publish..."
fi

# Install dependencies (optional but good practice)
echo "Installing dependencies..."
npm install

# Bump the patch version (e.g., 0.1.3 → 0.1.4)
echo "Bumping patch version..."
npm version patch --no-git-tag-version

# Build the package
echo "Building the package..."
npm run build

# Publish the package to npm as public
echo "Publishing to npm..."
npm publish --access public

echo "✅ Publish completed successfully."
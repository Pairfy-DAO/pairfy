#!/bin/bash

set -e

cd "$(dirname "$0")/.."

PACKAGE_DIR="./common"
PACKAGE_NAME=$(node -p "require('$PACKAGE_DIR/package.json').name")
CURRENT_VERSION=$(node -p "require('$PACKAGE_DIR/package.json').version")

echo "🔍 Checking for changes in $PACKAGE_NAME since the last release..."

if git diff --quiet HEAD -- $PACKAGE_DIR; then
  echo "✅ No changes in $PACKAGE_DIR. Nothing will be published."
  exit 0
fi

if npm view $PACKAGE_NAME@$CURRENT_VERSION > /dev/null 2>&1; then
  echo "🟡 Version $CURRENT_VERSION is already published."

  cd $PACKAGE_DIR
  npm run pub
  echo "⏳ SLEEP ..."
  sleep 15

else
  echo "🚀 Publishing version $CURRENT_VERSION..."

  cd $PACKAGE_DIR
  npm run pub
  echo "⏳ SLEEP ..."
  sleep 15
fi

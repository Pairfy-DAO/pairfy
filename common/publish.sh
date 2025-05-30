#!/bin/bash

set -e

cd "$(dirname "$0")/.." 

PACKAGE_DIR="./common"
PACKAGE_NAME=$(node -p "require('$PACKAGE_DIR/package.json').name")
CURRENT_VERSION=$(node -p "require('$PACKAGE_DIR/package.json').version")

echo "🔍  Verifying changes $PACKAGE_NAME ..."

if git diff --quiet HEAD -- $PACKAGE_DIR; then
  echo "✅ No changes detected $PACKAGE_DIR."
  exit 0
fi


if npm view $PACKAGE_NAME@$CURRENT_VERSION > /dev/null 2>&1; then
  echo "🟡 The version $CURRENT_VERSION already published."

  cd $PACKAGE_DIR

  npm run pub

  echo "⏳ SLEEP ..."

  sleep 15

else
  echo "🚀 Publishing $CURRENT_VERSION..."

  cd $PACKAGE_DIR

  npm run pub
  
  echo "⏳ SLEEP ..."

  sleep 15

fi

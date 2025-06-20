#!/bin/bash

#chmod +x build.sh

aiken build
{
  echo "export const blueprint = "
  jq '.' "plutus.json"
} > "plutus.ts"

sudo cp plutus.ts ./builders

#!/bin/bash

set -euo pipefail

# Output directory
OUT_DIR="./keys"
mkdir -p "$OUT_DIR"

# File names
PRIVATE_KEY="$OUT_DIR/private.pem"
PUBLIC_KEY="$OUT_DIR/public.pem"
PRIVATE_KEY_B64="$OUT_DIR/private.pem.b64"
PUBLIC_KEY_B64="$OUT_DIR/public.pem.b64"
PRIVATE_KEY_FLAT="$OUT_DIR/private.pem.flat"
PUBLIC_KEY_FLAT="$OUT_DIR/public.pem.flat"

# Key size (default to 2048)
KEY_SIZE="${1:-2048}"

# Check if openssl is available
command -v openssl >/dev/null 2>&1 || {
  echo >&2 "❌ openssl is required but not installed. Aborting."
  exit 1
}

# Generate RSA private key
openssl genpkey -algorithm RSA -out "$PRIVATE_KEY" -pkeyopt rsa_keygen_bits:$KEY_SIZE
chmod 600 "$PRIVATE_KEY"

# Extract public key
openssl rsa -pubout -in "$PRIVATE_KEY" -out "$PUBLIC_KEY"

# Base64 encode (Linux/macOS compatible)
base64 "$PRIVATE_KEY" | tr -d '\n' > "$PRIVATE_KEY_B64"
base64 "$PUBLIC_KEY" | tr -d '\n' > "$PUBLIC_KEY_B64"

# Create flat .pem files (escaped \n for JSON)
awk '{printf "%s\\n", $0}' "$PRIVATE_KEY" > "$PRIVATE_KEY_FLAT"
awk '{printf "%s\\n", $0}' "$PUBLIC_KEY" > "$PUBLIC_KEY_FLAT"

# Display results
echo "✅ RSA key pair and additional formats generated:"
echo "🔐 Private key:      $PRIVATE_KEY"
echo "🔓 Public key:       $PUBLIC_KEY"
echo "📦 Base64 private:   $PRIVATE_KEY_B64"
echo "📦 Base64 public:    $PUBLIC_KEY_B64"
echo "📄 Flat private:     $PRIVATE_KEY_FLAT"
echo "📄 Flat public:      $PUBLIC_KEY_FLAT"

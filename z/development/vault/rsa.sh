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
PRIVATE_KEY_JSON="$OUT_DIR/private.json"
PUBLIC_KEY_JSON="$OUT_DIR/public.json"

# Key size (can be passed as first argument, defaults to 2048)
KEY_SIZE="${1:-2048}"

# Generate RSA private key
openssl genpkey -algorithm RSA -out "$PRIVATE_KEY" -pkeyopt rsa_keygen_bits:$KEY_SIZE

# Restrict permissions on the private key
chmod 600 "$PRIVATE_KEY"

# Extract public key in PEM format
openssl rsa -pubout -in "$PRIVATE_KEY" -out "$PUBLIC_KEY"

# Base64 encode (compatible with Linux and macOS)
base64 "$PRIVATE_KEY" | tr -d '\n' > "$PRIVATE_KEY_B64"
base64 "$PUBLIC_KEY" | tr -d '\n' > "$PUBLIC_KEY_B64"

# Function to escape newlines for JSON
escape_newlines() {
    sed ':a;N;$!ba;s/\n/\\n/g'
}

# Create JSON files with escaped newlines
echo -n "{\"key\":\"$(cat "$PRIVATE_KEY" | escape_newlines)\"}" > "$PRIVATE_KEY_JSON"
echo -n "{\"key\":\"$(cat "$PUBLIC_KEY" | escape_newlines)\"}" > "$PUBLIC_KEY_JSON"

# Display results
echo "✅ RSA key pair and additional formats generated:"
echo "🔐 Private key:      $PRIVATE_KEY"
echo "🔓 Public key:       $PUBLIC_KEY"
echo "📦 Base64 private:   $PRIVATE_KEY_B64"
echo "📦 Base64 public:    $PUBLIC_KEY_B64"
echo "🧾 JSON private:     $PRIVATE_KEY_JSON"
echo "🧾 JSON public:      $PUBLIC_KEY_JSON"

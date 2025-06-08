#!/bin/bash

# Output directory
OUT_DIR="./keys"
mkdir -p "$OUT_DIR"

# File names
PRIVATE_KEY="$OUT_DIR/private.pem"
PUBLIC_KEY="$OUT_DIR/public.pem"
PRIVATE_KEY_B64="$OUT_DIR/private.pem.b64"
PUBLIC_KEY_B64="$OUT_DIR/public.pem.b64"

# Generate RSA private key (2048 bits)
openssl genpkey -algorithm RSA -out "$PRIVATE_KEY" -pkeyopt rsa_keygen_bits:2048

# Extract public key in PEM format
openssl rsa -pubout -in "$PRIVATE_KEY" -out "$PUBLIC_KEY"

# Base64 encode both keys
base64 -w 0 "$PRIVATE_KEY" > "$PRIVATE_KEY_B64"
base64 -w 0 "$PUBLIC_KEY" > "$PUBLIC_KEY_B64"

# Display results
echo "✅ RSA key pair and base64 versions generated:"
echo "🔐 Private key:      $PRIVATE_KEY"
echo "🔓 Public key:       $PUBLIC_KEY"
echo "📦 Base64 private:   $PRIVATE_KEY_B64"
echo "📦 Base64 public:    $PUBLIC_KEY_B64"

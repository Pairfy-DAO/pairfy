
kubectl cp seller-policy.hcl vault-0:/tmp/seller-policy.hcl

kubectl exec -it vault-0 -- vault policy write seller-policy /tmp/seller-policy.hcl

kubectl exec -i vault-0 -- vault write auth/jwt/role/seller-role - <<EOF
{
  "role_type": "jwt",
  "user_claim": "id",
  "bound_audiences": ["vault"],
  "bound_claims": {
    "role": "SELLER"
  },
  "policies": ["seller-policy"],
  "ttl": "5m"
}
EOF

kubectl exec -it vault-0 -- vault read auth/jwt/role/seller-role

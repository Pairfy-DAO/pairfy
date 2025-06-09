kubectl exec -i vault-0 -- vault policy delete seller-policy

kubectl cp seller-policy.hcl vault-0:/tmp/seller-policy.hcl

kubectl exec -it vault-0 -- vault policy write seller-policy /tmp/seller-policy.hcl

kubectl exec -it vault-0 -- vault write auth/jwt/role/seller-role \
  role_type="jwt" \
  user_claim="id" \
  bound_audiences="vault" \
  bound_claims.role="SELLER" \
  policies="seller-policy" \
  ttl="5m"


kubectl exec -it vault-0 -- vault read auth/jwt/role/seller-role

kubectl exec -it vault-0 -- vault auth list -detailed

kubectl exec -it vault-0 -- vault token lookup <test-token>

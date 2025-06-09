
path "transit/keys/seller-{{identity.entity.aliases.auth_jwt_.metadata.id}}" {
  capabilities = ["create"]
  allowed_parameters = {
    type = ["rsa-2048"]
  }
}


path "transit/decrypt/seller-{{identity.entity.aliases.auth_jwt_.metadata.id}}" {
  capabilities = ["update"]
}


path "transit/keys/seller-{{identity.entity.aliases.auth_jwt_.metadata.id}}" {
  capabilities = ["read"]
}

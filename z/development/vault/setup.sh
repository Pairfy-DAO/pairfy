helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update

helm install vault hashicorp/vault -f values.yaml

#helm uninstall vault
#kubectl delete pvc -l app.kubernetes.io/name=vault



kubectl exec -it vault-0 -- vault operator init

kubectl exec -it vault-0 -- vault operator unseal <key-1>
kubectl exec -it vault-0 -- vault operator unseal <key-2>
kubectl exec -it vault-0 -- vault operator unseal <key-3>

kubectl exec -it vault-0 -- vault login

kubectl exec -it vault-0 -- vault secrets enable transit
kubectl exec -it vault-0 -- vault auth enable jwt

kubectl exec -it vault-0 -- vault operator raft list-peers
kubectl exec -it vault-0 -- vault operator raft join http://vault-1.vault-internal:8200
kubectl exec -it vault-0 -- vault operator raft join http://vault-2.vault-internal:8200


kubectl exec vault-1 -- vault operator unseal <key1>
kubectl exec vault-1 -- vault operator unseal <key2>
kubectl exec vault-1 -- vault operator unseal <key3>

kubectl exec vault-2 -- vault operator unseal <key1>
kubectl exec vault-2 -- vault operator unseal <key2>
kubectl exec vault-2 -- vault operator unseal <key3>




kubectl cp jwt-config.json vault-0:/tmp/jwt-config.json
kubectl exec -it vault-0 -- sh -c 'vault write auth/jwt/config @/tmp/jwt-config.json'








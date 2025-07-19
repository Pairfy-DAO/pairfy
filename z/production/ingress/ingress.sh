helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

helm repo update

helm install nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true

kubectl --namespace default get services -o wide -w nginx-ingress-ingress-nginx-controller
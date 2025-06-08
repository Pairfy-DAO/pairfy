helm repo add nats-nui https://nats-nui.github.io/k8s/helm/charts
helm install nats-ui nats-nui/nui


helm uninstall nats-ui nats-nui/nui
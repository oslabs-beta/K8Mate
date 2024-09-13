## Installation guide for Prometheus and Grafana
Before running K8 Mate, please ensure you have Prometheus and Grafana installed. Below gives you a simple breakdown of how to do this!

## Install Helm
- On Linux run `sudo apt-get install helm`
- On Windows run `choco install Kubernetes-helm`
- On macOS run `brew install helm`

## Add the Helm chart for Prometheus and Grafana
1. Run `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`
2. Update `helm repo update`

## Install Prometheus Helm Chart on K8s Cluster
Run `helm install my-kube-prometheus-stack prometheus-community/kube-prometheus-stack`

After this command, run `kubectl get services` to view all your cluster services. The new services installed should be:

- alertmanager-operated
- my-kube-prometheus-stack-alertmanager
- my-kube-prometheus-stack-grafana
- my-kube-prometheus-stack-kube-state-metrics                                                                                    
- my-kube-prometheus-stack-operator                              
- my-kube-prometheus-stack-prometheus                 
- my-kube-prometheus-stack-prometheus-node-exporter
- prometheus-operated

## Expose Prometheus and Grafana using NodePort Services 
1. Run `kubectl expose service my-kube-prometheus-stack-prometheus --type=NodePort --target-port=9090 --name=prometheus-node-port-service`
2. Run `kubectl expose service my-kube-prometheus-stack-grafana --type=NodePort --target-port=3000 --name=grafana-node-port-service`

## Forward ports
1. Forward the Grafana service to be accessible on `localhost:3000` by running `kubectl port-forward svc/grafana-node-port-service 3000:80`
2. Forward the Prometheus service to be accessible on `localhost:9090` by running `kubectl port-forward svc/prometheus-node-port-service 9090:9090`

Prometheus and Grafana are all setup on your cluster now! Follow up in our original README to continue our app setup.
#!/bin/bash

# Kubernetes Cluster Prerequisites Deployment Script
# This script deploys all required cluster prerequisites

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Deploying Kubernetes cluster prerequisites..."
echo "================================================="

# Function to deploy component
deploy_component() {
    local name=$1
    local path=$2

    echo
    echo -e "${YELLOW}📦 Deploying $name...${NC}"

    if kubectl apply -k "$path"; then
        echo -e "${GREEN}✅ $name deployed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to deploy $name${NC}"
        return 1
    fi
}

# Function to wait for pods
wait_for_pods() {
    local namespace=$1
    local label=$2
    local component=$3
    local timeout=${4:-300}

    echo -n "⏳ Waiting for $component pods to be ready... "

    if kubectl wait --for=condition=ready pod -l "$label" -n "$namespace" --timeout="${timeout}s" >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        return 0
    else
        echo -e "${RED}❌ (timeout after ${timeout}s)${NC}"
        return 1
    fi
}

# Track deployments
deployments=0
failures=0

echo "This script will deploy the following components:"
echo "1. NGINX Ingress Controller"
echo "2. cert-manager"
echo "3. metrics-server"
echo "4. Storage Classes (generic)"
echo
read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Deploy NGINX Ingress Controller
if deploy_component "NGINX Ingress Controller" "k8s/cluster-setup/ingress-controller/"; then
    ((deployments++))
    wait_for_pods "ingress-nginx" "app.kubernetes.io/name=ingress-nginx" "NGINX Ingress Controller" 180
fi

# Deploy cert-manager
if deploy_component "cert-manager" "k8s/cluster-setup/cert-manager/"; then
    ((deployments++))
    # Wait a bit for CRDs to be ready
    sleep 10
    wait_for_pods "cert-manager" "app.kubernetes.io/name=cert-manager" "cert-manager" 180
fi

# Deploy metrics-server
if deploy_component "metrics-server" "k8s/cluster-setup/metrics-server/"; then
    ((deployments++))
    wait_for_pods "kube-system" "k8s-app=metrics-server" "metrics-server" 120
fi

# Deploy storage classes (generic ones)
if deploy_component "Storage Classes" "k8s/cluster-setup/storage-classes/"; then
    ((deployments++))
fi

echo
echo "================================================="
echo -e "${GREEN}✅ Deployment Summary:${NC}"
echo "Successfully deployed: $deployments/4 components"

if [ $deployments -eq 4 ]; then
    echo
    echo -e "${GREEN}🎉 All prerequisites deployed successfully!${NC}"
    echo
    echo "Next steps:"
    echo "1. Run validation: ./k8s/cluster-setup/validate-setup.sh"
    echo "2. For cloud-specific storage classes, see README.md"
    echo "3. Update cert-manager email in cluster-issuers.yaml"
    echo "4. Deploy your application when ready"
else
    echo
    echo -e "${RED}⚠️  Some deployments failed. Check the logs above.${NC}"
    echo
    echo "Troubleshooting:"
    echo "1. Check pod status: kubectl get pods -A"
    echo "2. Check pod logs: kubectl logs -n <namespace> <pod-name>"
    echo "3. Verify cluster permissions"
    echo "4. Run validation script: ./k8s/cluster-setup/validate-setup.sh"
    exit 1
fi

echo
echo "Useful commands:"
echo "# Check all pods: kubectl get pods -A"
echo "# Check services: kubectl get svc -A"
echo "# Check storage classes: kubectl get storageclass"
echo "# Run validation: ./k8s/cluster-setup/validate-setup.sh"

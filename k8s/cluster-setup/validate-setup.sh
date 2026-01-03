#!/bin/bash

# Kubernetes Cluster Prerequisites Validation Script
# This script checks if all required components are properly deployed

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Validating Kubernetes cluster prerequisites..."
echo "=================================================="

# Function to check pod status
check_pods() {
    local namespace=$1
    local label=$2
    local component=$3

    echo -n "📦 Checking $component pods in $namespace... "

    local pods
    pods=$(kubectl get pods -n "$namespace" -l "$label" --no-headers 2>/dev/null | wc -l)

    if [ "$pods" -gt 0 ]; then
        local ready_pods
        ready_pods=$(kubectl get pods -n "$namespace" -l "$label" --no-headers 2>/dev/null | grep -c "Running\|Completed")

        if [ "$ready_pods" -eq "$pods" ]; then
            echo -e "${GREEN}✅ ($ready_pods/$pods ready)${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  ($ready_pods/$pods ready)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ (0 pods found)${NC}"
        return 1
    fi
}

# Function to check resource existence
check_resource() {
    local resource_type=$1
    local name=$2
    local component=$3

    echo -n "🔍 Checking $component $resource_type... "

    if kubectl get "$resource_type" "$name" --no-headers >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        return 0
    else
        echo -e "${RED}❌${NC}"
        return 1
    fi
}

# Function to check cluster resource
check_cluster_resource() {
    local resource_type=$1
    local name=$2
    local component=$3

    echo -n "🔍 Checking $component cluster $resource_type... "

    if kubectl get "$resource_type" "$name" --no-headers >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        return 0
    else
        echo -e "${RED}❌${NC}"
        return 1
    fi
}

# Function to check storage classes
check_storage_class() {
    echo -n "💾 Checking default StorageClass... "

    local default_sc
    default_sc=$(kubectl get storageclass --no-headers 2>/dev/null | grep -c "(default)")

    if [ "$default_sc" -gt 0 ]; then
        local sc_name
        sc_name=$(kubectl get storageclass --no-headers 2>/dev/null | grep "(default)" | awk '{print $1}')
        echo -e "${GREEN}✅ ($sc_name)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  (no default set)${NC}"
        echo "   Available StorageClasses:"
        kubectl get storageclass --no-headers 2>/dev/null | while read -r line; do
            echo "   - $line"
        done
        return 1
    fi
}

# Track failures
failures=0

echo
echo "1. NGINX Ingress Controller"
echo "----------------------------"
if check_pods "ingress-nginx" "app.kubernetes.io/name=ingress-nginx" "NGINX Ingress Controller"; then
    # Check if service has external IP
    echo -n "🌐 Checking Ingress Controller external IP... "
    external_ip=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -n "$external_ip" ]; then
        echo -e "${GREEN}✅ ($external_ip)${NC}"
    else
        echo -e "${YELLOW}⚠️  (pending)${NC}"
    fi
else
    ((failures++))
fi

echo
echo "2. cert-manager"
echo "---------------"
if check_pods "cert-manager" "app.kubernetes.io/name=cert-manager" "cert-manager"; then
    check_cluster_resource "clusterissuer" "letsencrypt-staging" "Let's Encrypt Staging Issuer"
    check_cluster_resource "clusterissuer" "letsencrypt-prod" "Let's Encrypt Production Issuer"
else
    ((failures++))
fi

echo
echo "3. metrics-server"
echo "------------------"
if check_pods "kube-system" "k8s-app=metrics-server" "metrics-server"; then
    echo -n "📊 Testing metrics API... "
    if kubectl top nodes --no-headers >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
        ((failures++))
    fi
else
    ((failures++))
fi

echo
echo "4. Storage Classes"
echo "------------------"
if ! check_storage_class; then
    ((failures++))
fi

echo
echo "=================================================="

if [ $failures -eq 0 ]; then
    echo -e "${GREEN}🎉 All prerequisites are properly deployed!${NC}"
    echo
    echo "Next steps:"
    echo "1. Deploy your application: kubectl apply -k k8s/overlays/staging/"
    echo "2. Deploy monitoring: kubectl apply -k k8s/monitoring/"
    echo "3. Set up CI/CD pipelines for automated deployments"
    exit 0
else
    echo -e "${RED}❌ $failures prerequisite(s) need attention.${NC}"
    echo
    echo "Troubleshooting tips:"
    echo "1. Check pod logs: kubectl logs -n <namespace> <pod-name>"
    echo "2. Verify cluster permissions and RBAC"
    echo "3. Ensure Kubernetes version compatibility (1.24+ recommended)"
    echo "4. Check the component-specific documentation in README.md"
    exit 1
fi

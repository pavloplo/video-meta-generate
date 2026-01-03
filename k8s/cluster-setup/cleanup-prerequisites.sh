#!/bin/bash

# Kubernetes Cluster Prerequisites Cleanup Script
# This script removes all deployed cluster prerequisites

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🧹 Cleaning up Kubernetes cluster prerequisites..."
echo "==================================================="

echo "This script will remove the following components:"
echo "1. NGINX Ingress Controller"
echo "2. cert-manager"
echo "3. metrics-server"
echo "4. Storage Classes"
echo
echo -e "${RED}⚠️  WARNING: This will permanently delete all prerequisites!${NC}"
echo -e "${RED}⚠️  Make sure you have backups and understand the consequences!${NC}"
echo
read -p "Are you sure you want to continue? (yes/N): "
if [[ ! $REPLY =~ ^yes$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo
echo -e "${YELLOW}🗑️  Removing Storage Classes...${NC}"
kubectl delete -k k8s/cluster-setup/storage-classes/ --ignore-not-found=true

echo -e "${YELLOW}🗑️  Removing metrics-server...${NC}"
kubectl delete -k k8s/cluster-setup/metrics-server/ --ignore-not-found=true

echo -e "${YELLOW}🗑️  Removing cert-manager...${NC}"
kubectl delete -k k8s/cluster-setup/cert-manager/ --ignore-not-found=true

echo -e "${YELLOW}🗑️  Removing NGINX Ingress Controller...${NC}"
kubectl delete -k k8s/cluster-setup/ingress-controller/ --ignore-not-found=true

# Wait a bit for resources to be deleted
echo -e "${YELLOW}⏳ Waiting for resources to be cleaned up...${NC}"
sleep 10

echo
echo -e "${GREEN}✅ Cleanup completed!${NC}"
echo
echo "Verification commands:"
echo "# Check remaining pods: kubectl get pods -A | grep -E '(ingress-nginx|cert-manager|metrics-server)'"
echo "# Check remaining services: kubectl get svc -A | grep -E '(ingress-nginx|cert-manager)'"
echo "# Check storage classes: kubectl get storageclass"

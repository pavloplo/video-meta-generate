# Kubernetes Deployment Plan

## Overview

This document outlines the implementation plan for deploying the Video Meta Generate application to Kubernetes clusters for **staging** and **production** environments, including monitoring (Grafana) and logging (Loki).

## Current State

### Existing Services (from docker-compose.yml)
| Service | Image | Purpose |
|---------|-------|---------|
| `app` | Next.js application | Main application |
| `postgres` | postgres:16-alpine | Database (local only) |
| `minio` | minio/minio:latest | S3-compatible storage (local only) |

### Current Deployment Method
- **Local**: Docker Compose with profiles
- **Staging**: Self-hosted runner → Docker Compose on host
- **Production**: Placeholder (not implemented)

## Target Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Kubernetes Cluster                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Application Namespace                         │    │
│  │                                                                   │    │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │    │
│  │   │    App      │    │  PostgreSQL │    │    MinIO    │         │    │
│  │   │  (HPA 2-10) │    │   (Primary) │    │  (Optional) │         │    │
│  │   └─────────────┘    └─────────────┘    └─────────────┘         │    │
│  │                                                                   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                   Monitoring Namespace                           │    │
│  │                                                                   │    │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │    │
│  │   │   Grafana   │    │    Loki     │    │  Promtail   │         │    │
│  │   │             │    │   (Logs)    │    │  (Collector)│         │    │
│  │   └─────────────┘    └─────────────┘    └─────────────┘         │    │
│  │                                                                   │    │
│  │   ┌─────────────┐                                                │    │
│  │   │ Prometheus  │ (Optional - for metrics)                      │    │
│  │   └─────────────┘                                                │    │
│  │                                                                   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      Ingress Controller                          │    │
│  │   ┌─────────────────────────────────────────────────────────┐   │    │
│  │   │  NGINX Ingress / Traefik / Cloud Load Balancer          │   │    │
│  │   └─────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Monitoring & Logging Stack (Free/Open Source)

| Component | Purpose | License |
|-----------|---------|---------|
| **Grafana** | Visualization & dashboards | AGPLv3 (free) |
| **Loki** | Log aggregation | AGPLv3 (free) |
| **Promtail** | Log collection agent | AGPLv3 (free) |
| **Prometheus** | Metrics collection (optional) | Apache 2.0 |

---

## Implementation Phases

### Phase 1: Kubernetes Manifests Structure
**Estimated Time: 2-3 hours**

Create the Kubernetes configuration directory structure:

```
k8s/
├── base/                          # Base configurations (Kustomize)
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── app/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── hpa.yaml
│   │   ├── configmap.yaml
│   │   └── secret.yaml           # Template only (values from CI/CD)
│   ├── postgres/
│   │   ├── statefulset.yaml
│   │   ├── service.yaml
│   │   ├── pvc.yaml
│   │   └── secret.yaml
│   └── minio/
│       ├── statefulset.yaml
│       ├── service.yaml
│       ├── pvc.yaml
│       └── secret.yaml
│
├── overlays/
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   ├── patches/
│   │   │   ├── app-resources.yaml
│   │   │   ├── hpa-scaling.yaml
│   │   │   └── ingress.yaml
│   │   └── secrets/              # Sealed/external secrets
│   │       └── .gitkeep
│   │
│   └── production/
│       ├── kustomization.yaml
│       ├── namespace.yaml
│       ├── patches/
│       │   ├── app-resources.yaml
│       │   ├── hpa-scaling.yaml
│       │   └── ingress.yaml
│       └── secrets/
│           └── .gitkeep
│
└── monitoring/
    ├── namespace.yaml
    ├── grafana/
    │   ├── deployment.yaml
    │   ├── service.yaml
    │   ├── configmap.yaml        # Datasources config
    │   ├── pvc.yaml
    │   └── ingress.yaml
    ├── loki/
    │   ├── statefulset.yaml
    │   ├── service.yaml
    │   ├── configmap.yaml
    │   └── pvc.yaml
    └── promtail/
        ├── daemonset.yaml
        ├── configmap.yaml
        └── rbac.yaml
```

#### Tasks:
- [ ] Create base namespace configuration
- [ ] Create base app deployment, service, HPA
- [ ] Create base PostgreSQL StatefulSet
- [ ] Create base MinIO StatefulSet (optional for cloud)
- [ ] Create Kustomize overlays for staging
- [ ] Create Kustomize overlays for production

---

### Phase 2: Application Kubernetes Manifests
**Estimated Time: 3-4 hours**

#### 2.1 App Deployment (`k8s/base/app/deployment.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: video-meta-app
  labels:
    app: video-meta-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: video-meta-app
  template:
    metadata:
      labels:
        app: video-meta-app
    spec:
      containers:
        - name: app
          image: ghcr.io/video-meta-generate:latest
          ports:
            - containerPort: 3000
          envFrom:
            - configMapRef:
                name: app-config
            - secretRef:
                name: app-secrets
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

#### 2.2 Horizontal Pod Autoscaler (`k8s/base/app/hpa.yaml`)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: video-meta-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: video-meta-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

#### 2.3 Environment-Specific Scaling Patches

**Staging** (`k8s/overlays/staging/patches/hpa-scaling.yaml`):
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: video-meta-app-hpa
spec:
  minReplicas: 1
  maxReplicas: 3
```

**Production** (`k8s/overlays/production/patches/hpa-scaling.yaml`):
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: video-meta-app-hpa
spec:
  minReplicas: 3
  maxReplicas: 15
```

#### Tasks:
- [ ] Create app Deployment manifest
- [ ] Create app Service manifest
- [ ] Create HPA configuration
- [ ] Create ConfigMap template
- [ ] Create Secret template (for reference)
- [ ] Create staging resource patches
- [ ] Create production resource patches

---

### Phase 3: Database Configuration
**Estimated Time: 2-3 hours**

#### 3.1 PostgreSQL StatefulSet

For staging/production, you have two options:

**Option A: Managed Database (Recommended for Production)**
- Use cloud-managed PostgreSQL (AWS RDS, GCP Cloud SQL, Azure Database)
- Skip deploying PostgreSQL in K8s
- Pass connection string via secrets

**Option B: In-Cluster PostgreSQL (For staging or cost savings)**

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          envFrom:
            - secretRef:
                name: postgres-secrets
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "1Gi"
              cpu: "500m"
  volumeClaimTemplates:
    - metadata:
        name: postgres-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

#### Tasks:
- [ ] Decide on managed vs in-cluster database per environment
- [ ] Create PostgreSQL StatefulSet (if in-cluster)
- [ ] Create PostgreSQL Service
- [ ] Create PersistentVolumeClaim configuration
- [ ] Configure database secrets management

---

### Phase 4: Object Storage (MinIO)
**Estimated Time: 1-2 hours**

#### Options:
1. **Cloud Storage (Recommended)**: Use AWS S3, GCP GCS, or Azure Blob
2. **In-Cluster MinIO**: Deploy MinIO in K8s

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: minio
spec:
  serviceName: minio
  replicas: 1
  selector:
    matchLabels:
      app: minio
  template:
    metadata:
      labels:
        app: minio
    spec:
      containers:
        - name: minio
          image: minio/minio:latest
          args:
            - server
            - /data
            - --console-address
            - ":9001"
          ports:
            - containerPort: 9000
              name: api
            - containerPort: 9001
              name: console
          envFrom:
            - secretRef:
                name: minio-secrets
          volumeMounts:
            - name: minio-data
              mountPath: /data
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
  volumeClaimTemplates:
    - metadata:
        name: minio-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 20Gi
```

#### Tasks:
- [ ] Decide on cloud storage vs in-cluster MinIO per environment
- [ ] Create MinIO StatefulSet (if in-cluster)
- [ ] Create MinIO Service
- [ ] Configure storage secrets

---

### Phase 5: Monitoring Stack (Grafana + Loki)
**Estimated Time: 4-5 hours**

#### 5.1 Monitoring Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
  labels:
    name: monitoring
```

#### 5.2 Loki Configuration

```yaml
# k8s/monitoring/loki/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: loki-config
  namespace: monitoring
data:
  loki.yaml: |
    auth_enabled: false
    
    server:
      http_listen_port: 3100
      grpc_listen_port: 9096
    
    common:
      instance_addr: 127.0.0.1
      path_prefix: /loki
      storage:
        filesystem:
          chunks_directory: /loki/chunks
          rules_directory: /loki/rules
      replication_factor: 1
      ring:
        kvstore:
          store: inmemory
    
    query_range:
      results_cache:
        cache:
          embedded_cache:
            enabled: true
            max_size_mb: 100
    
    schema_config:
      configs:
        - from: 2020-10-24
          store: tsdb
          object_store: filesystem
          schema: v13
          index:
            prefix: index_
            period: 24h
    
    ruler:
      alertmanager_url: http://localhost:9093
    
    limits_config:
      retention_period: 720h  # 30 days
```

#### 5.3 Promtail DaemonSet (Log Collector)

```yaml
# k8s/monitoring/promtail/daemonset.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: promtail
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: promtail
  template:
    metadata:
      labels:
        app: promtail
    spec:
      serviceAccountName: promtail
      containers:
        - name: promtail
          image: grafana/promtail:2.9.0
          args:
            - -config.file=/etc/promtail/promtail.yaml
          volumeMounts:
            - name: config
              mountPath: /etc/promtail
            - name: varlog
              mountPath: /var/log
              readOnly: true
            - name: containers
              mountPath: /var/lib/docker/containers
              readOnly: true
          resources:
            requests:
              memory: "64Mi"
              cpu: "50m"
            limits:
              memory: "128Mi"
              cpu: "100m"
      volumes:
        - name: config
          configMap:
            name: promtail-config
        - name: varlog
          hostPath:
            path: /var/log
        - name: containers
          hostPath:
            path: /var/lib/docker/containers
```

#### 5.4 Grafana Deployment

```yaml
# k8s/monitoring/grafana/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
        - name: grafana
          image: grafana/grafana:10.2.0
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: grafana-secrets
          volumeMounts:
            - name: grafana-storage
              mountPath: /var/lib/grafana
            - name: grafana-datasources
              mountPath: /etc/grafana/provisioning/datasources
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
      volumes:
        - name: grafana-storage
          persistentVolumeClaim:
            claimName: grafana-pvc
        - name: grafana-datasources
          configMap:
            name: grafana-datasources
```

#### 5.5 Grafana Datasources ConfigMap

```yaml
# k8s/monitoring/grafana/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: monitoring
data:
  datasources.yaml: |
    apiVersion: 1
    datasources:
      - name: Loki
        type: loki
        access: proxy
        url: http://loki:3100
        isDefault: true
        editable: false
```

#### Tasks:
- [ ] Create monitoring namespace
- [ ] Create Loki StatefulSet and ConfigMap
- [ ] Create Promtail DaemonSet, ConfigMap, and RBAC
- [ ] Create Grafana Deployment and Service
- [ ] Configure Grafana datasources (auto-provision Loki)
- [ ] Create Grafana Ingress for dashboard access
- [ ] Set up default dashboards for application logs

---

### Phase 6: Ingress & TLS Configuration
**Estimated Time: 2-3 hours**

#### 6.1 Application Ingress

```yaml
# k8s/overlays/staging/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: video-meta-app
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts:
        - staging.video-meta.example.com
      secretName: staging-tls
  rules:
    - host: staging.video-meta.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: video-meta-app
                port:
                  number: 3000
```

#### Tasks:
- [ ] Configure Ingress Controller (NGINX/Traefik)
- [ ] Set up cert-manager for TLS certificates
- [ ] Create staging Ingress resource
- [ ] Create production Ingress resource
- [ ] Create Grafana Ingress resource

---

### Phase 7: Secrets Management
**Estimated Time: 2-3 hours**

#### Options:
1. **Kubernetes Secrets** (basic, encrypted at rest)
2. **Sealed Secrets** (Bitnami - GitOps friendly)
3. **External Secrets Operator** (integrates with AWS Secrets Manager, etc.)
4. **SOPS** (Mozilla - encrypts secrets in git)

#### Recommended: External Secrets with GitHub Actions

```yaml
# Example: Using GitHub secrets in CI/CD
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  DATABASE_URL: ${DATABASE_URL}
  DIRECT_URL: ${DIRECT_URL}
  SESSION_COOKIE_NAME: ${SESSION_COOKIE_NAME}
  SESSION_TTL_DAYS: "${SESSION_TTL_DAYS}"
```

#### Tasks:
- [ ] Choose secrets management approach
- [ ] Set up secret encryption/management tool
- [ ] Create secret templates for each environment
- [ ] Document secrets required for deployment

---

### Phase 8: GitHub Actions Workflows
**Estimated Time: 3-4 hours**

#### 8.1 Updated Staging Workflow

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging (K8s)

on:
  workflow_dispatch:
    inputs:
      ref:
        description: "Git ref (branch/tag) to deploy"
        required: true
        default: "dev"

permissions:
  contents: read
  packages: write

concurrency:
  group: deploy-staging
  cancel-in-progress: true

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.ref }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch
            type=sha,prefix=staging-

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          build-args: |
            DATABASE_URL=${{ secrets.STAGING_DATABASE_URL }}
            DIRECT_URL=${{ secrets.STAGING_DIRECT_URL }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.ref }}

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubeconfig
        run: |
          mkdir -p ~/.kube
          echo "${{ secrets.STAGING_KUBECONFIG }}" | base64 -d > ~/.kube/config

      - name: Deploy with Kustomize
        run: |
          cd k8s/overlays/staging
          
          # Update image tag
          kustomize edit set image ghcr.io/${{ github.repository }}=${{ needs.build-and-push.outputs.image_tag }}
          
          # Apply secrets
          kubectl create secret generic app-secrets \
            --from-literal=DATABASE_URL=${{ secrets.STAGING_DATABASE_URL }} \
            --from-literal=DIRECT_URL=${{ secrets.STAGING_DIRECT_URL }} \
            --from-literal=SESSION_COOKIE_NAME=${{ secrets.SESSION_COOKIE_NAME }} \
            --from-literal=SESSION_TTL_DAYS=${{ secrets.SESSION_TTL_DAYS }} \
            --dry-run=client -o yaml | kubectl apply -f -
          
          # Apply manifests
          kustomize build . | kubectl apply -f -
          
          # Wait for rollout
          kubectl rollout status deployment/video-meta-app -n staging --timeout=300s

      - name: Run database migrations
        run: |
          kubectl exec -n staging deployment/video-meta-app -- npm run db:deploy
```

#### 8.2 Updated Production Workflow

```yaml
# .github/workflows/deploy-prod.yml
name: Deploy to Production (K8s)

on:
  push:
    tags:
      - "release-*"

permissions:
  contents: read
  packages: write

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=tag
            type=sha,prefix=prod-

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          build-args: |
            DATABASE_URL=${{ secrets.PROD_DATABASE_URL }}
            DIRECT_URL=${{ secrets.PROD_DIRECT_URL }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubeconfig
        run: |
          mkdir -p ~/.kube
          echo "${{ secrets.PROD_KUBECONFIG }}" | base64 -d > ~/.kube/config

      - name: Deploy with Kustomize
        run: |
          cd k8s/overlays/production
          
          # Update image tag
          kustomize edit set image ghcr.io/${{ github.repository }}=${{ needs.build-and-push.outputs.image_tag }}
          
          # Apply secrets
          kubectl create secret generic app-secrets \
            --from-literal=DATABASE_URL=${{ secrets.PROD_DATABASE_URL }} \
            --from-literal=DIRECT_URL=${{ secrets.PROD_DIRECT_URL }} \
            --from-literal=SESSION_COOKIE_NAME=${{ secrets.SESSION_COOKIE_NAME }} \
            --from-literal=SESSION_TTL_DAYS=${{ secrets.SESSION_TTL_DAYS }} \
            --dry-run=client -o yaml | kubectl apply -f -
          
          # Apply manifests
          kustomize build . | kubectl apply -f -
          
          # Wait for rollout
          kubectl rollout status deployment/video-meta-app -n production --timeout=300s

      - name: Run database migrations
        run: |
          kubectl exec -n production deployment/video-meta-app -- npm run db:deploy
```

#### Tasks:
- [ ] Update staging workflow for K8s deployment
- [ ] Update production workflow for K8s deployment
- [ ] Add KUBECONFIG secrets to GitHub
- [ ] Test deployment workflow

---

### Phase 9: Cluster Setup Prerequisites
**Estimated Time: Variable (depends on provider)**

#### Kubernetes Cluster Options:

| Provider | Service | Pros | Cons |
|----------|---------|------|------|
| AWS | EKS | Full AWS integration | Complex setup |
| GCP | GKE | Easy setup, autopilot | GCP lock-in |
| Azure | AKS | AD integration | Azure-specific |
| DigitalOcean | DOKS | Simple, affordable | Fewer features |
| Self-hosted | k3s/kubeadm | Full control | Maintenance burden |

#### Required Cluster Components:
1. **Ingress Controller** (NGINX Ingress or Traefik)
2. **cert-manager** (for TLS certificates)
3. **metrics-server** (for HPA to work)
4. **Storage Class** (for PersistentVolumes)

#### Tasks:
- [ ] Choose Kubernetes provider
- [ ] Provision staging cluster
- [ ] Provision production cluster
- [ ] Install Ingress Controller
- [ ] Install cert-manager
- [ ] Verify metrics-server is running
- [ ] Configure storage classes

---

### Phase 10: Testing & Validation
**Estimated Time: 2-3 hours**

#### Checklist:
- [ ] Deploy to staging and verify all pods are running
- [ ] Test application health endpoints
- [ ] Verify database connectivity
- [ ] Test HPA scaling (load test)
- [ ] Verify logs appear in Grafana/Loki
- [ ] Test TLS certificates
- [ ] Perform rollback test
- [ ] Document runbooks

---

## Environment-Specific Configuration Summary

| Setting | Local | Staging | Production |
|---------|-------|---------|------------|
| **App Replicas** | 1 | 1-3 (HPA) | 3-15 (HPA) |
| **Database** | Docker Compose | In-cluster or Managed | Managed (RDS/Cloud SQL) |
| **Storage** | MinIO (local) | MinIO or S3 | S3/GCS/Azure Blob |
| **Monitoring** | N/A | Grafana + Loki | Grafana + Loki |
| **Ingress** | localhost:3000 | staging.domain.com | app.domain.com |
| **TLS** | N/A | Let's Encrypt | Let's Encrypt |

---

## Required GitHub Secrets

### Staging Environment
| Secret | Description |
|--------|-------------|
| `STAGING_DATABASE_URL` | PostgreSQL connection string |
| `STAGING_DIRECT_URL` | Direct database URL |
| `STAGING_KUBECONFIG` | Base64-encoded kubeconfig |
| `SESSION_COOKIE_NAME` | Cookie name for sessions |
| `SESSION_TTL_DAYS` | Session TTL in days |

### Production Environment
| Secret | Description |
|--------|-------------|
| `PROD_DATABASE_URL` | PostgreSQL connection string |
| `PROD_DIRECT_URL` | Direct database URL |
| `PROD_KUBECONFIG` | Base64-encoded kubeconfig |
| `SESSION_COOKIE_NAME` | Cookie name for sessions |
| `SESSION_TTL_DAYS` | Session TTL in days |

---

## Implementation Order

1. **Phase 1**: Create K8s directory structure ✅
2. **Phase 2**: App manifests (deployment, service, HPA)
3. **Phase 9**: Set up K8s cluster (parallel with manifests)
4. **Phase 3**: Database configuration
5. **Phase 4**: Storage configuration (MinIO or cloud)
6. **Phase 6**: Ingress & TLS setup
7. **Phase 7**: Secrets management
8. **Phase 8**: Update GitHub Actions workflows
9. **Phase 5**: Deploy monitoring stack (Grafana + Loki)
10. **Phase 10**: Testing & validation

---

## Quick Start Commands

```bash
# Apply staging configuration
kubectl apply -k k8s/overlays/staging

# Apply production configuration
kubectl apply -k k8s/overlays/production

# Deploy monitoring stack
kubectl apply -k k8s/monitoring

# Check deployment status
kubectl get pods -n staging
kubectl get pods -n production
kubectl get pods -n monitoring

# View logs
kubectl logs -n staging deployment/video-meta-app -f

# Access Grafana (port-forward for local access)
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

---

## Next Steps

After reviewing this plan:
1. Confirm Kubernetes provider choice
2. Confirm database strategy (managed vs in-cluster)
3. Confirm storage strategy (cloud vs MinIO)
4. Begin implementation with Phase 1

---

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kustomize Documentation](https://kustomize.io/)
- [Grafana Loki Documentation](https://grafana.com/docs/loki/)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)


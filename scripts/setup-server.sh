#!/bin/bash
set -e

APP_DIR="/srv/apps/video-meta-generate"
LOG_DIR="/var/log/video-meta-generate"
USER=$(whoami)

echo "Setting up deployment directory..."
sudo mkdir -p "${APP_DIR}"
sudo mkdir -p "${LOG_DIR}"
sudo chown -R ${USER}:${USER} "${APP_DIR}"
sudo chown -R ${USER}:${USER} "${LOG_DIR}"

echo "Installing PM2 globally..."
npm install -g pm2

echo "Setting up PM2 startup script..."
pm2 startup systemd -u ${USER} --hp /home/${USER} || true

echo "Setup complete!"
echo "Deployment directory: ${APP_DIR}"
echo "Log directory: ${LOG_DIR}"


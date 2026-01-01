const appName = process.env.PM2_APP_NAME || "video-meta-generate";
const appDir =
  process.env.PM2_APP_DIR || "/srv/apps/video-meta-generate/current";

module.exports = {
  apps: [
    {
      name: appName,
      script: "npm",
      args: "start",
      cwd: appDir,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "1G",
      watch: false,
    },
  ],
};

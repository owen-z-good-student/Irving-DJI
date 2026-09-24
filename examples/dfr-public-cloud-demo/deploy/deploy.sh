#!/usr/bin/env bash
# DFR Demo 一键部署脚本（在云主机上执行）
# 用法：bash deploy.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/dfr-demo}"
NODE_MAJOR=20
SERVICE_NAME=dfr-demo

log() { echo -e "\033[32m[部署]\033[0m $*"; }
die() { echo -e "\033[31m[错误]\033[0m $*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "请用 root 或 sudo 执行"
[ -d "$APP_DIR/backend" ] || die "未找到 $APP_DIR/backend，请先上传代码（见 README.md）"

# ---------- 1. 安装 Node.js ----------
if ! command -v node >/dev/null 2>&1; then
  log "安装 Node.js ${NODE_MAJOR}.x ..."
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
else
  log "已存在 Node.js $(node -v)，跳过安装"
fi

# ---------- 2. 安装后端依赖 ----------
log "安装后端依赖 ..."
cd "$APP_DIR/backend"
npm install --omit=dev --no-audit --no-fund

# ---------- 3. 生成配置密钥 ----------
ENV_FILE="$APP_DIR/backend/.env"
if [ ! -f "$ENV_FILE" ]; then
  log "生成 .env（含随机加密密钥）..."
  cat > "$ENV_FILE" <<EOF
PORT=3000
DFR_CONFIG_SECRET=$(openssl rand -hex 32)
EOF
  chmod 600 "$ENV_FILE"
else
  log ".env 已存在，保留不覆盖"
fi

# ---------- 4. 注册 systemd 服务 ----------
log "注册 systemd 服务 ${SERVICE_NAME} ..."
cat > "/etc/systemd/system/${SERVICE_NAME}.service" <<EOF
[Unit]
Description=DFR Public Cloud Demo
After=network.target

[Service]
Type=simple
WorkingDirectory=${APP_DIR}/backend
EnvironmentFile=${APP_DIR}/backend/.env
ExecStart=$(command -v node) server.js
Restart=always
RestartSec=5
StandardOutput=append:/var/log/${SERVICE_NAME}.log
StandardError=append:/var/log/${SERVICE_NAME}.log

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "${SERVICE_NAME}"
systemctl restart "${SERVICE_NAME}"

sleep 3
if systemctl is-active --quiet "${SERVICE_NAME}"; then
  PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me || echo "<你的公网IP>")
  log "部署成功 ✓"
  echo ""
  echo "  访问地址：   http://${PUBLIC_IP}:3000"
  echo "  查看日志：   journalctl -u ${SERVICE_NAME} -f"
  echo "  重启服务：   systemctl restart ${SERVICE_NAME}"
  echo ""
  echo "  下一步：在「配置设置」页填入司空 2 组织密钥与项目 UUID"
  echo "  Event API 回调地址：http://${PUBLIC_IP}:3000/webhook/<你的userId>"
else
  die "服务启动失败，请查看：journalctl -u ${SERVICE_NAME} -n 50"
fi

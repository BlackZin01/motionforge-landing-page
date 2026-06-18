#!/bin/bash
# ─────────────────────────────────────────────
#  LovPilot / MotionForge — VPS Initial Setup
#  Execute UMA VEZ no servidor como root:
#  bash setup-vps.sh
# ─────────────────────────────────────────────
set -e

REPO_URL="https://github.com/BlackZin01/motionforge-landing-page.git"
APP_DIR="/var/www/motionforge"
APP_NAME="motionforge"
DOMAIN=""  # deixe vazio para usar só o IP

echo "======================================"
echo " MotionForge — Setup VPS"
echo "======================================"

# ── 1. Atualizar sistema ──────────────────
echo ""
echo "[1/7] Atualizando sistema..."
apt-get update -qq
apt-get install -y -qq git curl nginx ufw

# ── 2. Instalar Node.js 20 ────────────────
echo ""
echo "[2/7] Instalando Node.js 20..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
node -v && npm -v

# ── 3. Instalar PM2 ───────────────────────
echo ""
echo "[3/7] Instalando PM2..."
npm install -g pm2 --quiet
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

# ── 4. Clonar repositório ─────────────────
echo ""
echo "[4/7] Clonando repositório..."
if [ -d "$APP_DIR" ]; then
  echo "    Pasta já existe — fazendo pull..."
  cd "$APP_DIR" && git pull origin main
else
  git clone "$REPO_URL" "$APP_DIR"
fi

# ── 5. Build do Next.js ───────────────────
echo ""
echo "[5/7] Instalando dependências e buildando..."
cd "$APP_DIR"
npm ci
npm run build

# ── 6. Iniciar com PM2 ────────────────────
echo ""
echo "[6/7] Iniciando app com PM2..."
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save

# ── 7. Configurar Nginx ───────────────────
echo ""
echo "[7/7] Configurando Nginx..."

cat > /etc/nginx/sites-available/motionforge << NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN:-_};

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }

    # Cache arquivos estáticos do Next.js
    location /_next/static {
        proxy_pass   http://127.0.0.1:3000;
        add_header   Cache-Control "public, max-age=31536000, immutable";
    }
}
NGINX

ln -sf /etc/nginx/sites-available/motionforge /etc/nginx/sites-enabled/motionforge
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ── Firewall básico ───────────────────────
ufw allow 22/tcp   2>/dev/null || true
ufw allow 80/tcp   2>/dev/null || true
ufw allow 443/tcp  2>/dev/null || true

echo ""
echo "======================================"
echo " Setup concluído!"
echo " App rodando em: http://$(curl -s ifconfig.me 2>/dev/null || echo '?')"
echo " PM2 status:"
pm2 status
echo "======================================"

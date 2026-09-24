# 上云部署指南

以阿里云 ECS（Ubuntu + Docker 预装）为例，从零把 Demo 跑到公网。

> 本文示例公网 IP 用 `<PUBLIC_IP>` 代替，请替换成你自己的。

---

## 一、准备：本机打包前端

即使服务器是 4G 内存，**在本机打包更快也更省事**。

```bash
cd frontend
npm install
npm run build          # 产物在 frontend/dist
```

打包后把 `dist` 放到后端约定目录：

```bash
mkdir -p ../backend/Vue
cp -r dist ../backend/Vue/dist
```

> 前端已改为**同源模式**，不再写死 `:3000`。所以换 IP、换端口、加 Nginx 都无需改代码。

---

## 二、上传代码到服务器

```bash
# 在本机项目根目录执行
rsync -avz --exclude node_modules --exclude data \
  backend deploy \
  root@<PUBLIC_IP>:/opt/dfr-demo/
```

没有 rsync 也可以用 scp：

```bash
ssh root@<PUBLIC_IP> "mkdir -p /opt/dfr-demo"
scp -r backend deploy root@<PUBLIC_IP>:/opt/dfr-demo/
```

---

## 三、一键部署后端

```bash
ssh root@<PUBLIC_IP>
cd /opt/dfr-demo/deploy
bash deploy.sh
```

脚本会自动完成：装 Node 20 → 装依赖 → 生成随机加密密钥 → 注册 systemd 开机自启 → 启动服务。

成功后访问：**http://\<PUBLIC_IP\>:3000**

---

## 四、启动依赖服务（按需）

只有用到对应能力时才启动，**能省流量和内存**。

```bash
cd /opt/dfr-demo/deploy

# 先设置密码
cat > .env <<'EOF'
MINIO_ROOT_USER=换成你的用户名
MINIO_ROOT_PASSWORD=换成你的强密码
EMQX_PASSWORD=换成你的强密码
EOF
chmod 600 .env

docker compose up -d minio mqtt     # 存储 + 遥测
docker compose up -d srs            # 直播（演示时才开）
docker compose stop srs             # 演示完记得停，直播最耗流量
```

---

## 五、安全组放行端口

在阿里云控制台配置，**按需最小化开放**：

| 端口 | 用途 | 何时开 |
|---|---|---|
| 3000 | 后端 + 前端 | ✅ 必开 |
| 9000 / 9001 | MinIO API / 控制台 | 用存储时 |
| 8083 | MQTT over WebSocket | 用遥测时 |
| 1935 / 8080 | RTMP 推流 / FLV 播放 | 用直播时 |

> 生产环境不要把 MinIO、EMQX 控制台暴露公网，建议只对自己的 IP 放行。

---

## 六、配置司空 2

浏览器打开 `http://<PUBLIC_IP>:3000` → 「配置设置」页填入：

- **token**：司空 2 → 我的组织 → 组织设置 → OpenAPI → 复制密钥
- **project**：项目 UUID
- **workflow**：DFR 工作流 UUID
- MinIO / MQTT / 推流地址填你服务器的公网 IP

**Event API 回调地址**（填到司空 2 控制台）：
```
http://<PUBLIC_IP>:3000/webhook/<你的userId>
```
userId 在页面右上角或 `/api/user/bootstrap` 返回值里能看到。

---

## 七、日常运维

```bash
systemctl status dfr-demo          # 查看状态
systemctl restart dfr-demo         # 重启
journalctl -u dfr-demo -f          # 实时日志
docker compose ps                  # 依赖服务状态
```

---

## 八、省额度技巧（重要）

免费试用是**按小时扣额度**的，演示不是天天做：

```bash
# 不用时在阿里云控制台「停止实例」，选节省停机模式
# 这样计算资源不计费，能把额度拉长到覆盖两三个月
```

同时建议：
- 在费用中心**设置费用告警**
- 演示完 `docker compose stop srs`，避免直播流量空跑

---

## 常见问题

**页面能开但接口 502/500**
后端没起来。`journalctl -u dfr-demo -n 50` 看日志。

**Event API 收不到消息**
1. 安全组是否放行 3000
2. 回调地址的 userId 是否正确
3. 后端日志有没有 `[WEBHOOK]` 记录

**直播卡顿**
香港节点跨境传输所致。把司空 2 侧清晰度降到 720p，或避开晚高峰。

**内存不足**
`free -h` 看占用。可停掉暂时不用的容器，或加 swap：
```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

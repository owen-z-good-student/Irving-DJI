# QUICKSTART — 5 分钟跑起来

## 前置

- Node.js ≥ 16（建议 18 LTS）
- 一个司空 2（FlightHub 2）**Public Cloud** 组织，且已配置「云端互联」
- （可选）一个 MinIO / S3、一个 MQTT broker、一个 SRS 推流服务器——不填也能启动，只是对应页面功能不可用

## 一、拿到司空 2 凭据

1. 组织密钥（= `X-User-Token`）：司空 2 → 我的组织 → 组织设置 → OpenAPI → 复制密钥
2. 项目 UUID（= `X-Project-Uuid`）：调「获取组织下的项目列表」接口，取 `data.list[].uuid`；或从 Demo 配置页按提示填写
3. workflow UUID：在司空 2 配置好 DFR 自动派遣工作流后获取

## 二、启动后端

```bash
cd backend
cp ../.env.example .env      # 按需修改端口和 DFR_CONFIG_SECRET
npm install
npm start                    # 默认 http://localhost:3000
```

## 三、启动前端

开发模式（前后端分离，前端 8080 代理到后端 3000）：

```bash
cd frontend
npm install
npm run serve                # http://localhost:8080
```

生产模式（前端构建产物交给后端托管）：

```bash
cd frontend
npm run build                # 产物在 frontend/dist
# 把 dist 拷到后端约定目录 backend/Vue/dist
mkdir -p ../backend/Vue && cp -r dist ../backend/Vue/dist
# 之后仅需启动后端，访问 http://localhost:3000
```

## 四、填配置

浏览器打开前端 → 「配置设置」页，填入：

- DFR：token（组织密钥）、project（项目 UUID）、workflow（工作流 UUID）、creator
- （可选）MQTT / MinIO / 推流参数

保存后即可在「项目地图」点选目标下发出警、在其他页体验对应功能。

## 五、本地直接试用接处警（无需服务器）

**只要有组织密钥，本机就能下发真实出警派遣**——不需要云服务器、不需要公网 IP、不需要内网穿透。

原因是派遣请求**纯出站**：

```text
浏览器 → 本地后端 /api/proxy → 司空 2 云端 OpenAPI
```

出站流量穿 NAT 无障碍，所以 `localhost` 完全够用。填好配置后到「项目地图」页点选目标、下发派遣，**机场会真实开舱、无人机起飞前往目标点**。

> ⚠️ **这会驱动真实设备。** 请先确认空域合规、现场有人监护，并使用测试机场。不要在无监护情况下下发。

### 哪些功能本地跑不了

分界线是**流量方向**——需要司空 2 云端**主动连进你的机器**的功能，`localhost` 在公网不可达：

| 功能 | 方向 | 本地 |
|---|---|---|
| 出警派遣 | 你 → 司空云 | ✅ 可用 |
| Event API 回调 | 司空云 → 你 | ❌ 需公网入口 |
| MQTT 遥测 | 司空云 → 你的 broker | ❌ 需公网入口 |
| 航线同步 | 司空云 → 你的 S3 桶 | ❌ 需公网入口 |

后三项可用内网穿透（`ngrok` / `cpolar`）解锁，把本地端口暴露到公网后，在司空 2 侧填隧道地址即可。注意免费版隧道域名多为随机，重启后需回司空 2 重新配置。

## 六、体验巡检航线页

「巡检航线」页演示 `上传 → 同步司空 2 航线库 → 触发计划任务` 三步流。

- **上传 / 同步**：已接通 FlightHub Sync 挂载桶，配置好 S3 后是**真实双向同步**（非模拟）。列表会用「本端上传 / 司空 2 同步」标签区分来源。
- **计划任务**：`POST /api/wayline/plan-task` 目前返回 501，尚未接入 `/openapi/v0.1/flight-task`，需按官方文档补齐字段。

注意同步要求司空 2 能访问你的 S3 桶，本地 MinIO 需配合内网穿透。详见 `ARCHITECTURE.md` 与 skill 的巡检 reference。

## 常见问题

- **出警报 400 缺少 header**：配置页 token / project 没填全。
- **Event API 收不到消息**：把后端 `http://<你的公网地址>/webhook/<userId>` 配到司空 2 Event API 回调地址；本地需内网穿透。
- **MinIO 连接失败**：配置页 MinIO 参数或网络不通。

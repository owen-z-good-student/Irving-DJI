# ARCHITECTURE — Demo 模块 ↔ Skill 映射

本文件把 Demo 的每个模块映射到 `fh2-integration-skill` 的 reference 与中间件模式，方便二开用户从"能跑的代码"回到"方法论"，再改造成自己平台的适配层。

## 整体结构

```text
浏览器 (Vue2 前端)
  → 后端 Express 适配层 (backend/server.js)
    → /api/proxy      → 司空 2 Public Cloud OpenAPI（出警工作流，带白名单+校验）
    → /webhook/:uid   → 接收司空 2 Event API 回调 → WebSocket 推前端
    → /api/minio/*    → MinIO / S3（媒体、证据）
    → /api/wayline/*  → 巡检航线（真实挂载桶同步）
```

前端通过 `utils/request.js` 自动注入三件套 header：`X-User-Token`、`x-project-uuid`（小写！）、`x-proxy-target`。

## 逐模块映射

| Demo 模块 | 代码位置 | 对应 skill reference / pattern | 二开指引 |
|---|---|---|---|
| DFR 出警代理 | `backend/server.js` `/api/proxy` + `validateDfrRequestBody` | middleware-patterns.md Pattern 1；dfr-integration-architecture.md（Auto Dispatch Workflow） | 改校验逻辑对接你的 CAD/告警系统；注意 `x-project-uuid` 小写 |
| Event API 接收 | `backend/server.js` `/webhook/:userId` | dfr-integration-architecture.md（Event API）；Pattern 4 | **补 `x-dji-signature` HMAC 验签**（Demo 未做）+ 幂等 |
| 媒体/证据存储 | `backend/server.js` `/api/minio/*` | Pattern 4 证据管道；FlightHub Sync S3 | 换成你自己的 S3；按项目隔离桶/前缀 |
| 遥测 | 前端 `views/mqtt` + mqtt.js | dfr-integration-architecture.md（Telemetry）；Pattern 3 | Public Cloud 走遥测转发，On-Prem 走 MQTT Bridge |
| 巡检航线 | `backend` `/api/wayline/*` + `views/wayline` | **inspection-integration-architecture.md**；Pattern 7 | **已接通**：经 FlightHub Sync 挂载的 MinIO 桶双向同步，无需 wayline OpenAPI。仅「创建飞行任务」仍需 flight-task 端点 |
| 实时推送 | `backend` WebSocket `/ws` | — | 前端事件驱动展示 |
| 配置管理 | `backend` `/api/config` + AES 加密 | api-guardrails.md 第5节安全最小项 | token 不落前端、密钥轮换 |

## 巡检航线：走 FlightHub Sync 外部桶，而非 wayline OpenAPI

司空 2 的 **FlightHub Sync 支持挂载 MinIO / S3 兼容外部存储桶，挂载后双端新增文件双向同步**。因此航线同步无需调用任何 wayline OpenAPI 端点：

```text
中间件把 .kmz 写入被挂载的桶
  → FlightHub Sync 自动收录到司空 2 航线库
  → 司空 2 中新建的航线也会出现在该桶（双向）
  ※ 同步为增量：仅【新增】互相同步，【删除】不传播
```

| 端点 | 状态 | 说明 |
|---|---|---|
| `POST /api/wayline/upload` | ✅ 已接通 | 真实写入 MinIO 被挂载目录 |
| `GET /api/wayline/list` | ✅ 已接通 | 列出目录内航线，含司空 2 侧同步下来的 |
| `GET /api/wayline/status` | ✅ 已接通 | 确认对象仍在桶内 |
| `DELETE /api/wayline` | ✅ 已接通 | 仅删桶内副本；同步为增量，**删除不传播**到司空 2 |
| `POST /api/wayline/plan-task` | ❌ 返回 501 | **创建飞行任务仍需 `/openapi/v0.1/flight-task`**，字段以 Apifox 为准 |

**司空 2 实际使用的目录结构（实测）**：

```text
fh_sync/check_file.txt                                      ← 司空2 写的连通性探针
fh_sync/{组织}/{项目}/wayline/{文件}.kmz                     ← 上传到司空2 要写这里
wayline/fh_sync/{组织}/{项目}/wayline/{航线UUID}.kmz         ← 司空2 回传写这里
```

**两个方向不对称**（司空 2 现状）：

| 方向 | 路径 | 可控性 |
|---|---|---|
| 司空 2 → 三方桶 | `wayline/fh_sync/{组织}/{项目}/wayline/{文件}` | 司空 2 自动加头部 `wayline/`，改不了 |
| 三方桶 → 司空 2 | `fh_sync/{组织}/{项目}/wayline/{文件}` | 头部**不能**带该前缀，否则不被收录 |

因此配置页的「目录前缀」应**留空**。另外，你上传的航线被收录后，司空 2 会以带前缀的路径回传，
所以**同一条航线会在桶里出现两次**（两个不同 key）——页面用「本端上传 / 司空 2 同步」标签区分。

放在其他位置的文件**不会被收录**。因此 Demo 需要知道组织/项目 UUID，可用 `POST /api/wayline/detect-identity` 从已同步下来的航线路径中自动解析。

**前置条件**（在司空 2 控制台完成，缺一不可）：
1. **添加存储配置**：类型选 **S3 兼容**（不是 Aliyun OSS），填 Endpoint / 桶名 / AK / SK / 预设路径
2. **添加同步规则**：数据类型选航线，关联该存储配置与项目，方向选双向
3. 配置页的 `wayline.bucket` / `wayline.prefix` 与上述一致，并识别出组织/项目 UUID

对应 skill 巡检接口选型表见 `inspection-integration-architecture.md`。

## 第三方服务合规提醒

Demo 的谷歌底图使用的是 `mt1.google.com/vt` **非官方公开瓦片接口**，无需 API Key，便于快速演示。

但它：不受 Google 官方支持、可能随时变更失效、**商用可能违反 Google 服务条款**。

**生产环境必须改用 [Google Maps Platform](https://developers.google.com/maps) 官方 API 并申请有效 Key**；国内则使用高德开放平台等官方授权服务。

## 部署边界提醒

本 Demo 全部按 **Public Cloud** 设计（组织密钥认证、`es-flight-api-cn.djigate.com`）。
若你的部署是 On-Premises / AIO，接口面更广、认证可能是 OAuth/SSO——**不要直接照搬**，先走 skill 的部署 Gate 与 On-Prem reference。

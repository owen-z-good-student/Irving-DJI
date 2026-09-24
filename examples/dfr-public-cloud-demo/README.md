# DFR Public Cloud Demo（司空 2 DFR 集成参考实现）

这是 `fh2-integration-skill` 附带的**可运行参考实现**，演示如何基于司空 2（FlightHub 2）**Public Cloud** OpenAPI 搭一个最小的 DFR 飞行指挥中间件。

> ⚠️ 范围：**仅覆盖 DFR / 应急场景 + 一个巡检航线教学页**。它是**教学级**，不是生产级。生产化前请先读 `LIMITATIONS.md`。
> 巡检场景的完整设计请看 skill 的 `references/inspection-integration-architecture.md`。

## 两类用户怎么用

| 你是… | 怎么用这个 Demo |
|---|---|
| **不太会二开** | 按 `QUICKSTART.md` 把它直接跑起来，填上你的司空 2 组织密钥和项目 UUID，体验出警派遣 / Event API / 存储 / 航线上传的完整流程 |
| **要做二开** | 把它当"起步骨架"，参考 `ARCHITECTURE.md` 里 Demo 模块 ↔ skill reference 的映射，改造成你自己平台的适配层；同时用 skill 本体做方法论指导 |

## 功能一览

| 页面 | 功能 | 对应司空 2 接口 |
|---|---|---|
| 项目地图 | 点选目标 → 下发 DFR 出警 | Auto Dispatch Workflow (`/openapi/v0.1/workflow`) |
| MQTT 信息 | 订阅遥测（osd/state） | 遥测转发 / MQTT |
| 巡检航线 | 上传航线 → 同步航线库 → 计划任务 | 上传/同步为**真实挂载桶双向同步**；计划任务返回 501，需接 `/openapi/v0.1/flight-task` |
| Event API 信息 | 接收并展示回调 | Event API（webhook 接收） |
| S3 存储桶 | MinIO 桶/对象管理 | FlightHub Sync S3 |
| 配置设置 | 填写全部连接参数 | — |

## 技术栈

- 后端：Node.js + Express（单文件 `backend/server.js`）+ MinIO SDK + WebSocket
- 前端：Vue 2 + Element-UI + OpenLayers + mqtt.js + flv.js

## 安全提示（重要）

- 本仓库已**脱敏**：所有默认凭据/IP 均为 `<YOUR_XXX>` 占位。
- 请勿把填好的真实密钥提交到版本库；`backend/data/`（含加密配置）与 `.env` 已在 `.gitignore` 中。
- 生产环境务必修改 `DFR_CONFIG_SECRET`。

更多：`QUICKSTART.md`（启动） · `ARCHITECTURE.md`（映射） · `LIMITATIONS.md`（局限与生产化清单）

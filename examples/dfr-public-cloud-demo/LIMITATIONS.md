# LIMITATIONS — 局限与生产化清单

本 Demo 是**教学级**参考实现，用来快速理解司空 2 DFR 集成的形态。**不要直接用于生产**。以下是已知局限，以及从 Demo 到生产要补齐的项（每条都对应 skill 的 guardrails）。

## 已知局限

| # | 局限 | 影响 | 对应 skill 要求 |
|---|---|---|---|
| 1 | **Event API 未验签** `x-dji-signature` | 任何人可伪造回调 | api-guardrails.md：Event API 必须 HMAC-SHA256 验签 |
| 2 | 用 JSON 文件当存储（config / webhook） | 非并发安全、不可水平扩展 | 生产用数据库 |
| 3 | 出警代理写死单一 workflow path | 只能一种工作流 | 按需参数化，但仍做白名单 |
| 4 | cookie `httpOnly: false`，token 前端可见 | XSS 可窃取 | token 不落前端、后端持有 |
| 5 | 航线同步依赖 FlightHub Sync 挂载配置 | 未挂载则文件只留在 MinIO，不会进司空 2 | 需先在司空 2 完成挂载；同步延迟取决于其扫描周期 |
| 5b | 「创建飞行任务」未接通（返回 501） | 无法从 Demo 直接下发计划任务 | 需接 `/openapi/v0.1/flight-task`，字段以 Apifox 为准 |
| 6 | 无鉴权/多租户隔离仅靠 cookie uuid | 不适合公网多用户 | 加真实登录与权限 |
| 7 | 无请求限流 / 审计日志留存策略 | 易被滥用、缺合规证据 | api-guardrails.md：审计日志、IP 允许清单 |
| 8 | 所有端点 schema 未做版本/契约校验 | 司空 API 变更即坏 | 以最新 Apifox 为准，加契约校验 |
| 9 | **地图使用谷歌非官方瓦片接口** | 不受 Google 支持，随时可能失效；**商用可能违反其服务条款** | 生产环境改用 Google Maps Platform 官方 API + 有效 Key |

## 生产化 checklist

- [ ] Event API 回调加 `x-dji-signature` 验签 + 幂等（按事件 ID）
- [ ] token / 组织密钥移到后端安全存储，前端不可见，支持轮换
- [ ] 存储换成数据库；`backend/data/` 不入库
- [ ] `DFR_CONFIG_SECRET` 使用强随机值并用密钥管理系统托管
- [ ] 出警/控制类操作加人工确认与安全评审（human-in-the-loop）
- [ ] 加登录鉴权、项目级权限、IP 允许清单、限流
- [ ] 审计日志：API 调用与下游动作可追溯，按合规留存
- [ ] 巡检航线接真实司空 wayline / flight-task 端点，字段以 Apifox 验证
- [ ] 明确部署形态（Public Cloud / On-Prem / AIO），不要跨边界混用 API
- [ ] 地图底图换用官方授权服务（Google Maps Platform / 高德开放平台），申请 API Key 并遵守其服务条款

> 提示：以上每一条"局限"正好是 skill guardrails 的反面教材，可作为教学对照。

# FH2 Integration Skill

*[English](./README.md) | 中文*

**FH2 Integration Skill** 是面向系统集成商的 AI 就绪集成指南，帮助您在 **大疆 Dock**、**FlightHub 2（司空 2）** 及两类工作流场景中构建中间件：**DFR（First Responder）应急响应**与**巡检/巡逻**。

> 历史说明：该技能此前命名为 `awesome-dfr-integration-skill`，现覆盖 DFR 与巡检双场景，更名为 `fh2-integration-skill`。

它将 DFR 白皮书最佳实践、巡检工作流指南以及 FlightHub 2 OpenAPI 边界指导，汇编为可复用的技能，适用于 Claude Code、Cursor 等 AI 辅助开发环境。

> 版本：`1.3.0-rc`  
> 最后更新：`2026-08-06`

## 本技能可帮助您

- **DFR / 应急响应**
  - CAD/报警系统 → FlightHub 2 派遣中间件
  - VMS/指挥中心直播流对接
  - GIS/PSIM 遥测对接
  - 证据档案与媒资同步
- **巡检/巡逻**
  - 航线上传与同步至 FH2 航线库 + 计划/周期性任务派发
  - 巡检媒资 → AI/VLM 缺陷识别 → 第三方分析平台
  - 三维重建/点云/模型同步
- **共用**
  - Event API 回调处理
  - FlightHub Sync / OpenAPI / MQTT 桥接接口选型
  - 公有云 vs 私有化 API 边界判定
  - 实施计划、测试计划与安全约束

## 双门逻辑（Two Gates）

本技能按顺序执行两道必选门。

1. **部署门（第一道）**：FlightHub 2 部署方式 — 公有云 / 私有化 / AIO。决定 API 表面与认证模型。
2. **场景门（第二道）**：DFR/应急 还是 巡检/巡逻。决定接口选型、数据流与安全重点。

对于本技能，AIO 与私有化共享相同的集成接口与 OpenAPI 范围；私有化/AIO 暴露更广的 API 表面。

在推荐具体 API 前必须确认部署方式，在选定接口前必须确认场景。禁止从 Token 格式、URL 模式、域名、截图、客户所属区域或其它线索推断部署方式。禁止将 DFR 实时接管流程用于巡检，也禁止将巡检周期性调度流程用于 DFR。

## 重要边界

- **Frontend Components / `paas.js`**：仅支持私有化/AIO 部署。请勿推荐用于公有云。
- **私有化 OpenAPI V2.0 默认模块**：仅支持私有化/AIO 部署。公有云必须使用公有云 OpenAPI V2.0 参考。
- **Event API**：公有云与私有化均支持。事件类型、载荷模式与配置路径需经部署特定文档核实。
- **Auto Dispatch Workflow 头部大小写**：DFR 工作流指南采用小写 `x-project-uuid`，而多数 OpenAPI 参考采用帕斯卡写法 `X-Project-Uuid`。生成生产派遣代码前务必核实所需大小写。
- **场景混用**：分别设计各自方案；务必标记共享组件（S3 存储、Event API）与场景专属组件。

## 仓库结构

```text
fh2-integration-skill/
├── SKILL.md                              # 技能入口：工作流、SOP、STOP 检查点、输出模板
├── README.md / README.zh-CN.md
├── USER-GUIDE.html / 使用说明.html         # 面向终端用户的独立指南（EN + 简中）
├── CHANGELOG.md
├── references/                           # 知识库（事实层）
│   ├── README.zh-CN.md                       # 中文阅读指南（索引，非翻译）
│   ├── api-guardrails.md                     # 防幻写 & 安全基线（最高优先级）
│   ├── capability-overview.md                # 非开发者的能力菜谱（解释与选择）
│   ├── scenario-dfr-vs-inspection.md         # 场景判定（DFR vs 巡检）
│   ├── dfr-integration-architecture.md       # DFR 架构与接口选型
│   ├── inspection-integration-architecture.md# 巡检架构与接口选型
│   ├── integrate-with-existing-system.md     # 把 FH2 接入已有平台（适配层）
│   ├── demo-localization.md                  # 语言检测与 UI 文案本地化
│   ├── dfr-whitepaper-summary.md             # DFR 操作最佳实践
│   ├── fh2-openapi-v2-private-default.md      # 私有化默认模块 API 范围
│   ├── fh2-openapi-v2-public-vs-private.md    # 部署边界判定逻辑
│   ├── middleware-patterns.md                # 中间件模式（DFR + 巡检，共 9 种）
│   └── source-map.md                         # 来源溯可与最新文档链接
├── adapters/                             # IDE 适配
│   ├── claude-code-usage.md / .zh-CN.md      # 在 Claude Code / OpenCode 中使用
│   └── cursor-rules.md
├── evals/                               # 质量评估
│   ├── evals.json                            # 14 个用例（含对抗用例）
│   └── eval-runbook.md / .zh-CN.md           # 释放门槛：13/14 通过，无 Critical Failure
├── examples/
│   └── dfr-public-cloud-demo/                # 可运行的 DFR 公有云演示（DFR-only，教学级别）
└── CHANGELOG.md
```

## 安装

### Claude Code / OpenCode 风格技能文件夹

将本仓库复制到本地技能目录：

```bash
mkdir -p ~/.config/opencode/skills
git clone https://github.com/owen-z-good-student/Irving-DJI.git \
  ~/.config/opencode/skills/fh2-integration-skill
```

安装后重启您的 AI 编程环境。

### Cursor

参考：

```text
adapters/cursor-rules.md
```

把其内容写入项目的 `.cursor/rules/fh2-integration.mdc` 文件。

### 附带演示（可选）

一个可运行的 DFR 公有云参考实现位于：

```text
examples/dfr-public-cloud-demo/
```

详见 `QUICKSTART.md`。该演示为 DFR-only、教学级别，非生产环境——复用前请先阅读 `LIMITATIONS.md`。

## 示例 Prompt

```text
Use FH2 Integration Skill to design a FlightHub 2 On-Premises DFR middleware for CAD alarm dispatch, VMS livestream, GIS telemetry, and evidence archiving.
```

```text
We use FlightHub 2 Public Cloud. Help design a VMS livestream integration for a DFR command center without using Frontend Components.
```

```text
We are on AIO. Design a DFR middleware using private deployment OpenAPI capabilities, Event API, MQTT Bridge, and Frontend Components.
```

```text
Inspection / patrol scenario, On-Premises. Design a wayline upload + sync, planned periodic task dispatch, inspection media → AI/VLM defect analysis, and 3D model sync middleware.
```

## 最新 API 参考

OpenAPI 文档可能会持续演进。在生产开发前，务必在最新 Apifox 参考上核实具体的接口与模式。

**English：**

- On-Premises / default module: <https://41b04hdzmc.apifox.cn/>
- Public Cloud OpenAPI V2.0: <https://s.apifox.cn/5113ab93-b1c2-4f3c-bc06-c3656c5352fb>

**中文：**

- 私有化 / 默认模块: <https://henvmbbf6x.apifox.cn/8983503m0>
- 公有云 OpenAPI V2.0: <https://s.apifox.cn/4de4a239-c2cc-4572-9b65-90738289f37a>

两版为独立 Apifox 项目，可能存在漂移；如某接口在一版中缺失，请检查另一版。

## 评估（Evaluation）

本仓库包含内部评估集：

```text
evals/evals.json          # 14 个用例（含对抗用例）
evals/eval-runbook.md     # 释放门槛与手动测试指引
```

当前候选发布版本要求至少 **14 个用例中 13 个通过**，且无 Critical Failure。

## 免责声明

本技能为集成设计辅助工具，不替代官方 DJI 文档、客户安全评审、法务评审、航空批准或生产验证。
在生产使用前，务必在最新官方文档中核实接口模式、认证行为、权限与部署特定能力。

## License

尚未授予任何开源许可。使用受适用 DJI 文档与集成条款约束。

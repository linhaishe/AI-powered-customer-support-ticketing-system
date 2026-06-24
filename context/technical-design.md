# 天猫海外 AI 客服服务中台技术文档

## 1. 技术定位

本项目定位为适合简历展示的 AI 全栈业务系统。第一阶段以 Next.js 单体应用完成可演示 MVP，使用 mock 数据模拟天猫海外业务系统；后续演进为包含 BFF、数据层、缓存、异步任务、向量检索和 AI 服务的完整架构。

技术选型强调两个目标：

- 第一阶段快速产出可演示页面。
- 后续架构贴近中大型平台系统，避免把 ORM 便利性包装成高流量核心链路能力。

## 2. 当前技术栈

当前仓库已有：

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

第一阶段继续沿用现有栈，不额外引入数据库、认证、AI SDK 或 UI 组件库。

## 3. 推荐演进技术栈

### 第一阶段

- Next.js
- React
- TypeScript
- Tailwind CSS
- Mock Service Layer
- 本地 AI 辅助函数

### 第二阶段

- Next.js Route Handlers 或 Server Actions
- TypeScript Service Layer
- SQL Query Layer
- PostgreSQL 或 MySQL

### 第三阶段

- AI SDK
- 向量检索
- Redis
- Message Queue
- 审计日志

### 简历表述

推荐写法：

```txt
Next.js, React, TypeScript, Tailwind CSS, Node.js, PostgreSQL/MySQL, Redis, AI SDK, Vector Search, Message Queue
```

如果项目仍处于第一阶段，推荐写法：

```txt
Next.js, React, TypeScript, Tailwind CSS, Mock Service Layer, AI-ready Architecture
```

## 4. 为什么不主打 Prisma

Prisma 适合个人项目、MVP、后台管理和中小规模 SaaS，但如果项目希望贴近大厂高流量业务系统，Prisma 不适合作为核心技术卖点。

原因：

- 复杂 SQL 控制力不如手写 SQL 或 Query Builder。
- 高并发场景更关注连接池、慢 SQL、索引、缓存和读写拆分。
- 大厂核心链路通常更重视可控的数据访问层，而不是 ORM 便利性。
- 本项目的简历亮点应是业务架构、AI 接入、安全边界和数据流设计，而不是 ORM。

推荐表述为：

- SQL Query Layer
- Repository Layer
- Data Access Layer
- Kysely 或 Drizzle
- Raw SQL for critical queries

## 5. 容量假设

为了避免 Redis、Message Queue、BFF 和向量检索变成技术堆料，后续真实架构以中大型平台客服场景为容量假设。

目标容量：

- 日服务工单：100,000
- 峰值客服工作台读 QPS：300
- 峰值 AI 生成任务 QPS：50
- 知识库文章：50,000
- 平均每个服务工单消息数：8
- 平均上下文：1 个订单、1 条物流轨迹、0 到 1 个售后单
- AI 生成目标：P95 15 秒内完成
- 工作台 BFF 响应目标：P95 500ms 内返回

这些假设带来的技术结论：

- 客服打开工单不能同步等待 AI 生成。
- 工单列表必须分页，不能一次性加载全量数据。
- BFF 需要字段裁剪和按需聚合。
- AI 任务必须异步队列化。
- Redis 只能缓存有明确新鲜度规则的数据。
- AI 生成必须具备幂等键和去重机制。

## 6. 领域模型边界

### ServiceCase

`ServiceCase` 是一个可独立分配、跟进、评估风险并闭环的服务诉求。它不按消息数量切分，而按服务意图切分。

示例：

- 消费者连续三次追问同一个物流延迟问题，仍然是同一个 `ServiceCase`。
- 消费者在同一条消息里同时提出物流延迟、退款请求、投诉客服，应拆成三条 `ServiceCase`，但它们关联同一个 `Conversation` 和 `Order`。

### Conversation

`Conversation` 是原始客服会话线程，包含消费者消息、客服回复和系统事件。一个 `Conversation` 可以关联多个 `ServiceCase`。

### CaseMessage

`CaseMessage` 是会话中的单条消息或事件。它不是创建 `ServiceCase` 的边界。一个 `CaseMessage` 可以关联一个或多个 `ServiceCase`。

### Reopen 规则

`ServiceCase` 的 `resolved` 状态表示客服认为问题已处理，但仍允许在 reopen window 内被重新打开。

默认 reopen window 为 72 小时。

同一消费者、同一订单、同一服务意图，在原 `ServiceCase` resolved 后 72 小时内再次追问，应 reopen 原 case，而不是创建新 case。

超过 reopen window 的同类追问应创建新的 `ServiceCase`，并通过 `RelatedCase` 关联旧 case，避免一个 case 无限拖长并污染处理时长和 SLA 统计。

## 7. 第一阶段文件结构

```txt
app/
  page.tsx
  globals.css

components/
  dashboard/
    AiAssistantPanel.tsx
    CaseDetail.tsx
    CaseList.tsx
    ContextCard.tsx
    MetricsBar.tsx
    StatusBadge.tsx

lib/
  ai-assistant.ts
  mock-data.ts
  types.ts
```

## 8. 模块职责

### `app/page.tsx`

负责首页工作台容器。

职责：

- 维护当前选中的工单 ID。
- 从 mock 数据中读取服务工单和上下文。
- 调用 AI 辅助函数生成当前工单的 AI 输出。
- 将数据传递给工作台组件。

不负责：

- 定义业务类型。
- 存放大量 mock 数据。
- 编写 AI 规则逻辑。
- 堆叠所有 UI 细节。

### `lib/types.ts`

负责定义业务对象和 AI 输出结构。

核心类型：

- `ServiceCase`
- `Conversation`
- `CaseMessage`
- `Consumer`
- `Order`
- `LogisticsTrace`
- `AfterSalesCase`
- `Merchant`
- `KnowledgeArticle`
- `KnowledgeCitation`
- `ContextSnapshot`
- `AiAssistantResult`
- `AIInteraction`
- `AIUsageEvent`
- `RiskAssessmentEvent`

### `lib/mock-data.ts`

负责提供模拟数据。

数据包括：

- 工单列表。
- 会话和消息。
- 消费者列表。
- 订单列表。
- 物流轨迹。
- 售后单。
- 商家信息。
- 平台规则和知识库。

### `lib/ai-assistant.ts`

负责生成本地 AI 辅助结果。

第一阶段实现方式：

- 根据工单问题类型和风险等级返回结构化结果。
- 根据知识库数据附加版本化引用片段。
- 根据消费者语言偏好生成回复草稿。
- 输出 AI 建议风险等级，但不直接改写工单有效风险等级。

后续替换方式：

- 改为调用 API Route。
- API Route 触发或读取异步 AI 生成结果。
- AI SDK 结合知识检索返回结构化 JSON。

### `components/dashboard/CaseList.tsx`

负责工单队列展示和选中态。

输入：

- `cases`
- `selectedCaseId`
- `onSelectCase`

输出：

- 用户点击某条工单后触发 `onSelectCase(caseId)`。

### `components/dashboard/CaseDetail.tsx`

负责展示当前工单和业务上下文。

输入：

- 当前工单。
- 会话和消息。
- 消费者。
- 订单。
- 物流。
- 售后。
- 商家。
- 相关知识。

### `components/dashboard/AiAssistantPanel.tsx`

负责展示 AI 辅助结果。

输入：

- `AiAssistantResult`
- stale 状态。
- 草稿操作回调。

交互：

- 采纳。
- 编辑。
- 忽略。
- 查看引用依据。
- 在建议过期时触发刷新。

### `components/dashboard/MetricsBar.tsx`

负责展示顶部指标。

指标：

- 今日服务工单。
- AI 建议采纳率。
- 高风险工单。
- 平均处理时长。

### `components/dashboard/StatusBadge.tsx`

负责统一展示状态、优先级、风险等级和问题类型标签。

## 9. 数据模型

### ServiceCase

```ts
type ServiceCase = {
  id: string;
  conversationId: string;
  title: string;
  status: "new" | "in_progress" | "waiting_consumer" | "escalated" | "resolved" | "closed";
  issueType: "logistics_delay" | "refund_status" | "customs_tax" | "product_mismatch" | "complaint_escalation";
  priority: "low" | "medium" | "high" | "urgent";
  riskLevel: "low" | "medium" | "high";
  consumerId: string;
  orderId: string;
  afterSalesId?: string;
  merchantId: string;
  relatedCaseIds: string[];
  resolvedAt?: string;
  closedAt?: string;
  updatedAt: string;
};
```

### Conversation

```ts
type Conversation = {
  id: string;
  consumerId: string;
  channel: "web" | "email" | "chat" | "system";
  messageIds: string[];
  serviceCaseIds: string[];
  createdAt: string;
  updatedAt: string;
};
```

### CaseMessage

```ts
type CaseMessage = {
  id: string;
  conversationId: string;
  serviceCaseIds: string[];
  authorType: "consumer" | "agent" | "system";
  content: string;
  language: string;
  createdAt: string;
};
```

### ContextSnapshot

`ContextSnapshot` 是 AI 生成或人工决策时可用业务上下文的时间点副本。历史 AI 建议必须能追溯到当时的上下文，而不能被后续订单、物流或售后变化改写。

```ts
type ContextSnapshot = {
  id: string;
  serviceCaseId: string;
  contextVersion: string;
  orderSnapshot: OrderSnapshot;
  logisticsSnapshot?: LogisticsSnapshot;
  afterSalesSnapshot?: AfterSalesSnapshot;
  merchantSnapshot: MerchantSnapshot;
  knowledgeVersionIds: string[];
  createdAt: string;
};
```

### AiAssistantResult

```ts
type AiAssistantResult = {
  summary: string;
  issueTypeLabel: string;
  sentiment: "calm" | "confused" | "dissatisfied" | "angry";
  suggestedRiskLevel: "low" | "medium" | "high";
  suggestedActions: string[];
  replyDraft: string;
  citations: KnowledgeCitation[];
  safetyNote: string;
};
```

### KnowledgeCitation

AI 引用的是带版本的知识片段，而不是整篇文章。

```ts
type KnowledgeCitation = {
  articleId: string;
  articleVersion: string;
  title: string;
  locale: string;
  region: string;
  snippet: string;
  relevanceReason: string;
};
```

### AIInteraction

AI 输出是可审计事实记录，不是普通缓存。

```ts
type AIInteraction = {
  id: string;
  serviceCaseId: string;
  contextSnapshotId: string;
  knowledgeVersion: string;
  promptVersion: string;
  modelVersion: string;
  status: "pending" | "succeeded" | "failed";
  output?: AiAssistantResult;
  errorCode?: string;
  createdAt: string;
  completedAt?: string;
};
```

### AIUsageEvent

```ts
type AIUsageEvent = {
  id: string;
  aiInteractionId: string;
  serviceCaseId: string;
  outcome:
    | "accepted"
    | "edited_and_used"
    | "dismissed"
    | "reported_inaccurate"
    | "not_used";
  editDistanceRatio?: number;
  reason?: string;
  actorId: string;
  createdAt: string;
};
```

### RiskAssessmentEvent

```ts
type RiskAssessmentEvent = {
  id: string;
  serviceCaseId: string;
  previousRiskLevel: "low" | "medium" | "high";
  proposedRiskLevel: "low" | "medium" | "high";
  appliedRiskLevel: "low" | "medium" | "high";
  source: "rule" | "ai" | "agent" | "supervisor";
  reason: string;
  actorId?: string;
  createdAt: string;
};
```

## 10. 第一阶段数据流

```txt
mock-data.ts
  -> app/page.tsx
    -> buildAiAssistantResult()
    -> MetricsBar
    -> CaseList
    -> CaseDetail
    -> AiAssistantPanel
```

流程：

1. 页面加载 mock 工单列表。
2. 默认选中第一条工单。
3. 根据 `caseId` 找到当前 `ServiceCase`。
4. 根据 `conversationId` 找到原始会话和相关消息。
5. 根据工单关联 ID 找到消费者、订单、物流、售后、商家和知识库。
6. 调用 `buildAiAssistantResult()` 生成结构化 AI 辅助内容。
7. 页面渲染三栏工作台。
8. 用户切换工单后重复第 3 到第 7 步。

第一阶段允许同步调用本地 AI 辅助函数，因为它不访问模型服务。真实架构中不沿用这个同步生成方式。

## 11. 后续真实架构

### BFF 层

BFF 负责聚合前端所需数据。

输入：

- `caseId`

输出：

- 工单。
- 会话和消息。
- 消费者。
- 订单快照。
- 物流轨迹。
- 售后单。
- 商家信息。
- 相关知识引用。
- 最新成功 AI 辅助结果。
- AI 建议是否 stale。

### Service 层

服务拆分：

- `caseService`
- `conversationService`
- `orderContextService`
- `logisticsContextService`
- `afterSalesContextService`
- `knowledgeService`
- `aiAssistantService`
- `riskAssessmentService`
- `auditService`

### 数据层

建议使用 SQL Query Layer 或轻量 Query Builder。

核心表：

- `service_cases`
- `conversations`
- `case_messages`
- `case_message_links`
- `consumers`
- `order_snapshots`
- `logistics_snapshots`
- `after_sales_snapshots`
- `merchant_snapshots`
- `knowledge_articles`
- `knowledge_article_versions`
- `context_snapshots`
- `ai_interactions`
- `ai_usage_events`
- `risk_assessment_events`

### 缓存层

Redis 不是 AI 结果的事实来源。

允许缓存：

- 热门知识库片段，必须带 `articleVersion`。
- 最近读取的物流快照，必须有短 TTL 和更新时间。
- BFF 聚合结果的短期只读缓存，必须包含上下文版本。
- AI 生成任务幂等 key。

不允许作为普通缓存使用：

- AI 建议结果。
- 风险等级最终值。
- 涉及退款、赔付、售后关闭的决策结果。

AI 生成幂等 key 至少包含：

```txt
serviceCaseId + contextVersion + knowledgeVersion + promptVersion + modelVersion
```

### 异步任务

消息队列处理：

- 工单创建后的 AI 摘要生成。
- 消费者追加消息后的 AI 更新。
- 物流、订单、售后关键上下文变化后的 AI 更新。
- 知识库向量索引刷新。
- AI 输出质量分析。
- 高频问题聚合。
- 风险工单提醒。

### AI 层

AI 能力：

- 问题分类。
- 消费者诉求摘要。
- 情绪识别。
- 风险识别建议。
- 知识检索。
- 回复草稿生成。

输出必须是结构化 JSON，并经过 schema 校验后进入页面。

## 12. AI 生成策略

真实架构采用异步生成策略，而不是在客服打开页面时同步调用模型。

触发生成的事件：

- `ServiceCase` 创建。
- 消费者追加消息。
- 订单、物流或售后关键状态变化。
- 相关知识库内容更新。

页面展示规则：

- 工作台展示最新一次成功的 `AIInteraction`。
- 如果当前上下文版本新于最新 AI 结果对应的 `ContextSnapshot`，页面展示 stale 警告。
- stale 警告不阻断客服处理，但提醒客服不要把旧 AI 建议当成当前事实。
- 客服可以手动触发刷新，刷新动作进入异步任务队列。

失败降级：

- AI 超时：展示最近一次成功结果和 stale/timeout 提示。
- JSON schema 校验失败：不展示失败输出，写入失败记录。
- 知识库无命中：允许展示摘要和风险建议，但回复草稿必须提示依据不足。
- 模型不可用：页面显示“AI 辅助暂不可用，请按 SOP 人工处理”。
- 安全校验失败：隐藏不安全草稿，记录失败原因。

## 13. 风险等级规则

`ServiceCase.riskLevel` 是当前有效业务风险等级，用于路由、升级、主管复核和报表统计。

`AiAssistantResult.suggestedRiskLevel` 只是 AI 建议风险等级。

规则：

- AI 可以建议升高风险。
- AI 不能自动降低有效风险等级。
- 规则系统和人工确认优先级高于 AI。
- 风险等级变化必须写入 `RiskAssessmentEvent`。
- 高风险工单进入主管复核或升级队列。

冲突示例：

- 规则系统根据高价值订单和退款诉求将 `ServiceCase.riskLevel` 标记为 high。
- AI 根据语气判断消费者较平静，建议 medium。
- 页面最终展示有效风险为 high，同时展示 AI suggestedRiskLevel 为 medium，并说明 AI 未覆盖规则风险。

## 14. 知识引用规则

AI 回复草稿必须尽量基于版本化知识引用。

规则：

- 引用对象是 `KnowledgeCitation`，不是整篇 `KnowledgeArticle`。
- 引用必须包含文章 ID、文章版本、标题、适用地区、适用语言、片段和相关性原因。
- 历史 `AIInteraction` 保留生成时使用的引用版本。
- 知识库更新不会改写历史 AI 结果。
- 新生成的 AI 结果使用最新可用知识版本。
- 涉及时效、退款、赔付和规则解释的关键句子必须能追溯到引用片段。

## 15. 指标口径

### AI 采纳率

```txt
AI 采纳率 = (accepted + edited_and_used) / viewed AI suggestions
```

### 草稿直采率

```txt
草稿直采率 = accepted / viewed reply drafts
```

### AI 负反馈率

```txt
AI 负反馈率 = reported_inaccurate / viewed AI suggestions
```

### 处理时长

第一阶段用于展示，后续真实系统中建议按事件计算：

- 首次响应时长：`firstAgentReplyAt - caseCreatedAt`
- 处理闭环时长：`resolvedAt - caseCreatedAt`
- reopen 后跟进时长：`followUpResolvedAt - reopenedAt`

## 16. 安全、权限与合规边界

### AI 数据访问边界

AI 只能访问经过授权、脱敏和字段裁剪后的业务上下文。模型上下文由服务端白名单构造，前端不能直接决定向模型传入哪些字段。

禁止传入 AI 的内容：

- 生产密钥、API Token、数据库连接串和内部系统凭证。
- 完整消费者地址、手机号、邮箱、证件号等无关个人敏感信息。
- 与当前服务工单无关的消费者历史数据。
- 未授权的内部私有文档、未发布规则和跨团队敏感资料。
- 支付凭证、风控命中细节和商家内部处罚策略。

允许传入 AI 的内容：

- 当前 `ServiceCase` 的脱敏摘要。
- 与当前工单直接相关的订单、物流、售后和商家上下文。
- 已发布且适用于当前地区和语言的知识库片段。
- 经过脱敏的历史沟通摘要。

### 最小权限原则

- AI 服务使用独立服务账号，不复用管理员或开发者账号。
- 服务账号只具备读取必要上下文字段和写入 AI 交互记录的权限。
- 知识库检索按地区、语言、生效状态和可见范围过滤。
- BFF 层负责权限判断，AI 层不直接访问生产数据库。
- 高风险动作如退款、赔付、售后关闭、商家处罚必须走人工确认和业务系统原有权限校验。

### 权限模型

系统采用 RBAC + Resource Scope + Field-level Masking。

- RBAC 决定角色能执行哪些动作。
- Resource Scope 决定角色能访问哪些工单、队列、商家、地区和知识域。
- Field-level Masking 决定字段以明文、脱敏、摘要或省略的形式返回。

角色矩阵：

| 角色 | 可访问资源 | 可见字段 | 可执行动作 |
| --- | --- | --- | --- |
| `Agent` 平台客服 | 自己负责的 case、所在队列 case | 消费者必要联系信息脱敏展示，订单、物流、售后必要字段 | 查看、回复、采纳或编辑 AI 草稿、升级 case |
| `Supervisor` 客服主管 | 团队 case、高风险 case、升级 case | 比 Agent 更多，但敏感字段仍按需展示 | 复核回复、调整风险、关闭或重开 case、分配客服 |
| `MerchantOperator` 商家运营 | 本商家相关 case 的脱敏视图 | 不看完整消费者 PII，只看问题摘要、商品、售后原因和商家处理要求 | 查看归因、处理商家侧待办、维护商品 FAQ 草稿 |
| `PlatformOperator` 平台运营 | 跨商家、跨地区聚合数据、知识库缺口、规则问题 | 默认看聚合和脱敏数据，不看完整会话 PII | 查看趋势、维护知识库、调整规则说明 |
| `Admin` 系统管理员 | 系统配置、权限配置、模型和 Prompt 配置 | 不默认拥有业务明文数据查看权 | 管理账号、配置、开关和审计策略 |
| `AIServiceAccount` AI 服务账号 | 当前 case 的脱敏 ContextSnapshot 和授权知识片段 | 只读白名单字段 | 生成 AIInteraction、写审计，不执行业务动作 |

关键约束：

- `MerchantOperator` 不能查看完整消费者 PII。
- `Admin` 不默认拥有业务明文数据查看权。
- `AIServiceAccount` 不能绕过 BFF 权限过滤直接读取生产数据库。
- 所有 BFF 响应必须先通过权限判断和字段脱敏，再返回前端或进入 AI 上下文。

### 字段可见性策略

字段可见性分为五级：

- `clear`：返回原始明文字段。
- `masked`：返回部分脱敏字段。
- `summary`：返回自然语言摘要，不返回原始值。
- `aggregate`：只返回聚合或分组结果。
- `omitted`：不返回该字段。

示例字段矩阵：

| 字段 | Agent | Supervisor | MerchantOperator | PlatformOperator | Admin | AIServiceAccount |
| --- | --- | --- | --- | --- | --- | --- |
| `consumer.name` | masked | masked | omitted 或别名 | aggregate | omitted | 别名 |
| `consumer.email` | masked | masked | omitted | omitted | omitted | omitted |
| `consumer.phone` | masked | masked 或按需 clear | omitted | omitted | omitted | omitted |
| `shippingAddress` | 国家/地区和粗粒度城市 | masked 或按需 clear | omitted | aggregate | omitted | 国家/地区 |
| `consumer.country` | clear | clear | clear | clear | clear | clear |
| `order.amount` | clear 或区间 | clear | 本商家订单 clear | aggregate 或区间 | omitted | 区间或必要字段 |
| `complaintText` | clear 必要内容 | clear 必要内容 | summary | aggregate summary | omitted | 脱敏 summary |
| `internalRiskDetail` | omitted | masked | omitted | aggregate | omitted | omitted |

脱敏原则：

- 默认不向商家运营、平台运营、管理员和 AI 服务账号暴露完整消费者 PII。
- `Supervisor` 的明文查看应按需触发，并写入审计。
- `AIServiceAccount` 优先使用 summary、masked 和 aggregate 数据。
- 字段脱敏发生在 BFF 或服务端聚合层，不能依赖前端隐藏字段。

明文查看轻量审计要求：

- 第一阶段不实现明文字段查看能力。
- 后续如支持主管查看更完整字段，必须记录 `actorId`、`serviceCaseId`、`fieldNames`、`reason` 和 `createdAt`。
- 明文查看需要用户输入业务原因，例如客户身份核验、升级投诉处理或监管请求。
- 禁止批量导出消费者 PII。
- `Admin` 不默认拥有业务明文字段查看权，也不能绕过业务角色直接查看消费者隐私。

### 受控运行环境

- 第一阶段只使用 mock 数据，不接触真实客户数据。
- 后续接入真实系统时，开发、测试、预发和生产环境隔离。
- 非生产环境使用脱敏数据或合成数据。
- 模型调用日志不得记录原始敏感字段。
- Prompt、模型版本和知识库版本需要可追踪。

### 输出安全

- 回复草稿必须展示引用依据。
- 涉及退款、赔付、售后关闭、时效承诺时展示人工确认提示。
- AI 无法判断时返回人工处理建议。
- 安全校验失败的草稿不进入客服可发送状态。
- AI 输出不得绕过平台规则、权限系统或人工审批流程。
- AI 输出不得生成未被知识引用支持的补偿金额、退款结果或确定送达时间。

### 跨境与隐私合规

天猫海外场景涉及消费者隐私、订单履约、售后责任和跨境数据处理，AI coding 和 AI 业务调用都需要遵守公司数据分级与合规政策。

合规要求：

- 消费者个人信息默认脱敏，只有业务必要字段进入模型上下文。
- 跨境数据访问遵守地区合规要求和公司内部审批流程。
- AI 不应把某一地区的规则错误应用到另一地区。
- 历史 AI 结果保留当时引用的知识版本，不能被后续规则更新静默改写。
- 删除、导出、纠错等数据主体权利相关能力应由原业务系统负责，AI 只能辅助识别和解释。

### 审计

审计记录：

- AI 输入上下文快照。
- AI 输出。
- 引用知识版本。
- Prompt 版本。
- Model 版本。
- 客服采纳、编辑、忽略或负反馈。
- 风险等级变更事件。
- 操作时间。
- 操作人。
- 权限拒绝、AI 安全拦截、schema 校验失败和模型调用失败。

## 17. 工程变更与代码审查机制

### 变更管理

每个功能变更应对应一个可追踪工作项。

推荐链路：

```txt
Feature Spec / Issue -> Implementation Branch -> Pull Request -> Review -> CI -> Merge
```

每个 PR 需要说明：

- 业务背景：为什么需要这个变更。
- 变更范围：改了哪些模块和数据流。
- 风险点：是否涉及权限、数据、AI 输出、安全或迁移。
- 验证结果：贴出 lint、typecheck、test、build 的结果。
- 回滚方式：如何关闭功能、回退配置或恢复旧行为。

### 强制代码审查范围

AI 生成代码不能直接合并。以下变更必须由人工 review：

- 鉴权和权限判断。
- 支付、退款、赔付和售后关闭。
- 数据删除、数据导出和隐私相关逻辑。
- 数据库迁移脚本。
- AI prompt、安全策略和输出过滤规则。
- 缓存 key、幂等 key、队列重试策略。
- BFF 聚合权限和敏感字段脱敏。
- 生产配置、密钥管理和环境变量。

### Review 关注点

代码审查需要检查：

- 是否遵守最小权限原则。
- 是否泄露消费者、订单、商家或内部知识库敏感数据。
- 是否存在越权访问、IDOR 或未校验的 `caseId` / `orderId`。
- AI 输出是否经过 schema 校验和安全过滤。
- 高风险动作是否仍由人工确认和原业务系统执行。
- 数据库查询是否有分页、索引和范围限制。
- 是否有可回滚方案。

## 18. CI/CD 与自动化验证

### 测试工程技术选型

推荐测试栈：

| 测试层级 | 技术选型 | 作用 |
| --- | --- | --- |
| 类型检查 | `tsc --noEmit` | 验证 TypeScript 类型正确性，提前发现模型字段和组件 props 不一致 |
| 代码规范 | ESLint | 维持代码规范，作为最基础 CI 门禁 |
| 单元测试 | Vitest | 测试业务函数、风险规则、AI 输出结构、指标计算和 stale 判断 |
| 组件测试 | React Testing Library | 测试工单列表、详情区、AI 面板等组件的用户可见行为 |
| API/BFF 测试 | Vitest + MSW | 模拟后端接口，验证 BFF 聚合、权限过滤和错误降级 |
| Mock API | MSW | 在测试和本地开发中模拟 API，避免依赖真实后端 |
| E2E 测试 | Playwright | 覆盖客服工作台主流程和跨浏览器真实交互 |
| 覆盖率 | Vitest Coverage / V8 | 统计核心业务逻辑覆盖率，不追求 UI 代码全覆盖 |
| CI | GitHub Actions | 执行 typecheck、lint、test、build 和 e2e 门禁 |

分阶段接入建议：

- 第一阶段：使用 `tsc --noEmit`、ESLint 和 `next build` 作为最低门禁。
- 第二阶段：接入 Vitest、React Testing Library 和 MSW，覆盖业务函数与核心组件。
- 第三阶段：接入 Playwright 和 GitHub Actions，覆盖完整客服工作台流程。
- 第四阶段：补充 coverage、权限边界测试、脱敏测试和 AI schema 校验测试。

选型理由：

- Vitest 与 TypeScript 和 Vite 生态兼容度高，执行速度快，适合测试 `lib/` 中的业务逻辑。
- React Testing Library 鼓励从用户行为验证组件，适合测试工单切换和 AI 面板展示。
- MSW 可以在不启动真实后端的情况下模拟 BFF/API 响应，适合 mock-first 到 API-first 的演进。
- Playwright 覆盖真实浏览器交互，适合验证简历 Demo 的核心用户路径。
- GitHub Actions 对开源和个人项目友好，便于在简历项目中展示工程完整度。

### Next.js 16 / React 19 兼容性边界

当前项目使用 Next.js 16 和 React 19。测试工具接入前需要阅读当前版本的 `node_modules/next/dist/docs/` 相关文档，避免沿用旧版 Next.js 测试方式。

测试边界：

- Vitest 主要用于纯 TypeScript 业务逻辑、工具函数、指标计算、风险规则和 AI 输出结构校验。
- React Testing Library 主要用于客户端组件和用户可见行为，不强行覆盖所有 Server Component 细节。
- Next.js Server Component、Route Handler、缓存行为和页面级数据流优先通过集成测试或 Playwright 验证。
- MSW 用于模拟 BFF/API 响应，避免组件测试和集成测试依赖真实后端。
- Playwright 用于验证真实浏览器中的首页工作台主流程，是页面级行为的最终兜底。
- Next.js 或 React 大版本升级前，需要重新检查测试工具兼容性和官方 testing 文档。

不推荐的做法：

- 不用组件单测强行模拟复杂 Server Component 内部实现。
- 不把 MSW 当成真实权限系统或真实数据库的替代品。
- 不用 E2E 覆盖所有边界分支，E2E 只保留核心用户路径。
- 不在没有版本验证的情况下照搬旧版 Next.js 测试配置。

### 第一阶段本地验证

第一阶段至少执行：

```bash
npm run lint
npm run build
```

建议补充脚本：

```bash
npm run typecheck
npm run test
npm run test:coverage
npm run test:e2e
```

如果项目还没有测试框架，第一阶段可以先用 `lint` 和 `build` 作为最低门禁，并在后续接入 Vitest、React Testing Library 和 Playwright。

### 后续 CI 门禁

推荐 CI pipeline：

```txt
install -> typecheck -> lint -> unit test -> integration test -> e2e test -> build
```

建议脚本：

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:component": "vitest run tests/components",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "build": "next build"
  }
}
```

### 自动化测试覆盖

单元测试：

- `buildAiAssistantResult()` 输出结构。
- 风险等级冲突规则。
- stale AIInteraction 判断。
- AI 采纳率指标计算。
- 知识引用版本匹配。

集成测试：

- BFF 根据 `caseId` 聚合工单、会话、订单、物流、售后、商家和 AI 结果。
- 无权限用户不能读取不属于自己的工单上下文。
- AI 生成任务使用正确幂等 key。
- 知识库更新后旧 AIInteraction 被标记 stale。

E2E 测试：

- 首页不是默认模板。
- 工单可以切换。
- 不同工单展示不同上下文。
- AI 面板内容随工单变化。
- 高风险工单显示主管复核提示。
- AI 草稿采纳、编辑、忽略操作可见。

安全测试：

- 模型上下文不包含原始手机号、邮箱、地址和密钥。
- BFF 不返回未授权字段。
- AI 输出无法绕过人工确认触发退款或赔付。
- 生产密钥不会出现在日志、前端 bundle 或 AI 输入中。

### 推荐测试目录

后续接入测试框架后，建议使用以下目录：

```txt
tests/
  unit/
    ai-assistant.test.ts
    risk-assessment.test.ts
    metrics.test.ts
  components/
    CaseList.test.tsx
    CaseDetail.test.tsx
    AiAssistantPanel.test.tsx
  integration/
    case-workbench-bff.test.ts
    ai-interaction-stale.test.ts
    permission-boundary.test.ts
  e2e/
    service-workbench.spec.ts
  fixtures/
    service-cases.ts
    knowledge-citations.ts
```

测试命名原则：

- `unit` 测纯业务函数，不依赖浏览器。
- `components` 测用户可见行为，不测组件内部实现。
- `integration` 测 BFF、权限、AIInteraction 和数据聚合边界。
- `e2e` 只覆盖最关键用户路径，避免过多脆弱用例。
- `fixtures` 复用 mock 工单、知识引用和 AI 输出样本。

### 部署门禁

生产部署前必须满足：

- CI 全部通过。
- 高风险变更完成代码审查。
- 数据库迁移有回滚或兼容方案。
- AI prompt 或安全策略变更记录版本。
- 必要时提供灰度、开关或回滚配置。

## 19. 测试策略

### 第一阶段人工验证

验证命令：

```bash
npm run lint
npm run build
```

人工验证：

- 首页不是默认模板。
- 工单可以切换。
- 不同工单展示不同上下文。
- AI 面板内容随工单变化。
- 页面在桌面视口下无重叠。

### 后续阶段测试项

可增加：

- `buildAiAssistantResult()` 单元测试。
- mock 数据完整性测试。
- BFF API 契约测试。
- AI JSON schema 校验测试。
- 风险等级冲突规则测试。
- AIInteraction stale 判断测试。
- 关键查询性能测试。

## 20. ADR

本技术设计已沉淀以下架构决策：

- [ADR 0001: Generate AI Suggestions Asynchronously](../docs/adr/0001-async-ai-suggestion-generation.md)
- [ADR 0002: Persist AI Interactions Instead of Treating Cached AI Output as Truth](../docs/adr/0002-persist-ai-interactions-instead-of-caching-as-truth.md)
- [ADR 0003: Capacity Assumptions for the Service Workbench](../docs/adr/0003-capacity-assumptions-for-service-workbench.md)
- [ADR 0004: Use RBAC with Resource Scope and Field-Level Masking](../docs/adr/0004-rbac-resource-scope-field-masking.md)

后续建议补充 ADR：

- 数据库选型：PostgreSQL 或 MySQL 的选择依据。
- 权限模型：客服、主管、商家运营和平台运营的数据边界。
- 队列方案：AI 生成任务、重试和死信策略。
- 缓存策略：哪些数据可以缓存、TTL 和失效条件。
- 知识检索方案：向量库、版本管理和地区语言过滤。

## 21. 简历技术表述

推荐项目描述：

> 从 0 到 1 设计并开发面向跨境电商客服场景的 AI 全栈服务中台，模拟接入订单、物流、售后、商家和平台规则数据，为客服提供工单摘要、风险识别、处理建议、知识引用和多语言回复草稿。

推荐技术亮点：

- 使用 Next.js 和 TypeScript 构建三栏式客服工作台。
- 设计 mock-first 架构，隔离 UI、业务模型、数据源和 AI 辅助逻辑。
- 抽象 Conversation、ServiceCase、ContextSnapshot、AIInteraction、KnowledgeCitation 和 AIUsageEvent 等核心领域对象。
- 设计异步 AI 生成机制，客服工作台读取最新成功结果，并在上下文变化后提示建议过期。
- 设计结构化 AI 输出、版本化知识引用、人工确认和风险等级事件，避免 AI 直接执行高风险业务动作。
- 规划 BFF、SQL Query Layer、Redis 幂等去重、异步任务、向量检索和审计日志，支撑中大型平台客服场景演进。

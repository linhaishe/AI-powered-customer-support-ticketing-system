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

## 16. 安全与合规设计

### 数据安全

- 模型上下文只传必要字段。
- 消费者敏感信息脱敏。
- AI 交互记录保存上下文快照和输入摘要，不保存无关个人隐私。

### 输出安全

- 回复草稿必须展示引用依据。
- 涉及退款、赔付、售后关闭、时效承诺时展示人工确认提示。
- AI 无法判断时返回人工处理建议。
- 安全校验失败的草稿不进入客服可发送状态。

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

## 17. 测试策略

### 第一阶段

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

### 后续阶段

可增加：

- `buildAiAssistantResult()` 单元测试。
- mock 数据完整性测试。
- BFF API 契约测试。
- AI JSON schema 校验测试。
- 风险等级冲突规则测试。
- AIInteraction stale 判断测试。
- 关键查询性能测试。

## 18. ADR

本技术设计已沉淀以下架构决策：

- [ADR 0001: Generate AI Suggestions Asynchronously](../docs/adr/0001-async-ai-suggestion-generation.md)
- [ADR 0002: Persist AI Interactions Instead of Treating Cached AI Output as Truth](../docs/adr/0002-persist-ai-interactions-instead-of-caching-as-truth.md)
- [ADR 0003: Capacity Assumptions for the Service Workbench](../docs/adr/0003-capacity-assumptions-for-service-workbench.md)

## 19. 简历技术表述

推荐项目描述：

> 从 0 到 1 设计并开发面向跨境电商客服场景的 AI 全栈服务中台，模拟接入订单、物流、售后、商家和平台规则数据，为客服提供工单摘要、风险识别、处理建议、知识引用和多语言回复草稿。

推荐技术亮点：

- 使用 Next.js 和 TypeScript 构建三栏式客服工作台。
- 设计 mock-first 架构，隔离 UI、业务模型、数据源和 AI 辅助逻辑。
- 抽象 Conversation、ServiceCase、ContextSnapshot、AIInteraction、KnowledgeCitation 和 AIUsageEvent 等核心领域对象。
- 设计异步 AI 生成机制，客服工作台读取最新成功结果，并在上下文变化后提示建议过期。
- 设计结构化 AI 输出、版本化知识引用、人工确认和风险等级事件，避免 AI 直接执行高风险业务动作。
- 规划 BFF、SQL Query Layer、Redis 幂等去重、异步任务、向量检索和审计日志，支撑中大型平台客服场景演进。

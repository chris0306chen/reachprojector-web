# 运费与履约安全规则

更新：2026-09-30。工作区：`reachprojector-fulfillment-safety-next`；分支：`agent/fulfillment-safety-next`。

## 已完成

- 用户已确认：**B2B 订单统一全款到账后发货**。B2C 与 B2B 发货均要求服务端订单 `payment_status = paid`；`unpaid`、`partial`、退款和缺失付款状态不得放行。定金金额、尾款金额、物流单号或履约状态本身不能证明到账。
- B2B 可在未付款或部分付款时进入备货；备货不等于允许发货。财务应在核实全款到账后通过受控入账流程维护付款记录。本次不新增入账接口或自动认款逻辑。
- 状态下拉框调用专用状态接口，错误显示在后台。状态接口与填写物流单号复用同一转换规则，新建订单也校验状态与付款的一致性。
- 更新时同时匹配读取时的履约状态和付款状态；若期间发生退款或付款状态改变，返回 409 并要求刷新，避免旧发货请求覆盖新状态。
- 同一物流单号顺序重复提交不会重复发出发货通知；仅在写入成功后触发通知。
- 报价函数拒绝 NaN、Infinity、负数、缺尺寸、非法数量、零计费步长/除数，以及零运费和金额溢出结果。修复小数计费进位与上限判断的浮点误差。异常费率不产生自动报价；若没有其他有效匹配，沿现有逻辑转人工报价。

### 状态转换与付款校验

| 当前状态 | 可转换到 |
| --- | --- |
| pending / pending_payment | paid、preparing、cancelled、refunded |
| paid | preparing、shipped、cancelled、refunded |
| preparing | shipped、cancelled、refunded |
| shipped | delivered、completed、after_sales、refunded |
| delivered / completed | after_sales、refunded |
| after_sales / cancelled | refunded |
| refunded | 无后续转换 |

所有转换仍需满足付款校验：paid / shipped / delivered / completed 要求已全款到账；refunded 要求已存在退款付款记录。B2C preparing 要求已付款；B2B preparing 允许 unpaid / partial / paid。相同状态重复提交也执行付款校验。未知状态直接拒绝。兼容已有 pending、paid、delivered 名称，不迁移历史数据。

取消订单不会自动退款或回补库存；设置 refunded 不会发起退款。支付及退款渠道继续负责实际资金处理。

## 正在做

本阶段代码和回归测试已完成，进入 PR 审阅；未合并、未部署。数据库与通知在接口回归中使用模拟实现，未执行真实交易或发送真实通知。

## 等待用户

B2B 全款发货规则已确认，无需再次确认。以下另列待决策：DDP/DAP 选路优先级、商业费率更新及 Stripe webhook 订单快照方案。本 PR 不修改这些内容。

## 下一步

1. 审阅并合并本阶段 PR；本任务不自动合并或部署。
2. 在测试环境验证真实数据库下的全款发货、部分付款阻断和并发退款场景。
3. 在独立任务中处理待决策的费率选路及支付快照问题。

## 回归验证

运行 `pnpm test:fulfillment`。覆盖报价边界、体积重、数量、最低费用、异常费率、小数进位；当前及历史履约状态、B2B 全款门槛；两个更新接口与创建接口的付款阻断；并发退款和付款变化、缺失订单、数据库错误、通知条件。

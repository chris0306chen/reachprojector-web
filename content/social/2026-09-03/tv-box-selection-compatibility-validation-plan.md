---
status: candidate-comparison-and-test-plan
market: North America, UK, EU
projector_scope: JMGO and XGIMI Chinese-system inventory only
human_review_required: true
compatibility_status: unverified until physical testing
source_inventory: D:/桌面/投影仪在售型号成本.xlsx
---

# 电视盒子选型与兼容性验证：JMGO / XGIMI 欧美销售

## 1. 结论先行

当前建议进入实机测试的候选如下。这里的“优先级”只表示采购前的测试顺序，不表示已兼容。

1. **Google TV Streamer (4K)：三地区主候选。** 官方列出 4K HDR 60fps、Dolby Vision、HDR10/HDR10+/HLG、Dolby Atmos、千兆网口、32GB 存储；北美、英国和欧盟均能找到区域官方销售页面。缺点是 HDMI 线另售，初始设置需要移动设备和 Google Account，且 Wi-Fi 为 802.11ac。
2. **Apple TV 4K（优先 128GB Wi-Fi + Ethernet）：三地区高端备选。** 官方列出 HDMI 2.1、Wi-Fi 6、千兆网口、Dolby Vision/HDR10+/HDR10/HLG、最高 4K60，并提供匹配动态范围和帧率选项。缺点是价格高、HDMI 线另售，初始化及应用获取依赖 Apple Account。
3. **Fire TV Stick 4K Max（第 2 代）：三地区成本型备选。** 官方列出 4K、Dolby Vision、HDR10/HDR10+/HLG、Dolby Atmos、Wi-Fi 6E、16GB；Netflix 官方明确把 Fire TV Stick 4K Max 列为 4K 设备。缺点是棒状机身和供电线更容易在投影机背部形成空间/散热问题，网口需额外配件，账号、商店和广告体验有明显地区差异。
4. **Roku Ultra（4850R）：仅作北美对照，不作为英国/欧盟统一方案。** Roku 美国官方页列出 4K60、Dolby Vision、HDR10+、HDCP 2.2、Wi-Fi 6、百兆网口并含 HDMI 线；当前证据只足以把该 SKU 放入北美测试，不可外推到英国或欧盟。

在收到实际可供货 SKU、包装照片和实测结果前，不指定“最终搭配”，也不对 Netflix/YouTube/Prime Video、HDR、CEC、音频或单遥控作对客承诺。

## 2. 适用库存

库存表中需要纳入此任务的中文系统机型：

| 品牌 | 型号 |
|---|---|
| JMGO | N5S Ultra Max, N5S Ultra, N5S Pro Max, N5S Pro, X50 |
| XGIMI | RS30 Pro, RS30 Pro Max, RS30 Ultra, RS30 Ultra Max, X50 Ultra Max, X50 Ultra |

Hisense / VIDDA 已确认为中英文系统，不属于强制搭配范围。英文界面也不等于海外应用或认证已通过，仍由各型号主研究任务单独核验。

## 3. 候选比较（资料阶段，不等于组合实测）

| 候选 | 建议市场 | 官方资料可确认 | 必须实测的主要风险 | 初步角色 |
|---|---|---|---|---|
| Google TV Streamer (4K) | 北美 / 英国 / 欧盟 | 4K HDR 60fps；DV、HDR10/10+、HLG；Atmos；HDMI 2.1；千兆网口；32GB；区域版含电源适配器/线，HDMI 线另售 | 投影仪 EDID/HDCP 握手；50/60/24Hz 切换；CEC 电源/音量/输入；手机辅助设置；区域应用与插头；是否占用唯一可用 HDMI 或妨碍 eARC | 默认先测 |
| Apple TV 4K 128GB Ethernet | 北美 / 英国 / 欧盟 | 4K60；DV、HDR10+、HDR10、HLG；Atmos；HDMI 2.1；Wi-Fi 6；千兆网口；内容帧率/动态范围匹配；CEC 或 IR 音量控制 | 具体 JMGO/XGIMI 对 CEC、DV、色深和帧率切换的响应；黑屏时长；第三方 app 的帧率匹配；HDMI 线和各区电源线；恢复出厂后的账号流程 | 高端备选 |
| Fire TV Stick 4K Max 2nd Gen | 北美 / 英国 / 欧盟 | 4K；DV、HDR10/10+、HLG；Atmos；Wi-Fi 6E；16GB；Netflix 4K 官方支持；遥控器有兼容设备控制能力 | 棒体空间与散热；供电稳定；CEC/IR 码库是否识别中国型号；自动帧率在 Netflix/Prime/YouTube 的实际行为；以太网配件；区域 Amazon 账号/商店；重置后是否可顺利激活 | 成本型备选 |
| Roku Ultra 4850R | 北美 | 4K60；DV、HDR10/10+、HLG；HDCP 2.2；Wi-Fi 6；百兆网口；含 HDMI 线 | 只测试北美 SKU；频道/账号地区；Netflix 等 app 的帧率限制；CEC/音量；电源适配器；欧洲不可统一供货 | 北美对照 |

### 暂不建议作为首轮统一方案

- **无品牌或未列入 Netflix/平台支持清单的 Android 盒子：** 即使能安装 APK，也不能把“能打开应用”写成 4K/HDR/DRM 认证。
- **仅中国区固件或刷机盒子：** 恢复出厂后可能失去环境，售后难以复现。
- **已停产旧款作为默认组合：** 后续补货、系统更新和区域应用可用性不可控。
- **Roku Ultra 用于英国/欧盟：** 当前查到的是美国 SKU，缺少统一的区域销售与售后证据。

## 4. 测试组合与样本规则

每个“投影仪型号 × 电视盒子精确 SKU × 市场固件/地区”是一个独立组合。不同品牌、相近型号、不同代次或不同地区 SKU 的结果不可互相继承。

首轮可用代表机缩小工作量，但只能用于筛选：

- JMGO：先从 N5S Pro / N5S Ultra 系列各选一台，再覆盖 X50；
- XGIMI：先从 RS30 系列选一台，再覆盖 X50 Ultra 系列；
- 候选盒：Google TV Streamer、Apple TV 4K、Fire TV Stick 4K Max；Roku Ultra 只在北美样本中加入。

进入对客“已验证”名单前，仍需补齐每个实际销售型号。固件、主板或端口布局一致只有在供应商书面确认后才能减少重复测试。

## 5. 实机验证清单

### A. 样品身份与基线

- [ ] 拍摄投影仪底部铭牌、电视盒子型号/代次/区域 SKU、包装条码、插头和配件全家福。
- [ ] 记录投影仪系统版本、固件、序列号后四位、电视盒 OS/版本、应用版本、测试日期和国家/地区设置。
- [ ] 记录每个 HDMI 端口的编号、标注、最高规格、是否同时承担 ARC/eARC；拍摄实际接线。
- [ ] 恢复默认画面/HDMI 设置，记录后续每一项改动，避免把临时设置当成开箱体验。

### B. 首次设置与恢复出厂

- [ ] 全新或恢复出厂后，仅使用包装内配件完成上电；记录是否必须使用手机、二维码、短信、信用卡或地区账号。
- [ ] 分别以美国、加拿大、英国及至少一个欧盟目标国的合法本地账号/网络测试应用商店；不跨区、不侧载。
- [ ] 完成系统更新、遥控配对、语言/时区选择；记录用时和失败点。
- [ ] 再次恢复出厂，确认客户能按随箱说明独立重建环境，且不会依赖卖方账号或隐藏配置。

### C. 应用与认证

对 Netflix、YouTube、Prime Video 逐个记录，不用一个应用的结果代表其他应用：

- [ ] 从该地区官方商店安装/更新，确认能登录、浏览、播放、快进、续播、字幕和切换音轨。
- [ ] 使用平台认可的 4K/HDR 测试内容，记录 UI 显示的 4K、HDR/Dolby Vision、5.1/Atmos 标签；同时读取投影仪输入信息页。
- [ ] Netflix：记录套餐、内容标签、实际最高分辨率/动态范围/音频；确认 HDCP 2.2 链路。
- [ ] YouTube：用 Stats for nerds 记录 viewport、current/optimal resolution、codec、帧率和 dropped frames。
- [ ] Prime Video：记录 UHD/HDR 标识、播放信息和音频输出；不要仅凭盒子系统规格判定应用层输出。
- [ ] 断电重启、待机唤醒和系统更新后各复测一次。

### D. 视频链路与帧率

- [ ] 分别测试 1080p60、4K24、4K25、4K30、4K50、4K60；记录是否可选、是否稳定、有无雪花/黑屏/闪断。
- [ ] 分别测试 SDR、HDR10、HDR10+、HLG、Dolby Vision；不支持时区分“盒子无选项”“投影仪未声明”“握手失败”“应用未输出”。
- [ ] 打开/关闭匹配帧率、匹配动态范围，记录 24p/25p/50p 内容是否正确切换、黑屏时长和音画同步。
- [ ] 测试色彩异常、过曝、黑位抬升、偏色、色深 banding；保留投影仪和盒子设置截图。
- [ ] 直连投影仪后再通过声吧/AVR/HDMI switch 复测；任何中间设备都视为链路的一部分。

### E. HDMI、eARC 与音频

- [ ] 确认盒子占用的 HDMI 口不会阻断客户所需的 eARC；如果投影仪仅有一个满足 4K/HDCP 的端口，标为销售限制。
- [ ] 测试投影仪内置扬声器、3.5mm/光纤（如有）、蓝牙、ARC/eARC 声吧或 AVR。
- [ ] 逐项记录 PCM 2.0、Dolby Digital、Dolby Digital Plus、Atmos 的“盒子输出—投影仪/音响接收—实际有声”结果。
- [ ] 检查 lip-sync、爆音、切片后静音、待机唤醒无声和音量步进。
- [ ] 不能把“支持 Atmos”简化为所有连接方式都能得到 Atmos。

### F. CEC、输入切换与单遥控

- [ ] 盒子遥控开机能否唤醒投影仪并自动切到正确 HDMI。
- [ ] 盒子遥控关机能否让投影仪正常关机，而非仅让盒子休眠。
- [ ] 音量、静音、方向、返回、Home、输入源分别由 CEC、IR 或蓝牙中的哪一种实现。
- [ ] 冷启动、待机、断电恢复、切到游戏机再切回各测试 5 次，记录成功次数。
- [ ] 检查是否仍需投影仪遥控完成对焦、梯形校正、画面模式或输入选择；如需要，不得称“单遥控”。

### G. 网络、输入延迟与稳定性

- [ ] 在 2.4GHz、5GHz、Wi-Fi 6/6E（候选支持时）和 Ethernet（内置或官方适配器）下分别测试。
- [ ] 记录路由器距离、信号强度、吞吐、20 分钟 4K 高码率播放中的缓冲和掉帧。
- [ ] 测试蓝牙耳机/音箱时的延迟和断连；不得把蓝牙结果等同 HDMI 音频。
- [ ] 对云游戏、投屏或互动应用记录总输入延迟；流媒体盒不能改善投影仪自身游戏延迟。
- [ ] 连续播放 4 小时并执行 30 次启动/退出/切应用循环，记录过热、崩溃、重启、HDMI 丢失。

### H. 电源、包装与地区差异

- [ ] 确认电源输入范围、额定功率、线缆长度、插头类型及认证标志；北美 Type A/B、英国 Type G、欧盟 Type C/E/F 分 SKU 记录。
- [ ] 检查盒子、遥控器、电源适配器、电源线、HDMI 线/延长线、电池、说明书和保修文件是否齐全。
- [ ] 不使用无认证旅行转换头作为零售长期方案；每个市场优先使用当地官方 SKU 和原装电源。
- [ ] 核对当地应用、语音助手语言、内容目录、隐私提示、保修主体和退换货地址。
- [ ] 包装说明明确：投影仪是中文原生系统，海外流媒体体验由随附电视盒子提供；两套设备的保修和恢复流程分别写明。

## 6. 记录模板与通过门槛

每条结果使用：`PASS / FAIL / PARTIAL / NOT SUPPORTED / NOT TESTED`。只有 `PASS` 能进入已验证口径；`NOT TESTED` 不能写成“兼容”。

| 字段 | 填写内容 |
|---|---|
| Test ID | 市场-投影仪型号-盒子 SKU-序号 |
| Market | US / CA / UK / EU-国家 |
| Projector | 精确型号、固件、HDMI 端口 |
| Streaming device | 精确商品名、代次、区域 SKU、OS 版本 |
| App/account region | 应用版本、账号地区、套餐层级 |
| Connection | 直连 / AVR / 声吧 / switch；线材型号与长度 |
| Expected | 单一、可观察的预期结果 |
| Actual | 分辨率、Hz、HDR、音频、CEC 行为或错误码 |
| Status | PASS / FAIL / PARTIAL / NOT SUPPORTED / NOT TESTED |
| Evidence | 照片/视频/设置截图文件名 |
| Retest | 更新、断电、重置后的结果 |
| Notes | 地区限制、临时规避、是否影响客户说明 |

建议把“销售可用”定义为：三个核心应用均能从当地官方商店安装并稳定播放；4K 型号至少通过 HDCP 2.2 与 4K60 基线；声明的 HDR/音频格式有实测证据；CEC/遥控行为与说明一致；冷启动、重启、恢复出厂、4 小时稳定性、当地插头和包装均通过。任何一项依赖侧载、卖方账号、隐藏设置或不稳定规避时，不得作为默认组合。

## 7. 售后与客户说明

随箱快速指南至少包含：接线图、正确 HDMI 口、首次设置、地区账号要求、遥控配对、CEC 设置、音频连接、恢复出厂、无信号/无声/无 4K 的排查顺序，以及投影仪与盒子各自售后边界。

主社媒任务在定稿前只采用：

> JMGO and XGIMI models are supplied with a tested streaming solution for straightforward overseas use.

这句话也只能在实际销售组合完成测试后使用。测试前内部占位口径应为：

> A regional streaming solution is being validated for JMGO and XGIMI models intended for overseas use. Final app and feature support depends on the tested projector, streaming device and market combination.

## 8. 用户下一步需要提供

1. 实际可采购的电视盒子完整商品名、代次、区域 SKU、包装正反面和电源铭牌照片；
2. 首批要配套的 JMGO/XGIMI 精确型号及每台固件版本；
3. 目标欧盟国家（至少先定 1-2 个），不能以“EU”代替插头、应用和售后验证；
4. 可用的声吧/AVR、HDMI 线、路由器和当地合法测试账号；
5. 按第 6 节模板回传的实测结果与证据。

收到上述资料后，再把候选升级为确定 SKU、逐型号兼容表、随箱说明和对客口径。

## 9. 官方资料来源

- Google TV Streamer 美国规格：https://store.google.com/product/google_tv_streamer_specs?hl=en-US
- Google TV Streamer 英国规格：https://store.google.com/gb/product/google_tv_streamer_specs?hl=en-GB
- Google TV Streamer 欧盟示例（德国）：https://store.google.com/de/product/google_tv_streamer_specs?hl=de
- Google TV Streamer 设置与 HDCP 2.2 要求：https://support.google.com/chromecast/answer/7022492?hl=en
- Google TV Streamer 接线与 eARC 说明：https://support.google.com/googletv/answer/15273676?hl=en-GB
- Apple TV 4K 规格：https://www.apple.com/apple-tv-4k/specs/
- Apple TV 帧率与动态范围匹配：https://support.apple.com/en-ie/102277
- Apple TV CEC/IR 遥控说明：https://support.apple.com/guide/tv/apple-tv-4k-remote-control-receiver-atvbbe2477c9/26/tvos/26
- Fire TV 设备规格：https://developer.amazon.com/docs/device-specs/device-specifications-fire-tv-streaming-media-player.html
- Fire TV 英国区域页：https://www.amazon.co.uk/Amazon-streaming-device-supports-Vision/dp/B0CJL4J6FG
- Fire TV 德国区域页：https://www.amazon.de/Fire-TV-Stick-4K/dp/B0CJKTWTVT
- Roku Ultra 4850R 美国规格：https://www.roku.com/en-us/products/players/roku-ultra
- Netflix on Fire TV：https://help.netflix.com/en/node/23934
- Netflix on Apple TV：https://help.netflix.com/en/node/23887
- Netflix on Google TV Streamer：https://help.netflix.com/fil/node/220714777399908

## 10. 当前限制

- 尚未收到实际电视盒子型号、区域 SKU 或任何实机测试结果。
- 官方“设备支持某格式”不等于该格式能通过某一台中文系统投影仪、特定 HDMI 口、线材和音响链路稳定输出。
- YouTube、Prime Video 和 Netflix 的具体画质/音频还会受到账号、套餐、片源、地区、应用版本和网络影响。
- 候选价格、库存、插头、保修与地区应用会变化，正式采购前必须再次核验当地官方 SKU。

# Toy 审核与帝王 MiniTool 交付

日期：2026-10-31。

## Toy

- 名称：帝王评分卡 · XDRate Emperor。
- 地址标识：`XDRateEmperor`。
- 提交内容：已确认的五德中央国号头像版，目录 `output/emperor-placeholder-LwRIzr`。
- 首次提交提示缺少必要文件；补充独立封面、图标后提交成功。
- Toy ID：`50050499867648`。
- 接口返回状态：`auditing`（审核中），尚未公开发布。
- 新预览：https://www.bilibili.com/toy/preview/author_Ve6Szu7Q/index.html
- 本次未更新音乐版或游戏版。

## 帝王 MiniTool 独立包

- ZIP：`artifacts/minitool/xdrate-emperor-five-virtues-20261031.zip`。
- SHA-256：`44d3c19e5b69031b6085ed9bf92cd000996a393dea7cc3e270c73c27ac0689cf`。
- 文件数：47，压缩包大小：1,706,203 字节，约 1.63 MiB。
- 独立入口：`emperor-minitool/index.html`；构建配置：`vite.emperor-minitool.config.ts`。
- 构建打包：`npm run emperor:minitool:pack`。原音乐版 MiniTool 命令保留，帝王包不使用旧音乐版入口。
- 共用帝王名录、五德头像、两套评分算法和草稿编辑界面；上传图片仍可使用。
- 图片采用本地 Canvas 排版，替代网页 HTML 截图及下载依赖；支持原始长图及 11 种固定比例。固定比例完整容纳同一长图并留白，长内容推荐原始长图。
- Canvas 版与 Toy 网页评分卡排版不同；“上次生成的图片”才是相册保存的实际内容。
- 保存链路为完整 PNG data URI → `writeTempFile` → `saveImageToPhotosAlbum`。拒绝授权、取消、失败及接口不可用分别提示。
- JSON 备份在容器内改为可选择复制、粘贴恢复的文本；不使用 JSON 文件选择、剪贴板 API 或网页下载。
- ZIP 只包含离线页面、样式、脚本与五德国号图片，不含源码、依赖目录及开发文档。

## 重点验证

- TypeScript 类型检查通过。
- 项目 MiniTool 静态检查：0 警告、0 错误。
- 技能附带的产物审计：构建目录及 ZIP 通过。
- 浏览器移动视口验证：评分后刷新保持、4:5 PNG 为 1920×2400、无脚本运行错误。
- 模拟原生相册接口：写临时文件和保存各调用一次，保存数据与 PNG 预览完全相同。
- 审计确认包内没有网页下载链路，入口使用外部普通脚本及相对本地资源。
- 本轮未做 Chrome 61 / Android 8.1 真机验证，也没有实际写入手机相册；需导入小红书容器继续验收。
- 小工具包已导出，本次未上传或发布小红书小工具。

## 使用的技能

- Toy：`C:/Users/墨家修士/.agents/skills/toy/SKILL.md`。
- MiniTool：`C:/Users/墨家修士/.agents/skills/minitool-zip-builder/SKILL.md`。
- 浏览器验收：`C:/Users/墨家修士/.codex/skills/playwright/SKILL.md`。

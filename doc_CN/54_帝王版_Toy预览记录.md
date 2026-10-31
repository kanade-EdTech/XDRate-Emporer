# 帝王版 Toy 预览记录

日期：2026-10-31。

最新五德中央国号头像预览：https://www.bilibili.com/toy/preview/author_shL5gAs5/index.html ，见 [57 记录](./57_五德中央国号头像与Toy预览.md)。

更新：画像与繁体隶书国号修正版预览为 https://www.bilibili.com/toy/preview/author_bkj0lYyW/index.html ，详见 [55 修复记录](./55_画像缺失原因与国号字牌修复.md)。下文保留首次上传记录。

- 用户确认新建独立帝王条目，地址使用 `XDRateEmperor`。
- 名称：帝王评分卡 · XDRate Emperor；分类：TOOL。
- 上传目录：`output/emperor-placeholder-aVHRDo`。
- 包含双算法、独立一句话评价、总体评价、备份恢复、图片导出及自选画像；无内置画像。
- 类型检查、占位图产物检查及 Toy 内容预检通过。Toy 预检唯一 WARN 为建议 slug 使用小写；按用户确认保留大小写。
- 预览链接：https://www.bilibili.com/toy/preview/author_DWBUA7Jl/index.html
- 当前仅生成预览，未提交审核，CLI 未返回正式 Toy ID。

本次命令：

```powershell
toy create output/emperor-placeholder-aVHRDo --title '帝王评分卡 · XDRate Emperor' --slug XDRateEmperor --category TOOL --json
```

现有 XDRateMusic、XDRateGames 条目未被更新。只有用户检查预览并明确要求提交后，才按 Toy skill 用相同参数加 `--yes` 提交审核。

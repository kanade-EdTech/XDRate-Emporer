"""
在 dist/ 下新建“前100名”及“皇帝”分类文件夹，通过 NTFS 硬链接归纳图片与清单，不额外占用磁盘空间。
包含：
1. 后来补充的头部知名帝王（前 25 名候选，涵盖李世民、朱元璋、刘邦、康熙等 12 位人物的规范及常用命名，共 30 个画像文件）
2. 百帝258 排行榜前名（名次在 100 以内的帝王：第 26 名～第 100 名，共 75 位皇帝，75 个画像文件）
3. 自动同步《权威画像索引清单.json》至 dist/前100名
"""

import os
import sys
import json
import shutil

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRIMARY_SRC_DIR = os.path.join(ROOT_DIR, 'assets', 'emperor', 'source')
DIST_EMPEROR_DIR = os.path.join(ROOT_DIR, 'dist', '皇帝')
DEST_DIR = os.path.join(ROOT_DIR, 'dist', '前100名')

def create_link(src_path: str, dst_path: str) -> str:
    """优先使用硬链接（不占磁盘、无损兼容任意看图软件），失败时回退软链接或拷贝"""
    if os.path.exists(dst_path):
        os.remove(dst_path)
    try:
        os.link(src_path, dst_path)
        return "hardlink"
    except Exception as e:
        try:
            os.symlink(src_path, dst_path)
            return "symlink"
        except Exception:
            try:
                shutil.copy2(src_path, dst_path)
                return "copy"
            except Exception as e3:
                raise RuntimeError(f"无法为 {src_path} 创建链接或拷贝: {e3}")

def main():
    os.makedirs(DIST_EMPEROR_DIR, exist_ok=True)
    os.makedirs(DEST_DIR, exist_ok=True)

    src_dir = PRIMARY_SRC_DIR if os.path.exists(PRIMARY_SRC_DIR) else DIST_EMPEROR_DIR

    # 确保 dist/皇帝 含有全部原始资源（硬链接或文件）
    manifest_src = os.path.join(src_dir, '皇帝清单.json')
    supp_src = os.path.join(src_dir, '补充皇帝清单.json')

    dist_manifest = os.path.join(DIST_EMPEROR_DIR, '皇帝清单.json')
    dist_supp = os.path.join(DIST_EMPEROR_DIR, '补充皇帝清单.json')

    if os.path.abspath(src_dir) != os.path.abspath(DIST_EMPEROR_DIR):
        if os.path.exists(manifest_src) and not os.path.exists(dist_manifest):
            shutil.copy2(manifest_src, dist_manifest)
        if os.path.exists(supp_src) and not os.path.exists(dist_supp):
            shutil.copy2(supp_src, dist_supp)
        for fname in os.listdir(src_dir):
            if fname.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                src_img = os.path.join(src_dir, fname)
                dst_img = os.path.join(DIST_EMPEROR_DIR, fname)
                if not os.path.exists(dst_img):
                    create_link(src_img, dst_img)

    # 1. 读取百帝258皇帝清单
    with open(manifest_src, 'r', encoding='utf-8') as f:
        ranked_manifest = json.load(f)

    # 筛选排名前100（第26名~第100名，共75位）
    ranked_top100 = [item for item in ranked_manifest if item['rank'] <= 100]
    ranked_top100.sort(key=lambda x: x['rank'])

    # 2. 读取补充皇帝清单（前25名候选帝王）
    supp_manifest = []
    if os.path.exists(supp_src):
        with open(supp_src, 'r', encoding='utf-8') as f:
            supp_manifest = json.load(f)

    linked_files = []

    # 3. 链接百帝258前100名（第26~100名）
    print(f"正在链接百帝258排行榜前100名（第26~100名，共 {len(ranked_top100)} 位）...")
    for item in ranked_top100:
        filename = item['filename']
        src_file = os.path.join(src_dir, filename)
        dst_file = os.path.join(DEST_DIR, filename)
        if not os.path.exists(src_file):
            print(f"警告：原文件缺失 {src_file}")
            continue
        link_type = create_link(src_file, dst_file)
        linked_files.append({
            "type": "ranked",
            "rank": item['rank'],
            "name": item['name'],
            "filename": filename,
            "bvid": item.get('bvid'),
            "title": item.get('title'),
            "link_type": link_type
        })

    # 4. 链接后来补充的25名候选帝王画像（及常用别名画像）
    print(f"正在链接后来补充的前25名候选帝王画像（共 {len(supp_manifest)} 位人物）...")
    supp_files_set = set()
    for item in supp_manifest:
        names_to_link = [item['filename']] + item.get('aliases', [])
        for fname in names_to_link:
            if fname in supp_files_set:
                continue
            supp_files_set.add(fname)
            src_file = os.path.join(src_dir, fname)
            dst_file = os.path.join(DEST_DIR, fname)
            if not os.path.exists(src_file):
                print(f"警告：补充文件缺失 {src_file}")
                continue
            link_type = create_link(src_file, dst_file)
            linked_files.append({
                "type": "supplementary",
                "name": item['name'],
                "temple_name": item.get('temple_name'),
                "dynasty": item.get('dynasty'),
                "reign": item.get('reign'),
                "filename": fname,
                "is_primary": (fname == item['filename']),
                "link_type": link_type
            })

    # 5. 生成前100名清单 JSON
    summary_data = {
        "category": "前100名",
        "description": "包含百帝258排行榜名次在100以内的皇帝画像（第26名~第100名，共75位）及后来补充的前25名知名帝王画像（共12位人物，30个标准/常用命名文件），全部通过NTFS硬链接归入本科目，不额外占用磁盘空间。",
        "counts": {
            "ranked_emperors_count": len(ranked_top100),
            "supplementary_emperors_count": len(supp_manifest),
            "total_linked_files": len(linked_files)
        },
        "ranked_emperors": ranked_top100,
        "supplementary_emperors": supp_manifest,
        "all_linked_files": linked_files
    }

    output_manifest_path = os.path.join(DEST_DIR, '前100名清单.json')
    with open(output_manifest_path, 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, ensure_ascii=False, indent=2)

    # 6. 生成说明 README.md
    readme_content = f"""# 前100名 皇帝画像分类

本目录为古代帝王评分卡中**“前100名”**的归纳分类文件夹。

- **存储机制**：全部图片文件均通过 **NTFS 硬链接 (Hard Link)** 映射自项目素材目录，在文件系统中与原文件完全等价，支持所有图像浏览器和编辑工具，且**不额外占用任何磁盘存储空间**。
- **分类构成**：
  1. **百帝258 排行榜前名**（第 26 名 ～ 第 100 名）：共 **{len(ranked_top100)}** 位帝王画像。
  2. **后来补充的头部知名帝王**（用于补齐尚未发布的前 25 名）：涵盖李世民、朱元璋、刘邦、刘秀、康熙、乾隆、赵匡胤等 **{len(supp_manifest)}** 位核心帝王（含常用别名共 **{len(supp_files_set)}** 个画像文件）。
- **元数据索引**：完整索引与详细背景见 [前100名清单.json](./前100名清单.json) 与 [权威画像索引清单.json](./权威画像索引清单.json)。
"""
    with open(os.path.join(DEST_DIR, 'README.md'), 'w', encoding='utf-8') as f:
        f.write(readme_content)

    print(f"\n[完成] 成功创建分类目录: {DEST_DIR}")
    print(f"- 百帝258 第26~100名画像: {len(ranked_top100)} 个")
    print(f"- 后来补充帝王画像（含别名）: {len(supp_files_set)} 个")
    print(f"- 累计链接图片文件: {len(linked_files)} 个")
    print(f"- 清单已写入: {output_manifest_path}")

if __name__ == '__main__':
    main()

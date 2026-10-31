"""
百帝258 皇帝画像/封面批量下载与命名脚本
Bilibili space: https://space.bilibili.com/1374011695/upload/video
"""

import os
import re
import sys
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(ROOT_DIR, 'dist', '皇帝')
MID = 1374011695


def fetch_all_uploader_videos(session: requests.Session, mid: int):
    url = 'https://api.bilibili.com/x/v2/medialist/resource/list'
    params = {
        'type': 1,
        'biz_id': mid,
        'ps': 30
    }
    all_videos = []
    page = 1
    while True:
        res = session.get(url, params=params, timeout=15).json()
        if res.get('code') != 0:
            print(f"获取视频列表错误: {res}")
            break
        data = res.get('data', {})
        media_list = data.get('media_list', [])
        if not media_list:
            break
        all_videos.extend(media_list)
        if not data.get('has_more'):
            break
        params['oid'] = media_list[-1]['id']
        page += 1
        time.sleep(0.1)
    return all_videos


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': f'https://space.bilibili.com/{MID}/upload/video'
    })

    print(f"正在从 B 站获取博主 (mid: {MID}) 的全部视频列表...")
    videos = fetch_all_uploader_videos(session, MID)
    print(f"共拉取到 {len(videos)} 个视频条目。")

    unique_videos = {}
    for v in videos:
        bvid = v.get('bv_id')
        if bvid and bvid not in unique_videos:
            unique_videos[bvid] = v

    pattern = re.compile(r'中国皇帝258排行榜-第(\d+)名-(.+)')
    items_to_download = []

    for bvid, v in unique_videos.items():
        title = v.get('title', '').strip()
        m = pattern.search(title)
        if m:
            rank = int(m.group(1))
            name = m.group(2).strip()
            safe_name = re.sub(r'[\\/:*?"<>|]', '_', name)
            filename = f"第{rank:03d}名_{safe_name}.jpg"
            cover_url = v.get('cover', '').strip()
            if cover_url.startswith('http://'):
                cover_url = 'https://' + cover_url[7:]
            items_to_download.append({
                'rank': rank,
                'name': name,
                'safe_name': safe_name,
                'filename': filename,
                'bvid': bvid,
                'title': title,
                'cover_url': cover_url,
                'intro': v.get('intro', ''),
                'pubtime': v.get('pubtime', 0)
            })

    items_to_download.sort(key=lambda x: x['rank'])
    print(f"筛选出皇帝排行视频: {len(items_to_download)} 个（第 {items_to_download[0]['rank']} 名 至 第 {items_to_download[-1]['rank']} 名）。")

    def download_one(item):
        filepath = os.path.join(OUTPUT_DIR, item['filename'])
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1024:
            return item['rank'], True, "已存在"
        url = item['cover_url']
        for attempt in range(3):
            try:
                resp = session.get(url, timeout=15)
                if resp.status_code == 200 and len(resp.content) > 1024:
                    with open(filepath, 'wb') as f:
                        f.write(resp.content)
                    return item['rank'], True, f"下载成功 ({len(resp.content)} 字节)"
                time.sleep(1)
            except Exception as e:
                if attempt == 2:
                    return item['rank'], False, str(e)
                time.sleep(1)
        return item['rank'], False, "超过重试次数"

    print("开始并发下载图片...")
    results = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_one, item): item for item in items_to_download}
        for future in as_completed(futures):
            rank, success, msg = future.result()
            results.append((rank, success, msg))
            if len(results) % 30 == 0 or len(results) == len(items_to_download):
                print(f"下载进度: {len(results)}/{len(items_to_download)}")

    failures = [r for r in results if not r[1]]
    print(f"下载完毕！成功: {len(results) - len(failures)}, 失败: {len(failures)}")

    manifest_path = os.path.join(OUTPUT_DIR, '皇帝清单.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(items_to_download, f, ensure_ascii=False, indent=2)
    print(f"清单文件已保存至: {manifest_path}")


if __name__ == '__main__':
    main()

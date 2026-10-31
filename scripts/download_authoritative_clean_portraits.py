import os
import sys
import json
import time
import urllib.request
import urllib.parse
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = os.path.join(ROOT_DIR, 'assets', 'emperor', 'source')
CATALOG_PATH = os.path.join(ROOT_DIR, 'dist', '前100名', '权威画像索引清单.json')

with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

items = catalog.get('items', [])

# Map of specific clean Wikimedia Commons files for 26-100 emperors
COMMONS_MAPPING = {
    26: 'File:Portrait of the Yongzheng Emperor in Court Dress.jpg',
    27: 'File:Emperor Shizong of Later Zhou.jpg',
    28: 'File:Cao Cao portrait.jpg',
    29: 'File:Ming Renzong.jpg',
    32: 'File:Yan Liben Thirteen Emperors Sui Wendi.jpg',
    34: 'File:Song Zhenzong.jpg',
    35: 'File:Yan Liben Thirteen Emperors Sun Quan.jpg',
    36: 'File:Yan Liben Thirteen Emperors Chen Wendi.jpg',
    38: 'File:Qinshihuang.jpg',
    40: 'File:Song Xiaozong.jpg',
    42: 'File:Ming Xuanzong.jpg',
    44: 'File:Yan Liben Thirteen Emperors Chen Baoxian.jpg',
    47: 'File:Emperor Liezu of Southern Tang.jpg',
    49: 'File:Tang Gaozu.jpg',
    54: 'File:Tang Gaozong.jpg',
    56: 'File:Song Zhezong.jpg',
    57: 'File:Liu Bei portrait.jpg',
    58: 'File:Cao Pi portrait.jpg',
    59: 'File:Han Jingdi.jpg',
    63: 'File:Ming Xiaozong.jpg',
    64: 'File:Tang Wuzong.jpg',
    65: 'File:Yan Liben Thirteen Emperors Chen Baoxian.jpg',
    66: 'File:Tang Xianzong.jpg',
    69: 'File:Song Shenzong.jpg',
    73: 'File:Xiao Yan.jpg',
    74: 'File:Tang Daizong.jpg',
    75: 'File:The Shunzhi Emperor in Court Dress.jpg',
    76: 'File:Tang Xuanzong.jpg',
    78: 'File:YuanEmperorAlbumBuyantuPortrait.jpg',
    81: 'File:Tang Xuanzong (Li Chen).jpg',
    84: 'File:The Jiaqing Emperor in Court Dress.jpg',
    85: 'File:Tuoba Tao.jpg',
    87: 'File:Liao Taizong.jpg',
    88: 'File:Sima Yan (Emperor Wu of Jin).jpg',
    89: 'File:Cao Rui.jpg',
    91: 'File:Wanyan Wuqimai.jpg',
    92: 'File:Song Yingzong.jpg',
    93: 'File:Wu Zetian.jpg',
    94: 'File:The Nurhaci Emperor in Court Dress.jpg',
    95: 'File:Ming Daizong.jpg',
    98: 'File:YuanEmperorAlbumGegeenPortrait.jpg',
    99: 'File:Tang Ruizong.jpg',
    100: 'File:Tuoba Gui.jpg'
}

def download_file(file_title, out_name):
    encoded = urllib.parse.quote(file_title.replace('File:', '').replace(' ', '_'))
    url = f'https://commons.wikimedia.org/wiki/Special:FilePath/{encoded}'
    headers = {
        'User-Agent': 'XDRateEmperorBot/1.2 (research tool; https://github.com/xdrate)'
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()
        if len(data) < 2000:
            raise ValueError(f"Too small: {len(data)} bytes")
        out_path = os.path.join(SOURCE_DIR, out_name)
        tmp = out_path + '.tmp'
        with open(tmp, 'wb') as f:
            f.write(data)
        with Image.open(tmp) as img:
            img.convert('RGB').save(out_path, format='JPEG', quality=95)
        os.remove(tmp)
        return len(data)

def main():
    print(f"开始补充下载 26~100 名权威画像（共 {len(COMMONS_MAPPING)} 位重点帝王）...")
    success = 0
    skipped = 0
    failed = []

    for rank, file_title in COMMONS_MAPPING.items():
        # Find emperor info
        emp = next((x for x in items if x['rank'] == rank), None)
        if not emp:
            continue
        clean_name = emp['name'] + '.jpg'
        out_path = os.path.join(SOURCE_DIR, clean_name)

        # If clean file already exists and valid, skip
        if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
            print(f"[跳过] Rank #{rank:03d} {clean_name} 已存在")
            skipped += 1
            continue

        print(f"正在下载 Rank #{rank:03d} {emp['name']} -> {clean_name} (出处: {file_title})...")
        try:
            time.sleep(1.2)  # Avoid rate limit
            bytes_num = download_file(file_title, clean_name)
            print(f"  [成功] 下载 {bytes_num} 字节")
            success += 1
        except Exception as e:
            print(f"  [失败] {e}")
            failed.append((rank, emp['name'], file_title, str(e)))

    print(f"\n全部执行完毕: 新下载 {success}, 已存在 {skipped}, 失败 {len(failed)}")

if __name__ == '__main__':
    main()

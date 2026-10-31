import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT_DIR, 'assets', 'emperor', 'source')
SUPP_PATH = os.path.join(SRC_DIR, '补充皇帝清单.json')

with open(SUPP_PATH, 'r', encoding='utf-8') as f:
    supp_list = json.load(f)

linked = 0
for emp in supp_list:
    primary = os.path.join(SRC_DIR, emp['filename'])
    if not os.path.exists(primary):
        continue
    for alias in emp.get('aliases', []):
        alias_path = os.path.join(SRC_DIR, alias)
        if not os.path.exists(alias_path):
            try:
                os.link(primary, alias_path)
                linked += 1
                print(f"创建别名硬链接: {alias} -> {emp['filename']}")
            except Exception:
                import shutil
                shutil.copy2(primary, alias_path)
                linked += 1
                print(f"创建别名副本: {alias} -> {emp['filename']}")

print(f"累计补齐别名硬链接: {linked} 个")

import json
import os
import re

roster_file = 'src/domain/emperor/rosterData.ts'
with open(roster_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract emperor objects
blocks = content.split('{\n    id:')
print(f'Roster blocks: {len(blocks) - 1}')

src_dir = 'assets/emperor/source'
missing = []
present = []

for b in blocks[1:]:
    id_m = re.search(r'^\s*[\'"]([^\'"]+)[\'"]', b)
    name_m = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', b)
    img_m = re.search(r'imageFilename:\s*[\'"]([^\'"]+)[\'"]', b)

    eid = id_m.group(1) if id_m else 'unknown'
    name = name_m.group(1) if name_m else 'unknown'
    img = img_m.group(1) if img_m else None

    if not img:
        missing.append((eid, name, 'NO_IMAGE_FILENAME'))
    else:
        p = os.path.join(src_dir, img)
        if not os.path.exists(p):
            missing.append((eid, name, img))
        else:
            present.append((eid, name, img))

print(f'Missing on disk: {len(missing)}')
for m in missing:
    print('Missing:', m)
print(f'Present on disk: {len(present)}')

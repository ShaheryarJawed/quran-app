import json
import os

input_file = 'tafseer-ibn-e-kaseer-urdu.json'
output_file = 'tafseer_ibn_kathir.js'

print(f"Reading {input_file}...")
try:
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Converting to JS variable...")
    js_content = f"window.FULL_TAFSIR_DATA = {json.dumps(data, ensure_ascii=False)};"

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"Successfully created {output_file}")
    
except Exception as e:
    print(f"Error: {e}")

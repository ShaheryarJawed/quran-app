
import json

INPUT_FILE = "tafseer-ibn-e-kaseer-urdu.json"
OUTPUT_FILE = "tafsir_db.js"

try:
    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Loaded {len(data)} keys. Writing to {OUTPUT_FILE}...")
    
    # Write as a simple JS assignment
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("window.TAFSIR_DB = ")
        json.dump(data, f, ensure_ascii=False)
        f.write(";")
        
    print(f"Success! {OUTPUT_FILE} created.")
    
except Exception as e:
    print(f"Error: {e}")

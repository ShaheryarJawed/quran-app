import glob
import json
import re
import os

def check_file(filepath):
    filename = os.path.basename(filepath)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # JS files are usually "window.VAR = { ... }" or similar.
        # We try to extract the JSON object.
        # Find the first '{'
        start_idx = content.find('{')
        # Find the last '}'
        end_idx = content.rfind('}')
        
        if start_idx == -1 or end_idx == -1:
            print(f"Skipping {filename}: Could not find JSON object")
            return

        json_str = content[start_idx:end_idx+1]
        
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            # simple cleanup attempt strings might have issues?
            print(f"Error parsing JSON in {filename}: {e}")
            return

        hadiths = data.get('hadiths', [])
        total = len(hadiths)
        missing_count = 0
        missing_ids = []

        for h in hadiths:
            text = h.get('text', '')
            if not text or not text.strip():
                missing_count += 1
                missing_ids.append(h.get('hadithnumber', 'Unknown'))
        
        print(f"File: {filename}")
        print(f"  Total Hadiths: {total}")
        print(f"  Missing Data (Empty Text): {missing_count}")
        if missing_count > 0:
            # show first 10 missing IDs
            preview = missing_ids[:10]
            print(f"  Sample Missing IDs: {preview}...")
        print("-" * 30)

    except Exception as e:
        print(f"Error processing {filename}: {e}")

def main():
    # Only look for hadith_*.js files
    files = glob.glob('hadith_*.js')
    files.sort()
    
    print("Checking for missing data in hadith_*.js files...")
    print("=" * 40)
    
    for f in files:
        if f == "hadith_data.js": # This might be a helper file, not data
            continue
        check_file(f)

if __name__ == "__main__":
    main()

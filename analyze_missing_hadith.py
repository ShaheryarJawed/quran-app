import os
import json
import re

DIRECTORY = "/Users/shaheryarjawed/Desktop/Quran App"

files = [f for f in os.listdir(DIRECTORY) if f.startswith("hadith_") and f.endswith(".js")]
# exclude 'hadith.js' and 'hadith_data.js' which might be logic or small separate data
# filter for hadith_BOOKNAME.js patterns usually found.
# usage of 'hadith_' prefix seems consistent.

for filename in files:
    if filename in ["hadith.js", "hadith_data.js"]: continue
    
    filepath = os.path.join(DIRECTORY, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract JSON object
        match = re.search(r'=\s*(\{[\s\S]*\});?', content)
        if match:
            data = json.loads(match.group(1))
            hadiths = data.get('hadiths', [])
            
            total = len(hadiths)
            missing = 0
            placeholder_count = 0
            
            for h in hadiths:
                text = h.get('text', '').strip()
                if not text:
                    missing += 1
                elif "معذرت" in text:
                    placeholder_count += 1
            
            if missing > 0 or placeholder_count > 0:
                print(f"{filename}: Total {total}, Missing {missing}, Placeholder {placeholder_count}")
            else:
                print(f"{filename}: All {total} good.")
        else:
            print(f"{filename}: Could not parse JSON structure.")
            
    except Exception as e:
        print(f"Error reading {filename}: {e}")

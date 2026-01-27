import os
import json
import re

def check_hadith_files():
    directory = "/Users/shaheryarjawed/Desktop/Quran App"
    files = [f for f in os.listdir(directory) if f.startswith("hadith_") and f.endswith(".js") and f != "hadith.js" and f != "hadith_data.js"]
    
    report = {}

    for file in files:
        filepath = os.path.join(directory, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Extract JSON from JS variable assignment
            # window.HADITH_DATA_XYZ = { ... }
            match = re.search(r'=\s*(\{[\s\S]*\});?', content)
            if not match:
                print(f"Skipping {file}: Could not parse JSON")
                continue
                
            try:
                data = json.loads(match.group(1))
                name = data.get('metadata', {}).get('name', file)
                hadiths = data.get('hadiths', [])
                
                missing_count = 0
                missing_ids = []
                
                for h in hadiths:
                    text = h.get('text', '').strip()
                    if not text:
                        missing_count += 1
                        missing_ids.append(h.get('hadithnumber'))
                        if len(missing_ids) > 10: # limit reporting
                            pass
                
                report[file] = {
                    "name": name,
                    "total": len(hadiths),
                    "missing_text_count": missing_count,
                    "sample_missing_ids": missing_ids[:10]
                }
                
            except json.JSONDecodeError as e:
                print(f"Error decoding {file}: {e}")

    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    check_hadith_files()

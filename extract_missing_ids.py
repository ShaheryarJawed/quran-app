import os
import json
import re

DIRECTORY = "/Users/shaheryarjawed/Desktop/Quran App"
OUTPUT_FILE = "missing_report.json"

def scan_files():
    report = {}
    total_missing = 0
    
    files = [f for f in os.listdir(DIRECTORY) if f.startswith("hadith_") and f.endswith(".js")]
    
    for filename in files:
        if filename in ["hadith.js", "hadith_data.js"]: continue
        
        book_name = filename.replace("hadith_", "").replace(".js", "")
        filepath = os.path.join(DIRECTORY, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            match = re.search(r'=\s*(\{[\s\S]*\});?', content)
            if match:
                data = json.loads(match.group(1))
                hadiths = data.get('hadiths', [])
                
                missing_ids = []
                for h in hadiths:
                    text = h.get('text', '').strip()
                    # Check for empty or specific placeholder text
                    if not text or "Urdu not available" in text or "معذرت" in text:
                        missing_ids.append(h.get('hadithnumber'))
                
                if missing_ids:
                    report[book_name] = missing_ids
                    total_missing += len(missing_ids)
                    print(f"{book_name}: {len(missing_ids)} missing")
                    
        except Exception as e:
            print(f"Error reading {filename}: {e}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=4)
    
    print(f"\nTotal Missing: {total_missing}")
    print(f"Report saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    scan_files()

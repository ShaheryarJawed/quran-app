import json
import os

def extract_missing_ids(filename, output_file):
    filepath = os.path.join(os.getcwd(), filename)
    print(f"Reading {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract JSON object from JS "window.VAR = { ... }"
    start_idx = content.find('{')
    end_idx = content.rfind('}')
    
    if start_idx == -1:
        print("Could not find JSON start")
        return

    json_str = content[start_idx:end_idx+1]
    data = json.loads(json_str)
    hadiths = data.get('hadiths', [])
    
    missing_list = []
    
    for h in hadiths:
        text = h.get('text', '').strip()
        # Check for empty or placeholder
        if not text or "معذرت" in text:
            missing_list.append(h.get('hadithnumber'))
            
    print(f"Found {len(missing_list)} missing items in {filename}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(missing_list, f)
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    extract_missing_ids("hadith_bukhari.js", "missing_bukhari_ids.json")
    extract_missing_ids("hadith_nasai.js", "missing_nasai_ids.json")

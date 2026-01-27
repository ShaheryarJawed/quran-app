import json
import os

def load_js_hadiths(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        if start_idx == -1 or end_idx == -1: return []
        
        json_str = content[start_idx:end_idx+1]
        data = json.loads(json_str)
        return data.get('hadiths', [])
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return []

def load_json_hadiths(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if isinstance(data, list):
            return data
        elif isinstance(data, dict):
             # nasai_bulk_urdu.json is a list
             # bukhari.json is a dict with "hadiths" key
            return data.get('hadiths', [])
        return []
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return []

def check_coverage(target_name, js_file, source_files):
    print(f"Checking coverage for {target_name}...")
    
    # 1. Identify Missing
    js_data = load_js_hadiths(js_file)
    missing_ids = []
    for h in js_data:
        if not h.get('text', '').strip():
            # Store ID as string for easier comparison
            missing_ids.append(str(h.get('hadithnumber')))
            
    print(f"  Missing in {os.path.basename(js_file)}: {len(missing_ids)}")
    if len(missing_ids) == 0:
        return

    # 2. Check Sources
    found_count = 0
    
    # Create a map of source text by ID
    source_map = {}
    for src_file in source_files:
        src_data = load_json_hadiths(src_file)
        print(f"  Loaded {os.path.basename(src_file)}: {len(src_data)} entries")
        
        for h in src_data:
            num = str(h.get('hadithnumber'))
            text = h.get('text', '').strip()
            if text:
                source_map[num] = text

    # 3. Match
    still_missing = []
    for mid in missing_ids:
        if mid in source_map:
            found_count += 1
        else:
            still_missing.append(mid)

    print(f"  Can fill: {found_count}")
    print(f"  Still missing: {len(still_missing)}")
    if len(still_missing) > 0:
        print(f"  Sample Still Missing: {still_missing[:10]}")
    print("-" * 30)

def main():
    # Check Bukhari
    check_coverage(
        "Bukhari", 
        "hadith_bukhari.js", 
        ["bukhari.json"]
    )

    # Check Nasai
    check_coverage(
        "Nasai", 
        "hadith_nasai.js", 
        ["nasai_bulk_urdu.json", "nasai.json"]
    )

if __name__ == "__main__":
    main()

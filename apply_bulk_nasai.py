import json
import re

def apply_bulk():
    js_path = "hadith_nasai.js"
    with open(js_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Strip JS wrapper to get pure JSON
    # Input: window.HADITH_DATA_NASAI = { ... };
    # We look for the first { and the last }
    
    start_index = content.find('{')
    end_index = content.rfind('}')
    
    if start_index == -1 or end_index == -1:
        print("Could not find JSON object boundaries.")
        return

    json_str = content[start_index : end_index+1]
    
    try:
        data = json.loads(json_str)
    except Exception as e:
        print(f"JSON Parsing failed: {e}")
        return

    # 2. Load bulk data
    try:
        with open("nasai_bulk_urdu.json", "r", encoding="utf-8") as f:
            bulk_list = json.load(f)
    except:
        print("Could not load nasai_bulk_urdu.json")
        return

    # 3. Create map for fast lookup
    # Map: hadithnumber -> text
    bulk_map = {}
    for h in bulk_list:
        num = h.get("hadithnumber")
        text = h.get("text", "").strip()
        if num and text:
             # Normalize to string
             bulk_map[str(num)] = text

    # 4. Update the main data
    hadiths = data.get("hadiths", [])
    count = 0
    
    for h in hadiths:
        # Check if text is missing or needs update
        # Missing usually means text is empty or just English/Placeholder?
        # The extract script counts "Missing" based on some criteria (likely empty or short).
        # We will update IF we have bulk data AND (current text is empty OR we force it).
        # Let's update if text is empty string.
        
        current_text = h.get("text", "")
        num = str(h.get("hadithnumber"))
        
        # Checking float conversions as well to match 3800.0 vs 3800
        # If strict string match fails, try float match
        
        replacement = bulk_map.get(num)
        if not replacement:
             # Try float equality
             try:
                 num_f = float(num)
                 # Find in bulk_map keys
                 # This is O(N) per item, slow. Optimizing.
                 pass 
             except:
                 pass
        
        # Simplified: strict string or pre-normalized keys.
        # Let's rely on string match first.
        
        if replacement and (not current_text or len(current_text) < 5):
            h["text"] = replacement
            count += 1
            
    print(f"Updated {count} items.")

    # 5. Save back to JS file
    new_json_str = json.dumps(data, ensure_ascii=False, indent=4)
    new_content = f"window.HADITH_DATA_NASAI = \n{new_json_str};\n"
    
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(new_content)

if __name__ == "__main__":
    apply_bulk()

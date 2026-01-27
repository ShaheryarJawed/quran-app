import json

def inspect_id(filepath, target_id, is_list=False):
    print(f"Inspecting {filepath} for ID {target_id}")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        hadiths = data if is_list else data.get('hadiths', [])
        
        found = False
        for h in hadiths:
            # Check loose match
            curr_id = h.get('hadithnumber')
            if str(curr_id) == str(target_id):
                print(f"  FOUND ID {target_id}:")
                print(f"  Text: {h.get('text')[:100]}...") # Print first 100 chars
                found = True
                break
        
        if not found:
            print(f"  ID {target_id} NOT FOUND in {filepath}")
            
    except Exception as e:
        print(f"  Error: {e}")

print("--- INSPECTION ---")
inspect_id("bukhari.json", 273, is_list=False)
inspect_id("nasai_bulk_urdu.json", 2199, is_list=True)

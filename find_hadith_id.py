import json
import sys

def find_id(target_id):
    try:
        with open("temp_ibnmajah.json", "r") as f:
            data = json.load(f)
            hadiths = data.get("hadiths", [])
            
            print(f"Total Hadiths in JSON: {len(hadiths)}")
            
            # Check exact match
            found = False
            for h in hadiths:
                # Convert both to string to be safe
                if str(h.get("hadithnumber")) == str(target_id):
                    print(f"FOUND EXACT: {h}")
                    found = True
                    break
            
            if not found:
                 print(f"NOT FOUND: {target_id}")
                 # Print neighbors?
                 # nearby = [h for h in hadiths if abs(float(h.get('hadithnumber', 0)) - float(target_id)) < 5]
                 # for n in nearby:
                 #    print(f"Nearby: {n.get('hadithnumber')} - {n.get('text')[:30]}...")

    except Exception as e:
        print(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        find_id(sys.argv[1])
    else:
        print("Provide ID")

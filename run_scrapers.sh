#!/bin/bash
echo "Starting Bukhari Scraper..."
nohup python3 scrape_bukhari_fix.py > bukhari_log.txt 2>&1 &
echo "Starting Nasai Scraper..."
nohup python3 scrape_nasai_fix.py > nasai_log.txt 2>&1 &
echo "Scrapers running in background. Logs in *_log.txt"
echo "Run 'python3 patch_files.py' occasionally to update the JS files."

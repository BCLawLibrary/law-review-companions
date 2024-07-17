from selenium import webdriver
from selenium.webdriver.firefox.service import Service
import os
import csv

def checkURL(url):
    """Navigate to URL and alert user if URL has changed."""
    print(f'Trying {url}')
    service = Service(log_path=os.devnull) # prevent geckodriver.log file
    driver = webdriver.Firefox(service=service) 
    try:
        driver.get(url)
        if driver.current_url != url:
            print(f'>>> ATTN: Current URL is {driver.current_url}')
    except: 
        if url.startswith("https://") or url.startswith("http://"):
            print(f'>>> ATTN: {url} is unavailable')
        else:
            print(f'>>> ATTN: URL is invalid - ensure that it starts with http:// or https://')
    driver.quit()

with open('companions_2023.csv', 'r') as csvfile:
    read = csv.reader(csvfile, delimiter=',')
    urlList = [i[1] for i in read] # target URL column
    urlList.pop(0) # remove header row

for i in urlList: checkURL(i)

print("All done. Terminating script...")
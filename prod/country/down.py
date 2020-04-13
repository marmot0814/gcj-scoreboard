import json
import subprocess

with open('countries.json', 'r') as f:
    data = json.load(f)
    for key in data:
        subprocess.run(['wget', f'https://www.countryflags.io/{data[key]}/shiny/32.png'])
        subprocess.run(['mv', '32.png', f'{data[key]}.png'])

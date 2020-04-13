from argparse import ArgumentParser
import base64
import json
from selenium import webdriver
from xvfbwrapper import Xvfb
from bs4 import BeautifulSoup
import os
import time
import asyncio
import aiohttp
import datetime
import subprocess

from functools import reduce

def user_url(cid, s, c):
    base_url = 'https://codejam.googleapis.com/scoreboard/%s/poll?p=' % (cid)
    params = base64.b64encode(b'{"min_rank":%d,"num_consecutive_users":%d}' % (s, c)).decode('ascii')
    return base_url + params

def decode(resp):
    return json.loads(base64.urlsafe_b64decode(resp.decode('ascii') + '==='))

async def async_get_url(url):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url=url) as response:
                return await response.read()
    except Exception as e:
        print("Unable to get url {} due to {}.".format(url, e.__class__))

async def async_get_urls(urls):
    return await asyncio.gather(*[async_get_url(url) for url in urls])

def get_urls(urls):
    return [ decode(resp) for resp in asyncio.run(async_get_urls(urls)) ]

def get_problems(url):
    display = Xvfb()
    display.start()
    driver = webdriver.Chrome()
    driver.get(url)
    problems = []
    while len(problems) == 0:
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        problems = soup.find_all("div", class_="problems-nav-selector-item-container")
    driver.quit()
    display.stop()
    return problems

def pod(ctype, cid):
    url = f'https://codingcompetitions.withgoogle.com/{ctype}/round/{cid}'
    ps = [ p.a.attrs['href'].split('/')[-1] for p in get_problems(url) ]
    ps_sort = sorted(ps)
    return [ ps_sort.index(p) for p in ps ]

def initial_json(ctype, cid):
    c_data = get_urls([user_url(cid, 1, 0)])[0]
    c_data['challenge']['title'] = ctype + ' - ' + c_data['challenge']['title']
    c_data['pod'] = pod(ctype, cid)
    c_data = {
        'challenge': {
            'id': c_data['challenge']['id'],
            'tasks': [ {
                'id': c_data['challenge']['tasks'][p]['id'],
                'title': c_data['challenge']['tasks'][p]['title'],
                'test_num': reduce(lambda x, y: x + 1 if y['value'] != 0 else x, c_data['challenge']['tasks'][p]['tests'], 0)
            } for p in c_data['pod'] ],
            'title': c_data['challenge']['title']
        },
        'full_scoreboard_size': c_data['full_scoreboard_size'],
        'user_scores': []
    }
    return c_data

def timeToString(time):
    time //= 1000000
    second = time % 60
    time //= 60
    minute = time % 60
    time //= 60
    return f'{time:0>2}:{minute:0>2}:{second:0>2}'

def process_users(c_data):
    user_scores = []
    for user in c_data['user_scores']:
        task_info = []
        for task in c_data['challenge']['tasks']:
            target = [ item for item in user['task_info'] if item.get('task_id') == task['id'] ]
            if len(target) == 0:
                task_info.append({
                    'total_attempts': 0,
                    'tests': ' ' * task['test_num']
                })
            else:
                task_info.append({
                    'total_attempts': target[0]['total_attempts'],
                    'penalty_attempts': target[0]['penalty_attempts'],
                    'penalty_micros': timeToString(max(0, target[0]['penalty_micros'])),
                    'tests': ('A' * target[0]['tests_definitely_solved'] + '?' * target[0]['tests_possibly_solved']).ljust(task['test_num'], '-')
                })

        user_score = {
            'country': user['country'],
            'displayname': user['displayname'],
            'b64displayname': base64.b64encode(user['displayname'].encode()).decode('ascii'),
            'rank': user['rank'],
            'score_1': user['score_1'],
            'score_2': timeToString(-user['score_2']),
            'task_info': task_info 
        }
        
        user_scores.append(user_score)
    c_data['user_scores'] = user_scores
    return c_data

def update_scoreboard(c_data):
    cid = c_data['challenge']['id']
    tot = get_urls([user_url(cid, 1, 0)])[0]['full_scoreboard_size']
    urls = [ user_url(cid, i + 1, 200) for i in range(0, tot, 200) ]
    user_scores = reduce(lambda x, y: x + y, [ r['user_scores'] for r in get_urls(urls) ])
    c_data['user_scores'] = user_scores
    c_data['full_scoreboard_size'] = tot
    c_data = process_users(c_data)
    return c_data

def main(ctype, cid):
    c_data = initial_json(ctype, cid)
    while True:
        c_data = update_scoreboard(c_data)
        c_data['update_time'] = datetime.datetime.now().__str__()
        with open('.scoreboard.json.swap', 'w') as f:
            f.write(json.dumps(c_data))
        subprocess.run(['mv', '.scoreboard.json.swap', 'scoreboard.json'])
        subprocess.run(['npm', 'run-script', 'build'])
        subprocess.run(['rm', '-rf', '../../prod'])
        subprocess.run(['mv', '../../build', '../../prod'])
        print (c_data['update_time'])
        time.sleep(30)

def get_args():
    parser = ArgumentParser()
    parser.add_argument("ctype")
    parser.add_argument("cid")
    return parser.parse_args()

if __name__ == '__main__':
    args = get_args()
    main(args.ctype, args.cid)

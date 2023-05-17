import json
import requests
import pandas as pd
import html_text
import couchdb
from couchdb.http import Session
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import copy
import os
import logging
import sys

# rank = int(sys.argv[1])

num_processors = 1

# Create logs folder if it does not exist
logs_folder = os.path.join(os.path.expanduser('~'), 'logs')
os.makedirs(logs_folder, exist_ok=True)

# Configure logging to write to the error log file
logging.basicConfig(filename=os.path.join(logs_folder, 'errors.log'), level=logging.ERROR)

# logging.basicConfig(filename='C:/Users/jonat/OneDrive/Documents/University/2023_Semester_1/Cloud_Computing/Project_2/CloudHousingCrisisAnalyser/Mastodon/my_log', level=logging.ERROR) # local

# For running on server -> $ nohup python3 mastodon_scraper.py &

# Mastodon info
URLS = [

    # Technically US based, but essentially the global server
    ('https://mastodon.social/api/v1/timelines/public', 'GLOBAL'),

    # USA based servers
    ('https://urbanists.social/api/v1/timelines/public', 'US'),
    ('https://universeodon.com//api/v1/timelines/public', 'US'),

    # Australian-based
    ('https://theblower.au/api/v1/timelines/public', 'AUS'),

    # Africa-based
    ('https://convo.casa/api/v1/timelines/public', 'AFRICA'),
    ('https://mastodon.africa/api/v1/timelines/public', 'AFRICA')
]

params = {'limit': 40}
set_1 = set()
set_2 = set()
sid = SentimentIntensityAnalyzer()
start_time = pd.Timestamp('now', tz='utc')

# CouchDB info
db_url = 'http://admin:mysecretpassword@172.26.135.198:5984/'
dbname = 'mastodon_test_db'

def pushToCouch(data):

    # Connect to the CouchDB server using the .pem file
    server = couchdb.Server(db_url)

    while True:
        try:
            # Select the database to use
            db = server[dbname]

            # Convert the data to JSON format and insert
            data_json = json.dumps(data)
            db.save(json.loads(data_json))
            break

        except couchdb.http.ServerError as e1:
            logging.error("err1: %s", str(e1))

        except Exception as e:
            logging.error("err2: %s", str(e))
            break

# Retrieves posts since last get request
def getRecent():
    is_end = False
    all_posts = []

    for ur in URLS:
        logging.error("> %d", str(ur))

    for url_pair in URLS:

        server_url = url_pair[0]
        region = url_pair[1]
        params = {'limit': 40}

        while True:
            try:
                r = requests.get(server_url, params=params)
                r.raise_for_status()
                posts = r.json()

            except (requests.exceptions.RequestException, ValueError) as e:
                logging.error(f"Failed to retrieve posts from {server_url}: {str(e)}")
                break

            if len(posts) == 0:
                break

            for post in posts:
                timestamp = pd.Timestamp(post['created_at'], tz='utc')
                if timestamp < start_time:
                    is_end = True
                    break

                post['region_posted'] = region
                all_posts.append(post)
            
            if is_end:
                break

            max_id = posts[-1]['id']
            params['max_id'] = max_id

    return pd.DataFrame(all_posts)

while True:

    try:
        posts = getRecent()

    except Exception as e3:
        posts = []
        logging.error("err1", str(e3))

    if len(posts) > 0:
        start_time = pd.Timestamp(posts.loc[len(posts)-1]['created_at'], tz='utc')

        for i in range(len(posts)):

            set_2.add(posts.loc[i]['id'])

            if posts.loc[i]['id'] not in set_1:

                post_content = posts.loc[i]['content']
                post_text = html_text.extract_text(post_content)

                sentiment = sid.polarity_scores(post_text)['compound']

                post_json = {
                    'text': post_text,
                    'created_at':posts.loc[i]['created_at'],
                    'post_id':posts.loc[i]['id'],
                    'sentiment':sentiment,
                    'language':posts.loc[i]['language'],
                    'region':posts.loc[i]['region_posted']
                }

                pushToCouch(post_json)

        set_1 = copy.deepcopy(set_2)
        set_2.clear()

# TODO
# distribute mastodon processors
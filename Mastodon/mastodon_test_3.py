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

# Create logs folder if it does not exist
logs_folder = os.path.join(os.path.expanduser('~'), 'logs')
os.makedirs(logs_folder, exist_ok=True)

# Configure logging to write to the error log file
logging.basicConfig(filename=os.path.join(logs_folder, 'errors.log'), level=logging.ERROR)

logging.error("Code started Test Again")
logging.debug("Code started (debug)")

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
    logging.error("Attempting to push to couch")

    # Connect to the CouchDB server using the .pem file
    server = couchdb.Server(db_url)

    while True:
        logging.error("Attempting to push to couch (in loop)")

        try:
            # Select the database to use
            db = server[dbname]

            # Convert the data to JSON format and insert
            data_json = json.dumps(data)
            db.save(json.loads(data_json))
            break

        except couchdb.http.ServerError as e1:
            print("Failed to connect to CouchDB. Retrying...")
            logging.error("err1: %s", str(e1))

        except Exception as e:
            logging.error("err2: %s", str(e))
            print("An error occurred while saving document to CouchDB:", e)
            break

# Retrieves posts since last get request
def getRecent():
    logging.error("Attempting to get recent posts")

    is_end = False
    all_posts = []

    logging.error("All urls:" + str(len(URLS)))
    for ur in URLS:
        logging.error("> %d", str(ur))

    for url_pair in URLS:

        server_url = url_pair[0]
        region = url_pair[1]

        logging.error("URL: %d.", str(server_url))
        logging.error("Found %d all_posts.", len(all_posts))

        params = {'limit': 40}
        r = requests.get(server_url, params=params)
        posts = json.loads(r.text)

        if len(posts) == 0:
            logging.error("Breaking out with 0 posts")
            break

        for post in posts:
            timestamp = pd.Timestamp(post['created_at'], tz='utc')
            if timestamp < start_time:
                is_end = True
                break

            post['region_posted'] = region
            all_posts.append(post)
        
        if is_end:
            logging.error("Breaking out since end")
            break

        max_id = posts[-1]['id']
        params['max_id'] = max_id

    logging.error("Successfully returning")
    return pd.DataFrame(all_posts)

logging.error("Starting main loop")

while True:
    logging.error("Main loop")

    try:
        posts = getRecent()
        logging.error("Made it through")

    except Exception as e3:
        posts = []
        logging.error("err1", str(e3))

        print("Potential connection issue (No posts retrieved from mastodon)")

    logging.error("Found %d posts.", len(posts))

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

                logging.error("Pushed post %d.", i)
                # print("Pushed a post")
                # logging.info("Nice, I just pushed a post!", post_json['created_at'])
                # print("Nice, I just pushed a post!", post_json['created_at'])
                # print("print test")
                # logging.info("Not printing")

            else:
                logging.error("Duplicate post %d.", i)

        set_1 = copy.deepcopy(set_2)
        set_2.clear()

# TODO
# distribute mastodon processors
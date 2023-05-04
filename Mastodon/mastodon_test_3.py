import json
import requests
import pandas as pd
import html_text
import couchdb
from couchdb.http import Session
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import copy

# For running on server -> $ nohup python3 mypythonscript.py &
# nohup python3 mastodon_nohup python3 mastodon_scraper.py &

# Mastodon info
URLS = [
    'https://urbanists.social/api/v1/timelines/public',
    'https://mastodon.social/api/v1/timelines/public'
]
params = {'limit': 40}
set_1 = set()
set_2 = set()
sid = SentimentIntensityAnalyzer()
start_time = pd.Timestamp('now', tz='utc')

# CouchDB info
url = 'http://172.26.134.4:5984/'
dbname = 'test_db_1'
pem_path = 'C:/Users/jonat/OneDrive/Desktop/test_latti.pem'

def pushToCouch(data):

    # Connect to the CouchDB server using the .pem file
    server = couchdb.Server(url)

    # Select the database to use
    db = server[dbname]

    # Convert the data to JSON format and insert
    data_json = json.dumps(data)
    db.save(json.loads(data_json))

# Retrieves posts since last get request
def getRecent():

    is_end = False
    all_posts = []

    for server_url in URLS:

        while True:

            r = requests.get(server_url, params=params)
            posts = json.loads(r.text)

            if len(posts) == 0:
                break

            for post in posts:
                timestamp = pd.Timestamp(post['created_at'], tz='utc')
                if timestamp < start_time:
                    is_end = True
                    break
                
                all_posts.append(post)
            
            if is_end:
                break

            max_id = posts[-1]['id']
            params['max_id'] = max_id

    df = pd.DataFrame(all_posts)
    return df

while True:

    posts = getRecent()

    if len(posts) > 0:
        start_time = pd.Timestamp(posts.loc[len(posts)-1]['created_at'], tz='utc')

        for i in range(len(posts)):

            set_2.add(posts.loc[i]['id'])

            if posts.loc[i]['id'] not in set_1:

                # Main processing
                if posts.loc[i]['language'] == 'en':

                    post_content = posts.loc[i]['content']
                    post_text = html_text.extract_text(post_content)

                    sentiment = sid.polarity_scores(post_text)['compound']

                    post_json = {
                        'text': post_text,
                        'created_at':posts.loc[i]['created_at'],
                        'post_id':posts.loc[i]['id'],
                        'sentiment':sentiment
                    }

                    pushToCouch(post_json)

        set_1 = copy.deepcopy(set_2)
        set_2.clear()
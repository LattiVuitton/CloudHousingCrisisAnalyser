import json
import requests
import pandas as pd
import html_text
import couchdb
from couchdb.http import Session
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Mastodon info
URL = 'https://urbanists.social/api/v1/timelines/public'
params = {'limit': 40}
LAST_N_MINUTES = 50
sid = SentimentIntensityAnalyzer() # for sentiment analysis

# CouchDB info
url = 'http://172.26.134.4:5984/'
dbname = 'test_db_1'
pem_path = 'C:/Users/jonat/OneDrive/Desktop/test_latti.pem'

def pushToCouch(data):

    # Connect to the CouchDB server using the .pem file
    # session = Session()
    # session.cert_file = pem_path
    server = couchdb.Server(url)

    # Select the database to use
    db = server[dbname]

    # Convert the data to JSON format
    data_json = json.dumps(data)

    # Insert the data into the database
    doc_id, doc_rev = db.save(json.loads(data_json))

    print(f'Document inserted with ID: {doc_id} and revision: {doc_rev}')

def getRecent(minutes):

    start_time = pd.Timestamp('now', tz='utc') - pd.DateOffset(hour=1)#minute=minutes)
    is_end = False
    all_posts = []

    counter = 0
    dots = 3

    while True:

        counter += 1
        if counter > dots:
            counter = 0

        print("Loading", "." * counter, " " * (dots - counter), end="\r")

        r = requests.get(URL, params=params)
        posts = json.loads(r.text)

        if not len(posts):
            break

        for post in posts:
            timestamp = pd.Timestamp(post['created_at'], tz='utc')
            if timestamp <= start_time:
                is_end = True
                break
            
            all_posts.append(post)
        
        if is_end:
            break

        max_id = posts[-1]['id']
        params['max_id'] = max_id

    df = pd.DataFrame(all_posts)
    return df

posts_pushed = 0
non_eng = 0

for i in range(5):
    posts = getRecent(minutes=LAST_N_MINUTES)

    for i in range(len(posts)):

        # Main processing
        if posts.loc[i]['language'] == 'en':

            post_content = posts.loc[i]['content']
            post_text = html_text.extract_text(post_content)

            sentiment = sid.polarity_scores(post_text)['compound']

            post_json = {
                'text': post_text,
                'created_at':posts.loc[i]['created_at'],
                'id':posts.loc[i]['id'],
                'sentiment':sentiment
            }
            # print(posts.loc[i])
            # print(post_json,"\n\n")
            # pushToCouch(post_json)
            posts_pushed += 1
        else:
            non_eng += 1
    print(len(posts), "Posts")

print("Pushed", posts_pushed, "posts. (" + str(non_eng), "Non-English posts)")
    


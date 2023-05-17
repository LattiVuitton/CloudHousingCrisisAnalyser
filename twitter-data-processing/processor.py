import ijson
import os
import json
import pandas as pd
import requests
import nltk
from datetime import datetime
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import tweetnlp
import twitterDataConfig

nltk.download('vader_lexicon')

#setup db connection to post to
username = twitterDataConfig.username_db
password = twitterDataConfig.password_db
db = twitterDataConfig.twitter_data_db
url = "http://" + username + ":" + password + "@" + db 
headers = {'Content-type':'application/json'}

#get and parse twitter data
script_dir = os.path.dirname(__file__)
twitter_rel_path = "twitter-test.json"
twitter_file_path = os.path.join(script_dir, twitter_rel_path)
parser = ijson.parse(open(twitter_file_path))

#load all tweet text classification models
irony_model = tweetnlp.Irony()
hate_speech_model = tweetnlp.Hate()
offensive_speech_model = tweetnlp.Offensive()
emotion_detector_model = tweetnlp.Emotion()


tweet_data = []
tweet_count = 0
valid_tweet_count = 0

#to be used in for-loop
valid = False
tweet = {}
context_annotation = []
geo_bbox = []
to_send = {"docs":[]}

BATCH_SIZE = 5000

start = datetime.now()

sid = SentimentIntensityAnalyzer()

for prefix, event, value in parser:

    if prefix == 'rows.item.id':
        if valid == True: #if previous tweet was valid i.e. have geo id
            tweet['context_annotation'] = context_annotation
            tweet['geo_bbox'] = geo_bbox
            try:
                tweet['nltk_sentiment'] = sentiment = sid.polarity_scores(tweet['text'])['compound']
            except:
                tweet['nltk_sentiment'] = 0
            valid_tweet_count+=1
            # tweet classifications
            tweet['irony'] = irony = irony_model.predict(tweet['text'])['label']
            
            tweet['hate'] = hate = hate_speech_model.predict(tweet['text'])['label']
        
            tweet['offensive'] = offensive = offensive_speech_model.predict(tweet['text'])['label']
            
            tweet['emotion'] = emotion = emotion_detector_model.predict(tweet['text'])['label']
          
            to_send['docs'].append(tweet)

            tweet_data.append(tweet)

        #re-initialise
        valid = False
        tweet = {}
        context_annotation = []
        geo_bbox = []

        tweet_count += 1
        tweet['id'] = str(value)
        
    elif prefix == 'rows.item.value.tokens' and value != None:
        tweet['tokens'] = str(value)
    elif prefix == 'rows.item.doc.data.author_id' and value != None:
        tweet['author_id'] = str(value)
    elif prefix == 'rows.item.doc.data.conversation_id' and value != None:
        tweet['conversation_id'] = str(value)
    elif prefix == 'rows.item.doc.data.created_at' and value != None:
        tweet['created_at'] = str(value)
    elif prefix == 'rows.item.doc.data.context_annotations.item.domain.name' and value != None:
        context_annotation.append(str(value))
    elif prefix == 'rows.item.doc.data.geo.place_id' and value != None:
        tweet['geo_place_id'] = str(value)
        valid = True
    elif prefix == 'rows.item.doc.includes.places.item.geo.bbox.item' and value != None:
        geo_bbox.append(str(value))
        valid = True
    elif prefix == 'rows.item.doc.includes.places.item.full_name' and value != None:
        tweet['geo_full_name'] = str(value)
        valid = True
    elif prefix == 'rows.item.doc.data.public_metrics.retweet_count' and value != None:
        tweet['retweet_count'] = str(value)
    elif prefix == 'rows.item.doc.data.public_metrics.reply_count' and value != None:
        tweet['reply_count'] = str(value)
    elif prefix == 'rows.item.doc.data.public_metrics.like_count' and value != None:
        tweet['like_count'] = str(value)
    elif prefix == 'rows.item.doc.data.public_metrics.quote_count' and value != None:
        tweet['quote_count'] = str(value)
    elif prefix == 'rows.item.doc.data.text' and value != None:
        tweet['text'] = str(value)
    elif prefix == 'rows.item.doc.data.sentiment' and value != None:
        tweet['sentiment'] = str(value)
    elif prefix == 'rows.item.doc.data.lang':
        tweet['lang'] = str(value)
    
    if len(to_send['docs']) >= BATCH_SIZE:
        json_to_send = json.dumps(to_send)
        req = requests.post(url, headers = headers, data = json_to_send)
        if req.status_code != 201:
            print("ERROR ", req.status_code)
            break
        #re-initialise
        to_send = {"docs":[]}

#for the last batch
if len(to_send['docs']) > 0:
    json_to_send = json.dumps(to_send)
    req = requests.post(url, headers = headers, data = json_to_send)
    if req.status_code != 201:
        print("ERROR", req.status_code)
        print("Response content:", req.content)

print("Total sending time: ", datetime.now() - start)
print("tweet_count: " , tweet_count, " valid_tweet_count: ", valid_tweet_count)
# tweet_df = pd.DataFrame(tweet_data)
# print(tweet_df)
# print(tweet_df.columns)
     

    
    
        

        

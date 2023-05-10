import ijson
import os
import pandas as pd
import requests
import json

#get config and twitter files
current_path = os.path.abspath(__file__)
parent_path = os.path.dirname(current_path)
config_rel_path = "../config.py"  
config_file_path = os.path.join(parent_path, config_rel_path)

import sys
sys.path.append(os.path.dirname(config_file_path)) # Append parent directory to sys.path

import config

#setup db connection to post to
username = config.username_db
password = config.password_db
db = config.twitter_data_db
url = "http://" + username + ":" + password + "@" + db
headers = {'Content-type':'application/json'}

#get and parse twitter data
twitter_rel_path = "twitter-test.json"
twitter_file_path = os.path.join(parent_path, twitter_rel_path)
parser = ijson.parse(open(twitter_file_path))

tweet_data = []
tweet_count = 0
valid_tweet_count = 0

#to be used in for-loop
valid = False
tweet = {}
context_annotation = []
geo_bbox = []

for prefix, event, value in parser:
    
    if prefix == 'rows.item.id':
        if valid == True: #if previous tweet was valid i.e. have geo id
            tweet['context_annotation'] = context_annotation
            tweet['geo_bbox'] = geo_bbox
            valid_tweet_count+=1
            json_tweet = json.dumps(tweet)
            req = requests.post(url, headers = headers, data = json_tweet)
            if req.status_code != 201:
                print(req.status_code)
                print(json_tweet)
                break


            #tweet_data.append(tweet)

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
    elif prefix == 'rows.item.doc.includes.places.item.geo.place_id' and value != None:
        tweet['place_id'] = str(value)
        valid = True
    elif prefix == 'rows.item.doc.includes.places.item.geo.bbox.item' and value != None:
        geo_bbox.append(str(value))
        valid = True
    elif prefix == 'rows.item.doc.includes.places.item.geo.full_name' and value != None:
        geo_bbox.append(str(value))
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

print("tweet_count: " , tweet_count, " valid_tweet_count: ", valid_tweet_count)
# tweet_df = pd.DataFrame(tweet_data)
# print(tweet_df)
# print(tweet_df.columns)
     

    
    
        

        

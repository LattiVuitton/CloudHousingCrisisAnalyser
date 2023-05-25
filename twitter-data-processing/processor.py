#
# Part of Assignment 2 - COMP90024 2023 Semester 1
# Cluster and Cloud Computing
# The University of Melbourne 
#
# Team 49:
#  * Navdeep Beniwal (1279517)
#  * Aditya Desu (1000447)
#  * Hieu (Nick) Huu (1329582)
#  * Jonathan Latti (1083374)
#  * Patricia Widjojo (913557)
#

import ijson
import os
import json
import pandas as pd
import requests
import nltk
from datetime import datetime
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import twitterDataConfig

nltk.download('vader_lexicon')

#setup db connection to post to
username = twitterDataConfig.username_db
password = twitterDataConfig.password_db
db = twitterDataConfig.twitter_data_db
url = "http://" + username + ":" + password + "@" + db + "/twitter_data/_bulk_docs"
headers = {'Content-type':'application/json'}

#get and parse twitter data
script_dir = os.path.dirname(__file__)
twitter_rel_path = "twitter-huge.json"
twitter_file_path = os.path.join(script_dir, twitter_rel_path)
parser = ijson.parse(open(twitter_file_path))

tweet_data = []
tweet_count = 0
valid_tweet_count = 0

#to be used in for-loop
valid = False
tweet = {}
context_annotation = []
geo_bbox = []
to_send = {"docs":[]}

BATCH_SIZE = 500

start = datetime.now()

sid = SentimentIntensityAnalyzer()

#to classify whether tweets are offensive
csv_file_path =  os.path.join(script_dir, "bad-words.txt")

offensive_words = []

sending_errors = []

with open(csv_file_path, "r") as file:
    string = file.read().split(",")  # Read the file and store its contents as a string
    for i in string:
        offensive_words.append(i)

def contain_offensive(tweet):
    tweet = tweet.lower()
    return any(text in tweet for text in offensive_words)


#to add suburb to tweets
class Suburb():
    def __init__(self, bbox, suburb_code, polygon):
        self.id = suburb_code
        self.left = min(bbox[0],bbox[2])
        self.right = max(bbox[0],bbox[2])
        self.top = max(bbox[1],bbox[3])
        self.bottom = min(bbox[1],bbox[3])
        self.centre = [(bbox[0] + bbox[2]) / 2,(bbox[1] + bbox[3]) / 2]
        self.polygon = polygon
polygon_file_path =  os.path.join(script_dir, "suburb-polygon.geojson")

with open(polygon_file_path, 'r') as f:
    data = json.load(f)

suburbs = []

for obj in data['features']:
    suburb = Suburb(
        obj['properties']['bbox'],
        obj['properties']['geography0'],
        obj['geometry']['coordinates'][0]
    )
    suburbs.append(suburb)

# Ray tracing
def ray_tracing_method(x,y,poly):

    n = len(poly)
    inside = False

    p1x,p1y = poly[0]
    for i in range(n+1):
        p2x,p2y = poly[i % n]
        if y > min(p1y,p2y):
            if y <= max(p1y,p2y):
                if x <= max(p1x,p2x):
                    if p1y != p2y:
                        xints = (y-p1y)*(p2x-p1x)/(p2y-p1y)+p1x
                    if p1x == p2x or x <= xints:
                        inside = not inside
        p1x,p1y = p2x,p2y

    return inside

#start processing twitter data
for prefix, event, value in parser:

    if prefix == 'rows.item.id':

        #if tweet is valid i.e. have geo id, we add it to be bulk sent
        if valid == True: 
            tweet['context_annotation'] = context_annotation
            tweet['geo_bbox'] = geo_bbox
            x_coord = (float(tweet['geo_bbox'][0]) + float(tweet['geo_bbox'][2]))/2
            y_coord =(float(tweet['geo_bbox'][1]) + float(tweet['geo_bbox'][3]))/2

            for sub in suburbs:
                # In bounding box
                if x_coord >= sub.left and x_coord <= sub.right and y_coord <= sub.top and y_coord >= sub.bottom:
                    # Check if in polygon
                    if ray_tracing_method(x_coord,y_coord,sub.polygon):
                        tweet['geo_postcode'] = sub.id        

            tweet['geo_point'] = [x_coord, y_coord]

            if tweet['lang'] == 'en':
                tweet['offensive'] = contain_offensive(tweet['text'])
            else:
                # List of words not really valid for non-English
                offensive = None
            try:
                tweet['nltk_sentiment'] = sentiment = sid.polarity_scores(tweet['text'])['compound']
            except:
                tweet['nltk_sentiment'] = 0
            valid_tweet_count+=1

            to_send['docs'].append(tweet)

            tweet_data.append(tweet)

        #re-initialise
        valid = False
        tweet = {}
        context_annotation = []
        geo_bbox = []

        tweet_count += 1
        tweet['_id'] = str(value)
        
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
    elif prefix == 'rows.item.doc.includes.places.item.geo.bbox.item' and value != None:
        geo_bbox.append(str(value))
        valid = True
    elif prefix == 'rows.item.doc.includes.places.item.full_name' and value != None:
        tweet['geo_full_name'] = str(value)
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
            sending_errors.append(json_to_send)
        #re-initialise
        to_send = {"docs":[]}

#for the last batch
if len(to_send['docs']) > 0:
    json_to_send = json.dumps(to_send)
    req = requests.post(url, headers = headers, data = json_to_send)
    if req.status_code != 201:
        sending_errors.append(json_to_send)

#re-try all those with sending errors one more time
if len(sending_errors) > 0:
    for i in sending_errors:
        json_to_send = json.dumps(i)
        eq = requests.post(url, headers = headers, data = json_to_send)
        if req.status_code != 201:
            print("ERROR", req.status_code)
            print("Response content:", req.content)

print("Total sending time: ", datetime.now() - start)
print("tweet_count: " , tweet_count, " valid_tweet_count: ", valid_tweet_count)
# tweet_df = pd.DataFrame(tweet_data)
# print(tweet_df)
# print(tweet_df.columns)

     

    
    
        

        

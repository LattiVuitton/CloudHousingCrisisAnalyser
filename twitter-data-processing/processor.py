import ijson
import os
import pandas as pd

script_dir = os.path.dirname(__file__)
twitter_rel_path = "twitter-test.json"

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

for prefix, event, value in parser:
    
    if prefix == 'rows.item.id':
        if valid == True: #if previous tweet was valid i.e. have geo id
            tweet['context_annotation'] = context_annotation
            tweet['geo_bbox'] = geo_bbox
            valid_tweet_count+=1
            tweet_data.append(tweet)

        #re-initialise
        valid = False
        tweet = {}
        context_annotation == []
        geo_bbox = []

        tweet_count += 1
        tweet['id'] = value
        
    elif prefix == 'rows.item.value.tokens' and value != None:
        tweet['tokens'] = value
    elif prefix == 'rows.item.doc.data.author_id' and value != None:
        tweet['author_id'] = value
    elif prefix == 'rows.item.doc.data.conversation_id' and value != None:
        tweet['conversation_id'] = value
    elif prefix == 'rows.item.doc.data.created_at' and value != None:
        tweet['created_at'] = value
    elif prefix == 'rows.item.doc.data.context_annotations.item.domain.name' and value != None:
        context_annotation.append(value)
    elif prefix == 'rows.item.doc.includes.places.item.geo.place_id' and value != None:
        tweet['place_id'] = value
        valid = True
    elif prefix == 'rows.item.doc.includes.places.item.geo.bbox.item' and value != None:
        geo_bbox.append(value)
        valid = True
    elif prefix == 'rows.item.doc.includes.places.item.geo.full_name' and value != None:
        geo_bbox.append(value)
        valid = True
    elif prefix == 'rows.item.doc.data.public_metrics.retweet_count' and value != None:
        tweet['retweet_count'] = value
    elif prefix == 'rows.item.doc.data.public_metrics.reply_count' and value != None:
        tweet['reply_count'] = value
    elif prefix == 'rows.item.doc.data.public_metrics.like_count' and value != None:
        tweet['like_count'] = value
    elif prefix == 'rows.item.doc.data.public_metrics.quote_count' and value != None:
        tweet['quote_count'] = value
    elif prefix == 'rows.item.doc.data.text' and value != None:
        tweet['text'] = value
    elif prefix == 'rows.item.doc.data.sentiment' and value != None:
        tweet['sentiment'] = value

print("tweet_count: " , tweet_count, " valid_tweet_count: ", valid_tweet_count)
tweet_df = pd.DataFrame(tweet_data)
print(tweet_df)
     

    
    
        

        

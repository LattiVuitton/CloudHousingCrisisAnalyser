import json
import time
import requests
import pandas as pd
import html_text
import couchdb
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import copy
import os

ATTEMPTS_BEFORE_GIVE_UP = 5

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

# CouchDB info
db_url = 'http://admin:password@172.26.132.178:5984/'
dbname = 'mastodon_data'

# Offensive words for tweet toxicity analysis
script_dir = os.path.dirname(__file__)
csv_file_path =  os.path.join(script_dir, "bad-words.txt")

# Creating offensive word list
offensive_words = []
with open(csv_file_path, "r") as file:
    string = file.read().split(",")  # Read the file and store its contents as a string
    for i in string:
        offensive_words.append(i)

# Check if text_data contains offensive words
def contain_offensive(text_data):
    text_data = text_data.lower()
    return any(text in text_data for text in offensive_words)

def pushToCouch(data):
    """
    Inserts a document into a CouchDB database.

    Args:
        data: A dictionary containing the data to be inserted into the database.
        
    Returns:
        None
    """
        
    # Connect to the CouchDB server using the given URL and credentials
    server = couchdb.Server(db_url)

    # Keep trying to save the data to the database until it succeeds
    while True:
        try:
            # Select the database to use
            db = server[dbname]

            # Check if the document already exists in the database
            if data['_id'] in db:
                print("Document already in database.")
                break

            # Convert the data to JSON format
            data_json = json.dumps(data)

            # Save the data to the database
            db.save(json.loads(data_json))
            break

        # Handle a conflict error if it occurs
        except couchdb.http.ResourceConflict:
            print("Conflict managed")
            time.sleep(1)

        # Handle any other error
        except Exception as e:
            break

def is_post_in_db(post_id):
    """
    Checks if the given post ID is present in the CouchDB database.

    Args:
    post_id (str): The ID of the post to check in the database.

    Returns:
    bool: True if the post is in the database, False otherwise.
    """
    # Connect to the CouchDB server using the .pem file
    server = couchdb.Server(db_url)

    try:
        # Select the database to use
        db = server[dbname]

        # Check if the post_id is in the database
        if post_id in db:
            return True

    except couchdb.http.ResourceNotFound:
        pass

    return False

def getRecent(start):
    """
    Retrieve recent posts from the Mastodon API since last request.

    Returns:
        pd.DataFrame: A pandas dataframe containing all new posts since last request.
    """

    is_end = False
    all_posts = []

    # Loop through all server URLs
    for url_pair in URLS:

        # Extract server URL and region
        server_url = url_pair[0]
        region = url_pair[1]

        # Set parameters for API request
        params = {'limit': 40}

        while True:

            try: 
                # Send API request with parameters
                r = requests.get(server_url, params=params)
                posts = json.loads(r.text)

            # This triggers from Mastodon's rate limiting 
            except:
                print("Push to CouchDB error, probably related to rate limit")
                break

            if len(posts) == 0:
                break

            for post in posts:

                # Using UTC timezone everywhere for easy comparison
                timestamp = pd.Timestamp(post['created_at'], tz='utc')

                if timestamp < start:
                    is_end = True
                    break

                if not is_post_in_db(post['id']):
                    # If the post ID is not already in the database, add it
                    post['region_posted'] = region
                    all_posts.append(post)
                else:
                    # If the post ID is already in the database, print a warning
                    print("Found duplicate", post['id'])
            
            if is_end:
                # If the loop is at the end, break out of the loop
                break

            # Set the max_id parameter to the last post ID in posts
            max_id = posts[-1]['id']
            params['max_id'] = max_id

    # Convert the list of new posts to a Pandas dataframe
    return pd.DataFrame(all_posts)

def main_function():
    """Continuously retrieves recent posts and pushes them to a CouchDB database.

    The function uses the `getRecent` function to retrieve a list of recent 
    posts, and then iterates over each post to extract the post text, sentiment,
    language, and region information. It then creates a JSON object with this
    information and pushes it to a CouchDB database using the `pushToCouch` 
    function. The function continues to run in an infinite loop, periodically
    retrieving new posts and pushing them to the database.

    Raises:
        Exception: If an error occurs while retrieving recent posts from API.

    Returns:
        None
    """

    # load all text classification models
    sid = SentimentIntensityAnalyzer()

    # Time at load
    start_time = pd.Timestamp('now', tz='utc')

    # Sets are used to avoid checking known local duplicates on server
    set_1 = set()
    set_2 = set()

    # The main loop that continuously polls for new posts
    while True:

        try:
            # Get the recent posts from the database
            posts = getRecent(start_time)

        except Exception:
            # If there's an error, set posts to an empty list
            posts = []
            print("Failed to get recent posts.")

        # If there are new posts, process them
        if len(posts) > 0:
            # Get the timestamp of the latest post
            start_time = pd.Timestamp(
                posts.loc[len(posts)-1]['created_at'], 
                tz='utc'
            )

            # Loop through all the new posts
            for i in range(len(posts)):
                # Add the post ID to the set of processed posts
                set_2.add(posts.loc[i]['id'])

                # If the post hasn't been processed before
                if posts.loc[i]['id'] not in set_1:
                    # Extract the text content of the post
                    post_content = posts.loc[i]['content']
                    post_text = html_text.extract_text(post_content)

                    # Get the sentiment score of the post text
                    sentiment = sid.polarity_scores(post_text)['compound']
                    if posts.loc[i]['language'] == 'en':
                        # Boolean value
                        offensive = contain_offensive(post_text)
                    else:
                        # List of words not really valid for non-English
                        offensive = None

                    # Create a JSON object with the post information
                    post_json = {
                        'text': post_text,
                        'created_at':posts.loc[i]['created_at'],
                        '_id':posts.loc[i]['id'],
                        'language':posts.loc[i]['language'],
                        'region':posts.loc[i]['region_posted'],

                        # Sentiment models
                        'sentiment':sentiment,
                        'offensive':offensive
                    }

                    attempts_left = ATTEMPTS_BEFORE_GIVE_UP

                    # Prevents temporary CouchDB issues from breaking system.
                    while True:

                        attempts_left -= 1
                        if attempts_left <= 0:
                            print("Giving up pushing post")
                            break

                        try:
                            # Push the post JSON object to the database
                            pushToCouch(post_json)
                            break

                        except:
                            print("Failed to push a post to CouchDB")

            # Update the set of processed posts and clear the temporary set
            set_1 = copy.deepcopy(set_2)
            set_2.clear()

# Call main loop
main_function()
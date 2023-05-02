import json
import requests
import pandas as pd
import html_text

URL = 'https://mastodon.social/api/v1/timelines/public'


def getRecent(hours):
    params = {'limit': 40}

    start_time = pd.Timestamp('now', tz='Australia/Melbourne') - pd.DateOffset(hour=hours)
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
            timestamp = pd.Timestamp(post['created_at'], tz='Australia/Melbourne')
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

posts = getRecent(hours=1)

for i in range(len(posts)):

    # Main processing
    post_content = posts.loc[i]['content']
    post_text = html_text.extract_text(post_content)

    print(post_text, "\n-----------\n")
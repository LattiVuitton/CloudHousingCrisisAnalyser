import requests
import json
import pandas as pd
# Load the credentials from a JSON file
with open('config.json') as file:
  config = json.load(file)

# Send a GET request to the view
response = requests.get(f'http://{config["username"]}:{config["password"]}@172.26.135.71:5984/twitter_data/_design/context_annotation/_view/context_annotation?group=true')
response_2 = requests.get(f'http://{config["username"]}:{config["password"]}@172.26.135.71:5984/twitter_data/_design/context_annotation/_view/token-distribution?group=true')

# Parse the JSON response into a Python dictionary
context_annotation_data = response.json()
token_annotation_data = response_2.json()


# Normalize the data
context_annotation_data_df = pd.json_normalize(context_annotation_data['rows'], meta=['key', 'value'])
context_annotation_data_df = context_annotation_data_df.sort_values(by='value', ascending=False)

token_annotation_data_df = pd.json_normalize(token_annotation_data['rows'], meta=['key', 'value'])
token_annotation_data_df = token_annotation_data_df.sort_values(by='value', ascending=False)

# Save dataframes
context_annotation_data_df.to_csv('context_annotation_data_df.csv')
token_annotation_data_df.to_csv('tokens-tweet-grouped.csv')



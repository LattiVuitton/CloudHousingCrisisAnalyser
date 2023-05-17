import requests
import json

# Load the credentials from a JSON file
with open('config.json') as file:
  config = json.load(file)

# Send a GET request to the view
response = requests.get(f'http://{config["username"]}:{config["password"]}@172.26.135.71:5984/twitter_test_data/_design/location/_view/location')

# Parse the JSON response into a Python dictionary
data = response.json()

# Convert the rows into a list of GeoJSON features
features = [row['value'] for row in data['rows']]

# Create a GeoJSON FeatureCollection
geojson = {
  'type': 'FeatureCollection',
  'features': features,
}

# Write the GeoJSON data to a file
with open('tweets.geojson', 'w') as file:
  json.dump(geojson, file)

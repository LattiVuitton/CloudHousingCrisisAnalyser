import os
import json
import pandas as pd
import requests
import sudoDataConfig


sudo_rental_data_path = 'sudo-data-processing/Sudo-Rental-Data/'
username = sudoDataConfig.username_db
password = sudoDataConfig.password_db
db = sudoDataConfig.sudo_data_db
url = "http://" + username + ":" + password + "@" + db
headers = {'Content-type':'application/json'}


# Iterate over each file in the directory and subdirectories
for root, dirs, files in os.walk(sudo_rental_data_path):
    for filename in files:       
        if 'Index_Data' in filename:
            # Full file path
            file_path = os.path.join(root, filename)
            # Load the JSON data
            with open(file_path, 'r') as f:
                data = json.load(f)
            for doc in data['features']:
                # Ensure each document has a unique _id
                doc['_id'] = str(doc['properties']['unique_id'])

            bulk_data = {'docs': data}

            # Send the data to CouchDB
            response = requests.post(url, headers=headers, json=bulk_data)

            # Check if the POST request was successful
            if response.status_code == 201:
                print(f'Successfully uploaded {filename} to CouchDB')
            else:
                print(f'Failed to upload {filename}. Status code: {response.status_code}. Message: {response.text}')

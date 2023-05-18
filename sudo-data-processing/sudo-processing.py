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


import numpy as np
import pandas as pd

# Iterate over each file in the directory and subdirectories
for root, dirs, files in os.walk(sudo_rental_data_path):
    for filename in files:       
        if 'Index_Data' in filename:
            # Full file path
            file_path = os.path.join(root, filename)
            # Load the JSON data
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            valid_data = []
            for doc in data['features']:
                q2_2019 = doc['properties'].get('rai_cityadjusted_total_2019_q2')
                q2_2021 = doc['properties'].get('rai_cityadjusted_total_2021_q2')

                # Ensure each document has a unique _id and not null for 'rai_cityadjusted_total_2021_q2' and 'rai_cityadjusted_total_2019_q2'
                if q2_2019 is not None and q2_2021 is not None:
                    doc['_id'] = str(doc['properties']['geography_name'])
                    valid_data.append(doc)

                #bulk_data = {'docs': valid_data}

                    # Send the data to CouchDB
                    response = requests.post(url, headers=headers, json=doc)

                    # Check if the POST request was successful
                    if response.status_code == 201:
                        print(f'Successfully uploaded {filename} to CouchDB')
                    else:
                        print(f'Failed to upload {filename}. Status code: {response.status_code}. Message: {response.text}')
 

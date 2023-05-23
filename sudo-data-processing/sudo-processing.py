import os
import json
import requests
import sudoDataConfig


sudo_rental_data_path = 'sudo-data-processing/Sudo-Data/Sudo-Rental-Data/'
sudo_income_data_path = 'sudo-data-processing/Sudo-Data/Sudo-Income-Data/'
username = sudoDataConfig.username_db
password = sudoDataConfig.password_db
db = sudoDataConfig.sudo_data_db
url = "http://" + username + ":" + password + "@" + db  
headers = {'Content-type':'application/json'}
housing_data = "/sudo_rental_data"
income_data = "/sudo_income_data"




 
# key map to define index values for different quarters
key_map = {
    'rai_citya1': 'rai_cityadjusted_total_2019_q3',
    'rai_citya2': 'rai_cityadjusted_total_2019_q2',
    'rai_citya3': 'rai_cityadjusted_total_2020_q1',
    'rai_citya4': 'rai_cityadjusted_total_2019_q4',
    'rai_citya5': 'rai_cityadjusted_total_2020_q3',
    'rai_citya6': 'rai_cityadjusted_total_2020_q2',
    'rai_citya7': 'rai_cityadjusted_total_2021_q2',
    'rai_citya8': 'rai_cityadjusted_total_2020_q4',
    'rai_citya9': 'rai_cityadjusted_total_2021_q1',
    'geography0': 'geography_name'
}

# Helper function to update key names
def update_key_names(data):
    return {key_map.get(k, k): v for k, v in data.items()}

# Iterate over each file in the directory and subdirectories
for root, dirs, files in os.walk(sudo_rental_data_path):
    for filename in files:       
        if 'Polygon' in filename:  # Adjusted file name condition
            # Full file path
            file_path = os.path.join(root, filename)
            # Load the JSON data
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            valid_data = []
            for doc in data['features']:
                # Update key names
                doc['properties'] = update_key_names(doc['properties'])
                
                q2_2019 = doc['properties'].get('rai_cityadjusted_total_2019_q2')
                q2_2021 = doc['properties'].get('rai_cityadjusted_total_2021_q2')

                # Ensure each document has a unique _id and not null for 'rai_cityadjusted_total_2021_q2' and 'rai_cityadjusted_total_2019_q2'
                if q2_2019 is not None and q2_2021 is not None:
                    doc['_id'] = str(doc['properties']['geography_name'])
                    valid_data.append(doc)
                    
                    # Send the data to CouchDB
                    response = requests.post(url + housing_data, headers=headers, json=doc)

                    # Check if the POST request was successful
                    if response.status_code == 201: 
                        print(f'Successfully uploaded {filename} to CouchDB')
                    else:
                        print(f'Failed to upload {filename}. Status code: {response.status_code}. Message: {response.text}')
     
               
# Iterate over each file in the directory and subdirectories
for root, dirs, files in os.walk(sudo_income_data_path):
    for filename in files:       
        if 'Median-Income-Aus-SA3.json' in filename:
            # Full file path
            file_path = os.path.join(root, filename)
            # Load the JSON data
            with open(file_path, 'r') as f:
                data = json.load(f)
           
            for loc_doc in data['features']:
                #set doc id by statistical area 3 code
                loc_doc['_id'] = str(loc_doc['properties']['sa3_code_2021'])

                # Send the data to CouchDB
                response = requests.post(url + income_data, headers=headers, json=loc_doc)

                # Check if the POST request was successful
                if response.status_code == 201:
                    print(f'Successfully uploaded {filename} to CouchDB')
                else:
                    print(f'Failed to upload {filename}. Status code: {response.status_code}. Message: {response.text}')

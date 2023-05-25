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

import requests
import json

# CouchDB database URL
url = 'http://admin:password@172.26.131.253:5984/clustered-cb'#mastodon_data'

# Send a GET request to retrieve all documents in the database
response = requests.get(url + '/_all_docs')

# Check if the request was successful
if response.status_code == 200:
    # Parse the response JSON
    data = response.json()
    
    # Extract the list of document IDs
    doc_ids = data['rows']
    
    # Create an empty dictionary to store all documents
    documents = {}
    
    # Iterate over each document ID and retrieve its contents
    for doc in doc_ids:
        doc_id = doc['id']
        doc_url = url + '/' + doc_id
        doc_response = requests.get(doc_url)
        
        if doc_response.status_code == 200:
            doc_data = doc_response.json()
            documents[doc_id] = doc_data
    
    # Save the documents to a file
    with open('backup.json', 'w') as backup_file:
        json.dump(documents, backup_file)
    
    print('Backup successfully created.')
else:
    print('Failed to retrieve documents from the database.')

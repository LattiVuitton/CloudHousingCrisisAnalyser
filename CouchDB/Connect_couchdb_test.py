import couchdb
import json
from couchdb.http import Session

# Set the URL and port for your CouchDB server
url = 'http://172.26.134.4:5984/'

# Set the name of the database you want to connect to
dbname = 'mastodon_test_db'

# Set the path to the .pem file
pem_path = 'C:/Users/jonat/OneDrive/Desktop/test_latti.pem'

# Connect to the CouchDB server using the .pem file
session = Session()
session.cert_file = pem_path
server = couchdb.Server(url)#, session=session)

# Select the database to use
db = server[dbname]

# Define the data you want to insert into the database
data = {'name': 'John Doe', 'age': 30}

# Convert the data to JSON format
data_json = json.dumps(data)

# Insert the data into the database
doc_id, doc_rev = db.save(json.loads(data_json))

print(f'Document inserted with ID: {doc_id} and revision: {doc_rev}')

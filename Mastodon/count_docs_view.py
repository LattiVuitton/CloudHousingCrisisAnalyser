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

import couchdb

# CouchDB info
db_url = 'http://admin:mysecretpassword@172.26.135.198:5984/'
dbname = 'mastodon_test_db'

# Connect to the database
couch = couchdb.Server(db_url)
db = couch[dbname]

# Get the most recent post
view = db.view('_design/post/_view/by_created_at', limit=1, descending=True)
post = view.rows[0].value

print("Most recent post:")
print(f"- ID: {post['_id']}")
print(f"- Created at: {post['created_at']}")
print(f"- Content: {post['content']}")

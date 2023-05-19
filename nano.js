const express = require('express');
const nano = require('nano')('http://admin:password@172.26.135.71:5984');
const app = express();

// Middleware to handle JSON payloads
app.use(express.json());

// Connect to CouchDB server
const couchdb = nano.db.use('twitter_test_data_nlp');

// Check/handle error
couchdb.info((err) => {
    if (err) {
        console.error('Failed to connect to CouchDB:', err);
        process.exit(1);
    }
    console.log('Connected to CouchDB!');
});

//fix problem with Java
app.use(express.static(__dirname));

app.get('/api', (req, res) => {
    res.json({ message: 'Connected to CouchDB!' });
});

app.get('/all-docs', async (req, res) => {
    try {
        const body = await couchdb.list();
        res.json(body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


couchdb.list({ include_docs: false }, (err, body) => {
    if (err) {
      console.log('Error retrieving documents:', err);
      return;
    }
  
    // Count the number of items
    const itemCount = body.total_rows;
    console.log(`Number of items in the database: ${itemCount}`);
    app.get('/data', (req, res) => {
        res.json({ message: `Number of items in the database: ${itemCount}`, data: itemCount });
    });
    
    app.get('/line', async (req, res) => {
        try {
          //get data from couchdb, its a list of items/documents
          //write a helper function to convert the data into the format required by the line chart - by using JS map() an reduce() functions
          //store the data in a variable
          //send the data as response


          // couchdb.view('sentiment', 'sentiment',  (err, body) => {
          //   if (err) {
          //     console.error(err);
          //     return;
          //   }
          
          //   const rows = body.rows;
          //   rows.forEach(row => {
          //     const doc = row.doc;
          //     //res.json(doc);
          //     console.log(doc);
          //   });
          // });


          // couchdb.list({ include_docs: true }, (err, body) => {
          //   if (err) {
          //     console.error(err);
          //     return;
          //   }
            
          //   const documents = body.rows.map(row => row.doc);
          //   const sentiment = documents.map(doc => {
          //     if(doc.sentiment.value < 0) {
          //       return(doc.geo_full_name.value, 'negative');
                 
          //      }
          //           else if (doc.sentiment.value === 0){
          //         return(doc.geo_full_name.value, 'neutral');
          //       }
          //       else {
          //         return(doc.geo_full_name.value, 'positive');
          //       }
          //   });
          //   const sum = sentiment.reduce((total, doc) => total + doc.value, 0);
          //   res.json(sum);
          //   // Perform the reduce operation on the documents array
          // });

          // const documents = body.rows.map(row => row.doc);
          //   const sentiment = documents.map(doc => {
          //     if(doc.sentiment.value  < 0) {
          //       return [{ key: doc.geo_full_name, value: 'negative' }];
                 
          //      }
          //       else if (doc.sentiment.value > 0){
          //         return [{ key: doc.geo_full_name, value: 'positive' }];
          //       }
          //           else if (doc.sentiment.value === 0){
          //             return [{ key: doc.geo_full_name, value: 'neutral' }];
          //           }
          //   });
          //   const sum = sentiment.reduce((total, doc) => total + doc.value, 0);
          //   res.json(sum);
          //   // Perform the reduce operation on the documents array
          // });
          
            const mockLineData = [
                {
                  id: "japan",
                  data: [
                    {
                      x: "plane",
                      y: 101,
                    },
                    {
                      x: "helicopter",
                      y: 75,
                    },
                    {
                      x: "boat",
                      y: 200,
                    },
                    {
                      x: "train",
                      y: 216,
                    },
                    {
                      x: "subway",
                      y: 35,
                    },
                    {
                      x: "bus",
                      y: 236,
                    },
                    {
                      x: "car",
                      y: 88,
                    },
                    {
                      x: "moto",
                      y: 232,
                    },
                    {
                      x: "bicycle",
                      y: 281,
                    },
                    {
                      x: "horse",
                      y: 1,
                    },
                    {
                      x: "skateboard",
                      y: 35,
                    },
                    {
                      x: "others",
                      y: 14,
                    },
                  ],
                },
                {
                  id: "france",
                  data: [
                    {
                      x: "plane",
                      y: 212,
                    },
                    {
                      x: "helicopter",
                      y: 190,
                    },
                    {
                      x: "boat",
                      y: 270,
                    },
                    {
                      x: "train",
                      y: 9,
                    },
                    {
                      x: "subway",
                      y: 75,
                    },
                    {
                      x: "bus",
                      y: 175,
                    },
                    {
                      x: "car",
                      y: 33,
                    },
                    {
                      x: "moto",
                      y: 189,
                    },
                    {
                      x: "bicycle",
                      y: 97,
                    },
                    {
                      x: "horse",
                      y: 87,
                    },
                    {
                      x: "skateboard",
                      y: 299,
                    },
                    {
                      x: "others",
                      y: 251,
                    },
                  ],
                },
                {
                  id: "us",
                  data: [
                    {
                      x: "plane",
                      y: 191,
                    },
                    {
                      x: "helicopter",
                      y: 136,
                    },
                    {
                      x: "boat",
                      y: 91,
                    },
                    {
                      x: "train",
                      y: 190,
                    },
                    {
                      x: "subway",
                      y: 211,
                    },
                    {
                      x: "bus",
                      y: 152,
                    },
                    {
                      x: "car",
                      y: 189,
                    },
                    {
                      x: "moto",
                      y: 152,
                    },
                    {
                      x: "bicycle",
                      y: 8,
                    },
                    {
                      x: "horse",
                      y: 197,
                    },
                    {
                      x: "skateboard",
                      y: 107,
                    },
                    {
                      x: "others",
                      y: 170,
                    },
                  ],
                },
              ];
            res.json(mockLineData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    //1. app.get(/getLineData)
    //2. Prepare data for line charts - same structure as there in the mockdata file
    //3. res.json()
  });
  
app.listen(5000, () => {
    console.log(`Example app listening at port 5000`);
});


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
      try{
        res.json({ message: `Number of items in the database: ${itemCount}`, data: itemCount });
      } catch (error) {
        console.error('Error retrieving item count:', error);
      }
    });    
  });
    
    // accesing couchdb view for line charts
    // app.get('/line', async (req, res) => {
    //     const body = await couchdb.view('location', 'location');
    //     const data = body.rows.map(doc => doc.key);
    //   try {
    //     console.log(data);
    //     res.json(data);
    //   } catch (error) {
    //     console.log('Error:', error);
    //     res.status(500).json({ error: 'Internal server error' });
    //   }
    // });
    
          ///mock hardcoded data
          app.get('/line', async (req, res) => {
                const mockLineData = [
                  {
                    id: "japan",
                    data: [
                      {
                        x: "plane",
                        y: 311,
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
              try {
                res.json(mockLineData);
              } catch (error) {
                console.log('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
              }
            });


            app.get('/bar', async (req, res) => {
               const mockBarData = [
                {
                  country: "AD",
                  "hot dog": 137,
                  "hot dogColor": "hsl(229, 70%, 50%)",
                  burger: 96,
                  burgerColor: "hsl(296, 70%, 50%)",
                  kebab: 72,
                  kebabColor: "hsl(97, 70%, 50%)",
                  donut: 140,
                  donutColor: "hsl(340, 70%, 50%)",
                },
                {
                  country: "AE",
                  "hot dog": 55,
                  "hot dogColor": "hsl(307, 70%, 50%)",
                  burger: 28,
                  burgerColor: "hsl(111, 70%, 50%)",
                  kebab: 58,
                  kebabColor: "hsl(273, 70%, 50%)",
                  donut: 29,
                  donutColor: "hsl(275, 70%, 50%)",
                },
                {
                  country: "AF",
                  "hot dog": 109,
                  "hot dogColor": "hsl(72, 70%, 50%)",
                  burger: 23,
                  burgerColor: "hsl(96, 70%, 50%)",
                  kebab: 34,
                  kebabColor: "hsl(106, 70%, 50%)",
                  donut: 152,
                  donutColor: "hsl(256, 70%, 50%)",
                }
              ];
            try {
              res.json(mockBarData);
            } catch (error) {
              console.log('Error:', error);
              res.status(500).json({ error: 'Internal server error' });
            }
          });
  
app.listen(5000, () => {
    console.log(`Example app listening at port 5000`);
});


const express = require("express");
const twitterDB = require("nano")("http://admin:password@172.26.135.71:5984");
const mastoDB = require("nano")("http://admin:password@172.26.131.253:5984");
const app = express();

// Middleware to handle JSON payloads
app.use(express.json());

// Connect to CouchDB server
const couchdb = twitterDB.db.use("twitter_test_data_nlp");
const couchdbMA = mastoDB.db.use("mastodon_data");

// Check/handle error
couchdb.info((err) => {
  if (err) {
    console.error("Failed to connect to CouchDB:", err);
    process.exit(1);
  }
  console.log("Connected to CouchDB!");
});

//fix problem with Java
app.use(express.static(__dirname));

app.get("/api", (req, res) => {
  res.json({ message: "Connected to CouchDB!" });
});

app.get("/all-docs", async (req, res) => {
  try {
    const body = await couchdb.list();
    res.json(body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

app.get("/line", async (req, res) => {
  //accesing couchdb view for line charts
  const bodyTW = await couchdb.view('language', 'language');
  console.log("bodyTW ", bodyTW.total_rows);
  const countMapTW = new Map();
  bodyTW.rows.map(doc => {
    console.log("doc ", doc);
    const { key, value } = doc;

    if (countMapTW.has(key)) {
      // If it exists, increment the count by 1
      const count = countMapTW.get(key);
      countMapTW.set(key, count + 1);
    } else {
      // If it doesn't exist, initialize the count to 1
      countMapTW.set(key, value);
    }
  }); 

  // const dataMT = bodyTW.rows.map(doc => {
  //   console.log("doc ", doc);
  //   const { key, value } = doc;

  //   if (countMap.has(key)) {
  //     // If it exists, increment the count by 1
  //     const count = countMap.get(key);
  //     countMap.set(key, count + 1);
  //   } else {
  //     // If it doesn't exist, initialize the count to 1
  //     countMap.set(key, value);
  //   }
  // }); 

  const mainObj = {
    id: "Twitter",
    data: Array.from(countMapTW.entries()).map(([key, value]) => ({ x: key, y: value }))
  };

  // const mastDomObj = {
  //   id: "Mastodon",
  //   data: Array.from(countMapMastDon.entries()).map(([key, value]) => ({ x: key, y: value }))
  // }

  // const bodyMA = await couchdbMA.view('language', 'language');
  // console.log("bodyMA ", bodyMA)
  // const dataMA = bodyMA.rows.map(doc => doc.key);
  // console.log("dataMA ", dataMA)
  try {
    const data = [];
    data.push(mainObj);
    //data.push(mastDomObj);
    res.json({ message: "Successfully returned Twitter data", data: data });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/bar", async (req, res) => {
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
    },
  ];
  try {
    res.json(mockBarData);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log(`Example app listening at port 5000`);
});


couchdb.list({ include_docs: false }, (err, body) => {
  if (err) {
    console.log("Error retrieving documents:", err);
    return;
  }

  // Count the number of items
  const itemCount = body.total_rows;
  console.log(`Number of items in the database: ${itemCount}`);

  app.get("/data", (req, res) => {
    try {
      res.json({
        message: `Number of items in the database: ${itemCount}`,
        data: itemCount,
      });
    } catch (error) {
      console.error("Error retrieving item count:", error);
    }
  });
});



// function (doc) {
//   if(doc.offensive ==true ) {
//    emit('offensive',doc.offensive);
    
//   }
//    else if (doc.offensive ==false ){
//      emit('non-offensive',doc.offensive);
//    }

// }


// function (doc) {
//   if(doc.sentiment < 0) {
//    emit(doc.sentiment, 'negative');
    
//   }
//    else if (doc.sentiment >0){
//      emit(doc.sentiment, 'positive');
//    }
//        else if (doc.sentiment ==0){
//      emit(doc.sentiment, 'neutral');
//    }
// }

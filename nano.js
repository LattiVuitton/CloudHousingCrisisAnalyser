const express = require("express");
const nano = require("nano")("http://admin:password@172.26.135.71:5984");
const app = express();

// Middleware to handle JSON payloads
app.use(express.json());

// Connect to CouchDB server
const couchdb = nano.db.use("twitter_test_data_nlp");

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
app.get("/line", async (req, res) => {
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

const dbSudoRental = couchdb.db.use("sudo_rental_data_copy");

app.get("/map", async (req, res) => {
  try {
    const body = await dbSudoRental.view("rental-index-change", "rental-index");

    // Extract the desired data from the retrieved documents
    const data = body.rows.map((row) => {
      console.log('map data fetched: ', body)
      // Convert the row into the desired format
      return {
        type: "Feature",
        geometry: row.value.polygon, // Assuming 'value' has 'geometry' property
        properties: {
          id: row.id,
          key: row.key,
          rentalIndexDifference: row.value.rentalIndexDifference,
        },
      };
    });

    return res.json({ data });
  } catch (error) {
    console.error("Error retrieving item count:", error);
  }
});

const dbTwitterData = couchdb.db.use("twitter_data");

app.get("/housing-tweets", async (req, res) => {
  try {
    const body = await dbTwitterData.view(
      "context_annotation",
      "housing-tweets",
      { group_level: 1, stale: "ok" }
    );

    // Map housing tweet data to suburb and average sentiment
    const data = body.rows.map((row) => ({
      key: row.key,
      value: {
        count: row.value.count,
        sentimentSum: row.value.sentimentSum,
        avgSentiment: row.value.sentimentSum / row.value.count,
      },
    }));

    return res.json({ rows: data });
  } catch (error) {
    console.error("Error retrieving housing tweets:", error);
  }
});

app.get("/suburb-sentiment", async (req, res) => {
  try {
    const body = await dbTwitterData.view("allSuburbs", "suburbSentiment", {
      group_level: 1,
      stale: "ok",
    });
    console.log(body);
    // Map all tweets to suburb and average sentiment
    const data = body.rows.map((row) => ({
      key: row.key,
      value: {
        count: row.value.count,
        sentimentSum: row.value.sentimentSum,
        avgSentiment: row.value.sentimentSum / row.value.count,
      },
    }));
    return res.json({ rows: data });
  } catch (error) {
    console.error("Error retrieving suburb sentiment:", error);
  }
});

const incomeData = couchdb.db.use("sudo_income_data_copy");

app.get("/median-income", async (req, res) => {
  try {
    const body = await incomeData.view("location", "median-income-vic-nsw", {
      stale: "ok",
    });
    console.log(body);
    // Map the median total household income weekly to each location
    const data = body.rows.map((row) => ({
      key: row.key,
      value: {
        geometry: row.value.geometry,
        median_tot_hhd_inc_weekly: row.value.median_tot_hhd_inc_weekly,
      },
    }));
    return res.json({ rows: data });
  } catch (error) {
    console.error("Error retrieving median income data:", error);
  }
});

// retrieves vic and nsw tweets by suburb for income
app.get("/vic-nsw-sentiment", async (req, res) => {
  try {
    const body = await dbTwitterData.view("sentiment", "sentiment-vic-nsw", {
      group_level: 1,
      stale: "ok",
    });
    console.log("vic-nsw-data: ", body.rows);
    //Map all tweets to postcode, number of offensive tweets, and average sentiment
    const data = body.rows.map((row) => ({
      key: row.key,

      value: {
        coordinates: row.value.geo_point,
        avgSentiment: row.value.avSentiment,
        offensive_count: row.value.tweet_count,
      },
    }));
    return res.json({ rows: data });
  } catch (error) {
    console.error("Error retrieving postcode sentiment:", error);
    res.status(500).send("Error retrieving postcode sentiment");
  }
});

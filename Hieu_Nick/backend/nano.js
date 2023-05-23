const express = require("express");
const couchdb = require("nano")("http://admin:password@172.26.132.178:5984");
const app = express();

// Middleware to handle JSON payloads
app.use(express.json());

// Connect to dbTW server
const dbTW = couchdb.db.use("twitter_data_copy");
const dbMA = couchdb.db.use("mastodon_data_copy");
const dbEcon = couchdb.db.use("historical_data_separate");

// Check/handle error
dbTW.info((err) => {
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


//line 1
app.get("/line", async (req, res) => {
  
  //accesing dbTW view for line charts
  try {
    const bodyTW = await dbTW.view("language", "language");
    console.log("bodyTW ", bodyTW.total_rows);
    const countMapTW = new Map();
    bodyTW.rows.map((doc) => {
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

    const bodyMA = await dbMA.view("language", "lang");
    const countmapMA = new Map();
    bodyMA.rows.map((doc) => {
      const { key, value } = doc;

      if (countmapMA.has(key)) {
        // If it exists, increment the count by 1
        const count = countmapMA.get(key);
        countmapMA.set(key, count + 1);
      } else {
        // If it doesn't exist, initialize the count to 1
        countmapMA.set(key, value);
      }
    });

    const mainObj = {
      id: "Twitter",
      data: Array.from(countMapTW.entries()).map(([key, value]) => ({
        x: key,
        y: value,
      })),
    };

    const maObj = {
      id: "Mastodon",
      data: Array.from(countmapMA.entries()).map(([key, value]) => ({
        x: key,
        y: value,
      })),
    };
    
    const data = [];
    data.push(mainObj);
    data.push(maObj);
    res.json({ message: "Successfully returned data", data: data });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




//rendering stock data hourly
//   const rawDoc = await dbEcon.get('209d039b1fdf92a4426ff215cd0fbf11');

//   const { Description, "Price History": priceHistory } = rawDoc;
//   const transformedData = {
//   id: Description,
//   data: priceHistory.map(({ date, hour, closingPrice }) => ({
//     x: `${date} ${hour}:00`,
//     y: closingPrice
//   }))
// };

//   //rendering stock data daily

//line 2.1
app.get("/line2_1", async (req, res) => {
  try {
  
  
  const startDate = new Date("2022-02-10");
  const endDate = new Date("2022-08-10");

  const AllOrd = await dbEcon.get("f211f095255d5afefb016aef4c00498c");
  const { Description, "Price History": priceHistory } = AllOrd;

  const transformedData = {
    id: Description,
  data: Object.values(
    priceHistory
      .filter(({ date }) => {
        const currentDate = new Date(date);
        return currentDate >= startDate && currentDate <= endDate;
      })
      .reduce((result, { date, hour, closingPrice }) => {
        const currentDate = new Date(date);
        const dateString = currentDate.toISOString().split('T')[0];

        if (!result[dateString]) {
          result[dateString] = {
            date: dateString,
            totalPrice: closingPrice,
            count: 1,
          };
        } else {
          result[dateString].totalPrice += closingPrice;
          result[dateString].count++;
        }

        return result;
      }, {})
  ).map(({ date, totalPrice, count }) => ({
    x: date,
    y: totalPrice / count,
  }))
  };

  const SP500 = await dbEcon.get("f211f095255d5afefb016aef4c005cba");
  const { Description: spDescription, "Price History": spPriceHistory } = SP500;

  const transformedData500 = {
    id: spDescription,
  data: Object.values(
    spPriceHistory
      .filter(({ date }) => {
        const currentDate = new Date(date);
        return currentDate >= startDate && currentDate <= endDate;
      })
      .reduce((result, { date, hour, closingPrice }) => {
        const currentDate = new Date(date);
        const dateString = currentDate.toISOString().split('T')[0];

        if (!result[dateString]) {
          result[dateString] = {
            date: dateString,
            totalPrice: closingPrice,
            count: 1,
          };
        } else {
          result[dateString].totalPrice += closingPrice;
          result[dateString].count++;
        }

        return result;
      }, {})
  ).map(({ date, totalPrice, count }) => ({
    x: date,
    y: totalPrice / count,
  }))
  };

  const bodyTW = await dbTW.view("sentiment", "sentiment2_1", {reduce: true, group: true});
  const transformedDataTW= bodyTW.rows.map(row => {
    return {
      x: row.key,
      y: row.value
    };
  });
  const mainObj = { id:"Twitter sentiment",data: transformedDataTW };


    const data = [];
    data.push(transformedData);
    data.push(transformedData500);
    data.push(mainObj);
    res.json({ message: "Successfully returned data", data: data });
    // res.json({data:mainObj});
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//line 2.2
app.get("/line2_2", async (req, res) => {
  try {
  
  
    const startDate = new Date("2022-02-10");
    const endDate = new Date("2022-08-10");
  
    const BTC = await dbEcon.get("f211f095255d5afefb016aef4c007ad1");
    const { Description, "Price History": priceHistory } = BTC;
  
    const transformedData = {
      id: Description,
    data: Object.values(
      priceHistory
        .filter(({ date }) => {
          const currentDate = new Date(date);
          return currentDate >= startDate && currentDate <= endDate;
        })
        .reduce((result, { date, hour, closingPrice }) => {
          const currentDate = new Date(date);
          const dateString = currentDate.toISOString().split('T')[0];
  
          if (!result[dateString]) {
            result[dateString] = {
              date: dateString,
              totalPrice: closingPrice,
              count: 1,
            };
          } else {
            result[dateString].totalPrice += closingPrice;
            result[dateString].count++;
          }
  
          return result;
        }, {})
    ).map(({ date, totalPrice, count }) => ({
      x: date,
      y: totalPrice / count,
    }))
    };
  
  
    const bodyTW = await dbTW.view("sentiment", "sentiment_bitcoin", {reduce: true, group: true});
    const transformedDataTW= bodyTW.rows.map(row => {
      return {
        x: row.key,
        y: row.value
      };
    });
    const mainObj = { id:"Twitter sentiment",data: transformedDataTW };
  
  
      const data = [];
      data.push(transformedData);
      data.push(mainObj);
      res.json({ message: "Successfully returned data", data: data });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

//line 3.1
app.get("/line3_1", async (req, res) => {
  const interestData = 
    {
      id: "AUS rates in %",
      data: [
        {
          x: "02/2022",
          y: 0.1,
        },
        {
          x: "03/2022",
          y: 0.1,
        },
        {
          x: "04/2022",
          y: 0.1,
        },
        {
          x: "05/2022",
          y: 0.35,
        },
        {
          x: "06/2022",
          y: 0.85,
        },
        {
          x: "07/2022",
          y: 1.35,
        },
      ],
    }; 
  try {
    const bodyTW = await dbTW.view("sentiment", "sentiment_housing", {reduce: true, group: true});
    const transformedData = bodyTW.rows.map(row => {
      return {
        x: row.key,
        y: row.value
      };
    });
    const mainObj = { id:"Twitter",data: transformedData };

    const data = [];
    data.push(mainObj);
    data.push(interestData);
    res.json({ message: "Successfully returned data", data:data });
      // res.json(interestData)
    // res.json(mainObj)
  } catch (error) {
    console.error("Error fetching or transforming data:", error);
  }
});

//line 3.2
app.get("/line3_2", async (req, res) => {
  try {
 const bodyTW = await dbTW.view("sentiment", "sentiment_housing", {reduce: true, group: true});
    const transformedData = bodyTW.rows.map(row => {
      return {
        x: row.key*250000,
        y: row.value
      };
    });
    const mainObj = { id:"Twitter",data: transformedData };

    const data = [];
    data.push(mainObj);
    res.json({ message: "Successfully returned data", data:data });
    //  res.json(interestData)
    // res.json(mainObj)
  } catch (error) {
    console.error("Error fetching or transforming data:", error);
  }

});

// //bar 1.1
function fetchDataAndSendResponse() {
app.get("/bar", async (req, res) => {
  const bodyTW = await dbTW.view("sentiment", "sentiment");
  const totalRowsTW = bodyTW.rows.length;
    const totalSentimentTW = bodyTW.rows.reduce((sum, row) => sum + parseFloat(row.value), 0);
    const averageSentimentTW = totalSentimentTW / totalRowsTW;
  console.log("bodyTW number of sentiment", totalRowsTW);
  console.log("average of MA sentiments: ",averageSentimentTW );

  //Ma AUS
  const bodyMaAus = await dbMA.view("sentiment", "sentimentAus");
  const totalRowsMaAus = bodyMaAus.rows.length;
    const totalSentimentAus = bodyMaAus.rows.reduce((sum, row) => sum + parseFloat(row.value), 0);
    const averageSentimentMAAus = totalSentimentAus / totalRowsMaAus;
  console.log("bodyMaAus number of sentiment", totalRowsMaAus);
  console.log("average of MA_Au sentiments: ", averageSentimentMAAus);


  //Ma US
  const bodyMaUs = await dbMA.view("sentiment", "sentimentUs");
  const totalRowsMaUs = bodyMaUs.rows.length;
    const totalSentimentUs = bodyMaAus.rows.reduce((sum, row) => sum + parseFloat(row.value), 0);
    const averageSentimentMAus = totalSentimentUs / totalRowsMaUs;
  console.log("bodyMaUs number of sentiment", totalRowsMaUs);
  console.log("average of MA_Us sentiments: ",averageSentimentMAus );
  // console.log("bodyMaUs sentiment", bodyMaUs.total_rows);
  // const countMapMUs = new Map();
  // let totalMAUs = 0.0;
  // bodyMaUs.rows.map((doc) => {
  //   //console.log("doc ", doc);
  //   const { key } = doc;
  //   totalMAUs = totalMAUs + parseFloat(key);
  // });
  // countMapMUs.set("average", totalMAUs / parseFloat(bodyMaUs.total_rows));

  //MA Africa
  const bodyMaAfr = await dbMA.view("sentiment", "sentimentAfrica");
  const totalRowsMaAfr = bodyMaAfr.rows.length;
    const totalSentimentAfr = bodyMaAfr.rows.reduce((sum, row) => sum + parseFloat(row.value), 0);
    const averageSentimentMAAfr = totalSentimentAfr / totalRowsMaAfr;
  console.log("bodyMaAfr number of sentiment", totalRowsMaAfr);
  console.log("average of MA_Afr sentiments: ",averageSentimentMAAfr );


  try {
    res.json({
      message: "Successfully returned Average Sentiment data",
      data: [
        {
          "Platform/Country": "Twitter",
          Sentiment: averageSentimentTW
        },
        {
          "Platform/Country": "Mastodon Australia",
          Sentiment: averageSentimentMAus
        },
        {
          "Platform/Country": "Mastodon US",
          Sentiment: averageSentimentMAus
        },
        {
          "Platform/Country": "Mastodon Africa",
          Sentiment: averageSentimentMAAfr
        },
      ],
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
 }fetchDataAndSendResponse();
setInterval(fetchDataAndSendResponse, 5 * 60 * 1000); 


//map 2.1
app.get("/geography", async (req, res) => {
  

  try {
    res.json(geoFeatures);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//map 2.2
app.get("/geography2_2", async (req, res) => {
  try {
    res.json("loaded");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(5000, () => {
  console.log(`Example app listening at port 5000`);
});


app.get("/countTW", async (req, res) => {

    try {
      const bodyTW = await dbTW.view('count', 'count', { reduce: true } );
      const count = bodyTW.rows[0].value;
      res.json(count);
    }
     catch (error) {
      console.error("Error retrieving item count:", error);
    }
  });

  app.get("/countMA", async (req, res) => {
  
    try {
      const bodyMA = await dbMA.view('count', 'count', { reduce: true } );
      const count = bodyMA.rows[0].value;
      res.json({data:count});
    }
     catch (error) {
      console.error("Error retrieving item count:", error);
    }
  });


  //const couchdb = require("nano")("http://admin:password@172.26.132.178:5984");
// const dbSudoRental = couchdb.db.use('sudo_rental_data_copy'); // Replace with your database name

//   app.get("/map", async (req, res) => {
  
//     try {
//       const body = await dbSudoRental.view('rental-index-change', 'rental-index') 
        
//         // Extract the desired data from the retrieved documents
//         const data = body.rows.map((row) => row.value);
//         console.log("data", data);
//         return res.json({data:data}); 

//     }
//      catch (error) {
//       console.error("Error retrieving item count:", error);
//     }
//   });
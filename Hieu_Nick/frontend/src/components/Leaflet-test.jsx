// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import * as turf from '@turf/turf';
// import { Zoom } from '@mui/material';

// const MapComponent = () => {
//     const mapRef = useRef(null);

//     useEffect(() => {
//         if (!mapRef.current) return;

//         const map = L.map(mapRef.current).setView([ -8.084554,167.354565], 2);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//             attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//         }).addTo(map);
//         const geoJsonFiles = [
//             '/Merged-Aus-Polygon.geojson',
//             // '/Melb_Rental_Index_Shape.geojson',
//             // '/Perth_Rental_Index_Shape.geojson',
//             // '/Greater_Sydney_Rental_Index_Shape.geojson',
//             // '/QLD_Rental_Index_Shape.geojson',
//             // '/Rest_of_NSW_Rental_Index_Shape.geojson',
//             // '/TAS_Rental_Index_Shape.geojson',
//             // Add more paths as needed...
//         ];
        
//         // Fetch GeoJSON data
//         fetch('/Merged-Aus-Polygon.geojson')
//             .then(response => response.json())
//             .then(data => {
               

//                 // Fetch tweets data
//                 fetch('../../../tweets-big.geojson')
//                     .then(response => response.json())
//                     .then(tweetData => {
//                         const tweets = tweetData.features;

//                         // Initialize tweet counts for each feature
//                         data.features.forEach(feature => {
//                             feature.properties.tweetCount = 0;
//                         });

//                         // Loop over each tweet
//                         tweets.forEach(tweet => {
//                             console.log("test123" + JSON.stringify(tweet.geometry.coordinates))
//                             // Create a point from the tweet coordinates
//                             const point = turf.point(tweet.geometry.coordinates);
//                             console.log("test456" + point)
//                             // Check if the point is in any of the polygons
//                             data.features.forEach(feature => {
//                                 if (turf.booleanPointInPolygon(point, feature)) {
//                                     console.log("please")
//                                     // Increment the tweet count
//                                     feature.properties.tweetCount += 1;
//                                 }
//                             });
//                         });
//                         const getColor = (tweetCount) => {
//                             let color;
                        
//                             if (tweetCount < 5) {
//                                 color = '#000403'; 
//                             } else if (tweetCount < 10) {
//                                 color = '#ff0000'; // Slate Gray
//                             } else if (tweetCount < 20) {
//                                 color = '#778899'; // Light Slate Gray
//                             } else if (tweetCount < 40) {
//                                 color = '#708090'; // Slate Gray
//                             } else if (tweetCount < 50) {
//                                 color = '#2F4F4F'; // Dark Slate Gray
//                             } else {
//                                 color = '#000000'; // Black
//                             }
                        
//                             return color;
//                         };
//                         // Define color scale function for rental index
//                         const getRentalIndexColor = (index) => {
//                             let color;
                        
//                             if (index < 2) {
//                                 color = '#045a8d';
//                             } else if (index < 4) {
//                                 color = '#2b8cbe';
//                             } else if (index < 6) {
//                                 color = '#74a9cf';
//                             } else if (index < 8) {
//                                 color = '#bdc9e1';
//                             } else {
//                                 color = '#000403';
//                             }
                        
//                             return color;
//                         };

//                         // Define onEachFeature function
//                         const onEachFeature = (feature, layer) => {
//                             const value = Math.abs(feature.properties.rai_citya3 - feature.properties.rai_citya9);
//                             const suburb = feature.properties.geography0;
//                             const tweetCount = feature.properties.tweetCount;

//                             layer.on('mouseover', () => layer.bindTooltip(`Rental Index Change: ${value} \nSuburb: ${suburb} \nTweet Count: ${tweetCount}`));
//                         };
                        
//                         // Add GeoJSON layer
//                         L.geoJSON(data, {
//                             style: (feature) => {
//                                 const tweetCount = feature.properties.tweetCount;
//                                 const value = Math.abs(feature.properties.rai_citya3 - feature.properties.rai_citya9);
                                
//                                 return { fillColor: getColor(tweetCount), color:getRentalIndexColor(value), fillOpacity: 0.5, color: '#000' };
//                             },                            
//                             onEachFeature: onEachFeature
//                         }).addTo(map);
//                     });
//             });

//         return () => {
//             map.remove();
//         };
//     }, []);

//     return (
//         <div id="map" ref={mapRef} style={{ height: "600px" }} />
//     );
// };

// export default MapComponent;

// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';
// import * as turf from '@turf/turf';

// const MapComponent = () => {
//     const mapRef = useRef(null);

//     useEffect(() => {
//         if (!mapRef.current) return;

//         const map = L.map(mapRef.current).setView([-8.084554,167.354565], 2);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//             attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//         }).addTo(map);

//         const geoJsonFiles = [
//             // '/Melb_Rental_Index_Shape.geojson',
//             // '/Perth_Rental_Index_Shape.geojson',
//             // '/Greater_Sydney_Rental_Index_Shape.geojson',
//             // '/QLD_Rental_Index_Shape.geojson',
//              '/TAS_Rental_Index_Shape.geojson',
//             '/Merged_Rental_Index_Shape.geojson'
//             // Add more paths as needed...
//         ];

//         // Define color scale function
//         const getColor = (tweetCount) => {
//             let color;

//             if (tweetCount <= 0) {
//                 color = '#000403';
//             } else if (tweetCount < 5) {
//                 color = '#ff0000';
//             } else if (tweetCount < 10) {
//                 color = '#ff0010';
//             } else if (tweetCount < 20) {
//                 color = '#FC4E2A';
//             } else if (tweetCount < 50) {
//                 color = '#E31A1C';
//             } else {
//                 color = '#800026';
//             }

//             return color;
//         };

//         // Define onEachFeature function
//         const onEachFeature = (feature, layer) => {
//             const tweetCount = feature.properties.tweetCount;
//             const suburb = feature.properties.geography0;
//             layer.on('mouseover', () => layer.bindTooltip(`Number of tweets: ${tweetCount}\nSuburb: ${suburb}`));
//         };

//         fetch('../../../tweets-big.geojson')
//         .then(response => response.json())
//         .then(tweetData => {
//             const tweets = tweetData.features;

//             Promise.all(geoJsonFiles.map(path => axios.get(path)))
//                 .then(results => {
//                     results.forEach(result => {
//                         const data = result.data;

//                         // Initialize tweet counts for each feature
//                         data.features.forEach(feature => {
//                             feature.properties.tweetCount = 0;
//                         });

//                         // Loop over each tweet
//                         tweets.forEach(tweet => {
//                             // Create a point from the tweet coordinates
//                             const point = turf.point(tweet.geometry.coordinates);

//                             // Check if the point is in any of the polygons
//                             data.features.forEach(feature => {
//                                 if (turf.booleanPointInPolygon(point, feature)) {
//                                     // Increment the tweet count
//                                     feature.properties.tweetCount += 1;
//                                 }
//                             });
//                         });

//                         // Add GeoJSON layer
//                         L.geoJSON(data, {
//                             style: (feature) => {
//                                 const tweetCount = feature.properties.tweetCount;
//                                 return { fillColor: getColor(tweetCount), fillOpacity: 0.5, color: '#000' };
//                             },
//                             onEachFeature: onEachFeature
//                         }).addTo(map);
//                     });
//                 })
//                 .catch(err => console.error(err));
//         });

//         return () => {
//             map.remove();
//         };
//     }, []);

//     return (
//         <div id="map" ref={mapRef} style={{ height: "600px" }} />
//     );
// };

// export default MapComponent;
//""" WOROKING WELL """

// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const MapComponent = () => {
//     const mapRef = useRef(null);

//     useEffect(() => {
//         if (!mapRef.current) return;

//         const map = L.map(mapRef.current).setView([-8.084554, 167.354565], 2);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//             attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//         }).addTo(map);

//         // Define color scale function
//         const getColor = (percentageChange) => {
//             let color;

//             if (percentageChange <= 0) {
//                 color = '#800000';
//             } else if (percentageChange < 5) {
//                 color = '#FF0000';
//             } else if (percentageChange < 10) {
//                 color = '#FF8C00';
//             } else if (percentageChange < 20) {
//                 color = '#FFD700';
//             } else if (percentageChange < 50) {
//                 color = '#ADFF2F';
//             } else {
//                 color = '#006400';
//             }

//             return color;
//         };

//         // Define onEachFeature function
//         // Define onEachFeature function
//         const onEachFeature = (feature, layer) => {
//             if (feature.properties && feature.properties.rentalIndexDifference !== undefined) {
//                 const percentageChange = feature.properties.rentalIndexDifference;
//                 const suburb = feature.properties.id;
//                 layer.on('mouseover', () => layer.bindTooltip(`Percentage Change: ${percentageChange}\nSuburb: ${suburb}`));
//                 console.error('working', feature)
//             }
//             else {
//                 console.error('Feature missing rentalIndexDifference:', feature);
//             }
//         };


//         fetch('/rental-index.geojson')
//             .then(response => response.json())
//             .then(data => {
//                 // Add GeoJSON layer
//                 data.forEach(feature => {
//                 L.geoJSON(feature, {
//                     style: () => {
//                     const percentageChange = feature.properties.rentalIndexDifference;
//                     return { fillColor: getColor(percentageChange), fillOpacity: 0.5, color: '#000' };
//                     },
//                     onEachFeature: onEachFeature
//                 }).addTo(map);
//                 });
//             })
//             .catch(error => console.error('Error fetching geojson data:', error));


//         return () => {
//             map.remove();
//         };
//     }, []);

//     return (
//         <div id="map" ref={mapRef} style={{ height: "600px" }} />
//     );
// };
// export default MapComponent;


import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';

const MapComponent = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView([-25.2744, 133.7751], 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 55,
            attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(map);

        const getColor = (percentageChange) => {
                        let color;
            
                        if (percentageChange <= 0) {
                            color = '#006400';
                        } else if (percentageChange < 5) {
                            color = '#ADFF2F';
                        } else if (percentageChange < 10) {
                            color = '#FFD700';
                        } else if (percentageChange < 20) {
                            color = '#FF8C00';
                        } else if (percentageChange < 50) {
                            color = '#FF0000';
                        } else {
                            color = '#800000';
                        }
            
                        return color;
                    };

        const sentimentBySuburb = {};

        const happyIcon = L.icon({
            iconUrl: '/happy.png',
            iconSize: [38, 38] // size of the icon
        });

        const sadIcon = L.icon({
            iconUrl: '/sad.png',
            iconSize: [38, 38] // size of the icon
        });
        // Create the legend
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            const grades = [0, 5, 10, 20, 50]; // your ranges
            const colors = ['#800000', '#FF0000', '#FF8C00', '#FFD700', '#ADFF2F']; // corresponding colors

            // loop through intervals to generate a label with a colored square for each interval
            for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

legend.addTo(map);
        fetch('/housing-tweets.json')
            .then(response => response.json())
            .then(data => {
                data.rows.forEach(row => {
                    
                    sentimentBySuburb[row.key] = row.value.avgSentiment;
                    console.error(sentimentBySuburb)
                });

                fetch('/rental-index.geojson')
                    .then(response => response.json())
                    .then(data => {
                        const onEachFeature = (feature, layer) => {
                            if (feature.properties && feature.properties.rentalIndexDifference !== undefined) {
                                const percentageChange = feature.properties.rentalIndexDifference;
                                const suburb = feature.properties.id;
                                const sentiment = sentimentBySuburb[suburb] || 'N/A';
                                // Determine the sentiment icon
                                if (!isNaN(sentiment)) {
                                    // Determine the sentiment icon
                                    const sentimentIcon = sentiment > 0 ? happyIcon : sadIcon;

                                    // Add a marker at the centroid of the polygon
                                    const centroid = turf.centroid(feature);
                                    L.marker([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]], {icon: sentimentIcon}).addTo(map);
                                }
                                layer.on('mouseover', () => layer.bindTooltip(`Percentage Change: ${percentageChange}\nSuburb: ${suburb}\nSentiment: ${sentiment}`));
                            }
                            else {
                                console.error('Feature missing rentalIndexDifference:', feature);
                            }
                        };

                        data.forEach(feature => {
                            L.geoJSON(feature, {
                                style: () => {
                                    const percentageChange = feature.properties.rentalIndexDifference;
                                    return { fillColor: getColor(percentageChange), fillOpacity: 0.5, color: '#000' };
                                },
                                onEachFeature: onEachFeature
                            }).addTo(map);
                        });
                    })
                    .catch(error => console.error('Error fetching geojson data:', error));
            })
            .catch(error => console.error('Error fetching sentiment data:', error));

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div id="map" ref={mapRef} style={{ height: "600px" }} />
    );
};

export default MapComponent;



// import React, { useEffect, useState } from 'react';
// import { MapContainer, Polygon } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';

// const LeafletTest = () => {
//   const [polygons, setPolygons] = useState([]);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         'http://admin:password@172.26.136.103:5984/sudo_rental_data_copy/_design/rental-index-change/_view/rental-index'
//       );
//       const data = response.data;
//       const processedPolygons = data.rows.map((row) => ({
//         id: row.id,
//         polygon: row.value.polygon,
//         rentalIndexDifference: row.value.rentalIndexDifference,
//       }));
//       setPolygons(processedPolygons);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);
//   const getColor = (percentageChange) => {
//                 let color;
    
//                 if (percentageChange <= 0) {
//                     color = '#000403';
//                 } else if (percentageChange < 5) {
//                     color = '#ff0000';
//                 } else if (percentageChange < 10) {
//                     color = '#ff0010';
//                 } else if (percentageChange < 20) {
//                     color = '#FC4E2A';
//                 } else if (percentageChange < 50) {
//                     color = '#E31A1C';
//                 } else {
//                     color = '#800026';
//                 }
    
//                 return color;
//             };

//   return (
//     <MapContainer>
//       {polygons.map((polygon) => (
//         <Polygon
//           key={polygon.id}
//           positions={polygon.polygon.coordinates}
//           color={getColor(polygon.rentalIndexDifference)}
//         />
//       ))}
//     </MapContainer>
//   );
// };

//export default LeafletTest;



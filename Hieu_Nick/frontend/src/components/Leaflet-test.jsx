// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const MapComponent = () => {
//     const mapRef = useRef(null);

//     useEffect(() => {
//         if (!mapRef.current) return;

//         const map = L.map(mapRef.current).setView([ -8.56, 135.07], 2);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//             attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//         }).addTo(map);

//         // Fetch GeoJSON data
//         fetch('/Melb_Rental_Index_Shape.geojson')
//             .then(response => response.json())
//             .then(data => {
//                 // Define color scale function
//                 const getColor = (value) => {
//                     let color;

//                     if (value < 10) {
//                         color = '#ffffcc';
//                     } else if (value < 20) {
//                         color = '#c7e9b4';
//                     } else if (value < 30) {
//                         color = '#7fcdbb';
//                     } else if (value < 40) {
//                         color = '#41b6c4';
//                     } else if (value < 50) {
//                         color = '#2c7fb8';
//                     } else {
//                         color = '#253494';
//                     }

//                     return color;
//                 };

//                 // Define onEachFeature function
//                 const onEachFeature = (feature, layer) => {
//                     const value = Math.abs(feature.properties.rai_citya3 - feature.properties.rai_citya9);
//                     const suburb = feature.properties.geography0
//                     layer.on('mouseover', () => layer.bindTooltip(`Rental Index Change: ${value} \nSuburb: ${suburb}` ));
                    
//                 };

//                 // Add GeoJSON layer
//                 L.geoJSON(data, {
//                     style: (feature) => {
//                         const value = Math.abs(feature.properties.rai_citya3 - feature.properties.rai_citya9);
//                         return { fillColor: getColor(value), fillOpacity: 0.5, color: '#000' };
//                     },
//                     onEachFeature: onEachFeature
//                 }).addTo(map);
//             });

//         return () => {
//             map.remove();
//         };
//     }, []);

//     return (
//         <div id="map" ref={mapRef} style={{ height: "600px" }} />
//     );
// };

//export default MapComponent;

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';

const MapComponent = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView([ -53.945580,201, 68.18973], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Fetch GeoJSON data
        fetch('../../../Melb_Rental_Index_Shape.geojson')
            .then(response => response.json())
            .then(data => {
               

                // Fetch tweets data
                fetch('../../../tweets.geojson')
                    .then(response => response.json())
                    .then(tweetData => {
                        const tweets = tweetData.features;

                        // Initialize tweet counts for each feature
                        data.features.forEach(feature => {
                            feature.properties.tweetCount = 0;
                        });

                        // Loop over each tweet
                        tweets.forEach(tweet => {
                            console.log("test123" + JSON.stringify(tweet.geometry.coordinates))
                            // Create a point from the tweet coordinates
                            const point = turf.point(tweet.geometry.coordinates);
                            console.log("test456" + point)
                            // Check if the point is in any of the polygons
                            data.features.forEach(feature => {
                                if (turf.booleanPointInPolygon(point, feature)) {
                                    console.log("please")
                                    // Increment the tweet count
                                    feature.properties.tweetCount += 1;
                                }
                            });
                        });
                        const getColor = (tweetCount) => {
                            let color;
                        
                            if (tweetCount < 10) {
                                color = '#ffffcc';
                            } else if (tweetCount < 20) {
                                color = '#c7e9b4';
                            } else if (tweetCount < 30) {
                                color = '#7fcdbb';
                            } else if (tweetCount < 40) {
                                color = '#41b6c4';
                            } else if (tweetCount < 50) {
                                color = '#2c7fb8';
                            } else {
                                color = '#253494';
                            }
                        
                            return color;
                        };
                        

                        // Define onEachFeature function
                        const onEachFeature = (feature, layer) => {
                            const value = Math.abs(feature.properties.rai_citya3 - feature.properties.rai_citya9);
                            const suburb = feature.properties.geography0;
                            const tweetCount = feature.properties.tweetCount;

                            layer.on('mouseover', () => layer.bindTooltip(`Rental Index Change: ${value} \nSuburb: ${suburb} \nTweet Count: ${tweetCount}`));
                        };

                        // Add GeoJSON layer
                        L.geoJSON(data, {
                            style: (feature) => {
                                const tweetCount = feature.properties.tweetCount;
                                return { fillColor: getColor(tweetCount), fillOpacity: 0.5, color: '#000' };
                            },                            
                            onEachFeature: onEachFeature
                        }).addTo(map);
                    });
            });

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div id="map" ref={mapRef} style={{ height: "600px" }} />
    );
};

export default MapComponent;
// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';
// import { pointInPolygon } from 'geolib';

// const MapComponent = () => {
//     const mapRef = useRef(null);

//     useEffect(() => {
//         if (!mapRef.current) return;

//         const map = L.map(mapRef.current).setView([135.07, -8.56], 5);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//             attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//         }).addTo(map);

//         // Fetch GeoJSON data for suburbs
//         axios.get('/Melb_Rental_Index_Shape.geojson')
//             .then(response => {
//                 const data = response.data;

//                 // Fetch GeoJSON data for tweets
//                 axios.get('/tweet.geojson')
//                     .then(response => {
//                         const tweets = response.data;

//                         // Add tweet count to each feature in the suburbs data
//                         data.features.forEach(feature => {
//                             feature.properties.tweetCount = tweets.features.filter(tweet => {
//                                 const [lon, lat] = tweet.geometry.coordinates;
//                                 return pointInPolygon({ latitude: lat, longitude: lon }, feature.geometry.coordinates);
//                             }).length;
//                         });

//                         // Define color scale function
//                         const getColor = (tweetCount) => {
//                             let color;

//                             if (tweetCount < 10) {
//                                 color = '#ffffcc';
//                             } else if (tweetCount < 20) {
//                                 color = '#c7e9b4';
//                             } else if (tweetCount < 30) {
//                                 color = '#7fcdbb';
//                             } else if (tweetCount < 40) {
//                                 color = '#41b6c4';
//                             } else if (tweetCount < 50) {
//                                 color = '#2c7fb8';
//                             } else {
//                                 color = '#253494';
//                             }

//                             return color;
//                         };

//                         // Define onEachFeature function
//                         const onEachFeature = (feature, layer) => {
//                             const tweetCount = feature.properties.tweetCount;
//                             const suburb = feature.properties.geography0;
//                             layer.on('mouseover', () => layer.bindTooltip(`Number of tweets: ${tweetCount}\nSuburb: ${suburb}`));
//                         };

//                         // Add GeoJSON layer
//                         L.geoJSON(data, {
//                             style: (feature) => {
//                                 const tweetCount = feature.properties.tweetCount;
//                                 return { fillColor: getColor(tweetCount), fillOpacity: 0.5, color: '#000' };
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

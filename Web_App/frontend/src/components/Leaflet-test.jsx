// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import * as turf from '@turf/turf';

// const MapComponent = () => {
//     const mapRef = useRef(null);

//     useEffect(() => {
//         if (!mapRef.current) return;

//         const map = L.map(mapRef.current).setView([-25.2744, 133.7751], 4);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 55,
//             attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//         }).addTo(map);

//         const getColor = (percentageChange) => {
//                         let color;
            
//                         if (percentageChange <= 0) {
//                             color = '#006400';
//                         } else if (percentageChange < 5) {
//                             color = '#ADFF2F';
//                         } else if (percentageChange < 10) {
//                             color = '#FFD700';
//                         } else if (percentageChange < 20) {
//                             color = '#FF8C00';
//                         } else if (percentageChange < 50) {
//                             color = '#FF0000';
//                         } else {
//                             color = '#800000';
//                         }
            
//                         return color;
//                     };

//         const sentimentBySuburb = {};

//         const happyIcon = L.icon({
//             iconUrl: '/happy.png',
//             iconSize: [38, 38] // size of the icon
//         });

//         const sadIcon = L.icon({
//             iconUrl: '/sad.png',
//             iconSize: [38, 38] // size of the icon
//         });
//         // Create the legend
//         const legend = L.control({ position: 'bottomright' });

//         legend.onAdd = function () {
//             const div = L.DomUtil.create('div', 'info legend');
//             const grades = [0, 5, 10, 20, 50]; 
//             const colors = ['#800000', '#FF0000', '#FF8C00', '#FFD700', '#ADFF2F'];

            
//             for (let i = 0; i < grades.length; i++) {
//                 div.innerHTML +=
//                     '<i style="background:' + colors[i] + '"></i> ' +
//                     grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//             }

//             return div;
//         };

// legend.addTo(map);
//         fetch('/housing-tweets')
//             .then(response => response.json())
//             .then(data => {
//                 data.rows.forEach(row => {
//                     console.error('row map 1: ', row)
//                     sentimentBySuburb[row.key] = row.value.avgSentiment;
//                     console.error(sentimentBySuburb)
//                 });

//                 fetch('/map')
//                     .then(response => response.json())
//                     .then(data => {
//                         const onEachFeature = (feature, layer) => {
//                             console.log('map feature: ', feature)
//                             if (feature.properties && feature.properties.rentalIndexDifference !== undefined) {
//                                 const percentageChange = feature.properties.rentalIndexDifference;
//                                 const suburb = feature.properties.id;
//                                 const sentiment = sentimentBySuburb[suburb] || 'N/A';
//                                 // Determine the sentiment icon
//                                 if (!isNaN(sentiment)) {
//                                     // Determine the sentiment icon
//                                     const sentimentIcon = sentiment > 0 ? happyIcon : sadIcon;

//                                     // Add a marker at the centroid of the polygon
//                                     const centroid = turf.centroid(feature);
//                                     L.marker([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]], {icon: sentimentIcon}).addTo(map);
//                                 }
//                                 layer.on('mouseover', () => layer.bindTooltip(`Percentage Change: ${percentageChange}\nSuburb: ${suburb}\nSentiment: ${sentiment}`));
//                             }
//                             else {
//                                 console.error('Feature missing rentalIndexDifference:', feature);
//                             }
//                         };

//                         data.forEach(feature => {
//                             L.geoJSON(feature, {
//                                 style: () => {
//                                     const percentageChange = feature.properties.rentalIndexDifference;
//                                     return { fillColor: getColor(percentageChange), fillOpacity: 0.5, color: '#000' };
//                                 },
//                                 onEachFeature: onEachFeature
//                             }).addTo(map);
//                         });
//                     })
//                     .catch(error => console.error('Error fetching geojson data:', error));
//             })
//             .catch(error => console.error('Error fetching sentiment data:', error));

//         return () => {
//             map.remove();
//         };
//     }, []);

//     return (
//         <div id="map" ref={mapRef} style={{ height: "600px" }} />
//     );
// };

// export default MapComponent;




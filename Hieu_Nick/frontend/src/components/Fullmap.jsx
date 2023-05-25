    import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';

const MapComponent2 = () => {
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

        const happyIcon = L.icon({
            iconUrl: '/happy.png',
            iconSize: [38, 38] // size of the icon
        });

        const sadIcon = L.icon({
            iconUrl: '/sad.png',
            iconSize: [38, 38] // size of the icon
        });

        const sentimentBySuburb = {};

        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            const grades = [-20, -10, 0, 10, 20];
            const colors = ['#800000', '#FF0000', '#FF8C00', '#FFD700', '#ADFF2F'];

            for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(map);

        fetch('/suburb-sentiment')
            .then(response => response.json())
            .then(data => {
                data.rows.forEach(row => {
                    console.log('row.key',typeof row.key);
                    sentimentBySuburb[row.key] = row.value.avgSentiment;
                });
                // chain the second fetch after the first one is done
                return fetch('/map');
            })
            .then(response => response.json())
            .then(features => {
                features.forEach(feature => {
                    const onEachFeature = (feature, layer) => {
                        const suburb = feature.properties.id;
                        const rentalIndexDifference = feature.properties.rentalIndexDifference || 'N/A';
                        console.log('suburb ', typeof suburb);
                        const avgSentiment = sentimentBySuburb[suburb] || 'N/A';
                        // Determine the sentiment icon
                        if (!isNaN(avgSentiment)) {
                            // Determine the sentiment icon
                            const sentimentIcon = avgSentiment > 0 ? happyIcon : sadIcon;

                            // Add a marker at the centroid of the polygon
                            const centroid = turf.centroid(feature);
                            L.marker([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]], {icon: sentimentIcon}).addTo(map);
                        }
                        layer.on('mouseover', () => layer.bindTooltip(`Suburb: ${suburb}\nRental Index Difference: ${rentalIndexDifference}\nAverage Sentiment: ${avgSentiment}`));
                    };

                    L.geoJSON(feature, {
                        style: () => {
                            const rentalIndexDifference = feature.properties.rentalIndexDifference || 'N/A';
                            return { fillColor: getColor(rentalIndexDifference), fillOpacity: 0.5, color: '#000' };
                        },
                        onEachFeature: onEachFeature
                    }).addTo(map);
                });
            })
            .catch(error => console.error('Error fetching data:', error));

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div id="map" ref={mapRef} style={{ height: "650px", width:"1525px" }} />
    );
};

export default MapComponent2;

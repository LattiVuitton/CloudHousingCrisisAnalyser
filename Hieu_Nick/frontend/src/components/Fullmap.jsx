import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import './App.css'
import { Box } from '@mui/system';

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

const happyIcon = L.icon({
    iconUrl: '/happy.png',
    iconSize: [24, 24] // size of the icon
});

const sadIcon = L.icon({
    iconUrl: '/sad.png',
    iconSize: [24, 24] // size of the icon
});

const MapComponent2 = () => {
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true); 
    const [sentiment, setSentiment] = useState(undefined)
    const [mapFeatures, setMapFeatures] = useState(undefined)

    useEffect(() => {
        if (sentiment) return
        console.log('fetching suburb sentiment')
        const fetchSuburbSentiment = async () => {
            const sentimentBySuburb = {}
            const data = await fetch('/suburb-sentiment')
            const dataJson = await data.json()
            dataJson.rows.forEach(row => {
                sentimentBySuburb[row.key] = row.value.avgSentiment;
            });
            setSentiment(sentimentBySuburb)
        }
        fetchSuburbSentiment().catch(console.error)
        console.log('fetched suburb sentiment')
    }, [sentiment, setSentiment])

    useEffect(() => {
        if (!sentiment || mapFeatures) return
        const fetchMapFeatures = async () => {
            console.log('fetching map features')
            const data = await fetch('/map')
            const dataJson = await data.json()
            setMapFeatures(dataJson)
            setLoading(false)
        }
        fetchMapFeatures().catch(console.error)
        console.log('fetched map features')
    }, [sentiment, mapFeatures, setMapFeatures, setLoading])

    useEffect(() => {
        if (!sentiment || !mapFeatures) return
        if (!mapRef.current) return;
        
        const map = L.map(mapRef.current).setView([-25.2744, 133.7751], 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 55,
            attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        legend.addTo(map);

        mapFeatures.data.forEach(feature => {
            const onEachFeature = (feature, layer) => {
                console.log("feature data: ", feature.data)
                const suburb = feature.properties.id;
                const rentalIndexDifference = feature.properties.rentalIndexDifference || 'N/A';
                console.log('suburb ', typeof suburb);
                const avgSentiment = sentiment[suburb] || 'N/A';
                
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
                onEachFeature
            }).addTo(map);
        })
        return () => {
            map.remove();
        };
    legend.addTo(map);
    }, [mapRef, loading, sentiment, mapFeatures]);
 
    return loading ? (<Box display="flex" alignItems="center" justifyContent="center" height="100%" width="100%"><div className="lds-dual-ring"></div></Box>) : (
        <div id="map" ref={mapRef} style={{ height: "600px" }} />
    );
};

export default MapComponent2;

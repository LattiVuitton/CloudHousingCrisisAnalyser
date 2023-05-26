

import React, { useEffect, useRef, useState } from 'react';
import L, { point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import { Box } from '@mui/system';

const getColor = (medianIncome) => {
    let color;

    if (medianIncome <= 1000) {
        color = '#5D1616';
    } else if (medianIncome <= 1200) {
        color = '#842626';
    } else if (medianIncome <= 1400) {
        color = '#A44716';
    } else if (medianIncome <= 1600) {
        color = '#BD693B';
    } else if (medianIncome <= 2000) {
        color = '#779B52';
    } else {
        color = '#FED976';
    }

    return color;
};
const happyIcon = L.icon({
    iconUrl: '/happy.png',
    iconSize: [24, 24] // size of the icon
});

const sadIcon = L.icon({
    iconUrl: '/sad.png',
    iconSize: [24, 24] // size of the icon
});
const legend = L.control({ position: 'bottomright' });

legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 500, 1000, 1500, 1700, 2000, 2400];
    const labels = [];

    for (let i = 0; i < grades.length; i++) {
        labels.push(
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};


const MapComponent3 = () => {
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [sentimentData, setSentimentData] = useState(null);
    const [mapFeatures, setMapFeatures] = useState(null);

    useEffect(() => {
        if (sentimentData) return;

        console.log('fetching suburb sentiment');
        const fetchSuburbSentiment = async () => {
            const response = await fetch('/vic-nsw-sentiment');
            const data = await response.json();
            setSentimentData(data.rows);
        };

        fetchSuburbSentiment().catch(console.error);
        console.log('fetched suburb sentiment');
    }, [sentimentData]);

    useEffect(() => {
        if (!sentimentData || mapFeatures) return;

        console.log('fetching map features');
        const fetchMapFeatures = async () => {
            const response = await fetch('/median-income');
            const data = await response.json();
            setMapFeatures(data.rows);
            setLoading(false);
        };

        fetchMapFeatures().catch(console.error);
        console.log('fetched map features');
    }, [sentimentData, mapFeatures, setLoading]);

    useEffect(() => {
        if (loading || !sentimentData || !mapFeatures) return;
        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView([-25.2744, 133.7751], 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 55,
            attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapFeatures.forEach(row => {
            const feature = {
                type: "Feature",
                geometry: row.value.geometry,
                properties: {
                    median_tot_hhd_inc_weekly: row.value.median_tot_hhd_inc_weekly
                }
            };
            const medianIncome = feature.properties.median_tot_hhd_inc_weekly || 'N/A';
            const polygon = turf.multiPolygon(row.value.geometry.coordinates);
            let sentimentSum = 0;
            let pointCount = 0;

            sentimentData.forEach(dataPoint => {
                const point = turf.point(dataPoint.value.coordinates);
                if (turf.booleanPointInPolygon(point, polygon)) {
                    sentimentSum += dataPoint.value.avgSentiment;
                    pointCount++;
                    
                }
            });

            const avgSentiment = pointCount > 0 ? sentimentSum / pointCount : 'N/A';
            const sentimentIcon = avgSentiment > 0 ? happyIcon : sadIcon;

            // calculate centroid for marker
            const centroid = turf.centerOfMass(feature);
            if (!isNaN(avgSentiment)) {
            L.marker([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]], { icon: sentimentIcon }).addTo(map);
            }
            const onEachFeature = (feature, layer) => {
               
                layer.bindPopup(`Median Total Household Income Weekly: ${medianIncome}, Average Sentiment: ${avgSentiment}`);
            };

            L.geoJSON(feature, {
                style: () => {
                    return { fillColor: getColor(medianIncome), fillOpacity: 0.5, color: '#000' };
                },
                onEachFeature: onEachFeature
            }).addTo(map);
        });

        return () => {
            map.remove();
        };
    }, [mapRef, loading, sentimentData, mapFeatures]);

    return loading ? (<Box display="flex" alignItems="center" justifyContent="center" height="100%" width="100%"><div className="lds-dual-ring"></div></Box>) : (
        <div id="map" ref={mapRef} style={{ height: "600px", width: "100%" }} />
    );
};

export default MapComponent3;

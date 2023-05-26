import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
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

const sadIcon = L.icon({
    iconUrl: '/sad.png',
    iconSize: [24, 24] 
});

const MapComponent4 = () => {
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [tweetData, setTweetData] = useState(null);
    const [mapFeatures, setMapFeatures] = useState(null);

    useEffect(() => {
        if (!tweetData) {
            console.log('fetching tweet data');
            fetch('/vic-nsw-sentiment')
                .then(response => response.json())
                .then(data => setTweetData(data.rows))
                .catch(console.error);
        }
    }, [tweetData]);

    useEffect(() => {
        if (!tweetData || mapFeatures) return;

        console.log('fetching map features');
        fetch('/median-income')
            .then(response => response.json())
            .then(data => {
                setMapFeatures(data.rows);
                setLoading(false);
            })
            .catch(console.error);
    }, [tweetData, mapFeatures]);

    useEffect(() => {
        if (loading || !tweetData || !mapFeatures) return;
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
            let offensiveCount = 0;

            tweetData.forEach(tweet => {
                const point = turf.point(tweet.value.coordinates);
                console.error('tweet values: ', tweet.value)
                console.error('offesnive tweet count ',tweet.value.offensive_count )
                if (turf.booleanPointInPolygon(point, polygon) && tweet.value.offensive_count) {
                    offensiveCount++;
                }
                
            });
            // calculate centroid for marker
            const centroid = turf.centerOfMass(feature);

            // add marker to the map if offensiveCount is greater than 0
            if (offensiveCount > 0) {
                L.marker([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]], { icon: sadIcon }).addTo(map);
            }

            const onEachFeature = (feature, layer) => {
                layer.bindPopup(`Median Total Household Income Weekly: ${medianIncome}, Offensive Tweets: ${offensiveCount}`);
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
    }, [mapRef, loading, tweetData, mapFeatures]);

    return loading ? (<Box display="flex" alignItems="center" justifyContent="center" height="100%" width="100%"><div className="lds-dual-ring"></div></Box>) : (
        <div id="map" ref={mapRef} style={{ height: "600px", width: "100%" }} />
    );
};

export default MapComponent4;

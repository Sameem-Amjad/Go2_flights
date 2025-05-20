import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { MdDarkMode, MdOutlineLightMode, MdOutlineReplayCircleFilled, MdOutlineSatelliteAlt } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

const MapModal = ({ slices, setShowMapModal }) => {
    const [mapUrl, setMapUrl] = useState('mapbox://styles/mapbox/outdoors-v11');
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const pointRef = useRef(null);
    const routeRef = useRef([]);
    const [disabled, setDisabled] = useState(true);

    const flattenSegments = () => {
        const allCoords = [];
        slices.forEach(slice => {
            slice.segments.forEach(seg => {
                const origin = [seg.origin.longitude, seg.origin.latitude];
                const destination = [seg.destination.longitude, seg.destination.latitude];
                allCoords.push([origin, destination]);
            });
        });
        return allCoords;
    };

    const generateAnimatedRoute = () => {
        const segments = flattenSegments();
        const allPoints = [];

        segments.forEach(([start, end]) => {
            const line = turf.greatCircle(turf.point(start), turf.point(end), {
                npoints: 500,
                properties: {},
            });
            allPoints.push(...line.geometry.coordinates);
        });

        return allPoints;
    };

    const animateRoute = (route, startTime = null, duration = 10000) => {
        if (route.length < 2) return;

        const line = turf.lineString(route);
        const totalLength = turf.length(line, { units: 'kilometers' });

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const t = Math.min(elapsed / duration, 1);
            const dist = t * totalLength;

            const pointOnLine = turf.along(line, dist, { units: 'kilometers' });
            const nextPoint = turf.along(line, dist + 0.01, { units: 'kilometers' });

            pointRef.current.features[0].geometry.coordinates = pointOnLine.geometry.coordinates;
            pointRef.current.features[0].properties.bearing = turf.bearing(pointOnLine, nextPoint);

            mapRef.current.getSource('point').setData(pointRef.current);

            mapRef.current.easeTo({
                center: pointOnLine.geometry.coordinates,
                duration: 500,
                pitch: 45,
                bearing: pointRef.current.features[0].properties.bearing,
                easing: t => t,
            });

            if (t < 1) {
                requestAnimationFrame((ts) => step(ts));
            } else {
                setDisabled(false); // done
            }
        };

        requestAnimationFrame(step);
    };

    const handleReplay = () => {
        const routeCoords = generateAnimatedRoute();
        routeRef.current.features[0].geometry.coordinates = routeCoords;

        mapRef.current.getSource('route').setData(routeRef.current);
        pointRef.current.features[0].geometry.coordinates = routeCoords[0];
        mapRef.current.getSource('point').setData(pointRef.current);

        setDisabled(true);
        animateRoute(routeCoords, null, 10000); // 10 seconds
    };

    useEffect(() => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
            mapRef.current.setStyle(mapUrl);

            mapRef.current.once('styledata', () => {
                if (!mapRef.current.hasImage('airplane')) {
                    mapRef.current.loadImage('/images/airplane.png', (error, image) => {
                        if (error) return console.error(error);
                        mapRef.current.addImage('airplane', image, { sdf: true });
                    });
                }

                // Re-add sources and layers after style change
                mapRef.current.addSource('route', {
                    type: 'geojson',
                    data: routeRef.current,
                });

                mapRef.current.addSource('point', {
                    type: 'geojson',
                    data: pointRef.current,
                });

                mapRef.current.addLayer({
                    id: 'route',
                    source: 'route',
                    type: 'line',
                    paint: {
                        'line-width': 2,
                        'line-color': '#007cbf',
                    },
                });

                mapRef.current.addLayer({
                    id: 'point',
                    source: 'point',
                    type: 'symbol',
                    layout: {
                        'icon-image': 'airplane',
                        'icon-size': 0.1,
                        'icon-rotate': ['get', 'bearing'],
                        'icon-rotation-alignment': 'map',
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                    },
                    paint: {
                        'icon-color': '#000',
                    },
                });
            });
        }
    }, [mapUrl]);


    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: mapUrl,
            // style: 'mapbox://styles/mapbox/dark-v11',
            // style: 'mapbox://styles/mapbox/light-v11',
            // style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-96, 37.8],
            zoom: 4,
            pitch: 40,
        });

        mapRef.current = map;

        const routeCoords = generateAnimatedRoute();

        routeRef.current = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoords,
                    },
                },
            ],
        };

        pointRef.current = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: routeCoords[0],
                    },
                },
            ],
        };

        map.on('load', () => {
            // Add airplane icon
            map.loadImage('/images/airplane.png', (error, image) => {
                if (error) throw error;
                if (!map.hasImage('airplane')) {
                    map.addImage('airplane', image, { sdf: true });
                }

                map.addSource('route', {
                    type: 'geojson',
                    data: routeRef.current,
                });

                map.addSource('point', {
                    type: 'geojson',
                    data: pointRef.current,
                });

                map.addLayer({
                    id: 'route',
                    source: 'route',
                    type: 'line',
                    paint: {
                        'line-width': 2,
                        'line-color': '#007cbf',
                    },
                });

                map.addLayer({
                    id: 'point',
                    source: 'point',
                    type: 'symbol',
                    layout: {
                        'icon-image': 'airplane',
                        'icon-size': 0.15,
                        'icon-rotate': ['get', 'bearing'],
                        'icon-rotation-alignment': 'map',
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                    },
                    paint: {
                        'icon-color': '#000',
                    },
                });

                animateRoute(routeCoords, null, 10000); // start animation for 10 sec
            });
        });

        return () => map.remove();
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg w-11/12 md:w-[95%] max-h-[95vh] overflow-auto no-scrollbar">
                <div style={{ height: '100vh', position: 'relative' }}>
                    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', justifyContent: 'space-between', width: '98%' }}>
                        <div>
                            <button
                                disabled={disabled}
                                onClick={handleReplay}
                                className=' px-2 py-1 '
                                style={{
                                    backgroundColor: disabled ? '#f5f5f5' : '#3386c0',
                                    color: disabled ? '#c3c3c3' : '#fff',
                                    // padding: '10px 20px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '3px',
                                }}
                            >
                                <MdOutlineReplayCircleFilled />
                            </button>
                            <button
                                onClick={() => setMapUrl('mapbox://styles/mapbox/satellite-v9')}
                                className="bg-custom-gold text-white px-2 py-1 rounded-lg hover:bg-opacity-90 transition-colors ml-2"
                            >
                                <MdOutlineSatelliteAlt />
                            </button>
                            <button
                                onClick={() => setMapUrl('mapbox://styles/mapbox/outdoors-v11')}
                                className="bg-custom-gold text-white px-2 py-1 rounded-lg hover:bg-opacity-90 transition-colors ml-2"
                            >
                                <FaMapMarkedAlt />
                            </button>
                            <button
                                onClick={() => setMapUrl('mapbox://styles/mapbox/light-v11')}
                                className="bg-custom-gold text-white px-2 py-1 rounded-lg hover:bg-opacity-90 transition-colors ml-2"
                            >
                                <MdOutlineLightMode />
                            </button>
                            <button
                                onClick={() => setMapUrl('mapbox://styles/mapbox/dark-v11')}
                                className="bg-custom-gold text-white px-2 py-1 rounded-lg hover:bg-opacity-90 transition-colors ml-2"
                            >
                                <MdDarkMode />
                            </button>
                        </div>
                        <button
                            onClick={() => setShowMapModal(false)}
                            className="text-white bg-red-500 px-2 py-1 rounded-lg hover:bg-opacity-90 transition-colors ml-2"
                        >
                            <TiDelete />
                        </button>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end px-6 pb-4">
                    <button
                        onClick={() => setShowMapModal(false)}
                        className="bg-custom-gold text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapModal;

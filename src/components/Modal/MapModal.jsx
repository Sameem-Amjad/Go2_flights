import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

const MapModal = ({ slices, setShowMapModal }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const pointRef = useRef(null);
    const routeRef = useRef([]);
    const steps = 500;
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
            const arc = turf.greatCircle(
                turf.point(start),
                turf.point(end),
                {
                    npoints: steps,
                    properties: {}
                }
            );
            arc.geometry.coordinates.forEach(coord => {
                allPoints.push(coord);
            });
        });

        return allPoints;
    };

    const animateRoute = (route, index = 0) => {
        if (index >= route.length) {
            setDisabled(false);
            return;
        }

        const start = route[index - 1] || route[0];
        const end = route[index];

        pointRef.current.features[0].geometry.coordinates = end;
        pointRef.current.features[0].properties.bearing = turf.bearing(
            turf.point(start),
            turf.point(end)
        );

        mapRef.current.getSource('point').setData(pointRef.current);

        // Smoothly move the map center to follow the point with bearing and pitch
        mapRef.current.easeTo({
            center: end,
            duration: 50,
            pitch: 45,
            bearing: pointRef.current.features[0].properties.bearing,
            easing: (t) => t // linear easing, can be customized
        });

        requestAnimationFrame(() => animateRoute(route, index + 1));
    };

    const handleReplay = () => {
        const routeCoords = generateAnimatedRoute();
        routeRef.current.features[0].geometry.coordinates = routeCoords;

        mapRef.current.getSource('route').setData(routeRef.current);
        pointRef.current.features[0].geometry.coordinates = routeCoords[0];
        mapRef.current.getSource('point').setData(pointRef.current);

        setDisabled(true);
        animateRoute(routeCoords, 0);
    };

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-96, 37.8],
            zoom: 2,
            pitch: 40
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
                        coordinates: routeCoords
                    }
                }
            ]
        };

        pointRef.current = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: routeCoords[0]
                    }
                }
            ]
        };

        map.on('load', () => {
            map.addSource('route', {
                type: 'geojson',
                data: routeRef.current
            });

            map.addSource('point', {
                type: 'geojson',
                data: pointRef.current
            });

            map.addLayer({
                id: 'route',
                source: 'route',
                type: 'line',
                paint: {
                    'line-width': 2,
                    'line-color': '#007cbf'
                }
            });

            map.addLayer({
                id: 'point',
                source: 'point',
                type: 'symbol',
                layout: {
                    'icon-image': 'airport',
                    'icon-size': 1.5,
                    'icon-rotate': ['get', 'bearing'],
                    'icon-rotation-alignment': 'map',
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true
                }
            });

            animateRoute(routeCoords);
        });

        return () => map.remove();
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg  w-11/12 md:w-[95%] max-h-[95vh] overflow-auto no-scrollbar">
                <div style={{ height: '100vh', position: 'relative' }}>
                    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', justifyContent: 'space-between', width: '98%' }}>

                        <button
                            disabled={disabled}
                            onClick={handleReplay}
                            style={{
                                backgroundColor: disabled ? '#f5f5f5' : '#3386c0',
                                color: disabled ? '#c3c3c3' : '#fff',
                                padding: '10px 20px',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '3px'
                            }}
                        >
                            Replay
                        </button>
                        <button
                            onClick={() => setShowMapModal(false)}
                            className=" text-white px-5 py-2 rounded-full hover:bg-opacity-90 transition-colors"
                        >
                            x
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

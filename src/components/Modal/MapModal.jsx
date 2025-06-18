

import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { MdDarkMode, MdOutlineLightMode, MdOutlineReplayCircleFilled, MdOutlineSatelliteAlt } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import toast from 'react-hot-toast';

const MapModal = ({ slices, setShowMapModal }) => {
    const [mapUrl, setMapUrl] = useState('mapbox://styles/mapbox/outdoors-v11');
    const [disabled, setDisabled] = useState(false);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const animationFrameRefs = useRef([]); // Changed to an array to hold multiple animation IDs

    // Helper to clear all existing airplane layers and sources
    const clearAirplaneLayers = (map) => {
        if (!map) return;
        slices.forEach((_, sliceIndex) => {
            const airplaneLayerId = `airplane-layer-${sliceIndex}`;
            const airplaneSourceId = `airplane-source-${sliceIndex}`;

            if (map.getLayer(airplaneLayerId)) map.removeLayer(airplaneLayerId);
            if (map.getSource(airplaneSourceId)) map.removeSource(airplaneSourceId);
        });
    };

    const drawFlightPaths = (map, flightSlices) => {
        // Cleanup existing layers and sources for flight paths
        flightSlices.forEach((slice, sliceIndex) => {
            slice.segments.forEach((_, segmentIndex) => {
                const sourceId = `flight-path-source-${sliceIndex}-${segmentIndex}`;
                const layerId = `flight-path-layer-${sliceIndex}-${segmentIndex}`;
                if (map.getLayer(layerId)) map.removeLayer(layerId);
                if (map.getSource(sourceId)) map.removeSource(sourceId);
            });
        });

        // Clear all airplane specific layers and sources
        clearAirplaneLayers(map);

        // Cleanup existing origin/destination markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Clear any ongoing animations
        animationFrameRefs.current.forEach(id => cancelAnimationFrame(id));
        animationFrameRefs.current = [];

        let allFlightCoordinates = []; // To fit bounds for all flights

        // Load airplane image once if not already loaded
        if (!map.hasImage('airplane')) {
            map.loadImage('/images/airplane.png', (error, image) => {
                if (error) {
                    console.error('Error loading airplane image:', error);
                    toast.error('Failed to load airplane image.');
                    return;
                }
                if (!map.hasImage('airplane')) {
                    map.addImage('airplane', image);
                }
                // Redraw paths and animate after image is loaded
                animateFlights(map, flightSlices, allFlightCoordinates);
            });
        } else {
            // Image already loaded, proceed with animation
            animateFlights(map, flightSlices, allFlightCoordinates);
        }
    };

    const animateFlights = (map, flightSlices, allFlightCoordinates) => {
        flightSlices.forEach((slice, sliceIndex) => {
            let fullCoordinates = []; // For the current slice's flight path

            slice.segments.forEach((segment, segmentIndex) => {
                if (
                    !segment?.origin || !segment?.destination ||
                    (segment.origin.latitude === segment.destination.latitude &&
                        segment.origin.longitude === segment.destination.longitude)
                ) return;

                const start = [segment.origin.longitude, segment.origin.latitude];
                const end = [segment.destination.longitude, segment.destination.latitude];

                const arc = turf.greatCircle(turf.point(start), turf.point(end), {
                    npoints: 100,
                    properties: {}
                });

                const arcCoords = arc.geometry.coordinates || [];
                fullCoordinates.push(...arcCoords);
                allFlightCoordinates.push(...arcCoords); // Accumulate for overall bounds

                const sourceId = `flight-path-source-${sliceIndex}-${segmentIndex}`;
                const layerId = `flight-path-layer-${sliceIndex}-${segmentIndex}`;

                if (map.getSource(sourceId)) { // Prevent adding duplicate source
                    map.removeLayer(layerId);
                    map.removeSource(sourceId);
                }
                map.addSource(sourceId, {
                    type: 'geojson',
                    data: arc
                });

                map.addLayer({
                    id: layerId,
                    type: 'line',
                    source: sourceId,
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#007cbf', 'line-width': 2 }
                });

                const originMarker = new mapboxgl.Marker({ color: 'green' })
                    .setLngLat(start)
                    .setPopup(new mapboxgl.Popup().setText(`Origin: ${segment.origin.name || 'Unknown'}`))
                    .addTo(map);
                markersRef.current.push(originMarker);

                const destinationMarker = new mapboxgl.Marker({ color: 'red' })
                    .setLngLat(end)
                    .setPopup(new mapboxgl.Popup().setText(`Destination: ${segment.destination.name || 'Unknown'}`))
                    .addTo(map);
                markersRef.current.push(destinationMarker);
            });

            // Animate airplane for the *full path of the current slice*
            if (fullCoordinates.length >= 2) {
                const validCoords = fullCoordinates.filter(coord =>
                    Array.isArray(coord) &&
                    coord.length === 2 &&
                    typeof coord[0] === 'number' &&
                    typeof coord[1] === 'number'
                );

                if (validCoords.length < 2) return; // Not enough valid coordinates for animation

                const line = turf.lineString(validCoords);
                const lineLength = turf.length(line, { units: 'kilometers' });
                if (lineLength === 0) return;

                const duration = lineLength * 2; // adjust multiplier for speed

                // Add source and layer for the airplane marker (unique for each slice)
                const airplaneSourceId = `airplane-source-${sliceIndex}`;
                const airplaneLayerId = `airplane-layer-${sliceIndex}`;

                // Ensure the source and layer are removed before adding if they already exist
                if (map.getLayer(airplaneLayerId)) map.removeLayer(airplaneLayerId);
                if (map.getSource(airplaneSourceId)) map.removeSource(airplaneSourceId);

                map.addSource(airplaneSourceId, {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: validCoords[0] // Initial position
                                },
                                properties: {
                                    bearing: 0 // Initial bearing
                                }
                            }
                        ]
                    }
                });

                map.addLayer({
                    id: airplaneLayerId,
                    type: 'symbol',
                    source: airplaneSourceId,
                    layout: {
                        'icon-image': 'airplane', // Use the loaded image
                        'icon-size': 0.08, // Adjust size as needed
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                        'icon-rotate': ['get', 'bearing'], // Rotate based on bearing property
                        'icon-rotation-alignment': 'map' // Align icon rotation with the map
                    }
                });

                let startTime;
                const animate = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const elapsed = timestamp - startTime;
                    const t = Math.min(elapsed / duration, 1);

                    const along = turf.along(line, t * lineLength, { units: 'kilometers' });
                    const coord = along.geometry.coordinates;

                    let bearing = 0;
                    if (t < 1) { // Calculate bearing only if not at the very end
                        const nextAlong = turf.along(line, Math.min(t + 0.01, 1) * lineLength, { units: 'kilometers' });
                        const nextCoord = nextAlong.geometry.coordinates;
                        bearing = turf.bearing(turf.point(coord), turf.point(nextCoord));
                    }

                    // Only update the source if it still exists (map might have been removed)
                    if (map.getSource(airplaneSourceId)) {
                        map.getSource(airplaneSourceId).setData({
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: coord
                                    },
                                    properties: {
                                        bearing: bearing
                                    }
                                }
                            ]
                        });
                    }


                    if (t < 1) {
                        animationFrameRefs.current[sliceIndex] = requestAnimationFrame(animate);
                    } else {
                        // Animation complete for this specific slice's airplane.
                        // Remove ONLY THIS SLICE'S airplane layer and source.
                        if (map.getLayer(airplaneLayerId)) map.removeLayer(airplaneLayerId);
                        if (map.getSource(airplaneSourceId)) map.removeSource(airplaneSourceId);
                        animationFrameRefs.current[sliceIndex] = null; // Clear the ref for this slice
                    }
                };

                // Start animation with a slight delay
                // Store the requestAnimationFrame ID in the array for this specific slice
                setTimeout(() => {
                    animationFrameRefs.current[sliceIndex] = requestAnimationFrame(animate);
                }, 1000 * sliceIndex); // Stagger animations if you want, or just 1000 for all at once
            }
        });

        // Fit bounds for all flight paths after processing all slices
        const allBounds = new mapboxgl.LngLatBounds();
        allFlightCoordinates.forEach(coord => allBounds.extend(coord));
        if (!allBounds.isEmpty()) {
            map.fitBounds(allBounds, { padding: 50, duration: 1000 });
        }
    };


    useEffect(() => {
        if (!mapboxgl) {
            console.error("Mapbox GL JS not loaded.");
            toast.error("Mapbox GL JS failed to load.");
            return;
        }
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: mapUrl,
                center: [0, 0],
                zoom: 2
            });

            mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            mapRef.current.on('load', () => drawFlightPaths(mapRef.current, slices));
        } else {
            mapRef.current.setStyle(mapUrl);
            mapRef.current.setCenter([0, 0]);
            mapRef.current.setZoom(2)
            mapRef.current.once('styledata', () => drawFlightPaths(mapRef.current, slices));
        }

        return () => {
            if (mapRef.current) {
                // Cancel any ongoing animations before removing the map
                animationFrameRefs.current.forEach(id => {
                    if (id) cancelAnimationFrame(id);
                });
                animationFrameRefs.current = []; // Clear the array

                // Clear all airplane layers and sources for a clean unmount
                clearAirplaneLayers(mapRef.current);

                mapRef.current.remove();
                mapRef.current = null;
                markersRef.current.forEach(marker => marker.remove()); // Ensure all markers are removed
                markersRef.current = [];
            }
        };
    }, [mapUrl, slices]); // Depend on slices to re-draw if slices data changes

    const handleReplay = () => {
        setDisabled(true);
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
            // Re-call drawFlightPaths which will handle cleanup and re-animation
            drawFlightPaths(mapRef.current, slices);
        }
        setTimeout(() => setDisabled(false), 2000); // Re-enable button after 2 seconds
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg w-11/12 md:w-[95%] max-h-[95vh] overflow-auto no-scrollbar">
                <div style={{ height: '100vh', position: 'relative' }}>
                    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', justifyContent: 'space-between', width: '98%' }}>
                        <div>
                            <button disabled={disabled} onClick={handleReplay} className='px-2 py-1'
                                style={{
                                    backgroundColor: disabled ? '#f5f5f5' : '#3386c0',
                                    color: disabled ? '#c3c3c3' : '#fff',
                                    border: 'none',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    borderRadius: '3px',
                                }}>
                                <MdOutlineReplayCircleFilled />
                            </button>
                            <button onClick={() => setMapUrl('mapbox://styles/mapbox/satellite-v9')} className="bg-custom-gold text-white px-2 py-1 rounded-lg ml-2">
                                <MdOutlineSatelliteAlt />
                            </button>
                            <button onClick={() => setMapUrl('mapbox://styles/mapbox/outdoors-v11')} className="bg-custom-gold text-white px-2 py-1 rounded-lg ml-2">
                                <FaMapMarkedAlt />
                            </button>
                            <button onClick={() => setMapUrl('mapbox://styles/mapbox/light-v11')} className="bg-custom-gold text-white px-2 py-1 rounded-lg ml-2">
                                <MdOutlineLightMode />
                            </button>
                            <button onClick={() => setMapUrl('mapbox://styles/mapbox/dark-v11')} className="bg-custom-gold text-white px-2 py-1 rounded-lg ml-2">
                                <MdDarkMode />
                            </button>
                            <button onClick={() => setShowMapModal(false)} className="text-white bg-red-500 px-2 py-1 rounded-lg ml-2">
                                <TiDelete />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end px-6 pb-4">
                    <button onClick={() => setShowMapModal(false)} className="bg-[#FFD700] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md">
                        Close Modal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapModal;


import React, { useEffect, useState, useRef } from "react";
import { Circle, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import airplaneIcon from "../../assets/png/airplane.png";
const containerStyle = {
    width: "100%",
    height: "500px",
};

const generateCurve = (start, end, numPoints = 40, deviation = 0.0005) => {
    const toRadians = deg => (deg * Math.PI) / 180;
    const toDegrees = rad => (rad * 180) / Math.PI;

    const lat1 = toRadians(start.lat);
    const lng1 = toRadians(start.lng);
    const lat2 = toRadians(end.lat);
    const lng2 = toRadians(end.lng);

    const points = [];

    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;

        // Interpolate linearly
        const lat = start.lat + (end.lat - start.lat) * t;
        const lng = start.lng + (end.lng - start.lng) * t;

        // Add deviation perpendicular to the line direction
        const dx = end.lng - start.lng;
        const dy = end.lat - start.lat;
        const length = Math.sqrt(dx * dx + dy * dy);

        const offsetX = -dy / length * Math.sin(t * Math.PI) * deviation;
        const offsetY = dx / length * Math.sin(t * Math.PI) * deviation;

        points.push({
            lat: lat + offsetY,
            lng: lng + offsetX
        });
    }

    return points;
};


const MapModal = ({ slices, setShowMapModal }) => {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [flightPaths, setFlightPaths] = useState([]);
    const [planePos, setPlanePos] = useState(null);
    const [animationPath, setAnimationPath] = useState([]);
    const animationRef = useRef(null);
    const animationIndexRef = useRef(0);
    const animationSpeed = 75; // Increased for even slower animation

    const handleMapLoad = (map) => {
        mapRef.current = map;
        setMapLoaded(true);
    };

    useEffect(() => {
        if (!mapLoaded || !slices || slices.length === 0) {
            return
        };
        const paths = [];
        const animationPoints = [];

        if (!slices || slices.length === 0) return;

        slices.forEach((slice) => {
            slice.segments.forEach((segment) => {
                const { origin, destination } = segment;
                const originLatLng = {
                    lat: origin.latitude,
                    lng: origin.longitude,
                };
                const destLatLng = {
                    lat: destination.latitude,
                    lng: destination.longitude,
                };

                const curve = generateCurve(originLatLng, destLatLng, 100, 0.05); // Further reduced points and arc
                paths.push(curve);
                animationPoints.push(...curve);
            });
        });

        setFlightPaths(paths);
        setAnimationPath(animationPoints);

        if (mapRef.current && animationPoints.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            animationPoints.forEach((point) => bounds.extend(point));
            mapRef.current.fitBounds(bounds);
            setPlanePos(animationPoints[0]);
        }

        animationIndexRef.current = 0;
    }, [mapLoaded, slices]);

    useEffect(() => {
        if (mapLoaded) {
            setTimeout(() => {
                window.google.maps.event.trigger(mapRef.current, "resize");
            }, 300);
        }
    }, [mapLoaded]);

    useEffect(() => {
        if (animationPath.length === 0) return;

        let animationFrameId;

        const animate = () => {
            const idx = animationIndexRef.current;

            if (idx < animationPath.length - 1) {
                animationIndexRef.current += 1;
                setPlanePos(animationPath[idx]);
                animationFrameId = setTimeout(animate, animationSpeed);
            }
        };

        animationFrameId = setTimeout(animate, animationSpeed);

        return () => {
            clearTimeout(animationFrameId);
        };
    }, [animationPath, animationSpeed]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg pt-6 w-11/12 md:w-[85%] max-h-[95vh] overflow-auto no-scrollbar">
                <div className="w-full flex justify-between items-center border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-custom-green">Flight Direction</h2>
                    <button
                        className="text-xl font-semibold text-custom-green hover:text-custom-gold transition-colors"
                        onClick={() => setShowMapModal(false)}
                    >
                        ×
                    </button>
                </div>

                <GoogleMap
                    mapContainerStyle={containerStyle}
                    onLoad={(map) => handleMapLoad(map)}
                    zoom={2}
                    center={{ lat: 0, lng: 0 }} // Center the map
                >
                    {mapLoaded && flightPaths.map((curvePath, idx) => (
                        <Polyline
                            key={idx}
                            path={curvePath}
                            options={{
                                strokeColor: "#0000FF", // Blue color
                                strokeOpacity: 0.8,
                                strokeWeight: 4,
                            }}
                        />
                    ))}

                    {/* Plane Marker */}
                    {/* {planePos && (
                        <Marker
                            position={planePos}
                            icon={{
                                url: airplaneIcon,
                                scaledSize: new window.google.maps.Size(15, 15),

                            }}
                        />
                    )} */}
                    
                    {/* 
                    {mapLoaded && slices?.map((slice, sliceIndex) =>
                        slice.segments.map((segment, segmentIndex) => {
                            const originLatLng = {
                                lat: segment.origin.latitude,
                                lng: segment.origin.longitude,
                            };
                            const destLatLng = {
                                lat: segment.destination.latitude,
                                lng: segment.destination.longitude,
                            };

                            return (
                                <React.Fragment key={`${sliceIndex}-${segmentIndex}`}>
                                    <Marker
                                        position={originLatLng}
                                        label={{
                                            text: segment.origin.city_name,
                                            fontSize: "12px",
                                            color: "#0000FF",
                                            fontWeight: "bold",
                                        }}
                                    />
                                    <Circle
                                        center={originLatLng}
                                        radius={10000} // Adjust based on zoom level
                                        options={{
                                            fillColor: "#0000FF",
                                            fillOpacity: 0.3,
                                            strokeColor: "#0000FF",
                                            strokeOpacity: 0.8,
                                            strokeWeight: 1,
                                        }}
                                    />

                                    <Marker
                                        position={destLatLng}
                                        label={{
                                            text: segment.destination.city_name,
                                            fontSize: "12px",
                                            color: "#0000FF",
                                            fontWeight: "bold",
                                        }}
                                    />
                                    <Circle
                                        center={destLatLng}
                                        radius={10000}
                                        options={{
                                            fillColor: "#0000FF",
                                            fillOpacity: 0.3,
                                            strokeColor: "#0000FF",
                                            strokeOpacity: 0.8,
                                            strokeWeight: 1,
                                        }}
                                    />
                                </React.Fragment>
                            );
                        })
                    )} */}
                </GoogleMap>

                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
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
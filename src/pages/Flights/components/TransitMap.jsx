// components/TransitMap.jsx
import React, { useEffect, useRef } from "react";
import {
    GoogleMap,
    useJsApiLoader
} from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "500px"
};

const center = {
    lat: 37.7749, // fallback center (e.g. San Francisco)
    lng: -122.4194
};

const TransitMap = ({ origin, destination }) => {
    const mapRef = useRef(null);
    const directionsRendererRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries: ['places']
    });

    useEffect(() => {
        if (isLoaded && origin && destination) {
            const map = mapRef.current;
            const directionsService = new google.maps.DirectionsService();

            if (!directionsRendererRef.current) {
                directionsRendererRef.current = new google.maps.DirectionsRenderer({ suppressMarkers: false });
            }

            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.TRANSIT
                },
                (result, status) => {
                    if (status === "OK") {
                        directionsRendererRef.current.setDirections(result);
                        directionsRendererRef.current.setMap(map);
                    } else {
                        console.error("Error fetching directions", status);
                    }
                }
            );
        }
    }, [isLoaded, origin, destination]);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={(map) => (mapRef.current = map)}
        />
    ) : (
        <p>Loading Map...</p>
    );
};

export default TransitMap;

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleMap, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";

const containerStyle = {
    width: '100%',
    height: '300px' // Adjust map height as needed
};

const libraries = ["places"];

const NearByTransportOption = ({ destination }) => {
    const [steps, setSteps] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);
    const [summary, setSummary] = useState("");
    const [duration, setDuration] = useState("");
    const [distance, setDistance] = useState("");
    const [error, setError] = useState(null);
    const [originCoords, setOriginCoords] = useState(null);

    // State for Google Maps Directions API to render the route
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [firstMileToStation, setFirstMileToStation] = useState(null); // New state for the "first mile" info

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries: libraries,
    });

    const mapRef = useRef(null);
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setOriginCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            () => {
                toast.error("Unable to access your location. Please allow location access in your browser settings.");
                setError("Unable to access your location. Please allow location access in your browser settings.");
            }
        );
    }, []);

    useEffect(() => {
        if (originCoords && destination) {
            const origin = `${originCoords.lat},${originCoords.lng}`;
            const fetchTransport = async () => {
                setError(null); // Clear previous errors
                setDirectionsResponse(null); // Clear previous map response
                setFirstMileToStation(null); // Clear previous first mile info

                try {
                    const res = await axios.get(`http://localhost:8000/transport/transport-options`, {
                        params: {
                            origin,
                            destination
                        }
                    });

                    const data = res.data?.data;

                    if (data?.summary === "No valid routes found") {
                        toast.error("No valid routes found for the given destination.");
                        setError("No valid routes found for the given destination.");
                        setSummary("No valid routes found");
                        setDuration("N/A");
                        setDistance("N/A");
                        setSteps([]);
                        return;
                    }

                    // Set general route summary
                    setSummary(data.summary);
                    setDuration(data.duration);
                    setDistance(data.distance);
                    setSteps(data.steps || []);


                    // Set the full Google Directions API response for map rendering
                    if (data?.fullDirectionsResponse) {
                        setDirectionsResponse(data.fullDirectionsResponse);
                    }

                    // --- Identify the "first mile" to public transport station ---
                    let firstTransitStep = null;
                    if (data.steps && data.steps.length > 0) {
                        for (let i = 0; i < data.steps.length; i++) {
                            const step = data.steps[i];
                            if (step.travel_mode === 'TRANSIT' && step.transit_details) {
                                firstTransitStep = step;
                                // Collect all previous steps as the "first mile" if they are walking
                                const precedingSteps = data.steps.slice(0, i).filter(s => s.travel_mode === 'WALKING');
                                let firstMileDuration = 0;
                                let firstMileDistance = 0;
                                let firstMileInstructions = [];

                                for (const ps of precedingSteps) {
                                    // Parse duration and distance from text if needed, or get values from backend
                                    // For simplicity, let's just append instructions
                                    firstMileInstructions.push(ps.instruction);
                                    // If you need numeric duration/distance, your backend should provide numeric values
                                }

                                setFirstMileToStation({
                                    departureStop: firstTransitStep.transit_details.departure_stop,
                                    lineName: firstTransitStep.transit_details.line_name || firstTransitStep.transit_details.line_short_name,
                                    vehicleType: firstTransitStep.transit_details.vehicle_type,
                                    departureTime: firstTransitStep.transit_details.departure_time,
                                    precedingWalkingInstructions: firstMileInstructions.length > 0 ? firstMileInstructions.join('<br/>') : 'Directly at station or very short walk.',
                                    // You could calculate combined duration/distance of preceding walking steps here
                                });
                                break; // Found the first transit step, stop
                            }
                        }
                    }

                } catch (err) {
                    console.error("Error fetching transport options:", err);
                    // toast.error("Failed to fetch transport options. Please try again later.");
                    setError("Failed to fetch transport options");
                    setSummary("");
                    setDuration("");
                    setDistance("");
                    setSteps([]);
                    setDirectionsResponse(null);
                    setFirstMileToStation(null);
                }
            };

            fetchTransport();
        }
    }, [originCoords, destination]);


    if (loadError) return <p className="text-red-500">Error loading maps</p>;
    if (!isLoaded) return <p>Loading Maps...</p>;

    return (
        <div className="bg-white p-6 rounded-xl max-w-5xl mx-auto my-8 w-full">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Nearby Transport Options</h2>

            {error && <p className="text-red-500 text-center text-lg mt-4">{error}</p>}

            {!error && originCoords && destination && (
                <>
                    {/* Google Map */}
                    <div className="mb-6 rounded-lg overflow-hidden shadow-md">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={originCoords}
                            zoom={10}
                            onLoad={onMapLoad}
                        >
                            {directionsResponse && (
                                <DirectionsRenderer
                                    options={{
                                        directions: directionsResponse
                                    }}
                                />
                            )}
                        </GoogleMap>
                    </div>

                    <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Summary:</span> {summary || "Not available"}</p>
                    <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Total Duration:</span> {duration}</p>
                    <p className="text-gray-700 text-lg mb-4"><span className="font-semibold">Total Distance:</span> {distance}</p>

                    {firstMileToStation && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 mb-6 rounded-md shadow-sm">
                            <h3 className="text-xl font-bold mb-2">First Leg to Public Transport:</h3>
                            <p className="mb-1">
                                Get to <span className="font-semibold">{firstMileToStation.departureStop}</span> by walking:
                            </p>
                            <div className="ml-4 text-gray-700" dangerouslySetInnerHTML={{ __html: firstMileToStation.precedingWalkingInstructions }} />
                            <p className="mt-2">
                                Then take <span className="font-semibold">{firstMileToStation.lineName}</span> ({firstMileToStation.vehicleType})
                                departing at <span className="font-semibold">{firstMileToStation.departureTime || 'N/A'}</span>.
                            </p>
                            {/* In a real app, you'd fetch real-time data for this line/station here */}
                        </div>
                    )}


                    <button
                        onClick={() => setShowInstructions((prev) => !prev)}
                        className="flex items-center gap-1 text-blue-600"
                    >
                        <span>{showInstructions ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />
                        }</span>
                        <span>Instructions</span>
                    </button>
                    {showInstructions && (
                        <>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Detailed Route Instructions:</h3>
                            <div className="space-y-4">
                                {steps.length > 0 ? (
                                    steps.map((step, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 p-4 rounded-md bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out"
                                        >
                                            <p className="font-semibold text-indigo-600 mb-1">
                                                Travel Mode: {step.travel_mode.replace('_', ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                                            </p>
                                            <div
                                                className="text-gray-800 text-base"
                                                dangerouslySetInnerHTML={{ __html: step.instruction }}
                                            />
                                            <p className="text-sm text-gray-500 mt-2">
                                                Duration: {step.duration} | Distance: {step.distance}
                                            </p>
                                            {step.transit_details && (
                                                <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded">
                                                    <p><span className="font-medium">From:</span> {step.transit_details.departure_stop} (Dep. {step.transit_details.departure_time})</p>
                                                    <p><span className="font-medium">To:</span> {step.transit_details.arrival_stop} (Arr. {step.transit_details.arrival_time})</p>
                                                    <p><span className="font-medium">Line:</span> {step.transit_details.line_short_name || step.transit_details.line_name} ({step.transit_details.vehicle_type})</p>
                                                    <p><span className="font-medium">Stops:</span> {step.transit_details.num_stops}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No detailed steps available.</p>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default NearByTransportOption;
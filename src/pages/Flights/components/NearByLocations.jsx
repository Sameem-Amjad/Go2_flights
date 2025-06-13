import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";
import { SearchIcon } from "lucide-react";
import toast from "react-hot-toast";

const containerStyle = {
    width: "0px",
    height: "0px", // Hide the map itself (only use Autocomplete)
};

const NearbyLocations = () => {
    const [radius, setRadius] = useState("");
    const [location, setLocation] = useState(""); // readable name
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("airport");
    const [error, setError] = useState("");

    const autoCompleteRef = useRef(null);

    const fetchNearbyLocations = async (lat, lng, radiusKm) => {
        setError("");
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}location/nearby-locations`, {
                params: {
                    latitude: lat,
                    longitude: lng,
                    type: type,
                    radius: radiusKm * 1000,
                },
            });

            setResults(res.data.data.places || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch nearby locations.");
            setError("Failed to fetch nearby locations.");
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceChanged = () => {
        const place = autoCompleteRef.current.getPlace();
        if (place && place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setCoordinates({ lat, lng });
            setLocation(place.formatted_address || place.name);
            fetchNearbyLocations(lat, lng, radius || 10); // Default 10km if radius not set
        }
    };

    // Fetch user location on mount
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setCoordinates({ lat, lng });

                // Reverse geocode
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
                const geoRes = await axios.get(geocodeUrl);
                console.log("Geocode response:", geoRes);
                const placeName = geoRes.data.results[0]?.formatted_address || `${lat},${lng}`;
                setLocation(placeName);

                fetchNearbyLocations(lat, lng, 10); // Initial default radius
            },
            () => {
                // Fallback location
                const lat = 28.6139;
                const lng = 77.2090;
                setCoordinates({ lat, lng });
                setLocation("New Delhi");
                fetchNearbyLocations(lat, lng, 10);
            }
        );
    }, []);

    const handleManualSearch = () => {
        const km = parseInt(radius);
        if (isNaN(km) || km < 1 || km > 100) {
            toast.error("Please enter a valid radius between 1 and 100 km.");
            setError("Please enter a valid radius between 1 and 100 km.");
            return;
        }

        if (coordinates.lat && coordinates.lng) {
            fetchNearbyLocations(coordinates.lat, coordinates.lng, km);
        }
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY} libraries={["places"]}>
            <div className="">
                <h2 className="text-2xl text-center font-semibold mb-4">Find Nearby Airports</h2>

                <div className="flex flex-col w-full gap-4 mb-6">
                    <div className="flex flex-row gap-2">
                        <Autocomplete className="w-[75%]" onLoad={(autoC) => (autoCompleteRef.current = autoC)} onPlaceChanged={handlePlaceChanged}>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Search a location"
                                className="p-2 border rounded w-full   focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </Autocomplete>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="p-2 border rounded w-[25%]"
                        >
                            <option value="airport">Airport</option>
                            <option value="train_station">Train Station</option>
                            <option value="bus_station">Bus Station</option>
                            <option value="hotels">Hotels</option>
                            <option value="taxi_stand">Taxi Stand</option>
                            <option value="restaurants">Restaurants</option>
                            <option value="tourist_attraction">Tourist Attraction</option>
                        </select>
                    </div>

                    <div className="flex flex-row gap-2">
                        <input
                            type="number"
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                            placeholder="Radius (1–100 km)"
                            className="p-2 w-[90%] border rounded "
                        />
                        <button
                            onClick={handleManualSearch}
                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SearchIcon className="inline" />
                        </button>
                    </div>
                </div>

                {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
                {loading && <p>Loading...</p>}

                <div className="grid md:grid-cols-2 gap-6">
                    {results.map((place, index) => (
                        <div key={index} className="rounded-lg p-4 hover:scale-105 hover:shadow-md transition">
                            <div className="flex items-center gap-4 mb-2">
                                <img src={place.icon} alt="icon" className="w-8 h-8" />
                                <h3 className="text-lg font-bold">{place.name}</h3>
                            </div>
                            <p className="text-gray-600">{place.address}</p>
                            {/* <p className="text-sm text-gray-500 mt-1">
                                Lat: {place.location.lat.toFixed(4)}, Lng: {place.location.lng.toFixed(4)}
                            </p> */}
                            <p className="text-sm text-gray-500 mt-1">
                                {place.vicinity || place.formatted_address || place.name}
                            </p>

                        </div>
                    ))}
                </div>

                {/* Hidden map only used for autocomplete */}
                <GoogleMap mapContainerStyle={containerStyle} center={coordinates} zoom={10} />
            </div>
        </LoadScript>
    );
};

export default NearbyLocations;

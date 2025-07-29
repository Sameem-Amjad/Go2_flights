import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { GoogleMap, Autocomplete, Marker, Polyline } from "@react-google-maps/api"; // Added Marker, Polyline
import { SearchIcon, XCircle } from "lucide-react"; // Added XCircle for close button
import toast from "react-hot-toast";

const containerStyle = {
    width: "0px",
    height: "0px", // Hidden map for Autocomplete, as before
};

// Styles for the map shown in the modal
const modalMapContainerStyle = {
    width: "100%",
    height: "80%",
    borderRadius: "8px",
};


const NearbyLocations = () => {
    const [radius, setRadius] = useState("");
    const [location, setLocation] = useState("");
    const [currentCoordinates, setCurrentCoordinates] = useState({ lat: 28.6139, lng: 77.2090 });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("airport");
    const [error, setError] = useState("");
    const [nextPageToken, setNextPageToke] = useState("");
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [mapDirections, setMapDirections] = useState(null);

    const autoCompleteRef = useRef(null);
    const mapRef = useRef(null);

    const onLoadMap = useCallback(function callback(map) {
        mapRef.current = map;
        if (selectedPlace && currentCoordinates) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(currentCoordinates);
            bounds.extend(selectedPlace.location);
            map.fitBounds(bounds);
        }
    }, [selectedPlace, currentCoordinates]);

    const onUnmountMap = useCallback(function callback() {
        mapRef.current = null;
    }, []);

    const fetchNearbyLocations = async (lat, lng, radiusKm) => {
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            toast.error("Please select a valid location.");
            setError("Please select a valid location.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}location/nearby-locations`, {
                params: {
                    latitude: lat,
                    longitude: lng,
                    type: type,
                    radius: radiusKm * 1000,
                    pagetoken: nextPageToken || "", // Use nextPageToken if available
                },
            });
            console.log("Nearby locations response:", res.data.data.places);
            setResults(res.data.data.places || []);
            setNextPageToke(res.data.data.next_page_token || "");
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch nearby locations.");
            setError("Failed to fetch nearby locations.");
        } finally {
            setLoading(false);
            console.log("Loading state set to false");
        }
    };

    const handlePlaceChanged = () => {
        const place = autoCompleteRef.current.getPlace();
        if (place && place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setCurrentCoordinates({ lat, lng });
            setLocation(place.formatted_address || place.name);
            fetchNearbyLocations(lat, lng, radius || 10);
        }
    };
    const fetchNextPage = async () => {
        if (!nextPageToken) return;

        setLoading(true);
        setError("");

        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}location/nearby-locations`, {
                params: {
                    latitude: currentCoordinates.lat,
                    longitude: currentCoordinates.lng,
                    type: type,
                    radius: (radius || 10) * 1000,
                    pagetoken: nextPageToken,
                },
            });
            console.log("Next page response:", res.data.data.places);

            setResults(prev => [...prev, ...(res.data.data.places || [])]);
            setNextPageToke(res.data.data.next_page_token || "");
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch next page of locations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setCurrentCoordinates({ lat, lng });
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
                try {
                    const geoRes = await axios.get(geocodeUrl);
                    console.log("Geocode response:", geoRes);
                    const placeName = geoRes.data.results[0]?.formatted_address || `${lat},${lng}`;
                    setLocation(placeName);
                } catch (geoError) {
                    console.error("Reverse geocoding failed:", geoError);
                    toast.error("Could not determine current location name.");
                    setLocation(`${lat}, ${lng}`);
                }
                fetchNearbyLocations(lat, lng, 10);
            },
            () => {
                const lat = 25.276987;
                const lng = 55.296249;
                setCurrentCoordinates({ lat, lng });
                setLocation("Dubai");
                fetchNearbyLocations(lat, lng, 10);

                toast.custom((t) => (
                    <div
                        className={`${t.visible ? 'animate-enter' : 'animate-leave'
                            } bg-green-100 text-green-800 px-4 py-2 rounded shadow-md`}
                    >
                        Please allow location access.
                    </div>
                ));

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

        if (currentCoordinates.lat && currentCoordinates.lng) {
            fetchNearbyLocations(currentCoordinates.lat, currentCoordinates.lng, km);
        }
    };

    const showPlaceOnMap = (place) => {
        setSelectedPlace(place);
        setMapDirections(null);

        if (!window.google || !window.google.maps.DirectionsService) {
            toast.error("Google Maps Directions service not loaded yet. Please try again.");
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: currentCoordinates,
                destination: place.location,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setMapDirections(result);
                    setShowMapModal(true);
                } else {
                    console.error(`Directions request failed due to ${status}`);
                    toast.error("Could not find directions to this place.");
                    setShowMapModal(true);
                }
            }
        );
    };

    const polylineOptions = {
        strokeColor: "#0000ff",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        icons: [
            {
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 3,
                    strokeColor: "#1100ff",
                },
                offset: "100%",
                repeat: "20px",
            },
        ],
    };

    return (
        <div className="p-4  text-white ">
            <h2 className="text-2xl text-center font-semibold mb-4">Find Nearby Places</h2>

            <div className="flex flex-col w-full gap-4 mb-6">
                <div className="flex flex-row gap-2">
                    <Autocomplete
                        className="w-[75%]"
                        onLoad={(autoC) => (autoCompleteRef.current = autoC)}
                        onPlaceChanged={handlePlaceChanged}
                    >
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Search a location"
                            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black"
                        />
                    </Autocomplete>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="p-2 border rounded w-[25%] text-black"
                    >
                        <option value="airport">Airport</option>
                        <option value="train_station">Train Station</option>
                        <option value="bus_station">Bus Station</option>
                        {/* <option value="hotels">Hotels</option> */}
                        <option value="taxi_stand">Taxi Stand</option>
                        <option value="restaurant">Restaurants</option>
                        <option value="tourist_attraction">Tourist Attraction</option>
                    </select>
                </div>

                <div className="flex flex-row gap-2">
                    <input
                        type="number"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                        placeholder="Radius (1–100 km)"
                        className="p-2 w-[90%] border rounded text-black"
                    />
                    <button
                        onClick={handleManualSearch}
                        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <SearchIcon className="inline" />
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <p className="text-center text-gray-800">Loading nearby locations...</p>
            ) : (
                <>
                    {results.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {results.map((place, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg p-4 bg-white hover:scale-105 hover:shadow-lg transition cursor-pointer overflow-auto h-40 hide-scrollbar"
                                    onClick={() => showPlaceOnMap(place)}
                                >
                                    <div className="flex items-center gap-4 mb-2">
                                        <img src={place.icon} alt="icon" className="w-8 h-8" />
                                        <h3 className="text-lg text-gray-800 font-bold">{place.name}</h3>
                                    </div>
                                    <p className="text-gray-800">{place.address}</p>
                                    <p className="text-sm text-gray-800 mt-1">
                                        {place.vicinity || place.formatted_address || place.name}
                                    </p>
                                </div>
                            ))}
                            {nextPageToken && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={fetchNextPage}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}

                        </div>
                    ) : (
                        !error && <p className="text-center text-gray-400">No nearby locations found for the selected criteria.</p>
                    )}
                </>
            )}

            {Number.isFinite(currentCoordinates.lat) && Number.isFinite(currentCoordinates.lng) && (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={currentCoordinates}
                    zoom={10}
                />
            )}


            {showMapModal && selectedPlace && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 h-[98%] p-6 rounded-lg shadow-xl max-w-4xl w-full relative">
                        <button
                            onClick={() => setShowMapModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
                        >
                            <XCircle size={24} />
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-white">
                            Route to {selectedPlace.name}
                        </h3>

                        <div className="mb-4 text-gray-300">
                            {mapDirections ? (
                                <>
                                    <p>Distance: {mapDirections.routes[0].legs[0].distance.text}</p>
                                    <p>Duration: {mapDirections.routes[0].legs[0].duration.text}</p>
                                </>
                            ) : (
                                <p>Calculating route...</p>
                            )}
                        </div>

                        <GoogleMap
                            mapContainerStyle={modalMapContainerStyle}
                            onLoad={onLoadMap}
                            onUnmount={onUnmountMap}
                            center={currentCoordinates}
                            zoom={10}
                        >
                            <Marker
                                position={currentCoordinates}
                                label={{
                                    text: "You",
                                    className: "map-label-blue",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                    scaledSize: new window.google.maps.Size(40, 40),
                                }}
                            />

                            <Marker
                                position={selectedPlace.location}
                                label={{
                                    text: selectedPlace.name,
                                    className: "map-label-red",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                    scaledSize: new window.google.maps.Size(40, 40),
                                }}
                            />

                            {mapDirections && mapDirections.routes[0] && (
                                <Polyline
                                    path={mapDirections.routes[0].overview_path}
                                    options={polylineOptions}
                                />
                            )}
                        </GoogleMap>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NearbyLocations;
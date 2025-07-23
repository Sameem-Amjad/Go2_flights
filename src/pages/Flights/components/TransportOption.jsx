import React, { useEffect, useRef, useState } from "react";
import { FaCar } from "react-icons/fa";
import { IoMdTrain } from "react-icons/io";
import { FaPersonWalking } from "react-icons/fa6";
import { IoMdBicycle } from "react-icons/io";
import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderCircleIcon } from "lucide-react";
import TransitCard from "../../../Cards/TransitCard";
import DrivingCard from "../../../Cards/DrivingCard";
import WalkingCard from "../../../Cards/WalkingCard";
import BiCycleCard from "../../../Cards/BicycleCard";

// Reverse geocoding utility
const reverseGeocode = async (coords, apiKey) => {
    const [lat, lng] = coords.split(",").map((v) => v.trim());
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "OK") {
            return data.results[0]?.formatted_address || coords;
        } else {
            console.error("Geocoding error:", data.status);
            return coords;
        }
    } catch (err) {
        console.error("Fetch error:", err);
        return coords;
    }
};

const options = [
    { label: "Transit", mode: "transit", icon: <IoMdTrain className="text-red-500 w-6 h-6" /> },
    { label: "Driving", mode: "driving", icon: <FaCar className="text-blue-500 w-6 h-6" /> },
    { label: "Walking", mode: "walking", icon: <FaPersonWalking className="text-green-500 w-6 h-6" /> },
    { label: "Bicycle", mode: "bicycling", icon: <IoMdBicycle className="text-yellow-500 w-6 h-6" /> },
];

const TransportOption = ({ destination: initialDestination = "", origin: initialOrigin = "" }) => {
    const originRef = useRef(null);
    const destinationRef = useRef(null);
    const [activeMode, setActiveMode] = useState("transit");
    const [origin, setOrigin] = useState(initialOrigin);
    const [destination, setDestination] = useState(initialDestination);
    const [locationNames, setLocationNames] = useState({ originName: "", destinationName: "" });
    const [transitData, setTransitData] = useState(null);
    const [drivingData, setDrivingData] = useState(null);
    const [walkingData, setWalkingData] = useState(null);
    const [bicyclingData, setBicyclingData] = useState(null);
    const [loading, setLoading] = useState(false);

    const GEOCODE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

    useEffect(() => {
        const resolveNames = async () => {
            if (initialOrigin && initialOrigin.includes(",")) {
                const name = await reverseGeocode(initialOrigin, GEOCODE_API_KEY);
                setLocationNames((prev) => ({ ...prev, originName: name }));
            }
            if (initialDestination && initialDestination.includes(",")) {
                const name = await reverseGeocode(initialDestination, GEOCODE_API_KEY);
                setLocationNames((prev) => ({ ...prev, destinationName: name }));
            }
        };

        resolveNames();

        if (!initialOrigin && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
                    setOrigin(coords);
                    // setOrigin("52.52000659999999,13.404954"); // Example coordinates for Berlin
                    const name = await reverseGeocode(coords, GEOCODE_API_KEY);
                    // const name = await reverseGeocode("52.52000659999999,13.404954", GEOCODE_API_KEY);
                    setLocationNames((prev) => ({ ...prev, originName: name }));
                },
                () => console.error("Unable to access your location.")
            );
        }
    }, [initialOrigin, initialDestination, GEOCODE_API_KEY]);

    const handleOriginPlaceChanged = () => {
        const place = originRef.current.getPlace();
        if (place && place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || place.name;
            setOrigin(`${lat},${lng}`);
            setLocationNames((prev) => ({ ...prev, originName: address }));
        }
    };

    const handleDestinationPlaceChanged = () => {
        const place = destinationRef.current.getPlace();
        if (place && place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || place.name;
            setDestination(`${lat},${lng}`);
            setLocationNames((prev) => ({ ...prev, destinationName: address }));
        }
    };

    const handleSearch = () => {
        setLoading(true);
        console.log("Searching route:");
        console.log("Origin:", origin);
        console.log("Destination:", destination);
        console.log("Mode:", activeMode);
        const response = axios.get(`${import.meta.env.VITE_BASE_URL}transport/transport-options?origin=${origin}&destination=${destination}`);
        response.then((res) => {
            const data = res.data.data;

            if (data && data.length > 0) {
                console.log("Transport options:", data);
                data.forEach(element => {
                    if (element.mode == 'transit') {
                        setTransitData(element);
                    }
                    if (element.mode == 'driving') {
                        setDrivingData(element);
                    }
                    if (element.mode == 'walking') {
                        setWalkingData(element);
                    }
                    if (element.mode == 'bicycling') {
                        setBicyclingData(element);
                    }
                });
                setLoading(false);
            }
        }).catch((error) => {
            toast.error("Error fetching transport options. Please try again.");
            console.error("Error fetching transport options:", error);
            setLoading(false);
        });
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 bg-white">
            <div className="flex flex-col w-full gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">From</label>
                        <Autocomplete
                            onLoad={(ref) => (originRef.current = ref)} onPlaceChanged={handleOriginPlaceChanged}>

                            <input
                                type="text"
                                value={locationNames.originName}
                                onChange={(e) => setLocationNames((prev) => ({ ...prev, originName: e.target.value }))}
                                placeholder="Enter origin"
                                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black"
                            />
                        </Autocomplete>
                    </div>
                    <div>
                        <label className="text-gray-700 font-medium">To</label>
                        <Autocomplete onLoad={(ref) => (destinationRef.current = ref)} onPlaceChanged={handleDestinationPlaceChanged}>

                            <input
                                type="text"
                                value={locationNames.destinationName}
                                onChange={(e) => setLocationNames((prev) => ({ ...prev, destinationName: e.target.value }))}
                                placeholder="Enter destination"
                                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black"
                            />
                        </Autocomplete>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {options.map((option) => {
                    const isActive = activeMode === option.mode;
                    return (
                        <button
                            key={option.mode}
                            onClick={() => setActiveMode(option.mode)}
                            className={`flex flex-col items-center justify-center gap-1 transition-all border-b-2
                ${isActive
                                    ? " text-white border-blue-600"
                                    : " text-gray-700 hover:border-blue-100 border-transparent hover:transition-all hover:duration-200 hover:ease-in-out"
                                }`}
                        >
                            {option.icon}
                            <span className="text-sm font-medium">{option.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="">
                {activeMode === "transit" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <IoMdTrain className="text-red-500 w-5 h-5" />
                            Transit Directions
                        </h2>
                        {loading ? (
                            <LoaderCircleIcon className="animate-spin" />
                        ) : transitData ? (
                            <TransitCard transitData={transitData} />
                        ) : (
                            <p className="text-red-500">No transit directions available.</p>
                        )}
                    </div>
                )}
                {activeMode === "driving" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <FaCar className="text-blue-500 w-5 h-5" />
                            Driving Directions
                        </h2>
                        {loading ? (
                            <LoaderCircleIcon className="animate-spin" />
                        ) : drivingData ? (
                            <DrivingCard drivingData={drivingData} />
                            // <p className="text-gray-500">Driving directions coming soon.</p>
                        ) : (
                            <p className="text-red-500">No driving directions available.</p>
                        )}
                    </div>
                )}
                {activeMode === "walking" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <FaPersonWalking className="text-green-500 w-5 h-5" />
                            Walking Directions
                        </h2>
                        {loading ? (
                            <LoaderCircleIcon className="animate-spin" />
                        ) : walkingData ? (
                            // <WalkingCard walkingData={walkingData} />
                            <p className="text-gray-500">Walking directions coming soon.</p>
                        ) : (
                            <p className="text-red-500">No walking directions available.</p>
                        )}
                    </div>
                )}

                {activeMode === "bicycling" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <IoMdBicycle className="text-yellow-500 w-5 h-5" />
                            Bicycling Directions
                        </h2>
                        {loading ? (
                            <LoaderCircleIcon className="animate-spin" />
                        ) : bicyclingData ? (
                            // <BiCycleCard bicyclingData={bicyclingData} />
                            <p className="text-gray-500">Bicycling directions coming soon.</p>
                        ) : (
                            <p className="text-red-500">No bicycling directions available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransportOption;

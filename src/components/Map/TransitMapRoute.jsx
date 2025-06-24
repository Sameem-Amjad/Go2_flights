import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import { DeleteIcon, DoorClosedIcon } from "lucide-react";
import { IoCloseCircleOutline } from "react-icons/io5";

const containerStyle = {
    width: "100%",
    height: "550px",
};

const TransitRouteMapModal = ({ route, onClose }) => {
    const [path, setPath] = useState([]);
    const [center, setCenter] = useState(null);

    useEffect(() => {
        const decodedPath = [];

        route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
                if (step.polyline?.points) {
                    const points = window.google.maps.geometry.encoding.decodePath(
                        step.polyline.points
                    );
                    decodedPath.push(...points);
                }
            });
        });

        setPath(decodedPath);

        if (decodedPath.length > 0) {
            const midpoint = decodedPath[Math.floor(decodedPath.length / 500)];
            setCenter({ lat: midpoint.lat(), lng: midpoint.lng() });
        }
    }, [route]);

    if (!center) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl overflow-hidden p-2">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                    <h2 className="text-lg font-semibold text-white">Route Map</h2>
                    <button onClick={onClose} className="text-white font-semibold text-sm hover:underline">
                        <IoCloseCircleOutline className="w-5 h-5" />
                    </button>
                </div>

                <div className="w-full h-[550px]">
                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                        <Polyline
                            path={path}
                            options={{
                                strokeColor: "#007bff",
                                strokeOpacity: 0.9,
                                strokeWeight: 5,
                            }}
                        />
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
};

export default TransitRouteMapModal;

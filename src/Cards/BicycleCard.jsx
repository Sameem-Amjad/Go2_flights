import React, { useState } from "react";
import {
    FaBus,
    FaWalking,
    FaTrain,
    FaChevronDown,
    FaChevronUp,
    FaMapMarkedAlt,
} from "react-icons/fa";
import { IoCarSharp } from "react-icons/io5";
import TransitRouteMapModal from "../components/Map/TransitMapRoute";
import { IoMdBicycle } from "react-icons/io";

const modeIcons = {
    TRANSIT: <FaBus className="text-blue-600" />,
    WALKING: <FaWalking className="text-green-600" />,
    BICYCLE: <IoMdBicycle className="text-orange-600" />,
    DRIVING: <IoCarSharp className="text-yellow-600" />,
    TRAIN: <FaTrain className="text-purple-600" />,
};

const BiCycleCard = ({ bicyclingData }) => {
    const [openRoutes, setOpenRoutes] = useState([]);
    const [mapRouteIndex, setMapRouteIndex] = useState(null);

    const toggleRoute = (index) => {
        setOpenRoutes((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    return (
        <div className="p-4 space-y-4 max-w-3xl mx-auto border rounded-xl bg-gray-20">
            {bicyclingData.routes.map((route, routeIndex) => (
                <div key={routeIndex}>
                    <div className="flex flex-row gap-4">
                        <div className="border rounded-lg border-gray-200 overflow-hidden">
                            <button
                                onClick={() => toggleRoute(routeIndex)}
                                className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-left"
                            >
                                <span className="font-medium text-gray-700">
                                    Route {routeIndex + 1}
                                </span>
                                {openRoutes.includes(routeIndex) ? <FaChevronUp /> : <FaChevronDown />}
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out ${openRoutes.includes(routeIndex) ? "max-h-[1000px]" : "max-h-0"
                                    } overflow-hidden`}
                            >
                                <div className="bg-white px-4 py-2 space-y-3">
                                    {route.legs.map((leg, legIndex) => (
                                        <div key={legIndex} className="space-y-2 border-b pb-3">
                                            <div className="text-gray-600">
                                                <div className="text-sm font-medium">
                                                    {leg.start_address} → {leg.end_address}
                                                </div>
                                                <div className="text-xs">
                                                    Duration: {leg.duration?.text} | Distance:{" "}
                                                    {leg.distance?.text}
                                                </div>
                                                <div className="text-xs">
                                                    Departure: {leg.departure_time?.text} | Arrival:{" "}
                                                    {leg.arrival_time?.text}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {leg.steps.map((step, stepIndex) => (
                                                    <div
                                                        key={stepIndex}
                                                        className="flex gap-3 items-start bg-gray-50 p-2 rounded-md"
                                                    >
                                                        <div className="mt-1 text-xl">
                                                            {modeIcons[step.travel_mode] || <IoMdBicycle className="text-orange-600" />}
                                                        </div>
                                                        <div className="text-sm text-gray-700">
                                                            <p className="font-medium">
                                                                {step.html_instructions?.replace(/<[^>]+>/g, "")}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Duration: {step.duration?.text} | Distance:{" "}
                                                                {step.distance?.text}
                                                            </p>
                                                            {step?.transit_details && (
                                                                <p className="text-xs text-blue-600 font-semibold mt-1">
                                                                    {step.transit_details?.line?.vehicle?.name}{" "}
                                                                    {step.transit_details?.line?.short_name} →{" "}
                                                                    {step.transit_details?.headsign}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {route?.warnings?.[0] && (
                                        <p className="text-sm text-red-500">
                                            ⚠️ {route.warnings[0]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end ">
                            <button
                                onClick={() => setMapRouteIndex(routeIndex)}
                                className="flex items-center gap-2 text-sm  rounded-md  text-white transition"
                            >
                                <FaMapMarkedAlt className="text-blue-400 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-2 h-8 w-8" />
                            </button>
                        </div>
                    </div>

                    {mapRouteIndex === routeIndex && (
                        <TransitRouteMapModal
                            route={route}
                            onClose={() => setMapRouteIndex(null)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default BiCycleCard;

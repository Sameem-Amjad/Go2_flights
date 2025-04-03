import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { CiSquareInfo } from "react-icons/ci";
import { TbListDetails } from "react-icons/tb";
import { CiCircleInfo } from "react-icons/ci";
import axios from "axios";
import SemiCircleChart from "../charts/semiCircleCharts";

const FlightOfferCard = ({ offer, data }) => {
  const [showModal, setShowModal] = useState(false);
  const {
    total_amount,
    total_currency,
    base_amount,
    tax_amount,
    total_emissions_kg,
    slices,
    payment_requirements,
  } = offer;

  const firstSlice = slices[0];
  const segment = firstSlice.segments[0];
  const { origin, destination, departing_at, operating_carrier, passengers } =
    segment;
  const finalSegment = firstSlice.segments[firstSlice.segments.length - 1];
  const { arriving_at } = finalSegment;
  const [showDeals, setShowDeals] = useState(false);
  const [riskDetails, setRiskDetails] = useState(false);
  const [filter, setFilter] = useState(data);
  const [riskData, setRiskData] = useState([]);
  const [termininalDetails, setTerminalDetails] = useState(false);
  const [riskValueDetails, setRiskValueDetails] = useState({});
  const [additionalDetails, setAdditionalDetails] = useState(false)
  const [selectedRoutine, setSelectedRoutine] = useState("normal");

  useEffect(() => {
    setFilter(data);
  }, [offer]);

  const handleToggleDeals = () => {
    setShowDeals((prev) => !prev);
  };


  const formatDuration = (isoDuration) => {
    const match = isoDuration.match(/P(\d+D)?T?(\d+H)?(\d+M)?/);
    if (!match) return "Invalid duration";

    const days = match[1] ? match[1].toLowerCase() : null;
    const hours = match[2] ? match[2].toLowerCase() : "0h";
    const minutes = match[3] ? match[3].toLowerCase() : "0m";

    return `${days ? days : ""} ${hours} ${minutes}`.trim();
  };

  const formatCustomDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options).replace(",", "");
  };

  const totalStops = slices.reduce(
    (sum, slice) => sum + slice.segments.length - 1,
    0
  );

  const finalDestination =
    totalStops > 0
      ? slices[slices.length - 1].segments[
        slices[slices.length - 1].segments.length - 1
      ].destination.iata_code
      : destination.iata_code;

  const calculateLayoverTime = (segment1, segment2) => {
    const arrival = DateTime.fromISO(segment1.arriving_at);
    const departure = DateTime.fromISO(segment2.departing_at);
    return departure.diff(arrival, ["hours", "minutes"]).toObject();
  };

  const calculateRisk = async (slice) => {
    const { segments } = slice;
    const riskPromises = segments.map((segment, index) => {
      if (index < segments.length - 1) {
        const type = segment.isGCC
          ? segment.codeShare
            ? "gcc-codeshare"
            : "gcc"
          : segment.codeShare
            ? "codeshare"
            : "non-codeshare";
        // console.log("Data", {
        //   type: type,
        //   arrivalTime: segment.arriving_at,
        //   departureTime: segments[index + 1].departing_at
        // })
        return axios.post(
          `${import.meta.env.VITE_BASE_URL}transferRisk/calculate-risk`,
          {
            type: type,
            arrivalTime: segment.arriving_at,
            departureTime: segments[index + 1].departing_at
          }
        ).then(response => ({
          index,
          data: response.data,

        })).catch(error => ({
          index,
          error: error.message
        }));

      }
      return null;
    }).filter(Boolean);
    const riskResults = await Promise.all(riskPromises);
    if (riskResults.error) {
      setRiskDetails(false)
      setTerminalDetails(false)
      setAdditionalDetails(false)
    }
    else {
      setRiskDetails(true);
      setRiskData(riskResults)
      setTerminalDetails(false)
      setAdditionalDetails(false)
    }
    console.log("Risk Results:", riskResults);

  };

  const toggleRiskValueDetails = (index) => {
    setRiskValueDetails((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the specific index
    }));
  };

  return (
    <div className="mb-4 shadow-md">
      <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row relative">
        <div className="flex-shrink-0 flex justify-center items-center mb-4 md:mb-0 md:mr-4">
          <div className="flex-shrink-0 flex justify-center items-center mb-4 md:mb-0 md:mr-4">
            {(() => {
              const airlineNames = firstSlice.segments.map(
                (segment) => segment.operating_carrier.name
              );
              const uniqueAirlines = [...new Set(airlineNames)];

              return uniqueAirlines.length === 1 ? (
                <img
                  src={firstSlice.segments[0].operating_carrier.logo_symbol_url}
                  alt={`${uniqueAirlines[0]} logo`}
                  className="w-24 h-24 rounded"
                />
              ) : (
                <div className="text-center">
                  {uniqueAirlines.map((name, index) => (
                    <p
                      key={index}
                      className="text-xs font-semibold text-custom-green"
                    >
                      {name}
                      {index < uniqueAirlines.length - 1 && (
                        <>
                          <br />+<br />
                        </>
                      )}
                    </p>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="flex-grow relative">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-bold text-custom-green">
                {operating_carrier.name}
              </h2>
              <p className="text-custom-green">
                {segment.marketing_carrier_flight_number}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-gray-600 shadow-lg  rounded-lg px-2 mt-2">
            <div className="text-center">
              <p className="text-sm font-semibold">
                {formatCustomDate(departing_at)}
              </p>
              <p className="text-sm font-medium">{origin.iata_code}</p>
              <p className="text-sm">
                Terminal{" "}
                {segment.origin_terminal ? segment.origin_terminal : "N/A"}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm">
                {formatDuration(slices[0].duration)}
              </span>
              <span className="text-sm font-semibold text-gray-600">
                {firstSlice?.segments
                  .find((segment) =>
                    filter?.cabin_class.includes(
                      segment?.passengers?.[0]?.cabin_class
                    )
                  )
                  ?.passengers?.[0]?.cabin_class?.charAt(0)
                  .toUpperCase() +
                  firstSlice?.segments
                    .find((segment) =>
                      filter?.cabin_class.includes(
                        segment?.passengers?.[0]?.cabin_class
                      )
                    )
                    ?.passengers?.[0]?.cabin_class?.slice(1)
                    .toLowerCase()}
              </span>

              {totalStops > 0 && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-blue-500 text-xs hover:underline"
                  >
                    {totalStops} stop{totalStops > 1 ? "s" : ""} (
                    {slices[0].segments[1].origin.iata_code})
                  </button>
                  {slices[0].segments.map((segment, index) => {
                    if (index < slices[0].segments.length - 1) {
                      const layover = calculateLayoverTime(
                        segment,
                        slices[0].segments[index + 1]
                      );
                      return (
                        <div
                          key={index}
                          className="text-[10px] text-gray-400 text-center"
                        >
                          {segment.destination.iata_code}{" "}
                          {Math.floor(layover.hours)}h{" "}
                          {Math.round(layover.minutes)}m
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold">
                {formatCustomDate(arriving_at)}
              </p>
              <p className="text-sm font-medium">{finalDestination}</p>
              <p className="text-sm">
                Terminal{" "}
                {segment.destination_terminal
                  ? segment.destination_terminal
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-gray-600 space-y-2 sm:space-y-0">
            <div>
              <p>Emissions: {total_emissions_kg} kg</p>
              <p>
                Refundable:{" "}
                {payment_requirements.requires_instant_payment ? "Yes" : "No"}
              </p>
              <button
                className={` py-2 rounded ${offer.moreClasses && offer.moreClasses.length > 0
                  ? "text-blue-500 underline"
                  : "text-gray-600 cursor-not-allowed"
                  }`}
                onClick={
                  offer.moreClasses && offer.moreClasses.length > 0
                    ? handleToggleDeals
                    : undefined
                }
              >
                {offer.moreClasses && offer.moreClasses.length > 0
                  ? "View All Deals >"
                  : "No Other Deals"}
              </button>
            </div>
            <div>
              <p
                className={`text-sm ${payment_requirements.requires_instant_payment
                  ? "text-red-600"
                  : "text-green-600"
                  }`}
              >
                {payment_requirements.requires_instant_payment
                  ? "Requires Instant Payment"
                  : "Payment not required immediately"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end sm:mt-0 mt-3 text-right sm:text-left">
            <p className="text-xl font-semibold">
              {total_amount} {total_currency}
            </p>
            <p className="text-gray-500 text-sm">
              {base_amount} {total_currency} (Tax: {tax_amount} {total_currency}
              )
            </p>
            <div className="flex items-end gap-1 ">
              <button className="mt-2 bg-yellow-500 text-white text-xs px-3 py-1 rounded hover:bg-yellow-600">
                Book Now
              </button>
              {
                slices.map((slice, sliceIndex) => (
                  <><div key={sliceIndex} className="mt-6 ">
                    {
                      slice?.segments?.length > 1 && <button onClick={() => calculateRisk(slice)} className="mt-2 bg-red-400 text-white text-xs px-1 py-1  rounded hover:bg-red-600 flex items-center justify-center gap-1">
                        <CiSquareInfo size={15} />
                        <span className="text-[8px] text-gray-100 lg:block md:block sm:block hidden">Check Risk Integator</span>
                      </button>
                    }
                  </div>
                    <div key={sliceIndex} className="mt-6">

                      <button onClick={() => { setAdditionalDetails(false); setRiskDetails(false); setTerminalDetails(!termininalDetails) }} className="mt-2 bg-green-400 text-white text-xs px-1 py-1  rounded hover:bg-green-600 flex items-center justify-center gap-1">
                        <TbListDetails size={15} />
                        <span className="text-[8px] text-white lg:block md:block sm:block hidden">Terminals Distance</span>
                      </button>

                    </div>


                    <button key={sliceIndex} onClick={() => { setAdditionalDetails(!additionalDetails); setTerminalDetails(false); setRiskDetails(false) }} className=" bg-blue-400 text-white text-xs px-1 py-1  rounded hover:bg-blue-600 flex items-center justify-center gap-1 mb-1">
                      <CiCircleInfo size={11} />
                    </button>

                  </>

                ))


              }

            </div>
            <div className={` ${riskDetails ? 'flex w-full flex-col gap-5' : 'hidden'}  items-center justify-between text-gray-600 shadow-lg  rounded-lg p-2 mt-4`}>

              {riskData.map((risk, index) => (
                <div key={index} className="w-full text-justify">
                  <p className="text-sm font-semibold">
                    Available Layover Time: {`${Math.floor(risk?.data?.data?.totalAvailableTime / 60)} hr ${risk?.data?.data?.totalAvailableTime % 60} min`}
                  </p>
                  <p className="text-sm font-medium">
                    Transfer Time: {`${Math.floor(risk?.data?.data?.transferTime / 60)} hr ${risk?.data?.data?.transferTime % 60} min`}
                  </p>
                  <p className="text-sm font-semibold">
                    Available Layover Time before Boarding: {`${Math.floor(risk?.data?.data?.availableTime / 60)} hr ${risk?.data?.data?.availableTime % 60} min`}
                  </p>

                  <div className="flex flex-row justify-between w-full gap-6 items-center">
                    <p className="text-sm font-medium">
                      Risk: {risk?.data?.data?.risk}
                    </p>
                    <CiSquareInfo key={index} onClick={() => toggleRiskValueDetails(index)} size={25} className={`${risk?.data?.data?.riskValue == 'Extreme' ? "text-red-700" : risk?.data?.data?.riskValue == "High" ? "text-red-500" : risk?.data?.data?.riskValue == "Medium" ? "text-orange-500" : "text-green-600"} cursor-pointer`} />
                  </div>
                  <div key={index} className={`${riskValueDetails[index] ? "" : "hidden"} py-5 flex items-center justify-center flex-col gap-10`}>
                    <SemiCircleChart value={risk?.data?.data?.riskValue == 'Extreme' ? 87 : risk?.data?.data?.riskValue == "High" ? 63 : risk?.data?.data?.riskValue == "Medium" ? 38 : 13} />
                    <div className="flex lg:gap-3 sm:gap-3 md:gap-3 gap-1 flex-row justify-center items-center ">
                      <div className="w-2 h-2 lg:w-5 lg:h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 flex items-center justify-center text-white font-bold bg-green-600 "></div>
                      <p className="lg:text-xs sm:text-xs md:text-xs text-[8px]">Low</p>
                      <div className="w-2 h-2 lg:w-5 lg:h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 flex items-center justify-center text-white font-bold bg-orange-500   "></div>
                      <p className="lg:text-xs sm:text-xs md:text-xs text-[8px]">Medium</p>
                      <div className="w-2 h-2 lg:w-5 lg:h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 flex items-center justify-center text-white font-bold bg-red-500    "></div>
                      <p className="lg:text-xs sm:text-xs md:text-xs text-[8px]">High</p>
                      <div className="w-2 h-2 lg:w-5 lg:h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 flex items-center justify-center text-white font-bold bg-red-700    "></div>
                      <p className="lg:text-xs sm:text-xs md:text-xs text-[8px]">Extreme</p>
                    </div>
                  </div>
                  <ul key={index} className={`${riskValueDetails[index] ? "" : "hidden"} text-xs font-normal list-disc pl-5  `}>

                    <li>Reason: <span className={`${risk?.data?.data?.riskValue == 'Extreme' ? "text-red-700" : risk?.data?.data?.riskValue == "High" ? "text-red-500" : risk?.data?.data?.riskValue == "Medium" ? "text-orange-500" : "text-green-600"} font-thin text-xs `}> {risk?.data?.data?.riskReason}</span></li>

                    <li>Flight is <span className={`${risk?.data?.data?.riskValue == 'Extreme' ? "text-red-700" : risk?.data?.data?.riskValue == "High" ? "text-red-500" : risk?.data?.data?.riskValue == "Medium" ? "text-orange-500" : "text-green-600"} font-bold`}> {risk?.data?.data?.type}</span></li>

                    <li>Buggage Pickup Time is between <span className={`${risk?.data?.data?.riskValue == 'Extreme' ? "text-red-700" : risk?.data?.data?.riskValue == "High" ? "text-red-500" : risk?.data?.data?.riskValue == "Medium" ? "text-orange-500" : "text-green-600"} font-bold`}> {risk?.data?.data?.estimate?.baggagePickup?.min + ' - ' + risk?.data?.data?.estimate?.baggagePickup?.max} minutes</span></li>

                    <li>Customs Clearance Time is between <span className={`${risk?.data?.data?.riskValue == 'Extreme' ? "text-red-700" : risk?.data?.data?.riskValue == "High" ? "text-red-500" : risk?.data?.data?.riskValue == "Medium" ? "text-orange-500" : "text-green-600"} font-bold`}> {risk?.data?.data?.estimate?.customsClearance?.min + ' - ' + risk?.data?.data?.estimate?.customsClearance?.max} minutes</span></li>

                    <li>Aircraft Exit Time is between <span className={`${risk?.data?.data?.riskValue == 'Extreme' ? "text-red-700" : risk?.data?.data?.riskValue == "High" ? "text-red-500" : risk?.data?.data?.riskValue == "Medium" ? "text-orange-500" : "text-green-600"} font-bold`}> {risk?.data?.data?.estimate?.exitAircraft?.min + ' - ' + risk?.data?.data?.estimate?.exitAircraft?.max} minutes</span></li>

                    <li>Final Boarding Time is between <span className={`${risk?.data?.data?.riskValue == 'Extreme' ? "text-red-700" : risk?.data?.data?.riskValue == "High" ? "text-red-500" : risk?.data?.data?.riskValue == "Medium" ? "text-orange-500" : "text-green-600"} font-bold`}> {risk?.data?.data?.estimate?.finalBoardingTime?.min + ' - ' + risk?.data?.data?.estimate?.finalBoardingTime?.max} minutes</span></li>

                    <li>Security Checking Time is between <span className={`${risk?.data?.data?.riskValue == 'Extreme' ? "text-red-700" : risk?.data?.data?.riskValue == "High" ? "text-red-500" : risk?.data?.data?.riskValue == "Medium" ? "text-orange-500" : "text-green-600"} font-bold`}> {risk?.data?.data?.estimate?.securityCheck?.min + ' - ' + risk?.data?.data?.estimate?.securityCheck?.max} minutes</span></li>

                    <li>Terminal Transfer Time is between <span className={`${risk?.data?.data?.riskValue == 'Extreme' ? "text-red-700" : risk?.data?.data?.riskValue == "High" ? "text-red-500" : risk?.data?.data?.riskValue == "Medium" ? "text-orange-500" : "text-green-600"} font-bold`}> {risk?.data?.data?.estimate?.terminalTransfer?.min + ' - ' + risk?.data?.data?.estimate?.terminalTransfer?.max} minutes</span></li>
                  </ul>
                </div>
              ))}


            </div>
            {
              slices.map((slice, sliceIndex) => (
                termininalDetails ? <div
                  key={`terminal-${sliceIndex}`}
                  className={`${termininalDetails ? 'flex w-full flex-col gap-3 p-3' : 'hidden'
                    } text-gray-700 shadow-md rounded-lg mt-2`}
                >
                  {slice.segments.map((segment, index) => {
                    const travel = segment?.inter_segment_terminal_travel;
                    if (!travel) return null;

                    return (
                      <div key={index} className="w-full p-2 border-b last:border-none">
                        {travel.airportName && (
                          <p className="text-sm font-bold">Airport: <span className="font-normal">{travel.airportName}</span></p>
                        )}
                        {travel.from_terminal && travel.to_terminal && (
                          <p className="text-sm font-bold">Terminal Transfer:</p>
                        )}
                        {travel.from_terminal && (
                          <p className="text-sm">From: <span className="font-semibold">{travel.from_terminal}</span></p>
                        )}
                        {travel.to_terminal && (
                          <p className="text-sm">To: <span className="font-semibold">{travel.to_terminal}</span></p>
                        )}
                        {travel.distance_meters && (
                          <p className="text-sm">Distance: <span className="font-semibold">{travel.distance_meters} meters</span></p>
                        )}

                        {travel.travel_modes?.length > 0 && (
                          <p className="text-sm font-bold">Travel Modes:</p>
                        )}
                        {travel.travel_modes?.map((mode, index) => (
                          <p key={index} className="ml-4 text-sm">- {mode}</p>
                        ))}

                        {travel.travel_time_minutes && (
                          <p className="text-sm font-bold">Estimated Travel Time:</p>
                        )}
                        {Object.entries(travel.travel_time_minutes)
                          .filter(([_, time]) => time)
                          .map(([mode, time], index) => (
                            <p key={index} className="text-sm ml-4">
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}: <span className="font-semibold">{time} min</span>
                            </p>
                          ))}
                      </div>
                    );
                  })}
                </div> :
                  additionalDetails ? <div
                    key={`additional-${sliceIndex}`}
                    className={`${additionalDetails ? 'flex w-full flex-col gap-3 p-3' : 'hidden'
                      } text-gray-700 shadow-md rounded-lg mt-2 `}
                  >
                    {slice.segments.map((segment, index) => {
                      const routine = selectedRoutine === "normal" ? segment?.additional_Inforamtion?.normal_routine : segment?.additional_Inforamtion?.busy_routine;
                      if (!routine) return null;
                      return (
                        <div key={index + selectedRoutine} className="w-full p-2 border-b last:border-none">
                          <div className="rounded-md p-3 bg-white text-gray-800 border">
                            <div className="flex gap-2">
                              {
                                segment?.additional_Inforamtion?.normal_routine &&
                                <button
                                  onClick={() => setSelectedRoutine("normal")}
                                  className={`px-3 py-1 text-xs rounded-md font-medium border ${selectedRoutine === "normal" ? "bg-gray-300" : "bg-gray-100"}`}
                                >
                                  Normal
                                </button>
                              }
                              {
                                segment?.additional_Inforamtion?.busy_routine &&
                                <button
                                  onClick={() => setSelectedRoutine("busy")}
                                  className={`px-3 py-1 text-xs rounded-md font-medium border ${selectedRoutine === "busy" ? "bg-gray-300" : "bg-gray-100"}`}
                                >
                                  Busy
                                </button>
                              }
                            </div>

                            <div className="mt-2 text-xs text-gray-700">
                              {routine?.bus_cost_range_usd && (
                                <p>🚌 <span className="font-semibold">Bus Cost:</span> {routine.bus_cost_range_usd}</p>
                              )}
                              {routine?.bus_waiting_time_minutes && (
                                <p>⏳ <span className="font-semibold">Waiting Time:</span> {routine.bus_waiting_time_minutes} mins</p>
                              )}
                              {routine?.train_cost_range_usd && (
                                <p>🚆 <span className="font-semibold">Train Cost:</span> {routine.train_cost_range_usd}</p>
                              )}
                              {routine?.walking_conditions && (
                                <p>🚶 <span className="font-semibold">Walking:</span> {routine.walking_conditions}</p>
                              )}
                              {routine?.car_accessibility && (
                                <p>🚗 <span className="font-semibold">Car Access:</span> {routine.car_accessibility}</p>
                              )}
                            </div>
                          </div>
                        </div>

                      );
                    })}
                  </div> : null
              ))
            }
          </div>

        </div>



        {/* Stops Popup */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 max-h-[95vh] overflow-auto no-scrollbar">
              <div className="w-full flex justify-between items-center border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-custom-green">
                  Flight Details
                </h2>
                <button
                  className="text-xl font-semibold text-custom-green hover:text-custom-gold transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              {slices.map((slice, sliceIndex) => (
                <div key={sliceIndex} className="mt-6">
                  <h3 className="text-xl font-bold text-custom-gold mb-4">
                    {sliceIndex === 0 ? "Outbound Flight" : "Return Flight"}
                  </h3>
                  {slice.segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex} className="mb-6">
                      <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <img
                                src={segment.operating_carrier.logo_symbol_url}
                                className="w-7 h-7"
                                alt=""
                              />
                              <h2 className="text-lg font-bold text-custom-green">
                                {segment.operating_carrier?.name}
                              </h2>
                            </div>
                            <p className="text-custom-gold">
                              Flight {segment.marketing_carrier_flight_number}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-gray-600">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-custom-green">
                              {formatCustomDate(segment.departing_at)}
                            </p>
                            <p className="text-lg font-medium text-custom-gold">
                              {segment.origin?.iata_code}
                            </p>
                            <p className="text-sm text-gray-500">
                              Terminal {segment.origin_terminal || "N/A"}
                            </p>
                          </div>

                          <div className="flex flex-col items-center px-4">
                            <span className="text-custom-gold text-sm">
                              {formatDuration(segment.duration)}
                            </span>
                            <div className="w-32 h-[1px] bg-custom-gold my-2"></div>
                            <span className="text-sm font-medium text-custom-green">
                              {segment.passengers[0].cabin_class_marketing_name}
                            </span>
                          </div>

                          <div className="text-center">
                            <p className="text-sm font-semibold text-custom-green">
                              {formatCustomDate(segment.arriving_at)}
                            </p>
                            <p className="text-lg font-medium text-custom-gold">
                              {segment.destination?.iata_code}
                            </p>
                            <p className="text-sm text-gray-500">
                              Terminal {segment.destination_terminal || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {segmentIndex < slice.segments.length - 1 && (
                        <div className="my-4 bg-custom-green bg-opacity-10 p-4 rounded-lg border border-custom-green border-opacity-20">
                          <div className="flex items-center mb-2">
                            <svg
                              className="w-5 h-5 text-custom-gold mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-custom-green">
                              Layover at {segment.destination.iata_code}
                            </p>
                          </div>
                          {(() => {
                            const layover = calculateLayoverTime(
                              segment,
                              slice.segments[segmentIndex + 1]
                            );
                            return (
                              <div className="ml-7">
                                <p className="text-sm text-custom-gold font-medium">
                                  Duration: {Math.floor(layover.hours)}h{" "}
                                  {Math.round(layover.minutes)}m
                                </p>
                                <div className="text-xs text-gray-600 mt-1">
                                  <p>
                                    Arrival:{" "}
                                    {formatCustomDate(segment.arriving_at)}
                                  </p>
                                  <p>
                                    Departure:{" "}
                                    {formatCustomDate(
                                      slice.segments[segmentIndex + 1]
                                        .departing_at
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-custom-gold text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {
        showDeals && offer.moreClasses && offer.moreClasses.length > 0 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-2xl border p-6 max-w-lg w-full">
              <div className="w-full flex justify-between">
                <h4 className="text-lg text-custom-green font-semibold">
                  Available Deals:
                </h4>
                <div
                  className="rounded-full text-custom-green font-semibold text-lg cursor-pointer"
                  onClick={handleToggleDeals}
                >
                  x
                </div>
              </div>
              <ul className="space-y-2 max-h-96 mt-4 overflow-auto">
                {offer.moreClasses.map((deal, index) => (
                  <>
                    {data.cabin_class.includes(deal.cabin_class) ? (
                      <>
                        <li
                          key={index}
                          className="bg-gray-100 p-2 rounded shadow border"
                        >
                          <p className="text-custom-gold">
                            <strong className="text-custom-green">
                              Cabin Class:
                            </strong>{" "}
                            {deal.cabin_class === "premium_economy"
                              ? "Premium Economy"
                              : deal.cabin_class[0].toUpperCase() +
                              deal.cabin_class.slice(1).toLowerCase()}
                          </p>
                          <p className="text-custom-gold">
                            <strong className="text-custom-green">
                              Fare Brand:
                            </strong>{" "}
                            {deal.fare_brand_name}
                          </p>
                          <p className="text-custom-gold">
                            <strong className="text-custom-green">Price:</strong>{" "}
                            {deal.total_amount} {offer.currency}
                          </p>
                          <a
                            href={`booking-link/${deal.booking_link}`}
                            className="mt-2 bg-yellow-500 text-white text-xs px-3 py-1 rounded hover:bg-yellow-600"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Book Now
                          </a>
                        </li>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </ul>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default FlightOfferCard;

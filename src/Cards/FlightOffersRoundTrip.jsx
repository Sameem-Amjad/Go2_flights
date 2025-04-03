import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

const calculateLayoverTime = (segment1, segment2) => {
  const arrival = DateTime.fromISO(segment1.arriving_at);
  const departure = DateTime.fromISO(segment2.departing_at);
  return departure.diff(arrival, ["hours", "minutes"]).toObject();
};

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

  const [filter, setFilter] = useState(data);

  useEffect(() => {
    setFilter(data);
  }, [offer]);

  const firstSlice = slices[0];
  const secondSlice = slices[1];

  // Calculate stops for outbound and return flights separately
  const outboundStops = firstSlice ? firstSlice?.segments.length - 1 : 0;
  const returnStops = secondSlice ? secondSlice?.segments.length - 1 : 0;

  const [showDeals, setShowDeals] = useState(false);

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

  const convertTimeBetweenTimezones = (date) => {
    return DateTime.fromISO(date).toFormat("EEE, dd MMM HH:mm");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col md:flex-row relative">
      {/* Carrier Image */}
      <div className="flex-shrink-0 flex justify-center items-center mb-4 md:mb-0 md:mr-4">
        {(() => {
          const airlineNames = firstSlice.segments.map(
            (segment) => segment.operating_carrier.name
          );

          // Get unique airline names
          const uniqueAirlines = [...new Set(airlineNames)];

          return uniqueAirlines.length === 1 ? (
            // If all airline names are the same, show the logo
            <img
              src={firstSlice.segments[0]?.operating_carrier?.logo_symbol_url}
              alt={`${uniqueAirlines[0]} logo`}
              className="w-24 h-24 rounded"
            />
          ) : (
            // If there are multiple airlines, display their names
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

      {/* Flight Information */}
      <div className="flex-grow relative">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-lg font-bold text-custom-green">
              {firstSlice?.segments[0]?.operating_carrier?.name}
            </h2>
            <p className="text-custom-green">
              {firstSlice?.segments[0]?.marketing_carrier_flight_number}
            </p>
          </div>
        </div>

        {/* Outbound Flight */}
        <div className="flex items-center justify-between text-gray-600 shadow-lg h-28 rounded-lg px-2 mt-2">
          <div className="text-center">
            <p className="text-sm font-semibold">
              {formatCustomDate(firstSlice?.segments[0]?.departing_at)}
            </p>
            <p className="text-sm font-medium">
              {firstSlice?.segments[0]?.origin?.iata_code}
            </p>
            <p className="text-sm">
              Terminal{" "}
              {firstSlice?.segments[0]?.origin_terminal
                ? firstSlice?.segments[0]?.origin_terminal
                : "N/A"}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm">
              {formatDuration(firstSlice.duration)}
            </span>
            <span className="text-sm font-semibold text-gray-600">
              {
                firstSlice?.segments.find((segment) =>
                  filter?.cabin_class.includes(
                    segment?.passengers?.[0]?.cabin_class
                  )
                )?.passengers?.[0]?.cabin_class
              }
            </span>
            {outboundStops > 0 && (
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setShowModal(true)}
                  className="text-blue-500 text-xs hover:underline"
                >
                  {outboundStops} stop{outboundStops > 1 ? "s" : ""} (
                  {firstSlice.segments[1].origin.iata_code})
                </button>
                {firstSlice.segments.map((segment, segmentIndex) => {
                  if (segmentIndex < firstSlice.segments.length - 1) {
                    const layover = calculateLayoverTime(
                      segment,
                      firstSlice.segments[segmentIndex + 1]
                    );
                    return (
                      <div
                        key={segmentIndex}
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
              {formatCustomDate(
                firstSlice.segments[firstSlice.segments.length - 1]?.arriving_at
              )}
            </p>
            <p className="text-sm font-medium">
              {
                firstSlice.segments[firstSlice.segments.length - 1]?.destination
                  ?.iata_code
              }
            </p>
            <p className="text-sm">
              Terminal{" "}
              {firstSlice.segments[firstSlice.segments.length - 1]
                ?.destination_terminal
                ? firstSlice.segments[firstSlice.segments.length - 1]
                  .destination_terminal
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Return Flight */}
        <div className="flex items-center justify-between text-gray-600 shadow-lg h-28 rounded-lg px-2 mt-2">
          <div className="text-center">
            <p className="text-sm font-semibold">
              {formatCustomDate(secondSlice?.segments[0]?.departing_at)}
            </p>
            <p className="text-sm font-medium">
              {secondSlice?.segments[0]?.origin?.iata_code}
            </p>
            <p className="text-sm">
              Terminal{" "}
              {secondSlice.segments[0].origin_terminal
                ? secondSlice.segments[0].origin_terminal
                : "N/A"}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm">
              {formatDuration(secondSlice.duration)}
            </span>
            <span className="text-sm font-semibold text-gray-600">
              {
                secondSlice?.segments.find((segment) =>
                  filter?.cabin_class.includes(
                    segment?.passengers?.[0]?.cabin_class
                  )
                )?.passengers?.[0]?.cabin_class
              }
            </span>
            {returnStops > 0 && (
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setShowModal(true)}
                  className="text-blue-500 text-xs hover:underline"
                >
                  {returnStops} stop{returnStops > 1 ? "s" : ""} (
                  {secondSlice.segments[1].origin.iata_code})
                </button>
                {secondSlice.segments.map((segment, segmentIndex) => {
                  if (segmentIndex < secondSlice.segments.length - 1) {
                    const layover = calculateLayoverTime(
                      segment,
                      secondSlice.segments[segmentIndex + 1]
                    );
                    return (
                      <div
                        key={segmentIndex}
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
              {formatCustomDate(
                secondSlice.segments[secondSlice.segments.length - 1]
                  ?.departing_at
              )}
            </p>
            <p className="text-sm font-medium">
              {
                secondSlice.segments[secondSlice.segments.length - 1]
                  ?.destination?.iata_code
              }
            </p>
            <p className="text-sm">
              Terminal{" "}
              {secondSlice.segments[secondSlice.segments.length - 1]
                ?.destination_terminal
                ? secondSlice.segments[secondSlice.segments.length - 1]
                  .destination_terminal
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Additional Info - Emissions and Refundability */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-gray-600 space-y-2 sm:space-y-0">
          <div>
            <p>Emissions: {total_emissions_kg} kg</p>
            <p>
              Refundable:{" "}
              {payment_requirements.requires_instant_payment ? "Yes" : "No"}
            </p>
            <p
              onClick={handleToggleDeals}
              className={`${offer.moreClasses.length > 0
                ? "text-blue-500 underline cursor-pointer"
                : "text-gray-400"
                }`}
            >
              {offer.moreClasses.length > 0 ? "View All Deals" : "No Deals"}
            </p>
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

        {/* Price and Book Now Button */}
        <div className="flex flex-col items-start sm:items-end sm:mt-0 mt-3 text-right sm:text-left">
          <p className="text-xl font-semibold">
            {total_amount} {total_currency}
          </p>
          <p className="text-gray-500 text-sm">
            {base_amount} {total_currency} (Tax: {tax_amount} {total_currency})
          </p>
          <button className="mt-2 bg-yellow-500 text-white text-xs px-3 py-1 rounded hover:bg-yellow-600">
            Book Now
          </button>
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

            {/* Outbound Flight */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-custom-gold mb-4">
                Outbound Flight
              </h3>
              {firstSlice?.segments.map((segment, segmentIndex) => (
                <div key={segmentIndex} className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <img
                            src={segment?.operating_carrier?.logo_symbol_url}
                            alt=""
                            className="w-7 h-7"
                          />
                          <h2 className="text-lg font-bold text-custom-green">
                            {segment?.operating_carrier?.name}
                          </h2>
                        </div>
                        <p className="text-custom-gold">
                          Flight {segment?.marketing_carrier_flight_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-custom-green">
                          {formatCustomDate(segment?.departing_at)}
                        </p>
                        <p className="text-lg font-medium text-custom-gold">
                          {segment?.origin?.iata_code}
                        </p>
                        <p className="text-sm text-gray-500">
                          Terminal {segment?.origin_terminal || "N/A"}
                        </p>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <span className="text-custom-gold text-sm">
                          {formatDuration(segment?.duration)}
                        </span>
                        <div className="w-32 h-[1px] bg-custom-gold my-2"></div>
                        <span className="text-sm font-medium text-custom-green">
                          {segment?.passengers[0]?.cabin_class}
                        </span>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-semibold text-custom-green">
                          {formatCustomDate(segment?.arriving_at)}
                        </p>
                        <p className="text-lg font-medium text-custom-gold">
                          {segment?.destination.iata_code}
                        </p>
                        <p className="text-sm text-gray-500">
                          Terminal {segment?.destination_terminal || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {segmentIndex < firstSlice.segments.length - 1 && (
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
                          firstSlice.segments[segmentIndex + 1]
                        );
                        return (
                          <div className="ml-7">
                            <p className="text-sm text-custom-gold font-medium">
                              Duration: {Math.floor(layover.hours)}h{" "}
                              {Math.round(layover.minutes)}m
                            </p>
                            <div className="text-xs text-gray-600 mt-1">
                              <p>
                                Arrival: {formatCustomDate(segment.arriving_at)}
                              </p>
                              <p>
                                Departure:{" "}
                                {formatCustomDate(
                                  firstSlice.segments[segmentIndex + 1]
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

            {/* Return Flight */}
            {secondSlice && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-custom-gold mb-4">
                  Return Flight
                </h3>
                {secondSlice.segments.map((segment, segmentIndex) => (
                  <div key={segmentIndex} className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <img
                              src={segment?.operating_carrier?.logo_symbol_url}
                              alt=""
                              className="w-7 h-7"
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
                            {segment.passengers[0]?.cabin_class}
                          </span>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-semibold text-custom-green">
                            {formatCustomDate(segment.arriving_at)}
                          </p>
                          <p className="text-lg font-medium text-custom-gold">
                            {segment.destination.iata_code}
                          </p>
                          <p className="text-sm text-gray-500">
                            Terminal {segment?.destination_terminal || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {segmentIndex < secondSlice.segments.length - 1 && (
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
                            secondSlice.segments[segmentIndex + 1]
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
                                    secondSlice.segments[segmentIndex + 1]
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
            )}

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
      {showDeals && offer.moreClasses && offer.moreClasses.length > 0 && (
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
                  {data.cabin_class.includes(deal?.cabin_class) ? (
                    <>
                      <li
                        key={index}
                        className="bg-gray-100 p-2 rounded shadow border"
                      >
                        <p className="text-custom-gold">
                          <strong className="text-custom-green">
                            Cabin Class:
                          </strong>{" "}
                          {deal?.cabin_class === "premium_economy"
                            ? "Premium Economy"
                            : deal?.cabin_class[0].toUpperCase() +
                            deal?.cabin_class.slice(1).toLowerCase()}
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
      )}
    </div>
  );
};

export default FlightOfferCard;

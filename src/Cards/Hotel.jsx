import React, { useState, useEffect, useContext } from "react";
import star from "../assets/svg/star.svg";
import leafFilled from "../assets/svg/leafFilled.svg";
import leaf from "../assets/svg/leaf.svg";
import info from "../assets/svg/info.svg";
import check from "../assets/svg/Done.svg";
import { useNavigate } from "react-router-dom";
import { FlightsContext } from "../Context/FlightsContext";

const Hotel = ({ hotelData }) => {
  const navigate = useNavigate();
  const { guest } = useContext(FlightsContext);
  const { selectedDates } = useContext(FlightsContext);
  const { setSelectedHotel } = useContext(FlightsContext);

  const [searchFilter, setSearchFilter] = useState({
    adults: guest ? guest.adults : 1,
    children: guest ? guest.children : 0,
    rooms: guest ? guest.rooms : 1,
  });

  const [nights, setNights] = useState(0);

  useEffect(() => {
    if (
      selectedDates &&
      Array.isArray(selectedDates) &&
      selectedDates.length === 2
    ) {
      const checkInDate = selectedDates[0];
      const checkOutDate = selectedDates[1];
      const nightCount = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );
      setNights(nightCount);
    }
  }, [selectedDates]);

  const handleNavigation = (hotel) => {
    setSelectedHotel(hotel);
    navigate("/hotel-info");
  };

  return (
    <>
      {hotelData.length === 0 ? (
        <>No Hotels Found</>
      ) : (
        <>
          {hotelData.map((hotel, index) => (
            <div
              className="w-full md:w-[633px] h-60 rounded-md shadow-result flex flex-row mb-6"
              key={index}
            >
              <img src={hotel.image} className="py-2 pl-2" />
              <div className="w-full h-full flex flex-row">
                <div className="w-72 h-full py-4 pl-4 flex flex-col">
                  <div className="flex flex-row w-full items-center">
                    <p className="font-extrabold text-custom-green mr-2.5 text-base">
                      {hotel.name}
                    </p>
                    {Array(hotel.rating)
                      .fill(0)
                      .map((_, index) => (
                        <img src={star} alt="rating" className="w-2.5 h-2.5" />
                      ))}
                  </div>
                  <div className="flex flex-row relative items-center">
                    <a
                      className="relative text-[10px] text-custom-green font-medium"
                      href={hotel.mapsLink}
                      target="_blank"
                    >
                      {hotel.location}
                      <span className="absolute left-0 bottom-0 w-full h-[0.5px] bg-custom-green"></span>
                    </a>
                    <a
                      className="relative text-[10px] text-custom-green font-medium ml-2"
                      href={hotel.mapsLink}
                      target="_blank"
                    >
                      Show on map
                      <span className="absolute left-0 bottom-0 w-full h-[0.5px] bg-custom-green"></span>
                    </a>
                    <p className="text-[8px] text-custom-green mt-0.5 ml-1">
                      Subway access
                    </p>
                  </div>
                  <div className="flex flex-row mt-3 items-center">
                    {Array(hotel.level)
                      .fill(0)
                      .map((_, index) => (
                        <img
                          src={leafFilled}
                          alt="sustainability level"
                          className="w-4 h-4"
                        />
                      ))}
                    {Array(3 - hotel.level)
                      .fill(0)
                      .map((_, index) => (
                        <img
                          src={leaf}
                          alt="sustainability level"
                          className="w-4 h-4"
                        />
                      ))}
                    <p className="text-custom-gold text-[10px] ml-2.5">
                      Travel sustainable level {hotel.level}
                    </p>
                  </div>
                  <button className="w-20 h-4 bg-custom-gold text-white text-[9px] rounded-sm mt-2">
                    Limited-time deal
                  </button>
                  <div className="w-full border-l-[1px] border-custom-gold text-custom-green mt-3 pl-2.5 text-[10px]">
                    <p className="text-xs">{hotel.type}</p>
                    <p>
                      Entire apartment | 3 bedrooms | 1 living room | 2
                      bathrooms <br />1 Kitchen
                    </p>
                    <p>4 beds (2 twins, 2 kings)</p>
                    {hotel.cancelation && (
                      <div className="flex flex-row">
                        <img src={check} className="mr-1" />
                        <p>Cancel at any time</p>
                      </div>
                    )}
                  </div>
                  <p className="text-red-600 text-[10px] mt-auto">
                    Only 4 left at this price on our site
                  </p>
                </div>
                <div className="w-28 h-full flex flex-col justify-between">
                  <div className="flex flex-row justify-end text-[7px] text-custom-green font-semibold py-4 pr-5">
                    <div>
                      {hotel.reviews > 9 ? (
                        <p>Wonderful</p>
                      ) : hotel.reviews > 8 ? (
                        <p>Excellent</p>
                      ) : (
                        <p>Good</p>
                      )}
                      <p className="text-[7px] text-custom-green font-medium mr-1">
                        1432 reviews
                      </p>
                    </div>
                    <div className="flex justify-center items-center w-7 h-6 text-white rounded-sm bg-custom-gold font-bold text-base">
                      <p>{hotel.reviews}</p>
                    </div>
                  </div>
                  <div className="w-full h-24 justify-end text-[10px] text-custom-green pr-5">
                    <div className="w-full flex flex-row justify-end h-7">
                      <p>
                        {nights} Nights,{" "}
                        {searchFilter.children === 0 ? (
                          <>{searchFilter.adults} Adult</>
                        ) : (
                          <>
                            {searchFilter.adults} Adult, {searchFilter.children}{" "}
                            Children
                          </>
                        )}
                      </p>
                    </div>
                    <div className="w-full flex flex-row justify-end">
                      <p className="font-bold mr-1">
                        Rs {hotel.costPerNight * nights}
                      </p>
                      <img src={info} alt="info" />
                    </div>
                    <div className="w-full flex flex-row justify-end">
                      <p className="text-custom-green text-[7px]">
                        +{hotel.tax * nights} taxes & charges
                      </p>
                    </div>
                    <div className="flex flex-row justify-end">
                      <button className="w-[88px] h-5 mt-2 bg-custom-gold rounded-sm flex justify-center items-center" onClick={() => handleNavigation(hotel)}>
                        <p className="text-white text-[8px]">
                          See availability &gt;
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Hotel;

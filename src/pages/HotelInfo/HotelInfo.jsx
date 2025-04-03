import React, { useState, useEffect, useContext } from "react";
import search from "../../assets/svg/lens.svg";
import guests from "../../assets/svg/guest.svg";
import maps from "../../assets/svg/maps.svg";
import star from "../../assets/svg/star.svg";
import leafFilled from "../../assets/svg/leafFilled.svg";
import leaf from "../../assets/svg/leaf.svg";
import heart from "../../assets/svg/heart.svg";
import heartFilled from "../../assets/png/heartFilled.png";
import connect from "../../assets/svg/connect.svg";
import checkbox from "../../assets/svg/checkbox.svg";
import loc from "../../assets/svg/location.svg";
import jood from "../../assets/svg/jood.svg";
import steam from "../../assets/svg/steam.svg";
import swimming from "../../assets/svg/swimming.svg";
import transport from "../../assets/svg/transport.svg";
import smoking from "../../assets/svg/smoking.svg";
import nosmoke from "../../assets/svg/nosmoke.svg";
import hours from "../../assets/svg/hours.svg";
import fitness from "../../assets/svg/fitness.svg";
import pk from "../../assets/png/pk.png";
import bell from "../../assets/svg/bell.svg";
import { useNavigate } from "react-router-dom";
import TopAccomodation from "../../Cards/TopAccomodation";
import { FlightsContext } from "../../Context/FlightsContext";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/prime.css";

const HotelInfo = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("overview");
  const { guest } = useContext(FlightsContext);
  const { selectedDates } = useContext(FlightsContext);
  const { selectedHotel } = useContext(FlightsContext);
  const { searchQuery } = useContext(FlightsContext);
  const { toQuery } = useContext(FlightsContext);
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [checkInDate, setCheckInDate] = useState(
    selectedDates ? selectedDates[0] : null
  );
  const [checkOutDate, setCheckOutDate] = useState(
    selectedDates ? selectedDates[1] : null
  );
  const [nights, setNights] = useState(0);
  const [searchFilter, setSearchFilter] = useState({
    adults: guest ? guest.adults : 1,
    children: guest ? guest.children : 0,
    rooms: guest ? guest.rooms : 1,
  });
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([
    { question: "What is the best time to visit?", answer: "Times Square" },
    { question: "What attractions are a must-see?", answer: "Times Square" },
    { question: "What are the best restaurants?", answer: "Times Square" },
    { question: "How do I get around the city?", answer: "Times Square" },
    { question: "What is the best time to visit?", answer: "Times Square" },
    { question: "What attractions are a must-see?", answer: "Times Square" },
    { question: "What are the best restaurants?", answer: "Times Square" },
    { question: "How do I get around the city?", answer: "Times Square" },
    { question: "How do I get around the city?", answer: "Times Square" },
  ]);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);

  const handleQuestionClick = (index) => {
    setExpandedQuestionIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };
  const nearbyInfo = {
    "What's nearby": [
      { name: "Deira Clock Tower", distance: "600 m" },
      { name: "Union Metro East Exit Park", distance: "850 m" },
      { name: "park deira dubai", distance: "1,000 m" },
      { name: "The Floating Bridge", distance: "1.4 km" },
      { name: "Al Bastakiya", distance: "2.1 km" },
      { name: "Creek Park", distance: "2.2 km" },
      { name: "Dubai Museum", distance: "2.4 km" },
      { name: "Karama Park", distance: "2.4 km" },
      { name: "Heritage Village", distance: "3.2 km" },
      { name: "Saeed Al Maktoum House", distance: "3.2 km" },
    ],
    "Top attractions": [
      { name: "Deira Clock Tower", distance: "600 m" },
      { name: "Union Metro East Exit Park", distance: "850 m" },
      { name: "park deira dubai", distance: "1,000 m" },
      { name: "The Floating Bridge", distance: "1.4 km" },
      { name: "Al Bastakiya", distance: "2.1 km" },
      { name: "Creek Park", distance: "2.2 km" },
      { name: "Dubai Museum", distance: "2.4 km" },
      { name: "Karama Park", distance: "2.4 km" },
      { name: "Heritage Village", distance: "3.2 km" },
      { name: "Saeed Al Maktoum House", distance: "3.2 km" },
    ],
    "Beaches in the nearby": [
      { name: "Deira Clock Tower", distance: "600 m" },
      { name: "Union Metro East Exit Park", distance: "850 m" },
      { name: "park deira dubai", distance: "1,000 m" },
      { name: "The Floating Bridge", distance: "1.4 km" },
      { name: "Al Bastakiya", distance: "2.1 km" },
      { name: "Creek Park", distance: "2.2 km" },
      { name: "Dubai Museum", distance: "2.4 km" },
      { name: "Karama Park", distance: "2.4 km" },
      { name: "Heritage Village", distance: "3.2 km" },
      { name: "Saeed Al Maktoum House", distance: "3.2 km" },
    ],
  };

  console.log(selectedHotel);

  const handleLinkClick = (link, event) => {
    event.preventDefault();
    setActiveLink(link);
    const section = document.getElementById(link);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
    // handle add to favorites
  };

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nightsCount = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );
      setNights(nightsCount);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    if (guest) {
      setSearchFilter({
        adults: guest.adults,
        children: guest.children,
        rooms: guest.rooms,
      });
    }
  }, [guest]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full md:w-[954px]">
        {/* Header */}
        <div className="w-full flex justify-start flex-col md:flex-row my-3">
          <p className="text-custom-gold">
            Home &gt; {toQuery} &gt; search results{" "}
            <span className="text-custom-green">&gt; {selectedHotel.name}</span>
          </p>
        </div>
        {/* Links */}
        <div className="">
          <ul className="flex flex-wrap">
            <li className="group mr-7">
              <a
                href=""
                onClick={(event) => handleLinkClick("overview", event)}
              >
                <p className="font-medium mb-1 text-custom-green">Overview</p>
                <span
                  className={`block h-[2px] bg-[#4F5831] left-0 right-0 transition-all duration-200 w-0 group-hover:w-full ${
                    activeLink === "overview" ? "w-full" : "w-0"
                  }`}
                ></span>
              </a>
            </li>
            <li className="group mr-7">
              <a
                href="#info"
                onClick={(event) => handleLinkClick("info", event)}
              >
                <p className="font-medium mb-1 text-custom-green">
                  Info & Prices
                </p>
                <span
                  className={`block h-[2px] bg-[#4F5831] left-0 right-0 transition-all duration-200 w-0 group-hover:w-full ${
                    activeLink === "info" ? "w-full" : "w-0"
                  }`}
                ></span>
              </a>
            </li>
            <li className="group mr-7">
              <a
                href=""
                onClick={(event) => handleLinkClick("facilities", event)}
              >
                <p className="font-medium mb-1 text-custom-green">Facilities</p>
                <span
                  className={`block h-[2px] bg-[#4F5831] left-0 right-0 transition-all duration-200 w-0 group-hover:w-full ${
                    activeLink === "facilities" ? "w-full" : "w-0"
                  }`}
                ></span>
              </a>
            </li>
            <li className="group mr-7">
              <a href="" onClick={(event) => handleLinkClick("rules", event)}>
                <p className="font-medium mb-1 text-custom-green">
                  House Rules
                </p>
                <span
                  className={`block h-[2px] bg-[#4F5831] left-0 right-0 transition-all duration-200 w-0 group-hover:w-full ${
                    activeLink === "rules" ? "w-full" : "w-0"
                  }`}
                ></span>
              </a>
            </li>
            <li className="group">
              <a
                href="#guestReviews"
                onClick={(event) => handleLinkClick("reviews", event)}
              >
                <p className="font-medium mb-1 text-custom-green">
                  Guest Reviews ({selectedHotel.guestReviews})
                </p>
                <span
                  className={`block h-[2px] bg-[#4F5831] left-0 right-0 transition-all duration-200 w-0 group-hover:w-full ${
                    activeLink === "reviews" ? "w-full" : "w-0"
                  }`}
                ></span>
              </a>
            </li>
          </ul>
        </div>

        <span className="w-full h-0.5 bg-custom-green block mt-3"></span>
        {/* Content */}
        <div className="w-full mt-4 flex flex-col md:flex-row">
          {/* Search Feature */}
          <div className="border rounded border-custom-gold w-full md:w-[30%] p-2 px-4">
            <p className="text-custom-green text-xl font-bold">Search</p>
            <p className="text-[10px] text-custom-green">
              Destination / property name
            </p>
            <div className="flex w-[97%] shadow-search mt-2 py-1 px-2 rounded">
              <img className="w-4 h-4" src={search} alt="Search icon" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchedPlace(e.target.value)}
                className="ml-4 text-[10px] font-medium text-custom-green w-full outline-none"
              />
            </div>

            {/* Date Pickers */}
            <p className="mt-2 text-[10px] text-custom-green">Check-in date</p>
            <div className="flex w-[97%] shadow-search mt-2 rounded justify-center">
              <DatePicker
                selected={checkInDate}
                value={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                minDate={new Date()}
                className="w-[97%] mt-2 p-2 shadow-search rounded"
                placeholderText="Select Check-in Date"
                dateFormat="EEEE, MMMM d, yyyy"
              />
            </div>

            <p className="mt-2 text-[10px] text-custom-green">Check-out date</p>
            <div className="flex w-[97%] shadow-search mt-2 rounded justify-center">
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                value={checkOutDate}
                minDate={checkInDate || new Date()}
                className="shadow-search rounded outline-none"
                placeholderText="Select Check-out Date"
                dateFormat="EEEE, MMMM d, yyyy"
                style={{ outline: "none", boxShadow: "none" }}
              />
            </div>

            <p className="mt-2 text-[10px] text-custom-green">
              {nights} nights stay
            </p>

            {/* Guest and Room Info */}
            <div className="flex w-[97%] shadow-search mt-2 py-1 px-2 rounded">
              <img className="w-4 h-4" src={guests} alt="Guest icon" />
              <input
                type="text"
                value={`${searchFilter.adults} adults | ${searchFilter.children} children | ${searchFilter.rooms} rooms`}
                readOnly
                className="ml-4 text-[10px] font-medium text-custom-green outline-none"
              />
            </div>

            <div className="w-full flex justify-center mt-5">
              <button className="text-white bg-custom-green px-6 py-1 justify-center text-medium text-xl rounded">
                Search
              </button>
            </div>
            <div className="mt-2 flex w-full justify-center">
              <a href={selectedHotel.mapsLink}>
                <img src={maps} alt="Maps link" />
              </a>
            </div>
          </div>

          {/* Images  */}
          <div className="w-full ml-5">
            <div className="flex items-center flex-col md:flex-row">
              <div className="w-20 flex border-r border-r-[#4F5831]">
                {Array(selectedHotel.rating)
                  .fill(0)
                  .map((_, index) => (
                    <img
                      key={index}
                      src={star}
                      alt="rating"
                      className="w-4 h-4"
                    />
                  ))}
              </div>
              <div className="w-full flex md:flex-row flex-col">
                <div className="ml-2 flex items-center">
                  {Array(selectedHotel.level)
                    .fill(0)
                    .map((_, index) => (
                      <img
                        key={index}
                        src={leafFilled}
                        alt="sustainability level"
                        className="w-4 h-4"
                      />
                    ))}
                  {Array(3 - selectedHotel.level)
                    .fill(0)
                    .map((_, index) => (
                      <img
                        key={index}
                        src={leaf}
                        alt="sustainability level"
                        className="w-4 h-4"
                      />
                    ))}
                  <p className="text-custom-gold ml-2">
                    Travel sustainable level {selectedHotel.level}
                  </p>
                </div>
                <div className="flex flex-grow md:justify-end">
                  <img
                    src={isHeartFilled ? heartFilled : heart}
                    alt="Heart"
                    onClick={handleHeartClick}
                    className="cursor-pointer w-8 h-8"
                  />
                  <img src={connect} alt="" className="mx-2" />
                  <button
                    className="font-medium text-white text-xl rounded bg-custom-green px-4 py-1"
                    onClick={() => navigate("/payment")}
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-custom-green font-extrabold text-xl mb-[-10px]">
                {selectedHotel.name}
              </p>
              <a
                href={selectedHotel.mapsLink}
                className="underline text-custom-green text-[10px]"
              >
                {selectedHotel.location}
              </a>
            </div>

            <div className="flex flex-col items-between w-full">
              <div className="flex mb-2">
                {/* Left Column */}
                <div className="flex flex-col mr-2">
                  <div className="w-56 h-[138px] mb-1">
                    <img
                      src={jood}
                      alt="Image 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-56 h-[138px]">
                    <img
                      src={jood}
                      alt="Image 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="w-[480px] h-[280px]">
                  <img
                    src={jood}
                    alt="Image 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex gap-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="w-[140px] h-[80px]">
                    <img
                      src={jood}
                      alt={`Image ${index + 4}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {/* Last image with overlay */}
                <div className="relative w-[120px] h-[80px]">
                  <img
                    src={jood}
                    alt="Image 8"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
                    23+
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col mt-3" id="info">
          <div className="flex md:w-3/4 w-full flex-col pr-2">
            <p className="font-bold text-custom-green mb-4">
              Get the celebrity treatment with world-class service at Jood Hotel
              Apartments
            </p>
            <p>
              Located in Dubai, 3.7 miles from Grand Mosque, Jood Hotel
              Apartments provides accommodations with an outdoor swimming pool,
              free private parking, a fitness center and a terrace. Each room at
              the 5-star hotel has city views, and guests can enjoy access to a
              sauna and a hot tub. The property has a concierge service, a tour
              desk and currency exchange for guests.
            </p>
            <br />
            <p>
              At the hotel all rooms come with air conditioning, a seating area,
              a flat-screen TV with satellite channels, a kitchen, a dining
              area, a safety deposit box and a private bathroom with a bidet,
              free toiletries and a hairdryer. Free WiFi is available to all
              guests, while selected rooms here will provide you with a balcony.
              At Jood Hotel Apartments the rooms include bed linen and towels.
            </p>
          </div>

          <div className="flex md:w-1/4 w-full shadow-result items-center flex-col p-2">
            <p className="text-custom-green font-bold text-center">
              Property Highlights
            </p>
            <div className="w-full">
              <p className="text-custom-green text-[13px] my-3 font-semibold">
                Perfect for {nights} night stay
              </p>
              <div className="flex items-center">
                <img src={loc} />
                <p className="font-medium text-[10px] text-custom-green ml-2">
                  Top Location: Highly rated by recent guests
                </p>
              </div>
              <p className="text-custom-green text-[13px] my-3 font-semibold">
                Rooms with
              </p>
              <div className="flex flex-row w-full items-center">
                <img src={checkbox} />
                <p className="ml-3 text-[10px] text-custom-green">Terrace</p>
              </div>
              <div className="flex flex-row w-full items-center my-3">
                <img src={checkbox} />
                <p className="ml-3 text-[10px] text-custom-green">City View</p>
              </div>
              <div className="flex flex-row w-full items-center">
                <img src={checkbox} />
                <p className="ml-3 text-[10px] text-custom-green">
                  Free private parking available at hotel
                </p>
              </div>
            </div>
            <button
              className="font-medium text-xl text-white bg-custom-green rounded py-1 px-3 mt-7 mb-3"
              onClick={() => navigate("/payment")}
            >
              Reserve
            </button>
          </div>
        </div>
        <div>
          <p className="font-bold text-custom-green">
            {selectedHotel.name} has been welcoming Booking.com guests since May
            27, 2023
          </p>
          <p className="text-custom-green">
            Distance in property description is calculated using © OpenStreetMap
          </p>
        </div>

        <div className="p-4" id="facilities">
          <h3 className="text-custom-green font-semibold text-lg mb-4">
            Most popular facilities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-custom-green">
            <div className="flex items-center space-x-2">
              <img src={steam} alt="Steam Room" className="w-6 h-6" />
              <span>Steam Room</span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={smoking}
                alt="Designated smoking areas"
                className="w-6 h-6"
              />
              <span>Designated smoking areas</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={bell} alt="Concierge" className="w-6 h-6" />
              <span>Concierge</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={nosmoke} alt="Non smoking rooms" className="w-6 h-6" />
              <span>Non smoking rooms</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={transport} alt="Airport shuttle" className="w-6 h-6" />
              <span>Airport shuttle</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={checkbox} alt="24-hour security" className="w-6 h-6" />
              <span>24-hour security</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={hours} alt="24 hour front desk" className="w-6 h-6" />
              <span>24 hour front desk</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={fitness} alt="Fitness center" className="w-6 h-6" />
              <span>Fitness center</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={swimming} alt="Swimming pool" className="w-6 h-6" />
              <span>Swimming pool</span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={checkbox}
                alt="Outdoor play equipment for kids"
                className="w-6 h-6"
              />
              <span>Outdoor play equipment for kids</span>
            </div>
          </div>
        </div>

        <span className="w-full h-0.5 bg-custom-green block mt-3"></span>

        <div className="p-6" id="reviews">
          {/* Guest Review Header */}
          <h3 className="text-custom-green font-semibold text-lg mb-4">
            Guest Review
          </h3>

          {/* Categories Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Individual Category */}
            {[
              { title: "Staff", score: 9.6 },
              { title: "Comfort", score: 9.2 },
              { title: "Free Wifi", score: 9.7 },
              { title: "Facilities", score: 8.2 },
              { title: "Value for money", score: 8.3 },
              { title: "Cleanliness", score: 7.6 },
              { title: "Location", score: 9.5 },
            ].map(({ title, score }) => (
              <div key={title}>
                <div className="flex justify-between mb-1">
                  <span>{title}</span>
                  <span>{score}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-custom-green rounded-full"
                    style={{ width: `${score * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Select Topics Section */}
          <div className="mb-6">
            <h4 className="text-custom-green font-semibold mb-2">
              Select topics to read reviews
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Clean", "Location", "Room", "Pool", "Wifi"].map((topic) => (
                <button
                  key={topic}
                  className="px-3 py-1 border-2 border-custom-green text-custom-green rounded-sm"
                >
                  + {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Guest Reviews Section */}
          <h4 className="text-custom-green font-semibold mb-4">
            See what guests loved the most
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Review Card */}
            {[
              {
                name: "Babar Azam",
                country: "Pakistan",
                review:
                  "“Exceptional specially staff behavior cleaning astonishing”",
                initial: "B",
                flag: pk,
              },
              {
                name: "Muhammad",
                country: "UAE",
                review:
                  "“Cleanliness, location, Staff cooperation - Mr. Abrari & Ms. Nada Excellent people”",
                initial: "M",
                flag: "path-to-flag",
              },
              {
                name: "Zubair",
                country: "Saudi Arabia",
                review:
                  "“Good location, net and very cleaned service, especially receptionist Nada...”",
                initial: "Z",
                flag: "path-to-flag",
              },
            ].map(({ name, country, review, initial, flag }) => (
              <div
                key={name}
                className="border rounded-lg p-4 text-custom-green space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-custom-gold text-white flex items-center justify-center rounded-full font-bold">
                    {initial}
                  </div>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm flex items-center">
                      <img src={flag} alt={country} className="w-4 h-4 mr-1" />{" "}
                      {country}
                    </p>
                  </div>
                </div>
                <p>{review}</p>
                <a
                  href="#"
                  className="text-custom-gold font-semibold underline"
                >
                  Read all
                </a>
              </div>
            ))}
          </div>

          {/* Read All Button */}
          <button className="w-full md:w-auto px-6 py-2 bg-custom-green text-white font-semibold rounded-md">
            Read all
          </button>
        </div>

        <span className="w-full h-0.5 bg-custom-green block mt-3"></span>

        <div
          className="flex flex-col space-y-8 text-custom-green p-4"
          id="rules"
        >
          <div className="flex flex-wrap justify-between">
            {/* Left Column */}
            <div className="flex flex-col space-y-3 p-4 border border-gray-300 rounded-lg w-full md:w-1/3">
              <h2 className="font-semibold">Travelers are asking</h2>
              {questionsAndAnswers.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <div
                    className="flex justify-between cursor-pointer"
                    onClick={() => handleQuestionClick(index)}
                  >
                    <span className="text-black">{item.question}</span>
                    <span>&gt;</span>
                  </div>
                  {expandedQuestionIndex === index && (
                    <div className="mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Middle Column */}
            <div className="flex flex-col space-y-3 p-4 border border-gray-300 rounded-lg w-[32%]">
              <h2 className="font-semibold">Travelers are asking</h2>
              {questionsAndAnswers.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <div
                    className="flex justify-between cursor-pointer"
                    onClick={() => handleQuestionClick(index)}
                  >
                    <span>{item.question}</span>
                    <span>&gt;</span>
                  </div>
                  {expandedQuestionIndex === index && (
                    <div className="mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-lg text-center w-full md:w-1/3">
              <p className="font-semibold">Still looking?</p>
              <button className="mt-2 px-4 py-2 bg-custom-green text-white rounded-lg">
                Ask question
              </button>
              <p className="mt-1">We reply instantly</p>
            </div>
          </div>

          {/* Nearby Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(nearbyInfo).map((sectionTitle, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-3">{sectionTitle}</h3>
                <ul className="space-y-1">
                  {nearbyInfo[sectionTitle].map((location, idx) => (
                    <li key={idx}>
                      {location.name} – {location.distance}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <span className="w-full h-0.5 bg-custom-green block mt-3"></span>

        <section>
          <p className="text-2xl font-extrabold mt-16 mb-4 font-montserrat text-custom-green">
            Inspired By Properties You Looked At
          </p>
          <TopAccomodation />
        </section>
      </div>
    </div>
  );
};

export default HotelInfo;

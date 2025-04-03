import React, { useState, useContext, useEffect } from "react";
import DatePicker from "../DatePicker/DatePicker";
import headerBg from "../../assets/png/headerBg.png";
import logo from "../../assets/png/logo.png";
import currency from "../../assets//svg/currency.svg";
import pakistan from "../../assets/svg/pakistan.svg";
import plane from "../../assets/svg/plane.svg";
import search from "../../assets/svg/search.svg";
import user from "../../assets/svg/user.svg";
import schedule from "../../assets/svg/Schedule.svg";
import { Link, useNavigate } from "react-router-dom";
import { FlightsContext } from "../../Context/FlightsContext";
import { toast, Toaster } from "react-hot-toast";
import airplane from "../../assets/png/takeoff.png";
import landing from "../../assets/png/landing.png";
import flighttype from "../../assets/png/flight.png";
import CitySearch from "../../CitySearch"

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [isDropDownOpenForMobile, setIsDropDownOpenForMobile] = useState(false);
  const [subActiveLink, setSubActiveLink] = useState("null");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [destination, setDestination] = useState();
  const [toLocation, setToLocation] = useState();
  const navigate = useNavigate();
  const location = window.location.pathname;
  const {
    guest,
    setToQuery,
    setGuest,
    setSearchQuery,
    tripType,
    setSelectedDates,
    setTripType,
    setIsSearched,
    isSearched,
    selectedDates,
    setFilteredData,
    setIsSearchClicked,
    setLoading
  } = useContext(FlightsContext);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleSubLinkClick = (link) => {
    setSubActiveLink(link);
  };

  const destinationSetter = (value) => {
    setDestination(value)
    setSearchQuery(value)
  }

  const originSetter = (value) => {
    setToLocation(value)
    setToQuery(value)
  }

  const toggleDropdown = () => {
    setGuest({
      adults: adults,
      children: children,
      rooms: rooms,
    });
    setDropdownOpen(!dropdownOpen);
  };
  const showToast = () => {
    toast.error("Fill all required fields!", {
      duration: 1500, // duration in milliseconds
      position: "center-top",
    });
  };

  const handleSearchResults = () => {
    console.log(destination, toLocation, selectedDates, guest);

    if (!selectedDates){
      setSelectedDates([new Date()])
      setTimeout(()=>{},1000)
    }

    if (!destination || !toLocation || !guest) {
      showToast();
    } else {
      if (tripType === "oneWay") {
        setIsSearchClicked(false);
      } else if (tripType === "roundTrip") {
        setIsSearchClicked(true);
      }
      setLoading(true)
      setIsSearched(!isSearched);
      setFilteredData()
      setSearchQuery(destination);
      setToQuery(toLocation);
      navigate("/flights-offers");
    }
  };

  const handleNavigation = () => {
    setSearchQuery("")
    setToQuery("")
    setFilteredData([])
    setDestination("")
    setToLocation("")
    destinationSetter("")
    originSetter("")
    navigate("/");
  };

  // console.log(tripType);

  return (
    <div className="relative">
      {location === "/payment" || location === "/checkout" ? (
        <>
          <div className="hidden md:flex w-full flex-row justify-center py-[25px] items-center bg-[linear-gradient(to_right,_#525B31_0%,_#BED206_50%,_#525B31_100%)]">
            <Link to={"/"} className="flex justify-center items-center">
              <img
                src={logo}
                className="w-[60px] h-[60px]"
                alt="Logo"
                onClick={() => handleNavigation()}
              />
              <h1
                className="text-white font-bold ml-[20px] mr-[170px] font-inter"
                onClick={() => handleNavigation()}
              >
                Barfly.com
              </h1>
            </Link>
            <ul className="text-white font-semibold text-[15px] flex flex-row space-x-1 relative">
              <li
                className={`group w-[63px] h-[28px] hover:bg-white flex justify-center items-center relative cursor-pointer transition-all duration-200 rounded-[5px] ${
                  activeLink === "home"
                    ? "text-[#D2B57A] bg-white"
                    : "hover:text-[#D2B57A]"
                }`}
                onClick={() => handleLinkClick("home")}
              >
                <Link to={"/"} className="relative z-10 font-p">
                  Home
                  <span
                    className={`absolute mt-[20px] left-0 right-0 h-[1px] bg-[#D2B57A] transition-all duration-200 w-0 group-hover:w-full ${
                      activeLink === "home" ? "w-full" : "w-0"
                    }`}
                  ></span>
                </Link>
              </li>
              <li
                className={`group w-[63px] h-[28px] hover:bg-white flex justify-center items-center relative cursor-pointer transition-all duration-200 rounded-[5px] ${
                  activeLink === "about"
                    ? "text-[#D2B57A] bg-white"
                    : "hover:text-[#D2B57A]"
                }`}
                onClick={() => handleLinkClick("about")}
              >
                <a href="#" className="relative z-10 font-inter">
                  About
                  <span
                    className={`absolute mt-[20px] left-0 right-0 h-[1px] bg-[#D2B57A] transition-all duration-200 w-0 group-hover:w-full ${
                      activeLink === "about" ? "w-full" : "w-0 hover:w-full"
                    }`}
                  ></span>
                </a>
              </li>
              <li
                className={`group w-[63px] h-[28px] hover:bg-white flex justify-center items-center relative cursor-pointer transition-all duration-200 rounded-[5px] ${
                  activeLink === "help"
                    ? "text-[#D2B57A] bg-white"
                    : "hover:text-[#D2B57A]"
                }`}
                onClick={() => handleLinkClick("help")}
              >
                <a
                  href="#"
                  className="relative z-10 flex justify-center items-center hover:bg-white"
                >
                  Help
                  <span
                    className={`absolute mt-[20px] left-0 right-0 h-[1px] bg-[#D2B57A] transition-all duration-200 w-0 group-hover:w-full ${
                      activeLink === "help" ? "w-full" : "w-0"
                    }`}
                  ></span>
                </a>
              </li>
            </ul>
            <img src={currency} className="ml-[50px] w-[15px] h[15px]" />
            <p className="font-semibold text-[15px] text-white ml-[5px] flex flex-row">
              PKR . <img src={pakistan} className="mx-[5px]" /> PAK
            </p>
            <button className="shadow-custom w-[107px] h-[30px] bg-white rounded-[5px] text-[#D2B57A] font-semibold mx-[20px]">
              Register
            </button>
            <button className="shadow-custom w-[107px] h-7 bg-white rounded-[5px] text-[#D2B57A] font-semibold">
              Login
            </button>
          </div>
        </>
      ) : (
        <div
          style={{ backgroundImage: `url(${headerBg})` }}
          className="w-full h-[180px] md:h-[306px] bg-cover bg-center bg-no-repeat relative"
        >
          {/* Logo + Home buttons section */}
          <div className="hidden md:flex w-full flex-row justify-center py-[25px] items-center">
            <Link to={"/"} className="flex justify-center items-center">
              <img
                src={logo}
                className="w-[60px] h-[60px]"
                alt="Logo"
                onClick={() => handleNavigation()}
              />
              <h1
                className="text-white font-bold ml-[20px] mr-[170px] font-inter"
                onClick={() => handleNavigation()}
              >
                Barfly.com
              </h1>
            </Link>
            <ul className="text-white font-semibold text-[15px] flex flex-row space-x-1 relative">
              <li
                className={`group w-[63px] h-[28px] hover:bg-white flex justify-center items-center relative cursor-pointer transition-all duration-200 rounded-[5px] ${
                  activeLink === "home"
                    ? "text-[#D2B57A] bg-white"
                    : "hover:text-[#D2B57A]"
                }`}
                onClick={() => handleLinkClick("home")}
              >
                <Link to={"/"} className="relative z-10 font-p">
                  Home
                  <span
                    className={`absolute mt-[20px] left-0 right-0 h-[1px] bg-[#D2B57A] transition-all duration-200 w-0 group-hover:w-full ${
                      activeLink === "home" ? "w-full" : "w-0"
                    }`}
                  ></span>
                </Link>
              </li>
              <li
                className={`group w-[63px] h-[28px] hover:bg-white flex justify-center items-center relative cursor-pointer transition-all duration-200 rounded-[5px] ${
                  activeLink === "about"
                    ? "text-[#D2B57A] bg-white"
                    : "hover:text-[#D2B57A]"
                }`}
                onClick={() => handleLinkClick("about")}
              >
                <a href="#" className="relative z-10 font-inter">
                  About
                  <span
                    className={`absolute mt-[20px] left-0 right-0 h-[1px] bg-[#D2B57A] transition-all duration-200 w-0 group-hover:w-full ${
                      activeLink === "about" ? "w-full" : "w-0 hover:w-full"
                    }`}
                  ></span>
                </a>
              </li>
              <li
                className={`group w-[63px] h-[28px] hover:bg-white flex justify-center items-center relative cursor-pointer transition-all duration-200 rounded-[5px] ${
                  activeLink === "help"
                    ? "text-[#D2B57A] bg-white"
                    : "hover:text-[#D2B57A]"
                }`}
                onClick={() => handleLinkClick("help")}
              >
                <a
                  href="#"
                  className="relative z-10 flex justify-center items-center hover:bg-white"
                >
                  Help
                  <span
                    className={`absolute mt-[20px] left-0 right-0 h-[1px] bg-[#D2B57A] transition-all duration-200 w-0 group-hover:w-full ${
                      activeLink === "help" ? "w-full" : "w-0"
                    }`}
                  ></span>
                </a>
              </li>
            </ul>
            <img src={currency} className="ml-[50px] w-[15px] h[15px]" />
            <p className="font-semibold text-[15px] text-white ml-[5px] flex flex-row">
              PKR . <img src={pakistan} className="mx-[5px]" /> PAK
            </p>
            <button className="shadow-custom w-[107px] h-[30px] bg-white rounded-[5px] text-[#D2B57A] font-semibold mx-[20px]">
              Register
            </button>
            <button className="shadow-custom w-[107px] h-7 bg-white rounded-[5px] text-[#D2B57A] font-semibold">
              Login
            </button>
          </div>

          <div className="hidden md:flex justify-center items-center mb-4 mt-2">
            <p className="font-black font-montserrat text-5xl text-white">
              S<span>TAY SOMEWHERE GREAT!</span>
            </p>
          </div>

          {/* Sub links */}
          <ul className="hidden md:flex w-full h-20 justify-center flex-row">
            <li className="text-white group">
              <a href="" onClick={() => handleSubLinkClick("flight")}>
                <img src={plane} className="" />
                <p className="font-montserrat font-semibold text-lg mb-2.5">
                  Flight
                </p>
                <span
                  className={`block h-[2px] bg-white left-0 right-0 transition-all duration-200 w-0 group-hover:w-full ${
                    subActiveLink === "flight" ? "w-full" : "w-0"
                  }`}
                ></span>
              </a>
            </li>
          </ul>

          {/* Search bar container */}
          {location === "/hotel-info" ? (
            <></>
          ) : (
            <>
              <div className="hidden md:flex w-full flex-col justify-end items-center">
                <div className="w-[954px] bg-white rounded-[40px] bottom-0 shadow-search-container flex flex-row justify-between flex-wrap">
                  <div className="w-[32.5%] h-20 rounded-[40px] shadow-search items-center px-2 py-3 flex flex-row">
                    <div className="h-full mr-2 px-3 py-1">
                      <img src={schedule} className="w-8 h-8" />
                    </div>
                    <div className="h-full">
                      {tripType === "oneWay" ? (
                        <p className="text-[#525B31] font-bold text-base font-montserrat">
                          Departure Flight
                        </p>
                      ) : (
                        <p className="text-[#525B31] font-bold text-base font-montserrat">
                          Outbound - Return Flight
                        </p>
                      )}
                      <DatePicker />
                    </div>
                  </div>

                  <div className="w-[32.5%] h-20 rounded-[40px] shadow-search flex flex-row items-center px-2 py-3">
                    <div className="h-full flex flex-col mr-1">
                      <img
                        src={flighttype}
                        className="w-10 h-10 mr-2 ml-4 my-1"
                      />
                    </div>
                    <div className="flex flex-col w-full ml-8 justify-center">
                      <p className="text-[#525B31] font-bold text-base font-montserrat">
                        Flight Type?
                      </p>
                      <select
                        id="tripType"
                        onChange={(value) => setTripType(value.target.value)}
                        className="outline-none rounded-md p-2 w-28"
                        defaultValue="One Way"
                      >
                        <option value="oneWay">One Way</option>
                        <option value="roundTrip">Return</option>
                        <option value="multiCity">Multi-City</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-[32.5%] h-20 rounded-[40px] shadow-search flex flex-row items-center px-2 py-3">
                    <div className="h-full flex flex-col mr-1">
                      <img src={user} className="w-10 h-10 ml-1 " />
                    </div>
                    <div
                      onClick={() => toggleDropdown()}
                      className="w-24 h-16 mt-2"
                    >
                      <p className="text-[#525B31] font-bold text-base font-montserrat">
                        Who?
                      </p>
                      {guest ? (
                        <div className="">
                          <p className="text-[10px]">
                            {adults} adults | {children} children | {rooms}{" "}
                            infants
                          </p>
                        </div>
                      ) : (
                        <div>
                          {guest ? (
                            <>
                              <p>
                                {guest.adults} adults | {guest.children}{" "}
                                children | {guest.rooms} infants
                              </p>
                            </>
                          ) : (
                            <p className="text-[#525B31] text-[15px] font-montserrat">
                              Add Guests
                            </p>
                          )}
                          {dropdownOpen && (
                            <div>
                              <input
                                type="number"
                                value={adults}
                                onChange={(e) =>
                                  setAdults(Number(e.target.value))
                                }
                                placeholder="Adults"
                              />
                              <input
                                type="number"
                                value={children}
                                onChange={(e) =>
                                  setChildren(Number(e.target.value))
                                }
                                placeholder="Children"
                              />
                              <input
                                type="number"
                                value={rooms}
                                onChange={(e) =>
                                  setRooms(Number(e.target.value))
                                }
                                placeholder="Infants"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      className="flex  flex-row w-[140px] h-14 items-center px-4 py-2 bg-[#D2B57A] text-white transition rounded-[40px] ml-auto"
                      onClick={() => handleSearchResults()}
                    >
                      <img src={search} />
                      <p className="ml-auto text-[20px]">Search</p>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute z-10 mt-80 w-60 h-56 bg-white rounded-lg shadow-lg">
                        <section className="flex flex-row justify-between h-16 border-b border-b-[#D2B57A] pr-3">
                          <div className="pt-4 pl-6">
                            <p className="font-bold text-custom-green">Adult</p>
                            <p className="text-custom-green text-[10px]">
                              (Age 17 or above)
                            </p>
                          </div>
                          <div className="flex flex-row justify-between w-20">
                            <div className="flex justify-center items-center">
                              <button
                                className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                                onClick={() => setAdults(adults - 1)}
                                disabled={adults === 1}
                              >
                                -
                              </button>
                            </div>
                            <div className="flex justify-center items-center">
                              <p className="mx-2">{adults}</p>
                            </div>
                            <div className="flex justify-center items-center">
                              <button
                                className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                                onClick={() => setAdults(adults + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </section>
                        <section className="flex flex-row justify-between h-16 border-b border-b-[#D2B57A] pr-3">
                          <div className="pt-4 pl-6">
                            <p className="font-bold text-custom-green">
                              Children
                            </p>
                            <p className="text-custom-green text-[10px]">
                              (Age 4 to 17)
                            </p>
                          </div>
                          <div className="flex flex-row justify-between w-20">
                            <div className="flex justify-center items-center">
                              <button
                                className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                                onClick={() => setChildren(children - 1)}
                                disabled={children === 0}
                              >
                                -
                              </button>
                            </div>
                            <div className="flex justify-center items-center">
                              <p className="mx-2">{children}</p>
                            </div>
                            <div className="flex justify-center items-center">
                              <button
                                className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                                onClick={() => setChildren(children + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </section>
                        <section className="flex flex-row justify-between h-12 border-b border-b-[#D2B57A] pr-3">
                          <div className="pl-6 h-full flex flex-row items-center">
                            <p className="font-bold text-custom-green">
                              Infants
                            </p>
                          </div>
                          <div className="flex flex-row justify-between w-20">
                            <div className="flex justify-center items-center">
                              <button
                                className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                                onClick={() => setRooms(rooms - 1)}
                                disabled={rooms === 0}
                              >
                                -
                              </button>
                            </div>
                            <div className="flex justify-center items-center">
                              <p className="mx-2">{rooms}</p>
                            </div>
                            <div className="flex justify-center items-center">
                              <button
                                className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                                onClick={() => setRooms(rooms + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </section>
                        <section className="flex flex-row justify-center items-center h-12 ">
                          <button
                            className="w-32 h-7 bg-custom-gold rounded-md text-white font-semibold text-[10px]"
                            onClick={() => toggleDropdown()}
                          >
                            Done
                          </button>
                        </section>
                      </div>
                    )}
                  </div>

                  <div className="w-[49%] h-20 rounded-[40px] shadow-search flex flex-row items-center mt-3 px-2 py-3">
                    <div className="h-full px-3 py-1">
                      <img src={airplane} className="w-10 h-10" />
                    </div>
                    <div className="ml-4 h-full w-full mr-2">
                      <p className="text-[#525B31] font-bold text-base font-montserrat">
                        From?
                      </p>
                      {/* <input
                        type="search"
                        placeholder="From Where"
                        className="text-[#525B31] text-base font-montserrat outline-none w-full"
                        value={destination}
                        onChange={(text) => setDestination(text.target.value)}
                      /> */}
                      <CitySearch type="from" destinationSetter={destinationSetter} originSetter={originSetter}/>
                    </div>
                  </div>

                  <div className="w-[49%] h-20 rounded-[40px] shadow-search flex flex-row items-center mt-3 px-2 py-3">
                    <div className="h-full mr-2 px-3 py-1">
                      <img src={landing} className="w-10 h-10" />
                    </div>
                    <div className="ml-4 h-full w-full mr-2">
                      <p className="text-[#525B31] font-bold text-base font-montserrat">
                        To?
                      </p>
                      {/* <input
                        type="search"
                        placeholder="To Where"
                        className="text-[#525B31] text-base font-montserrat outline-none w-full"
                        value={toLocation}
                        onChange={(text) => setToLocation(text.target.value)}
                      /> */}
                      <CitySearch type="to" destinationSetter={destinationSetter} originSetter={originSetter}/>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {isDropDownOpenForMobile && (
        <div className="flex w-full flex-col justify-end items-center md:hidden">
          <div className=" bg-white rounded-[40px] bottom-0 shadow-search-container flex flex-row justify-center flex-wrap space-x-2">
            <div className="w-full h-20 rounded-[40px] shadow-search items-center px-2 py-3 flex flex-row">
              <div className="h-full mr-2 px-3 py-1">
                <img src={schedule} className="w-8 h-8" />
              </div>
              <div className="h-full">
                {tripType === "oneWay" ? (
                  <p className="text-[#525B31] font-bold text-base font-montserrat">
                    Departure Flight
                  </p>
                ) : (
                  <p className="text-[#525B31] font-bold text-base font-montserrat">
                    Outbound - Return Flight
                  </p>
                )}
                <DatePicker />
              </div>
            </div>

            <div className="w-full h-20 rounded-[40px] shadow-search flex flex-row items-center px-2 py-3 my-3">
              <div className="h-full flex flex-col mr-1">
                <img src={flighttype} className="w-10 h-10 mr-2 ml-4 my-1" />
              </div>
              <div className="flex flex-col w-full ml-8 justify-center">
                <p className="text-[#525B31] font-bold text-base font-montserrat">
                  Flight Type?
                </p>
                <select
                  id="tripType"
                  onChange={(value) => setTripType(value.target.value)}
                  className="outline-none rounded-md p-2 w-28"
                  defaultValue="One Way"
                >
                  <option value="oneWay">One Way</option>
                  <option value="roundTrip">Return</option>
                  <option value="multiCity">Multi-City</option>
                </select>
              </div>
            </div>

            <div className="w-full h-20 rounded-[40px] shadow-search flex flex-row items-center px-2 py-3">
              <div className="h-full flex flex-col mr-1">
                <img src={user} className="w-10 h-10 ml-1 " />
              </div>
              <div onClick={() => toggleDropdown()} className="w-24 h-16 mt-2">
                <p className="text-[#525B31] font-bold text-base font-montserrat">
                  Who?
                </p>
                {guest ? (
                  <div className="">
                    <p className="text-[10px]">
                      {adults} adults | {children} children | {rooms} infants
                    </p>
                  </div>
                ) : (
                  <div>
                    {guest ? (
                      <>
                        <p>
                          {guest.adults} adults | {guest.children} children |{" "}
                          {guest.rooms} infants
                        </p>
                      </>
                    ) : (
                      <p className="text-[#525B31] text-[15px] font-montserrat">
                        Add Guests
                      </p>
                    )}
                    {dropdownOpen && (
                      <div>
                        <input
                          type="number"
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                          placeholder="Adults"
                        />
                        <input
                          type="number"
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                          placeholder="Children"
                        />
                        <input
                          type="number"
                          value={rooms}
                          onChange={(e) => setRooms(Number(e.target.value))}
                          placeholder="Infants"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                className="flex flex-row w-[140px] h-14 items-center px-4 py-2 bg-[#D2B57A] text-white transition rounded-[40px] ml-auto"
                onClick={() => handleSearchResults()}
              >
                <img src={search} />
                <p className="ml-auto text-[20px]">Search</p>
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 mt-80 w-60 h-56 bg-white rounded-lg shadow-lg">
                  <section className="flex flex-row justify-between h-16 border-b border-b-[#D2B57A] pr-3">
                    <div className="pt-4 pl-6">
                      <p className="font-bold text-custom-green">Adult</p>
                      <p className="text-custom-green text-[10px]">
                        (Age 17 or above)
                      </p>
                    </div>
                    <div className="flex flex-row justify-between w-20">
                      <div className="flex justify-center items-center">
                        <button
                          className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                          onClick={() => setAdults(adults - 1)}
                          disabled={adults === 1}
                        >
                          -
                        </button>
                      </div>
                      <div className="flex justify-center items-center">
                        <p className="mx-2">{adults}</p>
                      </div>
                      <div className="flex justify-center items-center">
                        <button
                          className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                          onClick={() => setAdults(adults + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </section>
                  <section className="flex flex-row justify-between h-16 border-b border-b-[#D2B57A] pr-3">
                    <div className="pt-4 pl-6">
                      <p className="font-bold text-custom-green">Children</p>
                      <p className="text-custom-green text-[10px]">
                        (Age 4 to 17)
                      </p>
                    </div>
                    <div className="flex flex-row justify-between w-20">
                      <div className="flex justify-center items-center">
                        <button
                          className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                          onClick={() => setChildren(children - 1)}
                          disabled={children === 0}
                        >
                          -
                        </button>
                      </div>
                      <div className="flex justify-center items-center">
                        <p className="mx-2">{children}</p>
                      </div>
                      <div className="flex justify-center items-center">
                        <button
                          className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                          onClick={() => setChildren(children + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </section>
                  <section className="flex flex-row justify-between h-12 border-b border-b-[#D2B57A] pr-3">
                    <div className="pl-6 h-full flex flex-row items-center">
                      <p className="font-bold text-custom-green">Infants</p>
                    </div>
                    <div className="flex flex-row justify-between w-20">
                      <div className="flex justify-center items-center">
                        <button
                          className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                          onClick={() => setRooms(rooms - 1)}
                          disabled={rooms === 0}
                        >
                          -
                        </button>
                      </div>
                      <div className="flex justify-center items-center">
                        <p className="mx-2">{rooms}</p>
                      </div>
                      <div className="flex justify-center items-center">
                        <button
                          className="w-4 h-4 rounded-full bg-custom-gold flex justify-center items-center"
                          onClick={() => setRooms(rooms + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </section>
                  <section className="flex flex-row justify-center items-center h-12 ">
                    <button
                      className="w-32 h-7 bg-custom-gold rounded-md text-white font-semibold text-[10px]"
                      onClick={() => toggleDropdown()}
                    >
                      Done
                    </button>
                  </section>
                </div>
              )}
            </div>

            <div className="w-full h-20 rounded-[40px] shadow-search flex flex-row items-center mt-3 px-2 py-3">
              <div className="h-full mr-2 px-3 py-1">
                <img src={airplane} className="w-8 h-8" />
              </div>
              <div className="ml-4 h-full w-full">
                <p className="text-[#525B31] font-bold text-base font-montserrat">
                  From?
                </p>
                {/* <input
                  type="search"
                  placeholder="From Where"
                  className="text-[#525B31] text-base font-montserrat outline-none w-full"
                  value={destination}
                  onChange={(text) => setDestination(text.target.value)}
                /> */}
                <CitySearch type="from" destinationSetter={destinationSetter} originSetter={originSetter}/>
              </div>
            </div>

            <div className="w-full  h-20 rounded-[40px] shadow-search flex flex-row items-center mt-3 px-2 py-3">
              <div className="h-full mr-2 px-3 py-1">
                <img src={landing} className="w-8 h-8" />
              </div>
              <div className="ml-4 h-full w-full">
                <p className="text-[#525B31] font-bold text-base font-montserrat">
                  To?
                </p>
                {/* <input
                  type="search"
                  placeholder="To Where"
                  className="text-[#525B31] text-base font-montserrat outline-none w-full"
                  value={toLocation}
                  onChange={(text) => setToLocation(text.target.value)}
                /> */}
                <CitySearch type="to" destinationSetter={destinationSetter} originSetter={originSetter}/>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        className="flex md:hidden bg-custom-gradient ml-4 mt-4 p-2 rounded text-white"
        onClick={() => setIsDropDownOpenForMobile(!isDropDownOpenForMobile)}
      >
        {isDropDownOpenForMobile ? (
          <p>Close Search DropDown</p>
        ) : (
          <p>Open Search DropDown</p>
        )}
      </button>
      <Toaster />
    </div>
  );
};

export default Navbar;

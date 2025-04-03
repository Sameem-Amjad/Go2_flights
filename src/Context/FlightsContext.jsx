import React, { createContext, useState, useEffect } from "react";

export const FlightsContext = createContext();

export const FlightsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [data, setFilteredData] = useState({
    cabin_class: ["economy", "premium_economy", "business", "first"],
    base_amount: [0, 100000],
    stops: [],
    airlines: []
  });

  // State for selected dates
  const [selectedDates, setSelectedDates] = useState(() => {
    const storedDates = localStorage.getItem("selectedDates");
    if (storedDates) {
      const parsedDates = JSON.parse(storedDates);
      // Ensure we correctly handle both single date and array of dates
      return Array.isArray(parsedDates)
        ? parsedDates.map((dateStr) => new Date(dateStr))
        : [new Date(parsedDates)]; // Wrap in array for single date
    }
    return null; // If no stored dates, return null
  });

  // State for guest information
  // const [guest, setGuest] = useState(() => {
  //   const storedGuest = localStorage.getItem("guest");
  //   return storedGuest ? JSON.parse(storedGuest) : { adults: 1, children: 0, rooms: 0 };
  // });
  const [guest, setGuest] = useState({ adults: 1, children: 0, rooms: 0 });

  // State for selected hotel
  const [selectedHotel, setSelectedHotel] = useState(() => {
    const storedHotel = localStorage.getItem("selectedHotel");
    return storedHotel ? JSON.parse(storedHotel) : null;
  });

  // State for search query
  const [searchQuery, setSearchQuery] = useState(() => {   
    const storedQuery = localStorage.getItem("searchQuery");
    return storedQuery ? JSON.parse(storedQuery) : "";
  });

  // State for to destination query
  const [toQuery, setToQuery] = useState(() => {
    const storedQuery = localStorage.getItem("toQuery");
    return storedQuery ? JSON.parse(storedQuery) : "";
  });

  // State for trip type
  const [tripType, setTripType] = useState("oneWay");

  // Persist selectedDates to localStorage
  useEffect(() => {
    if (selectedDates) {
      const datesToStore = Array.isArray(selectedDates)
        ? selectedDates.map((date) => date.toISOString())
        : [selectedDates.toISOString()]; // Wrap single date in an array
      localStorage.setItem("selectedDates", JSON.stringify(datesToStore));
    } else {
      localStorage.removeItem("selectedDates");
    }
  }, [selectedDates]);

  // Persist guest information to localStorage
  useEffect(() => {
    console.log(guest);
    if (guest && Object.keys(guest).length) {
      localStorage.setItem("guest", JSON.stringify(guest));
    } else {
      setGuest({ adults: 1, children: 0, rooms: 0 })
    }
  }, [guest]);

  useEffect(() => {
    const storedGuest = localStorage.getItem("guest");
    // return storedGuest ? JSON.parse(storedGuest) : { adults: 1, children: 0, rooms: 0 };
    setGuest(storedGuest)
    console.log(guest);
    if (guest && Object.keys(guest).length) {
      localStorage.setItem("guest", JSON.stringify(guest));
    } else {
      setGuest({ adults: 1, children: 0, rooms: 0 })
    }
  }, []);
  // Persist selectedHotel to localStorage
  useEffect(() => {
    if (selectedHotel) {
      localStorage.setItem("selectedHotel", JSON.stringify(selectedHotel));
    } else {
      localStorage.removeItem("selectedHotel");
    }
  }, [selectedHotel]);

  // Persist searchQuery to localStorage
  useEffect(() => {
    console.log("ran");
    
    if (searchQuery) {
      localStorage.setItem("searchQuery", JSON.stringify(searchQuery));
    } else {     
      localStorage.removeItem("searchQuery");
    }
  }, [searchQuery]);

  // Persist toQuery to localStorage
  useEffect(() => {
    if (toQuery) {
      localStorage.setItem("toQuery", JSON.stringify(toQuery));
    } else {
      localStorage.removeItem("toQuery");
    }
  }, [toQuery]);

  // Persist tripType to localStorage
  // useEffect(() => {
  //   localStorage.setItem("tripType", JSON.stringify(tripType));
  // }, [tripType]);

  // Reset guest data when on the homepage
  useEffect(() => {
    if (window.location.pathname === "/") {
      setGuest(null);
    }
  }, []);

  return (
    <FlightsContext.Provider
      value={{
        selectedDates,
        setSelectedDates,
        guest,
        setGuest,
        selectedHotel,
        setSelectedHotel,
        searchQuery,
        setSearchQuery,
        toQuery,
        setToQuery,
        tripType,
        setTripType,
        setIsSearched,
        isSearched,
        loading, 
        setLoading,
        error, 
        setError,
        isSearchClicked,
        setIsSearchClicked,
        data,
        setFilteredData
      }}
    >
      {children}
    </FlightsContext.Provider>
  );
};

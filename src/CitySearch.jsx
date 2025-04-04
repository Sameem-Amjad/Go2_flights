import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FlightsContext } from "./Context/FlightsContext";
import airport from "./assets/png/airport.png";
import flag from "./assets/png/report.png";

const AirportSearch = ({ type, destinationSetter, originSetter }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const { setSearchQuery, setToQuery } = useContext(FlightsContext);

  const fetchAccessToken = async () => {
    try {
      const response = await axios.post(
        "https://api.amadeus.com/v1/security/oauth2/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: import.meta.env.VITE_API_KEY,
          client_secret: import.meta.env.VITE_API_SECRET,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error("Error fetching access token:", error);
      setError("Unable to authenticate with Amadeus API.");
    }
  };

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     localStorage.setItem("searchQuery", JSON.stringify(inputValue));
  //     localStorage.setItem("toQuery", JSON.stringify(inputValue));
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [])
  useEffect(() => {
    if (window.location.pathname === "/") {
      setInputValue("");
    }
  }, [window.location.pathname]);

  const handleInputChange = async (event) => {
    setError("");
    const query = event.target.value;
    setInputValue(query);
    if (type == "from") {
      destinationSetter(query);
    } else if (type == "to") {
      originSetter(query);
    }
    if (query.length > 0 && accessToken) {
      setIsLoading(true);
      setError(null);

      try {
        setTimeout(() => { }, 1000);
        const response = await axios.get(
          `https://api.amadeus.com/v1/reference-data/locations`,
          {
            params: {
              subType: "AIRPORT,CITY",
              keyword: query,
              "page[limit]": 5,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // console.log(response.data.data);

        setSuggestions(
          response.data.data
            .map((location) => ({
              name: location.name,
              iataCode: location.iataCode,
              city: location.address?.cityName || location.name, // Fallback to name if cityName is unavailable
              type: location.subType, // "CITY" or "AIRPORT"
            }))
            .sort((a, b) => {
              // Sort by type: Cities come before Airports
              if (a.type === "CITY" && b.type === "AIRPORT") return -1;
              if (a.type === "AIRPORT" && b.type === "CITY") return 1;

              // If both are cities or both are airports, sort by name
              return a.name.localeCompare(b.name);
            })
        );
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setError("Error fetching suggestions");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(`${suggestion.name} (${suggestion.iataCode})`);
    setSuggestions([]);
    if (type == "from") {
      console.log("saving");
      destinationSetter(suggestion.iataCode);
    } else if (type == "to") {
      originSetter(suggestion.iataCode);
    }
  };

  React.useEffect(() => {
    fetchAccessToken();
  }, []);

  return (
    <div className="airport-search">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={type === "from" ? "From Where" : "To Where"}
        className="text-[#525B31] text-base font-montserrat outline-none w-full"
      />
      {isLoading && <p>Loading...</p>}
      <div className="relative">
        <ul className="suggestions-list mt-2 bg-white absolute top-full left-0 w-full z-50 shadow-lg rounded-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 border-b cursor-pointer hover:bg-custom-green text-custom-green hover:text-custom-gold flex items-center space-x-2"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {/* Add airplane icon for airports or flag for cities */}
              {suggestion.type === "CITY" ? (
                <img src={flag} alt="City" className="w-4 h-4" />
              ) : (
                <img src={airport} alt="Airport" className="w-4 h-4" />
              )}
              <span>
                <strong className="text-inherit">{suggestion.name}</strong> (
                {suggestion.iataCode}) - {suggestion.city}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AirportSearch;

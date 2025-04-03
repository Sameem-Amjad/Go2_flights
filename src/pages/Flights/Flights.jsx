import React, { useContext, useEffect, useState } from "react";
import FlightOfferCard from "../../Cards/FlightsOffers";
import { FlightsContext } from "../../Context/FlightsContext";
import axios from "axios";
import Filter from "./components/Filters";
import RoundTripFlightOfferCard from "../../Cards/FlightOffersRoundTrip";
import Pagination from "../../components/Pagination/Pagination"; // Ensure you have this component
import { toast } from "react-hot-toast";

const FlightOffersList = () => {
  const [response, setResponse] = useState(null);
  const [id, setId] = useState();
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const {
    selectedDates,
    guest,
    searchQuery,
    toQuery,
    isSearched,
    tripType,
    loading,
    setLoading,
    error,
    setError,
    isSearchClicked,
    data,
    setFilteredData,
    setSearchQuery,
    setToQuery
  } = useContext(FlightsContext);
  const [departureDate, setDepartureDate] = useState(selectedDates[0]);
  const [returnDate, setReturnDate] = useState(
    selectedDates.length > 1 ? selectedDates[1] : null
  );
  const [totalPages, setTotalPages] = useState();
  const [selectedSortValue, setSelectedSortValue] = useState("best");

  const [passengers, setPassengers] = useState([{ type: "adult" }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterVisible, setFilterVisible] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  let newPassengers = [];

  useEffect(() => {
    if (response !== null) {
      setLoading(false);
    }
  }, [response]);

  useEffect(() => {
    setResponse(null)
    setPage(1);
    fetchPaginatedData();
    setCurrentPage(1);
  }, [applyFilter]);

  useEffect(() => {
    if (guest.adults > 1) {
      for (let i = 0; i < guest.adults - 1; i++) {
        newPassengers.push({ type: "adult" });
      }
    }

    for (let i = 0; i < guest.children; i++) {
      newPassengers.push({ type: "child" });
    }

    for (let i = 0; i < guest.rooms; i++) {
      newPassengers.push({ type: "infant_without_seat" });
    }

    if (newPassengers.length > 0) {
      setPassengers(newPassengers);
    }
    console.log(newPassengers);

    setTimeout(() => {}, 1000);
    console.log(newPassengers);
  }, [guest]);

  const getAirportData = async (city, type) => {
    const previousFromCity = JSON.parse(localStorage.getItem("previousFrom")) || ""
    const previousToCity = JSON.parse(localStorage.getItem("previousTo")) || ""

    if (type === 'origin' && city === previousFromCity.city){
      return previousFromCity.iata
    }
    if (type === 'destination' && city === previousToCity.city){
      return previousToCity.iata
    }
    try {
      const response = await axios.get(
        "https://api.api-ninjas.com/v1/airports",
        {
          headers: { "X-Api-Key": import.meta.env.VITE_AIRPORT_API },
          params: { city },
        }
      );
  
      if (response.data.length > 0) {
        // Iterate over the data to find the first non-empty IATA code
        const validIATA = response.data.find((airport) => airport.iata !== "");
        if (validIATA) {
          console.log(`First valid airport in ${city}: ${validIATA.iata}`);
          type === "origin" ? await setSearchQuery(validIATA.iata) : await setToQuery(validIATA.iata);
          if (type === "origin"){
            localStorage.setItem("previousFrom", JSON.stringify({city: city, iata: validIATA.iata}))
          }
          if (type === "destination"){
            localStorage.setItem("previousTo", JSON.stringify({city: city, iata: validIATA.iata}))
          }
          console.log(response.data);
          
          return validIATA.iata;
        } else {
          console.log(`No valid IATA codes found in ${city}.`);
          return null;
        }
      } else {
        console.log(`No airports found in ${city}.`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching airport data:", error.message);
      return null;
    }
  };
  

  const fetchPaginatedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const obj = { data };
  
      if (selectedDates.length > 1 && tripType === "roundTrip") {
        console.log(obj, id, limit, page, selectedSortValue);
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}flights/list`,
          Object.keys(obj).length > 0
            ? obj
            : {
                cabin_class: ["economy", "premium_economy", "business", "first"],
                base_amount: [0, 100000],
                stops: [],
                airlines: [],
              },
          {
            params: {
              id: id,
              ...(limit && { limit: limit }),
              ...(page && { page: page }),
              sortBy: selectedSortValue,
            },
          }
        );
        if (res) {
          console.log("1:", res);
  
          // Append new data to existing response
          setResponse((prevResponse) => [
            ...(prevResponse) || [],
            ...res.data.data.data,
          ]);
  
          setMinPrice(
            Math.floor(res?.data?.data?.meta.minPrice).toFixed(0) - 100
          );
          setMaxPrice(
            Number(Math.floor(res?.data?.data?.meta.maxPrice).toFixed(0)) + 100
          );
          setPriceRange(
            Math.floor(res?.data?.data?.meta.minPrice).toFixed(0) - 100,
            Math.floor(res?.data?.data?.meta.maxPrice).toFixed(0) + 100
          );
        }
      } else if (tripType === "roundTrip") {
        toast.error("Please select Complete Date and Both Locations");
        setLoading(false);
      }
  
      if (
        selectedDates.length <= 2 &&
        selectedDates.length !== 0 &&
        tripType === "oneWay"
      ) {
        console.log(id, limit, page);
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}flights/list`,
          obj,
          {
            params: {
              id: id,
              ...(limit && { limit: limit }),
              ...(page && { page: page }),
              sortBy: selectedSortValue,
            },
          }
        );
        if (res) {
          console.log("2:", res);
  
          // Append new data to existing response
          setResponse((prevResponse) => [
            ...(prevResponse) || [],
            ...res.data.data.data,
          ]);
  
          setMinPrice(
            Math.floor(res?.data?.data?.meta.minPrice).toFixed(0) - 100
          );
          setMaxPrice(
            Number(Math.floor(res?.data?.data?.meta.maxPrice).toFixed(0)) + 100
          );
          setPriceRange(
            Math.floor(res?.data?.data?.meta.minPrice).toFixed(0) - 100,
            Math.floor(res?.data?.data?.meta.maxPrice).toFixed(0) + 100
          );
        }
      } else if (tripType === "oneWay" && selectedDates.length > 1) {
        toast.error("Please select Complete Departure date only");
      }
    } catch (error) {
      console.error("Error fetching flight offers:", error);
      if (error?.response?.status !== 500) {
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      console.error("Invalid date object");
      return null; // Return null if the date is invalid
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (selectedDates.length > 0) {
      const date = selectedDates[0]; // Ensure this is a Date object
      setDepartureDate(formatDate(date));
      if (selectedDates.length > 1) {
        setReturnDate(formatDate(selectedDates[1]));
      }
    }
  }, [selectedDates]);

  useEffect(() => {
    const flightsApiRequest = async () => {
      setResponse(null)
      setLoading(true);
      setError(null);
      try {
        const originIATA =
          searchQuery.length === 3
            ? searchQuery
            : await getAirportData(searchQuery, 'origin'); 
        const destinationIATA =
          toQuery.length === 3 ? toQuery : await getAirportData(toQuery, 'destination');
        const requestData =
          tripType === "oneWay"
            ? {
                data: {
                  slices: [
                    {
                      origin: originIATA,
                      destination: destinationIATA,
                      departure_date: departureDate,
                    },
                  ],
                  passengers: passengers,
                },
              }
            : {
                data: {
                  slices: [
                    {
                      origin: originIATA,
                      destination: destinationIATA,
                      departure_date: departureDate,
                    },
                    {
                      origin: destinationIATA,
                      destination: originIATA,
                      departure_date: returnDate,
                    },
                  ],
                  passengers: passengers,
                },
              };

        if (selectedDates.length > 1 && tripType === "roundTrip") {
          const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}flights/createOfferRequest`,
            requestData
          );
          if (res) {
            console.log(res);
            setResponse(res.data.data.data);
            setTotalPages(res.data?.data?.meta?.totalPages);
            setId(res.data.data.meta.id);
            setMinPrice(
              Math.floor(res?.data?.data?.meta.minPrice).toFixed(0) - 100
            );
            setMaxPrice(
              Number(Math.floor(res?.data?.data?.meta.maxPrice).toFixed(0)) +
                100
            );
            setPriceRange(
              Math.floor(res?.data?.data?.meta.minPrice).toFixed(0) - 100,
              Math.floor(res?.data?.data?.meta.maxPrice).toFixed(0) + 100
            );
          }
        } else if (tripType === "roundTrip") {
          toast.error("Please select Complete Date and Both Locations");
        }
        if (
          selectedDates.length <= 2 &&
          selectedDates.length !== 0 &&
          tripType === "oneWay"
        ) {
          const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}flights/createOfferRequest`,
            requestData
          );
          if (res) {
            console.log(res);
            setTotalPages(res.data?.data?.meta?.totalPages);
            setId(res.data.data.meta.id);
            setResponse(res?.data?.data?.data);
            setMinPrice(
              Math.floor(res?.data?.data?.meta.minPrice).toFixed(0) - 100
            );
            setMaxPrice(
              Number(Math.floor(res?.data?.data?.meta.maxPrice).toFixed(0)) +
                100
            );
            console.log(res?.data?.data?.meta.maxPrice);

            setPriceRange(
              Math.floor(res?.data?.data?.meta.minPrice).toFixed(0) - 100,
              Math.floor(res?.data?.data?.meta.maxPrice).toFixed(0) + 100
            );
          }
        } else if (tripType === "oneWay" && selectedDates.length > 1) {
          toast.error("Please select Complete Departure date only");
        }
      } catch (error) {
        console.error("Error fetching flight offers:", error);
        if (error.response && error.response.status === 502) {
          setError("Error from server");
          setLoading(false);
        } else {
          setError("An unexpected error occurred."); // General error message
          setLoading(false);
        }
      }
    };
    flightsApiRequest();
    setCurrentPage(1);
    setSelectedSortValue("best");
  }, [isSearched]);

  const handlePageChange = (pages) => {
    setCurrentPage(pages);
    setPage(pages);
  };

  const setFilters = (data) => {
    setFilteredData(data);
  };

  const handleOrderByFlights = async (sortBy) => {
    setSelectedSortValue(sortBy);
  };

  useEffect(() => {
    if (selectedSortValue) {
      fetchPaginatedData();
    }
  }, [selectedSortValue, page]);

  return (
    <div className="max-w-4xl mx-auto p-4 mt-32 flex flex-col lg:flex-row justify-between">
      <div className="w-full lg:w-3/12 mx-2">
        {/* Button to show filter on mobile */}
        <div className="block lg:hidden">
          <button
            className="bg-custom-gradient text-white p-2 rounded"
            onClick={() => setFilterVisible(!filterVisible)}
          >
            {filterVisible ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        {/* Filter component shown as a card on mobile */}
        {filterVisible && (
          <div className="bg-white shadow-md rounded-lg p-4 lg:hidden">
            <Filter
              flights={response}
              setFilteredData={setFilters}
              applyFilter={applyFilter}
              setApplyFilter={setApplyFilter}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </div>
        )}
        {/* Always show the Filter component on larger screens */}
        <div className="hidden lg:block">
          <Filter
            flights={response}
            setFilteredData={setFilters}
            applyFilter={applyFilter}
            setApplyFilter={setApplyFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>
      </div>
      <div className="w-full lg:w-8/12">
        <div className="w-full h-auto flex justify-center space-x-2 mb-4">
          <div
            className={`cursor-pointer shadow-lg flex items-center justify-center rounded-lg hover:border hover:border-custom-gold
    h-20 sm:h-24 lg:h-28
    w-full sm:w-1/2 md:w-1/3 lg:w-3/12
    text-sm sm:text-base lg:text-lg
    ${selectedSortValue === "best" ? "border-[3px] border-custom-gold" : ""}`}
            onClick={() => handleOrderByFlights("best")}
          >
            Best
            <img
              src={"/images/premium-quality.png"}
              alt="best offer image"
              className="w-6 h-6 sm:w-8 sm:h-8 mx-1 sm:mx-2"
            />
          </div>

          <div
            className={`cursor-pointer shadow-lg flex items-center justify-center rounded-lg hover:border border-custom-gold
    h-20 sm:h-24 lg:h-28
    w-full sm:w-1/2 md:w-1/3 lg:w-3/12
    text-sm sm:text-base lg:text-lg
    ${
      selectedSortValue === "cheapest" ? "border-[3px] border-custom-gold" : ""
    }`}
            onClick={() => handleOrderByFlights("cheapest")}
          >
            Cheapest
            <img
              src={"/images/cheapest.png"}
              alt="cheapest offer image"
              className="w-6 h-6 sm:w-8 sm:h-8 mx-1 sm:mx-2"
            />
          </div>

          <div
            className={`cursor-pointer shadow-lg flex items-center justify-center rounded-lg hover:border hover:border-custom-gold
    h-20 sm:h-24 lg:h-28
    w-full sm:w-1/2 md:w-1/3 lg:w-3/12
    text-sm sm:text-base lg:text-lg
    ${
      selectedSortValue === "quickest" ? "border-[3px] border-custom-gold" : ""
    }`}
            onClick={() => handleOrderByFlights("quickest")}
          >
            Quickest
            <img
              src={"/images/fast-response.png"}
              alt="best offer image"
              className="w-6 h-6 sm:w-8 sm:h-8 mx-1 sm:mx-2"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[70vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center text-2xl">{error}</p> // Display error message
        ) : response && response.length > 0 ? (
          response.length > 0 ? (
            response.map((offer) =>
              tripType === "roundTrip" &&
              selectedDates.length === 2 &&
              isSearchClicked ? (
                <RoundTripFlightOfferCard
                  key={offer.id}
                  offer={offer}
                  data={data}
                />
              ) : (
                <FlightOfferCard key={offer.id} offer={offer} data={data} />
              )
            )
          ) : (
            <p className="text-center text-2xl">No results found</p>
          )
        ) : (
          <p className="text-center text-2xl">No results found</p>
        )}
        {totalPages > 1 && !error && response?.length > 0 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            id={id}
            limit={limit}
            page={page}
          />
        )}
      </div>
    </div>
  );
};

export default FlightOffersList;

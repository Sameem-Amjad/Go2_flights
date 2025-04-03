import React, { useContext, useState } from "react";
import sort from "../../assets/svg/sort.svg";
import arrows from "../../assets/svg/Sortingarrowheads.svg";
import Hotel from "../../Cards/Hotel.jsx";
import hotels from "../../utils/Hotels/Hotels.jsx";
import Filter from "./components/Filter.jsx";
import { FlightsContext } from "../../Context/FlightsContext.jsx";

const Results = () => {
  const { searchQuery } = useContext(FlightsContext);
  const { toQuery } = useContext(FlightsContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = hotels.slice(indexOfFirstItem, indexOfLastItem);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortByValue, setSortByValue] = useState("Our Top Picks");

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const searchedResults = hotels.length;
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    setDropdownOpen(false);
    setSortByValue(option);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterApply = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <section className="w-full flex flex-row justify-center mt-4">
      <div className="w-full max-w-[954px] mt-32 flex flex-row">
        <p className="text-[#525B31] absolute">
          <span className="text-[#D2B57A]">Home</span> &gt;{" "}
          <span className="text-[#D2B57A]">{toQuery}</span> &gt; search results{" "}
        </p>

        {/* Filter Section */}
        <div className="relative">
          <div className="hidden md:block w-auto md:w-72 h-auto md:h-[2993px] border border-[#525B31] rounded-lg mt-8">
            <Filter />
          </div>
          <div className="md:hidden">
            <button
              onClick={togglePopup}
              className="fixed bottom-4 right-4 bg-custom-gold text-white px-4 py-2 rounded-lg"
            >
              Open Filters
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white w-11/12 max-w-lg h-[90%] overflow-y-auto rounded-lg p-4">
              <div className="w-full h-12 flex justify-between items-center border-b border-[#525B31]">
                <p className="text-lg font-bold text-[#525B31]">Filter by</p>
                <button onClick={togglePopup} className="text-lg font-bold">
                  X
                </button>
              </div>

              <Filter />
              <div className="flex flex-row justify-between">
                <button
                  className="border-[2px] border-black rounded-md p-5 mt-2"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  Cancel
                </button>
                <button
                  className="bg-custom-gold rounded-md p-5 text-white mt-2"
                  onClick={(event) => handleFilterApply(event)}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Components Section */}
        <div className="w-[680px] h-[2993px] mt-8 pl-5 flex flex-col">
          {toQuery ? (
            <p className="text-xl text-custom-green mb-3">
              {searchQuery} - {toQuery}: {searchedResults} results found{" "}
            </p>
          ) : (
            <p className="text-xl text-custom-green mb-3">
              Showing all {searchedResults} results
              found{" "}
            </p>
          )}
          <div
            className="flex flex-row justify-center items-center w-96 h-16 rounded-[40px] shadow-result mt-2 mb-5"
            onClick={() => toggleDropdown()}
          >
            <img src={sort} />
            <p className="font-medium text-2xl text-custom-green w-72 flex justify-center">
              Sort By: {sortByValue}
            </p>
            <img src={arrows} />
            {dropdownOpen && (
              <div className="absolute z-10 mt-56 w-96 bg-white rounded-lg shadow-lg">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick("Option 1")}
                  >
                    Option 1
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick("Option 2")}
                  >
                    Option 2
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick("Option 3")}
                  >
                    Option 3
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex-grow overflow-auto">
            <Hotel hotelData={currentItems} />
          </div>
          {toQuery ? (
            <p className="text-xl text-custom-green mb-3">
              {searchQuery} - {toQuery}: {searchedResults} results found{" "}
            </p>
          ) : (
            <p className="text-xl text-custom-green mb-3">
              Showing all {searchedResults} results
              found{" "}
            </p>
          )}

          {/* Pagination controls */}
          <div className="flex justify-between mt-4 mb-5 border border-[#B5B2B2]">
            <div className="flex justify-between">
              <button
                onClick={() =>
                  handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                }
                disabled={currentPage === 1}
                className="px-3 py-1 disabled:opacity-50 text-black"
              >
                &lt;
              </button>

              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                className={`mx-1 px-3 text-xl py-1 ${
                  currentPage === 1 ? "text-custom-gold" : "text-custom-green"
                }`}
              >
                1
              </button>

              {/* Pages 2-4 when on early pages */}
              {currentPage <= 4 && totalPages > 4 && (
                <>
                  {Array.from({ length: 3 }, (_, index) => index + 2).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`mx-1 px-3 py-1 text-xl ${
                          currentPage === page
                            ? "text-custom-gold"
                            : "text-custom-green"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  {totalPages > 4 && <span className="mx-1">...</span>}
                </>
              )}

              {currentPage > 4 && currentPage < totalPages - 3 && (
                <>
                  <span className="mx-1">...</span>
                  <button
                    onClick={() => handlePageChange(currentPage)}
                    className={`mx-1 px-3 py-1 text-xl ${
                      currentPage === currentPage
                        ? "text-custom-gold"
                        : "text-custom-green"
                    }`}
                  >
                    {currentPage}
                  </button>
                  <span className="mx-1">...</span>
                </>
              )}

              {currentPage >= totalPages - 3 && totalPages > 4 && (
                <>
                  {Array.from(
                    { length: 3 },
                    (_, index) => totalPages - 3 + index
                  ).map(
                    (page) =>
                      page < totalPages && (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`mx-1 px-3 py-1 text-xl ${
                            currentPage === page
                              ? "text-custom-gold"
                              : "text-custom-green"
                          }`}
                        >
                          {page}
                        </button>
                      )
                  )}
                </>
              )}

              {totalPages > 1 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`mx-1 px-3 py-1 text-xl ${
                    currentPage === totalPages
                      ? "text-custom-gold"
                      : "text-custom-green"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() =>
                  handlePageChange(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
            <div className="hidden md:flex text-custom-gold h-full justify-center items-center mr-5">
              <p>showing (1-{totalPages})</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;

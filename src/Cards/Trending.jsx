import React, { useState } from "react";

const Trending = () => {
  const [activeLink, setActiveLink] = useState("destination");

  const handleLinkClick = (link, event) => {
    event.preventDefault();
    setActiveLink(link);
  };

  const renderContent = () => {
    switch (activeLink) {
      case "destination":
        return <div>Content for Fall Destinations goes here.</div>;
      case "visit":
        return <div>Content for Places to visit by month goes here.</div>;
      case "choice":
        return <div>Content for Travelers' choice goes here.</div>;
      default:
        return null;
    }
  };
  return (
    <div>
      <div className="flex flex-row w-full mt-5 font-semibold">
        <ul className="flex flex-row justify-between w-full">
          <li
            className={`group flex relative cursor-pointer transition-all duration-200 rounded-[5px]`}
            onClick={() => handleLinkClick("destination", event)}
          >
            <a href="" className="relative z-10 font-p">
              Fall Destinations
              <span
                className={`absolute left-0 right-0 h-[2px] mt-6 bg-black transition-all duration-200 w-0 group-hover:w-full ${
                  activeLink === "destination" ? "w-full" : "w-0"
                }`}
              ></span>
            </a>
          </li>
          <li
            className={`group flex relative cursor-pointer transition-all duration-200 rounded-[5px]`}
            onClick={() => handleLinkClick("visit", event)}
          >
            <a href="" className="relative z-10 font-p">
              Places to visit by month
              <span
                className={`absolute left-0 right-0 h-[2px] mt-6 bg-black transition-all duration-200 w-0 group-hover:w-full ${
                  activeLink === "visit" ? "w-full" : "w-0"
                }`}
              ></span>
            </a>
          </li>
          <li
            className={`group flex relative cursor-pointer transition-all duration-200 rounded-[5px]`}
            onClick={() => handleLinkClick("choice", event)}
          >
            <a href="" className="relative z-10 font-p">
              Travelers' choice
              <span
                className={`absolute left-0 right-0 h-[2px] mt-6 bg-black transition-all duration-200 w-0 group-hover:w-full ${
                  activeLink === "choice" ? "w-full" : "w-0"
                }`}
              ></span>
            </a>
          </li>
        </ul>
      </div>
      {/* Content area */}
      <div className="mt-5">{renderContent()}</div>
    </div>
  );
};

export default Trending;

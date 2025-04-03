import places from "../utils/Places/Places.jsx";
import { useRef } from "react";

const TopAccomodation = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };
  return (
    <div className="relative flex items-center justify-between">
      <button
        className="absolute left-0 z-10 p-2 bg-white rounded-full w-10 h-10 ml-2"
        onClick={scrollLeft}
      >
        &lt;
      </button>

      <div
        ref={scrollRef}
        className={`flex overflow-x-auto min-w-full scroll-smooth w-full snap-x snap-mandatory hide-scrollbar relative`}
      >
        {places.map((place, index) => (
          <div
            key={index}
            className="flex-none w-56 h-56 m-2 snap-start shadow-md"
          >
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-3/4 object-cover"
            />
            <p className="w-full flex justify-center font-bold h-12 items-center">
              {place.name}
            </p>
          </div>
        ))}
      </div>

      <button
        className="absolute mr-3 right-0 z-10 p-2 bg-white rounded-full w-10 h-10"
        onClick={scrollRight}
      >
        &gt;
      </button>
    </div>
  );
};

export default TopAccomodation;

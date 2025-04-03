import bar from "../utils/Bar/Bar.jsx"
import { useRef } from "react";

const Bar = () => {
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
        className="absolute left-0 z-10 p-2 bg-white rounded-full w-10 h-10"
        onClick={scrollLeft}
      >
        &lt;
      </button>

      <div
        ref={scrollRef}
        className={`flex overflow-x-auto min-w-full scroll-smooth w-full snap-x snap-mandatory hide-scrollbar relative`}
      >
        {bar.map((place, index) => (
          <div
            key={index}
            className="flex-none w-[308px] h-52 my-2 mx-2 snap-start shadow-md bg-cover bg-center flex flex-col justify-end" 
            style={{ backgroundImage: `url(${place.image})` }}
          >
            <p className="w-full items-center bg-opacity-75 my-5 mx-2 text-white text-xl font-bold">
              {place.name}
            </p>
          </div>
        ))}
      </div>

      <button
        className="absolute right-0 z-10 p-2 bg-white rounded-full w-10 h-10"
        onClick={scrollRight}
      >
        &gt;
      </button>
    </div>
  );
};

export default Bar;

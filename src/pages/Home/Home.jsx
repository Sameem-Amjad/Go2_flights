import React, { useContext, useEffect, useState } from "react";
import home from "../../assets/svg/home.svg";
import "./Home.css";
import offersImg from "../../assets/svg/offersImg.svg";
import fr from "../../assets/svg/fr.svg";
import it from "../../assets/png/it.png";
import uae from "../../assets/png/uae.png";
import sa from "../../assets/png/sa.png";
import mal from "../../assets/png/mal.png";
import TopAccomodation from "../../Cards/TopAccomodation.jsx";
import TopActivities from "../../Cards/TopActivities.jsx";
import Bar from "../../Cards/Bar.jsx";
import Shopping from "../../Cards/Shopping.jsx";
import Trending from "../../Cards/Trending.jsx";
import { FlightsContext } from "../../Context/FlightsContext.jsx";

const Home = () => {
  const [activeLink, setActiveLink] = useState("destination");
  const {setSelectedDates} = useContext(FlightsContext);
  const {setGuest} = useContext(FlightsContext);
  const {setSelectedHotel} = useContext(FlightsContext)
  const {setSearchQuery} = useContext(FlightsContext)
  useEffect(()=> {
    setSelectedDates(null);
    setGuest(null);
    setSelectedHotel(null);
    setSearchQuery(null);
  }, [])

  return (
    <section className="w-full flex justify-center font-montserrat">
      <div className="w-full max-w-[954px] mt-56 px-4 md:px-0">
        {/* Header Section */}
        <section
          style={{ backgroundImage: `url(${home})` }}
          className="w-full h-[424px] bg-cover bg-center relative"
        >
          <div className="w-80 pt-10 ml-8 md:ml-32">
            <p className="text-white text-4xl md:text-5xl font-extrabold">
              Plan a trip <br />
              in minutes
            </p>
            <p className="mt-8 text-white text-sm md:text-base">
              Lorem ipsum dolor sit amet consect etur. Tellus et nulla eget
              aliquet ele mentum turpis.
            </p>
            <button className="mt-12 h-10 w-36 bg-white rounded-lg">
              Explore
            </button>
          </div>
        </section>

        {/* Offers Section */}
        <section className="flex flex-col md:flex-row bg-custom-gradient mt-16 rounded px-4 md:px-0">
          <div className="w-full md:w-[693px] ml-5 mx-4 mt-5 overflow-auto">
            <p className="font-bold text-[#525B31]">Special offers await you</p>
            <p className="text-xs mt-2">
              Lorem ipsum dolor sit amet consectetur. Habitasse vivamus id sed
              venenatis sit tincidunt tincidunt sollicitudin sagittis. Aliquam
              et consectetur id sit condimentum enim pellentesque a. At eros
              nisi ut congue in rutrum. Facilisi faucibus nulla auctor facilisi
              vestibulum. Proin penatibus gravida maecenas in luctus. Urna
              sollicitudin ipsum risus rtor pulvinar ac eros posuere a euismod
              morbi. Leo mollis lectus faucibus sit elit mauris volutpat
              elementum neque. Ultricies sit vel aliquet lacus. Viverra risus
              consequat quisque quis tortor mauris praesent. Mauris feugiat est
              diam sectetur enim diam fames et viverra.
            </p>
            <button className="w-40 h-10 bg-black text-white opacity-100 mt-3 mb-2 rounded text-xl font-semibold">
              Find Offers
            </button>
          </div>
          <img
            src={offersImg}
            className="w-52 h-52 ml-6 hidden md:block"
            alt="Offers"
          />
        </section>

        {/* Accommodation Section */}
        <section>
          <p className="text-2xl font-extrabold mt-16 mb-4">
            Top Accommodation Places
          </p>
          <TopAccomodation />
        </section>

        {/* Top Activities */}
        <section>
          <p className="text-2xl font-extrabold mt-16">
            Top Activities To Do By Category
          </p>
          <p className="mb-4">Special offers for you</p>
          <TopActivities />
        </section>

        {/* Top Bars */}
        <section>
          <p className="text-2xl font-extrabold mt-16">Top Bar in Captown</p>
          <p className="mb-4">Big offer awaits</p>
          <Bar />
        </section>

        {/* Shopping Centers */}
        <section>
          <p className="text-2xl font-extrabold mt-16 mb-8">Shopping Centers</p>
          <Shopping />
        </section>

        {/* Traveling Destination Section */}
        <section className="w-full mt-16">
          <p className="font-extrabold text-2xl">Trending Destinations</p>
          <p className="font-semibold">
            Most popular destinations for visitors from Pakistan
          </p>
          <div className="flex flex-col md:flex-row md:justify-between mt-8 space-y-8 md:space-y-0">
            <div className="md:w-[467px] h-64 overflow-hidden">
              <img src={fr} className="h-full w-full object-cover" />
            </div>
            <div className="md:w-[467px] h-64 overflow-hidden">
              <img src={it} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between mt-8 space-y-8 md:space-y-0">
            <div className="w-full md:w-72 h-[300px] overflow-hidden">
              <img src={uae} className="h-full w-full object-cover" />
            </div>
            <div className="w-full md:w-60 h-[300px] overflow-hidden">
              <img src={sa} className="h-full w-full object-cover" />
            </div>
            <div className="w-full md:w-[300px] h-[300px] overflow-hidden">
              <img src={mal} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* Trending in Travel */}
        <section>
          <p className="text-2xl font-bold mt-24">Trending in Travel</p>
          <Trending />
        </section>
      </div>
    </section>
  );
};

export default Home;

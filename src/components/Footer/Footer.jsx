import React from "react";
import logopng from "../../assets/svg/logopng.svg";
import fb from "../../assets/svg/fb.svg";
import insta from "../../assets/svg/insta.svg";
import x from "../../assets/svg/x.svg";
import pinterest from "../../assets/svg/pinterest.svg";

const Footer = () => {
  const location = window.location.pathname;
  return (
    <footer className="flex flex-col items-center mt-8 w-full pt-16 pb-10 bg-slate-400 bg-[linear-gradient(to_right,_#525B31_0%,_#BED206_50%,_#525B31_100%)]">
      {location === "/checkout" || location === "/payment" ? (
        <></>
      ) : (
        <div className="w-full md:w-[954px] mt-16 flex flex-wrap justify-center font-montserrat h-auto text-xl">
          <div className="w-full md:w-[317px] block p-4">
            <p>About Barfly</p>
            <ul>
              <li className="before:content-['•'] before:text-lg before:mr-2 mt-4">
                <a href="" className="hover:underline">
                  About Us
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Press
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Resources and Policies
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Careers
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Investor Relations
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Trust & Safety
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Contact us
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Accessibility Statement
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-[287px] block p-4">
            <p>Explore</p>
            <ul>
              <li className="before:content-['•'] before:text-lg before:mr-2 mt-4">
                <a href="" className="hover:underline">
                  Write a Review
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Add a Place
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Join
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Travelers' Choice
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  GreenLeaders
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Blog
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Barfly Plus
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Travel Articles
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-[347px] block p-4">
            <p>Do business with us</p>
            <ul>
              <li className="before:content-['•'] before:text-lg before:mr-2 mt-4">
                <a href="" className="hover:underline">
                  Owners
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Business Advantage
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Sponsored Placement
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Advertise with Us
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Access our Content API
                </a>
              </li>
              <li className="before:content-['•'] before:text-lg before:mr-2">
                <a href="" className="hover:underline">
                  Become an Affiliate
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="w-full mt-10 justify-center flex flex-wrap">
          <div className="flex flex-row w-56 md:ml-[-220px] justify-center md:justify-start ml-3">
            <img src={logopng} width={50} height={38} />
            <p className="font-bold pt-2 ml-6 text-xl">Barfly.com</p>
          </div>
          <div className="w-full md:w-[464px]">
            <section className="flex flex-row text-xl justify-center md:justify-start">
              <p className="font-bold mr-1">© 2023 Barfly</p>
              <p>All rights reserved.</p>
            </section>
            <section>
              <ul className="font-bold flex md:flex-row text-xl flex-col">
                <li className="mr-4 relative mt-2 md:mt-0">
                  <a href="">Terms of Use</a>
                  <span className="absolute left-0 bottom-0 w-32 md:w-full h-[1px] bg-black"></span>
                </li>
                <li className="mr-4 relative mt-2 md:mt-0">
                  <a href="">Privacy and Cookies</a>
                  <span className="absolute left-0 bottom-0 w-52 md:w-full h-[1px] bg-black"></span>
                </li>
                <li className="relative mt-2 md:mt-0">
                  <a href="">Site Map</a>
                  <span className="absolute left-0 bottom-0 w-[88px] md:w-full h-[1px] bg-black"></span>
                </li>
              </ul>
            </section>
          </div>
        </div>
        <div className="w-full flex flex-row justify-center mt-7">
          <section className="flex flex-row w-72 justify-between">
            <a href="">
              <img src={fb} />
            </a>
            <a href="">
              <img src={insta} />
            </a>
            <a href="">
              <img src={x} />
            </a>
            <a href="">
              <img src={pinterest} />
            </a>
          </section>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

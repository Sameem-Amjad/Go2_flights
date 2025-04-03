// import React, { useState, useContext, useEffect } from "react";
// import guests from "../../assets/svg/guest.svg";
// import cancelation from "../../assets/svg/cancelation.svg";
// import iota from "../../assets/svg/iota.svg";
// import { useLocation, useNavigate } from "react-router-dom";
// import star from "../../assets/svg/star.svg";
// import leafFilled from "../../assets/svg/leafFilled.svg";
// import leaf from "../../assets/svg/leaf.svg";
// import lens from "../../assets/svg/lens.svg";
// import schedule from "../../assets/svg/Schedule.svg";
// import info from "../../assets/svg/info.svg";
// import jood from "../../assets/svg/jood.svg";
// import { FlightsContext } from "../../Context/FlightsContext";

// const Payment = () => {
//   const navigate = useNavigate();
//   const { selectedHotel } = useContext(FlightsContext)
//   console.log(selectedHotel);
//   const { guest } = useContext(FlightsContext);
//   const { selectedDates } = useContext(FlightsContext);
//   const [checkInDate, setCheckInDate] = useState(
//     selectedDates ? selectedDates[0] : null
//   );
//   const [checkOutDate, setCheckOutDate] = useState(
//     selectedDates ? selectedDates[1] : null
//   );
//   const signedInUserDetails = {
//     email: "babar_azam@gmail.com",
//     pfp: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//   };
//   const [isOn, setIsOn] = useState(false);
//   const [selected, setSelected] = useState("");
//   const [request, setRequest] = useState("");
//   const [searchFilter, setSearchFilter] = useState({
//     adults: guest ? guest.adults : 1,
//     children: guest ? guest.children : 0,
//     rooms: guest ? guest.rooms : 1,
//   });
//   const [nights, setNights] = useState(0);
// console.log(selectedHotel);

//   const toggleSwitch = () => {
//     setIsOn(!isOn);
//   };

//   const handleNavigation = () => {
//     navigate("/checkout");
//   };

//   useEffect(() => {
//     if (checkInDate && checkOutDate) {
//       const nightsCount = Math.ceil(
//         (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
//       );
//       setNights(nightsCount);
//     }
//   }, [checkInDate, checkOutDate]);

//   useEffect(() => {
//     if (guest) {
//       setSearchFilter({
//         adults: guest.adults,
//         children: guest.children,
//         rooms: guest.rooms,
//       });
//     }
//   }, [guest]);

//   return (
//     <div className="flex justify-center">
//       <section className="w-[954px]">
//         <section className="w-full h-11 flex flex-row justify-between px-6 items-center mt-3">
//           <div className="flex justify-center items-center bg-custom-gold w-11 h-11 rounded-full text-white font-bold text-2xl flex-shrink-0">
//             1
//           </div>
//           <span className="w-[40%] h-[1px] bg-custom-green"></span>
//           <div className="flex justify-center items-center bg-custom-gold w-11 h-11 rounded-full text-white font-bold text-2xl flex-shrink-0">
//             2
//           </div>
//           <span className="w-[40%] h-[1px] bg-custom-green"></span>
//           <div className="flex justify-center items-center border w-11 h-11 rounded-full border-[#798192] font-bold text-2xl flex-shrink-0">
//             3
//           </div>
//         </section>
//         <section className="w-full flex flex-row justify-between">
//           <div className="font-medium text-custom-green">Your selection</div>
//           <div className="ml-[-20px] font-medium text-custom-green">
//             Your Details
//           </div>
//           <div className="font-medium text-custom-green">Final step</div>
//         </section>
//         <span className="w-full h-[1px] bg-[#4F5831] block mt-5"></span>

//         {/* Content Section */}
//         <section className="w-full flex flex-col md:flex-row justify-between">
//           <section className="w-full md:w-[350px] mt-6">
//             <div className="w-full border border-[#4F5831] rounded-md pl-4 flex flex-col">
//               <div className="w-full flex mt-2">
//                 <div className="w-20 flex border-r border-r-[#4F5831]">
//                   {Array(selectedHotel.rating)
//                     .fill(0)
//                     .map((_, index) => (
//                       <img src={star} alt="rating" className="w-3 h-3 mr-0.5" />
//                     ))}
//                 </div>
//                 <div className="flex items-center ml-2.5">
//                   {Array(selectedHotel.level)
//                     .fill(0)
//                     .map((_, index) => (
//                       <img
//                         src={leafFilled}
//                         alt="sustainability level"
//                         className="w-4 h-4"
//                       />
//                     ))}
//                   {Array(3 - selectedHotel.level)
//                     .fill(0)
//                     .map((_, index) => (
//                       <img
//                         src={leaf}
//                         alt="sustainability level"
//                         className="w-4 h-4"
//                       />
//                     ))}
//                   <p className="text-[10px] text-custom-gold ml-2.5">
//                     Travel sustainable level {selectedHotel.level}
//                   </p>
//                 </div>
//               </div>
//               <div className="w-full flex justify-between">
//                 <p className="font-bold text-custom-green mt-4">
//                   {selectedHotel.name}
//                 </p>
//                 <div className="flex flex-row justify-end text-[7px] text-custom-green font-semibold mt-4 pr-3">
//                   <div>
//                     {selectedHotel.reviews > 9 ? (
//                       <>
//                         <p>Wonderful</p>
//                       </>
//                     ) : (
//                       <>
//                         {selectedHotel.reviews > 8 ? (
//                           <>
//                             <p>Excellent</p>
//                           </>
//                         ) : (
//                           <>Good</>
//                         )}
//                       </>
//                     )}
//                     <p className="text-[7px] text-custom-green font-medium mr-1">
//                       1432 reviews
//                     </p>
//                   </div>
//                   <div className="flex justify-center items-center w-7 h-6 text-white rounded-sm bg-custom-gold font-bold text-base">
//                     <p>{selectedHotel.reviews}</p>
//                   </div>
//                 </div>
//               </div>
//               <p className="mt-[-8px]">
//                 <a
//                   href={selectedHotel.mapsLink}
//                   target="_blank"
//                   className="text-[10px] text-custom-green underline"
//                 >
//                   {selectedHotel.location}
//                 </a>
//               </p>
//               <div className="flex flex-col">
//                 <div className="flex flex-row w-full justify-between pr-3">
//                   <p>Item 1</p>
//                   <p>Item 2</p>
//                 </div>
//                 <div className="flex flex-row w-full justify-between pr-3 py-1">
//                   <p>Item 3</p>
//                   <p>Item 4</p>
//                 </div>
//                 <div className="flex flex-row w-full justify-between pr-3">
//                   <p>Item 5</p>
//                   <p>Item 6</p>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full border border-[#4F5831] rounded-md pl-4 pt-2 flex flex-col my-6">
//               <p className="text-custom-green text-xl font-bold">
//                 Your booking details
//               </p>
//               <div className="flex mt-1">
//                 <div>
//                   <img src={lens} />
//                 </div>
//                 <div className="flex flex-col ml-3">
//                   <p className="text-custom-green text-[10px] font-semibold">
//                     Destination / propert name
//                   </p>
//                   <p className="text-custom-green text-[10px] font-medium my-4">
//                     {selectedHotel.location}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex mt-1">
//                 <div>
//                   <img src={schedule} alt="Schedule icon" />
//                 </div>
//                 <div className="flex flex-col ml-3">
//                   <p className="text-custom-green text-[10px] font-semibold">
//                     Check-in date
//                   </p>
//                   <p className="text-custom-green text-[10px] font-medium my-4">
//                     {checkInDate
//                       ? checkInDate.toLocaleDateString("en-US", {
//                           weekday: "long",
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })
//                       : "Not selected"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex mt-1">
//                 <div>
//                   <img src={schedule} alt="Schedule icon" />
//                 </div>
//                 <div className="flex flex-col ml-3">
//                   <p className="text-custom-green text-[10px] font-semibold">
//                     Check-out date
//                   </p>
//                   <p className="text-custom-green text-[10px] font-medium my-4">
//                     {checkOutDate
//                       ? checkOutDate.toLocaleDateString("en-US", {
//                           weekday: "long",
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })
//                       : "Not selected"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex mt-1">
//                 <div>
//                   <img src={guests} width={20} height={20} />
//                 </div>
//                 <div className="flex flex-col ml-3">
//                   <p className="text-custom-green text-[10px] font-semibold">
//                     Total guests
//                   </p>
//                   <p className="text-custom-green text-[10px] font-medium my-4">
//                     {searchFilter.adults} adults | {searchFilter.children}{" "}
//                     children | {searchFilter.rooms} rooms
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full border border-[#4F5831] rounded-md pl-4 pt-4 flex">
//               <div className="w-[50%] text-[10px]">
//                 {nights} Nights, {searchFilter.adults} adult{" "}
//                 {searchFilter.children > 0 ? (
//                   <>| {searchFilter.children} childern</>
//                 ) : (
//                   <></>
//                 )}{" "}
//                 {searchFilter.rooms > 0 ? (
//                   <>| {searchFilter.rooms} rooms</>
//                 ) : (
//                   <></>
//                 )}
//               </div>
//               <div className="w-[50%] pr-4 mb-5">
//                 <div className="w-full flex flex-row justify-end">
//                   <p className="font-bold mr-1 text-custom-green">
//                     Rs {selectedHotel.costPerNight * nights}
//                   </p>
//                   <img src={info} />
//                 </div>
//                 <div className="w-full flex flex-row justify-end">
//                   <p className="text-custom-green text-[7px]">
//                     +{selectedHotel.tax * nights} taxes & charges
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* User Details Section */}
//           <section className="w-full md:w-[60%] mt-6">
//             {signedInUserDetails &&
//             Object.keys(signedInUserDetails).length > 0 ? (
//               <>
//                 <div className="w-full h-24 items-center flex border border-[#4F5831] rounded-md pl-4">
//                   <div className="w-20 h-20 rounded-full flex bg-custom-gold justify-center items-center font-bold text-2xl text-white">
//                     {signedInUserDetails.pfp ? (
//                       <>
//                         <div className="w-20 h-20 rounded-full flex bg-custom-gold justify-center items-center">
//                           <img
//                             src={signedInUserDetails.pfp}
//                             className="w-full h-full object-cover rounded-full"
//                           />
//                         </div>
//                       </>
//                     ) : (
//                       <>{signedInUserDetails.email[0]}</>
//                     )}
//                   </div>
//                   <div className="ml-4">
//                     <p className="font-bold text-custom-green">
//                       you are signed in
//                     </p>
//                     <p className="font-light text-custom-green">
//                       {signedInUserDetails.email}
//                     </p>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="w-full h-24 justify-center flex border flex-col border-[#4F5831] rounded-md pl-4">
//                   <p className="font-bold text-custom-green">
//                     Sign in to continue
//                   </p>
//                   <button className="w-24 h-8 flex justify-center items-center bg-custom-gold rounded-md text-white">
//                     Sign in
//                   </button>
//                 </div>
//               </>
//             )}
//             <section className="w-full mt-6 flex border border-[#4F5831] rounded-md pl-4 flx- flex-col">
//               <p className="mt-3 font-bold text-custom-green">
//                 Enter your details
//               </p>
//               <div className="flex flex-row w-full justify-between mt-4">
//                 <p className="font-light text-custom-green">
//                   I am travelling for work
//                 </p>
//                 <div className="flex items-center mr-4">
//                   <label className="inline-flex items-center cursor-pointer">
//                     <span className="relative">
//                       <input
//                         type="checkbox"
//                         className="sr-only"
//                         checked={isOn}
//                         onChange={toggleSwitch}
//                       />
//                       <div
//                         className={`block w-12 h-6 rounded-full ${
//                           isOn ? "bg-custom-green" : "bg-gray-300"
//                         }`}
//                       ></div>
//                       <div
//                         className={`absolute  left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
//                           isOn
//                             ? "transform translate-x-6 bg-custom-gold"
//                             : "bg-white"
//                         }`}
//                       ></div>
//                     </span>
//                   </label>
//                 </div>
//               </div>
//               <div className="w-80">
//                 <div className="flex w-full justify-between mt-5">
//                   <fieldset className="border border-custom-gold rounded-md w-36 h-12">
//                     <legend className="text-[8px] font-semibold text-custom-green ml-2 px-2 z-20">
//                       First Name
//                     </legend>
//                     <input
//                       type="text"
//                       className="bg-transparent outline-none rounded p-2 w-36 mt-[-6px] z-0 object-cover border-0"
//                       placeholder="Enter first name"
//                     />
//                   </fieldset>
//                   <fieldset className="border border-custom-gold rounded-md w-36 h-12">
//                     <legend className="text-[8px] font-semibold text-custom-green ml-2 px-2 z-20">
//                       Last Name
//                     </legend>
//                     <input
//                       type="text"
//                       className="bg-transparent outline-none rounded p-2 w-36 mt-[-6px] z-0 object-cover border-0"
//                       placeholder="Enter last name"
//                     />
//                   </fieldset>
//                 </div>
//                 <fieldset className="border border-custom-gold rounded-md w-80 h-12 mt-6">
//                   <legend className="text-[8px] font-semibold text-custom-green ml-2 px-2 z-20">
//                     Email
//                   </legend>
//                   <input
//                     type="email"
//                     className="bg-transparent outline-none rounded p-2 w-36 mt-[-6px] z-0 object-cover border-0"
//                     placeholder="Enter email"
//                   />
//                 </fieldset>
//               </div>
//               <p className="font-semibold text-custom-green mt-5">
//                 Who are you booking for?
//               </p>
//               <div className="flex flex-col py-4">
//                 <label className="flex items-center mb-4 cursor-pointer">
//                   <input
//                     type="radio"
//                     value="main"
//                     checked={selected === "main"}
//                     onChange={() => setSelected("main")}
//                     className="hidden"
//                   />
//                   <div
//                     className={`w-6 h-6 border-2 rounded-full flex items-center justify-center mr-2
//                         ${
//                           selected === "main"
//                             ? "border-custom-gold"
//                             : "border-gray-400"
//                         }
//                     `}
//                   >
//                     {selected === "main" && (
//                       <div className="w-4 h-4 bg-custom-gold rounded-full" />
//                     )}
//                   </div>
//                   <p className="font-light text-custom-green">
//                     I am the main guest
//                   </p>
//                 </label>

//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="radio"
//                     value="someoneElse"
//                     checked={selected === "someoneElse"}
//                     onChange={() => setSelected("someoneElse")}
//                     className="hidden"
//                   />
//                   <div
//                     className={`w-6 h-6 border-2 rounded-full flex items-center justify-center mr-2
//                         ${
//                           selected === "someoneElse"
//                             ? "border-custom-gold"
//                             : "border-gray-400"
//                         }
//                     `}
//                   >
//                     {selected === "someoneElse" && (
//                       <div className="w-4 h-4 bg-custom-gold rounded-full" />
//                     )}
//                   </div>
//                   <p className="font-light text-custom-green">
//                     I am booking for someone else
//                   </p>
//                 </label>
//               </div>
//             </section>

//             <section className="w-full mt-6 flex border border-[#4F5831] rounded-md pl-4 flx- flex-col">
//               <p className="mt-3 font-bold text-custom-green">
//                 Delux 3 bedroom apartment
//               </p>
//               <div className="flex flex-row mt-6 mb-3">
//                 <img src={guests} className="mr-2" />
//                 <p className="font-light text-xl text-custom-green">
//                   Guests | {searchFilter.adults} adults | {searchFilter.children} childern | {searchFilter.rooms} rooms
//                 </p>
//               </div>
//               <div className="flex">
//                 <img src={cancelation} className="mr-2" />
//                 <p className="font-light text-xl text-custom-green">
//                   Free cancelation
//                 </p>
//               </div>
//               <fieldset className="border border-custom-gold rounded-md w-64 h-12 mt-7 mb-6">
//                 <legend className="text-[8px] font-semibold text-custom-green ml-2 px-2 z-20">
//                   Full guest name
//                 </legend>
//                 <input
//                   type="text"
//                   className="bg-transparent outline-none rounded p-2 w-64 mt-[-6px] z-0 object-cover border-0"
//                   placeholder="Enter first name"
//                 />
//               </fieldset>
//             </section>

//             <section className="w-full mt-6 flex border border-[#4F5831] rounded-md pl-4 flx- flex-col">
//               <p className="mt-3 font-bold text-custom-green">
//                 Special request
//               </p>
//               <p className="text-xl font-light text-custom-green mt-6">
//                 Type your request here
//               </p>
//               <div className="flex flex-row mt-6 mb-3 items-center">
//                 <img src={iota} className="mr-2" />
//                 <p className="font-semibold text-[10px] text-custom-green">
//                   We do not guarantee to complete the special request!
//                 </p>
//               </div>
//               <textarea
//                 placeholder="Start typing here"
//                 className="px-4 py-2 mr-4 h-24 resize-none text-custom-green border border-[#798192]"
//                 value={request}
//                 maxLength={500}
//                 onChange={(text) => setRequest(text.target.value)}
//               />
//               <div className="mb-6 flex justify-end mr-4 mt-1 text-[#798192] font-semibold text-[10px]">
//                 {request.length}/500
//               </div>
//             </section>
//             <section className="w-full h-4 mt-10 flex justify-end">
//               <button
//                 className="w-24 h-7 bg-custom-gold text-white font-semibold text-[10px] flex justify-center items-center rounded-sm"
//                 onClick={() => handleNavigation()}
//               >
//                 Final details &gt;
//               </button>
//             </section>
//           </section>
//         </section>
//       </section>
//     </div>
//   );
// };

// export default Payment;

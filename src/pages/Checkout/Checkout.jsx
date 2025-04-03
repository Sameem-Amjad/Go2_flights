// import React, { useState, useContext, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import star from "../../assets/svg/star.svg";
// import leafFilled from "../../assets/svg/leafFilled.svg";
// import leaf from "../../assets/svg/leaf.svg";
// import lens from "../../assets/svg/lens.svg";
// import schedule from "../../assets/svg/Schedule.svg";
// import info from "../../assets/svg/info.svg";
// import guests from "../../assets/svg/guest.svg";
// import card from "../../assets/svg/card.svg";
// import gpay from "../../assets/svg/gpay.svg";
// //import StripeForm from "../../components/StripeForm/StripeForm";
// import visa from "../../assets/svg/visa.svg";
// import master from "../../assets/svg/master.svg";
// import amex from "../../assets/svg/amex.svg";
// import lock from "../../assets/svg/lock.svg";
// import jood from "../../assets/svg/jood.svg";
// import { FlightsContext } from "../../Context/FlightsContext";
// import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// const Checkout = () => {
//   const { selectedDates } = useContext(FlightsContext);
//   const { selectedHotel } = useContext(FlightsContext);
//   const [checkInDate, setCheckInDate] = useState(
//     selectedDates ? selectedDates[0] : null
//   );
//   const {guest} = useContext(FlightsContext)
//   const [checkOutDate, setCheckOutDate] = useState(
//     selectedDates ? selectedDates[1] : null
//   );
//   const signedInUserDetails = {
//     email: "babar_azam@gmail.com",
//     pfp: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//   };
//   const [isOn, setIsOn] = useState(false);
//   const [selected, setSelected] = useState("");
//   const [paymentMethodSelected, setPaymentMethodSelected] = useState("");
//   const [request, setRequest] = useState("");
//   const [searchFilter, setSearchFilter] = useState({
//     adults: guest ? guest.adults : 1,
//     children: guest ? guest.children : 0,
//     rooms: guest ? guest.rooms : 1,
//   });
//   const [nights, setNights] = useState(0);

//   const toggleSwitch = () => {
//     setIsOn(!isOn);
//   };

//   const handleCompletion = () => {
//     toast.success("Booking Successful")
//   }

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
//           <div className="flex justify-center items-center bg-custom-gold w-11 h-11 rounded-full text-white font-bold text-2xl flex-shrink-0">
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
//                     ?.fill(0)
//                     ?.map((_, index) => (
//                       <img src={star} alt="rating" className="w-3 h-3 mr-0.5" />
//                     ))}
//                 </div>
//                 <div className="flex items-center ml-2.5">
//                   {Array(selectedHotel.level)
//                     ?.fill(0)
//                     ?.map((_, index) => (
//                       <img
//                         src={leafFilled}
//                         alt="sustainability level"
//                         className="w-4 h-4"
//                       />
//                     ))}
//                   {Array(3 - selectedHotel.level)
//                     ?.fill(0)
//                     ?.map((_, index) => (
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
//                     childern | {searchFilter.rooms} rooms
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full border border-[#4F5831] rounded-md pl-4 pt-4 flex">
//               <div className="w-[50%] text-[10px]">
//                 {nights} Nights, {searchFilter.adult} adult{" "}
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
//             <div className="w-full border border-[#4F5831] rounded-md px-4 pt-3 flex flex-col">
//               <p className="text-custom-green font-bold">
//                 When do you want to pay?
//               </p>
//               <div className="flex flex-col py-4">
//                 {/* Radio Buttons */}
//                 <label className="flex mb-4 cursor-pointer">
//                   <input
//                     type="radio"
//                     value="payAtDestination"
//                     checked={selected === "payAtDestination"}
//                     onChange={() => setSelected("payAtDestination")}
//                     className="hidden"
//                   />
//                   <div
//                     className={`w-6 h-6 border-2 rounded-full flex items-center justify-center mr-2 shrink-0
//                         ${
//                           selected === "payAtDestination"
//                             ? "border-custom-gold"
//                             : "border-gray-400"
//                         }
//                     `}
//                   >
//                     {selected === "payAtDestination" && (
//                       <div className="w-4 h-4 bg-custom-gold rounded-full" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-custom-green">
//                       Pay at the destination
//                     </p>
//                     <p className="font-light text-[10px] mt-3 text-custom-green">
//                       Your card won't be charged – we only need your card
//                       details to guarantee your booking.
//                     </p>
//                   </div>
//                 </label>
//                 <label className="flex mb-4 cursor-pointer">
//                   <input
//                     type="radio"
//                     value="payTenDays"
//                     checked={selected === "payTenDays"}
//                     onChange={() => setSelected("payTenDays")}
//                     className="hidden"
//                   />
//                   <div
//                     className={`w-6 h-6 border-2 rounded-full flex items-center justify-center mr-2 shrink-0
//                         ${
//                           selected === "payTenDays"
//                             ? "border-custom-gold"
//                             : "border-gray-400"
//                         }
//                     `}
//                   >
//                     {selected === "payTenDays" && (
//                       <div className="w-4 h-4 bg-custom-gold rounded-full" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-custom-green">
//                       Pay 10 days ahead of arival
//                     </p>
//                     <p className="font-light text-[10px] mt-3 text-custom-green">
//                       Booking.com will facilitate your payment. We’ll
//                       automatically charge your selected card on Selected date.
//                     </p>
//                   </div>
//                 </label>
//                 <label className="flex cursor-pointer">
//                   <input
//                     type="radio"
//                     value="payNow"
//                     checked={selected === "payNow"}
//                     onChange={() => setSelected("payNow")}
//                     className="hidden"
//                   />
//                   <div
//                     className={`w-6 h-6 border-2 rounded-full flex items-center justify-center mr-2 shrink-0
//                         ${
//                           selected === "payNow"
//                             ? "border-custom-gold"
//                             : "border-gray-400"
//                         }
//                     `}
//                   >
//                     {selected === "payNow" && (
//                       <div className="w-4 h-4 bg-custom-gold rounded-full" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-custom-green">Pay now</p>
//                     <p className="font-light text-[10px] mt-3">
//                       You'll pay with Booking.com when you complete this
//                       booking. You can cancel before ___ for a full refund.
//                     </p>
//                   </div>
//                 </label>
//               </div>
//             </div>

//             <div className="w-full border border-[#4F5831] rounded-md px-4 pt-3 flex flex-col mt-6 pb-7">
//               <p className="text-custom-green font-bold">
//                 How do you want to pay?
//               </p>
//               <section className="flex mt-6 justify-around md:justify-start">
//                 <div
//                   className={`flex flex-col justify-center items-center w-24 h-20 ${
//                     paymentMethodSelected === "card"
//                       ? "border border-custom-gold"
//                       : ""
//                   } shadow-md rounded-md mr-4`}
//                   onClick={() => setPaymentMethodSelected("card")}
//                 >
//                   <img src={card} />
//                 </div>
//                 <div
//                   className={`flex flex-col justify-center items-center w-24 h-20 ${
//                     paymentMethodSelected === "gpay"
//                       ? "border border-custom-gold"
//                       : ""
//                   } shadow-md rounded-md`}
//                   onClick={() => setPaymentMethodSelected("gpay")}
//                 >
//                   <img src={gpay} />
//                 </div>
//               </section>

//               <section className="flex flex-col">
//                 <p className="text-custom-green font-bold mt-5">New card</p>
//                 <div className="flex mt-2">
//                   <img src={visa} />
//                   <img src={master} className="mx-2.5" />
//                   <img src={amex} />
//                 </div>
//                 {/* <StripeForm /> */}
//               </section>
//             </div>
//             <div className="flex justify-end mt-10">
//               <button className="flex justify-around items-center w-44 h-8 bg-custom-gold rounded text-[10px] font-semibold text-white" onClick={handleCompletion}>
//                 <img src={lock} />
//                 Complete Booking
//                 <p>&gt;</p>
//               </button>
//             </div>
//           </section>
//         </section>
//       </section>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Checkout;

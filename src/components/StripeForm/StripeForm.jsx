// import React, { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// const CARD_ELEMENT_OPTIONS = {
//   style: {
//     base: {
//       color: "#525B31",
//       fontFamily: '"Poppins", sans-serif',
//       fontSmoothing: "antialiased",
//       fontSize: "16px",
//       "::placeholder": {
//         color: "#aab7c4",
//       },
//     },
//     invalid: {
//       color: "#fa755a",
//       iconColor: "#fa755a",
//     },
//   },
// };

// const StripeForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [nameOnCard, setNameOnCard] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsProcessing(true);

//     if (!stripe || !elements) {
//       // Stripe.js has not yet loaded.
//       return;
//     }

//     try {
//       const { error, paymentMethod } = await stripe.createPaymentMethod({
//         type: "card",
//         card: elements.getElement(CardNumberElement),
//         billing_details: {
//           name: nameOnCard,
//         },
//       });

//       if (error) {
//         console.error(error);
//         setPaymentStatus("Payment failed. Please try again.");
//       } else {
//         console.log("Payment successful:", paymentMethod);
//         setPaymentStatus("Payment successful!");
//       }
//     } catch (error) {
//       console.error(error);
//       setPaymentStatus("Payment failed. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <Elements
//       stripe={loadStripe(
//         "pk_test_51MPRAmGt8NnEuEJlX7bvU5oFycyiQ3ylTAHsFaRBIQv31hRhDAxHh6PKtZ7r5NWaglgq28olmMg8iZrK7v0SqHeQ005rqSW2k7"
//       )}
//     >
//       <form onSubmit={handleSubmit} className="flex flex-col ">
//         {/* Name on Card */}
//         <div className="mt-7">
//           <fieldset className="border border-custom-gold w-80 px-3 rounded">
//             <legend className="font-bold text-custom-gold text-[8px]">
//               Name on Card
//             </legend>
//             <input
//               id="nameOnCard"
//               type="text"
//               value={nameOnCard}
//               onChange={(e) => setNameOnCard(e.target.value)}
//               className="w-80 rounded py-2 leading-tight text-custom-gold mt-[-5px] outline-none bg-transparent"
//               placeholder="John Doe"
//               required
//             />
//           </fieldset>
//         </div>

//         {/* Card Number */}
//         <div className="mt-7">
//           <fieldset className="border border-custom-gold w-80 px-3 rounded">
//             <legend className="font-bold text-custom-gold text-[8px]">
//               Card Number
//             </legend>
//             <CardNumberElement
//               id="cardNumber"
//               options={CARD_ELEMENT_OPTIONS}
//               className="w-80 rounded py-2 leading-tight text-custom-gold mt-[-5px] outline-none"
//             />
//           </fieldset>
//         </div>

//         <div className="flex">
//           {/* Expiration Date */}
//           <div className="mt-7">
//             <fieldset className="border border-custom-gold w-32 px-3 rounded">
//               <legend className="font-bold text-custom-gold text-[8px]">
//                 Expiry Date
//               </legend>
//               <CardExpiryElement
//                 id="cardExpiry"
//                 options={CARD_ELEMENT_OPTIONS}
//                 className="w-32 rounded py-2 leading-tight text-custom-gold mt-[-5px] outline-none"
//               />
//             </fieldset>
//           </div>

//           {/* CVC */}
//           <div className="mt-7">
//             <fieldset className="border border-custom-gold ml-10 w-32 px-3 rounded">
//               <legend className="font-bold text-custom-gold text-[8px]">
//                 CVC
//               </legend>
//               <CardCvcElement
//                 id="cardCvc"
//                 options={CARD_ELEMENT_OPTIONS}
//                 className="w-32 rounded py-2 leading-tight text-custom-gold mt-[-5px] outline-none"
//               />
//             </fieldset>
//           </div>
//         </div>
//         {isProcessing && <div>Processing...</div>}
//         {!isProcessing && paymentStatus && <div>Status: {paymentStatus}</div>}
//       </form>
//       <span className="w-full h-0.5 bg-[#4F5831] mt-5"> </span>
//       <p className="text-custom-green text-[10px] font-light my-5">
//         You can unsubscribe at any time. View our{" "}
//         <a className="underline" href="">
//           privacy policy.
//         </a>
//       </p>
//       <p className="text-custom-green text-[10px] font-light">
//         Your booking is directly with Jood Hotel Apartments and by completing
//         this booking you agree to the{" "}
//         <a className="font-bold" href="">
//           booking conditions, general terms, privacy policy,{" "}
//         </a>
//         and{" "}
//         <a className="font-bold" href="">
//           Wallet terms.
//         </a>
//       </p>
//     </Elements>
//   );
// };

// export default StripeForm;

// // {/* Submit Button */}
// // {!isProcessing && (
// //     <button
// //       className="focus:shadow-outline mx-auto flex justify-center rounded-3xl bg-yellow-500 px-14 py-3 font-bold text-green-700 hover:bg-green-700 hover:text-white focus:outline-none"
// //       type="submit"
// //       disabled={isProcessing}
// //     >
// //       {isProcessing ? "Processing..." : "Pay"}
// //     </button>
// //   )}

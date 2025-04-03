import "./App.css";
import AppLayout from "./layout/Applayout.jsx";
import Home from "./pages/Home/Home.jsx";
// import Results from "./pages/Results/Results.jsx";
// import Payment from "./pages/Payment/Payment.jsx";
// import Checkout from "./pages/Checkout/Checkout.jsx";
//import StripeProvider from "./stripe/Provider/StripeProvider.jsx";
// import HotelInfo from "./pages/HotelInfo/HotelInfo.jsx";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { FlightsProvider } from "./Context/FlightsContext.jsx";
import { ToastContainer } from "react-toastify";
import FlightOffersList from "./pages/Flights/Flights.jsx";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // {
      //   path: "/results",
      //   element: <Results searchedValue={"United Arab Emirates"} />,
      // },
      // {
      //   path: "payment",
      //   element: <Payment />,
      // },
      // {
      //   path: "checkout",
      //   element: (
      //     // <StripeProvider>
      //        <Checkout />
      //     // </StripeProvider>
      //   ),
      // },
      // {
      //   path: "hotel-info",
      //   element: <HotelInfo />,
      // },
      {
        path: "flights-offers",
        element: <FlightOffersList />
      }
    ],
  },
]);

function App() {
  return (
    <>
      <FlightsProvider>
        <RouterProvider router={router} />
      </FlightsProvider>
      <ToastContainer />
    </>
  );
}

export default App;

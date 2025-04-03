import React, { useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const AppLayout = () => {
  const [loading, isLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (loading || navigation.state == "loading") {
      return <p>Loading....</p>;
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppLayout;

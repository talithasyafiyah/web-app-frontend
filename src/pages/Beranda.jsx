import React, { useEffect, useState } from "react";
import Footer from "../components/navigations/Footer";
import Navbar from "../components/navigations/Navbar";
import MobileNavbar from "../components/navigations/MobileNavbar";
import Header from "../components/pages/home-components/HeaderSection";
import FavoriteDestinationSection from "../components/pages/home-components/FavoriteDestinationSection";
import FlightSchedule from "../components/pages/home-components/FlightScheduleSection";
import AboutUs from "../components/pages/home-components/AboutUsSection";
import WhyUs from "../components/pages/home-components/WhyChooseUsSection";
import PromoSection from "../components/pages/home-components/PromoSection";
import BackToTopButton from "../components/navigations/BackToTop";
import OurTeamSection from "../components/pages/home-components/OurTeamSection";

function Beranda() {
  return (
    <div className="bg-white">
      {/* Desktop Navbar & Hamburger */}
      <Navbar transparent={true} />

      {/* Mobile Navbar */}
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
      <Header />

      <main className="container mx-auto">
        <FlightSchedule />
        <PromoSection />
        <FavoriteDestinationSection />
      </main>
      <AboutUs />
      <WhyUs />
      <OurTeamSection />
      <BackToTopButton />
      <Footer />
    </div>
  );
}

export default Beranda;

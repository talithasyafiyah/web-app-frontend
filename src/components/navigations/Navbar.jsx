import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/actions/authActions";

function Navbar({ transparent }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const user = useSelector((state) => state?.auth.user);
  const isLoggedIn = useSelector((state) => state?.auth.isLoggedIn);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (
        document.getElementById("home-section") &&
        scrollTop < document.getElementById("promo-section").offsetTop
      ) {
        setActiveSection("home-section");
      } else if (
        document.getElementById("promo-section") &&
        scrollTop <
          document.getElementById("destinasi-favorit-section").offsetTop
      ) {
        setActiveSection("promo-section");
      } else if (
        document.getElementById("destinasi-favorit-section") &&
        scrollTop < document.getElementById("tentang-kami-section").offsetTop
      ) {
        setActiveSection("destinasi-favorit-section");
      } else if (
        document.getElementById("tentang-kami-section") &&
        scrollTop >= document.getElementById("tentang-kami-section").offsetTop
      ) {
        setActiveSection("tentang-kami-section");
      }

      if (!transparent) {
        setIsScrolled(true);
      } else {
        setIsScrolled(scrollTop > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [transparent]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [location]);

  const handleLinkClick = (event, sectionId) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  function getInitials(fullName) {
    if (!fullName) return "";
    const names = fullName.split(" ");
    const initials = names.map((name) => name[0]).join("");
    return initials.toUpperCase();
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleConfirmModalToggle = () => {
    setConfirmModalOpen(!confirmModalOpen);
  };

  const renderLink = (to, sectionId, label) => {
    if (location.pathname === "/") {
      return (
        <a
          href={to}
          onClick={(e) => handleLinkClick(e, sectionId)}
          className={`${
            isScrolled || !transparent
              ? "text-sm font-medium text-primary hover:border-b-2 hover:border-primary pb-1"
              : "text-sm font-medium text-white hover:border-b-2 hover:border-primary pb-1"
          } ${
            activeSection === sectionId ? "border-b-2 border-primary pb-1" : ""
          }`}
        >
          {label}
        </a>
      );
    } else {
      return (
        <Link
          to={to}
          className={`${
            isScrolled || !transparent
              ? "text-sm font-medium text-primary hover:border-b-2 hover:border-primary pb-1"
              : "text-sm font-medium text-white hover:border-b-2 hover:border-primary pb-1"
          } ${
            activeSection === sectionId ? "border-b-2 border-primary pb-1" : ""
          }`}
        >
          {label}
        </Link>
      );
    }
  }

  return (
    <nav
      className={`py-4 px-3 mb-8 fixed top-0 w-full z-50 transition-colors duration-500 ${
        isScrolled || !transparent ? "bg-white shadow" : "bg-transparent"
      }`}
    >
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img
            src="/logo-blue.png"
            className="w-[50px] md:w-[76px]"
            alt="Logo Aviatick"
          />
        </Link>

       {/* Desktop Menu */}
        <div className="flex items-center justify-center flex-grow">
          <div className="hidden md:flex items-center space-x-8">
            {renderLink("/#home-section", "home-section", "Beranda")}
            {renderLink("/#promo-section", "promo-section", "Promo")}
            {renderLink("/#destinasi-favorit-section", "destinasi-favorit-section", "Destinasi Favorit")}
            {renderLink("/#tentang-kami-section", "tentang-kami-section", "Tentang Kami")}
          </div>
        </div>

        {/* Desktop Login Button */}
        {isLoggedIn ? (
          <div className="relative hidden md:flex">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Link to="/notifikasi">
                <svg
                  className={`w-6 h-6 hover:fill-primary mr-4 ${
                    isScrolled || !transparent ? "fill-darkgray" : "fill-white"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                </svg>
              </Link>

              <div className="rounded-full bg-gray/70 w-9 h-9 text-center text-white font-medium text-base flex items-center justify-center">
                {getInitials(user?.fullName)}
              </div>
            </div>
            {showDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white shadow-md rounded-md w-48">
                <p className="block w-full text-left px-4 py-2 text-sm font-medium text-primary rounded-t-md border-b border-neutral">
                  {user && user?.fullName}
                </p>
                <Link
                  to="/akun-saya"
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-main hover:bg-primary/15 rounded-t-md"
                >
                  Akun Saya
                </Link>
                <Link
                  to="/riwayat-pemesanan"
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-main hover:bg-primary/15 rounded-t-md"
                >
                  Riwayat Pemesanan
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-main hover:bg-primary/15 rounded-b-md"
                  onClick={handleConfirmModalToggle}
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/masuk"
            className={`${
              isScrolled || !transparent
                ? "hidden md:block text-sm font-medium text-primary bg-none border-2 border-primary hover:bg-primary hover:text-white rounded-full px-4 py-2 items-center"
                : "hidden md:block text-sm font-medium text-white bg-none border-2 border-white hover:bg-white/90 hover:text-primary rounded-full px-4 py-2 items-center"
            }`}
          >
            Masuk
          </Link>
        )}

        {/* Mobile Hamburger Button and Notif */}
        <div className="flex md:hidden items-center">
          <Link to="/notifikasi">
            <svg
              className={`w-5 h-5 hover:fill-primary mr-3 ${
                isScrolled || !transparent ? "fill-darkgray" : "fill-white"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
            </svg>
          </Link>
          <button
            onClick={handleMobileMenuToggle}
            className={`focus:outline-none focus:text-primary ${
              isScrolled || !transparent ? "text-primary" : "text-white"
            }`}
            aria-label="Open Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "fixed z-50" : "hidden"
          } top-0 left-0 w-full h-full flex items-center justify-end bg-black bg-opacity-30`}
          onClick={handleMobileMenuToggle}
        >
          <div className="md:hidden bg-white w-1/2 h-full flex flex-col justify-start items-end pt-12">
            <button
              onClick={handleMobileMenuToggle}
              className="absolute top-4 right-4 text-main hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-main hover:bg-primary/15 w-full text-left"
            >
              Beranda
            </Link>
            <a
              href="#promo-section"
              className="px-4 py-2 text-sm font-medium text-main hover:bg-primary/15 w-full text-left"
            >
              Promo
            </a>
            <a
              href="#destinasi-favorit-section"
              className="px-4 py-2 text-sm font-medium text-main hover:bg-primary/15 w-full text-left"
            >
              Destinasi Favorit
            </a>
            <a
              href="#tentang-kami-section"
              className="px-4 py-2 text-sm font-medium text-main hover:bg-primary/15 w-full text-left"
            >
              Tentang Kami
            </a>
            {!user && (
              <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-main hover:bg-primary/15 w-full text-left"
              >
                Masuk
              </Link>
            )}
              
          </div>
        </div>

        {/* Confirm Logout Modal */}
        <div
          id="confirm-modal"
          className={`${
            confirmModalOpen ? "" : "hidden"
          } fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50`}
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-neutral rounded-t">
                  <h3 className="text-xl font-semibold text-textcolor">
                    Keluar
                  </h3>
                  <button
                    type="button"
                    onClick={handleConfirmModalToggle}
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-textcolor rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
              </div>
              <div className="px-4 md:px-5 pb-4 md:pb-6 pt-2 md:pt-3">
                <p className="mb-4 text-base text-main">
                  Apa kamu yakin mau{" "}
                  <span className="text-danger font-semibold">Keluar</span>?
                </p>
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmModalToggle}
                      type="button"
                      className="w-24 text-main px-6 py-2 bg-neutral/30 hover:bg-neutral/70 mr-2 text-sm font-medium rounded-full text-center"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        dispatch(logout(navigate));
                        handleConfirmModalToggle();
                      }}
                      type="submit"
                      className="w-24 text-white bg-red-500 hover:bg-red-800 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                    >
                      Ya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

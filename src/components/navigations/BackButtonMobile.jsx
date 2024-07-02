import React from "react";
import { Link, useNavigate } from "react-router-dom";

function BackButtonMobile({ link }) {
  const navigate = useNavigate();
  return (
    <div className="container flex justify-between items-center pt-3">
      <button
        onClick={() => navigate(-1)}
        className="md:hidden p-3 bg-white shadow rounded-full inline-block"
      >
        <svg
          className="fill-main w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
        </svg>
      </button>
      {window.location.pathname !== "/notifikasi" && (
        <Link to="/notifikasi">
          <svg
            className="fill-darkgray w-5 h-5 hover:fill-primary mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>
        </Link>
      )}
    </div>
  );
}

export default BackButtonMobile;

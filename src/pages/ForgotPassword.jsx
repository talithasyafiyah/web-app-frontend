import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email, navigate));
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2800,
    cssEase: "linear",
    arrows: false,
  };

  return (
    <div className="min-h-screen flex mx-3 md:mx-0 bg-white">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/">
              <img
                className="h-12 w-auto"
                src="/logo-blue.png"
                alt="Aviatick Logo"
              />
            </Link>
            <h2 className="mt-6 text-2xl md:text-3xl font-bold text-main">
              Forgot Password
            </h2>
            <p className="mt-2 text-xs md:text-sm font-medium text-main">
              Tautan <span className="text-primary">reset password</span> akan
              dikirim ke email Anda.
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs md:text-sm font-medium text-gray"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Masukkan email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border-b border-gray placeholder-neutral focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm md:text-base font-medium text-white bg-primary hover:bg-darkprimary focus:outline-none"
                    onClick={handleSubmit}
                  >
                    Kirim Tautan
                  </button>
                </div>
              </form>
              {/* {message && <p className="mt-4 text-green-500">{message}</p>}
              {error && <p className="mt-4 text-red-500">{error}</p>} */}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/bg/plane.jpg"
          alt="Auth Page Image"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 top-[50%] items-center text-center tracking-[2px] justify-center text-white font-thin text-base px-4 overflow-x-hidden">
          <Slider {...settings}>
            <h3>Nikmati kemudahan memesan tiket pesawat di Aviatick.</h3>
            <h3>
              Temukan penawaran eksklusif dengan opsi pembayaran fleksibel.
            </h3>
            <h3>
              Jelajahi destinasi impian Anda bersama Aviatick untuk pengalaman
              booking yang sempurna.
            </h3>
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
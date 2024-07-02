import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import GoogleLogin from "./googleLogin";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const token = useSelector((state) => state?.auth.token);

  useEffect(() => {
    if (token) {
      toast.error("Kamu sudah login.");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const savedEmailOrPhoneNumber = localStorage.getItem("emailOrPhoneNumber");
    const savedPassword = localStorage.getItem("password");
    if (savedEmailOrPhoneNumber && savedPassword) {
      setEmailOrPhoneNumber(savedEmailOrPhoneNumber);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem("emailOrPhoneNumber", emailOrPhoneNumber);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("emailOrPhoneNumber");
      localStorage.removeItem("password");
    }

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;

    if (emailOrPhoneNumber === "" || password === "") {
      setMessage("Email/Phone Number dan Password tidak boleh kosong.");
      return false;
    }

    if (
      !emailRegex.test(emailOrPhoneNumber) &&
      !phoneRegex.test(emailOrPhoneNumber)
    ) {
      setMessage("Format Email atau Nomor Telepon tidak valid.");
      return false;
    }

    let data = {
      emailOrPhoneNumber,
      password,
    };

    dispatch(login(data, navigate, setMessage, setLoading));
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
    <div>
      <div
        className="min-h-screen flex mx-3 md:mx-0 bg-white"
      >
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-40">
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
                Masuk ke Akun Anda
              </h2>
              <p className="mt-2 text-xs md:text-sm font-semibold text-primary">
                Masuk{" "}
                <span href="#" className="font-medium text-main">
                  dan dapatkan harga terbaik untuk penerbangan Anda!
                </span>
              </p>
            </div>

          <div className="mt-8">
            <div className="mt-6">
              <form
                action="#"
                method="POST"
                className="space-y-6"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs md:text-sm font-medium text-gray"
                  >
                    Email/No Telepon
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      placeholder="Masukkan email/no telepon"
                      value={emailOrPhoneNumber}
                      onChange={(e) => setEmailOrPhoneNumber(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border-b border-gray placeholder-neutral focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1 relative">
                  <label
                    htmlFor="password"
                    className="block text-xs md:text-sm font-medium text-gray"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="*******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border-b border-gray placeholder-neutral focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 bottom-2 flex items-center px-3"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <svg
                          fill="#00A8D0"
                          className="w-4 hover:fill-secondary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" />
                        </svg>
                      ) : (
                        <svg
                          fill="#00A8D0"
                          className="w-4 hover:fill-secondary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                        >
                          <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-xs md:text-sm text-main"
                      >
                        Ingat saya
                      </label>
                    </div>

                  <div className="text-xs md:text-sm">
                    <a
                      href="/lupa-password"
                      className="font-medium text-primary hover:text-darkprimary"
                    >
                      Lupa password?
                    </a>
                  </div>
                </div>

                  <p className="text-sm text-red-500 font-medium">{message}</p>

                  <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm md:text-base font-medium text-white bg-primary hover:bg-darkprimary focus:outline-none ${loading ? "opacity-50" : ""}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center text-center">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#00A8D0"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      </div>
                    ) : (
                      "Masuk"
                    )}
                  </button>
                </form>
                <p className="text-sm font-medium text-center text-main mx-4 py-2">
                  atau
                </p>
                <div className="flex justify-center">
                  <GoogleLogin />
                </div>

                <p className="text-xs md:text-sm font-regular text-main mt-4">
                  Belum punya akun?{" "}
                  <a
                    href="/daftar"
                    className="font-medium text-primary hover:text-darkprimary cursor-pointer"
                  >
                    Daftar
                  </a>
                </p>
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
    </div>
  );
}

export default Login;

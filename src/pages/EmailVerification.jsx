import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, resendOtp } from "../redux/actions/authActions";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

function EmailVerification() {
  const [otpCode, setOtpCode] = useState(new Array(6).fill(""));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendTimeout, setResendTimeout] = useState(60); // Start with 60 seconds
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimeout > 0) {
      const timer = setTimeout(() => {
        setResendTimeout(resendTimeout - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [resendTimeout]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtpCode = [...otpCode];
    newOtpCode[index] = element.value;
    setOtpCode(newOtpCode);

    // Focus next input
    if (element.value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = otpCode.join("");
    setIsLoading(true); // Start loading
    let data = { email, otp };
    dispatch(verifyEmail(data, navigate)).finally(() => {
      setIsLoading(false);
    }); // Stop loading
  };

  const handleResend = () => {
    setIsResendDisabled(true);
    setResendTimeout(120); // Extend disable time to 2 minutes
    dispatch(resendOtp(email));
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12 ">
      <img
        src="/bg/plane.jpg"
        className="hidden lg:block absolute inset-0 w-full h-screen object-cover"
      />
      <div className="hidden lg:block absolute inset-0 bg-black opacity-20"></div>
      <div className="relative bg-white px-6 py-16 lg:shadow-xl mx-auto w-full lg:max-w-3xl rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-12 md:space-y-14">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Verifikasi Email</p>
            </div>
            <div className="flex flex-row text-sm font-normal text-main">
              <p>
                Ketik 6 digit kode yang dikirimkan ke <b>{email}</b>
              </p>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} method="post">
              <div className="flex flex-col space-y-12 md:space-y-14">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-lg space-x-2 md:space-x-0">
                  {otpCode.map((data, index) => (
                    <div key={index} className="w-12 h-12 md:w-16 md:h-16">
                      <input
                        className="w-full h-full flex flex-col items-center justify-center text-center lg:px-5 outline-none rounded-lg md:rounded-xl border border-neutral text-lg md:text-xl text-main font-semibold bg-white focus:bg-gray-50 focus:ring-2 focus:border-none ring-primary"
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                        ref={(el) => (inputRefs.current[index] = el)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm md:text-base font-medium text-white bg-primary hover:bg-darkprimary focus:outline-none"
                    >
                      Verifikasi
                    </button>
                    {isLoading && (
                      <div className="flex justify-center mt-4">
                        <ThreeDots
                          visible={true}
                          height="40"
                          width="40"
                          color="#00A8D0"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-center text-center text-sm font-normal space-x-1 text-main">
                    <p>Belum menerima kode?</p>{" "}
                    <button
                      className={`flex flex-row items-center font-medium ${
                        isResendDisabled
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-primary hover:text-darkprimary"
                      }`}
                      onClick={handleResend}
                      disabled={isResendDisabled}
                      // className="flex flex-row items-center font-medium text-primary hover:text-darkprimary"
                      // onClick={() => dispatch(resendOtp(email))}
                      // // href="http://"
                      // // target="_blank"
                      // // rel="noopener noreferrer"
                    >
                      Kirim ulang {isResendDisabled && `(${resendTimeout}s)`}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
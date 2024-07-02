import { useAsyncError, useNavigate } from "react-router-dom";
import Footer from "../../components/navigations/Footer";
import Navbar from "../../components/navigations/Navbar";
import * as React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import BackButtonMobile from "../../components/navigations/BackButtonMobile";

export default function Pembayaran() {
  const navigate = useNavigate();
  const [tripType, settripType] = useState("");
  const booking = useSelector((state) => state?.bookingFlight?.bookings);
  const airplane = useSelector(
    (state) =>
      state?.bookingFlight?.bookings?.selectedDeparture?.airplane?.airline || {}
  );

  const payment = useSelector((state) => state?.bookingFlight);
  const bookingDetail = useSelector(
    (state) => state?.history?.bookingHistoryDetail
  );
  const token = useSelector((state) => state.auth.token);
  
  useEffect(() => {
    if (!token) {
      navigate("/masuk");
      toast.error(
        "Ups.. tidak dapat mengakses halaman, silakan masuk terlebih dahulu."
      );
    }
  }, [token, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePaymentCompletion = (event) => {
      const successUrl = "https://aviatick-staging.vercel.app/success";
      if (event.origin === new URL(successUrl).origin && event.data.includes("transaction_status=settlement")) {
        localStorage.setItem("bookingDetail", JSON.stringify(bookingDetail));
      }
    };

    window.addEventListener("message", handlePaymentCompletion);

    return () => {
      window.removeEventListener("message", handlePaymentCompletion);
    };
  }, [bookingDetail]);

  useEffect(() => {
    if (booking?.selectedReturn !== null) return settripType("roundtrip");
    if (booking?.selectedReturn === null) return settripType("singletrip");
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const month = monthNames[date.getUTCMonth()]; // getUTCMonth() is zero-based
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
  };
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = String(date?.getUTCHours()).padStart(2, "0");
    const minutes = String(date?.getUTCMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return (
    <div className="bg-background">
      <div className="hidden md:block">
        <Navbar transparent={false} />
      </div>

      <BackButtonMobile />
      {/* Navigasi  */}
      <div className="container mt-3 md:mt-20 px-3">
        {/* Breadcrumb */}
          <div className="container hidden md:flex gap-1.5 text-main text-xs font-medium -mt-4 md:-mt-0 md:-mb-4">
            <a href="/">Beranda</a>
            <img src="/icons/right-chev.svg" alt="chevron" />
            <span>Cari Penerbangan</span>
            <img src="/icons/right-chev.svg" alt="chevron" />
            <span>Isi Data Diri</span>
            <img src="/icons/right-chev.svg" alt="chevron" />
            <span>Pembayaran</span>
          </div>

          <h1 className="container block md:hidden text-2xl font-bold text-main mb-3">
            Pembayaran
          </h1>
      </div>
      <div className="flex justify-center">
        <div className="container lg:flex lg:gap-5 lg:my-5">
          {/* Sisi Kanan */}
          <section className="flex flex-col lg:w-[100%] gap-4 lg:hidden my-6">
            {/* Detail Pemesanan  */}
            <div className="rounded-xl bg-white shadow-md pb-4">
              {" "}
              {/* Route  */}
              <p className="flex gap-5 items-center text-xl  p-8">
                <strong>
                  {booking?.selectedDeparture?.flight?.departure?.city}
                </strong>
                {tripType === "singletrip" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M14.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 8H5a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414m-4.586 10a1 1 0 0 1 0 1.414L7.414 16H19a1 1 0 1 1 0 2H7.414l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0"
                    />
                  </svg>
                )}

                <strong>
                  {booking?.selectedDeparture?.flight?.arrival?.city}
                </strong>
              </p>
              <hr className="text-gray" />
              {/* SingleTrip Pages */}
              <div>
                {/* Maskapai  */}
                <div className="flex p-8">
                  <div className="p-4 flex border w-1/2 lg:flex-col gap-2 rounded-l-md items-center justify-center">
                    <img src={airplane?.logoUrl} className="w-[50px]" />
                    <div className=" text-black ">
                      <p className="text-lg text-center">
                        <strong>{airplane?.name}</strong>
                      </p>
                      <p className="text-center">
                        {booking?.selectedDeparture?.airplane?.seatClass?.type}
                      </p>
                    </div>
                  </div>
                  <div className="p-2  flex flex-col border w-1/2 gap-2 rounded-r-md justify-center items-center">
                    <p className=" text-black px-4 py-2 bg-slate-200 rounded-lg">
                      Pergi
                    </p>
                    <p className=" text-black">
                      {formatDate(
                        booking?.selectedDeparture?.flight?.departure?.time
                      )}
                    </p>
                  </div>
                </div>
                {/* Detail Route  */}
                <div className="px-8 flex">
                  <div className="px-4">
                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-neutral"></div>
                      <strong className="flex gap-2 ">
                        <p>
                          {formatTime(
                            booking?.selectedDeparture?.flight?.departure?.time
                          )}
                        </p>
                        <p>-</p>
                        <p className="text-[#00A8D0]">Keberangkatan</p>
                      </strong>
                    </div>
                    <div className="flex my-2">
                      <div className="mx-[7px] h-auto w-[1px] bg-neutral"></div>
                      <div className="py-2 ps-3 text-sm">
                        <p>
                          {formatDate(
                            booking?.selectedDeparture?.flight?.departure?.time
                          )}
                        </p>
                        <p>
                          {
                            booking?.selectedDeparture?.flight?.departure
                              ?.airport
                          }
                        </p>
                        <p>
                          (
                          {
                            booking?.selectedDeparture?.flight?.departure
                              ?.airportCode
                          }
                          )
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-neutral"></div>
                      <strong className="flex gap-2 ">
                        <p>
                          {formatTime(
                            booking?.selectedDeparture?.flight?.arrival?.time
                          )}
                        </p>
                        <p>-</p>
                        <p className="text-[#00A8D0]">Kedatangan</p>
                      </strong>
                    </div>
                    <div className="py-3 ps-7 text-sm">
                      <p>
                        {formatDate(
                          booking?.selectedDeparture?.flight?.arrival?.time
                        )}
                      </p>
                      <p>
                        {booking?.selectedDeparture?.flight?.arrival?.airport}
                      </p>
                      <p>
                        (
                        {
                          booking?.selectedDeparture?.flight?.arrival
                            ?.airportCode
                        }
                        )
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* RoundTrip Pages */}
              {tripType == "roundtrip" && (
                <div>
                  {/* Maskapai  */}
                  <div className="flex p-8">
                    <div className="p-4 flex border w-1/2 lg:flex-col gap-2 rounded-l-md items-center justify-center">
                      <img src={airplane?.logoUrl} className="w-[50px]" />
                      <div className=" text-black ">
                        <p className="text-lg text-center">
                          <strong>{airplane?.name}</strong>
                        </p>
                        <p className="text-center">
                          {booking?.selectedReturn?.airplane?.seatClass?.type}
                        </p>
                      </div>
                    </div>
                    <div className="p-2  flex flex-col border w-1/2 gap-2 rounded-r-md justify-center items-center">
                      <p className=" text-black px-4 py-2 bg-slate-200 rounded-lg">
                        Pulang
                      </p>
                      <p className=" text-black">
                        {formatDate(
                          booking?.selectedReturn?.flight?.departure?.time
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Detail Route  */}
                  <div className="px-8 flex">
                    <div className="px-4">
                      <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-neutral"></div>
                        <strong className="flex gap-2 ">
                          <p>
                            {formatTime(
                              booking?.selectedReturn?.flight?.departure?.time
                            )}
                          </p>
                          <p>-</p>
                          <p className="text-[#00A8D0]">Keberangkatan</p>
                        </strong>
                      </div>
                      <div className="flex my-2">
                        <div className="mx-[7px] h-auto w-[1px] bg-neutral"></div>
                        <div className="py-2 ps-3 text-sm">
                          <p>
                            {formatDate(
                              booking?.selectedReturn?.flight?.departure?.time
                            )}
                          </p>
                          <p>
                            {
                              booking?.selectedReturn?.flight?.departure
                                ?.airport
                            }
                          </p>
                          <p>
                            (
                            {
                              booking?.selectedReturn?.flight?.departure
                                ?.airportCode
                            }
                            )
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-neutral"></div>
                        <strong className="flex gap-2 ">
                          <p>
                            {formatTime(
                              booking?.selectedReturn?.flight?.arrival?.time
                            )}
                          </p>
                          <p>-</p>
                          <p className="text-[#00A8D0]">Kedatangan</p>
                        </strong>
                      </div>
                      <div className="py-3 ps-7 text-sm">
                        <p>
                          {formatDate(
                            booking?.selectedReturn?.flight?.arrival?.time
                          )}
                        </p>
                        <p>
                          {booking?.selectedReturn?.flight?.arrival?.airport}
                        </p>
                        <p>
                          (
                          {
                            booking?.selectedReturn?.flight?.arrival
                              ?.airportCode
                          }
                          )
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          {/* Sisi Kiri  */}
          <section className="lg:w-[1300px] rounded bg-white space-y-5 my-6">
            <div className="flex ">
              <iframe
                src={bookingDetail?.url_payment}
                title="Midtrans Payment"
                width="100%"
                height="1000px"
                className="p-16 md:w-[700px] md:p-20 max-sm:p-2 shadow-md rounded-xl"
              ></iframe>
            </div>
          </section>
          {/* Sisi Kanan */}
          <section className="flex flex-col lg:w-[100%] gap-4 max-sm:hidden max-lg:hidden my-6">
            {/* Detail Pemesanan  */}
            <div className="rounded-xl bg-white shadow-md pb-4">
              {" "}
              {/* Route  */}
              <p className="flex gap-5 items-center text-xl  p-8">
                <strong>
                  {booking?.selectedDeparture?.flight?.departure?.city}
                </strong>
                {tripType === "singletrip" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M14.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 8H5a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414m-4.586 10a1 1 0 0 1 0 1.414L7.414 16H19a1 1 0 1 1 0 2H7.414l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0"
                    />
                  </svg>
                )}

                <strong>
                  {booking?.selectedDeparture?.flight?.arrival?.city}
                </strong>
              </p>
              <hr className="text-gray" />
              {/* SingleTrip Pages */}
              <div>
                {/* Maskapai  */}
                <div className="flex p-8">
                  <div className="p-4 flex border w-1/2 lg:flex-col gap-2 rounded-l-md items-center justify-center">
                    <img src={airplane?.logoUrl} className="w-[50px]" />
                    <div className=" text-black ">
                      <p className="text-lg text-center">
                        <strong>{airplane?.name}</strong>
                      </p>
                      <p className="text-center">
                        {booking?.selectedDeparture?.airplane?.seatClass?.type}
                      </p>
                    </div>
                  </div>
                  <div className="p-2  flex flex-col border w-1/2 gap-2 rounded-r-md justify-center items-center">
                    <p className=" text-black px-4 py-2 bg-slate-200 rounded-lg">
                      Pergi
                    </p>
                    <p className=" text-black">
                      {formatDate(
                        booking?.selectedDeparture?.flight?.departure?.time
                      )}
                    </p>
                  </div>
                </div>
                {/* Detail Route  */}
                <div className="px-8 flex">
                  <div className="px-4">
                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-neutral"></div>
                      <strong className="flex gap-2 ">
                        <p>
                          {formatTime(
                            booking?.selectedDeparture?.flight?.departure?.time
                          )}
                        </p>
                        <p>-</p>
                        <p className="text-[#00A8D0]">Keberangkatan</p>
                      </strong>
                    </div>
                    <div className="flex my-2">
                      <div className="mx-[7px] h-auto w-[1px] bg-neutral"></div>
                      <div className="py-2 ps-3 text-sm">
                        <p>
                          {formatDate(
                            booking?.selectedDeparture?.flight?.departure?.time
                          )}
                        </p>
                        <p>
                          {
                            booking?.selectedDeparture?.flight?.departure
                              ?.airport
                          }
                        </p>
                        <p>
                          (
                          {
                            booking?.selectedDeparture?.flight?.departure
                              ?.airportCode
                          }
                          )
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-neutral"></div>
                      <strong className="flex gap-2 ">
                        <p>
                          {formatTime(
                            booking?.selectedDeparture?.flight?.arrival?.time
                          )}
                        </p>
                        <p>-</p>
                        <p className="text-[#00A8D0]">Kedatangan</p>
                      </strong>
                    </div>
                    <div className="py-3 ps-7 text-sm">
                      <p>
                        {formatDate(
                          booking?.selectedDeparture?.flight?.arrival?.time
                        )}
                      </p>
                      <p>
                        {booking?.selectedDeparture?.flight?.arrival?.airport}
                      </p>
                      <p>
                        (
                        {
                          booking?.selectedDeparture?.flight?.arrival
                            ?.airportCode
                        }
                        )
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* RoundTrip Pages */}
              {tripType == "roundtrip" && (
                <div>
                  {/* Maskapai  */}
                  <div className="flex p-8">
                    <div className="p-4 flex border w-1/2 lg:flex-col gap-2 rounded-l-md items-center justify-center">
                      <img src={airplane?.logoUrl} className="w-[50px]" />
                      <div className=" text-black ">
                        <p className="text-lg text-center">
                          <strong>{airplane?.name}</strong>
                        </p>
                        <p className="text-center">
                          {booking?.selectedReturn?.airplane?.seatClass?.type}
                        </p>
                      </div>
                    </div>
                    <div className="p-2  flex flex-col border w-1/2 gap-2 rounded-r-md justify-center items-center">
                      <p className=" text-black px-4 py-2 bg-slate-200 rounded-lg">
                        Pulang
                      </p>
                      <p className=" text-black">
                        {formatDate(
                          booking?.selectedReturn?.flight?.departure?.time
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Detail Route  */}
                  <div className="px-8 flex">
                    <div className="px-4">
                      <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-neutral"></div>
                        <strong className="flex gap-2 ">
                          <p>
                            {formatTime(
                              booking?.selectedReturn?.flight?.departure?.time
                            )}
                          </p>
                          <p>-</p>
                          <p className="text-[#00A8D0]">Keberangkatan</p>
                        </strong>
                      </div>
                      <div className="flex my-2">
                        <div className="mx-[7px] h-auto w-[1px] bg-neutral"></div>
                        <div className="py-2 ps-3 text-sm">
                          <p>
                            {formatDate(
                              booking?.selectedReturn?.flight?.departure?.time
                            )}
                          </p>
                          <p>
                            {
                              booking?.selectedReturn?.flight?.departure
                                ?.airport
                            }
                          </p>
                          <p>
                            (
                            {
                              booking?.selectedReturn?.flight?.departure
                                ?.airportCode
                            }
                            )
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-neutral"></div>
                        <strong className="flex gap-2 ">
                          <p>
                            {formatTime(
                              booking?.selectedReturn?.flight?.arrival?.time
                            )}
                          </p>
                          <p>-</p>
                          <p className="text-[#00A8D0]">Kedatangan</p>
                        </strong>
                      </div>
                      <div className="py-3 ps-7 text-sm">
                        <p>
                          {formatDate(
                            booking?.selectedReturn?.flight?.arrival?.time
                          )}
                        </p>
                        <p>
                          {booking?.selectedReturn?.flight?.arrival?.airport}
                        </p>
                        <p>
                          (
                          {
                            booking?.selectedReturn?.flight?.arrival
                              ?.airportCode
                          }
                          )
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

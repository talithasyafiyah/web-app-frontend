import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navigations/Navbar";
import MobileNavbar from "../components/navigations/MobileNavbar";
import Footer from "../components/navigations/Footer";
import BackButtonMobile from "../components/navigations/BackButtonMobile";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function KonfirmasiTiket() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const booking = useSelector(
    (state) => state?.bookingFlight?.bookings || null
  );
  const user = useSelector((state) => state?.auth?.user || null);
  const totalPassenger =
    booking?.passengers?.adults + booking.passengers?.children;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleConfirmClick = () => {
    if (!user) {
      showSwal();
    } else {
      navigate("/pemesanan");
    }
  };

  const formatDateToDayMonthYear = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return "";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const convertToTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;

    return `${hours}.${minutes}`;
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const durationMs = endDate - startDate;
    const durationMinutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}j ${minutes}m`;
  };

  const formatPrice = (price) => {
    return `IDR ${new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(price)}`;
  };

  const showSwal = () => {
    withReactContent(Swal)
      .fire({
        title: "<b>Kamu belum masuk nih!</b>",
        html: `
        Silakan masuk terlebih dahulu untuk memesan tiket.
      `,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Masuk",
        customClass: {
          confirmButton:
            "inline-block bg-[#00A8D0] hover:bg-darkprimary text-white px-12 py-2 rounded-full",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate("/masuk");
        }
      });
  };

  return (
    <div className="bg-background text-main">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar transparent={false} />
      </div>

      <BackButtonMobile />

      {/* Booking History Section */}
      <section className="pt-4 md:pt-20 pb-8">
        <div className="container">
          {/* Breadcrumb */}
          <div className="container hidden md:flex gap-1.5 text-main text-xs font-medium -mt-4 md:-mt-0 mb-10 md:mb-5">
            <a href="/">Beranda</a>
            <img src="/icons/right-chev.svg" alt="chevron" />
            <a href="/hasil-pencarian">Hasil Pencarian</a>
            <img src="/icons/right-chev.svg" alt="chevron" />
            <a>Konfirmasi Tiket</a>
          </div>
          {/* Destination and Passengers */}
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-main text-xl md:text-2xl">
                {booking.selectedDeparture.flight.departure.city}
              </h1>
              {booking.selectedReturn ? (
                <svg
                  className="w-3 md:w-4 fill-main"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z" />
                </svg>
              ) : (
                <svg
                  className="w-3 md:w-4 fill-main"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                </svg>
              )}
              <h1 className="font-semibold text-main text-xl md:text-2xl">
                {booking.selectedDeparture.flight.arrival.city}
              </h1>
            </div>
            <h3 className="text-main font-medium text-sm md:text-base mt-3">
              {booking.passengers.adults} Dewasa, {booking.passengers.children}{" "}
              Anak, {booking.passengers.infants} Bayi
            </h3>
          </div>

          {/* Departure Card */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/70 inline-block px-4 py-1 text-white rounded-full text-xs md:text-sm">
                Pergi
              </div>
              <h5 className="text-sm md:text-base font-normal">
                {formatDateToDayMonthYear(
                  booking.selectedDeparture.flight.departure.time
                )}
              </h5>
            </div>

            <div className="border border-neutral rounded-lg p-3">
              <div className="flex border-b border-neutral pb-4">
                <img
                  src={booking.selectedDeparture.airplane.airline.logoUrl}
                  alt={`${booking.selectedDeparture.airplane.airline.name} logo`}
                  className="h-4 w-8 md:h-8 md:w-8 mr-2 md:mr-4 object-contain"
                />
                <div className="flex-col">
                  <p className="text-sm md:text-base font-semibold text-main">
                    {booking.selectedDeparture.airplane.airline.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-normal text-darkgray">
                      {booking.selectedDeparture.airplane.model}
                    </p>
                    <div className="bg-darkgray w-1 h-1 rounded-full"></div>
                    <p className="text-xs font-normal text-darkgray">
                      {booking.selectedDeparture.airplane.seatClass.type}
                    </p>
                    <div className="bg-darkgray w-1 h-1 rounded-full"></div>

                    <p className="text-xs font-normal text-darkgray">
                      {calculateDuration(
                        booking.selectedDeparture.flight.departure.time,
                        booking.selectedDeparture.flight.arrival.time
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-sm mb-3">
                  Tiket sudah termasuk:
                </h3>
                <ul className="font-normal text-xs">
                  <li>
                    Bagasi: {booking.selectedDeparture.airplane.baggageCapacity}{" "}
                    kg
                  </li>
                  <li>
                    Kabin: {booking.selectedDeparture.airplane.cabinCapacity} kg
                  </li>
                  <li>
                    Fasilitas:{" "}
                    {booking.selectedDeparture.airplane.inFlightFacility}
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex-col mt-4">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 border-neutral border-2 rounded-full"></div>
                  <div className="flex items-center font-semibold text-sm">
                    <p className="text-main text-base md:text-lg mr-4">
                      {convertToTime(
                        booking.selectedDeparture.flight.departure.time
                      )}
                    </p>
                    <p className="text-main font-medium">
                      {booking.selectedDeparture.flight.departure.airport}
                    </p>
                  </div>
                </div>
                <div className="ml-1 h-[27px] w-[1px] bg-neutral"></div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                  <div className="flex items-center font-semibold text-sm">
                    <p className="text-main text-base md:text-lg mr-4">
                      {convertToTime(
                        booking.selectedDeparture.flight.arrival.time
                      )}
                    </p>

                    <p className="text-main font-medium">
                      {booking.selectedDeparture.flight.arrival.airport}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return Card */}
          {booking.selectedReturn && (
            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/70 inline-block px-4 py-1 text-white rounded-full text-xs md:text-sm">
                  Pulang
                </div>
                <h5 className="text-sm md:text-base font-normal">
                  {formatDateToDayMonthYear(
                    booking.selectedReturn.flight.departure.time
                  )}
                </h5>
              </div>

              <div className="border border-neutral rounded-lg p-3">
                <div className="flex border-b border-neutral pb-4">
                  <img
                    src={booking.selectedReturn.airplane.airline.logoUrl}
                    alt={`${booking.selectedReturn.airplane.airline.name} logo`}
                    className="h-4 w-8 md:h-8 md:w-8 mr-2 md:mr-4 object-contain"
                  />
                  <div className="flex-col">
                    <p className="text-sm md:text-base font-semibold text-main">
                      {booking.selectedReturn.airplane.airline.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-normal text-darkgray">
                        {booking.selectedReturn.airplane.model}
                      </p>
                      <div className="bg-darkgray w-1 h-1 rounded-full"></div>
                      <p className="text-xs font-normal text-darkgray">
                        {booking.selectedReturn.airplane.seatClass.type}
                      </p>
                      <div className="bg-darkgray w-1 h-1 rounded-full"></div>

                      <p className="text-xs font-normal text-darkgray">
                        {calculateDuration(
                          booking.selectedReturn.flight.departure.time,
                          booking.selectedReturn.flight.arrival.time
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-sm mb-3">
                    Tiket sudah termasuk:
                  </h3>
                  <ul className="font-normal text-xs">
                    <li>
                      Bagasi: {booking.selectedReturn.airplane.baggageCapacity}{" "}
                      kg
                    </li>
                    <li>
                      Kabin: {booking.selectedReturn.airplane.cabinCapacity} kg
                    </li>
                    <li>
                      Fasilitas:{" "}
                      {booking.selectedReturn.airplane.inFlightFacility}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex-col mt-4">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 border-neutral border-2 rounded-full"></div>
                    <div className="flex items-center font-semibold text-sm">
                      <p className="text-main text-base md:text-lg mr-4">
                        {convertToTime(
                          booking.selectedReturn.flight.departure.time
                        )}
                      </p>
                      <p className="text-main font-medium">
                        {booking.selectedReturn.flight.departure.airport}
                      </p>
                    </div>
                  </div>
                  <div className="ml-1 h-[27px] w-[1px] bg-neutral"></div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                    <div className="flex items-center font-semibold text-sm">
                      <p className="text-main text-base md:text-lg mr-4">
                        {convertToTime(
                          booking.selectedReturn.flight.arrival.time
                        )}
                      </p>

                      <p className="text-main font-medium">
                        {booking.selectedReturn.flight.arrival.airport}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Price Card */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h1 className="text-base md:text-lg font-semibold">Detail Harga</h1>
            <div className="flex flex-col gap-1 mt-4">
              <div className="flex items-center gap-2">
                <p className="font-darkgray font-medium text-xs md:text-sm">
                  Tiket Pergi
                </p>
                <p className="text-sm md:text-base font-semibold">
                  {formatPrice(
                    booking.selectedDeparture.afterDiscountPrice
                      ? booking.selectedDeparture.afterDiscountPrice
                      : booking.selectedDeparture.price
                  )}{" "}
                  <span className="text-sm font-normal text-darkgray">
                    /pax
                  </span>
                </p>
              </div>
              {booking.selectedReturn && (
                <div className="flex items-center gap-2">
                  <p className="font-darkgray font-medium text-xs md:text-sm">
                    Tiket Pulang
                  </p>
                  <p className="text-sm md:text-base font-semibold">
                    {formatPrice(
                      booking.selectedReturn.afterDiscountPrice
                        ? booking.selectedReturn.afterDiscountPrice
                        : booking.selectedReturn.price
                    )}{" "}
                    <span className="text-sm font-normal text-darkgray">
                      /pax
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mt-4">
                  <p className="font-darkgray font-medium text-xs md:text-sm">
                    Total
                  </p>
                  {booking.selectedReturn ? (
                    <p className="text-lg md:text-xl font-semibold text-danger">
                      {formatPrice(
                        ((booking.selectedDeparture.afterDiscountPrice
                          ? booking.selectedDeparture.afterDiscountPrice
                          : booking.selectedDeparture.price) +
                          (booking.selectedReturn.afterDiscountPrice
                            ? booking.selectedReturn.afterDiscountPrice
                            : booking.selectedReturn.price)) *
                          totalPassenger
                      )}
                    </p>
                  ) : (
                    <p className="text-lg font-semibold text-danger">
                      {formatPrice(
                        (booking.selectedDeparture.afterDiscountPrice
                          ? booking.selectedDeparture.afterDiscountPrice
                          : booking.selectedDeparture.price) * totalPassenger
                      )}
                    </p>
                  )}
                </div>
                {booking?.selectedDeparture?.afterDiscountPrice && (
                  <p className="text-xs">*Sudah termasuk promo</p>
                )}
              </div>

              <button
                onClick={handleConfirmClick}
                className="self-center text-center w-full md:w-auto inline-block py-2 px-8 border border-transparent rounded-full shadow-sm text-sm md:text-base font-medium text-white bg-primary hover:bg-darkprimary focus:outline-none"
              >
                Konfirmasi Tiket
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default KonfirmasiTiket;

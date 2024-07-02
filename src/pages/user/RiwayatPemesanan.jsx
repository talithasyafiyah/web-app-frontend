import React, { useEffect, useState } from "react";
import Footer from "../../components/navigations/Footer";
import Navbar from "../../components/navigations/Navbar";
import RiwayatPemesananCard from "../../components/cards/RiwayatPemesananCard";
import FilterDate from "../../components/buttons/FilterDate";
import MobileNavbar from "../../components/navigations/MobileNavbar";
import {
  getBookingHistoryDetail,
  getHistoryByDate,
  getHistorySearchResults,
  getUserBookingHistory,
} from "../../redux/actions/historyActions";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../utils/debounce";
import { FaCalendarAlt } from "react-icons/fa";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import CetakTiket from "../../components/buttons/CetakTiket";
import {
  setBookingHistoryDetail,
  setHistoryKeyword,
} from "../../redux/reducers/historyReducers";
import BackToTopButton from "../../components/navigations/BackToTop";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RiwayatPemesanan() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("semua");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firstLoading, setFirstLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  const {
    bookingHistory: flightData = [],
    bookingHistoryDetail: bookingDetail = null,
    historyKeyword: searchTerm,
    historySearchResults: searchResults,
    date: selectedDate,
    historyByDate,
  } = useSelector((state) => state.history);

  useEffect(() => {
    if (!token) {
      navigate("/masuk");
      toast.error(
        "Ups.. tidak dapat mengakses halaman, silakan masuk terlebih dahulu."
      );
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setFirstLoading(true);
        await dispatch(setBookingHistoryDetail([]));
        await dispatch(getUserBookingHistory());
        await dispatch(getHistoryByDate(selectedDate));
        await dispatch(getHistorySearchResults());
        setFirstLoading(false);
      };

      fetchData();
    }
  }, [dispatch, selectedDate, token]);

  const searchHistory = (term) => {
    dispatch(getHistorySearchResults());
  };

  const delayedSearch = useDebounce(searchHistory, 300);

  const handleSearchInputChange = (e) => {
    dispatch(setHistoryKeyword(e.target.value));
    delayedSearch(e.target.value);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = (flight) => {
    setSelectedFlight(selectedFlight === flight ? null : flight);
    dispatch(getBookingHistoryDetail(flight.id, setLoading, setDetailLoading));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredFlightData =
    activeTab === "semua"
      ? flightData
      : flightData.filter((flight) => flight.status === activeTab);

  const displayedHistory = searchTerm
    ? searchResults
    : selectedDate
    ? historyByDate
    : filteredFlightData;

  const convertToTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;

    return `${hours}.${minutes}`;
  };

  const convertDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const formatPrice = (price) => {
    return `IDR ${new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(price)}`;
  };

  const formatDateToDayMonthYear = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return "";
    }
    const date = new Date(dateString);
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    return adjustedDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!token) {
    return null;
  }

  return (
    <div className="bg-background">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar transparent={false} />
      </div>

      {/* Mobile Navbar */}
      <div className="block md:hidden">
        <MobileNavbar />
      </div>

      {/* Booking History Section */}
      <section className="pt-6 md:pt-28 pb-8">
        <div className="container">
          {/* Breadcrumb */}
          <h1 className="text-2xl md:text-xl font-bold text-main mb-10 md:mb-4">
            Riwayat Pemesanan
          </h1>

          {/* Search History Desktop*/}
          <div className="hidden md:block relative mt-6 mb-5">
            {/* Banner */}
            <img
              src="/search-flight-banner.png"
              alt="Banner"
              className="w-full"
            />

            {/* Search Field */}
            <div className="absolute inset-x-0 top-[5%] lg:top-[30%] transform -translate-y-1/2 mx-auto w-full">
              <div className="relative w-full">
                <svg
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Cari Riwayat..."
                  className="w-full bg-white text-main rounded-full text-base shadow-md ps-14 pr-36 py-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
          </div>

          {/* Search History Mobile */}
          <div className="block md:hidden relative mt-4">
            {/* Banner */}
            <img
              src="/search-flight-banner-mobile.png"
              alt="Banner"
              className="w-full"
            />

            {/* Search Field */}
            <div className="absolute inset-x-0 top-[5%] transform -translate-y-1/2 mx-auto w-full md:w-[1080px]">
              <svg
                className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>

              <input
                type="text"
                placeholder="Cari Riwayat..."
                className="w-full bg-white text-main rounded-full text-sm shadow-md ps-14 pr-36 py-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>

          {/* Filter berdasarkan tanggal mobile */}
          <div className="block md:hidden mt-2">
            <FilterDate label="Tanggal" iconSrc="/icons/filter.svg" />
          </div>

          {/* Tab & Filter Section */}
          <div className="flex justify-between mt-2">
            <div className="border-b border-neutral w-full">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-main">
                <li className="me-1 md:me-2">
                  <a
                    onClick={() => handleTabClick("semua")}
                    className={`cursor-pointer inline-flex items-center justify-center p-2 md:p-3 text-xs md:text-sm font-medium border-b-2 rounded-t-lg ${
                      activeTab === "semua"
                        ? "text-primary border-primary"
                        : "border-transparent"
                    }`}
                  >
                    Semua
                  </a>
                </li>
                <li className="me-1 md:me-2">
                  <a
                    onClick={() => handleTabClick("UNPAID")}
                    className={`cursor-pointer inline-flex items-center justify-center p-2 md:p-3 text-xs md:text-sm font-medium border-b-2 rounded-t-lg ${
                      activeTab === "UNPAID"
                        ? "text-primary border-primary"
                        : "border-transparent"
                    }`}
                  >
                    Belum Bayar
                  </a>
                </li>
                <li className="me-1 md:me-2">
                  <a
                    onClick={() => handleTabClick("PAID")}
                    className={`cursor-pointer inline-flex items-center justify-center p-2 md:p-3 text-xs md:text-sm font-medium border-b-2 rounded-t-lg ${
                      activeTab === "PAID"
                        ? "text-primary border-primary"
                        : "border-transparent"
                    }`}
                  >
                    Diterbitkan
                  </a>
                </li>
                <li className="me-1 md:me-2">
                  <a
                    onClick={() => handleTabClick("CANCELED")}
                    className={`cursor-pointer inline-flex items-center justify-center p-2 md:p-3 text-xs md:text-sm font-medium border-b-2 rounded-t-lg ${
                      activeTab === "CANCELED"
                        ? "text-primary border-primary"
                        : "border-transparent"
                    }`}
                  >
                    Dibatalkan
                  </a>
                </li>
              </ul>
            </div>

            {/* Filter berdasarkan tanggal desktop */}
            <div className="hidden md:block">
              <FilterDate label="Tanggal" iconSrc="/icons/filter.svg" />
            </div>
          </div>

          {/* Mobile Detail */}
          <div className="flex-col md:flex-row flex gap-4 mt-5">
            {selectedFlight && detailLoading && (
              <div className="block md:hidden w-full max-w-sm mx-auto overflow-hidden text-main self-start">
                <div className="flex items-center justify-center h-24">
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
              </div>
            )}
            {selectedFlight && !detailLoading && (
              <div className="block md:hidden w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden text-main self-start">
                <div className="px-6 py-4">
                  <p className="text-xs font-medium text-gray">
                    Booking Code:{" "}
                    <span className="font-normal">
                      {bookingDetail?.booking_code}
                    </span>
                  </p>
                  {bookingDetail?.status === "UNPAID" && (
                    <p className="text-xs font-semibold text-secondary">
                      Bayar Sebelum:{" "}
                      <span>{convertDateTime(bookingDetail?.paid_before)}</span>
                    </p>
                  )}
                  <h1 className="flex gap-2 font-bold text-lg my-2">
                    {
                      bookingDetail?.flight_detail?.departure_flight
                        ?.departure_city
                    }
                    {bookingDetail?.flight_detail?.return_flight ? (
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
                    {
                      bookingDetail?.flight_detail?.departure_flight
                        ?.arrival_city
                    }
                  </h1>
                  <div className="flex gap-3 border border-neutral rounded-lg items-center mb-4 py-2 px-3">
                    <FaCalendarAlt className="text-gray" />
                    <p className="text-main font-normal text-sm lg:text-base">
                      {formatDateToDayMonthYear(
                        bookingDetail?.flight_detail?.departure_flight
                          ?.departure_time
                      )}
                      {bookingDetail?.flight_detail?.return_flight && (
                        <>
                          {" "}
                          -{" "}
                          {formatDateToDayMonthYear(
                            bookingDetail?.flight_detail?.return_flight
                              ?.departure_time
                          )}
                        </>
                      )}
                    </p>
                  </div>

                  {/* Toggle Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={toggleExpand}
                      className="text-primary font-medium text-xs focus:outline-none flex items-center"
                    >
                      {isExpanded ? (
                        <>
                          Sembunyikan
                          <svg
                            className="w-4 h-4 ml-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          Tampilkan detail
                          <svg
                            className="w-4 h-4 ml-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <>
                      <div className="border-t border-neutral py-4 mt-2">
                        <div className="inline-block w-auto bg-primary/20 justify-center px-4 py-1 text-main font-semibold rounded-full text-xs mb-2">
                          Pergi
                        </div>
                        <div className="flex-col">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <div className="w-2.5 h-2.5 border-neutral border-2 rounded-full"></div>
                              <div className="flex items-center font-semibold text-sm">
                                <p className="text-main text-sm mr-2">
                                  {convertToTime(
                                    bookingDetail?.flight_detail
                                      ?.departure_flight?.departure_time
                                  )}
                                </p>
                                <p className="text-main font-medium">
                                  {
                                    bookingDetail?.flight_detail
                                      ?.departure_flight?.departure_city
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="ml-1 h-[20px] w-[1px] bg-neutral"></div>
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                              <div className="flex items-center font-semibold text-sm">
                                <p className="text-main text-sm mr-2">
                                  {convertToTime(
                                    bookingDetail?.flight_detail
                                      ?.departure_flight?.arrival_time
                                  )}
                                </p>

                                <p className="text-main font-medium">
                                  {
                                    bookingDetail?.flight_detail
                                      ?.departure_flight?.arrival_city
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {bookingDetail?.flight_detail?.return_flight && (
                          <>
                            <div className="inline-block w-auto bg-primary/20 justify-center px-4 py-1 text-main font-semibold rounded-full text-xs mb-2 mt-4">
                              Pulang
                            </div>
                            <div className="flex-col">
                              <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2.5 h-2.5 border-neutral border-2 rounded-full"></div>
                                  <div className="flex items-center font-semibold text-sm">
                                    <p className="text-main text-sm mr-2">
                                      {convertToTime(
                                        bookingDetail?.flight_detail
                                          ?.return_flight?.departure_time
                                      )}
                                    </p>
                                    <p className="text-main font-medium">
                                      {
                                        bookingDetail?.flight_detail
                                          ?.return_flight?.departure_city
                                      }
                                    </p>
                                  </div>
                                </div>
                                <div className="ml-1 h-[20px] w-[1px] bg-neutral"></div>
                              </div>

                              <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                                  <div className="flex items-center font-semibold text-sm">
                                    <p className="text-main text-sm mr-2">
                                      {convertToTime(
                                        bookingDetail?.flight_detail
                                          ?.return_flight?.arrival_time
                                      )}
                                    </p>

                                    <p className="text-main font-medium">
                                      {
                                        bookingDetail?.flight_detail
                                          ?.return_flight?.arrival_city
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="w-full border-t border-neutral py-4">
                        <div className="flex-col">
                          <p className="text-xs font-medium text-gray mb-2">
                            Rincian Harga
                          </p>
                          <div className="flex items-center justify-between text-xs text-main">
                            <span className="font-normal">Harga</span>
                            <span className="font-medium">
                              {formatPrice(
                                bookingDetail?.price_detail?.total_price
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-main">
                            <span className="font-normal">Pajak</span>
                            <span className="font-medium">
                              {formatPrice(bookingDetail?.price_detail?.tax)}
                            </span>
                          </div>
                          {bookingDetail?.price_detail?.tax && (
                            <div className="flex items-center justify-between text-xs text-main">
                              <span className="font-normal">Donasi</span>
                              <span className="font-medium">
                                {formatPrice(
                                  bookingDetail?.price_detail?.donation
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full border-t border-neutral pt-4">
                        <div className="flex items-center justify-between text-xs text-main">
                          <span className="text-xs font-medium text-gray">
                            Total Pembayaran
                          </span>
                          <span className="font-medium">
                            {formatPrice(
                              bookingDetail?.price_detail?.total_price
                            )}
                          </span>
                        </div>
                      </div>
                      {bookingDetail?.status !== "CANCELED" && (
                        <CetakTiket
                          bookingDetail={bookingDetail}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {firstLoading ? (
              <div className="flex flex-col !w-full items-center justify-center text-center font-medium text-sm mt-16">
                <img
                  src="/animations/loading.gif"
                  alt="Loading"
                  className="w-[99px]"
                />
                <p className="text-xs md:text-sm text-main">
                  Mencari riwayat pemesanan...
                </p>
              </div>
            ) : displayedHistory.length > 0 ? (
              <div className="w-full md:w-3/5 lg:w-3/4">
                {displayedHistory.map((flight) => (
                  <RiwayatPemesananCard
                    key={flight.id}
                    flight={flight}
                    onClick={() => handleCardClick(flight)}
                    isSelected={selectedFlight}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col !w-full items-center justify-center text-center font-medium text-sm mt-16">
                <img
                  src="/animations/notfound.gif"
                  alt="Not found"
                  className="w-[99px]"
                />
                <p className="text-xs md:text-sm text-main">
                  Maaf, data tidak ditemukan
                </p>
              </div>
            )}

            {/* Desktop Detail */}
            {selectedFlight && detailLoading && (
              <div className="hidden md:block md:w-1/2 lg:w-1/3 max-w-sm mx-auto overflow-hidden text-main self-start">
                <div className="flex items-center justify-center h-56">
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
              </div>
            )}
            {selectedFlight && !detailLoading && (
              <div className="hidden md:block md:w-1/2 lg:w-1/3 max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden text-main self-start">
                <div className="px-6 py-4">
                  <p className="text-sm font-medium text-gray">
                    Booking Code:{" "}
                    <span className="font-normal">
                      {bookingDetail?.booking_code}
                    </span>
                  </p>
                  {bookingDetail?.status === "UNPAID" && (
                    <p className="text-sm font-semibold text-secondary">
                      Bayar Sebelum:{" "}
                      <span>{convertDateTime(bookingDetail?.paid_before)}</span>
                    </p>
                  )}
                  <h1 className="flex gap-2 font-bold text-xl my-2">
                    {
                      bookingDetail?.flight_detail?.departure_flight
                        ?.departure_city
                    }
                    {bookingDetail?.flight_detail?.return_flight ? (
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
                    {
                      bookingDetail?.flight_detail?.departure_flight
                        ?.arrival_city
                    }
                  </h1>

                  <div className="flex gap-3 border border-neutral rounded-lg items-center mb-4 py-2 px-3">
                    <FaCalendarAlt className="text-gray" />
                    <p className="text-main font-normal text-sm">
                      {formatDateToDayMonthYear(
                        bookingDetail.flight_detail?.departure_flight
                          ?.departure_time
                      )}{" "}
                      <br />
                      {bookingDetail?.flight_detail?.return_flight && (
                        <>
                          {" "}
                          -{" "}
                          {formatDateToDayMonthYear(
                            bookingDetail?.flight_detail?.return_flight
                              ?.departure_time
                          )}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="border-t border-neutral py-4">
                    <div className="inline-block w-auto bg-primary/20 justify-center px-4 py-1 text-main font-semibold rounded-full text-xs mb-2">
                      Pergi
                    </div>
                    <div className="flex-col">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <div className="w-2.5 h-2.5 border-neutral border-2 rounded-full"></div>
                          <div className="flex items-center font-semibold text-sm">
                            <p className="text-main text-sm mr-2">
                              {convertToTime(
                                bookingDetail?.flight_detail?.departure_flight
                                  ?.departure_time
                              )}
                            </p>
                            <p className="text-main font-medium">
                              {
                                bookingDetail?.flight_detail?.departure_flight
                                  ?.departure_city
                              }
                            </p>
                          </div>
                        </div>
                        <div className="ml-1 h-[20px] w-[1px] bg-neutral"></div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                          <div className="flex items-center font-semibold text-sm">
                            <p className="text-main text-sm mr-2">
                              {convertToTime(
                                bookingDetail?.flight_detail?.departure_flight
                                  ?.arrival_time
                              )}
                            </p>

                            <p className="text-main font-medium">
                              {
                                bookingDetail?.flight_detail?.departure_flight
                                  ?.arrival_city
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {bookingDetail?.flight_detail?.return_flight && (
                      <>
                        <div className="inline-block w-auto bg-primary/20 justify-center px-4 py-1 text-main font-semibold rounded-full text-xs mb-2 mt-4">
                          Pulang
                        </div>
                        <div className="flex-col">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <div className="w-2.5 h-2.5 border-neutral border-2 rounded-full"></div>
                              <div className="flex items-center font-semibold text-sm">
                                <p className="text-main text-sm mr-2">
                                  {convertToTime(
                                    bookingDetail?.flight_detail?.return_flight
                                      ?.departure_time
                                  )}
                                </p>
                                <p className="text-main font-medium">
                                  {
                                    bookingDetail?.flight_detail?.return_flight
                                      ?.departure_city
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="ml-1 h-[20px] w-[1px] bg-neutral"></div>
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                              <div className="flex items-center font-semibold text-sm">
                                <p className="text-main text-sm mr-2">
                                  {convertToTime(
                                    bookingDetail?.flight_detail?.return_flight
                                      ?.arrival_time
                                  )}
                                </p>

                                <p className="text-main font-medium">
                                  {
                                    bookingDetail?.flight_detail?.return_flight
                                      ?.arrival_city
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="w-full border-t border-neutral py-4">
                    <div className="flex-col">
                      <p className="text-xs font-medium text-gray mb-2">
                        Rincian Harga
                      </p>
                      <div className="flex items-center justify-between text-sm text-main">
                        <span className="font-normal">Harga</span>
                        <span className="font-medium">
                          {formatPrice(
                            bookingDetail?.price_detail?.total_price
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-main">
                        <span className="font-normal">Pajak</span>
                        <span className="font-medium">
                          {formatPrice(bookingDetail?.price_detail?.tax)}
                        </span>
                      </div>
                      {bookingDetail?.price_detail?.tax && (
                        <div className="flex items-center justify-between text-sm text-main">
                          <span className="font-normal">Donasi</span>
                          <span className="font-medium">
                            {formatPrice(bookingDetail?.price_detail?.donation)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full border-t border-neutral pt-4">
                    <div className="flex items-center justify-between text-sm text-main">
                      <span className="text-xs font-medium text-gray">
                        Total Pembayaran
                      </span>
                      <span className="font-medium">
                        {formatPrice(bookingDetail?.price_detail?.total_price)}
                      </span>
                    </div>
                  </div>

                  {bookingDetail?.status !== "CANCELED" && (
                    <CetakTiket
                      bookingDetail={bookingDetail}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <BackToTopButton />
      <Footer />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Footer from "../components/navigations/Footer";
import Navbar from "../components/navigations/Navbar";
import FlightCard from "../components/cards/HasilPencarianCard";
import FilterButton from "../components/buttons/FilterButton";
import FilterMultipleButton from "../components/buttons/FilterMultipleButton";
import { useSelector, useDispatch } from "react-redux";
import { addDays, format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import UnifiedModal from "../components/modals/Modal";
import { getFlightSearchResults } from "../redux/actions/searchFlightActions";
import { setFavDestinationResults, setFlightKeyword, setPromoResult } from "../redux/reducers/searchFlightReducers";
import { toast } from "react-toastify";
import { setBooking } from "../redux/reducers/bookingReducers";
import SelectedTicketCard from "../components/cards/SelectedTicketCard";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getPromoById } from "../redux/actions/promoActions";
import BackToTopButton from "../components/navigations/BackToTop";
import BackButtonMobile from "../components/navigations/BackButtonMobile";

export default function HasilPencarian() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("2024-05-23");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [sortOption, setSortOption] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [changedFlightKeyword, setChangedFlightKeyword] = useState(null);
  const [loading, setLoading] = useState(location.state?.loading || false);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    departureResults = [],
    returnResults = [],
    promoResult = null,
    favDestinationResults = [],
    flightKeyword = {},
    tripTypeSaved = null,
  } = useSelector((state) => state.search);

  const passengerFromModal = useSelector((state) => state?.bookingFlight?.passenger);

  const { from, to, departureDate, returnDate, passengers, flightClass } =
    flightKeyword;

  const {
    adults,
    children,
    infants,
  } = flightKeyword?.passengers || {};
  const totalPassenger = adults + children + infants;

  const changedPassengers = changedFlightKeyword?.passengers || {adults, children, infants};
  const {
    adults: changedAdults,
    children: changedChildren,
    infants: changedInfants
  } = changedPassengers;
  
  const totalChangedPassengers =
    changedAdults + changedChildren + changedInfants;

  const initialData = {
    passengers: { adults: 1, children: 0, infants: 0 },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (tripTypeSaved === "roundtrip" && selectedDeparture && selectedReturn) {
      handleConfirmPage();
    } else if (tripTypeSaved === "singletrip" && selectedDeparture) {
      handleConfirmPage();
    } else if (tripTypeSaved === null && promoResult && selectedDeparture) {
      handleConfirmPage();
    } else if (tripTypeSaved === null && favDestinationResults.length > 0 && selectedDeparture) {
      handleConfirmPage();
    } 
  }, [selectedDeparture, selectedReturn, tripTypeSaved, promoResult, favDestinationResults]);

  const openModal = (type, data) => {
    setModalType(type);
    if (type === "date") {
      setModalData(
        data === "departure"
          ? {
              startDate: departureDate ? parseISO(departureDate) : new Date(),
              endDate: null,
            }
          : {
              startDate: departureDate ? parseISO(departureDate) : new Date(),
              endDate: returnDate ? parseISO(returnDate) : null,
            }
      );
    } else {
      setModalData(data);
    }
    setIsModalOpen(true);
  };

  const handleSave = (data, endDate) => {
    if (modalType === "city") {
      if (modalData === "from" && data.cityIata === to?.cityIata) {
        toast.error("Kota keberangkatan tidak boleh sama dengan kota tujuan.");
        return;
      }
      if (modalData === "to" && data.cityIata === from?.cityIata) {
        toast.error("Kota tujuan tidak boleh sama dengan kota keberangkatan.");
        return;
      }

      setChangedFlightKeyword((prev) => ({
        ...prev,
        [modalData]: data,
      }));
    } else if (modalType === "date") {
      const departureDate =
        data && data.toISOString ? data.toISOString().split("T")[0] : null;
      const returnDate =
        endDate && endDate.toISOString
          ? endDate.toISOString().split("T")[0]
          : null;

      setChangedFlightKeyword((prev) => ({
        ...prev,
        departureDate: departureDate,
        returnDate: returnDate,
      }));
    } else if (modalType === "class") {
      setChangedFlightKeyword((prev) => ({
        ...prev,
        flightClass: data,
      }));
    } else if (modalType === "passenger") {
      setChangedFlightKeyword((prev) => ({
        ...prev,
        passengers: data,
      }));
    }
    setIsModalOpen(false);
  };

  const handleSaveToState = () => {
    const updatedKeyword = {
      ...flightKeyword,
      ...changedFlightKeyword,
      departureDate: format(
        parseISO(
          changedFlightKeyword?.departureDate ||
            departureDate ||
            new Date().toISOString().split("T")[0]
        ),
        "yyyy-MM-dd"
      ),
      returnDate: tripTypeSaved === "roundtrip" ? (
        changedFlightKeyword?.returnDate
          ? format(parseISO(changedFlightKeyword.returnDate), "yyyy-MM-dd")
          : returnDate
          ? format(parseISO(returnDate), "yyyy-MM-dd")
          : null
      ) : null,
      passengers: changedFlightKeyword?.passengers || passengers,
      flightClass: changedFlightKeyword?.flightClass || flightClass
    };

    setSelectedDeparture(null);
    setSelectedReturn(null);
    dispatch(getFlightSearchResults(updatedKeyword, navigate, setLoading));
    dispatch(setPromoResult(null))
    dispatch(setFavDestinationResults([]))
    dispatch(setFlightKeyword(updatedKeyword));
  };

  const handleAllClick = () => {
    setIsAllSelected((prev) => !prev);
    setSortOption(null);
    setSelectedFacilities([]);
    setPriceRange([0, Infinity]);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  let resultsToUse;

  if (departureResults.length > 0 && tripTypeSaved === "singletrip") {
    resultsToUse = departureResults;
  } else if (departureResults.length > 0 && tripTypeSaved === "roundtrip") {
    if (selectedDeparture && selectedReturn) {
      resultsToUse = [];
    } else if (selectedDeparture && selectedReturn === null) {
      resultsToUse = returnResults;
    } else if (selectedDeparture === null && selectedReturn) {
      resultsToUse = departureResults;
    } else {
      resultsToUse = departureResults;
    }
  } else if (departureResults.length > 0) {
    resultsToUse = departureResults;
  } else if (favDestinationResults.length > 0) {
    resultsToUse = favDestinationResults;
  }else if ([promoResult]) {
    resultsToUse = [promoResult];
  } else {
    resultsToUse = [];
  }

  const uniqueFacilities = Array.from(
    new Set(
      resultsToUse.flatMap((flight) => flight?.airplane?.inFlightFacility || [])
    )
  );

  const facilityOptions = [
    "WiFi",
    "Entertainment",
    "Meal",
    "Extra Legroom",
    "Lounge",
  ];

  const handleFacilityChange = (facility) => {
    setSelectedFacilities((prev) => {
      if (prev.includes(facility)) {
        return prev.filter((f) => f !== facility);
      } else {
        return [...prev, facility];
      }
    });
  };

  const handlePriceRangeChange = (range) => {
    if (range === "IDR 0 - 4.000.000") {
      setPriceRange([0, 4000000]);
    } else if (range === "IDR 4.000.000 - 8.000.000") {
      setPriceRange([4000000, 8000000]);
    } else if (range === "> IDR 8.000.000") {
      setPriceRange([8000000, Infinity]);
    } else {
      setPriceRange([0, Infinity]);
    }
  };

  const sortedAndFilteredResults = resultsToUse
    .filter((flight) => flight && flight.price !== undefined)
    .filter((flight) => {
      const facilitiesMatch =
        selectedFacilities.length === 0 ||
        (flight.airplane.inFlightFacility &&
          selectedFacilities.some((facility) =>
            flight.airplane.inFlightFacility.includes(facility)
          ));
      const priceMatch =
        flight.price >= priceRange[0] && flight.price <= priceRange[1];
      return facilitiesMatch && priceMatch;
    })
    .sort((a, b) => {
      if (sortOption === "Harga - Terendah ke Tertinggi") {
        return a.price - b.price;
      } else if (sortOption === "Harga - Tertinggi ke Terendah") {
        return b.price - a.price;
      } else if (sortOption === "Durasi - Terpendek ke Terlama") {
        const durationA =
          new Date(a.flight.arrival.time) - new Date(a.flight.departure.time);
        const durationB =
          new Date(b.flight.arrival.time) - new Date(b.flight.departure.time);
        return durationA - durationB;
      } else if (sortOption === "Durasi - Terlama ke Terpendek") {
        const durationA =
          new Date(a.flight.arrival.time) - new Date(a.flight.departure.time);
        const durationB =
          new Date(b.flight.arrival.time) - new Date(b.flight.departure.time);
        return durationB - durationA;
      }
      return 0;
    });

  const generateDateList = () => {
    const startDate = parseISO(
      departureDate || new Date().toISOString().split("T")[0]
    );
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      const formattedDate = {
        day: format(date, "EEEE", { locale: id }),
        date: format(date, "d MMMM yyyy", { locale: id }),
        value: format(date, "yyyy-MM-dd"),
      };
      days.push(formattedDate);
    }
    return days;
  };

  const formatDateToDayMonthYear = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return "";
    }

    const [year, month, day] = dateString.split("-");
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const days = generateDateList();

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

  const handleDateClick = (dateValue) => {
    const departureDate = dateValue;
    const arrivalDate =
      tripTypeSaved === "roundtrip"
        ? addDays(new Date(dateValue), 1).toISOString().split("T")[0]
        : null;

    setSelectedDay(dateValue);

    const updatedKeyword = {
      ...flightKeyword,
      departureDate: departureDate,
      returnDate: arrivalDate,
    };

    setSelectedDeparture(null);
    setSelectedReturn(null);
    dispatch(getFlightSearchResults(updatedKeyword, navigate, setLoading))
    dispatch(setFlightKeyword(updatedKeyword));
  };

  const handleTicketSelect = (ticket) => {
    if (tripTypeSaved === "roundtrip") {
      if (!selectedDeparture) {
        setSelectedDeparture(ticket);
      } else if (!selectedReturn) {
        setSelectedReturn(ticket);
      }
    } else {
      setSelectedDeparture(ticket);
    }
  };

  const handleEditSelected = () => {
    setSelectedDeparture(null);
  };

  const swapLocations = () => {
    setChangedFlightKeyword((prevKeyword) => ({
      ...prevKeyword,
      from: flightKeyword.to,
      to: flightKeyword.from,
    }));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleConfirmPage = () => {
    const data = {
      selectedDeparture,
      selectedReturn,
      passengers: departureResults.length > 0 ? passengers : (promoResult || favDestinationResults.length > 0 ? passengerFromModal : passengers)
    };
    dispatch(setBooking(data));
    localStorage.setItem("booking", JSON.stringify(data));
    navigate("/konfirmasi-tiket");
  };

  return (
    <div className="bg-background">
      <div className="hidden md:block">
        <Navbar transparent={false} />
      </div>

      <BackButtonMobile />

      {/* Hasil Pencarian Section */}
      <section className="pt-3 md:pt-20 pb-8 md:pb-64">
        <div>
          {/* Breadcrumb */}
          <div className="container hidden md:flex gap-1.5 text-main text-xs font-medium -mt-4 md:-mt-0 mb-10 md:mb-10 lg:mb-5">
            <a href="/">Beranda</a>
            <img src="/icons/right-chev.svg" alt="chevron" />
            <span>Hasil Pencarian</span>
          </div>

          <h1 className="container block md:hidden text-2xl font-bold text-main mb-16">
            Cari Penerbangan
          </h1>

          {/* Search Flight Desktop */}
          <div className="container hidden md:block relative mt-6">
            {/* Banner */}
            <img
              src="/search-flight-banner.png"
              alt="Banner"
              className="w-full"
            />

            {/* Search Field */}
            <div className="absolute inset-x-0 md:top-[5%] lg:top-[30%] transform -translate-y-1/2 mx-auto w-full bg-white items-center rounded-full text-base shadow-md ps-8 pe-3 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
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

              {/* Search Input Description */}
              <div className="flex justify-between items-center">
                <div className="flex gap-6 items-center text-sm font-medium text-main">
                  {/* Destination */}
                  <div className="ps-8 flex gap-2 items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => openModal("city", "from")}
                    >
                      {changedFlightKeyword?.from?.name || from?.name || (
                        <div className="text-gray">Dari mana?</div>
                      )}
                    </span>
                    <SwapButton onClick={swapLocations} />
                    <span
                      className="cursor-pointer"
                      onClick={() => openModal("city", "to")}
                    >
                      {changedFlightKeyword?.to?.name || to?.name || (
                        <div className="text-gray">Mau ke mana?</div>
                      )}
                    </span>
                  </div>

                  {/* Vertical Line */}
                  <div className="h-[27px] w-[1px] bg-gray"></div>

                  {/* Date */}
                  <div className="flex items-center gap-4">
                    <span
                      className="cursor-pointer"
                      onClick={() => openModal("date", "departure")}
                    >
                      {formatDateToDayMonthYear(
                        changedFlightKeyword?.departureDate || departureDate || new Date().toISOString().split("T")[0]
                      )}
                    </span>
                    {returnDate && (
                      <>
                        <span>-</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => openModal("date", "return")}
                        >
                          {formatDateToDayMonthYear(
                            changedFlightKeyword?.returnDate || returnDate || new Date().toISOString().split("T")[0]
                          )}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Vertical Line */}
                  <div className="h-[27px] w-[1px] bg-gray"></div>

                  {/* Passengers */}
                  <span
                    className="cursor-pointer"
                    onClick={() => openModal("passenger")}
                  >
                    {totalChangedPassengers || totalPassenger || (passengerFromModal.adults + passengerFromModal.children + passengerFromModal.infants)} Penumpang
                  </span>

                  {/* Vertical Line */}
                  <div className="h-[27px] w-[1px] bg-gray"></div>

                  {/* Class */}
                  <span
                    className="cursor-pointer"
                    onClick={() => openModal("class")}
                  >
                    {changedFlightKeyword?.flightClass || flightClass || (
                      <div className="text-gray">Pilih kelas</div>
                    )}
                  </span>
                </div>
                {/* Button Change Search */}
                <button
                  onClick={handleSaveToState}
                  className="bg-primary hover:bg-darkprimary rounded-full text-white text-sm lg:text-base font-medium px-8 lg:px-12 py-2.5"
                >
                  Ubah
                </button>
              </div>
            </div>

            <UnifiedModal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              type={modalType}
              onSave={handleSave}
              initialData={initialData}
            />
          </div>

          {/* Search Flight Mobile */}
          <div className="container block md:hidden relative -mt-4">
            {/* Banner */}
            <img
              src="/profile-page/banner.png"
              alt="Banner"
              className="w-full h-44"
            />

            <div className="absolute inset-x-0 -top-[12%] transform -translate-y-1/2 mx-auto w-full md:w-[1080px] bg-white items-center rounded-lg text-base shadow-md p-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary mt-20">
              {/* Search Input Description */}
              <div className="flex flex-col gap-3 text-sm font-medium text-main">
                {/* Destination */}
                <div className="flex justify-between text-base font-semibold items-center">
                  <span
                    className="cursor-pointer border border-neutral rounded-lg py-2 px-8"
                    onClick={() => openModal("city", "from")}
                  >
                    {changedFlightKeyword?.from?.name || from?.name || (
                      <div className="text-gray">Dari mana?</div>
                    )}
                  </span>
                  <SwapButton onClick={swapLocations} />
                  <span
                    className="cursor-pointer border border-neutral rounded-lg py-2 px-8"
                    onClick={() => openModal("city", "to")}
                  >
                    {changedFlightKeyword?.to?.name || to?.name || (
                      <div className="text-gray">Mau ke mana?</div>
                    )}
                  </span>
                </div>
                {/* Date */}
                <div className="flex justify-center items-center gap-4 bg-white rounded-lg border border-neutral py-3 px-4">
                  <span
                    className="cursor-pointer"
                    onClick={() => openModal("date", "departure")}
                  >
                    {formatDateToDayMonthYear(
                      changedFlightKeyword?.departureDate || departureDate || new Date().toISOString().split("T")[0]
                    )}
                  </span>
                  {returnDate && (
                    <>
                      <span>-</span>
                      <span
                        className="cursor-pointer"
                        onClick={() => openModal("date", "return")}
                      >
                        {formatDateToDayMonthYear(
                          changedFlightKeyword?.returnDate || returnDate || new Date().toISOString().split("T")[0]
                        )}
                      </span>
                    </>
                  )}
                </div>
                {/* Passenger */}
                <div className="flex justify-between">
                  {/* Passenger */}
                  <div className="flex items-center gap-3 bg-white rounded-lg">
                    {/* Passengers */}
                    <span
                      className="cursor-pointer border border-neutral rounded-lg py-2 px-4 "
                      onClick={() => openModal("passenger")}
                    >
                      {totalChangedPassengers || totalPassenger || (passengerFromModal.adults + passengerFromModal.children + passengerFromModal.infants)} Penumpang
                    </span>

                    {/* Class */}
                    <span
                      className="cursor-pointer border border-neutral rounded-lg py-2 px-4"
                      onClick={() => openModal("class")}
                    >
                      {changedFlightKeyword?.flightClass || flightClass || (
                        <div className="text-gray">Pilih kelas</div>
                      )}
                    </span>
                  </div>
                  {/* Button Change Search */}
                  <button
                    onClick={handleSaveToState}
                    className="bg-primary hover:bg-darkprimary rounded-full text-white text-sm lg:text-base font-medium px-8 lg:px-12 py-2.5"
                  >
                    Ubah
                  </button>
                </div>
              </div>
            </div>

            <UnifiedModal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              type={modalType}
              onSave={handleSave}
              initialData={initialData}
            />
          </div>

          {/* Date List Desktop */}
          <div className="container hidden md:flex justify-center items-center bg-gray-100 mt-5">
            <div className="flex w-full items-center border border-neutral rounded-xl overflow-hidden text-center">
              {days.map((day, index) => (
                <div
                  key={day.value}
                  className={`py-3 md:px-4 lg:px-7 cursor-pointer flex-grow ${
                    selectedDay === day.value ? "bg-primary/20" : "bg-white"
                  } hover:bg-primary/20 active:bg-primary/20 transition-colors duration-200 ${
                    index !== 0 ? "border-l border-neutral" : ""
                  }`}
                  onClick={() => handleDateClick(day.value)}
                >
                  <h5 className="text-base font-semibold text-main">
                    {day.day}
                  </h5>
                  <div className="text-sm font-normal text-darkgray">
                    {day.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date List Mobile */}
          <div className="container block md:hidden overflow-x-auto whitespace-nowrap border-b-2 border-primary">
            {days.map((day, index) => (
              <div
                key={day.value}
                className={`inline-block text-center px-4 py-2 cursor-pointer ${
                  selectedDay === day.value ? "bg-primary/20" : "bg-white"
                } hover:bg-primary/20 active:bg-primary/20 transition-colors duration-200 ${
                  index !== 0 ? "border-l border-neutral" : ""
                }`}
                onClick={() => handleDateClick(day.value)}
              >
                <div className="font-semibold text-xs text-main">{day.day}</div>
                <div className="font-normal text-xs text-main">{day.date}</div>
              </div>
            ))}
          </div>

          {/* Filter Desktop */}
          <div className="container hidden md:flex space-x-3 items-center mt-5">
            <button
              onClick={handleAllClick}
              className={`text-xs md:text-sm font-medium rounded-full px-4 py-2 border-2 ${
                selectedFacilities.length === 0 && priceRange[0] === 0 && priceRange[1] === Infinity && sortOption === null
                  ? "bg-primary text-white"
                  : "bg-white text-primary border-primary"
              }`}
            >
              Semua
            </button>
            <FilterButton
              label="Urutkan"
              options={[
                "Harga - Terendah ke Tertinggi",
                "Harga - Tertinggi ke Terendah",
                "Durasi - Terpendek ke Terlama",
                "Durasi - Terlama ke Terpendek",
              ]}
              iconSrc="/icons/filter.svg"
              onOptionSelect={handleSortChange}
              selectedOption={sortOption}
            />
            <FilterMultipleButton
              label="Fasilitas"
              options={facilityOptions}
              iconSrc="/icons/facility.svg"
              onOptionSelect={handleFacilityChange}
              selectedOption={selectedFacilities}
            />
            <FilterButton
              label="Harga"
              options={[
                "IDR 0 - 4.000.000",
                "IDR 4.000.000 - 8.000.000",
                "> IDR 8.000.000",
              ]}
              iconSrc="/icons/price.svg"
              onOptionSelect={handlePriceRangeChange}
              selectedOption={
                priceRange[0] === 0 && priceRange[1] === Infinity
                  ? null
                  : priceRange[1] === Infinity
                  ? `> IDR 8.000.000`
                  : `IDR ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}`
              }
            />
          </div>

          {/* Filter Mobile */}
          <>
            <div className="container flex md:hidden items-center mt-3">
              <button
                className={`rounded-full text-xs font-medium py-2 px-6 ${
                  isAllSelected
                    ? "bg-primary text-white"
                    : "bg-white border border-primary text-primary"
                }`}
                onClick={handleAllClick}
              >
                Semua
              </button>
            </div>
            <div
              className="md:hidden fixed inset-x-0 bottom-0 bg-white flex justify-around p-4 shadow-inner"
              style={{
                boxShadow:
                  "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -2px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FilterButton
                label="Urutkan"
                options={[
                  "Harga - Terendah ke Tertinggi",
                  "Harga - Tertinggi ke Terendah",
                  "Durasi - Terpendek ke Terlama",
                  "Durasi - Terlama ke Terpendek",
                ]}
                iconSrc="/icons/filter.svg"
                onOptionSelect={handleSortChange}
                selectedOption={sortOption}
              />
              <FilterButton
                label="Fasilitas"
                options={uniqueFacilities}
                iconSrc="/icons/facility.svg"
                onOptionSelect={handleFacilityChange}
                selectedOption={selectedFacilities.join(", ")}
              />
              <FilterButton
                label="Harga"
                options={[
                  "IDR 0 - 4.000.000",
                  "IDR 4.000.000 - 8.000.000",
                  "> IDR 8.000.000",
                ]}
                iconSrc="/icons/price.svg"
                onOptionSelect={handlePriceRangeChange}
                selectedOption={
                  priceRange[0] === 0 && priceRange[1] === Infinity
                    ? null
                    : priceRange[1] === Infinity
                    ? `> IDR 8.000.000`
                    : `IDR ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}`
                }
              />
            </div>
          </>

          {/* Selected Card */}
          <div className="container mt-3 md:mt-5">
            {selectedDeparture && (
              <>
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-main text-base">
                    Tiket yang Dipilih:
                  </h1>
                  {(selectedDeparture || selectedReturn) && (
                    <div className="flex justify-end mt-4">
                      <button
                        className="px-4 py-1 text-xs md:text-sm w-auto text-center bg-primary text-white rounded-full border-2 border-primary hover:bg-darkprimary hover:border-darkprimary"
                        onClick={handleConfirmPage}
                      >
                        Lanjut
                        <BsArrowRight className="inline-block ml-2" />
                      </button>
                    </div>
                  )}
                </div>
                <SelectedTicketCard
                  ticket={selectedDeparture}
                  isExpanded={isExpanded}
                  toggleExpand={toggleExpand}
                  convertToTime={convertToTime}
                  formatPrice={formatPrice}
                  calculateDuration={calculateDuration}
                  onEdit={handleEditSelected}
                />
              </>
            )}

            {selectedReturn && (
              <>
                <SelectedTicketCard
                  ticket={selectedReturn}
                  isExpanded={isExpanded}
                  toggleExpand={toggleExpand}
                  convertToTime={convertToTime}
                  formatPrice={formatPrice}
                  calculateDuration={calculateDuration}
                  onEdit={handleEditSelected}
                />
              </>
            )}
          </div>

          {/* Card */}
          <div className="container mt-3 md:mt-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center text-center font-medium text-sm mt-16">
                <img
                  src="/animations/loading.gif"
                  alt="Loading"
                  className="w-[99px]"
                />
                <p className="text-main">Mencari penerbangan terbaik...</p>
              </div>
            ) : sortedAndFilteredResults.length > 0 ? (
              sortedAndFilteredResults.map((flight, index) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  isSelected={
                    selectedDeparture?.id === flight.id ||
                    selectedReturn?.id === flight.id
                  }
                  onSelect={handleTicketSelect}
                  isroundtrip={tripTypeSaved === "roundtrip"}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center font-medium text-sm mt-16">
                <img
                  src="/animations/notfound.gif"
                  alt="Not found"
                  className="w-[99px]"
                />
                {departureResults.length > 0 && returnResults.length === 0 ? (
                  <>
                    <p className="text-main">
                      Maaf, penerbangan untuk pulang tidak ditemukan
                    </p>
                    <p className="text-primary">Coba pilih tanggal lain!</p>
                  </>
                ) : (
                  <>
                    <p className="text-main">Maaf, pencarian tidak ditemukan</p>
                    <p className="text-primary">
                      Coba cari penerbangan lainnya!
                    </p>
                  </>
                )}
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

const SwapButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="md:mx-2 md:p-2 rounded-full focus:outline-none"
  >
    <img src="/icons/exchange.svg" alt="exchange" className="w-6 h-6" />
  </button>
);

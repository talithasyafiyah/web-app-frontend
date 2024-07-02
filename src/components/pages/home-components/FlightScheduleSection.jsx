import React, { useEffect, useState } from "react";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
} from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import UnifiedModal from "../../modals/Modal";
import { getFlightSearchResults } from "../../../redux/actions/searchFlightActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addDays, format } from "date-fns";
import { toast } from "react-toastify";
import {
  setDepartureResults,
  setFavDestinationResults,
  setFlightKeyword,
  setPromoResult,
  setTripTypeSaved,
} from "../../../redux/reducers/searchFlightReducers";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const FlightSchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [tripType, setTripType] = useState("singletrip");
  const [swalProps, setSwalProps] = useState({});
  const [from, setFrom] = useState("BCN");
  const [to, setTo] = useState("RIO");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 1));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [flightClass, setFlightClass] = useState("Economy");

  const searchResults = useSelector(
    (state) => state?.search.flightSearchResults
  );

  useEffect(() => {
  }, [searchResults]);

  const swapLocations = () => {
    setFrom((prevFrom) => to);
    setTo((prevTo) => from);
  };

  const openModal = (type, data) => {
    setModalType(type);
    if (type === "date") {
      setModalData({ startDate: departureDate, endDate: returnDate });
    } else {
      setModalData(data);
    }
    setIsModalOpen(true);
  };

  const handleSave = (data, endDate) => {
    if (modalType === "city") {
      if (modalData === "from" && data.cityIata === to.cityIata) {
        toast.error("Kota keberangkatan tidak boleh sama dengan kota tujuan.");
        return;
      }
      if (modalData === "to" && data.cityIata === from.cityIata) {
        toast.error("Kota tujuan tidak boleh sama dengan kota keberangkatan.");
        return;
      }
      modalData === "from" ? setFrom(data) : setTo(data);
    } else if (modalType === "date") {
      setDepartureDate(data);
      if (tripType === "roundtrip") {
        setReturnDate(endDate);
      }
    } else if (modalType === "class") {
      setFlightClass(data);
    } else if (modalType === "passenger") {
      setPassengers(data);
    }
    setIsModalOpen(false);
  };

  const handleSaveToState = () => {
    if (!from.cityIata || !to.cityIata) {
      showSwal();
      return;
    }

    const flightData = {
      from,
      to,
      departureDate: format(departureDate, "yyyy-MM-dd"),
      returnDate:
        tripType === "roundtrip" ? format(returnDate, "yyyy-MM-dd") : null,
      passengers,
      flightClass,
      tripType,
    };

    dispatch(setTripTypeSaved(tripType));
    dispatch(setFavDestinationResults([]));
    dispatch(setPromoResult([]));
    dispatch(setDepartureResults([]));
    dispatch(getFlightSearchResults(flightData, navigate, setLoading));
    dispatch(setFlightKeyword(flightData));
  };

  const showSwal = () => {
    withReactContent(Swal)
      .fire({
        title: "<b>Pilih kota dulu yuk!</b>",
        html: `
        Pilih kota keberangkatan dan tujuan sebelum mencari penerbangan.
      `,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Pilih",
        customClass: {
          confirmButton:
            "inline-block bg-[#00A8D0] hover:bg-darkprimary text-white px-12 py-2 rounded-full",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (!from.cityIata) {
            openModal("city", "from");
          } else if (!to.cityIata) {
            openModal("city", "to");
          }
        }
      });
  };

  return (
    <div className="relative z-20 py-4 lg:py-4 px-6 bg-white shadow-lg rounded-tr-xl rounded-br-xl rounded-bl-xl w-full mx-auto -mt-14 lg:-mt-24">
      <TripTypeSelector tripType={tripType} setTripType={setTripType} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-6 lg:gap-2 items-center mt-4 lg:mt-8">
        <LocationSelector
          label="Dari"
          icon={<FaPlaneDeparture className="mr-2 text-secondary" />}
          location={from}
          openModal={() => openModal("city", "from")}
        />
        <SwapButton onClick={swapLocations} tripType={tripType} />
        <LocationSelector
          label="Ke"
          icon={<FaPlaneArrival className="mr-2 text-secondary" />}
          location={to}
          openModal={() => openModal("city", "to")}
        />
        <DateSelector
          label="Keberangkatan"
          date={departureDate}
          openModal={() => openModal("date", "departure")}
        />
        {tripType === "roundtrip" && (
          <DateSelector
            label="Kepulangan"
            date={returnDate}
            openModal={() => openModal("date", "return")}
          />
        )}
        <PassengerAndClassSelectors
          passengers={passengers}
          flightClass={flightClass}
          openModal={openModal}
        />
      </div>
      <SearchButton onClick={handleSaveToState} loading={loading} />
      <UnifiedModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        type={modalType}
        onSave={handleSave}
        initialData={modalData}
      />
    </div>
  );
};

const TripTypeSelector = ({ tripType, setTripType }) => (
  <div className="absolute top-0 left-0 w-full flex justify-start -translate-y-10">
    <div className="bg-white rounded-t-xl flex">
      <button
        className={`px-3 py-2.5 lg:px-4 lg:py-2 rounded-tl-xl text-sm lg:text-base font-medium ${
          tripType === "singletrip" ? "bg-white" : "bg-primary text-white"
        }`}
        onClick={() => setTripType("singletrip")}
      >
        Sekali Jalan
      </button>
      <button
        className={`px-3 py-2.5 lg:px-4 lg:py-2 rounded-tr-xl text-sm lg:text-base font-medium ${
          tripType === "roundtrip" ? "bg-white" : "bg-primary text-white"
        }`}
        onClick={() => setTripType("roundtrip")}
      >
        Pulang-Pergi
      </button>
    </div>
  </div>
);

const LocationSelector = ({ label, icon, location, openModal }) => (
  <div className="flex flex-col border border-neutral p-3 rounded-xl cursor-pointer">
    <label className="mb-0 lg:mb-2 flex items-center text-primary">
      {icon}
      {label}
    </label>
    <button className="p-2 text-left rounded outline-none" onClick={openModal}>
      {location.name || (
        <p className="text-gray">{`${label.toLowerCase()} mana?`}</p>
      )}
    </button>
  </div>
);

const SwapButton = ({ onClick, tripType }) => (
  <button
    onClick={onClick}
    className={`absolute lg:top-[35%] left-[80%] lg:left-[17.5%] transform lg:-translate-x-1/2 bg-gray-200 p-2 rounded-full bg-white shadow ${
      tripType === "singletrip" ? "top-[22%]" : "top-[18%]"
    }`}
  >
    <img src="/icons/exchange.svg" alt="exchange" className="w-6 h-6" />
  </button>
);

const DateSelector = ({ label, date, openModal }) => (
  <div className="flex flex-col border border-neutral p-3 rounded-xl cursor-pointer w-full">
    <label className="mb-0 lg:mb-2 flex items-center text-primary">
      <FaCalendarAlt className="mr-2 text-secondary" />
      {label}
    </label>
    <button className="p-2 text-left rounded outline-none" onClick={openModal}>
      {date instanceof Date ? date.toLocaleDateString() : date}
    </button>
  </div>
);

const PassengerAndClassSelectors = ({ passengers, flightClass, openModal }) => (
  <>
    <div className="hidden lg:flex flex-col border border-neutral p-3 rounded-xl cursor-pointer">
      <label className="mb-0 lg:mb-2 flex items-center text-primary">
        <PassengerIcon />
        Penumpang
      </label>
      <button
        className="py-2 text-left rounded outline-none truncate"
        onClick={() => openModal("passenger")}
      >
        {`${passengers.adults} Dewasa, ${passengers.children} Anak, ${passengers.infants} Bayi`}
      </button>
    </div>
    <div className="hidden lg:flex flex-col border border-neutral p-3 rounded-xl cursor-pointer">
      <label className="mb-0 lg:mb-2 flex items-center text-primary">
        <ClassIcon />
        Kelas
      </label>
      <button
        className="p-2 text-left rounded outline-none"
        onClick={() => openModal("class")}
      >
        {flightClass}
      </button>
    </div>
    <div className="grid grid-cols-2 gap-2 lg:hidden">
      <div className="flex flex-col border border-neutral p-3 rounded-xl cursor-pointer">
        <label className="mb-0 lg:mb-2 flex items-center text-primary">
          <PassengerIcon />
          Penumpang
        </label>
        <button
          className="py-2 text-left rounded outline-none truncate"
          onClick={() => openModal("passenger")}
        >
          {`${passengers.adults} Dewasa, ${passengers.children} Anak, ${passengers.infants} Bayi`}
        </button>
      </div>
      <div className="flex flex-col border border-neutral p-3 rounded-xl cursor-pointer">
        <label className="mb-0 lg:mb-2 flex items-center text-primary">
          <ClassIcon />
          Kelas
        </label>
        <button
          className="p-2 text-left rounded outline-none"
          onClick={() => openModal("class")}
        >
          {flightClass}
        </button>
      </div>
    </div>
  </>
);

const SearchButton = ({ onClick, loading }) => (
  <div className="flex justify-center lg:justify-end mt-4">
    <button
      className={`px-4 py-2 w-full lg:w-56 text-center bg-primary text-white rounded-full border-2 border-primary ${
        loading ? "opacity-50 px-10" : "hover:bg-white hover:text-primary"
      }`}
      onClick={onClick}
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
              stroke="currentColor"
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
        <>
          Cari Penerbangan <BsArrowRight className="inline-block ml-2" />
        </>
      )}
    </button>
  </div>
);

const PassengerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.2em"
    height="1.2em"
    viewBox="0 0 24 24"
    className="text-secondary mr-2"
  >
    <path
      fill="currentColor"
      d="M9 19h6v2H9c-2.76 0-5-2.24-5-5V7h2v9c0 1.66 1.34 3 3 3m1.42-13.59c.78-.78.78-2.05 0-2.83s-2.05-.78-2.83 0s-.78 2.05 0 2.83c.78.79 2.04.79 2.83 0M11.5 9c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v6c0 1.66 1.34 3 3 3h5.07l3.5 3.5L20 20.07L14.93 15H11.5z"
    ></path>
  </svg>
);

const ClassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.2em"
    height="1.2em"
    viewBox="0 0 256 256"
    className="text-secondary mr-2"
  >
    <path
      fill="currentColor"
      d="M224 232a8 8 0 0 1-8 8H112a8 8 0 0 1 0-16h104a8 8 0 0 1 8 8m-16-88h-64.22L112 80l14.19-26.32a1.5 1.5 0 0 0 .11-.22A16 16 0 0 0 119.15 32l-.47-.22L85 17.57a16 16 0 0 0-21.2 7.27l-22.12 44a16.1 16.1 0 0 0 0 14.32l58.11 116a15.93 15.93 0 0 0 14.32 8.84H208a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16"
    ></path>
  </svg>
);

export default FlightSchedule;

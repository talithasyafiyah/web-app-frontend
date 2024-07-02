import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import "../../DatePickerStyles.css";
import "../../modal.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getCities,
  getCitySearchResults,
} from "../../redux/actions/searchFlightActions";
import {
  setCityKeyword,
  setCitySearchResult,
} from "../../redux/reducers/searchFlightReducers";
import { useDebounce } from "../../utils/debounce";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { id } from "date-fns/locale";
import { ThreeDots } from 'react-loader-spinner'

Modal.setAppElement("#root");

const UnifiedModal = ({
  isOpen,
  onRequestClose,
  type,
  onSave,
  initialData,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const searchTerm = useSelector((state) => state?.search.cityKeyword);
  const citySearchResult = useSelector(
    (state) => state?.search.citySearchResults
  );

  const [selectedClass, setSelectedClass] = useState(
    initialData?.selectedClass || "Economy"
  );
  const [selectedCity, setSelectedCity] = useState(
    initialData?.selectedCity || {
      cityIata: initialData?.selectedCity?.cityIata || "",
      name: initialData?.selectedCity?.name || "",
      country: initialData?.selectedCity?.country || "",
    }
  );
  const [passengers, setPassengers] = useState(
    initialData?.passengers || { adults: 1, children: 0, infants: 0 }
  );
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    dispatch(getCities())
      .then(() => setLoading(false))
      .catch(() => setLoading(true));
  }, [dispatch]);

  useEffect(() => {
    if (type === "passenger" && initialData) {
      setPassengers(
        initialData.passengers || { adults: 1, children: 0, infants: 0 }
      );
    }
  }, [initialData, type]);

  const searchCity = (term) => {
    dispatch(getCitySearchResults(term));
  };

  const delayedSearch = useDebounce(searchCity, 100);

  const handleSearchInputChange = (e) => {
    dispatch(setCityKeyword(e.target.value));
    delayedSearch(e.target.value);
  };

  const handleSelect = (ranges) => {
    setState([ranges.selection]);
  };

  const classes = ["First", "Business", "Economy", ];

  const handleSave = () => {
    if (type === "date") {
      const stripTime = (date) => {
        const newDate = new Date(date);
        newDate.setHours(12, 0, 0, 0);
        return newDate;
      };

      const startDate = stripTime(state[0].startDate);
      const endDate = state[0].endDate ? stripTime(state[0].endDate) : null;

      onSave(startDate, endDate);
    }
    if (type === "class") {
      onSave(selectedClass);
    }
    if (type === "passenger") {
      onSave(passengers);
    }
    if (type === "city") {
      onSave(selectedCity);
      dispatch(setCityKeyword(""));
      dispatch(setCitySearchResult([]));
      dispatch(getCities());
    }
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Pilih"
      className="modal rounded-lg min-w-[340px] md:min-w-[440px]"
      overlayClassName="overlay"
      appElement={document.getElementById("root")}
    >
      <div className="p-4">
        {type === "date" && (
          <>
            <h2 className="md:absolute md:top-[40%] text-xl text-left font-semibold text-main mb-6">
              Pilih <br /> Tanggal
            </h2>
            <DateRangePicker
              onChange={handleSelect}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={state}
              direction={windowWidth < 640 ? "vertical" : "horizontal"}
              color="#00A8D0"
              rangeColors={["#00A8D0"]}
              locale={id}
              minDate={new Date()}
              staticRanges={[]}
              inputRanges={[]}
              className="-ms-56 md:-ms-9 bg-transparent"
            />
          </>
        )}
        {type === "class" && (
          <>
            <h2 className="text-xl text-left font-semibold text-main mb-6">
              Pilih Kelas
            </h2>
            <ul>
              {classes.map((classItem) => (
                <li
                  key={classItem}
                  onClick={() => setSelectedClass(classItem)}
                  className={`p-2 cursor-pointer hover:bg-primary/10 ${
                    selectedClass === classItem ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <span>{classItem}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {type === "passenger" && (
          <>
            <h2 className="text-xl text-left font-semibold text-main mb-6">
              Pilih Penumpang
            </h2>
            <PassengerInput
              passengers={passengers}
              setPassengers={setPassengers}
            />
          </>
        )}
        {type === "city" && (
          <>
            <h2 className="text-xl text-left font-semibold text-main mb-6">
              Pilih Kota atau Negara
            </h2>
            <CityInput
              searchTerm={searchTerm}
              onSearchInputChange={handleSearchInputChange}
              citySearchResult={citySearchResult}
              selectedCity={selectedCity}
              onCitySelect={setSelectedCity}
              loading={loading}
            />
          </>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={onRequestClose}
            className="px-6 py-2 bg-neutral/30 hover:bg-neutral/70 text-main rounded-full mr-2 text-sm font-normal"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary hover:bg-darkprimary text-white rounded-full text-sm font-normal"
          >
            Simpan
          </button>
        </div>
      </div>
    </Modal>
  );
};

const PassengerInput = ({ passengers, setPassengers }) => (
  <>
    <PassengerCounter
      label="Dewasa"
      description="(12 tahun keatas)"
      count={passengers.adults}
      onDecrease={() =>
        setPassengers({
          ...passengers,
          adults: Math.max(1, passengers.adults - 1),
        })
      }
      onIncrease={() =>
        setPassengers({
          ...passengers,
          adults: passengers.adults + 1,
        })
      }
    />
    <PassengerCounter
      label="Anak"
      description="(2 - 11 tahun)"
      count={passengers.children}
      onDecrease={() =>
        setPassengers({
          ...passengers,
          children: Math.max(0, passengers.children - 1),
        })
      }
      onIncrease={() =>
        setPassengers({
          ...passengers,
          children: passengers.children + 1,
        })
      }
    />
    <PassengerCounter
      label="Bayi"
      description="(Dibawah 2 tahun)"
      count={passengers.infants}
      onDecrease={() =>
        setPassengers({
          ...passengers,
          infants: Math.max(0, passengers.infants - 1),
        })
      }
      onIncrease={() =>
        setPassengers({
          ...passengers,
          infants: passengers.infants + 1,
        })
      }
    />
  </>
);

const PassengerCounter = ({
  label,
  description,
  count,
  onDecrease,
  onIncrease,
}) => (
  <div className="flex justify-between items-center mb-4">
    <div>
      <h3 className="text-left text-lg font-semibold">{label}</h3>
      <p className="text-sm text-darkgray">{description}</p>
    </div>
    <div className="flex items-center">
      <button
        onClick={onDecrease}
        className="px-3 py-1 bg-neutral/30 rounded-full"
      >
        -
      </button>
      <span className="mx-2">{count}</span>
      <button
        onClick={onIncrease}
        className="px-2.5 py-1 bg-neutral/30 rounded-full"
      >
        +
      </button>
    </div>
  </div>
);

const CityInput = ({
  searchTerm,
  onSearchInputChange,
  citySearchResult,
  selectedCity,
  onCitySelect,
  loading
}) => (
  <>
    <div className="relative">
      <input
        type="text"
        className="w-full bg-white text-main rounded-full text-base border border-neutral px-10 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Cari kota atau negara"
        value={searchTerm}
        onChange={onSearchInputChange}
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral"
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
    </div>
    {/* Loading Indicator */}
    {loading ? (<div className="flex justify-center items-center mt-2">
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
    </div>) : (<div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-primary scrollbar-track-white overflow-y-scroll max-h-48 mt-4">
      {[...citySearchResult]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((city) => (
          <div
            key={city.cityIata}
            onClick={() => onCitySelect(city)}
            className={`p-2 cursor-pointer hover:bg-primary/10 ${
              selectedCity === city ? "bg-primary/10" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left flex-row">
                <h1 className="font-medium text-base text-main">{city.name}</h1>
                <h2 className="text-sm font-normal text-darkgray">
                  {city.country}
                </h2>
              </div>
              <label
                htmlFor="city"
                className="bg-neutral/20 text-gray font-medium text-sm px-2.5 rounded-full"
              >
                {city.cityIata}
              </label>
            </div>
          </div>
        ))}
    </div>)}
  </>
);

export default UnifiedModal;

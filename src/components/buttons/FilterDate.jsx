import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setDate } from "../../redux/reducers/historyReducers";

const FilterDate = ({ label, iconSrc }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.history.historyDate);
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (date) => {
    if (
      date === null ||
      (selectedDate &&
        new Date(selectedDate).toDateString() === date.toDateString())
    ) {
      setStartDate(new Date());
      dispatch(setBookingHistoryDetail(null));
    } else {
      setStartDate(date);
      const formattedDate = date.toISOString().split("T")[0];
      dispatch(setDate(formattedDate));
    }
  };

  return (
    <div className="inline-block relative text-left z-30" ref={wrapperRef}>
      <div>
        <button
          type="button"
          className={`inline-flex items-center justify-center w-full rounded-full border-2 border-primary shadow-sm px-4 py-2 md:py-0.5 text-xs md:text-sm font-medium focus:outline-none hover:shadow-md ${
            isOpen ? "bg-primary text-white" : "bg-white text-primary"
          }`}
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen ? "true" : "false"}
          onClick={() => setIsOpen(!isOpen)}
        >
          {iconSrc && <img src={iconSrc} alt="icon" className="mr-2" />}
          {label}
          <svg
            className="ml-1 -mr-1 h-4 w-4 md:h-8 md:w-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          className="block origin-top-right absolute mt-2 w-56 md:right-0 md:mt-0 md:w-auto"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1 px-4" role="none">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              inline
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDate;

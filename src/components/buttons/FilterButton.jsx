import React, { useState, useEffect, useRef } from "react";
import { useFilterButton } from "./FilterButtonContext";

const FilterButton = ({
  label,
  options,
  iconSrc,
  onOptionSelect,
  selectedOption,
  notif,
}) => {
  const { openButton, setOpenButton } = useFilterButton();
  const isOpen = openButton === label;
  const [isClosing, setIsClosing] = useState(false);
  const ref = useRef(null);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenButton(null);
      setIsClosing(false);
    }, 300);
  };

  const handleOptionClick = (event, option) => {
    event.stopPropagation();
    onOptionSelect(option);
    setOpenButton(label);
  };

  const handleButtonClick = () => {
    if (isOpen) {
      setOpenButton(null);
    } else {
      setOpenButton(label);
    }
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden md:inline-block relative text-left" ref={ref}>
        <div>
          <button
            type="button"
            className={`inline-flex items-center justify-center w-full rounded-full border-2 border-primary shadow-sm px-4 py-2 text-sm font-medium focus:outline-none hover:shadow-md ${
              isOpen ? "bg-primary text-white" : "bg-white text-primary"
            }`}
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
            onClick={handleButtonClick}
          >
            {iconSrc && <img src={iconSrc} alt="icon" className="mr-2" />}
            {selectedOption || label}
            <svg
              className="ml-1 -mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {isOpen && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              {options.map((option, index) => (
                <a
                  href="#"
                  key={index}
                  onClick={(event) => handleOptionClick(event, option)}
                  className="block px-4 py-2 font-medium text-sm text-main hover:bg-primary/20"
                  role="menuitem"
                >
                  {option}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter */}
      <div className="md:hidden relative inline-block text-left" ref={ref}>
        <div>
          <button
            className={`text-primary text-xs font-medium ${
              notif
                ? "border border-primary rounded-full px-4 py-1"
                : ""
            }`}
            onClick={handleButtonClick}
          >
            <div className="flex flex-col items-center gap-1">
              {iconSrc && <img src={iconSrc} alt="icon" />}
              {selectedOption || label}
            </div>
          </button>
        </div>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
            <div
              className={`w-full bg-white rounded-t-lg py-4 transition-transform transform ${
                isClosing ? "animate-slide-down" : "animate-slide-up"
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="py-1 mt-4" role="none">
                {options.map((option, index) => (
                  <a
                    href="#"
                    key={index}
                    onClick={(event) => handleOptionClick(event, option)}
                    className="block px-4 py-2 font-medium text-sm text-main hover:bg-primary/20"
                    role="menuitem"
                  >
                    {option}
                  </a>
                ))}
              </div>
              <button
                className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
                onClick={closeModal}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterButton;

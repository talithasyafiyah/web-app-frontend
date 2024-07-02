import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HasilPencarianCard = ({
  flight,
  onSelect,
  isSelected,
  isRoundtrip,
  type,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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

  const handleClick = () => {
    onSelect(flight, type);
  };

  const discountPercentage = (price, afterDiscount) => {
    return ((price - afterDiscount) / price) * 100;
  };
  return (
    <>
      {/* Desktop Card */}
      <div
        className={`hidden lg:block mx-auto bg-white rounded-xl shadow-md overflow-visible my-4 ${
          isSelected ? "border border-primary shadow shadow-primary/20" : ""
        }`}
      >
        {flight.afterDiscountPrice && (
          <div className="relative overflow-visible">
            <div className="absolute z-10 top-4 -left-1 w-[70px] md:w-[80px]">
              {/* Discount tag */}
              <img
                className="relative z-10 w-full transform scale-x-[-1]"
                src="/discount-tag.png"
                alt="Diskon"
              />
              <p className="absolute z-20 top-2 left-2 text-xs text-white font-medium">
                Diskon{" "}
                {discountPercentage(flight.price, flight.afterDiscountPrice)}%
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-12 p-8 items-center">
          <div className="flex w-1/4">
            <img
              src={flight.airplane.airline.logoUrl}
              alt={`${flight.airplane.airline.name} logo`}
              className="h-12 w-12 mr-4 object-contain"
            />
            <div className="flex-1">
              <div className="text-lg font-bold text-main">
                {flight.airplane.airline.name}
              </div>
              <div className="text-base font-medium text-darkgray">
                {flight.airplane.seatClass.type}
              </div>
            </div>
          </div>
          <div className="w-2/4">
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="text-lg font-semibold text-main">
                  {convertToTime(flight.flight.departure.time)}
                </div>
                <div className="text-sm font-medium text-darkgray">
                  {flight.flight.departure.airportCode}
                </div>
              </div>
              <div className="text-center divide-y w-80 divide-neutral">
                <div className="text-sm font-medium text-main">
                  {calculateDuration(
                    flight.flight.departure.time,
                    flight.flight.arrival.time
                  )}
                </div>
                <div className="text-sm font-medium text-darkgray">{""}</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-main">
                  {convertToTime(flight.flight.arrival.time)}
                </div>
                <div className="text-sm font-medium text-darkgray">
                  {flight.flight.arrival.airportCode}
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/4 flex flex-col items-end border-l-2 border-dashed border-neutral pl-4">
            <div className="w-full flex flex-col items-end text-right space-y-2">
              <div className="flex items-center">
                <span className="text-xl font-bold text-danger">
                  {formatPrice(
                    flight.afterDiscountPrice
                      ? flight.afterDiscountPrice
                      : flight.price
                  )}
                </span>
                <span className="text-base font-medium text-gray ml-1">
                  /pax
                </span>
              </div>
              <button
                onClick={handleClick}
                className="inline-block bg-primary hover:bg-darkprimary text-white px-12 py-2 rounded-full"
              >
                Pilih
              </button>
              <button
                onClick={toggleExpand}
                className="text-primary font-medium text-xs mt-2 focus:outline-none flex items-center"
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
          </div>
        </div>

        {isExpanded && (
          <div className="flex gap-48 border-t border-neutral p-8">
            <div className="text-main">
              <div className="flex items-center mb-4">
                <img
                  src={flight.airplane.airline.logoUrl}
                  alt={`${flight.airplane.airline.name} logo`}
                  className="h-5 w-5 mr-4 object-contain"
                />
                <div className="text-base font-semibold text-main">
                  {flight.airplane.airline.name} -{" "}
                  {flight.airplane.seatClass.type}
                </div>
              </div>
              <div className="ms-9">
                <div className="font-semibold text-sm">Informasi:</div>
                <ul>
                  <li className="font-normal text-sm">
                    Bagasi: {flight.airplane.baggageCapacity} kg
                  </li>
                  <li className="font-normal text-sm">
                    Kabin: {flight.airplane.cabinCapacity} kg
                  </li>
                  <li className="font-normal text-sm">
                    Fasilitas: {flight.airplane.inFlightFacility}
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex-col">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                  <p className="font-semibold text-sm">
                    <span className="text-main">
                      {convertToTime(flight.flight.departure.time)}
                    </span>{" "}
                    - <span className="text-primary">Keberangkatan</span>
                  </p>
                </div>
                <div className="ml-1 h-[27px] w-[1px] bg-neutral"></div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                  <p className="font-semibold text-sm">
                    <span className="text-main">
                      {convertToTime(flight.flight.arrival.time)}
                    </span>{" "}
                    - <span className="text-primary">Kedatangan</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Card */}
      <div
        className={`block lg:hidden mx-auto bg-white rounded-lg shadow-md overflow-visible my-3 p-4${
          isSelected ? "border border-primary shadow-sm shadow-primary/20" : ""
        }`}
      >
        {flight.afterDiscountPrice && (
          <div className="relative overflow-visible">
            <div className="absolute z-10 -top-2.5 -left-5 w-[70px] md:w-[80px]">
              {/* Discount tag */}
              <img
                className="relative z-10 w-full transform scale-x-[-1]"
                src="/discount-tag.png"
                alt="Diskon"
              />
              <p className="absolute z-20 top-1.5 left-2 text-[10px] text-white font-medium">
                Diskon{" "}
                {discountPercentage(flight.price, flight.afterDiscountPrice)}%
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col mt-4">
          <div className="flex justify-between items-center">
            <div className="flex">
              <img
                src={flight.airplane.airline.logoUrl}
                alt={`${flight.airplane.airline.name} logo`}
                className="h-8 w-8 mr-2 object-contain"
              />
              <div className="flex flex-col text-sm font-bold text-main">
                {flight.airplane.airline.name}{" "}
                <span className="text-xs font-medium text-darkgray">
                  {flight.airplane.seatClass.type}
                </span>
              </div>
            </div>
            <button
//               onClick={() => {
//                 navigate("/pemesanan");
//               }}
              onClick={handleClick}
              className="inline-block bg-primary hover:bg-darkprimary text-white text-xs px-6 py-2 rounded-full"
            >
              Pilih
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <div className="text-base font-semibold text-main">
                {convertToTime(flight.flight.departure.time)}
              </div>
              <div className="text-xs font-medium text-darkgray">
                {flight.flight.departure.airportCode}
              </div>
            </div>
            <div className="text-center divide-y w-80 divide-neutral">
              <div className="text-xs font-medium text-main">
                {calculateDuration(
                  flight.flight.departure.time,
                  flight.flight.arrival.time
                )}
              </div>
              <div className="text-xs font-medium text-darkgray">
                Sekali Jalan
              </div>
            </div>
            <div>
              <div className="text-base font-semibold text-main">
                {convertToTime(flight.flight.arrival.time)}
              </div>
              <div className="text-xs font-medium text-darkgray">
                {flight.flight.arrival.airportCode}
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full items-center border-t border-dashed border-neutral pt-4 mt-2">
            <div className="flex items-center">
              <span className="text-lg font-bold text-danger">
                {formatPrice(
                  flight.afterDiscountPrice
                    ? flight.afterDiscountPrice
                    : flight.price
                )}
              </span>
              <span className="text-xs font-medium text-gray ml-1">/pax</span>
            </div>

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
        </div>
        {isExpanded && (
          <div className="flex flex-col gap-3 py-4 border-t border-neutral mt-4">
            <div className="flex-col">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                  <p className="font-semibold text-xs">
                    <span className="text-main">
                      {convertToTime(flight.flight.departure.time)}
                    </span>{" "}
                    - <span className="text-primary">Keberangkatan</span>
                  </p>
                </div>
                <div className="ml-1 h-[27px] w-[1px] bg-neutral"></div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-neutral rounded-full"></div>
                  <p className="font-semibold text-xs">
                    <span className="text-main">
                      {convertToTime(flight.flight.arrival.time)}
                    </span>{" "}
                    - <span className="text-primary">Kedatangan</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-main mt-6">
              <div className="flex items-center mb-2">
                <img
                  src={flight.airplane.airline.logoUrl}
                  alt={`${flight.airplane.airline.name} logo`}
                  className="h-5 w-5 mr-4 object-contain"
                />
                <div className="text-xs font-semibold text-main">
                  {flight.airplane.airline.name} -{" "}
                  {flight.airplane.seatClass.type}
                </div>
              </div>
              <div className="ms-9">
                <div className="font-semibold text-xs">Informasi:</div>
                <ul>
                  <li className="font-normal text-xs">
                    Bagasi {flight.airplane.baggageCapacity} kg
                  </li>
                  <li className="font-normal text-xs">
                    Kabin: {flight.airplane.cabinCapacity} kg
                  </li>
                  <li className="font-normal text-xs">
                    Fasilitas: {flight.airplane.inFlightFacility}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HasilPencarianCard;

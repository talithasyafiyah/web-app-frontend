import React from "react";

const RiwayatPemesananCard = ({ flight, onClick }) => {
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

  const getStatusImagePath = (status) => {
    switch (status) {
      case "UNPAID":
        return "/booking-history/unpaid.png";
      case "PAID":
        return "/booking-history/issued.png";
      default:
        return "/booking-history/cancelled.png";
    }
  };

  return (
    <>
      <div
        className="mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-4 cursor-pointer"
        onClick={onClick}
      >
        <img
          className="absolute z-10 -ms-1 mt-3 w-[90px]"
          src={getStatusImagePath(flight.status)}
          alt={flight.status}
          width={90}
        />
        <div className="flex flex-col gap-4 p-4">
          <div className="flex-col lg:flex-row flex justify-between mt-8 lg:mt-4">
            <div className="flex items-center">
              <div className="text-base md:text-lg font-bold text-main">
                {flight.flight_detail?.departure_city} →{" "}
                {flight.flight_detail?.arrival_city}
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="text-center">
                <div className="text-base md:text-lg font-semibold text-main">
                  {convertToTime(flight.flight_detail?.departure_time)}
                </div>
                <div className="text-xs font-medium text-darkgray">
                  {flight.flight_detail?.departure_city}
                </div>
              </div>
              <div className="text-center divide-y w-80 divide-neutral">
                <div className="text-xs font-medium text-main">
                  {calculateDuration(
                    flight.flight_detail?.departure_time,
                    flight.flight_detail?.arrival_time
                  )}
                </div>
                <div className="text-xs font-medium text-darkgray">{""}</div>
              </div>
              <div className="text-center">
                <div className="text-base md:text-lg font-semibold text-main">
                  {convertToTime(flight.flight_detail?.arrival_time)}
                </div>
                <div className="text-xs font-medium text-darkgray">
                  {flight.flight_detail?.arrival_city}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full items-center border-t border-neutral pt-4">
            <div className="flex flex-col text-main gap-1">
              <p className="text-sm font-semibold">Tanggal Booking:</p>
              <p className="text-xs font-medium">
                {formatDateToDayMonthYear(flight.createdAt)}
              </p>
            </div>
            <span className="text-sm md:text-base font-bold text-primary">
              {formatPrice(flight.price)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RiwayatPemesananCard;

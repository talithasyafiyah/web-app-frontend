import React from "react";

const SelectedTicketCard = ({
  ticket,
  formatPrice,
  convertToTime,
  onEdit
}) => {
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
  return (
    <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden my-2">
      <div className="flex justify-between gap-12 p-3 items-center">
        <div className="flex">
          <div className="flex-1">
            <div className="text-base font-bold text-main">
              {ticket.airplane.airline.name}
            </div>
            <div className="text-sm font-medium text-main">
              {ticket.flight.departure.city} → {""} {ticket.flight.arrival.city}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="text-sm font-normal text-darkgray">
                {formatDateToDayMonthYear(ticket.flight.departure.time)}
              </div>
              <div className="bg-main w-1 h-1 rounded-full"></div>
              <div className="text-sm font-normal text-darkgray">
                {convertToTime(ticket.flight.departure.time)} -
                {convertToTime(ticket.flight.arrival.time)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end pl-4">
          <div className="w-full flex flex-col items-end text-right space-y-2">
            <button onClick={onEdit} className="text-primary font-medium text-sm">Ubah</button>
            <div className="flex items-center">
              <span className="text-base font-semibold text-main">
                {formatPrice(
                  ticket.afterDiscountPrice
                    ? ticket.afterDiscountPrice
                    : ticket.price
                )}
              </span>
              <span className="text-base font-medium text-gray ml-1">/pax</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedTicketCard;

import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingDetail, setBookingDetail] = useState(null);

  return (
    <BookingContext.Provider value={{ bookingDetail, setBookingDetail }}>
      {children}
    </BookingContext.Provider>
  );
};
import React from "react";
import "animate.css";

const ModalBooking = ({ show, handleClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center animate__animated animate__pulse ">
      <div className="bg-white p-5 rounded-lg shadow-xl w-1/2">
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
          onClick={handleClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalBooking;

import React, { Component, useEffect, useState, useContext } from "react";
import Navbar from "../components/navigations/Navbar";
import Footer from "../components/navigations/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import BackToTopButton from "../components/navigations/BackToTop";
import CetakTiket from "../components/buttons/CetakTiket";
import { useSelector } from "react-redux";

function PaymentSuccess() {
  const navigate = useNavigate();
  const bookingDetail = JSON.parse(localStorage.getItem("bookingDetail"));

  return (
    <div>
      <Navbar transparent={false} />
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-5">
          <img src=".\src\assets\success.gif" alt="" className="w-[100px]" />
          <p className="flex text-lg flex-col text-center">
            <span className="text-primary text-4xl font-bold">Selamat! </span>
            <span className="text-base my-2">
              Transaksi Pembayaran Tiket sukses!
            </span>
          </p>
          <div className="flex flex-col items-center gap-3 justify-center">
            {bookingDetail?.status !== "PAID" && (
              <CetakTiket
                bookingDetail={bookingDetail}
              />
            )}
            <button
              className="bg-secondary text-white rounded-full p-2 w-44 hover:bg-darksecondary"
              onClick={() => navigate("/")}
            >
              Kembali Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
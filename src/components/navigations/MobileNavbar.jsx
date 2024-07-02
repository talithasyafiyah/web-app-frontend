import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MobileNavbar() {
  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 bg-white flex justify-around p-4 shadow-inner z-40"
      style={{
        boxShadow:
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -2px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="relative inline-block text-left">
        <a href="/" className="text-main text-xs font-medium">
          <div className="flex flex-col items-center gap-1">
            <svg
              className={`w-5 h-5 ${
                window.location.pathname === "/" || ""
                  ? "fill-secondary"
                  : "fill-primary"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
            </svg>
            Beranda
          </div>
        </a>
      </div>
      <div className="relative inline-block text-left">
        <a href="/riwayat-pemesanan" className="text-main text-xs font-medium">
          <div className="flex flex-col items-center gap-1">
            <svg
              className={`w-5 h-5 ${
                window.location.pathname === "/riwayat-pemesanan" || ""
                  ? "fill-secondary"
                  : "fill-primary"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z" />
            </svg>
            Riwayat
          </div>
        </a>
      </div>
      <div className="relative inline-block text-left">
        <a href="/akun-saya" className="text-main text-xs font-medium">
          <div className="flex flex-col items-center gap-1">
            <svg
              className={`w-5 h-5 ${
                window.location.pathname === "/akun-saya" || ""
                  ? "fill-secondary"
                  : "fill-primary"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
            </svg>
            Akun
          </div>
        </a>
      </div>
    </div>
  );
}

export default MobileNavbar;

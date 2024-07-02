import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="relative">
          <iframe
            src="https://lottie.host/embed/ef008857-ac69-4f70-b3cb-8b623f1bb09c/cb0TVFBqAB.json"
            className="w-[400px] h-[400px] mb-6"
            title="404 Animation"
          ></iframe>
          <div className="mt-4">
            <p className="text-main mb-4">
              Maaf, page yang kamu cari tidak ditemukan.
              <br />
              Mohon untuk kembali ke beranda
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-darkprimary"
            >
              Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

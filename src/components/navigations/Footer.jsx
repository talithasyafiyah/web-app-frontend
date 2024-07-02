import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-main  text-white py-8 md:py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-2/3 text-left md:col-span-1">
            <div className="flex justify-start items-center gap-4">
              <img
                src="/logo-blue.png"
                alt="Aviatick Logo"
                className="mx-0 mb-4 h-12"
              />
              <p className="text-lg font-semibold text-white">X</p>
               <img
                src="/logo-kibowtin.png"
                alt="Kibowtin Logo"
                className="mx-0 mb-4 h-12"
              />
            </div>
            <p className="text-xs md:text-sm text-white font-normal">
              Aviatick adalah platform pemesanan tiket pesawat yang terpercaya,
              menawarkan berbagai pilihan penerbangan dengan harga terbaik. Kami
              berkomitmen untuk memberikan pengalaman pemesanan yang cepat,
              aman, dan efisien. Dapatkan dukungan 24/7 dari tim profesional
              kami untuk memastikan perjalanan Anda berjalan lancar.
            </p>
          </div>
          <div className="w-full md:w-1/3 text-left md:col-span-1">
            <h3 className="text-base md:text-lg font-semibold">Tentang Aviatick</h3>
            <ul className="mt-4 space-y-2 text-xs md:text-sm">
              <li>
                <a href="#" className="hover:border-b hover:border-primary hover:text-primary">
                  Cara Pemesanan
                </a>
              </li>
              <li>
                <a href="#" className="hover:border-b hover:border-primary hover:text-primary">
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:border-b hover:border-primary hover:text-primary">
                  Pusat Bantuan
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 text-left md:col-span-1">
            <h3 className="text-base md:text-lg font-semibold">Follow Kami di</h3>
            <ul className="mt-4 space-y-2 text-xs md:text-sm">
              <li className="flex gap-2 justify-start items-center">
                <FaInstagram size={24} className="mr-2 text-primary" />
                <a href="#" className="hover:border-b hover:border-primary hover:text-primary">
                  Instagram
                </a>
              </li>
              <li className="flex gap-2 justify-start items-center">
                <svg className="fill-primary w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                <a href="#" className="hover:border-b hover:border-primary hover:text-primary">
                  X
                </a>
              </li>
              <li className="flex gap-2 justify-start items-center">
                <FaFacebook size={24} className="mr-2 text-primary" />
                <a href="#" className="hover:border-b hover:border-primary hover:text-primary">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center md:text-left">
          <p className="text-white font-normal text-sm">
            &copy; 2024 Aviatick. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

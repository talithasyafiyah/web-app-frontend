import React, { useEffect, useState } from "react";
import Navbar from "../components/navigations/Navbar";
import Footer from "../components/navigations/Footer";
import modalCss from "../components/navigations/Navbar";
import { useNavigate } from "react-router-dom";
import BackToTopButton from "../components/navigations/BackToTop";
import FormPenumpang from "../components/cards/FormPenumpang";
import { useDispatch, useSelector } from "react-redux";
import {
  getCountries,
  getPrepareTicket,
  getBookingTicketCompleted,
} from "../redux/actions/bookingActions";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import "animate.css";
import BackButtonMobile from "../components/navigations/BackButtonMobile";

function Pemesanan() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDonated, setIsDonated] = useState(false);
  const [totalHarga, setTotalHarga] = useState();
  const [penumpangData, setPenumpangData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setShowConfirmModal] = useState(false);
  const [tripType, settripType] = useState("");
  const [promo, setPromo] = useState("");
  const [titleOptions, setTitleOptions] = useState([
    { label: "Tuan", value: "Mr." },
    { label: "Nyonya", value: "Mrs." },
    { label: "Nona", value: "Ms." },
  ]);

  //Mengambil Data dari Reducer
  const user = useSelector((state) => state?.auth?.user);
  const dataPrepare = useSelector(
    (state) => state?.bookingFlight?.prepareBooking?.data
  );
  const booking = useSelector((state) => state?.bookingFlight?.bookings);
  const countries = useSelector((state) => state?.bookingFlight?.countries);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      navigate("/masuk");
      toast.error(
        "Ups.. tidak dapat mengakses halaman, silakan masuk terlebih dahulu."
      );
    }
  }, [token, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (booking?.selectedReturn !== null) return settripType("roundtrip");
    if (booking?.selectedReturn === null) return settripType("singletrip");
  }, []);

  //GET Negara
  useEffect(() => {
    dispatch(getCountries());
  }, []);

  //Setting Donasi
  const handleDonasiClick = () => {
    setIsDonated((prevIsDonated) => !prevIsDonated);
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      donation: isDonated,
    }));
  }, [isDonated]);

  //Setting ageGroup by jumlah penumpang
  useEffect(() => {
    const initialPenumpangData = [];
    for (let i = 0; i < booking?.passengers?.adults; i++) {
      initialPenumpangData.push({
        ageGroup: "ADULT",
        id: `dewasa-${i}`,
        name: "Dewasa",
      });
    }
    for (let i = 0; i < booking?.passengers?.children; i++) {
      initialPenumpangData.push({
        ageGroup: "CHILD",
        id: `anak-${i}`,
        name: "Anak",
      });
    }
    for (let i = 0; i < booking?.passengers?.infants; i++) {
      initialPenumpangData.push({
        ageGroup: "BABY",
        id: `bayi-${i}`,
        name: "Bayi",
      });
    }
    setPenumpangData(initialPenumpangData);
  }, [booking?.passengers]);

  // State untuk menyimpan inputan
  const [formData, setFormData] = useState({
    departureTicketId: booking?.selectedDeparture?.id || null,
    returnTicketId: booking?.selectedReturn?.id || null,
    adult: booking?.passengers?.adults || 0,
    child: booking?.passengers?.children || 0,
    baby: booking?.passengers?.infants || 0,
    donation: isDonated,
    seatClass:
      booking?.selectedDeparture?.airplane?.seatClass?.type || "Economy",
    passenger: [],
  });

  //isian untuk Form Penumpang
  const penumpangFields = (id) => [
    {
      name: `title`,
      type: "radio",
      options: titleOptions,
    },
    { label: "Nama Lengkap", name: "fullName", type: "text" },
    { label: "Nama Keluarga", name: "familyName", type: "text" },
    { label: "Tanggal Lahir", name: "birthDate", type: "date" },
    {
      label: "Kewarganegaraan",
      name: "nationality",
      type: "select",
      options: [
        { label: "", value: "null" },
        ...(Array.isArray(countries) ? countries.slice() : []) // Check if countries is an array
          .sort((a, b) => a.name.common.localeCompare(b.name.common)) // Sort by country name
          .map((country) => ({
            label: country.name.common,
            value: country.name.common,
          })),
      ],
    },
    {
      label: "KTP/Paspor",
      name: "identityType",
      type: "select",
      options: [
        { label: "", value: "null" },
        { label: "KTP", value: "KTP" },
        { label: "Paspor", value: "Paspor" },
        { label: "SIM", value: "SIM" },
      ],
    },
    {
      label: "Negara Penerbit",
      name: "issuingCountry",
      type: "select",
      options: [
        { label: "", value: "null" },
        ...(Array.isArray(countries) ? countries.slice() : []) // Check if countries is an array
          .sort((a, b) => a.name.common.localeCompare(b.name.common)) // Sort by country name
          .map((country) => ({
            label: country.name.common,
            value: country.name.common,
          })),
      ],
    },
    { label: "Nomor Identitas", name: "identityNumber", type: "text" },
    { label: "Berlaku Sampai", name: "expiredDate", type: "date" },
  ];

  //Untuk mengisikan data ke variable PenumpangData
  const handleInputChange = (e, id) => {
    const { name, value } = e.target;

    // Update penumpangData
    const updatedPenumpangData = penumpangData.map((data) =>
      data.id === id
        ? {
            ...data,
            [name]:
              name === "birthDate" || name === "expiredDate"
                ? `${value}T00:00:00.000Z`
                : value,
          }
        : data
    );
    setPenumpangData(updatedPenumpangData);

    // Update formData
    const updatedPassenger = updatedPenumpangData.map(
      ({ id, ...rest }) => rest
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      passenger: updatedPassenger,
    }));
  };

  //Seting Modal
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOpenConfirmModal = async () => {
    await dispatch(
      getPrepareTicket(
        formData,
        tripType,
        navigate,
        setIsLoading,
        setShowConfirmModal
      )
    );
  };
  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  //Lanjut Konfirmasi
  const handleBookingSubmitcompleted = async () => {
    try {
      await dispatch(
        getBookingTicketCompleted(
          dataPrepare,
          navigate,
          setIsLoading,
          setDetailLoading,
          setShowConfirmModal
        )
      );
    } catch (error) {
      toast.error("Terjadi kesalahan saat booking", { autoClose: 5000 });
      toast.error("Error during booking submission:", error);
    }
  };

  //Format Tanggal
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const month = monthNames[date.getUTCMonth()]; // getUTCMonth() is zero-based
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
  };

  //Format Waktu
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = String(date?.getUTCHours()).padStart(2, "0");
    const minutes = String(date?.getUTCMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  //Format Harga
  const formatPrice = (price) => {
    return price
      .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      .replace(/\,00$/, "");
  };

  //Mengecualikan Bayi dalam perhitungan harga
  const infantPassengers = penumpangData.filter(
    (p) => p.ageGroup === "BABY"
  ).length;

  useEffect(() => {
    if (booking?.selectedDeparture?.promo !== null) return setPromo("true");
    if (booking?.selectedReturn?.promo !== null) return setPromo("true");
    return setPromo("false");
  }, []);

  //Pengecekan tipe penerbangan untuk perhitungan harga
  useEffect(() => {
    if (tripType === "singletrip")
      return setTotalHarga(
        booking?.selectedDeparture?.afterDiscountPrice
          ? booking?.selectedDeparture?.afterDiscountPrice
          : booking?.selectedDeparture?.price
      );
    if (tripType === "roundtrip")
      return setTotalHarga(
        booking?.selectedDeparture?.afterDiscountPrice
          ? booking?.selectedDeparture?.afterDiscountPrice +
              booking?.selectedReturn?.afterDiscountPrice
          : booking?.selectedDeparture?.price + booking?.selectedReturn?.price
      );
  }, [booking, tripType]);

  //Perhitungan Total Pajak
  const totalPajak = (price) => {
    price = price * (penumpangData.length - infantPassengers);
    return (price * 10) / 100;
  };

  //Perhitungan Total Harga
  const calculateTotal = (price) => {
    price = price * (penumpangData.length - infantPassengers);
    if (isDonated) return price + totalPajak(price) + 1000;
    return price + (price * 10) / 100;
  };  

  // Group passengers by type and count
  const groupPenumpangData = penumpangData.reduce((acc, penumpang) => {
    if (!acc[penumpang.name]) {
      acc[penumpang.name] = { count: 0, ageGroup: penumpang.ageGroup };
    }
    acc[penumpang.name].count += 1;
    return acc;
  }, {});

  return (
    <div className={`bg-background`}>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="flex flex-col bg-white w-1/2 max-sm:w-3/4 justify-center items-center bg-gray-900 p-8 rounded-lg shadow-md border animate__animated animate__pulse">
            <div className="flex flex-col bg-white w-full">
              <button
                className="px-4 rounded flex justify-end"
                onClick={handleCloseModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m7 7l10 10M7 17L17 7"
                  />
                </svg>
              </button>
              <h2 className="text-2xl pb-4">Detail Harga</h2>
              <p className="flex gap-5 text-lg items-center py-5">
                <strong>
                  {booking?.selectedDeparture?.flight?.departure?.city}
                </strong>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>

                <strong>
                  {booking?.selectedDeparture?.flight?.arrival?.city}
                </strong>
              </p>
              <div className="text-sm">
                <p className="py-3">
                  <strong>Harga</strong>
                </p>
                {Object.entries(groupPenumpangData).map(
                  ([name, { count, ageGroup }]) => (
                    <div className="flex justify-between col-span-2" key={name}>
                      <div className="flex gap-2">
                        <p>{name}</p>
                        <p>(x{count})</p>
                      </div>
                      <p>
                        {ageGroup === "BABY"
                          ? "0"
                          : formatPrice(
                              booking?.selectedDeparture?.afterDiscountPrice
                                ? booking?.selectedDeparture
                                    ?.afterDiscountPrice * count
                                : booking?.selectedDeparture?.price * count
                            )}
                      </p>
                    </div>
                  )
                )}
              </div>
              {tripType === "roundtrip" && (
                <>
                  <hr className="my-8 text-neutral" />
                  <p className="flex gap-5 text-lg items-center pb-5">
                    <strong>
                      {booking?.selectedReturn?.flight?.departure?.city}
                    </strong>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                      />
                    </svg>

                    <strong>
                      {booking?.selectedReturn?.flight?.arrival?.city}
                    </strong>
                  </p>
                  <div className="text-sm">
                    <p className="py-3">
                      <strong>Harga</strong>
                    </p>
                    {Object.entries(groupPenumpangData).map(
                      ([name, { count, ageGroup }]) => (
                        <div
                          className="flex justify-between col-span-2"
                          key={name}
                        >
                          <div className="flex gap-2">
                            <p>{name}</p>
                            <p>(x{count})</p>
                          </div>
                          <p>
                            {ageGroup === "BABY"
                              ? "0"
                              : formatPrice(
                                  booking?.selectedReturn?.afterDiscountPrice
                                    ? booking?.selectedReturn
                                        ?.afterDiscountPrice * count
                                    : booking?.selectedReturn?.price * count
                                )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
              <div className="text-sm">
                <hr className="my-8 text-neutral" />
                <p className="pb-3">
                  <strong>Biaya Lainnya</strong>
                </p>
                <div className="flex justify-between">
                  <p>Pajak (10%)</p>
                  <p>{formatPrice(totalPajak(totalHarga))}</p>
                </div>
                {isDonated === true && (
                  <div className="flex justify-between">
                    {" "}
                    <p>Donasi</p>
                    <p>Rp. 1.000</p>
                  </div>
                )}

                <hr className="my-8 text-neutral" />
                <div className="flex justify-between">
                  <p>
                    <strong>Total</strong>
                  </p>
                  <div className="flex flex-col items-end">
                    <p>
                      <strong>{formatPrice(calculateTotal(totalHarga))}</strong>
                    </p>
                    {promo === "true" ? (
                      <>
                        <p className="text-primary text-xs">
                          *Harga sudah termasuk promo
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmModal && (
        <div className="fixed  inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="flex flex-col px-8 gap-2 w-[400px] max-sm:w-[300px] text-center justify-center bg-white items-center bg-gray-900 py-8 rounded-lg shadow-md animate__animated animate__pulse">
            <p className="text-xl text-primary py-2">
              <strong>Apakah sudah yakin data pribadi anda benar?</strong>
            </p>
            <p className="">
              Data akan tersimpan dan anda tidak dapat mengubah data diri pada
              formulir ini setelah lanjut ke pembayaran
            </p>
            <div className="flex flex-col w-full gap-2 mt-6">
              <button
                onClick={handleCloseConfirmModal}
                className=" text-primary border bg-transparent p-3 rounded-full hover:bg-slate-100"
              >
                Periksa Kembali
              </button>
              <button
                onClick={handleBookingSubmitcompleted}
                className="bg-primary text-white p-3 flex items-center justify-center rounded-full  hover:bg-darkprimary"
              >
                {isLoading ? (
                  <ThreeDots
                    visible={true}
                    height="20"
                    width="20"
                    color="#FFB423"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Ya, saya yakin"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="hidden md:block">
        <Navbar transparent={false} />
      </div>

      <BackButtonMobile />

      <div className="container">
        <div className="container px-3 mx-auto lg:flex mt-3 md:mt-20 text-sm ">
          <section className="flex flex-col gap-4 lg:w-2/3 lg:me-6">
            {/* Breadcrumb */}
            <div className="container hidden md:flex gap-1.5 text-main text-xs font-medium -mt-4 md:-mt-0 mb-10 md:mb-2">
              <a href="/">Beranda</a>
              <img src="/icons/right-chev.svg" alt="chevron" />
              <span>Cari Penerbangan</span>
              <img src="/icons/right-chev.svg" alt="chevron" />
              <span>Isi Data Diri</span>
            </div>

            <h1 className="container block md:hidden text-2xl font-bold text-main mb-3">
              Isi Data Diri
            </h1>
            {/* Sisi Atas Mobile */}
            <section className="flex bg-white flex-col lg:w-1/3 gap-4 lg:hidden">
              {/* Detail Pemesanan  */}
              <div className="rounded-xl shadow-md my-3 pb-4 lg:mt-[100px]">
                {/* Route  */}
                <p className="flex gap-5 text-xl  items-center p-8">
                  <strong>
                    {booking?.selectedDeparture?.flight?.departure?.city}
                  </strong>
                  {tripType === "singletrip" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M14.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 8H5a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414m-4.586 10a1 1 0 0 1 0 1.414L7.414 16H19a1 1 0 1 1 0 2H7.414l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0"
                      />
                    </svg>
                  )}

                  <strong>
                    {booking?.selectedDeparture?.flight?.arrival?.city}
                  </strong>
                </p>
                <hr className="text-gray" />
                {/* SingleTrip Pages */}
                <div>
                  {/* Maskapai  */}
                  <div className="flex p-8">
                    <div className="p-4 flex flex-col  border w-1/2 lg:flex-col gap-2 rounded-l-md items-center justify-center">
                      <img
                        src={
                          booking?.selectedDeparture?.airplane?.airline?.logoUrl
                        }
                        className="w-[50px]"
                      />
                      <div className=" text-black ">
                        <p className="text-lg text-center">
                          <strong>
                            {
                              booking?.selectedDeparture?.airplane?.airline
                                ?.name
                            }
                          </strong>
                        </p>
                        <p className="text-center">
                          {
                            booking?.selectedDeparture?.airplane?.seatClass
                              ?.type
                          }
                        </p>
                      </div>
                    </div>
                    <div className="p-2  flex flex-col border w-1/2 gap-2 rounded-r-md justify-center items-center">
                      <p className=" text-black px-4 py-2 bg-slate-200 rounded-lg">
                        Pergi
                      </p>
                      <p className=" text-black">
                        {formatDate(
                          booking?.selectedDeparture?.flight?.departure?.time
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Detail Route  */}
                  <div className="px-8 flex">
                    <div className="px-4">
                      <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-neutral"></div>
                        <strong className="flex gap-2 ">
                          <p>
                            {formatTime(
                              booking?.selectedDeparture?.flight?.departure
                                ?.time
                            )}
                          </p>
                          <p>-</p>
                          <p className="text-[#00A8D0]">Keberangkatan</p>
                        </strong>
                      </div>
                      <div className="flex my-2">
                        <div className="mx-[7px] h-auto w-[1px] bg-neutral"></div>
                        <div className="py-2 ps-3 text-sm">
                          <p>
                            {formatDate(
                              booking?.selectedDeparture?.flight?.departure
                                ?.time
                            )}
                          </p>
                          <p>
                            {
                              booking?.selectedDeparture?.flight?.departure
                                ?.airport
                            }
                          </p>
                          <p>
                            (
                            {
                              booking?.selectedDeparture?.flight?.departure
                                ?.airportCode
                            }
                            )
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-neutral"></div>
                        <strong className="flex gap-2 ">
                          <p>
                            {formatTime(
                              booking?.selectedDeparture?.flight?.arrival?.time
                            )}
                          </p>
                          <p>-</p>
                          <p className="text-[#00A8D0]">Kedatangan</p>
                        </strong>
                      </div>
                      <div className="py-3 ps-7 text-sm">
                        <p>
                          {formatDate(
                            booking?.selectedDeparture?.flight?.arrival?.time
                          )}
                        </p>
                        <p>
                          {booking?.selectedDeparture?.flight?.arrival?.airport}
                        </p>
                        <p>
                          (
                          {
                            booking?.selectedDeparture?.flight?.arrival
                              ?.airportCode
                          }
                          )
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* RoundTrip Pages */}
                {tripType == "roundtrip" && (
                  <div>
                    {/* Maskapai  */}
                    <div className="flex p-8">
                      <div className="p-4 flex flex-col  border w-1/2 lg:flex-col gap-2 rounded-l-md items-center justify-center">
                        <img
                          src={
                            booking?.selectedReturn?.airplane?.airline?.logoUrl
                          }
                          className="w-[50px]"
                        />
                        <div className=" text-black ">
                          <p className="text-lg text-center">
                            <strong>
                              {booking?.selectedReturn?.airplane?.airline?.name}
                            </strong>
                          </p>
                          <p className="text-center">
                            {booking?.selectedReturn?.airplane?.seatClass?.type}
                          </p>
                        </div>
                      </div>
                      <div className="p-2  flex flex-col border w-1/2 gap-2 rounded-r-md justify-center items-center">
                        <p className=" text-black px-4 py-2 bg-slate-200 rounded-lg">
                          Pulang
                        </p>
                        <p className=" text-black">
                          {formatDate(
                            booking?.selectedReturn?.flight?.departure?.time
                          )}
                        </p>
                      </div>
                    </div>
                    {/* Detail Route  */}
                    <div className="px-8 flex">
                      <div className="px-4">
                        <div className="flex gap-2 items-center">
                          <div className="w-4 h-4 rounded-full bg-neutral"></div>
                          <strong className="flex gap-2 ">
                            <p>
                              {formatTime(
                                booking?.selectedReturn?.flight?.departure?.time
                              )}
                            </p>
                            <p>-</p>
                            <p className="text-[#00A8D0]">Keberangkatan</p>
                          </strong>
                        </div>
                        <div className="flex my-2">
                          <div className="mx-[7px] h-auto w-[1px] bg-neutral"></div>
                          <div className="py-2 ps-3 text-sm">
                            <p>
                              {formatDate(
                                booking?.selectedReturn?.flight?.departure?.time
                              )}
                            </p>
                            <p>
                              {
                                booking?.selectedReturn?.flight?.departure
                                  ?.airport
                              }
                            </p>
                            <p>
                              (
                              {
                                booking?.selectedReturn?.flight?.departure
                                  ?.airportCode
                              }
                              )
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center">
                          <div className="w-4 h-4 rounded-full bg-neutral"></div>
                          <strong className="flex gap-2 ">
                            <p>
                              {formatTime(
                                booking?.selectedReturn?.flight?.arrival?.time
                              )}
                            </p>
                            <p>-</p>
                            <p className="text-[#00A8D0]">Kedatangan</p>
                          </strong>
                        </div>
                        <div className="py-3 ps-7 text-sm">
                          <p>
                            {formatDate(
                              booking?.selectedReturn?.flight?.arrival?.time
                            )}
                          </p>
                          <p>
                            {booking?.selectedReturn?.flight?.arrival?.airport}
                          </p>
                          <p>
                            (
                            {
                              booking?.selectedReturn?.flight?.arrival
                                ?.airportCode
                            }
                            )
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Total Harga*/}
                <div className="px-8 py-4 text-sm">
                  <hr className="my-4 text-neutral" />
                  <div className="flex text-lg justify-between">
                    <p>Total Pembayaran</p>
                    <div className="flex items-center gap-3">
                      <p>
                        <strong>
                          {formatPrice(calculateTotal(totalHarga))}
                        </strong>
                      </p>
                      <button onClick={handleOpenModal}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 1024 1024"
                        >
                          <path
                            fill="currentColor"
                            d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001c13.2-13.2 34.8-13.2 48 0l451.8 451.8l445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Formulir Pemesan */}
            <div className="bg-white rounded-xl p-[32px] shadow-md">
              <p className="text-xl mb-[32px]">
                <strong>Data Pemesan</strong>
              </p>
              <div className="text-gray">
                <label className="">Nama Lengkap</label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={user?.fullName}
                  className="border rounded-full w-full py-2 my-3 px-4"
                  disabled
                />
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={user?.email}
                  className="border rounded-full w-full py-2 my-3 px-4"
                  disabled
                />
                <label>Nomor Telepon</label>
                <input
                  type="text"
                  name="notelp"
                  value={user?.phoneNumber}
                  className="border rounded-full w-full py-2 my-3 px-4"
                  disabled
                />
              </div>
            </div>
            {/* Formulir Penumpang */}
            {penumpangData.map((penumpang, index) => (
              <FormPenumpang
                key={penumpang.id}
                title={`Data Penumpang (${penumpang.name})`}
                fields={penumpangFields(penumpang.id)}
                formData={penumpang}
                handleInputChange={(e) => handleInputChange(e, penumpang.id)}
              />
            ))}
            {/* SGDs */}
            <div className="bg-white rounded-xl p-[32px] shadow-md">
              <div className="text-xl border-neutral gap-2  py-2 rounded-xl">
                <div className="flex gap-3">
                  <img src="/icons/charity.svg" className="w-14" />
                  <div>
                    <p className="text-primary">
                      <strong>Donasi</strong>
                    </p>
                    <p className="text-sm text-slate-500">
                      Setiap rupiah yang Anda donasikan sangat berarti.
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 mt-4 rounded-xl bg-slate-200">
                  {" "}
                  <p className="text-xs text-slate-500">
                    Bantuan <strong>Rp. 1000</strong> bagi Rakyat Palestina
                  </p>
                  <button onClick={handleDonasiClick}>
                    {isDonated ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5rem"
                        height="1.5rem"
                        viewBox="0 0 24 24"
                        className=" text-white bg-green-500 rounded"
                      >
                        <g fill="none" fill-rule="evenodd">
                          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="currentColor"
                            d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"
                          />
                        </g>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5rem"
                        height="1.5rem"
                        viewBox="0 0 24 24"
                        className=" text-white bg-primary rounded"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 5v14m-7-7h14"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Total Harga*/}
            <div className="bg-white rounded-xl p-[32px] shadow-md ">
              <div className="py-4 text-sm">
                <div className="flex text-base md:text-lg justify-between">
                  <p>Total Pembayaran</p>
                  <div className="flex items-center gap-3">
                    <p>
                      <strong>{formatPrice(calculateTotal(totalHarga))}</strong>
                    </p>
                    <button onClick={handleOpenModal}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 1024 1024"
                      >
                        <path
                          fill="currentColor"
                          d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001c13.2-13.2 34.8-13.2 48 0l451.8 451.8l445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199"
                        />
                      </svg>
                    </button>
                  </div>
                </div>{" "}
                <hr className="my-4 text-neutral" />
                <button
                  onClick={handleOpenConfirmModal}
                  className="bg-primary w-full p-4 rounded-full text-center flex justify-center items-center text-white hover:bg-darkprimary"
                  disabled={isLoading} // Nonaktifkan tombol saat loading
                >
                  {isLoading ? (
                    <ThreeDots
                      visible={true}
                      height="20"
                      width="20"
                      color="#FFB423"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    "Lanjut Bayar"
                  )}
                </button>
              </div>
            </div>
          </section>
          {/* Sisi Kanan Website */}
          <section className="flex  flex-col lg:w-1/3 gap-4 max-lg:hidden -mt-[58px]">
            {/* Detail Pemesanan  */}
            <div className="rounded-xl bg-white shadow-md my-3 pb-4 lg:mt-[100px]">
              {/* Route  */}
              <p className="flex gap-5 text-xl  items-center p-8">
                <strong>
                  {booking?.selectedDeparture?.flight?.departure?.city}
                </strong>
                {tripType === "singletrip" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M14.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 8H5a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414m-4.586 10a1 1 0 0 1 0 1.414L7.414 16H19a1 1 0 1 1 0 2H7.414l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0"
                    />
                  </svg>
                )}

                <strong>
                  {booking?.selectedDeparture?.flight?.arrival?.city}
                </strong>
              </p>
              <hr className="text-gray" />
              {/* SingleTrip Pages */}
              <div>
                {/* Maskapai  */}
                <div className="flex p-8">
                  <div className="p-4 flex flex-col  border w-1/2 lg:flex-col gap-2 rounded-l-md items-center justify-center">
                    <img
                      src={
                        booking?.selectedDeparture?.airplane?.airline?.logoUrl
                      }
                      className="w-[50px]"
                    />
                    <div className=" text-black ">
                      <p className="text-lg text-center">
                        <strong>
                          {booking?.selectedDeparture?.airplane?.airline?.name}
                        </strong>
                      </p>
                      <p className="text-center">
                        {booking?.selectedDeparture?.airplane?.seatClass?.type}
                      </p>
                    </div>
                  </div>
                  <div className="p-2  flex flex-col border w-1/2 gap-2 rounded-r-md justify-center items-center">
                    <p className=" text-black px-4 py-2 bg-slate-200 rounded-lg">
                      Pergi
                    </p>
                    <p className=" text-black">
                      {formatDate(
                        booking?.selectedDeparture?.flight?.departure?.time
                      )}
                    </p>
                  </div>
                </div>
                {/* Detail Route  */}
                <div className="px-8 flex">
                  <div className="px-4">
                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-neutral"></div>
                      <strong className="flex gap-2 ">
                        <p>
                          {formatTime(
                            booking?.selectedDeparture?.flight?.departure?.time
                          )}
                        </p>
                        <p>-</p>
                        <p className="text-[#00A8D0]">Keberangkatan</p>
                      </strong>
                    </div>
                    <div className="flex my-2">
                      <div className="mx-[7px] h-auto w-[1px] bg-neutral"></div>
                      <div className="py-2 ps-3 text-sm">
                        <p>
                          {formatDate(
                            booking?.selectedDeparture?.flight?.departure?.time
                          )}
                        </p>
                        <p>
                          {
                            booking?.selectedDeparture?.flight?.departure
                              ?.airport
                          }
                        </p>
                        <p>
                          (
                          {
                            booking?.selectedDeparture?.flight?.departure
                              ?.airportCode
                          }
                          )
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-neutral"></div>
                      <strong className="flex gap-2 ">
                        <p>
                          {formatTime(
                            booking?.selectedDeparture?.flight?.arrival?.time
                          )}
                        </p>
                        <p>-</p>
                        <p className="text-[#00A8D0]">Kedatangan</p>
                      </strong>
                    </div>
                    <div className="py-3 ps-7 text-sm">
                      <p>
                        {formatDate(
                          booking?.selectedDeparture?.flight?.arrival?.time
                        )}
                      </p>
                      <p>
                        {booking?.selectedDeparture?.flight?.arrival?.airport}
                      </p>
                      <p>
                        (
                        {
                          booking?.selectedDeparture?.flight?.arrival
                            ?.airportCode
                        }
                        )
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* RoundTrip Pages */}
              {tripType == "roundtrip" && (
                <div>
                  {/* Maskapai  */}
                  <div className="flex p-8">
                    <div className="p-4 flex flex-col  border w-1/2 lg:flex-col gap-2 rounded-l-md items-center justify-center">
                      <img
                        src={
                          booking?.selectedReturn?.airplane?.airline?.logoUrl
                        }
                        className="w-[50px]"
                      />
                      <div className=" text-black ">
                        <p className="text-lg text-center">
                          <strong>
                            {booking?.selectedReturn?.airplane?.airline?.name}
                          </strong>
                        </p>
                        <p className="text-center">
                          {booking?.selectedReturn?.airplane?.seatClass?.type}
                        </p>
                      </div>
                    </div>
                    <div className="p-2  flex flex-col border w-1/2 gap-2 rounded-r-md justify-center items-center">
                      <p className=" text-black px-4 py-2 bg-slate-200 rounded-lg">
                        Pulang
                      </p>
                      <p className=" text-black">
                        {formatDate(
                          booking?.selectedReturn?.flight?.departure?.time
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Detail Route  */}
                  <div className="px-8 flex">
                    <div className="px-4">
                      <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-neutral"></div>
                        <strong className="flex gap-2 ">
                          <p>
                            {formatTime(
                              booking?.selectedReturn?.flight?.departure?.time
                            )}
                          </p>
                          <p>-</p>
                          <p className="text-[#00A8D0]">Keberangkatan</p>
                        </strong>
                      </div>
                      <div className="flex my-2">
                        <div className="mx-[7px] h-auto w-[1px] bg-neutral"></div>
                        <div className="py-2 ps-3 text-sm">
                          <p>
                            {formatDate(
                              booking?.selectedReturn?.flight?.departure?.time
                            )}
                          </p>
                          <p>
                            {
                              booking?.selectedReturn?.flight?.departure
                                ?.airport
                            }
                          </p>
                          <p>
                            (
                            {
                              booking?.selectedReturn?.flight?.departure
                                ?.airportCode
                            }
                            )
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-neutral"></div>
                        <strong className="flex gap-2 ">
                          <p>
                            {formatTime(
                              booking?.selectedReturn?.flight?.arrival?.time
                            )}
                          </p>
                          <p>-</p>
                          <p className="text-[#00A8D0]">Kedatangan</p>
                        </strong>
                      </div>
                      <div className="py-3 ps-7 text-sm">
                        <p>
                          {formatDate(
                            booking?.selectedReturn?.flight?.arrival?.time
                          )}
                        </p>
                        <p>
                          {booking?.selectedReturn?.flight?.arrival?.airport}
                        </p>
                        <p>
                          (
                          {
                            booking?.selectedReturn?.flight?.arrival
                              ?.airportCode
                          }
                          )
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Total Harga*/}
              <div className="px-8 py-4 text-sm">
                <hr className="my-4 text-neutral" />
                <div className="flex text-lg justify-between">
                  <p>Total Pembayaran</p>
                  <div className="flex items-center gap-3">
                    <p>
                      <strong>{formatPrice(calculateTotal(totalHarga))}</strong>
                    </p>
                    <button onClick={handleOpenModal}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 1024 1024"
                      >
                        <path
                          fill="currentColor"
                          d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001c13.2-13.2 34.8-13.2 48 0l451.8 451.8l445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
}

export default Pemesanan;

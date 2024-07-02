import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { Footnote, PageBottom, CSS } from "@fileforge/react-print";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { getBookingHistoryDetail } from "../../redux/actions/historyActions";
import { useNavigate } from "react-router-dom";

const CetakTiket = ({ bookingDetail }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();

  const bookingHistoryDetail = useSelector(
    (state) => state.history.bookingHistoryDetail
  );
  const passengers = bookingDetail?.passengers || [];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "E-tiket.pdf",
  });

  return (
    <div>
      <button
        onClick={() => {
          bookingDetail?.status === "UNPAID"
            ? navigate("/pembayaran")
            : handlePrint();
        }}
        className={`text-white font-medium text-sm py-2.5 px-12 rounded-full w-full mt-4 ${
          bookingDetail?.status === "UNPAID"
            ? "bg-secondary hover:bg-darksecondary"
            : "bg-primary hover:bg-darkprimary"
        }`}
      >
        {bookingDetail?.status === "UNPAID" || bookingDetail?.status === "UNPAID" ? "Lanjut Bayar" : "Cetak Tiket"}
      </button>
      <div style={{ display: "none" }}>
        <TicketContent
          ref={componentRef}
          bookingDetail={bookingDetail}
          bookingHistoryDetail={bookingHistoryDetail}
          passengers={passengers}
        />
      </div>
    </div>
  );
};

const TicketContent = React.forwardRef(
  ({ bookingDetail, bookingHistoryDetail, passengers }, ref) => {
    // Handle case when bookingHistoryDetail is undefined or null
    if (!bookingHistoryDetail) {
      return <div ref={ref}>Loading...</div>;
    }

    const convertToTime = (dateString) => {
      const date = new Date(dateString);
      let hours = date.getUTCHours();
      let minutes = date.getUTCMinutes();

      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;

      return `${hours}.${minutes}`;
    };

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
      <div ref={ref} className="p-4">
        <CSS>
          {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

        @page {
          size: a4;
          margin: .75in .75in 1in .75in;
        }
        `}
        </CSS>
        <div className="font-[inter] text-slate-800">
          <div className="bg-slate-100 -z-10 absolute -bottom-[1in] -right-[.75in] -left-[.75in] rounded-t-[.75in] h-[20vh]"></div>
          <PageBottom>
            <div className="text-xs text-slate-400 border-t border-t-slate-300 py-4 mt-4 flex border-b border-b-slate-300">
              <div>PT Lentera Bangsa Benderang</div>
              <div className="flex-grow" />
              <div>
                <a
                  href="https://aviatick.vercel.app"
                  target="_blank"
                  className="underline underline-offset-2 "
                >
                  Aviatick
                </a>
              </div>
            </div>
          </PageBottom>
          <div className="flex items-start mt-2">
            <div>
              <img
                src="/logo-blue.png"
                className="w-16 mb-12 fill-slate-800"
              />
              <h1 className="text-2xl font-bold">Flight E-ticket</h1>
              <p className="text-slate-400 mb-8 pt-1">
                Order ID {bookingDetail?.booking_code}
              </p>
            </div>
            <div className="flex-grow" />
          </div>
          <div className="p-6 rounded-xl mt-6 -mx-6">
            <h2 className="mb-2 text-xs font-bold text-slate-500 uppercase">
              Penerbangan Pergi
            </h2>
            <div className="flex">
              <div className="basis-0 flex-grow gap-4">
                <img
                  src={
                    bookingDetail?.flight_detail.departure_flight.airline
                      .logo_url
                  }
                  alt={`${bookingDetail?.flight_detail.departure_flight.airline.name} logo`}
                  className="h-12 w-12 mr-4 object-contain"
                />
                <h2 className="font-bold">
                  {bookingDetail?.flight_detail.departure_flight.airline.name}
                </h2>
                {bookingDetail?.flight_detail.departure_flight.seat_class}
              </div>
              <div className="basis-0 flex-grow">
                <p>{formatDateToDayMonthYear(bookingDetail?.createdAt)} </p>
                <p>
                  {
                    bookingDetail?.flight_detail.departure_flight.airport
                      .departure
                  }{" "}
                  -{" "}
                  {bookingDetail?.flight_detail.departure_flight.departure_city}{" "}
                </p>
                <p>
                  {convertToTime(
                    bookingDetail?.flight_detail.departure_flight.departure_time
                  )}{" "}
                </p>
                <p className="font-semibold">To</p>
                <p>
                  {bookingDetail?.flight_detail.departure_flight.airport.arrival}{" "}
                  - {bookingDetail?.flight_detail.departure_flight.arrival_city}{" "}
                </p>
                <p>
                  {convertToTime(
                    bookingDetail?.flight_detail.departure_flight.arrival_time
                  )}{" "}
                </p>
              </div>
            </div>
          </div>
          {bookingDetail?.flight_detail.return_flight && (
            <div className="p-6 bg-slate-100 rounded-xl -mx-6 mb-6">
              <h2 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                Penerbangan Pulang
              </h2>
              <div className="flex">
                <div className="basis-0 flex-grow gap-4">
                  <img
                    src={
                      bookingDetail?.flight_detail?.return_flight?.airline?.logo_url
                    }
                    alt={`${bookingDetail?.flight_detail?.return_flight?.airline?.name} logo`}
                    className="h-12 w-12 mr-4 object-contain"
                  />
                  <h2 className="font-bold">
                    {bookingDetail?.flight_detail?.return_flight?.airline?.name}
                  </h2>
                  {bookingDetail?.flight_detail?.return_flight?.seat_class}
                </div>
                <div className="basis-0 flex-grow">
                  <p>
                    {formatDateToDayMonthYear(
                      bookingDetail?.flight_detail?.return_flight?.date
                    )}{" "}
                  </p>
                  <p>
                    {
                      bookingDetail?.flight_detail?.return_flight?.airport
                        .departure
                    }{" "}
                    - {bookingDetail?.flight_detail?.return_flight?.departure_city}{" "}
                  </p>
                  <p>
                    {convertToTime(
                      bookingDetail?.flight_detail?.return_flight?.departure_time
                    )}{" "}
                  </p>
                  <p className="font-semibold">To</p>
                  <p>
                    {bookingDetail?.flight_detail?.return_flight?.airport.arrival}{" "}
                    - {bookingDetail?.flight_detail?.return_flight?.arrival_city}{" "}
                  </p>
                  <p>
                    {convertToTime(
                      bookingDetail?.flight_detail?.return_flight?.arrival_time
                    )}{" "}
                  </p>
                </div>
              </div>
            </div>
          )}
          <h2 className="mb-2 text-xs font-bold text-slate-500 uppercase">
            Detail Penumpang
          </h2>
          <table className="w-full my-2 border-collapse">
            <thead>
              <tr className="border-b font-bold text-slate-500">
                <th className="text-left py-3">No</th>
                <th className="text-left py-3">Penumpang</th>
                <th className="text-left py-3">
                  No. Penerbangan & No KTP/SIM/Paspor
                </th>
                <th className="text-left py-3">Fasilitas</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(passengers) ? (
                passengers.map((passenger, index) => (
                  <tr className="border-b" key={index}>
                    <td className="text-left py-3">{index + 1}.</td>
                    <td className="text-left py-3">
                      {passenger.title} {passenger.fullname}
                    </td>
                    <td className="text-left py-3">
                      {
                        bookingDetail?.flight_detail.departure_flight
                          .flightNumber
                      }
                      {bookingDetail?.flight_detail.return_flight && (
                        <>
                          {" "}
                          /{" "}
                          {
                            bookingDetail?.flight_detail.return_flight
                              .flightNumber
                          }
                        </>
                      )}{" "}
                      / {passenger.ktp}
                    </td>
                    <td className="text-left py-3">
                      {bookingDetail.flight_detail.departure_flight.in_flight_facility }
                      {bookingDetail?.flight_detail.return_flight && (
                        <>
                          {" "}
                          /{" "}
                          {
                            bookingDetail.flight_detail.return_flight
                              .in_flight_facility
                          }
                        </>
                      )}{" "}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No passengers available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* <div className="bg-slate-100 p- rounded-xl mt-6">
            Tiket ini dapat dicetak dan dibawa untuk ditunjukkan kepada petugas.
          </div> */}
        </div>
      </div>
    );
  }
);

export default CetakTiket;

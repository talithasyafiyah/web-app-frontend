import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { getPromoById, getPromos } from "../../../redux/actions/promoActions";
import { useNavigate } from "react-router-dom";
import { setDepartureResults, setFavDestinationResults, setTripTypeSaved } from "../../../redux/reducers/searchFlightReducers";
import { ThreeDots } from "react-loader-spinner";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import UnifiedModal from "../../modals/Modal";
import { setPassenger } from "../../../redux/reducers/bookingReducers";

const PromoSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
   const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const promos = useSelector((state) => state?.promo.promos);

  useEffect(() => {
    setPromoLoading(true);
    dispatch(getPromos())
      .then(() => setPromoLoading(false))
      .catch(() => setPromoLoading(true));
  }, [dispatch]);

  const formatPrice = (price) => {
    return `IDR ${new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(price)}`;
  };

  const discountPercentage = (price, afterDiscount) => {
    return ((price - afterDiscount) / price) * 100;
  };

  const formatDateToDayMonthYear = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return "";
    }

    const [datePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-");
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handlePromoClick = (promo) => {
    openModal("passenger", promo);
    dispatch(setDepartureResults([]));
    dispatch(setFavDestinationResults([]));
  };

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "transparent",
          width: "22px",
          height: "22px",
          cursor: "pointer",
          borderRadius: "50%",
        }}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          style={{ width: "100%", height: "100%", fill: "#00A8D0" }} // Adjust fill color as needed
        >
          <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
        </svg>
      </div>
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "transparent",
          width: "22px",
          height: "22px",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          style={{
            width: "100%",
            height: "100%",
            fill: "#00A8D0",
            transform: "scaleX(-1)",
          }}
        >
          <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
        </svg>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  const handleSave = (data, endDate) => {
    if (modalType === "passenger") {
      setPassengers(data);
      dispatch(setPassenger(data));
      dispatch(getPromoById(modalData.id, navigate, setLoading));
    }
    setIsModalOpen(false);
  };

  const openModal = (type, data) => {
    setModalType(type);
    if (type === "passenger") {
      setModalData(data);
    }
    setIsModalOpen(true);
  };

  return (
    <section id="promo-section">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white backdrop-blur-sm bg-opacity-50 z-50">
          <ThreeDots
            visible={true}
            height="60"
            width="60"
            color="#00A8D0"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={40}
            height={40}
            viewBox="0 0 10 10"
            className="text-secondary mt-12"
          >
            <path fill="currentColor" d="M0 7h16v1H0z"></path>
          </svg>
          <span className="text-xl md:text-2xl font-bold text-main">Promo</span>
          <span className="text-xl md:text-2xl ml-2 font-bold text-primary">
            Terbaik
          </span>
          <h1 className="text-sm md:text-base text-left text-main leading-5">
            Pesan sekarang dan jelajahi destinasi impianmu dengan diskon
            menarik! ✈️✨
          </h1>
        </div>
      </div>

      {promoLoading ? (
        <div className="mt-4 md:mt-10">
          <Slider {...settings}>
            {Array.from({ length: 28 }).map((_, index) => (
              <div key={index} className="px-2 py-1">
                <div className="relative w-full bg-white rounded-lg h-full bg-transparent overflow-visible text-main">
                  {/* Skeleton for Image */}
                  <Skeleton height={136} width="100%" className="rounded-t-lg" />
                  <div className="p-3">
                    {/* Skeleton for Title */}
                    <Skeleton width="60%" height={20} className="mb-2" />
                    {/* Skeleton for Date */}
                    <Skeleton width="40%" height={15} className="mb-1" />
                    {/* Skeleton for Airline */}
                    <Skeleton width="50%" height={15} className="mb-1" />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
      </div>
      ) : (
        <>
          <div className="mt-4 md:mt-10">
            {promos.length > 0 && (
              <Slider {...settings}>
                {promos.map((promo, id) => (
                  <div
                    key={id}
                    className="px-2 py-1"
                    onClick={() => handlePromoClick(promo)}
                  >
                    <div className="relative w-full bg-white rounded-lg shadow-md h-full bg-transparent overflow-visible text-main hover:shadow-lg cursor-pointer">
                      <div className="relative">
                        <div className="absolute z-10 top-2 -right-1 w-[70px] md:w-[80px]">
                          {/* Discount tag */}
                          <img
                            className="relative z-10 w-full"
                            src="/discount-tag.png"
                            alt="Diskon"
                          />
                          <p className="absolute z-20 top-2 left-2 text-xs text-white font-medium">
                            Diskon{" "}
                            {discountPercentage(
                              promo.price,
                              promo.afterDiscountPrice
                            )}
                            %
                          </p>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="relative">
                        <img
                          className="w-full cursor-pointer object-cover h-[136px] rounded-t-lg"
                          src={promo.flight.arrival.imageUrl}
                          alt={`${promo.flight.arrival.city} image`}
                        />
                      </div>

                      {/* Text content */}
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-main mb-2">
                          {promo.flight.departure.city} →{" "}
                          {promo.flight.arrival.city}
                        </h3>
                        <div className="flex items-center gap-1 mb-1">
                          <img src="/icons/calendar.svg" alt="Calendar" />
                          <p className="text-darkgray font-medium text-xs">
                            {formatDateToDayMonthYear(promo.flight.departure.time)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <img
                            src={promo.airplane.airline.logoUrl}
                            alt={`${promo.airplane.airline.name} logo`}
                            className="w-4 h-4"
                          />
                          <p className="text-darkgray font-medium text-xs">
                            {promo.airplane.airline.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mb-4">
                          <p className="text-primary font-medium text-xs">
                            {promo.type}
                          </p>
                        </div>

                        <p className="text-danger text-base font-bold mt-2 text-right">
                          {formatPrice(promo.afterDiscountPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </>
      )}

      <UnifiedModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        type={modalType}
        onSave={handleSave}
        initialData={modalData}
      />
    </section>
  );
};

export default PromoSection;

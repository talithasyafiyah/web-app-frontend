import React, { useEffect, useState } from "react";
import Footer from "../../components/navigations/Footer";
import Navbar from "../../components/navigations/Navbar";
import FilterButton from "../../components/buttons/FilterButton";
import { useDispatch, useSelector } from "react-redux";
import { getNotifByFilter, getNotifications } from "../../redux/actions/notifActions";
import BackToTopButton from "../../components/navigations/BackToTop";
import BackButtonMobile from "../../components/navigations/BackButtonMobile";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Notifikasi() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const notifications = useSelector((state) => state?.notif?.notifications);
  const notifByFilter = useSelector((state) => state?.notif?.notifByFilter);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      navigate("/masuk");
      toast.error("Ups.. tidak dapat mengakses halaman, silakan masuk terlebih dahulu.");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setLoading(true);
          if (filterType === "All") {
            await dispatch(getNotifications());
          } else {
            await dispatch(getNotifByFilter(filterType));
          }
        } catch (error) {
          toast.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
    
  }, [dispatch, filterType, token]);

  const handleFilterSelect = (option) => {
    const typeMap = {
      All: "All",
      General: "General",
      Transaksi: "Transaction",
      Promo: "Promo",
    };
    setFilterType(typeMap[option] || "All");
  };

   const displayedNotif = filterType === "All" ? notifications : notifByFilter;

  const formatDateToDayMonthYear = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return "";
    }

    const [datePart, timePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-");
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getSvgIcon = (type) => {
    if (type === "promo") {
      return (
        <svg
          className="w-3 h-3 md:w-4 md:h-4 fill-secondary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>
      );
    } else if (type === "transaction") {
      return (
        <svg
          className="w-3 h-3 md:w-4 md:h-4 fill-secondary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-3 h-3 md:w-4 md:h-4 fill-secondary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M432 64H208c-8.8 0-16 7.2-16 16V96H128V80c0-44.2 35.8-80 80-80H432c44.2 0 80 35.8 80 80V304c0 44.2-35.8 80-80 80H416V320h16c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16zM0 192c0-35.3 28.7-64 64-64H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192zm64 32c0 17.7 14.3 32 32 32H288c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32 14.3-32 32z" />
        </svg>
      );
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar transparent={false} />
      </div>

      <BackButtonMobile />

      {/* Notification Section */}
      <section className="pt-0 md:pt-28 pb-80 md:pb-96">
        <div className="container">
          {/* Breadcrumb */}
          <div className="hidden md:flex gap-1.5 text-main text-sm font-medium -mt-4 md:-mt-0 mb-10 md:mb-5">
            <span>Beranda</span>
            <img src="/icons/right-chev.svg" alt="chevron" />
            <span>Notifikasi</span>
          </div>

          <div className="relative mt-6">
            {/* Title */}
            <div
              style={{
                backgroundImage: 'url("/search-flight-banner.png")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
              className="hidden md:block w-full"
            >
              <div className="flex justify-between items-center pt-4 pb-10 px-6">
                <h1 className="text-2xl font-bold text-white ">
                  Notifikasi
                </h1>
                <FilterButton
                  label="Filter"
                  options={["All", "General", "Transaksi", "Promo"]}
                  onOptionSelect={handleFilterSelect}
                  selectedOption={filterType}
                />
              </div>
            </div>
            <div className="md:hidden flex items-center justify-between pb-4 border-b border-neutral -mt-3">
              <h1 className="text-2xl font-semibold text-main">Notifikasi</h1>
              <FilterButton
                label="Filter"
                options={["All", "General", "Transaksi", "Promo"]}
                onOptionSelect={handleFilterSelect}
                selectedOption={filterType}
                className="bg-primary"
                notif
              />
            </div>

            {loading ? (
              <div className="flex flex-col !w-full items-center justify-center text-center font-medium text-sm mt-16">
                <img
                  src="/animations/loading.gif"
                  alt="Loading"
                  className="w-[99px]"
                />
                <p className="text-xs md:text-sm text-main">
                  Menampilkan notifikasi...
                </p>
              </div>
            ) : displayedNotif && displayedNotif.length > 0 ? (
              <div className="w-full md:bg-white rounded-lg md:shadow-md md:-mt-8">
                {displayedNotif.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start pt-4 p-0 md:p-4 hover:bg-primary/10 cursor-pointer"
                  >
                    <div className="flex-shrink-0 rounded-full bg-primary p-1 md:p-1.5">
                      {getSvgIcon(notif.type)}
                    </div>
                    <div className="ml-4 w-full">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm  md:text-base text-main">
                          {notif.title}
                        </span>
                        <span className="text-xs md:text-sm font-normal text-darkgray">
                          {formatDateToDayMonthYear(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm font-normal text-darkgray">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col !w-full items-center justify-center text-center font-medium text-sm mt-16">
                <img
                  src="/animations/notfound.gif"
                  alt="Not found"
                  className="w-[99px]"
                />
                <p className="text-xs md:text-sm text-main">
                  Saat ini tidak ada notifikasi
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <BackToTopButton />
      <Footer />
    </div>
  );
}

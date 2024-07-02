import axios from "axios";
import {
  setCountries,
  setDataMidtrans,
  setDataPayment,
  setDetailBooking,
  setPrepareBooking,
} from "../reducers/bookingReducers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBookingHistoryDetail } from "./historyActions";
import { setBookingHistoryDetail } from "../reducers/historyReducers";

export const getCountries = () => async (dispatch) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/all`);
    dispatch(setCountries(response.data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.message);
      return;
    }
    toast.error(error.message);
  }
};

export const getPrepareTicket =
  (formData, tripType, navigate, setIsLoading, setShowConfirmModal) =>
  async (dispatch, getState) => {
    setIsLoading(true);
    const token = getState().auth.token;
    try {
      const response = await axios.post(
        `https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/bookings/prepare/${tripType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsLoading(false);
      setShowConfirmModal(true);
      dispatch(setPrepareBooking(response.data));
    } catch (error) {
      setIsLoading(false);
      setShowConfirmModal(false);
      if (error.response.status == 400) {
        toast.error("Pemesanan gagal! Silakan periksa kembali data Anda.");
      } else if (error.response.status == 401) {
        toast.error("Anda belum login!");
        navigate("/login");
      } else if (error.response.status == 403) {
        toast.error(
          "Akses Ditolak! Anda tidak memiliki izin untuk melakukan aksi ini."
        );
        navigate("/");
      } else if (error.response.status == 404) {
        navigate("*");
      } else if (error.response.status == 500) {
        toast.error("Terjadi kesalahan pada server! Silakan coba lagi nanti.");
        navigate("/");
      } else if (error.response.status == 503) {
        toast.error(
          "Layanan tidak tersedia! Server mungkin sedang sibuk. Coba lagi nanti."
        );
        navigate("/");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error(
          "Tidak ada respons dari server. Periksa koneksi internet Anda."
        );
        navigate("/");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`Kesalahan: ${error.message}`);
      }
    }
  };

export const getBookingTicketCompleted =
  (formData, navigate, setIsLoading, setDetailLoading) =>
  async (dispatch, getState) => {
    setIsLoading(true);
    const token = getState().auth.token;
    try {
      const response = await axios.post(
        `https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/bookings/completed`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsLoading(false);
      const bookingId = response.data.data.booking.id;

      await dispatch(
        getBookingHistoryDetail(bookingId, setIsLoading, setDetailLoading)
      );
      dispatch(setDataPayment(response.data));

      navigate("/pembayaran");
    } catch (error) {
      setIsLoading(false);
      if (error.response.status == 400) {
        toast.error("Pemesanan gagal! Silakan periksa kembali data Anda.");
      } else if (error.response.status == 401) {
        toast.error("Anda belum login!");
        navigate("/login");
      } else if (error.response.status == 403) {
        toast.error(
          "Akses Ditolak! Anda tidak memiliki izin untuk melakukan aksi ini."
        );
        navigate("/");
      } else if (error.response.status == 404) {
        navigate("*");
      } else if (error.response.status == 500) {
        toast.error("Terjadi kesalahan pada server! Silakan coba lagi nanti.");
        navigate("/");
      } else if (error.response.status == 503) {
        toast.error(
          "Layanan tidak tersedia! Server mungkin sedang sibuk. Coba lagi nanti."
        );
        navigate("/");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error(
          "Tidak ada respons dari server. Periksa koneksi internet Anda."
        );
        navigate("/");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`Kesalahan: ${error.message}`);
      }
    }
  };

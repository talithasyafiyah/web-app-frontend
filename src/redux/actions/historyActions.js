import axios from "axios";
import { toast } from "react-toastify";
import {
  setBookingHistory,
  setBookingHistoryDetail,
  setHistoryByDate,
  setHistorySearchResults,
} from "../reducers/historyReducers";

const url = import.meta.env.VITE_BASE_URL;

export const getUserBookingHistory = () => async (dispatch, getState) => {
  const token = getState().auth.token;

  try {
    const response = await axios.get(`${url}/bookings/booking-history`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setBookingHistory(response.data.data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.message);
      return;
    }
    toast.error(error.message);
  }
};

export const getBookingHistoryDetail =
  (bookingId, setIsLoading, setDetailLoading) => async (dispatch, getState) => {
    setIsLoading(true);
    setDetailLoading(true);

    const token = getState().auth.token;
    try {
      const response = await axios.get(
        `${url}/bookings/booking-history/${bookingId}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setBookingHistoryDetail(response.data.data));
      setIsLoading(false);
      setDetailLoading(false);
    } catch (error) {
      setIsLoading(false);
      setDetailLoading(false);
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
        return;
      }
      toast.error(error.message);
    }
  };

export const getHistorySearchResults = () => async (dispatch, getState) => {
  const searchTerm = getState().history.historyKeyword;
  const token = getState().auth.token;

  try {
    const response = await axios.get(
      `${url}/bookings/booking-history?search=${searchTerm}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setHistorySearchResults(response.data.data || []));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.message);
      return;
    }
    toast.error(error.message);
  }
};

export const getHistoryByDate = () => async (dispatch, getState) => {
  const date = getState().history.date;
  const token = getState().auth.token;

  try {
    const response = await axios.get(
      `${url}/bookings/booking-history?date=${date}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setHistoryByDate(response.data.data || []));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.message);
      return;
    }
    toast.error(error.message);
  }
};

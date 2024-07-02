import axios from "axios";
import { toast } from "react-toastify";
import { setNotifByFilter, setNotifications } from "../reducers/notifReducers";

const url = import.meta.env.VITE_BASE_URL;

export const getNotifications = () => async (dispatch, getState) => {
  const token = getState().auth.token;

  try {
    const response = await axios.get(`${url}/notifications?limit=500`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("response", response.data.data);
    const sortedData = response.data.data.sort((a, b) => b.id - a.id);
    dispatch(setNotifications(sortedData));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.message);
      return;
    }
    toast.error(error.message);
  }
};

export const getNotifByFilter = (filterType) => async (dispatch, getState) => {
  const token = getState().auth.token;
  const type = filterType === "all" ? "" : filterType.toLowerCase();

  try {
    const response = await axios.get(
      `${url}/notifications?limit=500&type=${type}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const sortedData = response.data.data.sort((a, b) => b.id - a.id);
    dispatch(setNotifByFilter(sortedData));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.message);
      return;
    }
    toast.error(error.message);
  }
};

import axios from "axios";
import { toast } from "react-toastify";
import {
  setFavDestinations,
  setFavDestinationsByFilter,
} from "../reducers/favoriteDestinationReducers";
import {
  setDepartureResults,
  setFavDestinationResults,
  setFlightKeyword,
  setTripTypeSaved,
} from "../reducers/searchFlightReducers";

const url = import.meta.env.VITE_BASE_URL;

export const getFavDestinations = () => async (dispatch) => {
  try {
    const response = await axios.get(`${url}/flights/favorite?page=1&limit=10`);

    dispatch(setFavDestinations(response.data.data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.message);
      return;
    }
    toast.error(error.message);
  }
};

export const getFavDestinationsByFilter = (continent) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${url}/flights/favorite?arrivalContinent=${continent}&page=1&limit=5`
    );
    
    dispatch(setFavDestinationsByFilter(response.data.data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.message);
      return;
    }
    toast.error(error.message);
  }
};

export const getFavDestinationById =
  (ticketId, navigate, setLoading) => async (dispatch) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        ticketId.map(async (id) => {
          const response = await axios.get(`${url}/tickets/${id}`);
          return response.data.data;
        })
      );
      dispatch(setFavDestinationResults(results));
      dispatch(setFlightKeyword([]));
      dispatch(setTripTypeSaved(null));
      setLoading(false);
      navigate("/hasil-pencarian/destinasi");
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
        return;
      }
      toast.error(error.message);
    }
  };

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favDestinations: [],
  favDestinationsByFilter: []
};

const favDestinationSlicer = createSlice({
  name: "favDestination",
  initialState,
  reducers: {
    setFavDestinations: (state, action) => {
      state.favDestinations = action.payload;
    },
    setFavDestinationsByFilter: (state, action) => {
      state.favDestinations = action.payload;
    },
  },
});

export const { setFavDestinations, setFavDestinationsByFilter } = favDestinationSlicer.actions;

export default favDestinationSlicer.reducer;

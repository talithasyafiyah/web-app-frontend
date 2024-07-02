import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  promos: [],
};

const promoSlicer = createSlice({
  name: "promo",
  initialState,
  reducers: {
    setPromo: (state, action) => {
      state.promos = action.payload;
    },
    setResetPromo: (state, action) => {
      state.promos = [];
    },
  },
});

export const {
  setPromo, setResetPromo
} = promoSlicer.actions;

export default promoSlicer.reducer;

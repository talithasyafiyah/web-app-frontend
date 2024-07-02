import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  notifByFilter: []
};

const notifSlicer = createSlice({
  name: "notif",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setNotifByFilter: (state, action) => {
      state.notifByFilter = action.payload;
    },
  },
});

export const { setNotifications, setNotifByFilter } = notifSlicer.actions;

export default notifSlicer.reducer;

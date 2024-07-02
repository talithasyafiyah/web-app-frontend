// reducers/authReducer.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isLoggedIn: false,
  user: null,
  login: null,
  email: "",
  message: "",
  error: "",
  password: "",
  confirmPassword: "",
  // showPassword: false,
  loading: false,
};

const authSlicer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogin: (state, action) => {
      state.login = action.payload;
    },
    forgotPasswordSuccess: (state, action) => {
      state.message = action.payload.message;
      state.error = "";
    },
    forgotPasswordFailure: (state, action) => {
      state.message = "";
      state.error = action.payload.error;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action) => {
      state.confirmPassword = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.loading = false;
      state.message = "Password reset successful!";
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = "Error resetting password";
    },
    verifyEmailSuccess: (state, action) => {
      state.message = action.payload;
      state.error = "";
    },
    verifyEmailFailure: (state, action) => {
      state.message = "";
      state.error = action.payload;
    },
    resendOtpSuccess: (state) => {
      state.error = "";
    },
    resendOtpFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setToken,
  setIsLoggedIn,
  setUser,
  setLogin,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  setPassword,
  setConfirmPassword,
  setEmail,
  setMessage,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  verifyEmailSuccess,
  verifyEmailFailure,
  resendOtpSuccess,
  resendOtpFailure,
} = authSlicer.actions;

export default authSlicer.reducer;

import axios from "axios";
import { toast } from "react-toastify";
import {
  setIsLoggedIn,
  setLogin,
  setToken,
  setUser,
} from "../reducers/authReducers";
import { jwtDecode } from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";
import { data } from "autoprefixer";
import { Navigate } from "react-router-dom";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import { ThreeDRotationTwoTone } from "@mui/icons-material";
import { setBooking } from "../reducers/bookingReducers";

const url = import.meta.env.VITE_BASE_URL;

export const login =
  (data, navigate, setMessage, setLoading) => async (dispatch, getState) => {
    const booking = JSON.parse(localStorage.getItem("booking"));
    setLoading(true);
    try {
      const response = await axios.post(`${url}/auth/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const token = response.data.data.token;

      if (response.status === 200) {
        setLoading(false);
        toast.success("Login successful");
        dispatch(setToken(token));
        dispatch(setIsLoggedIn(true));
        dispatch(setLogin("login"));
        dispatch(setUser(response.data.data.user));
        if (booking) {
          navigate("/konfirmasi-tiket");
        } else {
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setMessage(error.response.data.message);
        return;
      }
      setMessage(error.message);
    }
  };

export const register =
  (data, navigate, setMessage, setLoading) => async (dispatch, getState) => {
    const { fullName, email, phoneNumber, password } = data;
    setLoading(true);
    try {
      const response = await axios.post(
        "https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/auth/register",
        data
      );

      if (response.status === 200) {
        setLoading(false);
        toast.success("Berhasil mendaftar akun.");
        localStorage.setItem("userEmail", email);
        navigate("/verifikasi-email");
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        throw error.response.data.message;
        return;
      }
      setMessage(error.message);
    }
  };

export const googleAction = (accessToken, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/auth/login-google",
      { access_token: accessToken },
      { headers: { "Content-Type": "application/json" } }
    );
    toast.success("Login successful");
    dispatch(setToken(response.data.data.token));
    dispatch(setIsLoggedIn(true));
    dispatch(setLogin("google"));
    dispatch(setUser(response.data.data.user));
    setTimeout(() => {
      navigate("/");
    }, 1500);
  } catch (error) {
    toast.error("Gagal masuk dengan google", error);
  }
};

export const fetchUser = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${url}/auth/users/profile`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.request(config);
    if (response.status !== 200) {
      throw new Error("Failed to fetch user data");
    }
    const user = response.data;
    dispatch(setUser(user));
    return user;
  } catch (error) {
    throw error; // Re-throw the error for the calling function to handle
  }
};

export const loadUserProfile = (setUser) => async (dispatch) => {
  try {
    // Call fetchUser to get user data
    const user = await dispatch(fetchUser());
    if (user) {
      setUser(user);
    } else {
      toast.error("Failed to fetch user data");
    }
  } catch (error) {
    throw error.message;
  }
};

export const deleteAccount =
  (navigate, setLoading) => async (dispatch, getState) => {
    const token = getState().auth.token;
    setLoading(true);
    try {
      const response = await axios.delete(`${url}/auth/users`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        toast.success("Akun berhasil dihapus");
        dispatch(setToken(null));
        dispatch(setIsLoggedIn(false));
        dispatch(setUser(null));
        dispatch(setLogin(null));
        setTimeout(() => {
          navigate("/masuk");
        }, 1500);
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    }
  };

export const updateUserProfile = (user) => async (dispatch, getState) => {
  const state = getState();

  const token = state.auth.token;

  if (!token) {
    const errorMessage = "No token found, user might not be authenticated";
    toast.error(errorMessage);
    return;
  }

  try {
    const response = await axios.put(`${url}/auth/users/profile`, user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      dispatch(setUser(user));
      toast.success("Berhasil memperbarui profil");
    }
  } catch (error) {
    toast.error("Error updating user profile:", error);
  }
};

export const changePassword = (data) => async (dispatch, getState) => {
  const token = getState().auth.token;
  try {
    const response = await axios.post(`${url}/auth/change-password`, data, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      toast.success("Berhasil mengubah password");
      return true;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response.data.message);
      return false;
    }
    toast.error(error.message);
    return false;
  }
};

export const noAccessToken = (navigate) => async (dispatch, getState) => {
  const loginType = getState().auth.login;
  const token = getState().auth.token;
  if (loginType) {
    if (loginType === "google") {
      const decoded = jwtDecode(token);
      if (decoded?.exp < new Date() / 1000) {
        dispatch(setToken(null));
        dispatch(setIsLoggedIn(false));
        dispatch(setUser(null));
        dispatch(setLogin(null));
        toast.error("Token kadaluarsa.");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
      }
    } else {
      try {
        await axios.get(`${url}/auth/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        dispatch(setToken(null));
        dispatch(setIsLoggedIn(false));
        dispatch(setUser(null));
        dispatch(setLogin(null));
        toast.error("Token kadaluarsa.");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
        toast.error(error);
      }
    }
  }
};

export const googleLogin = async (accessToken, navigate, dispatch) => {
  try {
    let data = JSON.stringify({
      access_token: accessToken,
    });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/auth/google`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    const token = response.data.data;
    localStorage.setItem("token", token);
    dispatch(setToken(token));
    dispatch(setIsLoggedIn(true));
    dispatch(setLogin("google"));
    toast.success("Login successful.");
    setTimeout(() => {
      navigate("/", { state: { token: token } });
    }, 1500);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response.data.message);
      return;
    }
  }
};

export const getUser = () => async (dispatch, getState) => {
  const loginType = getState().auth.login;
  const token = getState().auth.token;

  if (loginType === "google") {
    const decodedToken = jwtDecode(token);
    dispatch(setUser(decodedToken));
  } else {
    try {
      const response = await axios.get(
        "https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/auth/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUser(response.data.data));
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  }
};

export const forgotPassword = (email, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/auth/forgot-password",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      toast.success("Reset link sent to your email");
      localStorage.setItem("userEmail", email); // Simpan email ke localStorage
      dispatch(setToken(token));
      navigate("/reset-password");
    } else if (response.status === 400) {
      toast.error("forgotPassword - bad request");
      toast.error("Bad request");
    } else {
      throw new Error("Failed to send reset link");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw ("error", error);
    } else {
      throw ("Error:", error.message);
    }
    toast.error("Error sending reset link");
  }
};

// Action creators for reset password
export const resetPassword =
  (password, token, navigate) => async (dispatch) => {
    try {
      const response = await axios.post(
        `https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/auth/reset-password?token=${token}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        toast.error("Failed to reset password, status:", response.status);
        throw new Error("Failed to reset password");
      }

      toast.success("Password reset successful");
      localStorage.removeItem("userEmail"); // Remove userEmail from localStorage
      navigate("/masuk");
    } catch (error) {
      toast.error("Error occurred during password reset:", error.message);
      toast.error("Error resetting password");
      // dispatch(resetPasswordFailure(error.message)); // Dispatch failure action with error message
    }
  };

export const verifyEmail = (data, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/auth/verify-otp",
      data
    );

    if (response.status === 200) {
      toast.success(
        "Berhasil verifikasi email, silakan login terlebih dahulu."
      );
      setTimeout(() => {
        navigate("/masuk");
      }, 1500);
      localStorage.removeItem("userEmail");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error("error", error);
    } else {
      toast.error("Error:", error.message);
    }
  }
};

export const resendOtp = (email) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://aviatick-backend-git-development-aviaticks-projects.vercel.app/api/v1/auth/resend-otp",
      { email: email }
    );
    if (response.status === 200) {
      toast.success("OTP has been resent.");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error("error", error);
    } else {
      toast.error("Error:", error.message);
    }
  }
};

export const checkToken = (navigate) => (dispatch, getState) => {
  const token = getState().auth.token;

  if (!token) {
    toast.error(
      "Ups.. tidak dapat mengakses halaman, silakan masuk terlebih dahulu."
    );
    navigate("/masuk");
  }
};

export const logout = (navigate) => (dispatch) => {
  try {
    dispatch(setToken(null));
    dispatch(setIsLoggedIn(false));
    dispatch(setUser(null));
    dispatch(setLogin(null));
    localStorage.removeItem("booking");

    if (navigate) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
    toast.success("Berhasil log out.");
  } catch (error) {
    toast.error(error?.message);
  }
};

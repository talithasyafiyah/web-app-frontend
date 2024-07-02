import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/navigations/Footer";
import Navbar from "../../components/navigations/Navbar";
import MobileNavbar from "../../components/navigations/MobileNavbar";
import {
  changePassword,
  deleteAccount,
  fetchUser,
  loadUserProfile,
  logout,
} from "../../redux/actions/authActions";
import { updateUserProfile } from "../../redux/actions/authActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

export default function Akun() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [identityType, setIdentityType] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmLogoutModalOpen, setConfirmLogoutModalOpen] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showEditFields, setShowEditFields] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("ubahProfil");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state?.auth?.user);
  const login = useSelector((state) => state?.auth?.login);

  useEffect(() => {
    if (!user) {
      navigate("/masuk");
      toast.error(
        "Ups.. tidak dapat mengakses halaman, silakan masuk terlebih dahulu."
      );
    } else {
      setFullName(user.fullName);
      setFamilyName(user.familyName);
      setPhoneNumber(user.phoneNumber);
      setEmail(user.email);
      setIdentityType(user.identityType);
      setIdentityNumber(user.identityNumber);
      setNationality(user.nationality);
    }
    // setLoading(false);
  }, [user, dispatch, navigate]);

  if (!user) {
    return null; // Return null to prevent rendering if user is not logged in
  }

  // if (loading) {
  //   return <div>Loading...</div>; // Show a loading indicator while fetching user data
  // }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedUser = {
      fullName,
      familyName,
      phoneNumber,
      email,
      identityType,
      identityNumber,
      nationality,
    };

    try {
      const success = await dispatch(updateUserProfile(updatedUser));
      if (success) {
        dispatch(loadUserProfile());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("Password tidak sesuai");
      return;
    }

    let data = {
      oldPassword,
      newPassword,
      confirmNewPassword,
    };

    const success = await dispatch(changePassword(data));

    if (success) {
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordFields(false);
      handleEditProfileToggle();
      setActiveMenuItem("ubahProfil");
    }
  };

  const handleConfirmModalToggle = () => {
    setConfirmModalOpen(!confirmModalOpen);
  };

  const handleConfirmLogoutModalToggle = () => {
    setConfirmLogoutModalOpen(!confirmLogoutModalOpen);
  };

  const handleEditProfileToggle = () => {
    setShowEditFields(true);
    setShowPasswordFields(false);
  };

  const handlePasswordChangeToggle = () => {
    setShowEditFields(false);
    setShowPasswordFields(true);
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <div className="bg-background">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white backdrop-blur-sm bg-opacity-50 z-50">
          <ThreeDots
            visible={true}
            height="60"
            width="60"
            color="#00A8D0"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar transparent={false} />
      </div>

      {/* Mobile Navbar */}
      <div className="block md:hidden">
        <MobileNavbar />
      </div>

      {/* Akun Section */}
      <section className="md:pt-28 pb-6 md:pb-80">
        {/* Banner Mobile */}
        <div className="block md:hidden w-full">
          <img src="/profile-page/banner.png" alt="" />
        </div>

        <div className="container">
          {/* Breadcrumb */}
          <div className="hidden md:flex gap-1.5 text-main text-sm font-medium -mt-4 md:-mt-0 mb-10 md:mb-5">
            <span>Beranda</span>
            <img src="/icons/right-chev.svg" alt="chevron" />
            <span>Akun</span>
          </div>

          {/* Card Section */}
          <div className="flex flex-col md:flex-row gap-4 mt-5">
            {/* Akun Menu */}
            <div className="hidden md:block md:w-1/5 lg:w-1/3 max-w-sm bg-white shadow-lg rounded-lg overflow-hidden self-start">
              <div
                onClick={() => {
                  handleMenuItemClick("ubahProfil");
                  handleEditProfileToggle();
                }}
                className={`px-4 py-4 flex gap-3 items-center cursor-pointer ${
                  activeMenuItem === "ubahProfil" ? "bg-primary/15" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 fill-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
                <span className="text-primary text-sm font-medium">
                  Ubah Profil
                </span>
              </div>
              {login !== "google" && (
                <>
                  <div
                    onClick={() => {
                      handlePasswordChangeToggle();
                      handleMenuItemClick("gantiPassword");
                    }}
                    className={`px-4 py-4 flex gap-3 items-center cursor-pointer ${
                      activeMenuItem === "gantiPassword" ? "bg-primary/15" : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 fill-secondary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                    </svg>
                    <span className="text-main font-medium text-sm">
                      Ganti Password
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      handleConfirmModalToggle();
                      handleMenuItemClick("hapusAkun");
                    }}
                    className={`px-4 py-4 flex gap-3 items-center cursor-pointer ${
                      activeMenuItem === "hapusAkun" ? "bg-primary/15" : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 fill-danger"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                    >
                      <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM471 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                    </svg>
                    <span className="text-danger font-medium text-sm">
                      Hapus Akun
                    </span>
                  </div>
                </>
              )}
              <div
                onClick={() => {
                  handleConfirmLogoutModalToggle();
                  handleMenuItemClick("keluar");
                }}
                className={`px-4 py-4 flex gap-3 items-center cursor-pointer ${
                  activeMenuItem === "keluar" ? "bg-primary/15" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 fill-danger"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                </svg>
                <span className="text-danger font-medium text-sm">Keluar</span>
              </div>
            </div>

            {/* Akun Name */}
            <div className="block md:hidden w-full bg-white shadow-lg rounded-lg overflow-hidden px-6 py-4 -mt-36">
              <h1 className="text-xl font-bold text-main mb-2">Akun</h1>
              <h1 className="text-lg font-semibold text-main">{fullName}</h1>
            </div>

            {/* Right Detail */}
            <div className="w-full md:w-3/5 lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden p-6 md:p-12">
              {showEditFields && (
                <>
                  <h1 className="text-xl md:text-2xl font-bold text-main mb-4">
                    Ubah Profil
                  </h1>
                  <form
                    onSubmit={handleUpdateProfile}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <TextInput
                        label="Nama Lengkap"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                      <TextInput
                        label="Nama Keluarga"
                        name="familyName"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                      <TextInput
                        label="Nomor Telepon"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <TextInput
                        label="Email"
                        name="email"
                        value={email}
                        disabled="true"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                      <SelectInput
                        label="Tipe Identitas"
                        name="identityType"
                        options={["KTP", "SIM", "Passport"]}
                        value={identityType}
                        onChange={(e) => setIdentityType(e.target.value)}
                      />
                      <TextInput
                        label="Nomor Identitas"
                        name="identityNumber"
                        value={identityNumber}
                        onChange={(e) => setIdentityNumber(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                      <TextInput
                        label="Kewarganegaraan"
                        name="nationality"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                      />
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm md:text-base font-medium text-white bg-primary hover:bg-darkprimary focus:outline-none"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </>
              )}

              {showPasswordFields && (
                <>
                  <h1 className="text-xl md:text-2xl font-bold text-main mb-4">
                    Ganti Password
                  </h1>
                  <form
                    onSubmit={handleChangePassword}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col gap-3 md:gap-4">
                      {/* Current Password */}
                      <div className="flex flex-col relative">
                        <TextInput
                          name="oldPassword"
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Password saat ini"
                          label="Password saat ini"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-2 top-2/3 transform -translate-y-1/2" // Position the button inside the input
                        >
                          {showOldPassword ? (
                            <svg
                              fill="#00A8D0"
                              className="w-4 hover:fill-secondary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                            >
                              <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" />
                            </svg>
                          ) : (
                            <svg
                              fill="#00A8D0"
                              className="w-4 hover:fill-secondary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* New Password */}
                      <div className="flex flex-col relative">
                        <TextInput
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Password Baru"
                          label="Password Baru"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 top-2/3 transform -translate-y-1/2" // Position the button inside the input
                        >
                          {showNewPassword ? (
                            <svg
                              fill="#00A8D0"
                              className="w-4 hover:fill-secondary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                            >
                              <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" />
                            </svg>
                          ) : (
                            <svg
                              fill="#00A8D0"
                              className="w-4 hover:fill-secondary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {/* Confirm New Password */}
                      <div className="flex flex-col relative">
                        <TextInput
                          name="confirmNewPassword"
                          type={showConfirmNewPassword ? "text" : "password"}
                          placeholder="Konfirmasi Password"
                          label="Konfirmasi Password"
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmNewPassword(!showConfirmNewPassword)
                          }
                          className="absolute right-2 top-2/3 transform -translate-y-1/2" // Position the button inside the input
                        >
                          {showConfirmNewPassword ? (
                            <svg
                              fill="#00A8D0"
                              className="w-4 hover:fill-secondary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                            >
                              <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" />
                            </svg>
                          ) : (
                            <svg
                              fill="#00A8D0"
                              className="w-4 hover:fill-secondary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm md:text-base font-medium text-white bg-primary hover:bg-darkprimary focus:outline-none"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Akun Menu Mobile */}
            <div className="block md:hidden w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden self-start">
              <div
                onClick={() => {
                  handleMenuItemClick("ubahProfil");
                  handleEditProfileToggle();
                }}
                className={`px-4 py-4 flex gap-3 items-center cursor-pointer ${
                  activeMenuItem === "ubahProfil" ? "bg-primary/15" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 fill-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
                <span className="text-primary text-sm font-medium">
                  Ubah Profil
                </span>
              </div>
              <div
                onClick={() => {
                  handlePasswordChangeToggle();
                  handleMenuItemClick("gantiPassword");
                }}
                className={`px-4 py-4 flex gap-3 items-center cursor-pointer ${
                  activeMenuItem === "gantiPassword" ? "bg-primary/15" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 fill-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                </svg>
                <span className="text-main font-medium text-sm">
                  Ganti Password
                </span>
              </div>
              <div
                onClick={() => {
                  handleConfirmModalToggle();
                  handleMenuItemClick("hapusAkun");
                }}
                className={`px-4 py-4 flex gap-3 items-center cursor-pointer ${
                  activeMenuItem === "hapusAkun" ? "bg-primary/15" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 fill-danger"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM471 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
                <span className="text-danger font-medium text-sm">
                  Hapus Akun
                </span>
              </div>
              <div
                onClick={() => {
                  handleConfirmLogoutModalToggle();
                  handleMenuItemClick("keluar");
                }}
                className={`px-4 py-4 flex gap-3 items-center cursor-pointer ${
                  activeMenuItem === "keluar" ? "bg-primary/15" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 fill-danger"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                </svg>
                <span className="text-danger font-medium text-sm">Keluar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Delete Account Modal */}
        <div
          id="confirm-modal"
          className={`${
            confirmModalOpen ? "" : "hidden"
          } fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50`}
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-neutral rounded-t">
                  <h3 className="text-xl font-semibold text-textcolor">
                    Hapus Akun
                  </h3>
                  <button
                    type="button"
                    onClick={handleConfirmModalToggle}
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-textcolor rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
              </div>
              <div className="px-4 md:px-5 pb-4 md:pb-6 pt-2 md:pt-3">
                <p className="mb-4 text-sm text-main font-medium">
                  Apa kamu yakin mau{" "}
                  <span className="text-danger font-semibold">
                    menghapus akun
                  </span>
                  ?
                </p>
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmModalToggle}
                      type="button"
                      className="w-24 text-main px-6 py-2 bg-neutral/30 hover:bg-neutral/70 mr-2 text-sm font-medium rounded-full text-center"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        dispatch(deleteAccount(navigate, setLoading));
                        handleConfirmModalToggle();
                      }}
                      type="submit"
                      className="w-24 text-white bg-red-500 hover:bg-red-800 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                    >
                      Ya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Logout Modal */}
        <div
          id="confirm-modal"
          className={`${
            confirmLogoutModalOpen ? "" : "hidden"
          } fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50`}
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-neutral rounded-t">
                  <h3 className="text-xl font-semibold text-textcolor">
                    Keluar
                  </h3>
                  <button
                    type="button"
                    onClick={handleConfirmLogoutModalToggle}
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-textcolor rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
              </div>
              <div className="px-4 md:px-5 pb-4 md:pb-6 pt-2 md:pt-3">
                <p className="mb-4 text-sm text-main font-medium">
                  Apa kamu yakin mau{" "}
                  <span className="text-danger font-semibold">keluar</span>?
                </p>
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmLogoutModalToggle}
                      type="button"
                      className="w-24 text-main px-6 py-2 bg-neutral/30 hover:bg-neutral/70 mr-2 text-sm font-medium rounded-full text-center"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        dispatch(logout(navigate));
                        handleConfirmLogoutModalToggle();
                      }}
                      type="submit"
                      className="w-24 text-white bg-red-500 hover:bg-red-800 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                    >
                      Ya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

const TextInput = ({ label, name, value, onChange, disabled, type }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 block w-full px-3 py-2 border border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
        disabled ? "bg-neutral/40" : ""
      }`}
    />
  </div>
);

const SelectInput = ({ label, name, options, value, onChange }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
    >
      {options.map((option, index) => (
        <option key={index} value={option} className="text-sm">
          {option}
        </option>
      ))}
    </select>
  </div>
);

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import {
  RiEditBoxLine,
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";

import {
  sanitizeName,
  // sanitizeUsername,
  sanitizeEmail,
  sanitizeText,
  sanitizePassword,
} from "../utils/sanitizer";

import {
  validateName,
  // validateUsername,
  validateEmail,
  validatePassword,
} from "../utils/validators";

export default function Profile() {
  const { user, setUser, loggedIn } = useAuth();

  const authFetch = useAuthFetch();

  const fullName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : null;

  const navigate = useNavigate();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  // const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleOpenPasswordModal = () => {
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setSuccessMessage("");
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setSuccessMessage("");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    setSuccessMessage("");

    const cleanedPassword = sanitizePassword(newPassword);
    const cleanedConfirmPassword = sanitizePassword(confirmPassword);

    const newErrors = {};

    if (!cleanedPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (!validatePassword(cleanedPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters.";
    }

    if (!cleanedConfirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (cleanedPassword !== cleanedConfirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    alert("Password updated successfully!");
    setSuccessMessage("Password updated successfully!");
    handleClosePasswordModal();
  };

  const handleOpenUpdateModal = () => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    // setUsername(user?.username || "");
    setEmail(user?.email || "");
    setBio(user?.bio || "");
    setErrors({});
    setSuccessMessage("");
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setErrors({});
    setSuccessMessage("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setSuccessMessage("");

    const cleanedData = {
      firstName: sanitizeName(firstName).trim(),
      lastName: sanitizeName(lastName).trim(),
      // username: sanitizeUsername(username),
      email: sanitizeEmail(email),
      bio: sanitizeText(bio).trim(),
    };

    const newErrors = {};

    if (!cleanedData.firstName) {
      newErrors.firstName = "First name is required.";
    } else if (!validateName(cleanedData.firstName)) {
      newErrors.firstName = "Enter a valid first name.";
    }

    if (!cleanedData.lastName) {
      newErrors.lastName = "Last name is required.";
    } else if (!validateName(cleanedData.lastName)) {
      newErrors.lastName = "Enter a valid last name.";
    }

    /* if (!cleanedData.username) {
      newErrors.username = "Username is required.";
    } else if (!validateUsername(cleanedData.username)) {
      newErrors.username =
        "Username must be 3 to 20 characters and use only letters, numbers, or underscores.";
    } */

    if (!cleanedData.email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(cleanedData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (cleanedData.bio.length > 280) {
      newErrors.bio = "Bio must be 280 characters or less.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await authFetch("/api/auth/modify-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: cleanedData.firstName,
          last_name: cleanedData.lastName,
          email: cleanedData.email,
          bio: cleanedData.bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser((prev) => ({
        ...prev,
        ...data.user,
      }));

      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error(error.message);
    } finally {
      setOpenUpdateModal(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/10 via-bg to-accent/20">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 opacity-30 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-400 dark:bg-purple-600 opacity-30 rounded-full blur-3xl" />

      <div className="relative z-10 p-6">
        {loggedIn ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div>
                <h1 className="text-left text-fg">Profile</h1>
                <p className="font-light text-fg/80">
                  Manage your profile and update your personal information here.
                </p>
              </div>

              <button
                className="flex items-center justify-center rounded-full px-3 py-2 bg-primary text-white text-sm transition duration-200 ease-in-out border border-transparent hover:bg-primary dark:bg-accent dark:hover:bg-card dark:hover:border-accent dark:hover:text-fg dark:hover:border-white"
                onClick={handleOpenPasswordModal}
              >
                Update Password
              </button>
            </div>

            <section className="grid md:grid-cols-2 lg:grid-cols-[5fr_7fr] gap-6">
              <div className="bg-card p-4 rounded-2xl border-2 border-border md:row-span-3">
                <div className="flex flex-col items-left sm:flex-row sm:items-center justify-between mb-5 border-b-2 border-border pb-3 gap-2">
                  <h2 className="font-bold text-2xl uppercase">
                    Personal Information
                  </h2>

                  <button
                    className="flex items-center justify-center rounded-full px-3 py-2 bg-primary text-white text-sm transition duration-200 ease-in-out border border-transparent hover:bg-primary dark:bg-accent dark:hover:bg-card dark:hover:border-accent dark:hover:text-fg dark:hover:border-white"
                    onClick={handleOpenUpdateModal}
                  >
                    <RiEditBoxLine size={20} />
                    <span className="ml-1">Edit</span>
                  </button>
                </div>

                <p className="text-fg">Full Name: {fullName || "N/A"}</p>
                {/* <p className="text-fg">
                  Username: {user?.username || username || "N/A"}
                </p> */}
                <p className="text-fg">Email: {user?.email || "N/A"}</p>
                <p className="text-fg">Bio: {user?.bio || "N/A"}</p>

                {successMessage && (
                  <p className="text-sm text-green-600 mt-4">
                    {successMessage}
                  </p>
                )}
              </div>

              <div className="bg-card p-4 rounded-2xl border-2 border-border">
                <h2 className="font-bold text-2xl uppercase mb-5">
                  Achievements
                </h2>
                <p className="text-fg">
                  View your achievements and rewards here.
                </p>
              </div>

              <div className="bg-card p-4 rounded-2xl border-2 border-border">
                <h2 className="font-bold text-2xl uppercase mb-5">Progress</h2>
                <p className="text-fg">
                  Track your daily quests and overall progress here.
                </p>
              </div>

              <div className="bg-card p-4 rounded-2xl border-2 border-border">
                <h2 className="font-bold text-2xl uppercase mb-5">Guild</h2>
                <p className="text-fg">
                  Join or create a guild to collaborate with other players.
                </p>
              </div>
            </section>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-red-600 text-left">
              You’re not signed in
            </h1>
            <p className="text-fg/80">
              Sign in to view and manage your profile, track your progress, and
              access your account.
            </p>

            <button
              className="mt-2 px-6 py-2 sm:w-fit bg-accent text-white rounded-full transition duration-200 ease-in-out border border-transparent hover:bg-primary dark:bg-accent dark:hover:bg-card dark:hover:border-accent dark:hover:text-fg dark:hover:border-white"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {openUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-3xl w-full max-w-lg border-2 border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update Profile</h2>

              <button
                onClick={handleCloseUpdateModal}
                className="text-fg/80 hover:text-fg"
                type="button"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleUpdateProfile}
            >
              <div className="flex gap-4">
                <div className="w-full">
                  <label
                    className="block text-sm font-medium text-fg mb-1"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full p-3 rounded-full bg-bg border text-fg outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.firstName ? "border-red-500" : "border-border"
                    }`}
                  />
                  {errors.firstName && (
                    <span className="text-sm text-red-500 px-2">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="w-full">
                  <label
                    className="block text-sm font-medium text-fg mb-1"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full p-3 rounded-full bg-bg border text-fg outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.lastName ? "border-red-500" : "border-border"
                    }`}
                  />
                  {errors.lastName && (
                    <span className="text-sm text-red-500 px-2">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              {/* <div>
                <label
                  className="block text-sm font-medium text-fg mb-1"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                  className={`w-full p-3 rounded-full bg-bg border text-fg outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.username ? "border-red-500" : "border-border"
                  }`}
                />
                {errors.username && (
                  <span className="text-sm text-red-500 px-2">
                    {errors.username}
                  </span>
                )}
              </div> */}

              <div>
                <label
                  className="block text-sm font-medium text-fg mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 rounded-full bg-bg border text-fg outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.email ? "border-red-500" : "border-border"
                  }`}
                />
                {errors.email && (
                  <span className="text-sm text-red-500 px-2">
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-fg mb-1"
                  htmlFor="bio"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell us a little about yourself"
                  className={`w-full p-3 rounded-3xl bg-bg border text-fg outline-none resize-none focus:ring-2 focus:ring-primary/30 ${
                    errors.bio ? "border-red-500" : "border-border"
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.bio ? (
                    <span className="text-sm text-red-500 px-2">
                      {errors.bio}
                    </span>
                  ) : (
                    <span className="text-sm text-fg/60 px-2">
                      Max 280 characters
                    </span>
                  )}
                  <span className="text-sm text-fg/60 px-2">
                    {bio.length}/280
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={handleCloseUpdateModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-primary text-white rounded-full transition duration-200 ease-in-out border border-transparent hover:bg-primary dark:bg-accent dark:hover:bg-card dark:hover:border-accent dark:hover:text-fg dark:hover:border-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
          <div className="bg-card p-6 rounded-3xl w-full max-w-lg border-2 border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update Password</h2>

              <button
                onClick={handleClosePasswordModal}
                className="text-fg/80 hover:text-fg"
                type="button"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleUpdatePassword}
            >
              <div>
                <label
                  className="block text-sm font-medium text-fg mb-1"
                  htmlFor="newPassword"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full p-3 pr-12 rounded-full bg-bg border text-fg outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.newPassword ? "border-red-500" : "border-border"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-fg/70 hover:text-fg"
                  >
                    {showNewPassword ? (
                      <RiEyeOffLine size={20} />
                    ) : (
                      <RiEyeLine size={20} />
                    )}
                  </button>
                </div>

                {errors.newPassword && (
                  <span className="text-sm text-red-500 px-2">
                    {errors.newPassword}
                  </span>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-fg mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full p-3 pr-12 rounded-full bg-bg border text-fg outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-border"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-fg/70 hover:text-fg"
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine size={20} />
                    ) : (
                      <RiEyeLine size={20} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <span className="text-sm text-red-500 px-2">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={handleClosePasswordModal}>
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-primary text-white rounded-full transition duration-200 ease-in-out border border-transparent hover:bg-primary dark:bg-accent dark:hover:bg-card dark:hover:border-accent dark:hover:text-fg dark:hover:border-white"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

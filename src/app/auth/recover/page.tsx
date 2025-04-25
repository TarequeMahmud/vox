"use client";
import AuthLinks from "@/components/AuthLinks";
import axios from "axios";
import { useState } from "react";
import useLoader from "@/hooks/useLoader";
import Spinner from "@/components/Spinner";

export default function Recover() {
  const [email, setEmail] = useState<FormDataEntryValue>("");
  const [status, setStatus] = useState<
    "SEARCH_EMAIL" | "VERIFY_OTP" | "CHANGE_PWD" | ""
  >("SEARCH_EMAIL");
  const { loading, showLoader, hideLoader } = useLoader();
  const handleSearchEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showLoader();
    // Extract form data
    const formData = new FormData(event.currentTarget);
    const { email } = Object.fromEntries(formData.entries());

    if (!email) {
      alert("Please fill in all fields and agree to the terms and conditions.");
      return;
    }
    try {
      const response = await axios.post("/api/auth/recover/find-email", {
        email,
      });

      if (response.status === 200) {
        setStatus("VERIFY_OTP");
        setEmail(email);
        hideLoader();
      }
    } catch (error) {
      console.error("Registration failed:", error);
      hideLoader();
    }
  };

  const handleVerification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    showLoader();
    const formData = new FormData(event.currentTarget);
    const { verificationCode } = Object.fromEntries(formData.entries());

    if (!verificationCode) {
      alert("Please enter the verification code.");
      hideLoader();
      return;
    }
    try {
      const response = await axios.post("/api/auth/recover/verify-otp", {
        verificationCode,
        email: email,
      });

      // Handle successful registration
      if (response.status === 200) {
        setStatus("CHANGE_PWD");
        hideLoader();
      }
    } catch (error) {
      // Handle errors
      console.error("Verification failed:", error);
      hideLoader();
    }
  };

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    showLoader();
    const formData = new FormData(event.currentTarget);
    const { newPassword } = Object.fromEntries(formData.entries());

    if (!newPassword) {
      alert("Please enter the new password.");
      hideLoader();
      return;
    }
    try {
      const response = await axios.post("/api/auth/recover/change-password", {
        newPassword,
        email: email,
      });

      // Handle successful registration
      if (response.status === 200) {
        setStatus("");
        hideLoader();
        window.location.href = "/auth/login";
      }
    } catch (error) {
      // Handle errors
      console.error("Password changing failed:", error);
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-[60%] h-auto min-h-full px-10">
      <div className="flex flex-col justify-center items-center w-[600px] h-auto px-10 bg-[#ffffffe1] rounded-xl border-2 border-gray-300 shadow-lg pb-4 my-10">
        <h1 className="text-3xl font-bold my-4">
          {status === "SEARCH_EMAIL" && "Enter your email"}
          {status === "VERIFY_OTP" && "Verify your email"}
          {status === "CHANGE_PWD" && "Change your password"}
        </h1>
        <form
          className="flex flex-col justify-center gap-4 items-center w-full h-full "
          onSubmit={
            status === "SEARCH_EMAIL"
              ? handleSearchEmail
              : status === "VERIFY_OTP"
              ? handleVerification
              : handleChangePassword
          }
        >
          {status === "SEARCH_EMAIL" && (
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            />
          )}
          {status === "VERIFY_OTP" && (
            <input
              type="number"
              placeholder="Enter Verification Code"
              name="verificationCode"
              required
              className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            />
          )}
          {status === "CHANGE_PWD" && (
            <input
              type="password"
              placeholder="Type your new password"
              name="newPassword"
              required
              minLength={6}
              maxLength={20}
              autoComplete="on"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            />
          )}
          {!status && (
            <p className="text-lg text-center text-[#4e4e4e]">
              Password changed successfully. Please login.
            </p>
          )}

          {status && (
            <button
              type="submit"
              className="w-full h-[50px] bg-[#0000ff] text-white rounded-md m-4 cursor-pointer hover:bg-[#0000ffb3] transition duration-300 ease-in-out"
            >
              {loading ? <Spinner /> : "Submit"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

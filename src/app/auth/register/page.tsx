"use client";
import AuthLinks from "@/components/AuthLinks";
import axios from "axios";
import { useState } from "react";
import useLoader from "@/hooks/useLoader";
import Spinner from "@/components/Spinner";

export default function Register() {
  const [registered, setRegistered] = useState<FormDataEntryValue>("");
  const { loading, showLoader, hideLoader } = useLoader();
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showLoader();
    // Extract form data
    const formData = new FormData(event.currentTarget);
    const { name, username, email, password, phone, terms } =
      Object.fromEntries(formData.entries());

    // Validate form inputs
    if (!name || !username || !email || !password || !phone || !terms) {
      alert("Please fill in all fields and agree to the terms and conditions.");
      return;
    }

    try {
      // Send registration data to the server
      const response = await axios.post("/api/auth/register", {
        name,
        username,
        email,
        password,
        phone,
      });

      // Handle successful registration
      if (response.status === 201) {
        setRegistered(email);
      }
    } catch (error) {
      // Handle errors
      console.error("Registration failed:", error);
      hideLoader();
    }
  };
  const handleVerification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { verificationCode } = Object.fromEntries(formData.entries());
    // Validate form inputs
    if (!verificationCode) {
      alert("Please enter the verification code.");
      hideLoader();
      return;
    }
    try {
      const response = await axios.post("/api/auth/verify", {
        verificationCode,
        email: registered,
      });

      // Handle successful registration
      if (response.status === 200) {
        setRegistered("");
        window.location.href = "/auth/login";
      }
    } catch (error) {
      // Handle errors
      console.error("Verification failed:", error);
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-[60%] h-auto min-h-full px-10">
      <div className="flex flex-col justify-center items-center w-[600px] h-auto px-10 bg-[#ffffffe1] rounded-xl border-2 border-gray-300 shadow-lg pb-4 my-10">
        <h1 className="text-3xl font-bold my-4">
          {registered ? "Verify Account" : "Register"}
        </h1>
        <form
          className="flex flex-col justify-center gap-4 items-center w-full h-full "
          onSubmit={registered ? handleVerification : handleRegister}
        >
          {!registered && (
            <>
              {" "}
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                required
                className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
              />
              <input
                type="text"
                placeholder="Username"
                name="username"
                required
                className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                required
                minLength={6}
                maxLength={20}
                autoComplete="on"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                name="phone"
                required
                pattern="[0-9]{11}"
                className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
              />
              <div className="flex items-center w-full m-2">
                <input type="checkbox" name="terms" required className="mr-2" />
                <label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </label>
              </div>
            </>
          )}
          {registered && (
            <input
              type="number"
              placeholder="Enter Verification Code"
              name="verificationCode"
              required
              className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            />
          )}

          <button
            type="submit"
            className="w-full h-[50px] bg-[#0000ff] text-white rounded-md m-4 cursor-pointer hover:bg-[#0000ffb3] transition duration-300 ease-in-out"
          >
            {loading ? <Spinner /> : registered ? "Verify" : "Register"}
          </button>
        </form>
        <AuthLinks mode="register" />
      </div>
    </div>
  );
}

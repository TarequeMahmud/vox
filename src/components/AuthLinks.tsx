"use client";
import React from "react";

const AuthLinks: React.FC<AuthLinksProps> = ({ mode }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[100px] px-10 bg-[#ffffffe1] rounded-xl border-2 border-gray-300 shadow-lg mt-4">
      {mode === "login" ? (
        <p className="text-lg text-center text-[#4e4e4e]">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-500">
            Register
          </a>
        </p>
      ) : (
        <p className="text-lg text-center text-[#4e4e4e]">
          Have an account?{" "}
          <a href="/auth/login" className="text-blue-500">
            Login instead
          </a>
        </p>
      )}
      <p className="text-lg text-center text-[#4e4e4e]">
        Forgot your password?{" "}
        <a href="/auth/recover" className="text-blue-500">
          Reset Password
        </a>
      </p>
    </div>
  );
};

export default AuthLinks;

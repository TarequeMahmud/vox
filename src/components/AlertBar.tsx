import { useAlert } from "@/contexts/AlertContext";
import { useEffect } from "react";
import { setupAxiosInterceptors } from "@/lib/axios";

export const AlertBar = () => {
  const { message, type, showAlert } = useAlert();

  useEffect(() => {
    setupAxiosInterceptors(showAlert);
  }, [showAlert]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md z-50 text-white text-xl
        ${type === "error" ? "bg-red-600" : "bg-green-600"}`}
    >
      {message}
    </div>
  );
};

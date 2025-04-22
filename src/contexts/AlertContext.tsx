"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AlertType>("");

  const showAlert = (msg: string, type: "error" | "success" = "error") => {
    setMessage(msg);
    setType(type);
    setTimeout(() => {
      clearAlert();
    }, 4000);
  };

  const clearAlert = () => {
    setMessage("");
    setType("");
  };

  return (
    <AlertContext.Provider value={{ message, type, showAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context)
    throw new Error("useAlert must be used within an AlertProvider");
  return context;
};

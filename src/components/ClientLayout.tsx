"use client";

import { ReactNode } from "react";
import { AlertProvider } from "@/contexts/AlertContext";
import { AlertBar } from "@/components/AlertBar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AlertProvider>
      <AlertBar />
      {children}
    </AlertProvider>
  );
}

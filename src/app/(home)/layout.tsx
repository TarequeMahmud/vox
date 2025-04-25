import type { Metadata } from "next";
import "../globals.css";

import { IBM_Plex_Sans } from "next/font/google";

import { ChatProvider } from "@/contexts/ChatContext";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Home from "./page";
import HomeClientLayout from "@/components/HomeClientLayout";

export const metadata: Metadata = {
  title: "Vox- Home page",
  description: "Vox home page",
};

const ibm = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if the user is authenticated
  const token = await verifyToken();
  console.log(token);

  if (!token) {
    redirect("/auth/login");
  }
  return (
    <html lang="en">
      <ChatProvider>
        <body className={ibm.className}>
          <HomeClientLayout>{children}</HomeClientLayout>
        </body>
      </ChatProvider>
    </html>
  );
}

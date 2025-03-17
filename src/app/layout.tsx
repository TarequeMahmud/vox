import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vox- Home page",
  description: "Vox home page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

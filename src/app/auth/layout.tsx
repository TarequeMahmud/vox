import Image from "next/image";
import "../globals.css";
import type { Metadata } from "next";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Vox- Authenticate",
  description: "Vox authentication page",
};

export default async function Auth({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await verifyToken();
  if (token) {
    redirect("/");
  }
  return (
    <html lang="en">
      <body>
        <div className="flex flex-row  h-full w-full m-0 p-0 bg-[#8becff]">
          <div className="flex flex-col justify-center items-center w-[50%] h-full px-10 gap-10">
            <Image src="/logo.png" alt="Vox logo" width={100} height={100} />
            <h1 className="text-4xl font-bold text-center text-gray-800">
              Welcome to Vox
            </h1>
            <p className="text-lg text-center text-[#4e4e4e]">
              To explore immense power of Vox, please login.
            </p>
          </div>

          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}

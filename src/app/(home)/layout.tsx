import type { Metadata } from "next";
import "../globals.css";
import { MdSearch } from "react-icons/md";
import { PiSidebarFill } from "react-icons/pi";
import NewChatButton from "@/components/NewChatButton";
import TextPad from "@/components/TextPad";
import Logo from "@/components/Logo";
import { ChatProvider } from "@/contexts/ChatContext";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vox- Home page",
  description: "Vox home page",
};

const authenticated = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!authenticated) redirect("/auth/login");
  return (
    <html lang="en">
      <ChatProvider>
        <body>
          <div className="flex flex-row  h-full w-full m-0 p-0">
            <div className="flex flex-col justify-start items-center  bg-[#8becff] h-full w-[350px] m-0 p-2">
              <div className="flex flex-row justify-between h-10 w-full pt-2">
                <Logo />

                <div className="flex flex-row items-center h-7 w-14 mr-2">
                  <MdSearch
                    style={{ width: "25px", height: "25px", fill: "#0000ff" }}
                  />
                  <PiSidebarFill
                    style={{ width: "25px", height: "25px" }}
                    className="text-[#950084] ml-2"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between w-[95%]   mt-10">
                <NewChatButton />
              </div>
            </div>
            <div className="flex flex-col justify-between items-center h-full w-full">
              <div className="h-[50px] w-full border-b-2 border-[#e8e8e8]">
                <button>click</button>
              </div>

              {children}
              <TextPad />
            </div>
          </div>
        </body>
      </ChatProvider>
    </html>
  );
}

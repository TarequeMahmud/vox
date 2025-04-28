"use client";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { PiSidebarFill } from "react-icons/pi";
import NewChatButton from "@/components/NewChatButton";
import TextPad from "@/components/TextPad";
import Logo from "@/components/Logo";
import ChatlistContainer from "./ChatlistContainer";
interface HomeClientLayoutProps {
  children: React.ReactNode;
}

const HomeClientLayout: React.FC<HomeClientLayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div className="flex flex-row justify-center h-full w-full  m-0 p-0">
      {showSidebar && (
        <div className="flex flex-col justify-start items-center  bg-[#8becff] h-full w-[20%] m-0 p-2  border-r-2 border-[#b3b3b3]">
          <div className="flex flex-row justify-between h-10 w-full pt-2">
            <Logo />

            <div className="flex flex-row items-center h-7 w-14 mr-2">
              <MdSearch
                style={{ width: "25px", height: "25px", fill: "#0000ff" }}
                className="cursor-pointer"
              />
              <PiSidebarFill
                style={{ width: "25px", height: "25px" }}
                className="text-[#950084] ml-2 cursor-pointer"
                onClick={() => setShowSidebar(!showSidebar)}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between w-[95%] overflow-y-hidden mt-10">
            <NewChatButton />

            <ChatlistContainer />
          </div>
        </div>
      )}
      <div
        className={`flex flex-col justify-between items-center h-full ${
          showSidebar ? "w-[80%]" : "w-full"
        }`}
      >
        <div className="h-[50px] w-full border-b-2 border-[#e8e8e8]">
          {!showSidebar && (
            <PiSidebarFill
              style={{ width: "25px", height: "25px" }}
              className="text-[#950084] ml-2 cursor-pointer mt-4"
              onClick={() => setShowSidebar(!showSidebar)}
            />
          )}
        </div>

        {children}
        <TextPad />
      </div>
    </div>
  );
};

export default HomeClientLayout;

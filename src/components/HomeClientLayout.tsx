"use client";
import { useEffect, useRef, useState } from "react";
import { MdSearch } from "react-icons/md";
import { PiSidebarFill } from "react-icons/pi";
import NewChatButton from "@/components/NewChatButton";
import TextPad from "@/components/TextPad";
import Logo from "@/components/Logo";
import ChatlistContainer from "./ChatlistContainer";
import { AlertProvider } from "@/contexts/AlertContext";
import { AlertBar } from "@/components/AlertBar";
import Search from "./Search";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { clearMessages } from "@/lib/features/chat/chatSlice";
import Image from "next/image";
import useClickOutside from "@/hooks/useClickOutside";
interface HomeClientLayoutProps {
  children: React.ReactNode;
}

const HomeClientLayout: React.FC<HomeClientLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showSearchbar, setShowSearchbar] = useState(false);
  const [temporary, setTemporary] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [lastChat, setLastChat] = useState<SingleChat | undefined>(undefined);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
    if (window.innerWidth > 768) {
      setShowSidebar(true);
    }
  }, []);

  useClickOutside(modalRef, () => {
    if (window.innerWidth < 768) {
      console.log("clicked outside");

      setShowSidebar(false);
    }
  });

  if (!hasMounted) return null;
  return (
    <AlertProvider>
      <AlertBar />
      <div className="flex flex-row justify-start h-full w-full m-0 p-0">
        {/* sidebar */}
        <div
          className={`
    bg-[#8becff] border-r-2 border-[#929292] transition-all duration-300 ease-in-out 
    ${showSidebar ? "w-[50%] md:w-[20%]" : "w-0 overflow-hidden"} 
    h-full flex flex-col justify-start items-center 
    fixed md:static top-0 left-0 z-50 shadow-black shadow-lg md:shadow-none `}
          ref={modalRef}
        >
          <div
            className={`flex flex-row justify-between items-center h-10 w-[95%] pt-2 transition-all duration-400 ease-in-out ${
              showSidebar ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            <Logo />

            <div className="flex flex-row items-center h-7 w-14 mr-2">
              <MdSearch
                style={{ width: "25px", height: "25px", fill: "#0000ff" }}
                className="cursor-pointer"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setShowSidebar(!showSidebar);
                  }
                  setShowSearchbar(!showSearchbar);
                }}
              />
              <PiSidebarFill
                style={{ width: "25px", height: "25px" }}
                className="text-[#950084] ml-2 cursor-pointer"
                onClick={() => setShowSidebar(!showSidebar)}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between w-[95%] overflow-y-hidden mt-10 ">
            <NewChatButton />

            <ChatlistContainer
              lastChat={lastChat}
              setShowSidebar={setShowSidebar}
              showSidebar={showSidebar}
            />
          </div>
        </div>

        {/* fixed div */}
        <div
          className={`flex flex-col justify-between items-center h-full transition-all duration-300 ease-in-out w-full ${
            showSidebar && "md:w-[80%]"
          }`}
        >
          <div className="flex flex-row justify-between items-center h-[50px] w-full border-b-2 border-[#e8e8e8]">
            <div className="flex flex-row items-center ml-2">
              <PiSidebarFill
                style={{ width: "25px", height: "25px" }}
                className={`text-[#950084] mr-3 cursor-pointer transition-all duration-300 ease-in-out
    ${showSidebar ? "opacity-0 scale-0" : "opacity-100 scale-100"}
  `}
                onClick={() => setShowSidebar(!showSidebar)}
              />
              <p className="md:text-xl text-xs font-semibold">
                Vox AI -- By Tareque Mahmud
              </p>
            </div>
            <div className="flex flex-row justify-between items-center h-[80%] md:w-[15%] mr-6">
              <button
                className={`md:h-8 h-6 md:w-30 w-18  rounded-2xl border-1 border-amber-800 text-center cursor-pointer md:text-lg text-xs select-none ${
                  temporary ? "bg-amber-800 text-white" : "bg-white text-black"
                }`}
                onClick={() => {
                  if (!temporary) {
                    router.push(`/chat/${"temporary"}?new=true`);
                  } else {
                    router.push(`/`);
                  }
                  dispatch(clearMessages());
                  setTemporary(!temporary);
                }}
              >
                Temporary
              </button>

              <div className="relative">
                <Image
                  src="/user.png"
                  alt="user icon"
                  height={30}
                  width={30}
                  className="my-0 ml-3 cursor-pointer"
                  onClick={() => {
                    setShowLogout(!showLogout);
                  }}
                />
                {showLogout && (
                  <div className="fixed md:top-15 top-10 right-8 md:w-40 w-20 bg-white border-1 rounded-md hover:bg-amber-800 hover:text-white ">
                    <p
                      className="md:text-xl text-center"
                      onClick={async () => {
                        setShowLogout(!showLogout);
                        await fetch("/api/auth/logout");
                        window.location.reload();
                      }}
                    >
                      Logout
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {showSearchbar && (
            <Search
              setShowSearchbar={setShowSearchbar}
              showSearchbar={showSearchbar}
            />
          )}

          {children}
          <TextPad setLastChat={setLastChat} />
        </div>
      </div>
    </AlertProvider>
  );
};

export default HomeClientLayout;

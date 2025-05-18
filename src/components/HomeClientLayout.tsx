"use client";
import { useEffect, useState } from "react";
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
  const [lastChat, setLastChat] = useState<SingleChat | undefined>(undefined);

  useEffect(() => {
    setHasMounted(true);
    if (window.innerWidth > 768) {
      setShowSidebar(true);
    }
  }, []);

  if (!hasMounted) return null;
  return (
    <AlertProvider>
      <AlertBar />
      <div className="flex flex-row justify-start h-full w-full m-0 p-0">
        <div
          className={`
    bg-[#8becff] border-r-2 border-[#929292] transition-all duration-300 ease-in-out 
    ${showSidebar ? "w-[50%] md:w-[20%]" : "w-0 overflow-hidden"} 
    h-full flex flex-col justify-start items-center 
    fixed md:static top-0 left-0 z-50 shadow-black shadow-lg md:shadow-none `}
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
                  if (window.innerWidth < 768) setShowSidebar(!showSidebar);
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

        <div
          className={`flex flex-col justify-between items-center h-full transition-all duration-300 ease-in-out w-full ${
            showSidebar && "md:w-[80%]"
          }`}
        >
          <div className="flex flex-row justify-between items-center h-[50px] w-full border-b-2 border-[#e8e8e8]">
            <div className="flex flex-row ml-2">
              <PiSidebarFill
                style={{ width: "25px", height: "25px" }}
                className={`text-[#950084] mr-3 cursor-pointer transition-all duration-300 ease-in-out
    ${showSidebar ? "opacity-0 scale-0" : "opacity-100 scale-100"}
  `}
                onClick={() => setShowSidebar(!showSidebar)}
              />
              <p className="text-xl font-semibold">
                Vox AI -- Developed By Tareque Mahmud
              </p>
            </div>
            <div className="flex flex-row justify-between items-center h-10 w-40">
              <p
                className={`h-8 w-30  rounded-2xl border-1 border-amber-800 text-center cursor-pointer  text-lg select-none ${
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
              </p>
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

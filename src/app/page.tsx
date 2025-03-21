import Image from "next/image";
import { MdSearch } from "react-icons/md";
import { PiSidebarFill } from "react-icons/pi";

export default function Home() {
  return (
    <div className="flex flex-row  h-full w-full m-0 p-0">
      <div className="flex flex-col justify-start items-center  bg-[#8becff] h-full w-[350px] m-0 p-2">
        <div className="flex flex-row justify-between h-10 w-full pt-2">
          <div className="flex flex-row justify-center items-center h-7 w-20 bg-[#000000c8] rounded-3xl m-0">
            <Image
              src="/logo.png"
              alt="vox logo"
              height={20}
              width={20}
              className="mr-1"
              quality={100}
              unoptimized
            />
            <h1 className="text-lg text-[#ffffff] font-semibold">Vox</h1>
          </div>

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
          <div className="flex flex-row justify-start items-center gap-3 h-8 bg-[#FFFFFF] rounded-md p-1 pl-3">
            <Image
              src="/new-chat.png"
              alt="vox logo"
              height={25}
              width={25}
              className="my-0"
              unoptimized
            />
            <p>New chat</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center h-full w-full">
        <div className="h-[50px] w-full border-b-2 border-[#e8e8e8]">
          <button>click</button>
        </div>
        <div className="flex flex-col justify-end pb-4 items-end w-[80%] h-[70%]">
          <p>hisdgfgfdfsgfdsggfdh</p>
        </div>
        <div className="w-[80%] h-[130px] max-w-[800px] mb-4 ">
          <textarea
            className="bg-white border-3 border-[#cacaca] w-full h-full rounded-3xl  resize-none p-2"
            placeholder="Ask me anything"
          ></textarea>
        </div>
      </div>
    </div>
  );
}

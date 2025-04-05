"use client";
import Image from "next/image";

const fetchData = async () => {};

export default function NewChatButton() {
  return (
    <div
      className="flex flex-row justify-start items-center gap-3 h-8 bg-[#FFFFFF] rounded-md p-1 pl-3 cursor-pointer"
      onClick={fetchData}
    >
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
  );
}

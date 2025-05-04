"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { clearMessages } from "@/lib/features/chat/chatSlice";

export default function NewChatButton() {
  const dispatch = useAppDispatch();
  return (
    <div
      className="flex flex-row justify-start items-center gap-3 h-8 bg-[#FFFFFF] rounded-md p-1 pl-3 cursor-pointer"
      onClick={() => {
        dispatch(clearMessages());
        redirect("/");
      }}
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

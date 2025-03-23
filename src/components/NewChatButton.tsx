"use client";
import Image from "next/image";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAARF5-H4o41TalLRZ-PFIpodXsP3A3CeI");
const prompt = "Explain how AI works";
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const fetchData = async () => {
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
};

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

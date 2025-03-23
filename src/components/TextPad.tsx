"use client";
import Image from "next/image";
const TextPad = () => {
  return (
    <div className="relative w-[80%] h-[130px] max-w-[800px] mb-4">
      <textarea
        className="bg-white border-3 border-[#cacaca] w-full h-full rounded-3xl resize-none p-4 pr-12"
        placeholder="Ask me anything..."
      ></textarea>

      <button className="absolute bottom-3 right-3 bg-transparent p-2 cursor-pointer">
        <Image
          src="/send.png"
          alt="send to vox"
          height={24}
          width={24}
          className="mr-1"
          unoptimized
        />
      </button>
    </div>
  );
};

export default TextPad;

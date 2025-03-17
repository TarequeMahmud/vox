import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-row  h-full w-full m-0 p-0">
      <div className="bg-[#BBF4FF] h-full w-[300px] m-0 p-2"></div>
      <div className="flex flex-col justify-between items-center h-full w-full">
        <div className="h-[50px] w-full border-b-2 border-[#e8e8e8]">
          <button>click</button>
        </div>
        <div className="flex flex-col justify-around items-center w-full h-[70%]">
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
          <p>hi</p>
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

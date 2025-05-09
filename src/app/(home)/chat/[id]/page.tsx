import ChatShower from "@/components/ChatShower";

export default function Chat() {
  return (
    <div className="flex flex-col-reverse justify-start items-center w-full h-[70%]  overflow-y-auto px-4 md:px-10">
      <ChatShower />
    </div>
  );
}

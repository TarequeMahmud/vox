import useLoader from "@/hooks/useLoader";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

const ChatlistContainer: React.FC = () => {
  const [chatList, setChatList] = useState<GroupedChats[] | null>(null);
  const { loading, showLoader, hideLoader } = useLoader();
  useEffect(() => {
    showLoader();
    const chatListFetch = async () => {
      const response = await fetch("/api/chats");
      if (!response.ok) {
        hideLoader();
        throw new Error("Failed to fetch chat list");
      }
      const data = await response.json();
      setChatList(data);
      hideLoader();
    };

    chatListFetch();
  }, []);
  return (
    <div className="flex flex-col justify-start items-center w-full h-[95%] my-3 overflow-scroll no-scrollbar">
      {!loading &&
        chatList &&
        chatList.length > 0 &&
        chatList.map((group) => (
          <div
            key={group.date_group}
            className="flex flex-col justify-start items-center w-full rounded-[10px] h-auto bg-[#fff] m-2 pb-2"
          >
            <h2 className="text-lg font-bold">{group.date_group}</h2>
            <hr className="w-[95%]" />
            {group.chats.map((chat) => (
              <p
                key={chat.id}
                className="text-left my-1 px-1 rounded-[5px] w-[95%] bg-[#F4F4F4] h-7 overflow-hidden hover:bg-[#BABABA] cursor-pointer"
              >
                {chat.title}
              </p>
            ))}
          </div>
        ))}
      {loading && (
        <div className="m-10">
          <Spinner color="#000" />
        </div>
      )}
    </div>
  );
};

export default ChatlistContainer;

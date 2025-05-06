import useLoader from "@/hooks/useLoader";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { clearMessages } from "@/lib/features/chat/chatSlice";

const ChatlistContainer = ({ lastChat }: Pick<LastChatProps, "lastChat">) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [chatList, setChatList] = useState<GroupedChats[] | []>([]);
  const { loading, showLoader, hideLoader } = useLoader();
  useEffect(() => {
    showLoader();
    const chatListFetch = async () => {
      const response = await fetch("/api/chats");
      if (!response.ok) {
        hideLoader();
        return;
      }
      const data = await response.json();
      setChatList(data);
      hideLoader();
    };

    chatListFetch();
  }, []);

  useEffect(() => {
    const updateChatList = () => {
      if (!lastChat || !chatList) return;
      const todayGroup = chatList.find(
        (group) => group.date_group === lastChat.date_group
      );

      if (todayGroup) {
        todayGroup.chats = [
          {
            id: lastChat.chat.id,
            title: lastChat.chat.title,
            created_at: lastChat.chat.created_at,
          },
          ...todayGroup.chats,
        ];
        setChatList([...chatList]);
      } else {
        const newGroup = {
          date_group: lastChat.date_group,
          chats: [
            {
              id: lastChat.chat.id,
              title: lastChat.chat.title,
              created_at: lastChat.chat.created_at,
            },
          ],
        };
        setChatList([newGroup, ...chatList]);
      }
    };
    updateChatList();
  }, [lastChat]);
  return (
    <div className="flex flex-col justify-start items-center w-full h-[95%] my-3 overflow-y-scroll no-scrollbar">
      {!loading &&
        chatList.length > 0 &&
        chatList.map((group) => (
          <div
            key={group.date_group}
            className="flex flex-col justify-start items-center w-full rounded-[10px] h-auto bg-[#fff] m-2 pb-2"
          >
            <h2 className="text-lg font-bold">{group.date_group}</h2>
            <hr className="w-[95%] mb-2" />
            {group.chats.map((chat) => (
              <p
                key={chat.id}
                onClick={() => {
                  dispatch(clearMessages());
                  router.replace(`/chat/${chat.id}`);
                }}
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

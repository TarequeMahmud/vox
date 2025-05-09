"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHooks";
import {
  selectAllMessages,
  addMessageArray,
} from "@/lib/features/chat/chatSlice";
import clsx from "clsx";
import MarkdownResponse from "./MarkdownResponse";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

import axios from "axios";
const ChatShower = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const searchParams = useSearchParams();

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      const isNew = searchParams.get("new");

      if (isNew !== "true") {
        try {
          const chatId = params.id;
          const response = await axios.get(`/api/chats/${chatId}/messages`);
          dispatch(addMessageArray(response.data));
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }

      setHasFetched(true);
    };

    loadMessages();
  }, []);

  const newerMessages = useAppSelector(selectAllMessages);
  const messages = [...newerMessages];
  return (
    <>
      {messages.length > 0 ? (
        messages.reverse().map((message, index) => (
          <div
            key={index}
            className={clsx("flex w-full flex-row ", {
              "justify-end": message.role === "user",
            })}
          >
            <div
              className={clsx(
                "h-auto min-h-10  m-1 md:m-4 rounded-[10px] text-start py-2 px-3 md:px-5 md:text-lg text-md",
                {
                  "bg-[#BBF4FF] w-auto md:max-w-[50%] max-w-[90%]":
                    message.role === "user",
                  "md:w-[80%] md:max-w-[90%] w-[95%] leading-8":
                    message.role === "model",
                }
              )}
            >
              <MarkdownResponse markdown={message.content} />
            </div>
          </div>
        ))
      ) : (
        <div className="text-2xl font-semibold mb-[40vh]">
          {!hasFetched ? <Spinner color="border-gray-950" /> : <p></p>}
        </div>
      )}
    </>
  );
};

export default ChatShower;

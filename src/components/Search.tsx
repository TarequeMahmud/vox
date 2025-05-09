import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { clearMessages } from "@/lib/features/chat/chatSlice";
import useLoader from "@/hooks/useLoader";
import Spinner from "@/components/Spinner";

const Search: React.FC<SearchProps> = ({ setShowSearchbar, showSearchbar }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const { loading, showLoader, hideLoader } = useLoader();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowSearchbar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSearchbar]);

  const handleSearch = async () => {
    showLoader();
    setResults([]);
    try {
      const response = await axios.post("/api/chats/search", {
        searchEntry: query,
      });
      console.log(response);

      if (response.data && Array.isArray(response.data.searchResult)) {
        setResults(response.data.searchResult);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    hideLoader();
  };

  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[600px] md:h-[400px] h-[70%] bg-white shadow-black shadow-sm rounded-lg p-4 flex flex-col z-10 overflow-y-scroll"
      ref={modalRef}
    >
      <div className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search..."
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto border border-gray-300 rounded-md p-2">
        {results.length > 0 &&
          results.map((result, index) => {
            return (
              <div
                className="flex flex-col items-start h-18 w-full py-1 px-2 mt-2 rounded-xl hover:bg-[#ebebeb] "
                key={index}
                onClick={() => {
                  dispatch(clearMessages());
                  router.replace(`/chat/${result.chat_id}`);
                  setShowSearchbar(!showSearchbar);
                }}
              >
                <p className="text-lg font-semibold">{result.chat_title}</p>
                <p className="text-md font-light">
                  ...{parse(result.snippet)}...
                </p>
              </div>
            );
          })}

        {loading && <Spinner color="border-gray-950" />}
      </div>
    </div>
  );
};

export default Search;

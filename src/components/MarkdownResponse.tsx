"use client";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Or any style you like

const MarkdownResponse = ({ markdown }: Props) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownResponse;

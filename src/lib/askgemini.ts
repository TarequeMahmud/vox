export async function askgemini(
  message: string,
  history: MessageHistoryContent[],
  onChunk: (chunk: string) => void
) {
  const res = await fetch("/api/askgemini", {
    method: "POST",
    body: JSON.stringify({ message, history }),
    headers: { "Content-Type": "application/json" },
  });

  const reader = res.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (!reader) return;
  let fullResponse = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const chunk = decoder.decode(value, { stream: true });
    fullResponse += chunk;
    onChunk(chunk);
  }
  return fullResponse;
}

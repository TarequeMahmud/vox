/*
fetch('https://example.com/data')
  .then(response => {
    const reader = response.body.getReader();
    return new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            push();
          });
        }
        push();
      }
    });
  })
  .then(stream => new Response(stream))
  .then(response => response.text())
  .then(text => console.log(text));
*/

export async function askGeminiStream(
  message: string,
  onChunk: (chunk: string) => void
) {
  const res = await fetch("/api/askgemini", {
    method: "POST",
    body: JSON.stringify({ message }),
    headers: { "Content-Type": "application/json" },
  });
  console.log(res);

  const reader = res.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (!reader) return;

  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    onChunk(chunk);
  }

  return fullText;
}

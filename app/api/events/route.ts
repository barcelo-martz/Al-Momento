import { addClient, removeClient } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET() {
  let clientId: string;

  const stream = new ReadableStream({
    start(controller) {
      clientId = addClient(controller);
      controller.enqueue(
        new TextEncoder().encode("event: connected\ndata: ok\n\n"),
      );
    },
    cancel() {
      removeClient(clientId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

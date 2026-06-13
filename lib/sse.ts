type Client = {
  id: string;
  controller: ReadableStreamDefaultController;
};

const clients: Client[] = [];

export function addClient(controller: ReadableStreamDefaultController) {
  const id = crypto.randomUUID();
  clients.push({ id, controller });
  return id;
}

export function removeClient(id: string) {
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) clients.splice(index, 1);
}

// Serializar BigInt como número
function serialize(data: unknown): string {
  return JSON.stringify(data, (_, value) =>
    typeof value === "bigint" ? Number(value) : value,
  );
}

export function broadcast(event: string, data: unknown) {
  const message = `event: ${event}\ndata: ${serialize(data)}\n\n`;
  clients.forEach((client) => {
    try {
      client.controller.enqueue(new TextEncoder().encode(message));
    } catch {
      // cliente desconectado
    }
  });
}

// Estado compartido en memoria mientras el servidor está corriendo
// Se reinicia si reinicias el servidor, pero la DB persiste todo

import { Mesa, Pedido } from "./types";

interface Store {
  mesas: Mesa[];
  pedidosActivos: Pedido[];
}

const globalStore = global as typeof global & { _alyStore?: Store };

if (!globalStore._alyStore) {
  globalStore._alyStore = {
    mesas: [],
    pedidosActivos: [],
  };
}

export const store = globalStore._alyStore;

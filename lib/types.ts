export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface PedidoItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Pedido {
  id: string;
  table: number;
  items: PedidoItem[];
  total: number;
  status: "pendiente" | "listo";
  date: number;
}

export interface Mesa {
  number: number;
  status: "libre" | "pendiente" | "listo";
  orders: PedidoItem[];
  total: number;
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

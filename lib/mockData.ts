import { Mesa, Product } from "./types";

export const mockMenu: Product[] = [
  {
    id: "1",
    name: "Hamburguesa Clásica",
    description:
      "Carne de res, queso cheddar, lechuga, tomate y salsa especial",
    price: 8.99,
    category: "Platos Principales",
    image: "/products/1.jpg",
    available: true,
  },
  {
    id: "2",
    name: "Ensalada César",
    description: "Lechuga romana, crutones, queso parmesano y aderezo César",
    price: 6.49,
    category: "Entradas",
    image: "/products/2.jpg",
    available: true,
  },
  {
    id: "3",
    name: "Pizza Pepperoni",
    description: "Masa delgada, salsa de tomate, queso mozzarella y pepperoni",
    price: 10.99,
    category: "Platos Principales",
    image: "/products/3.jpg",
    available: true,
  },
  {
    id: "4",
    name: "Tiramisú",
    description:
      "Postre italiano con capas de bizcocho, café y crema de mascarpone",
    price: 5.99,
    category: "Postres",
    image: "/products/4.jpg",
    available: true,
  },
  {
    id: "5",
    name: "Limonada Fresca",
    description: "Limonada casera con un toque de menta",
    price: 3.49,
    category: "Bebidas",
    image: "/products/5.jpg",
    available: true,
  },
  {
    id: "6",
    name: "Café Latte",
    description: "Café espresso con leche vaporizada",
    price: 2.99,
    category: "Bebidas",
    image: "/products/6.jpg",
    available: true,
  },
  {
    id: "7",
    name: "Sopa de Tomate",
    description: "Sopa cremosa de tomate con albahaca fresca",
    price: 4.99,
    category: "Entradas",
    image: "/products/7.jpg",
    available: true,
  },
];

export const mockMesas: Mesa[] = [
  {
    number: 1,
    status: "pendiente",
    total: 30,
    orders: [
      {
        id: "1",
        name: "Pizza",
        quantity: 2,
        price: 15,
      },
    ],
  },
  {
    number: 2,
    status: "listo",
    total: 18,
    orders: [
      {
        id: "2",
        name: "Hamburguesa",
        quantity: 1,
        price: 18,
      },
    ],
  },
  {
    number: 3,
    status: "libre",
    total: 0,
    orders: [],
  },
];

export const Categories = [
  "Entradas",
  "Platos Principales",
  "Postres",
  "Bebidas",
];

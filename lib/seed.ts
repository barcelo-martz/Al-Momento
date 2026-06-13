import { prisma } from "./db";

export async function seedDb() {
  const count = await prisma.plato.count();
  if (count > 0) return;

  await prisma.plato.createMany({
    data: [
      {
        name: "Hamburguesa Clásica",
        description:
          "Carne de res, queso cheddar, lechuga, tomate y salsa especial",
        price: 8.99,
        image: "/products/1.jpg",
        category: "Platos Principales",
        available: true,
      },
      {
        name: "Ensalada César",
        description:
          "Lechuga romana, crutones, queso parmesano y aderezo César",
        price: 6.49,
        image: "/products/2.jpg",
        category: "Entradas",
        available: true,
      },
      {
        name: "Pizza Pepperoni",
        description:
          "Masa delgada, salsa de tomate, queso mozzarella y pepperoni",
        price: 10.99,
        image: "/products/3.jpg",
        category: "Platos Principales",
        available: true,
      },
      {
        name: "Tiramisú",
        description:
          "Postre italiano con capas de bizcocho, café y crema de mascarpone",
        price: 5.99,
        image: "/products/4.jpg",
        category: "Postres",
        available: true,
      },
      {
        name: "Limonada Fresca",
        description: "Limonada casera con un toque de menta",
        price: 3.49,
        image: "/products/5.jpg",
        category: "Bebidas",
        available: true,
      },
      {
        name: "Café Latte",
        description: "Café espresso con leche vaporizada",
        price: 2.99,
        image: "/products/6.jpg",
        category: "Bebidas",
        available: true,
      },
      {
        name: "Sopa de Tomate",
        description: "Sopa cremosa de tomate con albahaca fresca",
        price: 4.99,
        image: "/products/7.jpg",
        category: "Entradas",
        available: true,
      },
    ],
  });

  await prisma.config.upsert({
    where: { key: "admin_pin" },
    update: {},
    create: { key: "admin_pin", value: "1234" },
  });

  console.log("✅ Base de datos inicializada");
}

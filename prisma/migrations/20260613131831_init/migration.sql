-- CreateTable
CREATE TABLE "Plato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "image" TEXT,
    "category" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Mesa" (
    "number" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'libre'
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tableNumber" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "date" BIGINT NOT NULL,
    "horaCierre" BIGINT
);

-- CreateTable
CREATE TABLE "PedidoItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedidoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Config" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

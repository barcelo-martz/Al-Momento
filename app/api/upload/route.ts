import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Nombre único para evitar colisiones
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "products");

  // Crear carpeta si no existe
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/products/${filename}` });
}

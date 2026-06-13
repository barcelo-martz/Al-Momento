import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { networkInterfaces } from "node:os";
import path from "path";
import QRCode from "qrcode";

function getLocalIP(): string {
  const nets = networkInterfaces();

  const priority = ["wi-fi", "wifi", "wlan", "wireless"];

  for (const name of Object.keys(nets)) {
    const nameLower = name.toLowerCase();
    if (priority.some((p) => nameLower.includes(p))) {
      for (const net of nets[name]!) {
        if (net.family === "IPv4" && !net.internal) return net.address;
      }
    }
  }

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (
        net.family === "IPv4" &&
        !net.internal &&
        !net.address.startsWith("10.255")
      ) {
        return net.address;
      }
    }
  }

  return "localhost";
}

export async function POST(req: NextRequest) {
  const { cantidad } = await req.json();
  const ip = getLocalIP();
  const qrDir = path.join(process.cwd(), "public", "qr");

  if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

  const generados = [];

  for (let i = 1; i <= cantidad; i++) {
    const url = `http://${ip}:3000/mesa/${i}`;
    const filePath = path.join(qrDir, `mesa-${i}.png`);
    await QRCode.toFile(filePath, url, { width: 300, margin: 2 });
    generados.push({ mesa: i, url, qr: `/qr/mesa-${i}.png` });
  }

  return NextResponse.json({ ip, generados });
}

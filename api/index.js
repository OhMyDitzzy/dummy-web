const express = require("express");
const path = require("path");
const zlib = require("zlib");

const app = express();

app.use((req, res, next) => {
  if (req.headers["content-encoding"] !== "br") return next();

  req._body = true;

  const chunks = [];
  const decoder = zlib.createBrotliDecompress({ chunkSize: 0x330 });

  req.pipe(decoder);
  decoder.on("data", (c) => chunks.push(c));
  decoder.on("end", () => {
    req.body = Buffer.concat(chunks);
    next();
  });
  decoder.on("error", (e) => next(e));
});

app.use(express.json({ limit: "64mb" }));

app.use(express.static(path.join(__dirname, "..", "public")));

const products = [
  { id: 1, name: "Makanan Kucing Tuna", category: "Makanan", price: 65000, emoji: "🐱", desc: "Nutrisi lengkap dengan rasa tuna." },
  { id: 2, name: "Makanan Anjing Premium", category: "Makanan", price: 89000, emoji: "🐶", desc: "Pilihan lezat untuk teman setia." },
  { id: 3, name: "Mainan Bola Kucing", category: "Mainan", price: 18000, emoji: "🧶", desc: "Bikin waktu bermain makin seru." },
  { id: 4, name: "Kalung Anjing", category: "Aksesori", price: 35000, emoji: "🦴", desc: "Nyaman dipakai untuk jalan-jalan." },
  { id: 5, name: "Pasir Kucing 5L", category: "Perawatan", price: 42000, emoji: "🐾", desc: "Membantu menjaga area tetap bersih." },
  { id: 6, name: "Sampo Hewan Lembut", category: "Perawatan", price: 52000, emoji: "🫧", desc: "Perawatan bulu untuk hewan kesayangan." }
];

app.get("/api/health", (_req, res) => res.json({ status: "ok", message: "PawMart API aktif" }));
app.get("/api/products", (_req, res) => res.json(products));
app.post("/api/orders", (req, res) => {
  const { items, customer } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Keranjang masih kosong." });
  }
  return res.status(201).json({
    message: "Pesanan demo berhasil diterima.",
    orderId: "PAW-" + Date.now().toString().slice(-8),
    customer: customer || null
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`PawMart berjalan di http://localhost:${PORT}`));
}
module.exports = app;
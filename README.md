# PawMart — Pet Shop (HTML + Express.js + Vercel)

Template toko hewan berbahasa Indonesia dengan desain responsif, katalog produk, filter kategori, keranjang belanja, dan endpoint API Express.

## Menjalankan di komputer

1. Install Node.js versi LTS.
2. Buka folder proyek di terminal.
3. Jalankan `npm install`.
4. Jalankan `npm start`.
5. Buka `http://localhost:3000`.

## Deploy ke Vercel

1. Upload/push folder proyek ini ke repository GitHub.
2. Di Vercel pilih **Add New → Project**, lalu import repository tersebut.
3. Framework preset dapat dipilih **Other**. Biarkan konfigurasi build mengikuti `vercel.json`.
4. Klik **Deploy**.

Vercel akan menjalankan `api/index.js` sebagai function dan menyajikan file statis dari folder `public`.

## Endpoint API

- `GET /api/health` — status API.
- `GET /api/products` — daftar produk.
- `POST /api/orders` — endpoint pesanan demo. Body contoh:

```json
{
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

## Catatan sebelum dipakai sungguhan

- Produk dan harga masih berupa data contoh di `api/index.js`.
- Endpoint pesanan hanya mengembalikan ID demo; belum menyimpan ke database, mengirim notifikasi, atau memproses pembayaran.
- Ganti email `halo@pawmart.example` pada `public/index.html` dengan kontak toko.
- Tambahkan database, validasi harga/stock di server, autentikasi admin, dan payment gateway sebelum menerima transaksi sungguhan.

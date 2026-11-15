
# NucleoMonitor

NucleoMonitor adalah aplikasi edukasi untuk menampilkan data simulasi fasilitas PLTN, pemantauan lingkungan, dan laporan. Aplikasi terdiri dari frontend React/Vite dan backend REST API.

## Struktur Folder

- `fe/` — frontend React/Vite dan halaman aplikasi.
- `be/` — backend Express API dan data JSON.

## Persyaratan

- Node.js dan npm

## Menjalankan Backend

Buka terminal di folder `be`, lalu jalankan:

```bash
npm install
npm run dev

Backend berjalan di http://localhost:3000.

## Menjalankan Frontend

Buka terminal lain di folder fe, lalu jalankan:

npm install
npm run dev

Buka URL frontend yang muncul di terminal, biasanya http://localhost:5173.

## Endpoint API

- GET /api/health — memeriksa status API.
- GET /api/facilities — mengambil daftar fasilitas.
- GET /api/monitoring — mengambil data pemantauan.
- GET /api/monitoring?type=Udara — memfilter data pemantauan berdasarkan jenis.
- GET /api/reports — mengambil daftar laporan.
- POST /api/reports — menambahkan laporan.
- GET /api/community-notes — mengambil catatan komunitas simulasi.

Contoh isi JSON untuk POST /api/reports:

{
  "id": "LAP-004",
  "category": "Kualitas Udara",
  "date": "2026-11-15",
  "status": "Menunggu Tinjauan",
  "description": "Contoh laporan pemantauan."
}

Laporan baru disimpan di be/data/db.json. Data fasilitas, pemantauan, dan catatan komunitas merupakan data simulasi untuk pembelajaran, bukan data operasional PLTN.

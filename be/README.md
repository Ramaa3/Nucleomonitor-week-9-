# NucleoMonitor API

Backend REST API untuk frontend NucleoMonitor. API menggunakan Node.js bawaan tanpa dependensi tambahan. Data fasilitas, pemantauan, dan catatan komunitas adalah data simulasi. Laporan baru disimpan ke `data/db.json`.

## Menjalankan

Dari folder `Week9`, jalankan `npm.cmd run dev`. Atau jalankan backend saja dari folder `be` dengan `npm.cmd run dev`.

API tersedia di `http://localhost:3000`. Atur `PORT` untuk mengganti port, atau `FRONTEND_ORIGIN` jika alamat frontend berbeda dari `http://localhost:5173`.

## Endpoint

- `GET /api/health` — status API.
- `GET /api/facilities` — daftar fasilitas.
- `GET /api/monitoring` — data pemantauan; bisa difilter dengan `?type=Udara`, `?type=Air`, atau `?type=Tanah`.
- `GET /api/reports` — daftar laporan.
- `POST /api/reports` — membuat laporan. JSON wajib: `id`, `category`, `date` (`YYYY-MM-DD`), `status`, dan `description`.
- `GET /api/community-notes` — catatan komunitas simulasi.

Data ini untuk pembelajaran, bukan data operasional PLTN.

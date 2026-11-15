# NucleoMonitor API

Backend REST API untuk frontend NucleoMonitor. Data fasilitas, pemantauan, dan catatan komunitas disediakan sebagai data simulasi. Laporan baru tersimpan di `data/db.json`.

## Menjalankan

1. Jalankan `npm install` di folder `Week9/be`.
2. Jalankan `npm run dev` untuk mode pengembangan, atau `npm start`.
3. API aktif di `http://localhost:3000`.

Frontend Vite berjalan di `http://localhost:5173` secara default. Atur `FRONTEND_ORIGIN` jika origin frontend berbeda; atur `PORT` untuk mengganti port API.

## Endpoint

- `GET /api/health` — status API.
- `GET /api/facilities` — daftar fasilitas.
- `GET /api/monitoring` — data pemantauan; opsional filter `?type=Udara`, `Air`, atau `Tanah`.
- `GET /api/reports` — daftar laporan.
- `POST /api/reports` — membuat laporan. JSON wajib: `id`, `category`, `date` (`YYYY-MM-DD`), `status`, dan `description`.
- `GET /api/community-notes` — catatan komunitas simulasi.

Semua respons menggunakan JSON. ID laporan harus unik. Data ini untuk pembelajaran dan bukan data operasional PLTN.

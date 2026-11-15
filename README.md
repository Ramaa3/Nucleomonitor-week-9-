# NucleoMonitor

Aplikasi edukasi untuk melihat data simulasi fasilitas PLTN, pemantauan lingkungan, laporan, dan catatan komunitas. Aplikasi terdiri dari frontend React/Vite dan backend REST API berbasis Node.js.

## Struktur Folder

- `fe/` — frontend dan halaman NucleoMonitor.
- `be/` — backend API serta data JSON.

## Persyaratan

- Node.js dan npm

## Menjalankan Aplikasi

Dari folder `Week9`, pasang dependensi frontend dan jalankan kedua server:

```powershell
npm.cmd install
npm.cmd run dev
```

Buka alamat frontend yang tampil di terminal, biasanya `http://localhost:5173`. Backend berjalan di `http://localhost:3000`. Tekan `Ctrl+C` untuk menghentikan server.

## Endpoint API

- `GET /api/health` — memeriksa status API.
- `GET /api/facilities` — mengambil daftar fasilitas.
- `GET /api/monitoring` — mengambil data pemantauan.
- `GET /api/monitoring?type=Udara` — memfilter data pemantauan berdasarkan jenis (`Udara`, `Air`, atau `Tanah`).
- `GET /api/reports` — mengambil daftar laporan.
- `POST /api/reports` — menambahkan laporan.
- `GET /api/community-notes` — mengambil catatan komunitas simulasi.

Contoh body JSON untuk `POST /api/reports`:

```json
{
  "id": "LAP-004",
  "category": "Kualitas Udara",
  "date": "2026-11-15",
  "status": "Menunggu Tinjauan",
  "description": "Contoh laporan pemantauan."
}
```

Laporan baru disimpan di `be/data/db.json`. Data fasilitas, pemantauan, dan catatan komunitas adalah data simulasi untuk pembelajaran, bukan data operasional PLTN.

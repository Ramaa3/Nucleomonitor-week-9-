# NucleoMonitor React

Frontend React/Vite untuk NucleoMonitor. Halaman Dashboard, Data Fasilitas, Pemantauan, Laporan, dan Catatan Komunitas berada di `public/pages/`.

## Menjalankan aplikasi

Dari folder `Week9`, jalankan sekali untuk memasang dependensi frontend:

```powershell
npm.cmd install
```

Lalu jalankan frontend dan backend bersama-sama:

```powershell
npm.cmd run dev
```

Buka alamat frontend yang tampil di terminal, biasanya `http://localhost:5173`. API backend berjalan di `http://localhost:3000`.

Laporan baru disimpan di `../be/data/db.json`. Data fasilitas, pemantauan, dan catatan komunitas adalah data simulasi.

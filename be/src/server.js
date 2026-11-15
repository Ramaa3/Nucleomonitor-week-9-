import cors from 'cors';
import express from 'express';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT) || 3000;
const here = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(here, '..', 'data', 'db.json');

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '32kb' }));

async function readDatabase() {
  return JSON.parse(await readFile(dataFile, 'utf8'));
}

async function writeDatabase(data) {
  await mkdir(path.dirname(dataFile), { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'NucleoMonitor API' });
});

app.get('/api/facilities', async (_req, res, next) => {
  try {
    const { facilities } = await readDatabase();
    res.json(facilities);
  } catch (error) { next(error); }
});

app.get('/api/monitoring', async (req, res, next) => {
  try {
    const { monitoring } = await readDatabase();
    const type = req.query.type;
    res.json(type && type !== 'Semua' ? monitoring.filter((item) => item.type === type) : monitoring);
  } catch (error) { next(error); }
});

app.get('/api/reports', async (_req, res, next) => {
  try {
    const { reports } = await readDatabase();
    res.json(reports);
  } catch (error) { next(error); }
});

app.post('/api/reports', async (req, res, next) => {
  try {
    const { id, category, date, status, description } = req.body ?? {};
    if (![id, category, date, status, description].every((value) => typeof value === 'string' && value.trim())) {
      return res.status(400).json({ error: 'Semua kolom wajib diisi.' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      return res.status(400).json({ error: 'Tanggal harus menggunakan format YYYY-MM-DD.' });
    }
    if (!['Kualitas Udara', 'Kualitas Air', 'Kualitas Tanah', 'Lainnya'].includes(category)) {
      return res.status(400).json({ error: 'Kategori laporan tidak valid.' });
    }
    if (!['Ditinjau', 'Menunggu Tinjauan'].includes(status)) {
      return res.status(400).json({ error: 'Status laporan tidak valid.' });
    }

    const database = await readDatabase();
    if (database.reports.some((report) => report.id.toLowerCase() === id.trim().toLowerCase())) {
      return res.status(409).json({ error: 'ID laporan sudah digunakan.' });
    }
    const report = { id: id.trim(), category, date, status, description: description.trim() };
    database.reports.push(report);
    await writeDatabase(database);
    return res.status(201).json(report);
  } catch (error) { next(error); }
});

app.get('/api/community-notes', async (_req, res, next) => {
  try {
    const { communityNotes } = await readDatabase();
    res.json(communityNotes);
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
});

app.listen(port, () => console.log(`NucleoMonitor API berjalan di http://localhost:${port}`));

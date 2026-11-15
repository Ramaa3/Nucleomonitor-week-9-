import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT) || 3000;
const here = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(here, '..', 'data', 'db.json');
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

async function readDatabase() {
  return JSON.parse(await readFile(dataFile, 'utf8'));
}

async function writeDatabase(data) {
  await mkdir(path.dirname(dataFile), { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function readBody(request) {
  let raw = '';
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 32 * 1024) throw Object.assign(new Error('Ukuran permintaan terlalu besar.'), { status: 413 });
  }
  try { return JSON.parse(raw || '{}'); }
  catch { throw Object.assign(new Error('Body harus berformat JSON.'), { status: 400 }); }
}

function send(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (!origin || origin === allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    response.setHeader('Vary', 'Origin');
  }
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  try {
    if (request.method === 'GET' && url.pathname === '/api/health') {
      send(response, 200, { status: 'ok', service: 'NucleoMonitor API' });
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/facilities') {
      send(response, 200, (await readDatabase()).facilities);
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/monitoring') {
      const { monitoring } = await readDatabase();
      const type = url.searchParams.get('type');
      send(response, 200, type && type !== 'Semua' ? monitoring.filter((item) => item.type === type) : monitoring);
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/reports') {
      send(response, 200, (await readDatabase()).reports);
      return;
    }
    if (request.method === 'POST' && url.pathname === '/api/reports') {
      const { id, category, date, status, description } = await readBody(request);
      if (![id, category, date, status, description].every((value) => typeof value === 'string' && value.trim())) {
        send(response, 400, { error: 'Semua kolom wajib diisi.' });
        return;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
        send(response, 400, { error: 'Tanggal harus menggunakan format YYYY-MM-DD.' });
        return;
      }
      if (!['Kualitas Udara', 'Kualitas Air', 'Kualitas Tanah', 'Lainnya'].includes(category)) {
        send(response, 400, { error: 'Kategori laporan tidak valid.' });
        return;
      }
      if (!['Ditinjau', 'Menunggu Tinjauan'].includes(status)) {
        send(response, 400, { error: 'Status laporan tidak valid.' });
        return;
      }
      const database = await readDatabase();
      if (database.reports.some((report) => report.id.toLowerCase() === id.trim().toLowerCase())) {
        send(response, 409, { error: 'ID laporan sudah digunakan.' });
        return;
      }
      const report = { id: id.trim(), category, date, status, description: description.trim() };
      database.reports.push(report);
      await writeDatabase(database);
      send(response, 201, report);
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/community-notes') {
      send(response, 200, (await readDatabase()).communityNotes);
      return;
    }
    send(response, 404, { error: 'Endpoint tidak ditemukan.' });
  } catch (error) {
    console.error(error);
    send(response, error.status || 500, { error: error.status ? error.message : 'Terjadi kesalahan pada server.' });
  }
});

server.listen(port, () => console.log(`NucleoMonitor API berjalan di http://localhost:${port}`));

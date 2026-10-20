import fs from 'node:fs';
import path from 'node:path';
import { exigirSesion } from '../lib/util.js';

const PERMITIDOS = new Set(['S-1', 'S-2', 'S-3', 'S-7', 'S-TIPO']);

export default function handler(req, res) {
  if (!exigirSesion(req, res)) return;
  const k = String(req.query.k || '');
  if (!PERMITIDOS.has(k)) return res.status(404).json({ error: 'Plano no encontrado' });
  const file = path.join(process.cwd(), 'planos', `plano_${k}.webp`);
  res.setHeader('Content-Type', 'image/webp');
  res.setHeader('Cache-Control', 'private, max-age=604800');
  res.status(200).send(fs.readFileSync(file));
}

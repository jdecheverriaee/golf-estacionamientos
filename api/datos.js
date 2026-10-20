import { exigirSesion, gas } from '../lib/util.js';

export default async function handler(req, res) {
  if (!exigirSesion(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  try { res.status(200).json(await gas('getDatos')); }
  catch (e) { res.status(502).json({ error: e.message }); }
}

import { exigirSesion, gas } from '../lib/util.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  if (!exigirSesion(req, res)) return;
  const { numeros, cambios, usuario } = req.body || {};
  if (!Array.isArray(numeros) || !numeros.length) return res.status(400).json({ error: 'Sin estacionamientos seleccionados' });
  res.setHeader('Cache-Control', 'no-store');
  try { res.status(200).json(await gas('guardar', { numeros: numeros.map(Number), cambios: cambios || {}, usuario: usuario || '' })); }
  catch (e) { res.status(400).json({ error: e.message }); }
}

import { claveCorrecta, cookieSesion } from '../lib/util.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const { password } = req.body || {};
  if (!claveCorrecta(password)) {
    await new Promise(r => setTimeout(r, 600)); // frena intentos por fuerza bruta
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  res.setHeader('Set-Cookie', cookieSesion());
  res.status(200).json({ ok: true });
}

import crypto from 'node:crypto';

const DIAS = 30;

function secreto() {
  // Cambiar APP_PASSWORD invalida todas las sesiones abiertas
  return (process.env.SESSION_SECRET || '') + '|' + (process.env.APP_PASSWORD || '');
}

export function firmar(exp) {
  return exp + '.' + crypto.createHmac('sha256', secreto()).update(String(exp)).digest('base64url');
}

function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(c => {
    const i = c.indexOf('=');
    return i < 0 ? [c.trim(), ''] : [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1).trim())];
  }));
}

export function autenticado(req) {
  const c = cookies(req).sess;
  if (!c) return false;
  const exp = Number(c.split('.')[0]);
  if (!exp || Date.now() > exp) return false;
  const ok = firmar(exp);
  return c.length === ok.length && crypto.timingSafeEqual(Buffer.from(c), Buffer.from(ok));
}

export function exigirSesion(req, res) {
  if (autenticado(req)) return true;
  res.status(401).json({ error: 'Sesión no iniciada o expirada' });
  return false;
}

export function cookieSesion() {
  const exp = Date.now() + DIAS * 864e5;
  return `sess=${encodeURIComponent(firmar(exp))}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DIAS * 86400}`;
}

export function claveCorrecta(pw) {
  const a = crypto.createHash('sha256').update(String(pw || '')).digest();
  const b = crypto.createHash('sha256').update(String(process.env.APP_PASSWORD || '')).digest();
  return !!process.env.APP_PASSWORD && crypto.timingSafeEqual(a, b);
}

// Llama al Apps Script (servidor a servidor, con clave secreta)
export async function gas(action, payload = {}) {
  if (!process.env.GAS_URL || !process.env.GAS_KEY) throw new Error('Faltan las variables GAS_URL / GAS_KEY en Vercel.');
  const r = await fetch(process.env.GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ key: process.env.GAS_KEY, action, ...payload }),
    redirect: 'follow',
  });
  const txt = await r.text();
  let j;
  try { j = JSON.parse(txt); }
  catch {
    throw new Error('Google Apps Script no respondió JSON. Revisa que la implementación tenga acceso "Cualquier usuario" y que GAS_URL termine en /exec.');
  }
  if (!j.ok) throw new Error(j.error || 'Error en Apps Script');
  return j.data;
}

# Estacionamientos · Golf Bicentenario

Panel web para asignar estacionamientos a departamentos sobre los planos del edificio
(Vitacura 2987 / Luz 2988, Las Condes).

- **Frontend:** `public/index.html` (plano interactivo, dashboard y listado).
- **Backend:** funciones en `api/` (Vercel) que se conectan, servidor a servidor, al
  Google Apps Script de la planilla *Estacionamiento Golf Bicentenario*.
- **Datos:** la planilla de Google Sheets (hojas `Estacionamientos` e `Historial`).
- **Planos:** `planos/*.webp`, servidos solo a usuarios con sesión iniciada.
- **Acceso:** contraseña compartida (cookie de sesión de 30 días).

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Valor |
|---|---|
| `APP_PASSWORD` | Contraseña compartida del equipo |
| `SESSION_SECRET` | Texto largo aleatorio (firma las sesiones) |
| `GAS_URL` | URL de la implementación web del Apps Script (termina en `/exec`) |
| `GAS_KEY` | Clave generada en la planilla: menú 🚗 → *Configurar acceso web (Vercel)* |

Cambiar `APP_PASSWORD` cierra todas las sesiones abiertas.

## Apps Script

El proyecto de Apps Script de la planilla debe tener `Codigo.gs` (con `doPost`),
`Posiciones.gs` e `Index.html`. La implementación web debe estar configurada con
**Ejecutar como: Yo** y **Quién tiene acceso: Cualquier usuario**. Sin la clave
`GAS_KEY` la API no entrega ni modifica datos.

## Ubicación de los estacionamientos

Las posiciones de cada número sobre los planos están en `Posiciones.gs` (Apps Script),
en % del ancho y alto de cada imagen. Los pisos -4, -5 y -6 comparten plano
(numeración +82 por piso).

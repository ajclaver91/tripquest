# 🧭 TripQuest v2 · Sprint 1 Alpha

**Haz que el viaje empiece antes de salir.**

Incluye registro, login, Mis aventuras, crear aventura, unirse por código y selector Mi aventura/Admin para el creador.

## Instalación
1. Crea un Supabase nuevo.
2. Ejecuta `supabase/001_tripquest_core.sql`.
3. Copia `.env.example` como `.env` y añade URL y clave pública.
4. Ejecuta `npm install` y `npm run dev`.

## Netlify
- Build: `npm run build`
- Publish: `dist`
- Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Environment variables.

# Ranita · Neceseres y bolsas para mamás

App Next.js de la tienda Ranita, con los productos y los contactos guardados en Neon (Postgres) y desplegada en Vercel.

## Páginas

- `/` — home con productos destacados
- `/tienda` — neceseres (25 €) y bolsas de carro (50 €), leídos de la tabla `productos`
- `/apuntate` — formulario de contacto y reserva; guarda en la tabla `leads`
- `/api/leads` — recibe el formulario

## Comandos

```bash
npm run dev        # vista previa en http://localhost:3000
npm run productos  # crea/actualiza la tabla productos (edita la lista en crear-productos.js)
npm run leads      # crea la tabla leads
npm run probar     # comprueba la conexión con Neon
```

## Variables de entorno

- `DATABASE_URL` — cadena de conexión de Neon (en `.env` en local y en Vercel en producción)

## Ver los contactos

En la consola SQL de Neon:

```sql
SELECT * FROM leads ORDER BY creado_en DESC;
```

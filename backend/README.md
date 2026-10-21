# API de contacto SMTP

Parte del proyecto [Colombia Mods 3D](../README.md). Guía general de despliegue: [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md).

Servicio Node.js que recibe el formulario web en `POST /api/contact` y envía el correo usando SMTP. Nunca expone las credenciales SMTP al navegador.

## Requisitos y configuración

- Node.js 20.19 o superior.
- Un buzón o proveedor SMTP autorizado para enviar desde el dominio.
- Copiar `.env.example` a `.env` y completar los valores directamente en el servidor. No subir `.env` al repositorio ni compartir sus secretos en el chat.
- El `.env` del frontend está separado en la raíz del proyecto. Sus `VITE_*` son públicos; no copies allí secretos del SMTP.

Variables requeridas:

| Variable | Descripción |
| --- | --- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | Servidor SMTP, puerto y TLS implícito (`true` normalmente en el puerto 465; `false` para STARTTLS, normalmente en 587). |
| `SMTP_USER`, `SMTP_PASS` | Usuario y contraseña o clave SMTP del proveedor. |
| `SMTP_FROM` | Dirección remitente verificada/autorizada por el proveedor. |
| `SUPPORT_EMAIL`, `BUSINESS_EMAIL` | Destinatarios para soporte/consultas y propuestas de negocios. |
| `CORS_ORIGINS` | Orígenes web permitidos, separados por comas. Incluye el dominio de producción y, si se necesita, el local. |
| `SITE_URL` | URL pública del sitio; se usa en el pie del correo y para construir la URL del logo (predeterminado: `https://colombiamods3d.com`). |
| `EMAIL_LOGO_URL` | URL pública HTTPS del logo que se incrusta en la plantilla (predeterminado: `{SITE_URL}/icon-512.png`). |
| `PORT` | Puerto local del proceso (predeterminado: `3001`). |
| `TRUST_PROXY` | Usa `1` si el proceso está detrás de un proxy inverso confiable; si no, deja `0`. |

## Ejecución

```sh
npm install
npm run check   # sintaxis + pruebas de la plantilla de correo
npm start
```

El servicio verifica las credenciales SMTP antes de escuchar. `GET /health` sirve para comprobar que está activo. El endpoint de envío limita cada IP a cinco solicitudes por cada 15 minutos y valida todos los campos.

Los correos se envían como HTML con tema oscuro, acentos de marca, logo, fecha de recepción, datos del remitente, tipo de consulta, asunto y mensaje. También incluyen un botón para responder directamente al correo del usuario y una alternativa de texto plano. El logo debe estar publicado por HTTPS para que el cliente de correo pueda cargarlo.

## Despliegue y conexión con el sitio

Ejecuta el proceso con un gestor persistente (por ejemplo, systemd o PM2) detrás de HTTPS y enruta `/api/contact` al puerto configurado. En nginx, dentro del bloque `server` del host donde se desplegará esta API, se puede usar:

```nginx
location = /api/contact {
  proxy_pass http://127.0.0.1:3001/api/contact;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}

location = /health {
  proxy_pass http://127.0.0.1:3001/health;
  proxy_set_header Host $host;
}
```

El `.env.example` de la raíz conecta `VITE_BACKEND_URL` con el backend del catálogo y `VITE_CONTACT_ENDPOINT` con `https://backendmods.colombiamods3d.com/api/contact`. El proxy de ese host debe reenviar `/api/contact` al puerto definido por `PORT` (3001 por defecto). En el `.env` del backend, `SITE_URL` debe coincidir con `VITE_SITE_URL`, y `CORS_ORIGINS` debe enumerar los orígenes del sitio, sin rutas ni barra final. Para desarrollo, configura `VITE_CONTACT_ENDPOINT=http://localhost:3001/api/contact` y verifica que `http://localhost:5173` esté en `CORS_ORIGINS`.

El despliegue requiere acceso al servidor/proxy donde se publique la API y credenciales SMTP configuradas como variables seguras. El código del sitio por sí solo no puede desplegar el servicio ni enviar correo sin esos valores.

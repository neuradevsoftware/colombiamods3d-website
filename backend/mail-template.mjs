const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[char])

const formatReceivedAt = (date) => new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Bogota',
}).format(date)

export function buildContactEmail(data, { siteUrl, logoUrl, receivedAt = new Date() }) {
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const subject = escapeHtml(data.subject)
  const type = escapeHtml(data.type)
  const message = escapeHtml(data.message).replace(/\r?\n/g, '<br>')
  const received = escapeHtml(formatReceivedAt(receivedAt))
  const safeSiteUrl = escapeHtml(siteUrl)
  const safeLogoUrl = escapeHtml(logoUrl)
  const text = [
    'NUEVO MENSAJE DE CONTACTO',
    'Colombia Mods 3D',
    '',
    `Nombre: ${data.name}`,
    `Correo: ${data.email}`,
    `Tipo de consulta: ${data.type}`,
    `Asunto: ${data.subject}`,
    `Recibido: ${formatReceivedAt(receivedAt)} (hora de Colombia)`,
    '',
    'MENSAJE',
    data.message,
    '',
    `Responder: ${data.email}`,
    siteUrl,
  ].join('\n')

  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="light dark"><title>Nuevo mensaje de contacto</title></head>
<body style="margin:0;padding:0;background-color:#0a0d10;font-family:Arial,Helvetica,sans-serif;color:#eef1f3;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Nuevo mensaje de ${name}: ${subject}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0a0d10;">
    <tr><td align="center" style="padding:32px 14px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;border:1px solid #262e35;border-radius:14px;overflow:hidden;background-color:#12161a;">
        <tr><td style="padding:28px 32px;background-color:#181d22;border-bottom:3px solid #ffb020;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
            <td valign="middle" style="padding-right:16px;"><a href="${safeSiteUrl}" style="text-decoration:none;"><img src="${safeLogoUrl}" width="64" height="64" alt="Logo Colombia Mods 3D" style="display:block;width:64px;height:64px;border:0;border-radius:10px;"></a></td>
            <td valign="middle"><div style="font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#ffb020;">Colombia Mods 3D</div><div style="padding-top:6px;font-size:23px;font-weight:bold;line-height:1.2;color:#ffffff;">Nuevo mensaje de contacto</div></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:30px 32px 12px;">
          <div style="font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#ffb020;">${type}</div>
          <h1 style="margin:8px 0 0;font-size:25px;line-height:1.25;color:#ffffff;">${subject}</h1>
          <p style="margin:10px 0 0;font-size:13px;line-height:1.6;color:#aab5bd;">Recibido el ${received} · hora de Colombia</p>
        </td></tr>
        <tr><td style="padding:16px 32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #262e35;border-radius:10px;background-color:#0d1115;">
            <tr><td style="padding:14px 16px;border-bottom:1px solid #262e35;">
              <div style="font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:#7d8a95;">Nombre</div>
              <div style="padding-top:5px;font-size:16px;color:#eef1f3;">${name}</div>
            </td></tr>
            <tr><td style="padding:14px 16px;border-bottom:1px solid #262e35;">
              <div style="font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:#7d8a95;">Correo electrónico</div>
              <div style="padding-top:5px;font-size:16px;"><a href="mailto:${email}" style="color:#ffb020;text-decoration:underline;">${email}</a></div>
            </td></tr>
            <tr><td style="padding:14px 16px;">
              <div style="font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:#7d8a95;">Tipo de consulta</div>
              <div style="padding-top:5px;font-size:16px;color:#eef1f3;">${type}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:8px 32px 30px;">
          <div style="padding:20px;border-left:3px solid #ffb020;border-radius:0 8px 8px 0;background-color:#181d22;">
            <div style="padding-bottom:12px;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:#ffb020;">Mensaje</div>
            <div style="font-size:15px;line-height:1.75;color:#eef1f3;overflow-wrap:anywhere;">${message}</div>
          </div>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;"><tr>
            <td align="center" style="border-radius:6px;background-color:#ffb020;"><a href="mailto:${email}?subject=${encodeURIComponent(`Re: ${data.subject}`)}" style="display:inline-block;padding:13px 20px;font-size:13px;font-weight:bold;letter-spacing:.5px;text-decoration:none;color:#1a1206;">RESPONDER A ${name.toUpperCase()}</a></td>
          </tr></table>
        </td></tr>
        <tr><td align="center" style="padding:20px 24px;border-top:1px solid #262e35;background-color:#0d1115;">
          <div style="font-size:12px;color:#7d8a95;">Enviado desde el formulario de <a href="${safeSiteUrl}" style="color:#ffb020;text-decoration:none;">colombiamods3d.com</a></div>
          <div style="padding-top:6px;font-size:11px;color:#596570;">Colombia Mods 3D · Mods para simuladores, a otro nivel.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  return { html, text }
}

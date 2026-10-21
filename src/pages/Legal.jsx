import { isValidElement } from 'react'
import { Link } from 'react-router-dom'
import { CONFIG } from '../config'
import PageHero from '../components/layout/PageHero'
import { prefersReducedMotion } from '../lib/format'
import Screen from './Screen'

export const mail = (addr) => <a className="text-amber underline underline-offset-2" href={`mailto:${addr}`}>{addr}</a>
const B = ({ children }) => <b className="font-semibold text-fg">{children}</b>

/* Bloques admitidos: texto | elemento React (párrafo) | {h} subtítulo | {ul} viñetas | {ol} numerada | {note} recuadro destacado */
function Block({ b }) {
  if (typeof b === 'string' || isValidElement(b)) return <p className="mb-3.5">{b}</p>
  if (b.h) return <h3 className="mt-6 mb-2 font-display text-[1.05rem] font-medium uppercase tracking-[.6px] text-amber">{b.h}</h3>
  if (b.ul) return <ul className="mb-3.5 grid list-disc gap-1.5 pl-5 marker:text-amber">{b.ul.map((x, i) => <li key={i}>{x}</li>)}</ul>
  if (b.ol) return <ol className="mb-3.5 grid list-decimal gap-1.5 pl-5 marker:font-mono marker:text-amber">{b.ol.map((x, i) => <li key={i}>{x}</li>)}</ol>
  if (b.note) return <div className="my-5 rounded-md border-l-4 border-amber bg-amber/[.07] px-4 py-3.5 text-fg">{b.note}</div>
  return null
}

function Legal({ title, intro, sections }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  return (
    <Screen label={title}>
      <PageHero crumb={title} title={title} />
      <div className="py-[clamp(36px,6vw,80px)]">
        <article className="pad leading-[1.7] text-steel-light">
          <div className="max-w-[82ch]">
            <p className="mb-5 font-mono text-[11px] text-steel">Última actualización: {CONFIG.legal.updated}</p>
            {intro.map((p, i) => <Block key={i} b={p} />)}

            <nav aria-label="Contenido" className="my-7 rounded-[10px] border border-line bg-panel-2 px-5 py-4">
              <p className="mb-2 font-display text-[.9rem] uppercase tracking-[1px] text-fg">Contenido</p>
              <ol className="columns-2 gap-x-8 text-[1rem] max-[760px]:columns-1">
                {sections.map(([h], i) => (
                  <li key={h} className="break-inside-avoid">
                    <a href={`#s${i + 1}`} onClick={(e) => { e.preventDefault(); go(`s${i + 1}`) }} className="inline-flex min-h-8 items-center gap-2 transition-colors hover:text-amber">
                      <span className="font-mono text-[11px] text-steel">{String(i + 1).padStart(2, '0')}</span>{h}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {sections.map(([h, ...blocks], i) => (
              <section key={h} id={`s${i + 1}`} className="scroll-mt-[calc(var(--hh)+12px)]">
                <h2 className="mt-10 mb-3 flex items-baseline gap-3 border-t border-line pt-6 font-display text-[1.35rem] uppercase tracking-[.4px] text-fg">
                  <span className="font-mono text-[12px] text-amber">{String(i + 1).padStart(2, '0')}</span>{h}
                </h2>
                {blocks.map((b, j) => <Block key={j} b={b} />)}
              </section>
            ))}
          </div>
        </article>
      </div>
    </Screen>
  )
}

const SUP = CONFIG.contact.email, BIZ = CONFIG.businessEmail
const DISCORD = CONFIG.social.find((s) => s.name === 'Discord')?.url || CONFIG.discordUrl // el mismo enlace del icono de Discord del pie
const discord = (label = 'comunidad de Discord') => DISCORD ? <a className="text-amber underline underline-offset-2" href={DISCORD} target="_blank" rel="noopener noreferrer">{label}</a> : label

/* ====================================================================== TÉRMINOS ====================================================================== */
export const Terms = () => (
  <Legal title="Términos y condiciones"
    intro={[
      <>Estos términos regulan el uso del sitio web de <B>Colombia Mods 3D</B>, del launcher <B>CM3D Launcher</B>, del servicio de seguridad <B>CM3D Guard</B> y de los productos que se descargan con ellos (la Base, el Activador y los mods). Al crear una cuenta, instalar el launcher, descargar la Base o el Activador, o usar el sitio, declaras que los leíste y los aceptas, junto con la <Link className="text-amber underline underline-offset-2" to="/privacidad">Política de privacidad</Link>. Si no estás de acuerdo, no uses el servicio.</>,
    ]}
    sections={[
      ['Definiciones',
        { ul: [
          <><B>Launcher:</B> la aplicación de escritorio CM3D Launcher.</>,
          <><B>Base:</B> el paquete base de un mod que el launcher descarga en la carpeta «mod» del juego.</>,
          <><B>Activador:</B> el archivo que habilita el uso de la Base y que se asigna a la cuenta que realizó la compra.</>,
          <><B>Archivos protegidos:</B> la Base y el Activador descargados por el launcher, así como las copias de ellos.</>,
          <><B>CM3D Guard:</B> el servicio de Windows de seguridad descrito en la sección 5.</>,
          <><B>Cuenta:</B> el perfil personal con el que inicias sesión en el launcher.</>,
        ] }],
      ['Tu cuenta',
        { ul: [
          'Debes tener capacidad legal para aceptar estos términos. Si eres menor de edad, necesitas la autorización de tu madre, padre o representante legal.',
          'La información que entregas al registrarte (nombre, correo, teléfono y país) debe ser veraz y estar actualizada.',
          'La cuenta es personal e intransferible. No la compartas, no la vendas y no permitas que otras personas la usen.',
          'Eres responsable de la seguridad de tu contraseña y de lo que ocurra desde tu cuenta.',
          'Por seguridad, la cuenta tiene un número limitado de dispositivos autorizados y solo puede tener una sesión activa a la vez.',
        ] }],
      ['Licencia de uso de los productos',
        'Al comprar un mod recibes una licencia personal, no exclusiva, intransferible y revocable para usarlo en tu propio equipo con el simulador compatible. La licencia no te transfiere la propiedad ni los derechos de autor del contenido.',
        'El Activador es de uso personal y exclusivo del usuario que realizó la compra. Queda estrictamente prohibido compartir, distribuir, copiar, revender, transferir o utilizar la Base o el Activador en cuentas o equipos no autorizados.'],
      ['Compras, precios y promociones',
        { ul: [
          'Las compras se gestionan directamente con nuestro equipo a través de Discord. El launcher no procesa pagos.',
          'Los precios, descuentos y fechas de lanzamiento se muestran en el catálogo y en el launcher; las fechas se expresan en hora de Colombia.',
          'Los mods marcados como «Próximamente» no se pueden comprar hasta su fecha de lanzamiento.',
        ] }],

      ['CM3D Guard: protección y baneo automático',
        { note: <><B>Importante:</B> los archivos protegidos están vigilados por un sistema automático. Si el sistema detecta que fueron copiados, extraídos, modificados o enviados fuera de la carpeta autorizada, <B>tu cuenta se suspende (baneo) de forma automática</B>, sin aviso previo, y <B>no se realiza ningún reembolso</B> (ver sección 6).</> },
        { h: 'Qué es y cómo se instala' },
        'CM3D Guard es un servicio de Windows que se instala junto con el launcher y funciona aunque el launcher esté cerrado. Se instala una sola vez con permiso de administrador de Windows (UAC), después de una ventana informativa. Se ve en los servicios de Windows como «CM3D Guard».',
        'Su instalación es obligatoria: sin el servicio en ejecución no es posible descargar ni usar la Base ni el Activador. Al aceptar la ventana informativa y el permiso de administrador, autorizas expresamente su instalación y funcionamiento.',
        { h: 'Qué vigila y qué no' },
        'Vigila únicamente los archivos protegidos. No lee tus otros archivos, tus contraseñas ni tu navegación.',
        { h: 'Qué se considera una infracción' },
        { ul: [
          'Quitar la protección de los archivos (por ejemplo, cambiar sus atributos de oculto, sistema o solo lectura).',
          'Modificar los archivos, incluido abrirlos y guardarlos de nuevo, o editar a mano el registro de archivos protegidos.',
          'Moverlos, renombrarlos o sacarlos de la carpeta autorizada, o hacer copias de ellos.',
          'Abrirlos con un navegador (por ejemplo, para subirlos a internet), con un programa de transferencia o mensajería, con un programa de compresión, desde una consola, o con el Explorador de Windows de forma sostenida para copiarlos o comprimirlos.',
          'Intentar desactivar, engañar o eludir el servicio.',
        ] },
        { h: 'Qué ocurre automáticamente al detectar una infracción' },
        { ol: [
          'Se cierra el programa que tenía el archivo abierto. Si es un navegador, se cierra por completo (se pueden perder las pestañas y el trabajo sin guardar). Si es el Explorador de Windows, el escritorio se reinicia.',
          'Se eliminan la Base y el Activador del equipo, y las copias o archivos renombrados que se encuentren por su contenido: en la carpeta del juego, en el Escritorio, Descargas y Documentos, y en las unidades locales y USB.',
          'La cuenta se suspende (baneo) y se revocan todas sus sesiones y dispositivos.',
          'Se registra una evidencia técnica del hecho y se avisa al equipo (ver la Política de privacidad).',
          'Al volver a abrir el launcher se muestra el aviso «Cuenta baneada», con el motivo y un código de caso.',
        ] },
        'Todo esto ocurre de forma automática en el momento de la detección. Sin conexión a internet, el reporte queda en cola y se envía cuando haya conexión.',
        { h: 'Eliminación por quitar o desinstalar el launcher' },
        'Si el launcher deja de existir en el equipo (por ejemplo, borras su carpeta) durante unos 2 minutos acumulados, o si desinstalas el servicio CM3D Guard, la Base y el Activador se eliminan automáticamente. En este caso no hay baneo, pero perderás el acceso a los archivos hasta reinstalar el launcher y descargarlos de nuevo.',
        { h: 'Limitaciones y falsos positivos' },
        'El sistema es automático y funciona con el mejor esfuerzo; puede cometer errores. Por ejemplo, un antivirus que elimine o ponga en cuarentena los archivos protegidos puede interpretarse como que fueron movidos o eliminados. Para evitarlo, no abras, copies ni modifiques los archivos protegidos con otros programas y revisa que tu antivirus no los afecte. Si crees que se trató de un error, sigue el proceso de la sección 7.'],

      ['Suspensión, baneo y NO reembolso',
        { note: <>Cuando una cuenta es suspendida o baneada por incumplir estos términos —de forma automática por CM3D Guard o por decisión de nuestro equipo— <B>no se realiza ningún tipo de reembolso, devolución de dinero, reintegro, compensación, crédito, canje ni transferencia</B> de las compras, licencias o beneficios de la cuenta, ni total ni parcialmente.</> },
        'Esto aplica sin importar la fecha de la compra, el valor pagado, el uso que hayas hecho de los productos o si la infracción fue intencional o no.',
        { ul: [
          'La licencia de uso queda revocada y se pierde el acceso a la cuenta, a los productos comprados, a las descargas y actualizaciones, y a los descuentos o beneficios asociados a la cuenta.',
          'Se eliminan los archivos protegidos del equipo, como se describe en la sección 5.',
          'Nos reservamos el derecho de tomar otras medidas, incluidas acciones legales, cuando haya uso no autorizado, distribución o reventa de nuestros productos.',
          'Se revocan las sesiones y los dispositivos asociados a la cuenta.',
        ] },
        'Lo anterior no afecta los derechos que la ley colombiana reconoce al consumidor y que no pueden renunciarse.'],
      ['Revisión de una suspensión',
        <>Si consideras que tu cuenta fue suspendida por error, escríbenos a {mail(SUP)} o abre un ticket de soporte en nuestra {discord()}, indicando el <B>código de caso</B> que aparece en el aviso de baneo, el correo de tu cuenta y una explicación de lo ocurrido. Revisaremos la evidencia registrada.</>,
        'Si se determina que la suspensión fue un error, se reactiva la cuenta y podrás volver a descargar la Base y el Activador. Si se confirma la infracción, la suspensión se mantiene y aplica la sección 6. Reactivar una cuenta es una decisión que tomamos tras la revisión, no un derecho automático.'],
      ['Conductas prohibidas',
        { ul: [
          'Compartir, subir, publicar, vender, revender, regalar o distribuir la Base, el Activador o cualquier mod, por cualquier medio.',
          'Usar los productos en cuentas o equipos no autorizados, o permitir que otras personas usen tu cuenta.',
          'Descompilar, modificar, hacer ingeniería inversa o extraer contenido de los productos o del launcher.',
          'Desactivar, detener, desinstalar o eludir CM3D Guard o cualquier medida de protección.',
          'Suplantar a otra persona, usar datos falsos o intentar acceder a cuentas ajenas.',
          'Afectar el funcionamiento, la seguridad o la disponibilidad del launcher, del sitio o de sus servidores.',
        ] }],
      ['Plugins y contenido de terceros',
        'El launcher puede ofrecer plugins de terceros cargados por nuestro equipo. Esos archivos no son de Colombia Mods 3D y no pasan por el sistema de protección. Se instalan en la carpeta de plugins del juego que elijas, y su uso es bajo tu responsabilidad.'],
      ['Propiedad intelectual y marcas',
        'Los contenidos, modelos 3D, marcas, logotipos, diseños y materiales de Colombia Mods 3D pertenecen a sus titulares y no se pueden reproducir, distribuir ni usar comercialmente sin autorización, salvo lo que permita la ley.',
        'American Truck Simulator y otras marcas citadas pertenecen a sus respectivos titulares. Colombia Mods 3D es una iniciativa independiente y no está afiliada ni respaldada por ellos.'],
      ['Disponibilidad, actualizaciones y compatibilidad',
        'El launcher se actualiza automáticamente desde nuestro repositorio de versiones. Los servicios se ofrecen según su disponibilidad y pueden tener interrupciones por mantenimiento o por causas ajenas a nosotros.',
        'Los mods dependen de las versiones del simulador. Una actualización del juego puede hacer que un mod deje de funcionar o requiera una nueva versión.'],
      ['Limitación de responsabilidad',
        'En la medida permitida por la ley, Colombia Mods 3D no responde por daños indirectos, pérdida de datos o de progreso, ni por el mal funcionamiento derivado de programas de terceros, modificaciones del equipo, del juego o de otros mods.',
        'Esta limitación no excluye la responsabilidad que la ley no permita excluir.'],
      ['Datos personales',
        <>El tratamiento de tus datos personales, incluidos los que recopila CM3D Guard, se explica en la <Link className="text-amber underline underline-offset-2" to="/privacidad">Política de privacidad</Link>.</>],
      ['Cambios a estos términos',
        'Podemos actualizar estos términos cuando sea necesario. Publicaremos la versión vigente en esta página con su fecha de actualización. Si sigues usando el servicio después de un cambio, entendemos que lo aceptas.'],
      ['Ley aplicable y contacto',
        'Estos términos se rigen por las leyes de la República de Colombia. Las controversias de consumo pueden llevarse ante las autoridades colombianas competentes, incluida la Superintendencia de Industria y Comercio.',
        <><B>Soporte y consultas sobre estos términos:</B> escribe a {mail(SUP)} o abre un ticket de soporte en nuestra {discord()}.</>,
        <>El correo {mail(BIZ)} es <B>exclusivamente para propuestas de negocios</B>; no atiende soporte ni consultas de usuarios.</>],
    ]} />
)

/* ====================================================================== PRIVACIDAD ====================================================================== */
const L = CONFIG.legal
export const Privacy = () => (
  <Legal title="Política de privacidad"
    intro={[
      'Esta política explica qué datos personales tratamos cuando usas el sitio web de Colombia Mods 3D, el launcher CM3D Launcher y el servicio de seguridad CM3D Guard, para qué los usamos, con quién se comparten y cómo puedes ejercer tus derechos. Se elabora conforme a la Ley 1581 de 2012 y sus normas reglamentarias en Colombia.',
    ]}
    sections={[
      ['Responsable del tratamiento',
        { ul: [
          <><B>Responsable:</B> {L.company}</>,
          L.nit && <><B>NIT:</B> {L.nit}</>,
          L.address && <><B>Dirección:</B> {L.address}</>,
          L.phone && <><B>Teléfono:</B> {L.phone}</>,
          <><B>Correo para datos personales y soporte:</B> {mail(SUP)}, o con un ticket de soporte en nuestra {discord()}</>,
          <><B>Propuestas de negocios:</B> {mail(BIZ)} (exclusivo para ese fin)</>,
        ].filter(Boolean) }],
      ['Qué datos tratamos',
        { h: 'Sitio web' },
        { ul: [
          'Si nos escribes por el formulario de contacto: nombre, correo, asunto, tipo de consulta y mensaje. El formulario prepara el mensaje en tu aplicación de correo para que lo revises y lo envíes tú.',
          'Como en cualquier servicio web, nuestros servidores pueden recibir tu dirección IP y datos técnicos de la conexión cuando se carga el catálogo.',
          'El sitio no usa cookies de seguimiento ni analítica, y las tipografías se sirven desde el propio sitio, sin cargar recursos de terceros.',
        ] },
        { h: 'Cuenta del launcher' },
        { ul: [
          'Datos de registro: nombre y apellido, correo electrónico, teléfono y país.',
          'Contraseña: se envía por conexión cifrada (HTTPS) al servidor para autenticarte. No se guarda en tu equipo.',
          'Inicio de sesión con Google (opcional): recibimos tu correo y datos básicos de perfil (como tu nombre). Pedimos únicamente los permisos de identidad.',
          'Foto de perfil (opcional) y cambios posteriores de teléfono o contraseña.',
          'Actividad ligada a tu cuenta: votos en encuestas y los productos, licencias y descargas asociados a la cuenta.',
        ] },
        { h: 'Dispositivo y sesión' },
        { ul: [
          'Un identificador de dispositivo (HWID): un código derivado de la huella de hardware del equipo y de un identificador local. No incluye tus archivos ni tu información personal.',
          'Un nombre legible del dispositivo (nombre del equipo y sistema operativo), para que reconozcas tus dispositivos autorizados.',
          'Señales periódicas de sesión activa, para hacer cumplir el límite de dispositivos y de una sola sesión a la vez.',
          'Si eliges «Recordarme», los datos de la sesión (no la contraseña) se guardan en tu equipo, en la carpeta CM3DLauncher de tu perfil de usuario.',
        ] },
        { h: 'Datos locales en tu equipo' },
        { ul: [
          'Configuración del launcher (ruta de mods y plugins, moneda).',
          'Un registro de actividad del launcher (launcher.log), que permanece en tu equipo y que puedes consultar en la pantalla de registros. Los correos aparecen enmascarados. Solo lo compartes si decides enviárnoslo para soporte.',
        ] },
        { h: 'CM3D Guard (seguridad)' },
        'Para vigilar los archivos protegidos, el servicio guarda de forma local un registro firmado con la ruta, el tamaño, la fecha y una huella de cada archivo protegido, y un registro de su propio funcionamiento (en la carpeta ProgramData de CM3DLauncher, accesible solo a administradores). Mientras vigila, consulta qué programas tienen abiertos esos archivos, pero no lee su contenido ni tus demás archivos.',
        'Solo cuando detecta una posible infracción se genera y se envía al servidor una evidencia (ver sección 4).'],
      ['Para qué usamos los datos',
        { ul: [
          'Crear y administrar tu cuenta, autenticarte y entregarte los productos que adquieres.',
          'Hacer cumplir la licencia de uso y proteger nuestra propiedad intelectual frente a copias, filtraciones y reventa no autorizadas.',
          'Prevenir el fraude y los accesos no autorizados, y limitar dispositivos y sesiones.',
          'Atender consultas, soporte, apelaciones y reclamos.',
          'Enviarte avisos del servicio (por ejemplo, restablecimiento de contraseña o cambios importantes).',
          'Cumplir obligaciones legales y atender requerimientos de autoridades.',
        ] },
        'No vendemos tus datos personales.'],
      ['CM3D Guard, evidencia y expediente del baneo',
        'Cuando CM3D Guard detecta una posible infracción, mide en ese instante y envía al servidor una evidencia técnica, que se guarda en el expediente del baneo de tu cuenta. Puede incluir:',
        { ul: [
          'El programa involucrado: nombre, identificador de proceso, ruta completa, huella SHA-256 del ejecutable, programa padre, línea de comandos y hora de inicio.',
          'Todos los programas que tenían abierto el archivo protegido en ese instante y una línea de tiempo de los últimos eventos.',
          'El archivo afectado: ruta, tamaño, fecha y huella esperados frente a los encontrados, atributos y nuevo nombre si fue renombrado.',
          'Lo que se hizo: programas cerrados y archivos eliminados (o que no se pudieron eliminar).',
          'Datos del equipo: versión de Windows, nombre del equipo, nombre de usuario de Windows, si es administrador y versiones del launcher y del servicio.',
        ] },
        'Además, tras una infracción el servicio puede buscar copias de los archivos protegidos comparando su tamaño y huella en la carpeta del juego, el Escritorio, Descargas, Documentos y las unidades locales y USB, únicamente para eliminarlas. No se envía el contenido de otros archivos.',
        'La evidencia se usa para decidir y documentar la suspensión, y para revisar tu caso si presentas una apelación. También se envía un aviso interno al equipo (usuario, fecha, hora y acción detectada). Las mediciones son de mejor esfuerzo: si alguna falla, el campo queda vacío y la suspensión sigue igual.',
        { note: <>La detección y la suspensión por infracciones son <B>automáticas</B>. Tienes derecho a pedir una revisión humana escribiendo a {mail(SUP)} con el código de caso (ver los términos y condiciones).</> }],
      ['Con quién compartimos los datos',
        { ul: [
          <><B>Google:</B> si inicias sesión con Google, para verificar tu identidad.</>,
          <><B>GitHub:</B> el launcher consulta nuestro repositorio de versiones para actualizarse; GitHub recibe tu dirección IP como en cualquier descarga.</>,
          <><B>Discord:</B> las compras y el soporte se gestionan con el equipo en Discord, y usamos canales internos de Discord para avisos de seguridad.</>,
          <><B>Neuradev Software:</B> proveedor tecnológico que desarrolla el launcher y la plataforma.</>,
          'Autoridades competentes, cuando la ley lo exija o para defender nuestros derechos.',
        ] },
        'Algunos de estos proveedores pueden tratar los datos fuera de Colombia. Al usar el servicio autorizas esas transferencias para las finalidades descritas.'],
      ['Conservación',
        'Conservamos los datos mientras tu cuenta esté activa y durante el tiempo necesario para cumplir las finalidades de esta política y las obligaciones legales. El expediente de un baneo se conserva para dejar constancia y atender apelaciones o reclamos. Puedes pedir la supresión de tus datos, salvo cuando exista un deber legal o contractual de conservarlos.'],
      ['Seguridad de la información',
        'Aplicamos medidas razonables para proteger los datos: comunicación cifrada con el servidor, registros locales firmados, y un servicio de seguridad que solo administradores pueden modificar. Ningún sistema es infalible; si detectas un problema, escríbenos.'],
      ['Tus derechos',
        'Como titular de datos personales tienes derecho a:',
        { ul: [
          'Conocer, actualizar y rectificar tus datos.',
          'Solicitar prueba de la autorización que nos diste.',
          'Ser informado del uso que damos a tus datos.',
          'Revocar la autorización o solicitar la supresión de tus datos cuando proceda.',
          'Acceder gratuitamente a tus datos.',
          'Presentar quejas ante la Superintendencia de Industria y Comercio, una vez agotado el trámite de consulta o reclamo ante nosotros.',
        ] },
        <>Para ejercerlos, escribe a {mail(SUP)} desde el correo de tu cuenta (o abre un ticket de soporte en nuestra {discord()}). Responderemos las <B>consultas</B> en máximo 10 días hábiles y los <B>reclamos</B> en máximo 15 días hábiles; si no es posible, te informaremos el motivo y la nueva fecha, dentro de los plazos que fija la ley.</>,
        'Revocar la autorización o pedir la supresión puede implicar que no podamos seguir prestándote el servicio, incluido el uso del launcher y de CM3D Guard.'],
      ['Menores de edad y datos sensibles',
        'El servicio no está dirigido a menores de edad sin la autorización de sus representantes legales. No solicitamos datos sensibles.'],
      ['Cambios a esta política',
        'Podemos actualizar esta política. Publicaremos la versión vigente en esta página con su fecha de actualización.'],
    ]} />
)

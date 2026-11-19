/**
 * Contenido de la landing de KALLIX.
 *
 * La página se enfoca en tres ofertas: sistemas SaaS, apps móviles Android y
 * chatbots para negocios. Ningún componente contiene texto: todo se edita aquí.
 *
 * ⚠️ Pendientes de reemplazar por datos reales: `CONTACT.phone` y
 * `CONTACT.whatsapp` siguen siendo placeholders.
 */

import { IconName } from '../ui/icon';
import { PreviewName } from '../ui/project-preview';

/* ── Navegación ─────────────────────────────────────────────────────────── */

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Productos', href: '#productos' },
  { label: 'Tecnologías', href: '#tecnologias' },
  { label: 'Modelos', href: '#modelos' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'FAQ', href: '#faq' },
];

/* ── Datos de contacto ──────────────────────────────────────────────────── */

export const CONTACT = {
  email: 'hola@kallix.studio',
  phone: '+52 55 0000 0000',
  whatsapp: 'https://wa.me/520000000000',
  location: 'Remoto · LATAM',
  hours: 'Lun a Vie · 9:00 – 19:00 (GMT-6)',
} as const;

/* ── Hero ───────────────────────────────────────────────────────────────── */

/** Las tres ofertas, resumidas bajo el titular. */
export const HERO_TAGS: readonly string[] = ['Sistemas SaaS', 'Apps Android', 'ChatBots'];

export interface HeroMock {
  readonly id: 'saas' | 'chatbot' | 'android';
  /** Nombra la pieza que se ve, no el servicio: las etiquetas ya están arriba. */
  readonly label: string;
  readonly preview: PreviewName;
  /** Profundidad del parallax de puntero; a más profundidad, más recorrido. */
  readonly depth: number;
  readonly alt: string;
}

/**
 * Las tres maquetas apiladas del hero. Enseñan lo que construimos en vez de
 * prometerlo: son SVG de `project-preview.ts`, sin una sola cifra nuestra.
 *
 * El orden del array es el orden en el DOM; quién queda encima de quién lo
 * decide el `z-index` por `data-kind` en `hero.css`.
 */
export const HERO_MOCKS: readonly HeroMock[] = [
  {
    id: 'saas',
    label: 'Panel de operación',
    preview: 'dashboard',
    depth: 10,
    alt: 'Maqueta de un panel de administración con métricas y tabla',
  },
  {
    id: 'chatbot',
    label: 'ChatBots en Telegram',
    preview: 'chat',
    depth: 22,
    alt: 'Maqueta de un chatbot de Telegram atendiendo a un cliente',
  },
  {
    id: 'android',
    label: 'App Android',
    preview: 'mobile',
    depth: 32,
    alt: 'Maqueta de una aplicación móvil',
  },
];

/* ── Productos propios ──────────────────────────────────────────────────── */

export type ProductKind = 'saas' | 'android';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly kind: ProductKind;
  /** Para quién es, en dos o tres palabras. */
  readonly tagline: string;
  readonly description: string;
  /** Salen de la descripción del producto; no inventar capacidades. */
  readonly features: readonly string[];
  /**
   * Icono cuadrado de 384 px en `public/imagenes/apps/`, derivado del PNG
   * original de `public/imagenes/` con el fondo ya horneado.
   */
  readonly icon: string;
  /** Color de marca exacto: título en tema oscuro y resplandor tras el icono. */
  readonly color: string;
  /**
   * El mismo tono, oscurecido solo en luminosidad (saturación intacta) hasta
   * 4.5:1 sobre todas las superficies claras. Medido en `scripts/contrast.mjs`.
   */
  readonly colorOnLight: string;
}

export const PRODUCT_KIND_LABEL: Readonly<Record<ProductKind, string>> = {
  saas: 'Sistema SaaS',
  android: 'App Android',
};

/**
 * Software de la marca. Tonalli salió el 2026-09-18; entran dos SaaS y dos
 * apps Android, con las capacidades tal como las describe el equipo.
 */
export const PRODUCTS: readonly Product[] = [
  {
    id: 'kalen',
    name: 'Kalen',
    kind: 'saas',
    tagline: 'Despachos de abogados',
    description:
      'Para licenciados en derecho y sus despachos: casos, contactos, agenda, facturas y documentos en un solo lugar. Arma equipos de trabajo y define roles a tu medida, con los permisos exactos de cada quien.',
    features: [
      'Gestión de casos',
      'Contactos y agenda',
      'Facturación',
      'Documentos',
      'Equipos de trabajo',
      'Roles y permisos personalizados',
    ],
    icon: 'imagenes/apps/kalen.png',
    color: '#768de5',
    colorOnLight: '#3c5dda',
  },
  {
    id: 'kineti',
    name: 'Kineti',
    kind: 'saas',
    tagline: 'Gimnasios',
    description:
      'Administra las membresías de tu gimnasio desde un mismo panel: quién es socio, qué plan tiene y cuándo le toca renovar.',
    features: ['Membresías', 'Socios y planes', 'Vencimientos y renovaciones'],
    icon: 'imagenes/apps/kineti.png',
    color: '#fd1923',
    colorOnLight: '#d2020b',
  },
  {
    id: 'kivo',
    name: 'Kivo',
    kind: 'android',
    tagline: 'Finanzas personales',
    description:
      'Tus gastos de comida, servicios y todo lo demás, junto con los préstamos que haces y los que pides: a quién, cuánto y cuándo toca pagar o cobrar. Registra los cargos leyendo las notificaciones de tus apps bancarias y escanea tus tickets.',
    features: [
      'Gastos por categoría',
      'Préstamos dados y recibidos',
      'Fechas de pago y de cobro',
      'Lee notificaciones bancarias',
      'Escaneo de tickets',
    ],
    icon: 'imagenes/apps/kivo.png',
    color: '#0ec9b8',
    colorOnLight: '#087369',
  },
  {
    id: 'kora',
    name: 'Kora',
    kind: 'android',
    tagline: 'Música en alta fidelidad',
    description:
      'Reproductor de audio FLAC para la música que ya tienes en tu celular o tablet. No descarga ni transmite nada: reproduce tus archivos, sin pérdida de calidad.',
    features: ['Audio FLAC sin pérdida', 'Tu música local', 'Sin descargas ni streaming'],
    icon: 'imagenes/apps/kora.png',
    color: '#fb9dbd',
    colorOnLight: '#ce084c',
  },
];

/* ── Servicios ──────────────────────────────────────────────────────────── */

export interface Service {
  readonly id: string;
  readonly icon: IconName;
  readonly title: string;
  readonly tagline: string;
  readonly summary: string;
  readonly points: readonly string[];
  /** Maqueta SVG que acompaña a la fila. */
  readonly preview: PreviewName;
}

export const SERVICES: readonly Service[] = [
  {
    id: 'saas',
    icon: 'layers',
    title: 'Sistemas SaaS',
    tagline: 'Tu producto en la nube',
    summary:
      'Plataformas multi-tenant con suscripciones, roles y panel de administración. El andamiaje aburrido resuelto bien, para que tu equipo solo piense en el negocio.',
    points: [
      'Multi-tenant y control de accesos por rol',
      'Cobros recurrentes y facturación',
      'Panel de administración y reportes',
      'Infraestructura, respaldos y monitoreo',
    ],
    preview: 'dashboard',
  },
  {
    id: 'android',
    icon: 'mobile',
    title: 'Apps móviles Android',
    tagline: 'Publicadas en Google Play',
    summary:
      'Aplicaciones nativas y en Flutter pensadas para durar años en producción, no para una demo. Funcionan aunque se caiga la señal y se actualizan sin fricción.',
    points: [
      'Kotlin nativo o Flutter, según el caso',
      'Publicación y actualizaciones en Google Play',
      'Modo sin conexión y sincronización',
      'Notificaciones push y pagos en la app',
    ],
    preview: 'mobile',
  },
  {
    id: 'chatbots',
    icon: 'bot',
    title: 'ChatBots para tu negocio',
    tagline: 'En WhatsApp y en tu sitio',
    summary:
      'Asistentes que conocen tu catálogo y tus procesos: contestan, cotizan, agendan y pasan la conversación a una persona en cuanto hace falta.',
    points: [
      'Entrenado con tu propia información',
      'WhatsApp, web y redes sociales',
      'Traspaso a un agente humano',
      'Historial y métricas de cada conversación',
    ],
    preview: 'chat',
  },
];

/* ── Tecnologías ────────────────────────────────────────────────────────── */

export interface TechGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly { name: string; note: string }[];
}

export const TECH_GROUPS: readonly TechGroup[] = [
  {
    id: 'saas',
    label: 'SaaS',
    items: [
      { name: 'Laravel', note: 'APIs · Filament' },
      { name: 'Angular', note: 'Signals · SSR' },
      { name: 'TypeScript', note: 'Estricto' },
      { name: 'PostgreSQL', note: 'Datos' },
      { name: 'Redis', note: 'Colas · caché' },
      { name: 'Stripe', note: 'Suscripciones' },
    ],
  },
  {
    id: 'android',
    label: 'Android',
    items: [
      { name: 'Kotlin', note: 'Nativo' },
      { name: 'Jetpack Compose', note: 'UI' },
      { name: 'Flutter', note: 'Multiplataforma' },
      { name: 'Firebase', note: 'Push · Auth' },
      { name: 'Play Console', note: 'Publicación' },
      { name: 'Fastlane', note: 'Entregas' },
    ],
  },
  {
    id: 'chatbots',
    label: 'ChatBots e IA',
    items: [
      { name: 'Claude', note: 'Agentes' },
      { name: 'OpenAI', note: 'LLM' },
      { name: 'LangChain', note: 'Orquestación' },
      { name: 'pgvector', note: 'Embeddings' },
      { name: 'WhatsApp API', note: 'Canal' },
      { name: 'Python', note: 'Pipelines' },
    ],
  },
  {
    id: 'infra',
    label: 'Infraestructura',
    items: [
      { name: 'Docker', note: 'Contenedores' },
      { name: 'AWS', note: 'Nube' },
      { name: 'GitHub Actions', note: 'CI/CD' },
      { name: 'Cloudflare', note: 'CDN · WAF' },
      { name: 'Sentry', note: 'Observabilidad' },
      { name: 'Grafana', note: 'Métricas' },
    ],
  },
];

/* ── Modelos de trabajo ─────────────────────────────────────────────────── */

export interface Plan {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly includes: readonly string[];
  readonly cta: string;
  readonly highlighted?: boolean;
}

export const PLANS: readonly Plan[] = [
  {
    id: 'proyecto',
    name: 'Proyecto cerrado',
    description: 'Sabes qué necesitas y quieres una fecha y un alcance en firme.',
    includes: [
      'Alcance y entregables definidos',
      'Diseño UI/UX incluido',
      'Entrega por hitos quincenales',
      '30 días de garantía',
    ],
    cta: 'Cotizar proyecto',
  },
  {
    id: 'equipo',
    name: 'Equipo dedicado',
    description: 'Necesitas capacidad continua y prioridades que cambian cada sprint.',
    includes: [
      'Squad de 2 a 5 personas',
      'Sprints de 2 semanas',
      'Canal directo de comunicación',
      'Reporte de avance semanal',
      'Sin permanencia mínima',
    ],
    cta: 'Armar equipo',
    highlighted: true,
  },
  {
    id: 'producto',
    name: 'Producto conjunto',
    description: 'Tienes la idea y el mercado; nosotros ponemos el producto en la nube.',
    includes: [
      'Descubrimiento y validación',
      'MVP en 8 a 12 semanas',
      'Infraestructura y operación',
      'Modelo de participación',
    ],
    cta: 'Platicar la idea',
  },
];

/* ── Proceso ────────────────────────────────────────────────────────────── */

export interface ProcessStep {
  readonly id: string;
  readonly step: string;
  readonly title: string;
  readonly description: string;
  readonly duration: string;
  readonly deliverables: readonly string[];
  readonly icon: IconName;
}

export const PROCESS: readonly ProcessStep[] = [
  {
    id: 'descubrimiento',
    step: '01',
    title: 'Descubrimiento',
    description:
      'Entendemos el negocio antes que el software. Salimos con el problema bien definido y el alcance acotado.',
    duration: '1 semana',
    deliverables: ['Mapa de procesos', 'Alcance y riesgos', 'Estimación'],
    icon: 'compass',
  },
  {
    id: 'diseno',
    step: '02',
    title: 'Diseño',
    description:
      'Arquitectura y UI se deciden juntas. Prototipamos las pantallas críticas para validarlas antes de escribir código de producción.',
    duration: '1 a 3 semanas',
    deliverables: ['Prototipo navegable', 'Design system', 'Arquitectura técnica'],
    icon: 'pen',
  },
  {
    id: 'desarrollo',
    step: '03',
    title: 'Desarrollo',
    description:
      'Arranca cuando el alcance y el prototipo de las dos etapas anteriores están aprobados, no antes. Sprints de dos semanas con demo al final de cada uno: ves el avance real, no un porcentaje.',
    duration: '4 a 16 semanas',
    deliverables: ['Demo quincenal', 'Entorno de pruebas', 'Código en tu repositorio'],
    icon: 'code',
  },
  {
    id: 'qa',
    step: '04',
    title: 'QA y lanzamiento',
    description:
      'Pruebas, rendimiento, accesibilidad y monitoreo. Publicamos con plan de reversa y acompañamos el primer día en vivo.',
    duration: '1 a 2 semanas',
    deliverables: ['Suite de pruebas', 'CI/CD', 'Monitoreo y alertas'],
    icon: 'shield',
  },
  {
    id: 'evolucion',
    step: '05',
    title: 'Evolución',
    description:
      'El lanzamiento es el inicio. Medimos uso, priorizamos con datos y seguimos construyendo lo que sí mueve la aguja.',
    duration: 'Continuo',
    deliverables: ['Roadmap trimestral', 'Soporte con SLA', 'Mejoras medidas'],
    icon: 'chart',
  },
];

/* ── Equipo ─────────────────────────────────────────────────────────────── */

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly specialty: string;
  readonly bio: string;
  /** Frase para el carrusel de `about`. Cada quien responde por la suya. */
  readonly quote: string;
  readonly skills: readonly string[];
  /** Rejilla 14×14; cada carácter es un color de `palette`, `.` es transparente. */
  readonly pixels: readonly string[];
  readonly palette: Readonly<Record<string, string>>;
}

/** Los dos tonos de piel del equipo: `3` es la base, `4` la sombra (boca, mentón). */
const PIEL_MORENA = { '3': '#a9713f', '4': '#87552d' };
const PIEL_CLARA = { '3': '#e8bd93', '4': '#c4915f' };

export const TEAM: readonly TeamMember[] = [
  {
    id: 'patricio',
    name: 'Patricio',
    role: 'Desarrollo Mobile',
    specialty: 'Aplicaciones móviles · Desarrollo offline',
    bio: 'Apps móviles para entornos financieros: operan sin conexión y sincronizan después con los sistemas web vía APIs. También Oracle, APEX y bases de datos empresariales.',
    quote:
      'No entregamos proyectos: entregamos software que alguien va a usar todos los días. Esa diferencia se nota en cada decisión que tomamos.',
    skills: ['Flutter', 'SQLite', 'APIs', 'Oracle'],
    // Anteojos (`8` la montura dorada, `5` la pupila), camisa desabrochada (piel
    // en el pecho) y mangas remangadas (`2` el puño doblado, `3` el antebrazo).
    pixels: [
      '..............',
      '....111111....',
      '..1111111111..',
      '..1111111111..',
      '..1333333331..',
      '..1888338881..',
      '..1858338581..',
      '..1333333331..',
      '..3333443333..',
      '...33333333...',
      '....333333....',
      '..6663333666..',
      '.226663366622.',
      '33366666666333',
    ],
    palette: {
      '1': '#1f2937',
      '2': '#c2883a',
      ...PIEL_MORENA,
      '5': '#0c3b45',
      '6': '#e7a84e',
      '8': '#f0c46a',
    },
  },
  {
    id: 'francisco',
    name: 'Francisco',
    role: 'IA & ChatBots',
    specialty: 'Inteligencia artificial · Automatización',
    bio: 'ChatBots en producción que consultan información, se conectan a APIs y ejecutan acciones dentro de otros sistemas. Backend e IA para automatizar procesos.',
    quote:
      'Un bot útil no es el que habla bonito: es el que busca el dato correcto y hace algo con él. Cuando no sabe, pasa la conversación a una persona.',
    skills: ['Python', 'IA', 'ChatBots', 'APIs'],
    pixels: [
      '..............',
      '...88888888...',
      '..8811111188..',
      '..8811111188..',
      '..8833333388..',
      '..8333333338..',
      '..8355335538..',
      '...33333333...',
      '...33344333...',
      '...33333333...',
      '....333333....',
      '...66666666...',
      '..6666666666..',
      '.666666776666.',
    ],
    palette: {
      '1': '#3e2a1f',
      ...PIEL_CLARA,
      '5': '#0c3b45',
      '6': '#3e9b94',
      '7': '#0c3b45',
      '8': '#cff0ea',
    },
  },
  {
    id: 'claudio',
    name: 'Claudio',
    role: 'Full Stack & Cloud',
    specialty: 'Frontend · Backend · Procesamiento de datos',
    bio: 'Soluciones web con Angular y tecnologías cloud. Ha trabajado en proyectos institucionales que convierten documentos físicos en datos estructurados con IA.',
    quote:
      'La mitad del trabajo es convertir lo que ya existe —papeles, hojas de cálculo, correos— en datos con los que el sistema pueda trabajar.',
    skills: ['Angular', 'TypeScript', 'AWS'],
    // Peinado partido al medio (`2` es la raya), complexión ancha y audífonos
    // puestos: `7` la diadema y las copas grises, `8` las almohadillas negras
    // pegadas a la cabeza. Playera negra (`6`).
    pixels: [
      '...77777777...',
      '..7111221117..',
      '.711112211117.',
      '71111122111117',
      '78133333333187',
      '78333333333387',
      '78335533553387',
      '78333333333387',
      '.133334433331.',
      '..3333333333..',
      '...33333333...',
      '..6666666666..',
      '.666666666666.',
      '66666666666666',
    ],
    palette: {
      '1': '#2b1a12',
      '2': '#5a3b24',
      ...PIEL_MORENA,
      '5': '#0c3b45',
      '6': '#17191d',
      '7': '#8b9099',
      '8': '#0b0c0e',
    },
  },
  {
    id: 'jesus',
    name: 'Jesús',
    role: 'Backend & Desarrollo Web',
    specialty: 'Sistemas web · APIs · Gestión de información',
    bio: 'Plataformas web para procesos de empresa: clientes, créditos, cobranza, usuarios y permisos. Integra los sistemas web con las apps móviles mediante APIs.',
    quote:
      'Detrás de una pantalla simple hay reglas que no perdonan: permisos, saldos, cobranza. Si el backend no las respeta, la interfaz solo disimula.',
    skills: ['Laravel', 'PHP', 'MySQL', 'APIs'],
    // Barba sin bigote: `2` recorre mejillas y mentón, pero la fila sobre la boca
    // se queda en piel.
    pixels: [
      '..............',
      '...11111111...',
      '..1111111111..',
      '..1111111111..',
      '..1133333311..',
      '..1333333331..',
      '..1355335531..',
      '..1333333331..',
      '..1233333321..',
      '..1223443221..',
      '...22222222...',
      '...66666666...',
      '..6666666666..',
      '.666666776666.',
    ],
    palette: {
      '1': '#4b3a2a',
      '2': '#5c4632',
      ...PIEL_CLARA,
      '5': '#0c3b45',
      '6': '#20666b',
      '7': '#cff0ea',
    },
  },
  {
    id: 'miguel',
    name: 'Miguel',
    role: 'Desarrollo de Software',
    specialty: 'Python · Inteligencia artificial · Automatización',
    bio: 'Desarrolla herramientas basadas en IA: Python y APIs de modelos para automatizar la generación y el procesamiento de información.',
    quote:
      'Cada proceso que alguien repite a mano todas las semanas es una tarea que el software debería estar haciendo solo.',
    skills: ['Python', 'IA', 'APIs'],
    pixels: [
      '..............',
      '...88888888...',
      '..8888888888..',
      '..8888888888..',
      '.222222222222.',
      '..1133333311..',
      '...35533553...',
      '...33333333...',
      '...33344333...',
      '...33333333...',
      '....333333....',
      '...66666666...',
      '..6666666666..',
      '.666666776666.',
    ],
    palette: {
      '1': '#241a12',
      '2': '#0a2a32',
      ...PIEL_MORENA,
      '5': '#0c3b45',
      '6': '#88c9c4',
      '7': '#0c3b45',
      '8': '#2b7f7a',
    },
  },
];

/* ── Preguntas frecuentes ───────────────────────────────────────────────── */

export interface Faq {
  readonly question: string;
  readonly answer: string;
}

export const FAQS: readonly Faq[] = [
  {
    question: '¿Cuánto cuesta desarrollar mi proyecto?',
    answer:
      'Depende del alcance, y preferimos no inventarte una cifra antes de entenderlo. En la primera llamada acotamos el problema y en menos de una semana recibes una estimación por rangos, con los supuestos escritos para que sepas qué la mueve hacia arriba o hacia abajo.',
  },
  {
    question: '¿Cuánto tarda un proyecto típico?',
    answer:
      'Los plazos se cuentan desde que el plan está cerrado, no desde la primera llamada. Antes van el descubrimiento y el diseño —de una a cuatro semanas— donde dejamos por escrito qué se va a construir; hasta que las dos partes estamos de acuerdo en eso no se escribe código de producción, porque programar sobre un alcance a medio entender es lo que hace que los proyectos se dupliquen. Con el plan cerrado: un chatbot puede estar operando en 3 o 4 semanas, un MVP de SaaS toma entre 8 y 12, y una app Android publicada en Google Play, entre 10 y 16. Dentro de esa ventana trabajamos en sprints de dos semanas con demo al final de cada uno, así que ves avance real desde la semana dos.',
  },
  {
    question: '¿Hacen apps para iOS también?',
    answer:
      'Nuestro foco es Android, que es donde está la mayor parte del mercado en LATAM. Cuando el proyecto lo pide, construimos en Flutter y publicamos también en App Store desde la misma base de código; lo decidimos contigo en el descubrimiento.',
  },
  {
    question: '¿Con qué información se entrena el chatbot?',
    answer:
      'Con la tuya: catálogo, precios, políticas, preguntas frecuentes y los documentos que nos compartas. El bot responde sobre esa base, no inventa, y cuando no sabe algo pasa la conversación a una persona de tu equipo.',
  },
  {
    question: '¿El código es mío?',
    answer:
      'Sí. Todo el código vive en tu repositorio desde el primer commit y la propiedad intelectual es tuya al cierre del contrato. También te entregamos la documentación técnica y los accesos de infraestructura.',
  },
  {
    question: '¿Qué pasa después del lanzamiento?',
    answer:
      'Ofrecemos soporte con SLA y un roadmap trimestral. Los primeros 30 días posteriores al lanzamiento están cubiertos por garantía: cualquier defecto del alcance entregado se corrige sin costo.',
  },
  {
    question: '¿Pueden hacerse cargo de un proyecto ya empezado?',
    answer:
      'Sí. Empezamos con una auditoría de código e infraestructura de una semana, y de ahí sale un plan honesto: continuar, refactorizar por partes o reescribir. Te decimos cuál conviene aunque no sea la opción más grande.',
  },
  {
    question: '¿Cómo manejan la seguridad y los datos?',
    answer:
      'Cifrado en tránsito y en reposo, control de acceso por roles, respaldos automáticos y bitácora auditable. Firmamos NDA antes de ver cualquier información sensible.',
  },
  {
    question: '¿Dónde están ubicados?',
    answer:
      'Somos un equipo remoto en LATAM y trabajamos en horario GMT-6, con traslape completo con América. Nos reunimos por video y respondemos por el canal que prefieras.',
  },
];

/* ── Footer ─────────────────────────────────────────────────────────────── */

export interface FooterColumn {
  readonly title: string;
  readonly links: readonly NavLink[];
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: 'Servicios',
    links: [
      { label: 'Sistemas SaaS', href: '#servicios' },
      { label: 'Apps móviles Android', href: '#servicios' },
      { label: 'ChatBots para tu negocio', href: '#servicios' },
    ],
  },
  {
    title: 'Estudio',
    links: [
      { label: 'Productos propios', href: '#productos' },
      { label: 'Tecnologías', href: '#tecnologias' },
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'Equipo', href: '#equipo' },
      { label: 'Proceso', href: '#proceso' },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { label: 'Modelos de trabajo', href: '#modelos' },
      { label: 'Preguntas frecuentes', href: '#faq' },
      { label: 'Escríbenos', href: '#contacto' },
    ],
  },
];

export const SOCIAL_LINKS: readonly { label: string; href: string; icon: IconName }[] = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'linkedin' },
  { label: 'X', href: 'https://x.com/', icon: 'x' },
];

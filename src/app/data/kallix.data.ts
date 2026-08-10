/**
 * Contenido de la landing de Kallix Studio.
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

/**
 * Contenido de la maqueta de panel del hero. Es una ventana ilustrativa: no
 * presume métricas nuestras, enseña la oferta y el compromiso de respuesta.
 */
export const HERO_PANEL = {
  title: 'kallix · panel',
  badge: 'disponibles',
  metricLabel: 'Respondemos tu mensaje en',
  metricValue: '< 24 h',
  chips: ['Sistemas SaaS', 'Apps Android', 'ChatBots'],
  footnote: 'Diseño, código y operación con el mismo equipo',
} as const;

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
      'Sprints de dos semanas con demo al final de cada uno. Nada de cajas negras: ves el avance real, no un porcentaje.',
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
  readonly skills: readonly string[];
  /** Rejilla 14×14; cada carácter es un color de `palette`, `.` es transparente. */
  readonly pixels: readonly string[];
  readonly palette: Readonly<Record<string, string>>;
}

const SKIN = { '3': '#e7b78a', '4': '#c98f62' };

export const TEAM: readonly TeamMember[] = [
  {
    id: 'patricio',
    name: 'Patricio',
    role: 'CEO · Arquitectura',
    specialty: 'Apps Android',
    bio: 'Dirige los proyectos y define la arquitectura. Su terreno es el móvil: apps que aguantan años en producción.',
    skills: ['Kotlin', 'Flutter', 'Producto'],
    pixels: [
      '..............',
      '....111111....',
      '...11111111...',
      '..1111111112..',
      '..113333331...',
      '..133333333...',
      '..133533533...',
      '..133333333...',
      '..134444433...',
      '...34444443...',
      '....333333....',
      '...66666666...',
      '..6666666666..',
      '.666666776666.',
    ],
    palette: { '1': '#1f2937', '2': '#4b5563', ...SKIN, '5': '#0c3b45', '6': '#e7a84e', '7': '#14252c' },
  },
  {
    id: 'pancho',
    name: 'Pancho',
    role: 'IA & ChatBots',
    specialty: 'Agentes inteligentes',
    bio: 'Construye los asistentes conversacionales: los entrena con la información del cliente y los conecta a WhatsApp.',
    skills: ['Claude', 'LangChain', 'Python'],
    pixels: [
      '..............',
      '...88888888...',
      '..8811111188..',
      '..8811111188..',
      '..8833333388..',
      '..8333333338..',
      '..133533533...',
      '..133333333...',
      '..133344433...',
      '...33333333...',
      '....333333....',
      '...66666666...',
      '..6666666666..',
      '.666666776666.',
    ],
    palette: { '1': '#3e2a1f', '2': '#5c4030', '3': '#d9a272', '4': '#b07e52', '5': '#0c3b45', '6': '#3e9b94', '7': '#0c3b45', '8': '#cff0ea' },
  },
  {
    id: 'chui',
    name: 'Chui',
    role: 'Backend',
    specialty: 'Laravel',
    bio: 'Construye las APIs y los sistemas SaaS multi-tenant que sostienen todo lo demás.',
    skills: ['Laravel', 'PostgreSQL', 'APIs'],
    pixels: [
      '..............',
      '....111111....',
      '...11111111...',
      '..1111111111..',
      '..1133333311..',
      '..133333333...',
      '..185888583...',
      '..133333333...',
      '..133344433...',
      '...33333333...',
      '....333333....',
      '...66666666...',
      '..6666666666..',
      '.666666776666.',
    ],
    palette: { '1': '#111827', '2': '#374151', '3': '#c98f62', '4': '#a3703f', '5': '#0c3b45', '6': '#20666b', '7': '#cff0ea', '8': '#88c9c4' },
  },
  {
    id: 'culadio',
    name: 'Culadio',
    role: 'Frontend',
    specialty: 'Angular',
    bio: 'Traduce el diseño a interfaces que responden al instante y no se rompen cuando el sistema crece.',
    skills: ['Angular', 'TypeScript', 'CSS'],
    pixels: [
      '..............',
      '...88888888...',
      '..8888888888..',
      '.888888888888.',
      '..1133333311..',
      '..133333333...',
      '..133533533...',
      '..133333333...',
      '..133344433...',
      '...33333333...',
      '....333333....',
      '...66666666...',
      '..6666666666..',
      '.666666776666.',
    ],
    palette: { '1': '#2b1a12', '2': '#4b5563', ...SKIN, '5': '#0c3b45', '6': '#114a55', '7': '#e7a84e', '8': '#d96c2c' },
  },
  {
    id: 'mitot',
    name: 'Mitot',
    role: 'Desarrollo',
    specialty: 'En formación continua',
    bio: 'Participa en los proyectos del estudio mientras sigue preparándose. Aprende rápido y pregunta mejor.',
    skills: ['Angular', 'Laravel', 'QA'],
    pixels: [
      '..............',
      '...11111111...',
      '..1111111111..',
      '..1111111111..',
      '..1133333311..',
      '..1333333331..',
      '..1335335331..',
      '..1333333331..',
      '..1333444331..',
      '..1333333331..',
      '...13333331...',
      '...66666666...',
      '..6666666666..',
      '.666666776666.',
    ],
    palette: { '1': '#4b3a2a', '2': '#6b5540', ...SKIN, '5': '#0c3b45', '6': '#88c9c4', '7': '#0c3b45' },
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
      'Un chatbot conectado a WhatsApp puede estar operando en 3 o 4 semanas. Un MVP de SaaS toma entre 8 y 12 semanas. Una app Android publicada en Google Play, entre 10 y 16. Trabajamos en sprints de dos semanas con demo al final de cada uno, así que ves avance real desde la semana dos.',
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
      { label: 'Tecnologías', href: '#tecnologias' },
    ],
  },
  {
    title: 'Estudio',
    links: [
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

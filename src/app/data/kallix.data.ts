/**
 * Contenido de la landing de Kallix Studio.
 *
 * ⚠️ PLACEHOLDER: el equipo, los servicios y los datos de contacto son reales;
 * el portafolio, los testimonios, las métricas y los productos SaaS son
 * ejemplos plausibles. Reemplázalos aquí — ningún componente contiene texto.
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
  { label: 'Trabajo', href: '#portafolio' },
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

export const HERO_STATS: readonly { value: string; label: string }[] = [
  { value: '38+', label: 'Proyectos entregados' },
  { value: '5', label: 'Productos propios' },
  { value: '4.9', label: 'Satisfacción · 5' },
];

/* ── Servicios ──────────────────────────────────────────────────────────── */

export interface Service {
  readonly id: string;
  readonly icon: IconName;
  readonly title: string;
  readonly summary: string;
  readonly points: readonly string[];
  /** Marca la tarjeta ancha dentro del bento. */
  readonly featured?: boolean;
}

export const SERVICES: readonly Service[] = [
  {
    id: 'web',
    icon: 'browser',
    title: 'Aplicaciones web',
    summary:
      'Plataformas que cargan rápido, escalan sin sobresaltos y se sienten nativas del navegador.',
    points: ['Angular · TypeScript', 'Diseño de sistemas', 'Tiempo real y offline'],
    featured: true,
  },
  {
    id: 'mobile',
    icon: 'mobile',
    title: 'Aplicaciones móviles',
    summary: 'Apps para iOS y Android con arquitectura pensada para durar años, no una demo.',
    points: ['Flutter y nativo', 'Publicación en tiendas', 'Push, pagos y offline'],
  },
  {
    id: 'saas',
    icon: 'layers',
    title: 'Sistemas SaaS',
    summary:
      'Multi-tenant, suscripciones, roles y facturación: el andamiaje aburrido, resuelto bien.',
    points: ['Multi-tenant', 'Cobros recurrentes', 'Paneles de administración'],
  },
  {
    id: 'ai',
    icon: 'bot',
    title: 'ChatBots e IA',
    summary:
      'Asistentes que conocen tu negocio, contestan en WhatsApp y escalan a un humano cuando toca.',
    points: ['RAG sobre tus datos', 'WhatsApp y web', 'Agentes con herramientas'],
    featured: true,
  },
  {
    id: 'automation',
    icon: 'bolt',
    title: 'Automatización',
    summary: 'Conectamos lo que ya usas y borramos el trabajo manual que nadie quiere hacer.',
    points: ['Integraciones y APIs', 'Reportes automáticos', 'Flujos programados'],
  },
  {
    id: 'custom',
    icon: 'blocks',
    title: 'Software a medida',
    summary: 'ERP, CRM y herramientas internas hechas a la forma exacta de tu operación.',
    points: ['Levantamiento de procesos', 'Migraciones', 'Soporte y evolución'],
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
    id: 'frontend',
    label: 'Frontend',
    items: [
      { name: 'Angular', note: 'Signals · SSR' },
      { name: 'TypeScript', note: 'Estricto' },
      { name: 'RxJS', note: 'Reactivo' },
      { name: 'Tailwind', note: 'Design tokens' },
      { name: 'Vite', note: 'Build' },
      { name: 'Figma', note: 'Diseño' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: [
      { name: 'Laravel', note: 'APIs · Filament' },
      { name: 'PHP 8', note: 'Tipado' },
      { name: 'Node.js', note: 'Servicios' },
      { name: 'PostgreSQL', note: 'Datos' },
      { name: 'MySQL', note: 'Datos' },
      { name: 'Redis', note: 'Colas · caché' },
    ],
  },
  {
    id: 'mobile',
    label: 'Móvil',
    items: [
      { name: 'Flutter', note: 'iOS · Android' },
      { name: 'Dart', note: 'Tipado' },
      { name: 'Kotlin', note: 'Nativo' },
      { name: 'Swift', note: 'Nativo' },
      { name: 'Firebase', note: 'Push · Auth' },
      { name: 'Fastlane', note: 'Publicación' },
    ],
  },
  {
    id: 'ai',
    label: 'IA & Datos',
    items: [
      { name: 'Claude', note: 'Agentes' },
      { name: 'OpenAI', note: 'LLM' },
      { name: 'LangChain', note: 'Orquestación' },
      { name: 'pgvector', note: 'Embeddings' },
      { name: 'Python', note: 'Pipelines' },
      { name: 'n8n', note: 'Automatización' },
    ],
  },
  {
    id: 'infra',
    label: 'Infraestructura',
    items: [
      { name: 'Docker', note: 'Contenedores' },
      { name: 'AWS', note: 'Nube' },
      { name: 'Vercel', note: 'Edge' },
      { name: 'GitHub Actions', note: 'CI/CD' },
      { name: 'Cloudflare', note: 'CDN · WAF' },
      { name: 'Sentry', note: 'Observabilidad' },
    ],
  },
];

/* ── Productos SaaS propios ─────────────────────────────────────────────── */

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly status: 'Producción' | 'Beta' | 'En desarrollo';
  readonly features: readonly string[];
  readonly preview: PreviewName;
  readonly accent: 'amber' | 'teal' | 'rust';
}

export const PRODUCTS: readonly Product[] = [
  {
    id: 'botaro',
    name: 'Botaro',
    tagline: 'Chatbots de WhatsApp con IA',
    description:
      'Conecta tu catálogo y tus procesos: Botaro contesta, cotiza, agenda y escala a un humano cuando la conversación lo pide.',
    status: 'Producción',
    features: ['Base de conocimiento propia', 'Handoff a agente humano', 'Métricas de conversación'],
    preview: 'chat',
    accent: 'teal',
  },
  {
    id: 'kanttia',
    name: 'Kanttia',
    tagline: 'Inventario y punto de venta',
    description:
      'Control de stock multi-sucursal, ventas en mostrador y reportes que se entienden sin ser contador.',
    status: 'Producción',
    features: ['Multi-sucursal', 'Corte de caja', 'Facturación electrónica'],
    preview: 'pos',
    accent: 'amber',
  },
  {
    id: 'flujo',
    name: 'Flujo',
    tagline: 'Automatización de procesos internos',
    description:
      'Diseña un proceso una vez y deja que corra solo: aprobaciones, recordatorios e integraciones con lo que ya usas.',
    status: 'Beta',
    features: ['Editor visual de flujos', 'Integraciones vía API', 'Bitácora auditable'],
    preview: 'flow',
    accent: 'rust',
  },
];

/* ── Modelos de trabajo (pricing) ───────────────────────────────────────── */

export interface Plan {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly unit: string;
  readonly description: string;
  readonly includes: readonly string[];
  readonly cta: string;
  readonly highlighted?: boolean;
}

export const PLANS: readonly Plan[] = [
  {
    id: 'proyecto',
    name: 'Proyecto cerrado',
    price: 'Desde $4,900',
    unit: 'USD · alcance fijo',
    description: 'Sabes qué necesitas y quieres una fecha y un precio en firme.',
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
    price: 'Desde $3,200',
    unit: 'USD · por mes',
    description: 'Necesitas capacidad continua y prioridades que cambian cada sprint.',
    includes: [
      'Squad de 2 a 5 personas',
      'Sprints de 2 semanas',
      'Canal directo en Slack',
      'Reporte de avance semanal',
      'Sin permanencia mínima',
    ],
    cta: 'Armar equipo',
    highlighted: true,
  },
  {
    id: 'producto',
    name: 'Producto conjunto',
    price: 'A convenir',
    unit: 'inversión + equity',
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

/* ── Portafolio ─────────────────────────────────────────────────────────── */

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly client: string;
  readonly category: 'Web' | 'Móvil' | 'SaaS' | 'IA';
  readonly year: string;
  readonly summary: string;
  readonly result: string;
  readonly stack: readonly string[];
  readonly preview: PreviewName;
}

export const PROJECT_CATEGORIES = ['Todo', 'Web', 'Móvil', 'SaaS', 'IA'] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECTS: readonly Project[] = [
  {
    id: 'nauta',
    name: 'Nauta ERP',
    client: 'Distribuidora Nauta',
    category: 'SaaS',
    year: '2025',
    summary: 'Sustituimos cinco hojas de cálculo por un ERP con inventario, compras y facturación.',
    result: '−42% en tiempo de facturación',
    stack: ['Laravel', 'Angular', 'PostgreSQL'],
    preview: 'dashboard',
  },
  {
    id: 'meridian',
    name: 'Meridian',
    client: 'Grupo Meridian',
    category: 'Móvil',
    year: '2025',
    summary: 'App de campo para técnicos: órdenes, evidencias y firma del cliente, aun sin señal.',
    result: '3,400 órdenes al mes',
    stack: ['Flutter', 'Firebase', 'Node.js'],
    preview: 'mobile',
  },
  {
    id: 'atlas',
    name: 'Atlas Assist',
    client: 'Aseguradora Atlas',
    category: 'IA',
    year: '2024',
    summary: 'Asistente que responde pólizas y coberturas leyendo la documentación real del cliente.',
    result: '68% de tickets resueltos solo',
    stack: ['Claude', 'pgvector', 'Laravel'],
    preview: 'chat',
  },
  {
    id: 'verde',
    name: 'Verde Market',
    client: 'Cooperativa Verde',
    category: 'Web',
    year: '2024',
    summary: 'Marketplace de productores locales con logística de última milla integrada.',
    result: '×2.1 conversión móvil',
    stack: ['Angular', 'Laravel', 'Stripe'],
    preview: 'store',
  },
  {
    id: 'pulso',
    name: 'Pulso',
    client: 'Clínica Pulso',
    category: 'SaaS',
    year: '2024',
    summary: 'Agenda médica multi-sede con recordatorios automáticos y expediente digital.',
    result: '−31% de citas perdidas',
    stack: ['Laravel', 'Angular', 'Redis'],
    preview: 'calendar',
  },
  {
    id: 'ruta',
    name: 'Ruta Norte',
    client: 'Transportes Ruta Norte',
    category: 'Web',
    year: '2023',
    summary: 'Panel de telemetría y planeación de rutas con seguimiento en vivo de la flotilla.',
    result: '−18% de combustible',
    stack: ['Angular', 'Node.js', 'MapLibre'],
    preview: 'map',
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

/* ── Estadísticas ───────────────────────────────────────────────────────── */

export interface Stat {
  readonly value: number;
  readonly suffix: string;
  readonly prefix: string;
  readonly decimals: number;
  readonly label: string;
  readonly detail: string;
}

export const STATS: readonly Stat[] = [
  { value: 38, suffix: '+', prefix: '', decimals: 0, label: 'Proyectos entregados', detail: 'Desde 2019' },
  { value: 5, suffix: '', prefix: '', decimals: 0, label: 'Productos SaaS propios', detail: 'En la nube' },
  { value: 99.9, suffix: '%', prefix: '', decimals: 1, label: 'Uptime promedio', detail: 'Últimos 12 meses' },
  { value: 4.9, suffix: '/5', prefix: '', decimals: 1, label: 'Satisfacción de clientes', detail: '26 reseñas' },
];

/* ── Clientes (marquesina) ──────────────────────────────────────────────── */

export const CLIENT_LOGOS: readonly string[] = [
  'Nauta',
  'Meridian',
  'Atlas',
  'Verde',
  'Pulso',
  'Ruta Norte',
  'Kanttia',
  'Botaro',
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
    specialty: 'Aplicaciones móviles',
    bio: 'Dirige los proyectos y define la arquitectura. Su terreno es el móvil: apps que aguantan años en producción.',
    skills: ['Flutter', 'Arquitectura', 'Producto'],
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
    bio: 'Construye asistentes, agentes y automatizaciones. Si una tarea es repetitiva, la convierte en un bot.',
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
    bio: 'Construye las APIs, los sistemas SaaS y las plataformas empresariales que sostienen todo lo demás.',
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
    bio: 'Traduce el diseño a interfaces que responden al instante y no se rompen cuando la app crece.',
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

/* ── Testimonios ────────────────────────────────────────────────────────── */

export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  readonly author: string;
  readonly role: string;
  readonly company: string;
  readonly initials: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 't1',
    quote:
      'Llegamos con una hoja de cálculo de doce pestañas y salimos con un sistema que el equipo entiende sin capacitación. La diferencia se notó el primer mes.',
    author: 'Daniela Ortiz',
    role: 'Directora de Operaciones',
    company: 'Distribuidora Nauta',
    initials: 'DO',
  },
  {
    id: 't2',
    quote:
      'La app de campo funciona sin señal, que era justo lo que ningún proveedor anterior había resuelto. Nuestros técnicos dejaron de cargar papel.',
    author: 'Rubén Salas',
    role: 'Gerente de Servicio',
    company: 'Grupo Meridian',
    initials: 'RS',
  },
  {
    id: 't3',
    quote:
      'El asistente contesta con nuestras pólizas reales, no con inventos. Bajamos la carga del call center sin perder el trato humano cuando hace falta.',
    author: 'Marcela Ruiz',
    role: 'Head de Experiencia',
    company: 'Aseguradora Atlas',
    initials: 'MR',
  },
  {
    id: 't4',
    quote:
      'Trabajan como si el producto fuera suyo. Cada quince días había algo funcionando que podíamos tocar, no una presentación.',
    author: 'Iván Peña',
    role: 'Fundador',
    company: 'Cooperativa Verde',
    initials: 'IP',
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
      'Depende del alcance, pero no te dejamos con esa respuesta: en la primera llamada acotamos el problema y en menos de una semana recibes una estimación por rangos con supuestos explícitos. Un MVP suele arrancar en 4,900 USD y un producto SaaS completo se planea por fases.',
  },
  {
    question: '¿Cuánto tarda un proyecto típico?',
    answer:
      'Un MVP funcional toma entre 8 y 12 semanas. Una app móvil publicada en tiendas, entre 10 y 16. Trabajamos en sprints de dos semanas con demo al final de cada uno, así que ves avance real desde la semana dos.',
  },
  {
    question: '¿El código es mío?',
    answer:
      'Sí. Todo el código vive en tu repositorio desde el primer commit y la propiedad intelectual es tuya al cierre del contrato. También te entregamos la documentación técnica y los accesos de infraestructura.',
  },
  {
    question: '¿Trabajan con equipos internos?',
    answer:
      'Con frecuencia. Podemos integrarnos a tu equipo como squad, tomar un módulo completo o acompañar a tus desarrolladores en arquitectura y revisión de código.',
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
      { label: 'Aplicaciones web', href: '#servicios' },
      { label: 'Aplicaciones móviles', href: '#servicios' },
      { label: 'Sistemas SaaS', href: '#servicios' },
      { label: 'ChatBots e IA', href: '#servicios' },
      { label: 'Automatización', href: '#servicios' },
      { label: 'Software a medida', href: '#servicios' },
    ],
  },
  {
    title: 'Estudio',
    links: [
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'Equipo', href: '#equipo' },
      { label: 'Proceso', href: '#proceso' },
      { label: 'Portafolio', href: '#portafolio' },
    ],
  },
  {
    title: 'Productos',
    links: [
      { label: 'Botaro', href: '#productos' },
      { label: 'Kanttia', href: '#productos' },
      { label: 'Flujo', href: '#productos' },
      { label: 'Modelos de trabajo', href: '#modelos' },
    ],
  },
];

export const SOCIAL_LINKS: readonly { label: string; href: string; icon: IconName }[] = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'linkedin' },
  { label: 'X', href: 'https://x.com/', icon: 'x' },
];

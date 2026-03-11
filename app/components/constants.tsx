export const C = {
  white: '#ffffff',
  offWhite: '#f8f9fb',
  gold: '#e7a73f',
  goldLight: '#fdf3e0',
  goldDark: '#c8882a',
  blue: '#2b7bb8',
  blueLight: '#e8f2fb',
  blueDark: '#1a4f78',
  text: '#1a2332',
  textMid: '#4a5568',
  textLight: '#8a9ab0',
  border: '#e2e8f0',
  dark: '#0d1520',
} as const

// categories: images[] = rutas en /public/ (solo para Materia Prima y Bouquets)
export const categories = [
  { name: 'Jabones',        count: 7,  emoji: '🧴' },
  { name: 'Suavizantes',    count: 3,  emoji: '🌸' },
  { name: 'Detergentes',    count: 3,  emoji: '🧼' },
  { name: 'Desengrasantes', count: 8,  emoji: '🧹' },
  { name: 'Desinfectantes', count: 9,  emoji: '🦠' },
  { name: 'Pisos',          count: 4,  emoji: '🏠' },
  { name: 'Piletas',        count: 7,  emoji: '🏊' },
  { name: 'Automotor',      count: 4,  emoji: '🚗' },
  { name: 'Hogar',          count: 5,  emoji: '🏡' },
  { name: 'Concentrados',   count: 10, emoji: '🔬' },
  { name: 'Materia Prima',  count: 20, emoji: '⚗️' },
  { name: 'Bouquets',       count: 21, emoji: '🌺' },
  { name: 'Contenedores',   count: 6,  emoji: '📦' },
] as const

export type Category = typeof categories[number]

export const products: {
  id: number; name: string; category: string; desc?: string; emoji?: string; color?: string; color2?: string; tag?: string
}[] = [
  // ── Jabones ──────────────────────────────────────────────────────────────────
  { id: 101, category: 'Jabones', name: 'Jabón tipo Ariel',            color: '#4caf50' },
  { id: 102, category: 'Jabones', name: 'Jabón tipo Skip',             color: '#1976d2' },
  { id: 103, category: 'Jabones', name: 'Jabón tipo Ala',              color: '#4fc3f7' },
  { id: 104, category: 'Jabones', name: 'Jabón tipo Ace',              color: '#7b1fa2' },
  { id: 105, category: 'Jabones', name: 'Ala Nelson (doble perfume)',  color: '#c2185b' },
  { id: 106, category: 'Jabones', name: 'Ariel Nelson (doble perfume)',color: '#2e7d32' },
  { id: 107, category: 'Jabones', name: 'Camellito (baja espuma)',     color: '#f9a825' },

  // ── Suavizantes ───────────────────────────────────────────────────────────────
  { id: 151, category: 'Suavizantes', name: 'Suavizante Comfort',  color: '#f06292' },
  { id: 152, category: 'Suavizantes', name: 'Suavizante Vivere',   color: '#42a5f5' },
  { id: 153, category: 'Suavizantes', name: 'Suavizante Downy',    color: '#fdd835' },

  // ── Detergentes ───────────────────────────────────────────────────────────────
  { id: 201, category: 'Detergentes', name: 'Detergente 10%',               color: '#f9a825' },
  { id: 202, category: 'Detergentes', name: 'Detergente 15% tipo Magistral', color: '#1976d2' },
  { id: 203, category: 'Detergentes', name: 'Detergente 20%',               color: '#2e7d32' },

  // ── Desengrasantes ────────────────────────────────────────────────────────────
  { id: 301, category: 'Desengrasantes', name: 'Desengrasante Mr. Músculo Naranja', color: '#ef6c00' },
  { id: 302, category: 'Desengrasantes', name: 'Desengrasante amoniacal limón 1+2', color: '#fdd835' },
  { id: 303, category: 'Desengrasantes', name: 'Desengrasante tipo Rapi Plus',      color: '#e53935' },
  { id: 304, category: 'Desengrasantes', name: 'Destapa-cañería',                   color: '#546e7a' },
  { id: 305, category: 'Desengrasantes', name: 'Desincrustante / Quitasarro',       color: '#d4a843' },
  { id: 306, category: 'Desengrasantes', name: 'Desengrasante MECASYL',             color: '#81d4fa' },
  { id: 307, category: 'Desengrasantes', name: 'Desengrasante Sérpico',             color: '#00897b' },
  { id: 308, category: 'Desengrasantes', name: 'Desengrasante 2 fases',             color2: '#1565c0', color: '#e53935' },

  // ── Desinfectantes ────────────────────────────────────────────────────────────
  { id: 401, category: 'Desinfectantes', name: 'Hipoclorito de sodio 10%',          color: '#fff176' },
  { id: 402, category: 'Desinfectantes', name: 'Lavandina en gel',                  color: '#fffde7' },
  { id: 403, category: 'Desinfectantes', name: 'Alcohol Sanitizante 70/30 x 5lts', color: '#b0bec5' },
  { id: 404, category: 'Desinfectantes', name: 'Alcohol 96° x 5lts',               color: '#eceff1' },
  { id: 405, category: 'Desinfectantes', name: 'Lavandina',                         color: '#fff9c4' },
  { id: 406, category: 'Desinfectantes', name: 'Creolina',                          color: '#4e342e' },
  { id: 407, category: 'Desinfectantes', name: 'K-otrina 1+49',                     color: '#fafafa' },
  { id: 408, category: 'Desinfectantes', name: 'Insecticida Ecológico FLY',         color: '#558b2f' },
  { id: 409, category: 'Desinfectantes', name: 'Disgregantes p/baños químicos',     color: '#6a1f6a' },

  // ── Pisos ─────────────────────────────────────────────────────────────────────
  { id: 501, category: 'Pisos', name: 'Cera auto brillo incolora 1+2',         color: '#f5f5f5' },
  { id: 502, category: 'Pisos', name: 'Cera auto brillo roja / negra 1+2',     color: '#b71c1c', color2: '#212121' },
  { id: 503, category: 'Pisos', name: 'Acondicionador de pisos LIMÓN-LAVANDA 1+2', color: '#fdd835' },
  { id: 504, category: 'Pisos', name: 'Secuestrante de polvo tipo CERAMICOL',  color: '#bcaaa4' },

  // ── Piletas ───────────────────────────────────────────────────────────────────
  { id: 601, category: 'Piletas', name: 'Cloro líquido',                 color: '#b3e5fc' },
  { id: 602, category: 'Piletas', name: 'Alguicida',                     color: '#00897b' },
  { id: 603, category: 'Piletas', name: 'Clarificante',                  color: '#29b6f6' },
  { id: 604, category: 'Piletas', name: 'Pastillas Multi 200gr por kg',  color: '#fdd835' },
  { id: 605, category: 'Piletas', name: 'Pastillas Multi 50gr por kilo', color: '#ffee58' },
  { id: 606, category: 'Piletas', name: 'Cloro en polvo disolución',     color: '#eeeeee' },
  { id: 607, category: 'Piletas', name: 'Regulador de Ph',               color: '#ab47bc' },

  // ── Automotor ─────────────────────────────────────────────────────────────────
  { id: 701, category: 'Automotor', name: 'Silicona Eco',                                    color: '#fff176' },
  { id: 702, category: 'Automotor', name: 'Shampoo Siliconado',                              color: '#81d4fa' },
  { id: 703, category: 'Automotor', name: 'Revividor de Caucho Premium',  color: '#1e88e5' },
  { id: 7031, category: 'Automotor', name: 'Limpia Tapizado 1+4',            color: '#fafafa' },
  { id: 704, category: 'Automotor', name: 'Espuma activa',                                   color: '#f48fb1' },

  // ── Hogar ─────────────────────────────────────────────────────────────────────
  { id: 801, category: 'Hogar', name: 'Esencia de piso concentrado 1+49',     color: '#f8bbd0' },
  { id: 802, category: 'Hogar', name: 'Jabón líquido p/manos',                color: '#ffe082' },
  { id: 803, category: 'Hogar', name: 'Ropa color / Ropa blanca',             color2: '#eeeeee', color: '#7986cb' },
  { id: 804, category: 'Hogar', name: 'Prelavado / Quitamanchas tipo TRENET', color: '#fff176' },
  { id: 805, category: 'Hogar', name: 'Perfuminas Vivere, Comfort y otros',   color: '#ce93d8' },

  // ── Concentrados ──────────────────────────────────────────────────────────────
  { id: 901, category: 'Concentrados', name: 'KIT Jabón líquido tipo SKIP-ARIEL-ALA-ACE', color: '#42a5f5' },
  { id: 902, category: 'Concentrados', name: 'KIT Suavizante tipo VIVERE-COMFORT',        color: '#f06292' },
  { id: 903, category: 'Concentrados', name: 'PASTA PREFORMULADA Jabón líquido',          color: '#ffe082' },
  { id: 904, category: 'Concentrados', name: 'Mr Músculo concentrado 1+9',                color: '#ef6c00' },
  { id: 905, category: 'Concentrados', name: 'Esencias concentradas para piso 1+49',      color: '#ce93d8' },
  { id: 906, category: 'Concentrados', name: 'Limpia vidrios concentrado 1+9',            color: '#80deea' },
  { id: 907, category: 'Concentrados', name: 'Limpia tapizado 1+4',                       color: '#bcaaa4' },
  { id: 908, category: 'Concentrados', name: 'Desengrasante amoniacal limón 1+2',         color: '#fdd835' },
  { id: 909, category: 'Concentrados', name: 'K-otrina concentrado 1+49',                 color: '#fafafa' },
  { id: 910, category: 'Concentrados', name: 'Creolina 1+39',                             color: '#4e342e' },

  // ── Contenedores ──────────────────────────────────────────────────────────────
  { id: 1001, category: 'Contenedores', name: 'Botellas 1 L',      color: '#90caf9' },
  { id: 1002, category: 'Contenedores', name: 'Bidones 5 lts',     color: '#42a5f5' },
  { id: 1003, category: 'Contenedores', name: 'Bidones 20 lts',    color: '#1e88e5' },
  { id: 1004, category: 'Contenedores', name: 'Cuñetes 50 lts',    color: '#1565c0' },
  { id: 1005, category: 'Contenedores', name: 'Tambores 170 lts',  color: '#5c6bc0' },
  { id: 1006, category: 'Contenedores', name: 'Tambores 200 lts',  color: '#3949ab' },
  { id: 1007, category: 'Contenedores', name: 'Bin 1000 lts',      color: '#263238' },
  // ── Materia Prima (USD) ───────────────────────────────────────────────────────
  { id: 1101, category: 'Materia Prima', name: 'Lauril',       color: '#dfdfdfb0' },
  { id: 1103, category: 'Materia Prima', name: 'CMC',                      color: '#e6e3e3' },
  { id: 1105, category: 'Materia Prima', name: 'HPMC',           color: '#ecebeb'  },
  { id: 1106, category: 'Materia Prima', name: 'Sulfónico',                 emoji: '⚗️' },
  { id: 1107, category: 'Materia Prima', name: 'Nacarante',                 emoji: '✨' },
  { id: 1109, category: 'Materia Prima', name: 'Agua amoniacal',            emoji: '💧' },
  { id: 1110, category: 'Materia Prima', name: 'Nonil',                     emoji: '🧪' },
  { id: 1111, category: 'Materia Prima', name: 'Formol',                    emoji: '⚗️' },
  { id: 1112, category: 'Materia Prima', name: 'Butil',                     emoji: '🧪' },
  { id: 1113, category: 'Materia Prima', name: 'Glicerina',                 emoji: '💧' },
  { id: 1114, category: 'Materia Prima', name: 'Trietanolamina',            emoji: '🔬' },
  { id: 1115, category: 'Materia Prima', name: 'Aceite fenolado',           emoji: '🛡️' },
  { id: 1116, category: 'Materia Prima', name: 'Alcohol isopropílico',      emoji: '🧴' },
  { id: 1117, category: 'Materia Prima', name: 'Alcohol cetílico',          emoji: '🧴' },
  { id: 1118, category: 'Materia Prima', name: 'Base de cera - Polímero',   emoji: '✨' },
  // ── Materia Prima (ARS) ───────────────────────────────────────────────────────
  { id: 1119, category: 'Materia Prima', name: 'Sal x 25 kg',               emoji: '🧂' },
  { id: 1120, category: 'Materia Prima', name: 'Bicarbonato',               emoji: '⚪' },
  // ── Bouquets ──────────────────────────────────────────────────────────────────
  { id: 1201, category: 'Bouquets', name: 'Vivere',        emoji: '🌸' },
  { id: 1202, category: 'Bouquets', name: 'Pino',          emoji: '🌲' },
  { id: 1203, category: 'Bouquets', name: 'Espadol',       emoji: '🌿' },
  { id: 1204, category: 'Bouquets', name: 'Ace',           emoji: '🌼' },
  { id: 1205, category: 'Bouquets', name: 'Colonia',       emoji: '💐' },
  { id: 1206, category: 'Bouquets', name: 'Limón',         emoji: '🍋' },
  { id: 1207, category: 'Bouquets', name: 'Primavera',     emoji: '🌺' },
  { id: 1208, category: 'Bouquets', name: 'Arpege',        emoji: '🌷' },
  { id: 1209, category: 'Bouquets', name: 'Skip',          emoji: '💙' },
  { id: 1210, category: 'Bouquets', name: 'Ala',           emoji: '🌀' },
  { id: 1211, category: 'Bouquets', name: 'Ariel',         emoji: '🌊' },
  { id: 1212, category: 'Bouquets', name: 'Marino',        emoji: '⚓' },
  { id: 1213, category: 'Bouquets', name: 'Cherry',        emoji: '🍒' },
  { id: 1214, category: 'Bouquets', name: 'Sandía',        emoji: '🍉' },
  { id: 1215, category: 'Bouquets', name: 'Coco',          emoji: '🥥' },
  { id: 1216, category: 'Bouquets', name: 'Frutos Verdes', color: '🍏' },
  { id: 1217, category: 'Bouquets', name: 'Lavanda',       emoji: '💜' },
  { id: 1218, category: 'Bouquets', name: 'Lysoform',      emoji: '🏥' },
  { id: 1219, category: 'Bouquets', name: 'Citronela',     emoji: '🌿' },
  { id: 1220, category: 'Bouquets', name: 'Comfort',       emoji: '🌸' },
  { id: 1221, category: 'Bouquets', name: 'Downy',         emoji: '🌼' },
]

export const stats = [
  { value: 5,    suffix: '+', label: 'Años de experiencia' },
  { value: 100,   suffix: '+', label: 'Productos disponibles' },
  { value: 1000, suffix: '+', label: 'Clientes activos'     },
  { display: 'check',         label: 'Entregas en todo el país' },
]

// appended products for Materia Prima and Bouquets
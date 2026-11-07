export const DEFAULT_EVENT = {
  slug: "alex-paloma-2026",
  coupleNames: "Alex & Paloma",
  eventDate: "2026-12-20",
  startsAtLocal: "17:30",
  timezone: "America/Sao_Paulo",
  venueName: "BuGú Delícias",
  venueAddress:
    "Setor J Norte, QNJ 32, Lote 38, Taguatinga, Brasília, DF, CEP 72140-300",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=BuG%C3%BA%20Del%C3%ADcias%20Taguatinga%20Bras%C3%ADlia",
  dressCode: {
    title: "Coquetel elegante",
    subtitle:
      "Queremos um encontro bonito, elegante e, acima de tudo, confortável.",
    palette: ["vinho", "rosé", "terracota", "mostarda", "oliva", "sálvia", "lilás", "azul céu"],
    notes: [
      "Prefira roupas leves, fluidas e confortáveis.",
      "Estampas delicadas e cores suaves são muito bem-vindas.",
      "Evite o uso de preto e branco.",
    ],
  },
  rsvpDeadline: "2026-12-05",
  publicEnabled: true,
  calendarDurationHours: 6,
  addressVerified: false,
};

export type PublicEvent = typeof DEFAULT_EVENT;

export function publicLocationLine(event: PublicEvent) {
  return `${event.venueName}, Taguatinga, Brasília/DF`;
}

export function formatRsvpDeadline(deadline: string | null | undefined) {
  if (!deadline) return null;
  const day = deadline.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  return new Date(`${day}T12:00:00-03:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
  });
}

export function rsvpDeadlinePassed(deadline: string | null | undefined, now = new Date()) {
  if (!deadline) return false;
  const day = deadline.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const end = new Date(`${day}T23:59:59.999-03:00`);
  return now.getTime() > end.getTime();
}

export const WEDDING_ASSETS = {
  embrace: "/assets/wedding/couple-embrace.jpg",
  dance: "/assets/wedding/couple-dance.png",
  family: "/assets/wedding/family-portrait.png",
  saveTheDate: "/assets/wedding/save-the-date.jpg",
} as const;

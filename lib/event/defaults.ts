export const DEFAULT_EVENT = {
  slug: "alex-paloma-2026",
  coupleNames: "Alex & Paloma",
  eventDate: "2026-12-20",
  startsAtLocal: "17:00",
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
  rsvpDeadline: null as string | null,
  publicEnabled: true,
  calendarDurationHours: 6,
  addressVerified: false,
};

export type PublicEvent = typeof DEFAULT_EVENT;

export function publicLocationLine(event: PublicEvent) {
  return `${event.venueName}, Taguatinga, Brasília/DF`;
}

export const WEDDING_ASSETS = {
  embrace: "/assets/wedding/couple-embrace.jpg",
  dance: "/assets/wedding/couple-dance.png",
  family: "/assets/wedding/family-portrait.png",
  saveTheDate: "/assets/wedding/save-the-date.jpg",
} as const;

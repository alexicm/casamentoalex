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
    "https://www.google.com/maps/search/?api=1&query=BuG%C3%BA%20Del%C3%ADcias%20St.%20J%20Norte%20QNJ%2032%20Lote%2038%20Taguatinga%20Bras%C3%ADlia",
  dressCode: {
    title: "Coquetel elegante",
    subtitle:
      "Um visual bonito, leve e confortável para celebrar com a gente.",
    palette: ["oliva", "sálvia", "terracota", "rosé", "vinho", "tons terrosos"],
    notes: [
      "Se possível, deixe o branco, off-white e marfim para a noiva.",
      "Escolha um look em que você se sinta bem para aproveitar cada momento.",
    ],
  },
  rsvpDeadline: null as string | null,
  publicEnabled: true,
  calendarDurationHours: 6,
};

export type PublicEvent = typeof DEFAULT_EVENT;

export const WEDDING_ASSETS = {
  embrace: "/assets/wedding/couple-embrace.jpg",
  dance: "/assets/wedding/couple-dance.jpg",
  saveTheDate: "/assets/wedding/save-the-date.jpg",
} as const;

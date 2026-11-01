export const EVENT_SLUG = "alex-paloma-2026";

export const EXCLUDED_ALEX_NAMES = [
  "Gabriel Rodrigues",
  "Bárbara",
  "Gabriel Coringa",
  "Suellen",
  "Galdino",
  "Beatriz",
  "Marcos Carvalho",
  "Gabriela Kei",
  "Agnes Kaori",
  "Calebe",
  "Cristina",
  "Gustavo",
  "Vitinho",
  "Amanda",
] as const;

export type SeedGuest = {
  seedKey: string;
  groupOwner: "Alex" | "Paloma";
  displayName: string;
  officialStatus: "manually_confirmed" | "awaiting_response";
  confirmationSource: "import";
  notes?: string;
};

export const PALOMA_GUESTS: SeedGuest[] = [
  { seedKey: "paloma-sandra", groupOwner: "Paloma", displayName: "Sandra Verbenia", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-claudio", groupOwner: "Paloma", displayName: "Cláudio Abreu", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-pericles", groupOwner: "Paloma", displayName: "Péricles Abreu", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-hugo", groupOwner: "Paloma", displayName: "Hugo Abreu", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-carolina-a", groupOwner: "Paloma", displayName: "Carolina Abreu", officialStatus: "manually_confirmed", confirmationSource: "import", notes: "Registro A. Distinta de Carolina Fonseca." },
  { seedKey: "paloma-sergio", groupOwner: "Paloma", displayName: "Sérgio", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-bruna", groupOwner: "Paloma", displayName: "Bruna Aguiar", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-guilherme", groupOwner: "Paloma", displayName: "Guilherme Silqueira", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-paula", groupOwner: "Paloma", displayName: "Paula Laryssa", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-lucas", groupOwner: "Paloma", displayName: "Lucas Teodoro", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-gessica", groupOwner: "Paloma", displayName: "Gessica Maria", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-leonardo", groupOwner: "Paloma", displayName: "Leonardo Campos", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-heloisa", groupOwner: "Paloma", displayName: "Heloísa Noleto", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-joao-victor", groupOwner: "Paloma", displayName: "João Victor", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-diovanna", groupOwner: "Paloma", displayName: "Diovanna", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-carolina-b", groupOwner: "Paloma", displayName: "Carolina Fonseca", officialStatus: "manually_confirmed", confirmationSource: "import", notes: "Registro B. Distinta de Carolina Abreu." },
  { seedKey: "paloma-jian", groupOwner: "Paloma", displayName: "Jian", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-edson", groupOwner: "Paloma", displayName: "Édson Siqueira", officialStatus: "manually_confirmed", confirmationSource: "import" },
  { seedKey: "paloma-suellen", groupOwner: "Paloma", displayName: "Suellen Vale", officialStatus: "manually_confirmed", confirmationSource: "import" },
];

export const ALEX_GUESTS: SeedGuest[] = [
  { seedKey: "alex-tania", groupOwner: "Alex", displayName: "Tânia Rodrigues", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-simone", groupOwner: "Alex", displayName: "Simone Rodrigues", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-alberto", groupOwner: "Alex", displayName: "Alberto Rodrigues", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-thaynara", groupOwner: "Alex", displayName: "Thaynara Rodrigues", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-franciele", groupOwner: "Alex", displayName: "Franciele Rodrigues", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-thanyele", groupOwner: "Alex", displayName: "Thanyele Rodrigues", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-victor", groupOwner: "Alex", displayName: "Victor Luiz", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-joao-miranda", groupOwner: "Alex", displayName: "João Miranda", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-victoria", groupOwner: "Alex", displayName: "Victoria Silva", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-ana-paula", groupOwner: "Alex", displayName: "Ana Paula", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-alan", groupOwner: "Alex", displayName: "Alan", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-jorge", groupOwner: "Alex", displayName: "Jorge Luís", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-elisa", groupOwner: "Alex", displayName: "Elisa Andrade", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-matheus-carolino", groupOwner: "Alex", displayName: "Matheus Carolino", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-ban", groupOwner: "Alex", displayName: "Ban Vasten", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-william", groupOwner: "Alex", displayName: "William Rezende", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-clerio", groupOwner: "Alex", displayName: "Clério Rodrigo", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-thais", groupOwner: "Alex", displayName: "Thais Silva", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-markin", groupOwner: "Alex", displayName: "Marcos Araújo", officialStatus: "awaiting_response", confirmationSource: "import", notes: "Corrigido de Markin." },
  { seedKey: "alex-sara", groupOwner: "Alex", displayName: "Sara Soyane", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-domingos", groupOwner: "Alex", displayName: "Domingos Streithorst", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-jessica", groupOwner: "Alex", displayName: "Jessica Rocha", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-alexandre", groupOwner: "Alex", displayName: "Alexandre Alves", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-carol", groupOwner: "Alex", displayName: "Carolina Seidner", officialStatus: "awaiting_response", confirmationSource: "import", notes: "Corrigido de Carol. Distinta das Carolinas da Paloma." },
  { seedKey: "alex-joao", groupOwner: "Alex", displayName: "João Victor Freitas", officialStatus: "awaiting_response", confirmationSource: "import", notes: "Corrigido de João. Distinto de João Victor (Paloma) e João Miranda." },
  { seedKey: "alex-diogo", groupOwner: "Alex", displayName: "Diogo Hideaki", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-tiago", groupOwner: "Alex", displayName: "Tiago Marques", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-nathalia-evangelista", groupOwner: "Alex", displayName: "Nathalia Evangelista", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-daniel", groupOwner: "Alex", displayName: "Daniel", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-pedro", groupOwner: "Alex", displayName: "Pedro", officialStatus: "awaiting_response", confirmationSource: "import" },
  { seedKey: "alex-nicolas-braga", groupOwner: "Alex", displayName: "Nicolas Braga", officialStatus: "awaiting_response", confirmationSource: "import" },
];

export const ALL_SEED_GUESTS: SeedGuest[] = [...PALOMA_GUESTS, ...ALEX_GUESTS];

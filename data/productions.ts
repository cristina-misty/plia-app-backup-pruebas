// Mock data for recent productions cards
// Place shared app-wide data here to keep components clean and reusable.

export type SeiesCardProps = {
  title: string;
  type: string;
  production?: string;
  date?: string;
  status?: string;
  crew?: number;
  locations?: number;
};

export const recentSeriesMock: SeiesCardProps[] = [
  {
    title: "Tech Innovation Documentary",
    type: "documentary",
    production: "Discovery Networks",
    date: "Mar 1, 2025",
    status: "planning",
    crew: 6,
    locations: 8,
  },
  {
    title: "Kraken 2025 V3",
    type: "feature film",
    production: "Isla",
    date: "Aug 31, 2025",
    status: "pre production",
    crew: 12,
    locations: 4,
  },
  {
    title: "Baby Doll",
    type: "short film",
    production: "Clapperboard UK",
    date: "Aug 31, 2025",
    status: "in production",
    crew: 8,
    locations: 2,
  },
];

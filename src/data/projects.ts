import alomraneData from './alomrane_projects.json';

export interface Project {
  id: string;
  title: string;
  city: string;
  region?: string;
  description?: string;
  type: 'appartement' | 'maison' | 'villa';
  /** Prix d'entrée réel (fiche Al Omrane) — ne pas confondre avec plafond 700k */
  priceMin?: number;
  priceMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  url: string;
  imageUrl?: string | null;
  imageColor: string;
}

/** Projets exemple (fallback si JSON vide) */
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Résidence Ibn Khaldoun – Tranche 3',
    city: 'Tanger',
    type: 'appartement',
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-tanger-tetouan-al-hoceima/Produits/Projets/Residence-ibn-khaldoun-tranche-3-a',
    imageColor: '#005C9E',
  },
  {
    id: '2',
    title: 'Logements Essalam',
    city: 'Tarfaya',
    type: 'appartement',
    priceMin: 330000,
    priceMax: 420000,
    surfaceMin: 54,
    surfaceMax: 74,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-al-janoub/Produits/Projets/Logements-essalam',
    imageColor: '#0D9488',
  },
];

/** Projets Al Omrane importés (JSON), ou exemples si vide. */
export function getProjects(): Project[] {
  const data = alomraneData as { projects?: Project[] };
  if (data && Array.isArray(data.projects) && data.projects.length > 0) {
    return data.projects;
  }
  return SAMPLE_PROJECTS;
}

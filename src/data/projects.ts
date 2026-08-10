import alomraneData from './alomrane_projects.json';

export interface Project {
  id: string;
  title: string;
  city: string;
  region?: string;
  description: string;
  type: 'appartement' | 'maison' | 'villa';
  priceMax?: number;
  url: string;
  imageColor: string;
}

/** Projets exemple (fallback si JSON vide) */
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Résidence Ibn Khaldoun – Tranche 3',
    city: 'Tanger',
    description: 'Appartements modernes éligibles à l’aide au logement.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-tanger-tetouan-al-hoceima/Produits/Projets/Residence-ibn-khaldoun-tranche-3-a',
    imageColor: '#005C9E',
  },
  {
    id: '2',
    title: 'Logements Essalam',
    city: 'Tarfaya',
    description: 'Projet résidentiel Essalam. Commercialisation en cours.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-al-janoub/Produits/Projets/Logements-essalam',
    imageColor: '#0D9488',
  },
  {
    id: '3',
    title: 'Résidence Assafae',
    city: 'Safi',
    description: 'Appartements destinés à la résidence principale.',
    type: 'appartement',
    priceMax: 650000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets',
    imageColor: '#1E40AF',
  },
  {
    id: '4',
    title: 'Complexe résidentiel – Classe moyenne',
    city: 'Rabat',
    description: 'Logements compatibles avec les dispositifs d’aide de l’État.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000',
    imageColor: '#0F766E',
  },
  {
    id: '5',
    title: 'Résidence Al Amal',
    city: 'Marrakech',
    description: 'Projet habitat – vérifier le prix exact sur la fiche Al Omrane.',
    type: 'appartement',
    priceMax: 580000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets',
    imageColor: '#003D6B',
  },
  {
    id: '6',
    title: 'Villas semi-finies – Accès aide',
    city: 'Agadir',
    description: 'Offre villa dans le plafond d’aide au logement.',
    type: 'villa',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000',
    imageColor: '#14B8A6',
  },
  {
    id: '7',
    title: 'Résidence Nour',
    city: 'Fès',
    description: 'Appartements familiaux adaptés au programme d’aide directe.',
    type: 'appartement',
    priceMax: 620000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets',
    imageColor: '#0369A1',
  },
  {
    id: '8',
    title: 'Logements sociaux – Tranche récente',
    city: 'Casablanca',
    description: 'Unités destinées aux primo-accédants.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000',
    imageColor: '#0D9488',
  },
  {
    id: '9',
    title: 'Maison individuelle – Habitat',
    city: 'Kénitra',
    description: 'Maisons individuelles Al Omrane – éligibilité selon prix TTC.',
    type: 'maison',
    priceMax: 690000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets',
    imageColor: '#1E3A5F',
  },
  {
    id: '10',
    title: 'Résidence Al Manar',
    city: 'Oujda',
    description: 'Projet résidentiel – consultez la fiche pour le prix exact.',
    type: 'appartement',
    priceMax: 550000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000',
    imageColor: '#005C9E',
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

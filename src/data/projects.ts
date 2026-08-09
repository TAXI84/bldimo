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

/** Projets habitat uniquement. URL = fiche Al Omrane quand connue. */
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
    description: 'Projet résidentiel Essalam. Idéal primo-accédants.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-al-janoub/Produits/Projets/Logements-essalam',
    imageColor: '#0D9488',
  },
  {
    id: '3',
    title: 'Complexe résidentiel Ibn Khaldoun',
    city: 'Tanger',
    description: 'Résidence habitat, place centrale.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-tanger-tetouan-al-hoceima/Produits/Projets/Complexe-residentiel-ibn-khaldoun',
    imageColor: '#1E40AF',
  },
  {
    id: '4',
    title: 'Lotissement Al Manar (habitat)',
    city: 'Région Sud',
    description: 'Lots habitat uniquement (pas commerce).',
    type: 'maison',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-al-janoub/Produits/Projets/Lotissement-al-manar',
    imageColor: '#0F766E',
  },
  {
    id: '5',
    title: 'Résidence Assafae',
    city: 'Safi',
    description: 'Appartements, résidence principale.',
    type: 'appartement',
    priceMax: 650000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000&text=Assafae',
    imageColor: '#003D6B',
  },
  {
    id: '6',
    title: 'Logements habitat – Agadir',
    city: 'Agadir',
    description: 'Habitat dans le plafond d’aide. Pas de commerce.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000&text=Agadir',
    imageColor: '#14B8A6',
  },
  {
    id: '7',
    title: 'Résidence Nour',
    city: 'Fès',
    description: 'Appartements familiaux, min. 2 pièces.',
    type: 'appartement',
    priceMax: 620000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000&text=Fes',
    imageColor: '#0369A1',
  },
  {
    id: '8',
    title: 'Logements – Casablanca',
    city: 'Casablanca',
    description: 'Unités habitat uniquement.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000&text=Casablanca',
    imageColor: '#0D9488',
  },
  {
    id: '9',
    title: 'Maisons individuelles – Kénitra',
    city: 'Kénitra',
    description: 'Maisons individuelles (habitat).',
    type: 'maison',
    priceMax: 690000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000&text=Kenitra',
    imageColor: '#1E3A5F',
  },
  {
    id: '10',
    title: 'Résidence – Oujda',
    city: 'Oujda',
    description: 'Projet résidentiel. Habitat, pas commerce.',
    type: 'appartement',
    priceMax: 550000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000&text=Oujda',
    imageColor: '#005C9E',
  },
];

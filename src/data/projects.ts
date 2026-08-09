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

/** Projets exemple (style Al Omrane, ≤ 700 000 DH, habitat uniquement) */
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Résidence Ibn Khaldoun – Tranche 3',
    city: 'Tanger',
    region: 'Tanger-Tétouan-Al Hoceima',
    description: 'Appartements modernes éligibles à l’aide au logement. Architecture contemporaine et espaces de vie confortables.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-tanger-tetouan-al-hoceima/Produits/Projets/Residence-ibn-khaldoun-tranche-3-a',
    imageColor: '#005C9E',
  },
  {
    id: '2',
    title: 'Logements Essalam',
    city: 'Tarfaya',
    region: 'Laâyoune-Sakia El Hamra',
    description: 'Projet résidentiel Essalam. Commercialisation en cours. Idéal pour primo-accédants.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-al-janoub/Produits/Projets/Logements-essalam',
    imageColor: '#0D9488',
  },
  {
    id: '3',
    title: 'Résidence Assafae',
    city: 'Safi',
    region: 'Marrakech-Safi',
    description: 'Appartements dotés d’une architecture moderne, destinés à la résidence principale.',
    type: 'appartement',
    priceMax: 650000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets',
    imageColor: '#1E40AF',
  },
  {
    id: '4',
    title: 'Complexe résidentiel – Classe moyenne',
    city: 'Rabat',
    region: 'Rabat-Salé-Kénitra',
    description: 'Logements orientés accession à la propriété, compatibles avec les dispositifs d’aide de l’État.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000',
    imageColor: '#0F766E',
  },
  {
    id: '5',
    title: 'Résidence Al Amal',
    city: 'Marrakech',
    region: 'Marrakech-Safi',
    description: 'Projet habitat en zone accessible. Vérifier l’éligibilité Daam Sakan selon le prix exact de l’unité.',
    type: 'appartement',
    priceMax: 580000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets',
    imageColor: '#003D6B',
  },
  {
    id: '6',
    title: 'Villas semi-finies – Accès aide',
    city: 'Agadir',
    region: 'Souss-Massa',
    description: 'Offre villa dans le plafond d’aide au logement. Contactez Al Omrane pour les lots disponibles.',
    type: 'villa',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000',
    imageColor: '#14B8A6',
  },
  {
    id: '7',
    title: 'Résidence Nour',
    city: 'Fès',
    region: 'Fès-Meknès',
    description: 'Appartements familiaux, minimum 2 pièces, adaptés au programme d’aide directe.',
    type: 'appartement',
    priceMax: 620000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets',
    imageColor: '#0369A1',
  },
  {
    id: '8',
    title: 'Logements sociaux – Tranche récente',
    city: 'Casablanca',
    region: 'Casablanca-Settat',
    description: 'Unités destinées aux primo-accédants. Prix à confirmer sur la fiche Al Omrane.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000',
    imageColor: '#0D9488',
  },
  {
    id: '9',
    title: 'Maison individuelle – Habitat',
    city: 'Kénitra',
    region: 'Rabat-Salé-Kénitra',
    description: 'Maisons individuelles dans le cadre des programmes Al Omrane. Éligibilité selon prix TTC.',
    type: 'maison',
    priceMax: 690000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets',
    imageColor: '#1E3A5F',
  },
  {
    id: '10',
    title: 'Résidence Al Manar',
    city: 'Oujda',
    region: 'Oriental',
    description: 'Projet résidentiel en Orient. Consultez la fiche pour les disponibilités et le prix exact.',
    type: 'appartement',
    priceMax: 550000,
    url: 'https://www.alomrane.gov.ma/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000',
    imageColor: '#005C9E',
  },
];

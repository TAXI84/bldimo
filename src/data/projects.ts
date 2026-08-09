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

/** Projets réels Al Omrane avec liens fiches produit */
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Résidence Ibn Khaldoun – Tranche 3',
    city: 'Tanger',
    description: 'La 3ᵉ tranche de la Résidence Ibn Khaldoun. Appartements modernes éligibles à l’aide au logement.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-tanger-tetouan-al-hoceima/Produits/Projets/Residence-ibn-khaldoun-tranche-3-a',
    imageColor: '#005C9E',
  },
  {
    id: '2',
    title: 'Logements Essalam',
    city: 'Tarfaya',
    description: 'Projet résidentiel Essalam. Commercialisation en cours. Idéal pour primo-accédants.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-al-janoub/Produits/Projets/Logements-essalam',
    imageColor: '#0D9488',
  },
  {
    id: '3',
    title: 'Résidence Assaada Al Oulya',
    city: 'Ksar El Kébir',
    description: 'Projet résidentiel ASSAADA AL OULYA : appartements à Ksar El Kebir.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-tanger-tetouan-al-hoceima/Produits/Projets/Residence-assaada-al-oulya-tr-1',
    imageColor: '#1E40AF',
  },
  {
    id: '4',
    title: 'Résidence Assanaoubar',
    city: 'Salé',
    description: 'Résidence ASSANAOUBAR à Salé – commercialisation Al Omrane Rabat Salé Kénitra.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-rabat-sale-kenitra/Produits/Projets/Residence-assanaoubar',
    imageColor: '#0F766E',
  },
  {
    id: '5',
    title: 'Résidence Al Ward',
    city: 'Tamesna',
    description: 'Projet Al Ward à Tamesna, cité éligible au programme d’aide au logement.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-rabat-sale-kenitra/Produits/Projets/Residence-al-ward-construction-tr2',
    imageColor: '#003D6B',
  },
  {
    id: '6',
    title: 'Al Amal Logements',
    city: 'Zagora',
    description: 'Projet AL AMAL dans le cadre du programme national d’aide directe au logement.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-daraa-tafilalet/Produits/Projets/Al-amal-logements',
    imageColor: '#14B8A6',
  },
  {
    id: '7',
    title: 'Projet Amouaj',
    city: 'Dakhla',
    description: 'AMOUAJ – projet immobilier résidentiel à Dakhla.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-al-janoub/Produits/Projets/Projet-amouaj',
    imageColor: '#0369A1',
  },
  {
    id: '8',
    title: 'Green Valley',
    city: 'Berkane',
    description: 'Lotissement résidentiel Green Valley Berkane.',
    type: 'villa',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-region-de-l-oriental/Produits/Projets/Green-valley',
    imageColor: '#0D9488',
  },
  {
    id: '9',
    title: 'Tamesna Ilots',
    city: 'Tamesna',
    description: 'Ilots dans le cadre du Nouveau Programme d’Aide au Logement – Tamesna.',
    type: 'maison',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-rabat-sale-kenitra/Produits/Projets/Tamesna-ilots',
    imageColor: '#1E3A5F',
  },
  {
    id: '10',
    title: 'Pôle Urbain Jardins de Tafilalet',
    city: 'Errachidia',
    description: '4ᵉ tranche du pôle urbain Jardins de Tafilalet – Errachidia.',
    type: 'appartement',
    priceMax: 700000,
    url: 'https://www.alomrane.gov.ma/Notre-reseau/Al-omrane-daraa-tafilalet/Produits/Projets/Pole-urbain-jardins-de-tafilalet-tranche-4',
    imageColor: '#005C9E',
  },
];

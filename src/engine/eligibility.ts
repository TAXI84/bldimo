import { SimulationInput, SimulationResult, DeviceResult, ConditionResult, ProfessionType, FinancingType } from '../types';

function getAideDirecteAmount(price: number): number | null {
  if (price <= 0 || price > 700000) return null;
  if (price <= 300000) return 100000;
  return 70000;
}

function evaluateAideDirecte(input: SimulationInput): DeviceResult {
  const conditions: ConditionResult[] = [];
  const refusalReasons: string[] = [];
  let eligible = true;
  const isMoroccan = input.profile === 'marocain' || input.profile === 'mre';

  if (!isMoroccan) { eligible = false; refusalReasons.push('Nationalité marocaine requise'); }
  conditions.push({ id: 'nationality', label: 'Nationalité marocaine (résident ou MRE)', valid: isMoroccan });

  if (input.isOwnerInMorocco) { eligible = false; refusalReasons.push('Déjà propriétaire au Maroc'); }
  conditions.push({ id: 'not_owner', label: 'Ne pas être propriétaire au Maroc', valid: !input.isOwnerInMorocco });

  if (input.hasReceivedStateAid) { eligible = false; refusalReasons.push('Déjà bénéficié d\'une aide de l\'État'); }
  conditions.push({ id: 'never_aided', label: 'Jamais bénéficié d\'aide État', valid: !input.hasReceivedStateAid });

  if (input.propertyType === 'terrain') { eligible = false; refusalReasons.push('Terrains non éligibles'); }
  conditions.push({ id: 'housing', label: 'Logement (pas terrain)', valid: input.propertyType !== 'terrain' });

  if (input.priceTTC <= 0 || input.priceTTC > 700000) { eligible = false; refusalReasons.push('Prix hors plafond (max 700 000 DH)'); }
  conditions.push({ id: 'price_max', label: 'Prix TTC ≤ 700 000 DH', valid: input.priceTTC > 0 && input.priceTTC <= 700000 });

  if (input.rooms < 2) { eligible = false; refusalReasons.push('Minimum 2 pièces'); }
  conditions.push({ id: 'min_rooms', label: 'Au moins 2 pièces', valid: input.rooms >= 2 });

  if (!input.isPrincipalResidence) { eligible = false; refusalReasons.push('Résidence principale 5 ans requise'); }
  conditions.push({ id: 'principal_5y', label: 'Résidence principale 5 ans', valid: input.isPrincipalResidence });

  const amount = eligible ? getAideDirecteAmount(input.priceTTC) ?? undefined : undefined;
  const documents = [
    'Formulaire de demande d\'aide au logement',
    'Déclaration sur l\'honneur',
    'CIN / Passeport',
    'Attestation de non-propriété',
    'Compromis de vente notarié',
    'Permis d\'habiter ≥ 01/01/2023',
    'Engagement résidence principale 5 ans',
  ];
  if (input.profile === 'mre') documents.push('Attestation compte bancaire marocain');

  return {
    id: 'aide_directe',
    name: 'Aide directe de l\'État (logement)',
    shortName: 'Aide directe',
    eligible: !!eligible && amount != null,
    amount,
    advantages: amount ? [`Aide directe de ${amount.toLocaleString('fr-MA')} DH`, 'Frais de notaire plafonnés'] : [],
    conditions,
    refusalReasons,
    documents: eligible ? documents : [],
  };
}

function evaluateFogarim(input: SimulationInput): DeviceResult {
  const conditions: ConditionResult[] = [];
  const refusalReasons: string[] = [];
  let eligible = true;
  const isMoroccan = input.profile === 'marocain' || input.profile === 'mre';

  if (!isMoroccan) { eligible = false; refusalReasons.push('Nationalité marocaine requise'); }
  conditions.push({ id: 'nationality', label: 'Nationalité marocaine / MRE', valid: isMoroccan });

  if (input.financingType === 'cash') { eligible = false; refusalReasons.push('FOGARIM = crédit garanti (pas cash)'); }
  conditions.push({ id: 'financing', label: 'Financement par crédit', valid: input.financingType !== 'cash' });

  const modest: ProfessionType[] = ['revenu_irregulier', 'independant', 'commercant', 'sans_activite', 'autre'];
  const isModest = !input.profession || modest.includes(input.profession) || (input.monthlyIncome != null && input.monthlyIncome <= 10000);
  conditions.push({ id: 'income_profile', label: 'Revenus modestes ou irréguliers', valid: isModest });

  if (input.isOwnerInMorocco) { eligible = false; refusalReasons.push('Déjà propriétaire'); }
  conditions.push({ id: 'not_owner', label: 'Primo-accédant', valid: !input.isOwnerInMorocco });

  if (input.hasReceivedStateAid) { eligible = false; refusalReasons.push('Déjà bénéficié garantie/aide État'); }
  conditions.push({ id: 'never_aided', label: 'Pas de crédit garanti antérieur', valid: !input.hasReceivedStateAid });

  if (!input.isPrincipalResidence) { eligible = false; refusalReasons.push('Résidence principale requise'); }
  conditions.push({ id: 'principal', label: 'Habitation principale', valid: input.isPrincipalResidence });

  const documents = [
    'Demande de crédit (banque partenaire Damane Assakane)',
    'CIN / Passeport',
    'Justificatifs de revenus ou déclaration sur l\'honneur',
    'Attestation de non-propriété',
    'Compromis de vente',
    'Engagement d\'habitation personnelle',
  ];

  return {
    id: 'fogarim',
    name: 'FOGARIM (Garantie Damane Assakane – revenus modestes)',
    shortName: 'FOGARIM',
    eligible,
    advantages: eligible ? ['Garantie publique du crédit', 'Accès facilité pour revenus modestes/irréguliers', 'Durée possible jusqu\'à 25 ans'] : [],
    conditions,
    refusalReasons,
    documents: eligible ? documents : [],
  };
}

function evaluateFogaloge(input: SimulationInput): DeviceResult {
  const conditions: ConditionResult[] = [];
  const refusalReasons: string[] = [];
  let eligible = true;
  const isMoroccan = input.profile === 'marocain' || input.profile === 'mre';

  if (!isMoroccan) { eligible = false; refusalReasons.push('Nationalité marocaine requise'); }
  conditions.push({ id: 'nationality', label: 'Nationalité marocaine / MRE', valid: isMoroccan });

  if (input.financingType === 'cash') { eligible = false; refusalReasons.push('FOGALOGE = crédit garanti'); }
  conditions.push({ id: 'financing', label: 'Financement par crédit', valid: input.financingType !== 'cash' });

  const formal: ProfessionType[] = ['salarie_public', 'salarie_prive', 'liberal', 'commercant', 'independant'];
  const isFormal = !input.profession || formal.includes(input.profession);
  conditions.push({ id: 'profession', label: 'Salarié / fonctionnaire / libéral / commerçant', valid: isFormal });

  if (input.isOwnerInMorocco) { eligible = false; refusalReasons.push('Déjà propriétaire'); }
  conditions.push({ id: 'not_owner', label: 'Primo-accédant', valid: !input.isOwnerInMorocco });

  if (input.hasReceivedStateAid) { eligible = false; refusalReasons.push('Déjà bénéficié garantie/aide État'); }
  conditions.push({ id: 'never_aided', label: 'Pas de crédit garanti antérieur', valid: !input.hasReceivedStateAid });

  if (!input.isPrincipalResidence) { eligible = false; refusalReasons.push('Résidence principale requise'); }
  conditions.push({ id: 'principal', label: 'Habitation principale', valid: input.isPrincipalResidence });

  const documents = [
    'Demande de crédit (banque partenaire)',
    'CIN / Passeport',
    'Bulletins de salaire (3 mois) ou justificatifs revenus',
    'Attestation de travail / CNSS',
    'Attestation de non-propriété',
    'Compromis de vente',
    'Engagement d\'habitation personnelle',
  ];

  return {
    id: 'fogaloge',
    name: 'FOGALOGE (Garantie Damane Assakane – classe moyenne)',
    shortName: 'FOGALOGE',
    eligible,
    advantages: eligible ? ['Garantie publique du crédit', 'Adapté salariés / fonctionnaires / libéraux', 'Couverture facilitant le financement', 'Durée possible jusqu\'à 25 ans'] : [],
    conditions,
    refusalReasons,
    documents: eligible ? documents : [],
  };
}

function evaluateEtrangerResident(input: SimulationInput): DeviceResult {
  const isResident = input.profile === 'etranger_resident';
  const refusalReasons: string[] = [];
  if (!isResident) refusalReasons.push('Profil étranger résident requis');
  if (input.isOwnerInMorocco) refusalReasons.push('Déjà propriétaire au Maroc');

  return {
    id: 'etranger_resident',
    name: 'Accès logement – Étranger résident',
    shortName: 'Étranger résident',
    eligible: isResident && !input.isOwnerInMorocco,
    advantages: isResident ? ['Achat possible avec titre de séjour', 'Crédit bancaire classique possible', 'Pas d\'aide directe (réservée aux Marocains)'] : [],
    conditions: [
      { id: 'status', label: 'Titre de séjour valide', valid: isResident },
      { id: 'not_owner', label: 'Pas déjà propriétaire', valid: !input.isOwnerInMorocco },
    ],
    refusalReasons,
    documents: isResident ? ['Titre de séjour', 'Passeport', 'Justificatifs de revenus', 'Compromis de vente'] : [],
  };
}

export function runSimulation(input: SimulationInput): SimulationResult {
  const devices: DeviceResult[] = [];

  if (input.profile === 'marocain' || input.profile === 'mre') {
    devices.push(evaluateAideDirecte(input));
    devices.push(evaluateFogarim(input));
    devices.push(evaluateFogaloge(input));
  } else if (input.profile === 'etranger_resident') {
    devices.push(evaluateEtrangerResident(input));
  } else {
    devices.push({
      id: 'investisseur',
      name: 'Investissement immobilier – Non-résident',
      shortName: 'Investisseur',
      eligible: true,
      advantages: ['Achat sous conditions de change', 'Pas d\'aide directe de l\'État', 'Crédit selon politique banque'],
      conditions: [],
      refusalReasons: [],
      documents: ['Passeport', 'Justificatifs de fonds', 'Compromis de vente'],
    });
  }

  const isEligibleForAny = devices.some(d => d.eligible);
  const docSet = new Set<string>();
  devices.filter(d => d.eligible).forEach(d => d.documents.forEach(doc => docSet.add(doc)));
  const documents = Array.from(docSet);
  const notaryFees = input.priceTTC > 0 && input.priceTTC <= 700000 ? 1500 : 0;

  const eligibleDevices = devices.filter(d => d.eligible);
  let summary = '';
  if (eligibleDevices.length === 0) {
    summary = '❌ Aucune aide / garantie identifiée avec les informations fournies.';
  } else {
    const names = eligibleDevices.map(d => d.shortName).join(', ');
    const aide = eligibleDevices.find(d => d.id === 'aide_directe' && d.amount);
    summary = aide?.amount
      ? `✅ Éligible à : ${names}. Aide directe estimée : ${aide.amount.toLocaleString('fr-MA')} DH.`
      : `✅ Dispositifs possibles : ${names}.`;
  }

  return { profile: input.profile, devices, notaryFees, documents, summary, isEligibleForAny };
}

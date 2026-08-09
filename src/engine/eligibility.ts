import { SimulationInput, SimulationResult, DeviceResult, ConditionResult, ProfileType } from '../types';

function getDaamSakaneAmount(price: number): number | null {
  if (price <= 0 || price > 700000) return null;
  if (price <= 300000) return 100000;
  return 70000;
}

function evaluateDaamSakane(input: SimulationInput): DeviceResult {
  const conditions: ConditionResult[] = [];
  const refusalReasons: string[] = [];
  let eligible = true;

  const isMoroccan = input.profile === 'marocain' || input.profile === 'mre';
  conditions.push({
    id: 'nationality',
    label: 'Nationalité marocaine (résident ou MRE)',
    valid: isMoroccan,
    message: isMoroccan ? undefined : 'Daam Sakane réservé aux Marocains'
  });
  if (!isMoroccan) {
    eligible = false;
    refusalReasons.push('Nationalité marocaine requise');
  }

  conditions.push({
    id: 'not_owner',
    label: 'Ne pas être propriétaire d\'un bien d\'habitation au Maroc',
    valid: !input.isOwnerInMorocco
  });
  if (input.isOwnerInMorocco) {
    eligible = false;
    refusalReasons.push('Vous êtes déjà propriétaire au Maroc');
  }

  conditions.push({
    id: 'never_aided',
    label: 'N\'avoir jamais bénéficié d\'une aide de l\'État pour le logement',
    valid: !input.hasReceivedStateAid
  });
  if (input.hasReceivedStateAid) {
    eligible = false;
    refusalReasons.push('Vous avez déjà bénéficié d\'une aide de l\'État');
  }

  const isNewHousing = input.propertyType !== 'terrain';
  conditions.push({
    id: 'new_housing',
    label: 'Logement neuf (1ère vente)',
    valid: isNewHousing
  });
  if (!isNewHousing) {
    eligible = false;
    refusalReasons.push('Les terrains ne sont pas éligibles');
  }

  conditions.push({
    id: 'permit_2023',
    label: 'Permis d\'habiter délivré à partir du 01/01/2023',
    valid: true,
    message: 'À vérifier lors de la demande officielle'
  });

  const priceOk = input.priceTTC > 0 && input.priceTTC <= 700000;
  conditions.push({
    id: 'price_max',
    label: 'Prix d\'achat TTC ≤ 700 000 DH',
    valid: priceOk
  });
  if (!priceOk) {
    eligible = false;
    refusalReasons.push(`Prix trop élevé (${input.priceTTC.toLocaleString()} DH > 700 000 DH)}`);
  }

  const roomsOk = input.rooms >= 2;
  conditions.push({
    id: 'min_rooms',
    label: 'Au moins 2 pièces',
    valid: roomsOk
  });
  if (!roomsOk) {
    eligible = false;
    refusalReasons.push('Le logement doit comporter au moins 2 pièces');
  }

  conditions.push({
    id: 'notary',
    label: 'Compromis et contrat passés devant notaire',
    valid: true,
    message: 'Obligatoire pour la demande'
  });

  conditions.push({
    id: 'principal_5y',
    label: 'Engagement résidence principale pendant 5 ans',
    valid: input.isPrincipalResidence
  });
  if (!input.isPrincipalResidence) {
    eligible = false;
    refusalReasons.push('Le logement doit être affecté à la résidence principale pendant 5 ans');
  }

  const amount = eligible ? getDaamSakaneAmount(input.priceTTC) : undefined;

  return {
    name: 'Daam Sakane (Aide directe de l\'État)',
    eligible: eligible && amount !== null,
    amount: amount ?? undefined,
    advantages: amount ? [`Aide directe de ${amount.toLocaleString()} DH`] : [],
    conditions,
    refusalReasons
  };
}

function evaluateClasseMoyenne(input: SimulationInput): DeviceResult {
  const conditions: ConditionResult[] = [];
  const refusalReasons: string[] = [];
  let eligible = true;

  const isResident = input.profile === 'etranger_resident' || input.profile === 'marocain' || input.profile === 'mre';
  conditions.push({
    id: 'resident',
    label: 'Résident au Maroc en situation régulière',
    valid: isResident
  });
  if (!isResident) {
    eligible = false;
    refusalReasons.push('Réservé aux résidents au Maroc');
  }

  const incomeOk = (input.monthlyIncome ?? 99999) <= 20000;
  conditions.push({
    id: 'income',
    label: 'Revenu mensuel net ≤ 20 000 DH',
    valid: incomeOk
  });
  if (!incomeOk) {
    eligible = false;
    refusalReasons.push('Revenu supérieur à 20 000 DH');
  }

  conditions.push({
    id: 'principal_4y',
    label: 'Affectation en résidence principale pendant 4 ans',
    valid: input.isPrincipalResidence
  });
  if (!input.isPrincipalResidence) {
    eligible = false;
    refusalReasons.push('Doit être résidence principale');
  }

  if (input.surface) {
    const surfaceOk = input.surface >= 80 && input.surface <= 150;
    conditions.push({
      id: 'surface',
      label: 'Superficie entre 80 et 150 m²',
      valid: surfaceOk
    });
    if (!surfaceOk) {
      eligible = false;
      refusalReasons.push('Superficie hors fourchette 80-150 m²');
    }
  }

  return {
    name: 'Logement destiné à la classe moyenne',
    eligible,
    advantages: eligible ? [
      'Exonération des droits d\'enregistrement',
      'Exonération des droits de timbre',
      'Exonération des droits d\'inscription sur titres fonciers'
    ] : [],
    conditions,
    refusalReasons
  };
}

function evaluateInvestisseur(input: SimulationInput): DeviceResult {
  const isInvestor = input.profile === 'etranger_investisseur';
  return {
    name: 'Avantages fiscaux investisseurs étrangers',
    eligible: isInvestor,
    advantages: isInvestor ? [
      'Garantie de transfert des produits de vente hors Maroc',
      'Protection des investissements',
      'Libre transfert des capitaux',
      'Avantages possibles en zones franches'
    ] : [],
    conditions: [{
      id: 'investor',
      label: 'Statut d\'investisseur non-résident',
      valid: isInvestor
    }],
    refusalReasons: isInvestor ? [] : ['Réservé aux investisseurs non-résidents']
  };
}

export function runSimulation(input: SimulationInput): SimulationResult {
  const devices: DeviceResult[] = [];

  devices.push(evaluateDaamSakane(input));

  if (input.profile === 'etranger_resident' || input.profile === 'marocain' || input.profile === 'mre') {
    devices.push(evaluateClasseMoyenne(input));
  }

  if (input.profile === 'etranger_investisseur') {
    devices.push(evaluateInvestisseur(input));
  }

  const isEligibleForAny = devices.some(d => d.eligible);
  const notaryFees = input.priceTTC <= 700000 ? 2500 : 0;

  const documents: string[] = [
    'Promesse de vente / Compromis de vente',
    'Contrat de vente définitif',
    'Acte notarié',
    'Quittance de paiement',
  ];

  if (devices.some(d => d.name.includes('Daam Sakane') && d.eligible)) {
    documents.unshift(
      'Formulaire de demande Daam Sakane (signé et légalisé)',
      'Déclaration sur l\'honneur (signée et légalisée)',
      'Copie CIN / Passeport',
      'Attestation de non-propriété (Conservation foncière)',
      'Copie du permis d\'habiter (≥ 01/01/2023)',
      'Justificatif de revenus (3 derniers mois)',
      'Engagement de résidence principale (5 ans)'
    );
    if (input.profile === 'mre') {
      documents.push('Attestation de compte bancaire marocain');
    }
  }

  if (input.profile === 'etranger_resident') {
    documents.push('Titre de séjour en cours de validité');
  }

  let summary = '';
  if (input.profile === 'marocain' || input.profile === 'mre') {
    const daam = devices.find(d => d.name.includes('Daam Sakane'));
    if (daam?.eligible && daam.amount) {
      summary = `✅ Éligible à Daam Sakane : ${daam.amount.toLocaleString()} DH d'aide directe.`;
      if (input.profile === 'mre') {
        summary += ' (Compte bancaire marocain obligatoire pour le virement)';
      }
    } else {
      summary = `❌ Non éligible à Daam Sakane. Motifs : ${daam?.refusalReasons.join(', ') || 'Conditions non remplies'}`;
    }
  } else if (input.profile === 'etranger_resident') {
    const cm = devices.find(d => d.name.includes('classe moyenne'));
    if (cm?.eligible) {
      summary = '✅ Éligible au dispositif Logement classe moyenne (exonérations fiscales).';
    } else {
      summary = 'ℹ️ Aucun dispositif d\'aide directe. Orientation vers crédit immobilier classique.';
    }
  } else {
    summary = 'ℹ️ Profil investisseur : avantages fiscaux et garantie de transfert disponibles.';
  }

  return {
    profile: input.profile,
    devices,
    notaryFees,
    documents: [...new Set(documents)],
    summary,
    isEligibleForAny
  };
}

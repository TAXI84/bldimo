export type ProfileType = 'marocain' | 'mre' | 'etranger_resident' | 'etranger_investisseur';

export type PropertyType = 'appartement' | 'villa' | 'maison' | 'terrain' | 'duplex' | 'studio';

export type ProfessionType = 
  | 'salarie_public' 
  | 'salarie_prive' 
  | 'independant' 
  | 'commercant' 
  | 'liberal' 
  | 'revenu_irregulier' 
  | 'sans_activite'
  | 'autre';

export type FinancingType = 'credit' | 'cash' | 'mixte';

export interface SimulationInput {
  profile: ProfileType;
  propertyType: PropertyType;
  priceTTC: number;
  rooms: number;
  city?: string;
  monthlyIncome?: number;
  isOwnerInMorocco: boolean;
  hasReceivedStateAid: boolean;
  isPrincipalResidence: boolean;
  profession?: ProfessionType;
  financingType?: FinancingType;
  age?: number;
}

export interface ConditionResult {
  id: string;
  label: string;
  valid: boolean;
  message?: string;
}

export interface DeviceResult {
  id: string;
  name: string;
  shortName: string;
  eligible: boolean;
  amount?: number;
  advantages: string[];
  conditions: ConditionResult[];
  refusalReasons: string[];
  documents: string[];
}

export interface SimulationResult {
  profile: ProfileType;
  devices: DeviceResult[];
  notaryFees: number;
  documents: string[];
  summary: string;
  isEligibleForAny: boolean;
}

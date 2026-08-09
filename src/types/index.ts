export type ProfileType = 'marocain' | 'mre' | 'etranger_resident' | 'etranger_investisseur';

export type PropertyType = 'appartement' | 'villa' | 'maison' | 'terrain' | 'duplex' | 'studio';

export interface SimulationInput {
  profile: ProfileType;
  propertyType: PropertyType;
  priceTTC: number;
  surface?: number;
  rooms: number;
  city?: string;
  monthlyIncome?: number;
  isOwnerInMorocco: boolean;
  hasReceivedStateAid: boolean;
  isPrincipalResidence: boolean;
  ageRange?: string;
  familyStatus?: string;
  children?: number;
}

export interface ConditionResult {
  id: string;
  label: string;
  valid: boolean;
  message?: string;
}

export interface DeviceResult {
  name: string;
  eligible: boolean;
  amount?: number;
  advantages: string[];
  conditions: ConditionResult[];
  refusalReasons: string[];
}

export interface SimulationResult {
  profile: ProfileType;
  devices: DeviceResult[];
  notaryFees: number;
  documents: string[];
  summary: string;
  isEligibleForAny: boolean;
}

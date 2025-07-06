
import type React from 'react';

export type ConnectiviteValue = 'RA' | 'SSc' | 'IIM' | 'MCTD' | 'SjD' | '';
export type PIDStatus = 'stable' | 'progression' | 'rapid-progressive' | '';
export type AntiMDA5Status = 'confirmed' | 'suspected' | 'negative' | 'unknown' | '';
export type HepaticFunction = 'normal' | 'mild' | 'moderate' | 'severe';
export type RiskLevel = 'élevé' | 'modéré' | 'faible';

export interface PatientData {
  patientName: string;
  connectiviteType: ConnectiviteValue;
  hasPID: boolean;
  pidStatus: PIDStatus;
  riskFactors: string[];
  currentSymptoms: string[];
  antiMDA5Status: AntiMDA5Status;
  antiMDA5Titer: string; // New
  antiMDA5Manifestations: string[]; // New
  age: string;
  weight: string;
  hepaticFunction: HepaticFunction;
  contraindications: string[];
  currentMedications: string[];
  ferritin: string; // New
  ldh: string; // New
  crp: string; // New
}

export interface ConnectiviteInfo {
  value: Exclude<ConnectiviteValue, ''>;
  label: string;
  risk: 'modéré' | 'élevé';
}

export interface Treatment {
  name: string;
  dosage: string;
  administration: string;
  surveillance: string;
  contraindications: string[];
  interactions: string[];
  sideEffects: string;
  monitoring: string;
  notes: string;
}

export interface TreatmentDatabase {
  [key: string]: Treatment;
}

export interface RecommendedTreatment {
  primary: string;
  secondary?: string[];
  alternatives?: string[];
  combination?: 'triple' | 'double';
  urgency: boolean;
  contraindicated?: string[];
  additional?: string[];
  // New fields for anti-MDA5
  urgencyLevel?: 'high' | 'critical' | 'extreme';
  antiMDA5Specific?: boolean;
  enhanced?: boolean;
  monitoring?: 'intensive';
}

export interface Recommendation {
    test: string;
    recommendation: string;
    level: string;
    icon: React.FC<{className?: string}>;
    description: string;
    frequency?: string;
}

export interface AntiMDA5PrognosticAssessment {
    riskScore: number;
    riskFactors: string[];
    prognosticLevel: 'Très mauvais' | 'Mauvais' | 'Réservé' | 'Bon';
    prognosticColor: string;
    recommendations: string[];
    mortalityRisk: string;
}
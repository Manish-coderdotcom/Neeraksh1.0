export type WarmingCategory = 
  | 'Normal' 
  | 'Mild warming' 
  | 'Moderate warming' 
  | 'Severe warming' 
  | 'Extreme warming';

export type StayOrMoveStatus = 
  | 'STAY' 
  | 'SHIFT' 
  | 'HIGH STRESS' 
  | 'SEVERE RISK';

export type StressCategory = 
  | 'Likely to tolerate' 
  | 'May experience stress' 
  | 'May shift habitat' 
  | 'High biological stress' 
  | 'Severe long-term risk';

export type ForecastPeriod = '24h' | '48h' | '7d';

export interface SpeciesGroup {
  id: string;
  name: string;
  scientificCategory: string;
  baselineTempRange: { min: number; max: number; optimal: number };
  thermalSensitivity: 'Extreme' | 'High' | 'Moderate' | 'Low';
  mobilityType: 'Sessile' | 'Low Mobility' | 'Highly Mobile' | 'Migratory';
  typicalDepthRange: string;
  trophicLevel: number;
  keyEcologicalRole: string;
}

export interface SpeciesImpactEstimate {
  species: SpeciesGroup;
  temperatureAnomaly: number;
  predictedTemp: number;
  stressLevel: StressCategory;
  stayOrMove: StayOrMoveStatus;
  stayOrMoveDescription: string;
  potentialResponses: string[];
  mortalityRisk: 'Low' | 'Moderate' | 'Elevated' | 'High' | 'Severe (with prolonged exposure)';
  habitatDisplacementRisk: 'Negligible' | 'Low' | 'Moderate' | 'High' | 'Very High';
  confidence: number;
  whyExplanation: string;
  dataBasis: string;
}

export interface TimelinePhase {
  timeframe: '0–24 Hours' | '24–72 Hours' | '1–4 Weeks' | 'Months–Years';
  stageTitle: string;
  generalEcosystemImpact: string;
  speciesSpecificResponses: { speciesName: string; response: string }[];
  environmentalVariables: string[];
}

export interface TemperatureTimeseriesPoint {
  time: string;
  fullDate: string;
  baseline: number;
  safeMin: number;
  safeMax: number;
  observed?: number;
  predicted?: number;
  anomaly: number;
  stressIndex: number; // 0 - 100
  ecosystemStressLevel: StressCategory;
}

export interface EcosystemNetworkNode {
  id: string;
  label: string;
  category: string;
  trophicLevel: number;
  stressLevel: StressCategory;
  status: StayOrMoveStatus;
  temperatureDelta: number;
}

export interface EcosystemNetworkLink {
  source: string;
  target: string;
  relationship: string;
  isDisrupted: boolean;
}

export interface MarineRegionImpact {
  regionId: string;
  regionName: string;
  coordinates: { lat: number; lon: number };
  baselineTemp: number;
  currentTemp: number;
  predictedTemp: number;
  temperatureAnomaly: number;
  warmingCategory: WarmingCategory;
  forecastPeriod: ForecastPeriod;
  ecosystemRiskScore: number;
  overallRiskTier: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';
  speciesEstimates: SpeciesImpactEstimate[];
  timeline: TimelinePhase[];
  temperatureTimeseries: TemperatureTimeseriesPoint[];
  networkNodes: EcosystemNetworkNode[];
  networkLinks: EcosystemNetworkLink[];
  summaryStatement: string;
  dataProvenance: string;
}

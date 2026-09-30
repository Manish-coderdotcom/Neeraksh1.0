export interface Coordinate {
  lat: number;
  lon: number;
}

export interface SensorMeasurement {
  name: string;
  value?: number;
  velocity?: number;
  speed?: number;
  unit: string;
  instrument: string;
  resolution: string;
  quality_flag?: string;
  cloud_fraction?: string;
  direction?: string;
  cycle?: number;
}

export interface SatelliteObservation {
  status: string;
  data_classification: "OBSERVED SATELLITE MEASUREMENTS";
  is_synthetic_demo: boolean;
  timestamp: string;
  region_id: string;
  region_name: string;
  coordinates: Coordinate;
  sensors: {
    sst: SensorMeasurement;
    sss: SensorMeasurement;
    ssh: SensorMeasurement;
    currents: SensorMeasurement;
    wind: SensorMeasurement;
  };
  provenance: {
    provider: string;
    license: string;
  };
}

export interface DepthTemperaturePoint {
  depth: number;
  temperature: number;
}

export interface DepthUncertaintyPoint {
  depth: number;
  uncertainty: number;
}

export interface ThermoclineGradient {
  depth_range: string;
  mid_depth: number;
  gradient: number;
}

export interface ThermoclineAnalysis {
  estimated_depth_m: number;
  max_gradient_deg_c_per_m: number;
  gradient_deg_c_per_10m: number;
  mixed_layer_depth_m: number;
  thermal_structure_score: number;
  formula_documentation: string;
  gradients: ThermoclineGradient[];
}

export interface ModelAttribution {
  feature: string;
  contribution_pct: number;
  impact: string;
}

export interface ReconstructionData {
  status: string;
  data_classification: "AI-RECONSTRUCTED VALUES";
  model_version: string;
  region_id: string;
  region_name: string;
  depth_profile: DepthTemperaturePoint[];
  uncertainty_profile: DepthUncertaintyPoint[];
  thermocline_analysis: ThermoclineAnalysis;
  explainability: {
    method: string;
    disclaimer: string;
    attributions: ModelAttribution[];
  };
}

export interface ArgoComparisonRow {
  depth: number;
  ai_reconstructed: number;
  argo_observed: number;
  error_celsius: number;
  uncertainty_celsius: number;
}

export interface ArgoValidationData {
  status: string;
  data_classification: "ARGO GROUND-TRUTH OBSERVATIONS";
  float_metadata: {
    wmo_id: string;
    cycle_number: number;
    platform_type: string;
    sensor: string;
    position: Coordinate;
    distance_from_satellite_pixel_km: number;
    profile_date: string;
    qc_status: string;
  };
  metrics: {
    rmse: number;
    mae: number;
    bias: number;
    correlation_r: number;
    r_squared: number;
    depth_range_m: string;
    sample_count: number;
  };
  comparison_table: ArgoComparisonRow[];
}

export interface EmbeddingPoint {
  id: string;
  name: string;
  basin: string;
  lat: number;
  lon: number;
  date: string;
  sst: number;
  condition: string;
  thermocline_depth: number;
  error: number;
  umap_x: number;
  umap_y: number;
  similarity?: number;
  is_current?: boolean;
}

export interface AnomalyPoint {
  depth: number;
  current_temp: number;
  baseline_temp: number;
  anomaly_celsius: number;
  is_marine_heatwave: boolean;
}

export interface OceanAnomalyData {
  status: string;
  region: string;
  diagnostic: {
    subsurface_anomaly_mean: number;
    depth_range: string;
    classification: string;
    confidence_pct: number;
    warning: string;
  };
  anomaly_profile: AnomalyPoint[];
}

export interface TransectStation {
  station: string;
  dist_km: number;
  lat: number;
  lon: number;
  thermocline_depth: number;
  profile: DepthTemperaturePoint[];
}

export interface TransectData {
  status: string;
  transect_name: string;
  transect_length_km: number;
  stations: TransectStation[];
}

export interface AnalystResponse {
  query: string;
  region: string;
  analyst_response: string;
  grounding_sources: string[];
}

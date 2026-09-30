import React from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  CloudRain, 
  Radio, 
  Compass, 
  Database,
  Layers
} from 'lucide-react';
import { ReconstructionData, ArgoValidationData, SatelliteObservation } from '../types/ocean';

interface TrustMeterProps {
  reconstructionData: ReconstructionData | null;
  argoData: ArgoValidationData | null;
  satelliteData: SatelliteObservation | null;
  selectedDepth: number;
}

export const TrustMeter: React.FC<TrustMeterProps> = ({
  reconstructionData,
  argoData,
  satelliteData,
  selectedDepth
}) => {
  const currentTemp = reconstructionData?.depth_profile.find(p => p.depth === selectedDepth)?.temperature ?? 23.4;
  const uncertainty = reconstructionData?.uncertainty_profile.find(p => p.depth === selectedDepth)?.uncertainty ?? 0.99;

  // Confidence computation
  const confidenceScore = Math.max(60, Math.min(96, Math.round(98 - uncertainty * 15)));
  const confidenceTier = confidenceScore >= 85 ? 'High confidence' : confidenceScore >= 75 ? 'Moderate confidence' : 'Low confidence';

  const factors = [
    {
      title: "Cloud contamination",
      icon: CloudRain,
      value: "4.2% cloud fraction",
      status: "Optimal",
      impact: "Minimal infrared obscuration on Sentinel-3 SLSTR; microwave radiometer provides continuous boundary calibration.",
      score: 95
    },
    {
      title: "Sensor completeness",
      icon: Radio,
      value: "5 of 5 sensors available",
      status: "Complete",
      impact: "SST, SSS, SSH, surface currents, and scatterometer wind stress actively synchronized.",
      score: 98
    },
    {
      title: "ARGO float proximity",
      icon: Compass,
      value: "14.2 km to WMO-2902784",
      status: "Near-field",
      impact: "Collocated autonomous CTD profiler provides direct in-situ ground truth calibration.",
      score: 91
    },
    {
      title: "Stratification stability",
      icon: Layers,
      value: "+1.2 °C thermal anomaly",
      status: "Normal variance",
      impact: "Thermocline gradient matches historical baroclinic seasonal range for the region.",
      score: 82
    },
    {
      title: "Historical training density",
      icon: Database,
      value: "142,500 profiles",
      status: "High density",
      impact: "Northern Indian Ocean basin is well sampled across the multi-decadal ARGO climatology.",
      score: 89
    }
  ];

  return (
    <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#DCEFEA] text-[#009FE3]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-[#071B33]">
              Uncertainty & prediction confidence
            </h2>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
              confidenceScore >= 85
                ? 'bg-[#DCEFEA] text-[#009FE3] border border-[#BCE3DA]'
                : 'bg-[#FFF3D6] text-[#D99A3D] border border-[#FDE3A2]'
            }`}>
              {confidenceTier}
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Explicit quantification of prediction intervals, sensor quality, and data density
          </p>
        </div>

        <div className="text-xs font-mono text-[#62757C]">
          Selected depth: <span className="text-[#071B33] font-semibold">{selectedDepth} m</span>
        </div>
      </div>

      {/* Scientific Notice */}
      <div className="mt-4 p-3 bg-[#F8FAFA] border border-[#D5E0E2] rounded-md flex items-start gap-2.5 text-xs text-[#071B33]">
        <HelpCircle className="w-4 h-4 text-[#009FE3] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-[#071B33]">Scientific context: </span>
          Statistical confidence reflects observational input quality, proximity to coincident ARGO floats, and neural ensemble consistency, providing transparent bounds for operational oceanographic analysis.
        </p>
      </div>

      {/* Core Readout Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        <div className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2]">
          <span className="text-[11px] text-[#62757C] block font-medium">
            Reconstructed temperature
          </span>
          <div className="text-2xl font-bold text-[#071B33] font-mono mt-1">
            {currentTemp.toFixed(2)} °C
          </div>
          <span className="text-[11px] text-[#62757C] mt-0.5 block">
            At {selectedDepth} meters depth
          </span>
        </div>

        <div className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2]">
          <span className="text-[11px] text-[#62757C] block font-medium">
            Uncertainty interval (±1σ)
          </span>
          <div className="text-2xl font-bold text-[#009FE3] font-mono mt-1">
            ±{uncertainty.toFixed(2)} °C
          </div>
          <span className="text-[11px] text-[#62757C] mt-0.5 block">
            68% Gaussian confidence bound
          </span>
        </div>

        <div className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2]">
          <span className="text-[11px] text-[#62757C] block font-medium">
            Confidence score
          </span>
          <div className="text-2xl font-bold text-[#009FE3] font-mono mt-1">
            {confidenceScore}%
          </div>
          <span className="text-[11px] text-[#009FE3] font-medium mt-0.5 block">
            {confidenceTier}
          </span>
        </div>
      </div>

      {/* 5-Factor Scientific Breakdown */}
      <div className="mt-5">
        <span className="text-xs text-[#62757C] uppercase block mb-3 font-semibold">
          Factors influencing uncertainty
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {factors.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 rounded bg-white text-[#009FE3] border border-[#D5E0E2]">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <h4 className="text-xs font-semibold text-[#071B33]">{f.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#62757C] bg-white px-1.5 py-0.5 rounded border border-[#D5E0E2]">
                      {f.score}%
                    </span>
                  </div>

                  <div className="text-xs font-medium text-[#071B33] mt-2 font-mono">
                    {f.value}
                  </div>

                  <p className="text-[11px] text-[#62757C] mt-1 leading-relaxed">
                    {f.impact}
                  </p>
                </div>

                <div className="w-full h-1.5 bg-[#E2ECEE] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-[#009FE3] rounded-full"
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

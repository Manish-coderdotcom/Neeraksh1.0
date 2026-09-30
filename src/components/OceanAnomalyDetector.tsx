import React, { useState } from 'react';
import { 
  Waves, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Thermometer,
  Info 
} from 'lucide-react';
import { OceanAnomalyData } from '../types/ocean';

interface OceanAnomalyDetectorProps {
  anomalyData: OceanAnomalyData | null;
  selectedRegion: string;
}

export const OceanAnomalyDetector: React.FC<OceanAnomalyDetectorProps> = ({
  anomalyData,
  selectedRegion
}) => {
  const [anomalyMode, setAnomalyMode] = useState<'surface' | 'subsurface' | 'thermocline'>('subsurface');

  const profile = anomalyData?.anomaly_profile || [];
  const diagnostic = anomalyData?.diagnostic || {
    subsurface_anomaly_mean: 1.82,
    depth_range: "25–75m",
    classification: "Subsurface thermal warming",
    confidence_pct: 86,
    warning: "Subsurface thermal deviation detected relative to 1991–2020 reference period."
  };

  // Filter based on active lens mode
  let filteredDepths = profile;
  if (anomalyMode === 'surface') {
    filteredDepths = profile.filter(p => p.depth <= 20);
  } else if (anomalyMode === 'subsurface') {
    filteredDepths = profile.filter(p => p.depth >= 20 && p.depth <= 150);
  } else {
    filteredDepths = profile.filter(p => p.depth >= 50 && p.depth <= 100);
  }

  return (
    <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#DCEFEA] text-[#009FE3]">
              <Waves className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-[#071B33]">
              Subsurface temperature anomaly
            </h2>
            <span className="text-[11px] font-mono bg-[#F4F9FC] text-[#62757C] border border-[#D5E0E2] px-2 py-0.5 rounded">
              Reference: 1991–2020 Climatology
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Reconstructed temperature profile compared against 30-year climatological baseline
          </p>
        </div>

        {/* Lens Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-[#F4F9FC] p-1 rounded-md border border-[#D5E0E2] text-xs">
          {[
            { id: 'surface', label: 'Surface (0–20m)' },
            { id: 'subsurface', label: 'Subsurface (25–150m)' },
            { id: 'thermocline', label: 'Thermocline (~75m)' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setAnomalyMode(m.id as any)}
              className={`px-2.5 py-1 rounded transition ${
                anomalyMode === m.id
                  ? 'bg-[#009FE3] text-white font-medium shadow-xs'
                  : 'text-[#62757C] hover:text-[#071B33]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Anomaly Diagnostic Banner */}
      <div className="mt-4 p-4 rounded-md bg-[#FFFBF0] border border-[#FDE3A2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="p-1.5 rounded bg-[#FFF3D6] text-[#D99A3D] shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#071B33] font-mono">
                +{diagnostic.subsurface_anomaly_mean} °C thermal difference
              </span>
              <span className="text-xs bg-white text-[#62757C] px-2 py-0.5 rounded border border-[#D5E0E2]">
                Depth: {diagnostic.depth_range}
              </span>
            </div>
            <p className="text-xs text-[#071B33] mt-1">
              Observation: "{diagnostic.warning}"
            </p>
            <p className="text-[11px] text-[#62757C] mt-0.5">
              Comparison derived from collocated satellite altimetry, salinity, and in-situ ARGO profiles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded bg-white text-[#D99A3D] font-medium text-xs border border-[#FDE3A2]">
            {diagnostic.classification}
          </div>
        </div>
      </div>

      {/* Anomaly Depth Profile Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Profile Deviation Bars */}
        <div className="lg:col-span-8 bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2]">
          <div className="flex items-center justify-between text-xs text-[#62757C] pb-2 border-b border-[#E2ECEE] font-medium">
            <span className="w-20">Depth</span>
            <span className="w-24 text-center">Reconstructed</span>
            <span className="w-24 text-center">Baseline</span>
            <span className="w-28 text-right">Anomaly (ΔT)</span>
          </div>

          <div className="space-y-1.5 mt-2.5 overflow-y-auto max-h-[320px] pr-1">
            {filteredDepths.map((p) => {
              const isPositive = p.anomaly_celsius > 0;
              const isSignificant = Math.abs(p.anomaly_celsius) > 1.5;

              return (
                <div key={p.depth} className="p-2 rounded bg-white border border-[#E2ECEE] flex items-center justify-between text-xs">
                  <div className="w-20 font-medium text-[#071B33]">
                    {p.depth === 0 ? 'Surface' : `${p.depth} m`}
                  </div>

                  <div className="text-[#009FE3] font-mono font-semibold w-24 text-center">
                    {p.current_temp.toFixed(2)} °C
                  </div>

                  <div className="text-[#62757C] font-mono w-24 text-center">
                    {p.baseline_temp.toFixed(2)} °C
                  </div>

                  <div className="w-28 text-right flex items-center justify-end">
                    <span className={`font-mono font-medium px-2 py-0.5 rounded text-[11px] ${
                      isSignificant
                        ? 'bg-[#FFF3D6] text-[#D99A3D] border border-[#FDE3A2]'
                        : isPositive
                        ? 'bg-[#DCEFEA] text-[#009FE3] border border-[#BCE3DA]'
                        : 'bg-[#D8E7EC] text-[#009FE3] border border-[#BFD9E2]'
                    }`}>
                      {isPositive ? `+${p.anomaly_celsius.toFixed(2)}` : p.anomaly_celsius.toFixed(2)} °C
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Anomaly Diagnostics Context */}
        <div className="lg:col-span-4 bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2ECEE]">
              <span className="p-1 rounded bg-[#DCEFEA] text-[#009FE3]">
                <Thermometer className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs font-semibold text-[#071B33]">
                Subsurface thermal mechanics
              </h3>
            </div>

            <div className="mt-3 space-y-2.5 text-xs text-[#62757C] leading-relaxed">
              <p>
                Unlike surface warming easily captured by infrared radiometers, <strong className="text-[#071B33]">subsurface thermal accumulation (25–75 m)</strong> can develop beneath the mixed layer with minimal surface heat flux signatures.
              </p>
              <p>
                OceanEmbed reconstructs this subsurface structure by analyzing sea surface height anomalies (indicating thermocline vertical displacement) and sea surface salinity (indicating density stratification), helping marine researchers track subsurface conditions.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded border border-[#D5E0E2] text-[11px] text-[#62757C] mt-4">
            Reference dataset: NOAA World Ocean Atlas (WOA) 1991–2020 objectively analyzed climatology.
          </div>
        </div>
      </div>
    </div>
  );
};

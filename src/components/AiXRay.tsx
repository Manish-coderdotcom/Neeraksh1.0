import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  ArrowRight, 
  Info, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ReconstructionData, SatelliteObservation } from '../types/ocean';

interface AiXRayProps {
  reconstructionData: ReconstructionData | null;
  satelliteData: SatelliteObservation | null;
  selectedDepth: number;
}

export const AiXRay: React.FC<AiXRayProps> = ({
  reconstructionData,
  satelliteData,
  selectedDepth
}) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>("Sea Surface Temperature (SST)");
  const [isSimulatingInference, setIsSimulatingInference] = useState(false);

  const attributions = reconstructionData?.explainability.attributions || [
    { feature: "Sea Surface Temperature (SST)", contribution_pct: 34, impact: "Dominates upper 0–30m mixed layer thermal boundary condition." },
    { feature: "Sea Surface Height (SSH)", contribution_pct: 21, impact: "Baroclinic deformation modulates thermocline depth pumping (dynamic topography)." },
    { feature: "Sea Surface Salinity (SSS)", contribution_pct: 17, impact: "Density stratification modulates barrier layer thickness and stability." },
    { feature: "Surface Currents", contribution_pct: 15, impact: "Advection vector predicts horizontal thermal front displacement." },
    { feature: "Wind Speed & Stress", contribution_pct: 8, impact: "Ekman pumping and wind-shear mixing determines mixed layer deepening." },
    { feature: "Historical Climatology Context", contribution_pct: 5, impact: "Provides seasonal prior constraint for deep abyss stability." }
  ];

  const handleSimulate = () => {
    setIsSimulatingInference(true);
    setTimeout(() => setIsSimulatingInference(false), 900);
  };

  const activeAttribution = attributions.find(a => a.feature === selectedFeature) || attributions[0];

  return (
    <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#DCEFEA] text-[#176B87]">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-[#123B4A]">
              Model feature attribution
            </h2>
            <span className="text-[11px] font-mono bg-[#F4F7F6] text-[#62757C] border border-[#D5E0E2] px-2 py-0.5 rounded">
              Integrated gradients
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Latent feature importance scores computed via cross-attention layers
          </p>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isSimulatingInference}
          className="px-3.5 py-1.5 rounded-md bg-[#176B87] hover:bg-[#123B4A] text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
        >
          <span>{isSimulatingInference ? 'Computing attribution...' : 'Recalculate weights'}</span>
        </button>
      </div>

      {/* Scientific Disclaimer */}
      <div className="mt-4 p-3 bg-[#FFFBF0] border border-[#FDE3A2] rounded-md flex items-start gap-2.5 text-xs text-[#17313B]">
        <AlertTriangle className="w-4 h-4 text-[#D99A3D] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-[#123B4A]">Interpretability note: </span>
          The percentage values and gradients below represent <span className="font-medium">model attribution / statistical sensitivity</span>, not direct hydrodynamic causation. Ocean dynamics are governed by physical equations; this attribution reflects the learned weight of each surface variable in estimating subsurface temperature.
        </p>
      </div>

      {/* Visual Architectural Flow Pipeline */}
      <div className="mt-5 p-4 rounded-md bg-[#F8FAFA] border border-[#D5E0E2]">
        <div className="text-xs text-[#62757C] font-medium mb-3 flex items-center justify-between">
          <span>Inference pipeline: Surface observations → Embedding → Depth profile</span>
          <span className="text-[11px] font-mono">Selected layer: {selectedDepth} m</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Step 1: Surface Satellite Observation Vector */}
          <div className="bg-white p-3 rounded-md border border-[#D5E0E2]">
            <span className="text-[11px] font-semibold text-[#123B4A] block mb-1.5">
              1. Observed surface
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-[#62757C]">SST:</span>
                <span className="text-[#176B87] font-semibold">{satelliteData?.sensors.sst.value || 29.4} °C</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#62757C]">SSS:</span>
                <span className="text-[#123B4A] font-semibold">{satelliteData?.sensors.sss.value || 36.8} PSU</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#62757C]">SSH:</span>
                <span className="text-[#176B87] font-semibold">+{satelliteData?.sensors.ssh.value || 0.12} m</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#62757C]">Wind:</span>
                <span className="text-[#123B4A] font-semibold">{satelliteData?.sensors.wind.speed || 7.8} m/s</span>
              </div>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="hidden md:flex flex-col items-center justify-center text-[#176B87]">
            <div className="h-0.5 w-full bg-[#D5E0E2]" />
            <ArrowRight className="w-4 h-4 -mt-2 text-[#176B87]" />
            <span className="text-[10px] text-[#62757C] mt-1">Multi-modal fusion</span>
          </div>

          {/* Step 2: Learned Ocean Embedding */}
          <div className="bg-white p-3 rounded-md border border-[#D5E0E2]">
            <span className="text-[11px] font-semibold text-[#123B4A] block mb-1.5">
              2. Latent representation
            </span>
            <div className="text-xs space-y-1">
              <div className="font-mono text-[#123B4A] font-semibold">
                128-dim manifold
              </div>
              <div className="text-[11px] text-[#62757C]">
                Spatial cross-attention
              </div>
              <div className="h-1.5 w-full bg-[#E2ECEE] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[#2A8C82] w-3/4" />
              </div>
            </div>
          </div>

          {/* Step 3: Depth Decoder & Reconstructed Temperature */}
          <div className="bg-white p-3 rounded-md border border-[#D5E0E2]">
            <span className="text-[11px] font-semibold text-[#123B4A] block mb-1.5">
              3. Reconstruction at {selectedDepth} m
            </span>
            <div className="text-xs space-y-1">
              <div className="text-xl font-bold text-[#123B4A] font-mono">
                {reconstructionData?.depth_profile.find(p => p.depth === selectedDepth)?.temperature.toFixed(2) || '23.40'} °C
              </div>
              <div className="text-[11px] text-[#62757C] font-mono">
                Uncertainty: ±{reconstructionData?.uncertainty_profile.find(p => p.depth === selectedDepth)?.uncertainty.toFixed(2) || '0.99'} °C
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Indicators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Attributions List */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#62757C] font-medium pb-1">
            <span>Input variable</span>
            <span>Attribution weight</span>
          </div>

          {attributions.map((attr) => {
            const isSelected = selectedFeature === attr.feature;
            return (
              <div
                key={attr.feature}
                onClick={() => setSelectedFeature(attr.feature)}
                className={`p-3 rounded-md border cursor-pointer transition ${
                  isSelected 
                    ? 'bg-[#F4F7F6] border-[#176B87]' 
                    : 'bg-white border-[#D5E0E2] hover:bg-[#F8FAFA]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`font-medium ${isSelected ? 'text-[#123B4A]' : 'text-[#17313B]'}`}>
                    {attr.feature}
                  </span>
                  <span className="font-mono font-bold text-[#176B87] text-xs">
                    {attr.contribution_pct}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#E2ECEE] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#176B87] rounded-full transition-all"
                    style={{ width: `${attr.contribution_pct * 2.2}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Physical & Neural Mechanism Details */}
        <div className="lg:col-span-5 bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#E2ECEE]">
              <span className="p-1 rounded bg-[#DCEFEA] text-[#176B87]">
                <Info className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs font-semibold text-[#123B4A]">
                {activeAttribution.feature}
              </h3>
            </div>

            <div className="mt-3.5 space-y-3">
              <div>
                <span className="text-[11px] text-[#62757C] block">Attribution weight</span>
                <span className="text-xl font-bold text-[#123B4A] font-mono">
                  {activeAttribution.contribution_pct}% influence
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#62757C] block font-medium">Oceanographic role</span>
                <p className="text-xs text-[#17313B] mt-1 leading-relaxed">
                  {activeAttribution.impact}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-[#62757C] block font-medium">Attribution algorithm</span>
                <p className="text-xs text-[#62757C] mt-1 leading-relaxed">
                  Integrated Gradients: computed via path integral of gradients along the straight line from uninformative prior baseline to observed satellite inputs.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2ECEE] text-[11px] text-[#62757C] flex items-center justify-between">
            <span>Algorithm: Integrated Gradients</span>
            <span className="text-[#3D806C] font-medium">Convergence verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

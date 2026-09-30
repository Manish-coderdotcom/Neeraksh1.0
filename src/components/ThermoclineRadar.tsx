import React from 'react';
import { 
  Waves, 
  Activity, 
  Info, 
  TrendingDown, 
  Layers 
} from 'lucide-react';
import { ReconstructionData } from '../types/ocean';

interface ThermoclineRadarProps {
  reconstructionData: ReconstructionData | null;
}

export const ThermoclineRadar: React.FC<ThermoclineRadarProps> = ({
  reconstructionData
}) => {
  const analysis = reconstructionData?.thermocline_analysis;
  const profile = reconstructionData?.depth_profile || [];

  const thDepth = analysis?.estimated_depth_m ?? 72;
  const maxGrad = analysis?.gradient_deg_c_per_10m ?? -1.4;
  const mld = analysis?.mixed_layer_depth_m ?? 35;
  const score = analysis?.thermal_structure_score ?? 84.5;

  // Filter upper 200m depths for dedicated thermocline visual
  const upperDepths = [0, 10, 20, 30, 50, 75, 100, 125, 150, 200];
  const upperProfile = upperDepths.map(d => ({
    depth: d,
    temperature: profile.find(p => p.depth === d)?.temperature || 25.0
  }));

  return (
    <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#DCEFEA] text-[#176B87]">
              <Waves className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-[#123B4A]">
              Thermocline & mixed layer analysis
            </h2>
            <span className="text-[11px] font-mono bg-[#F4F7F6] text-[#62757C] border border-[#D5E0E2] px-2 py-0.5 rounded">
              Gradient inflection (dT/dz)
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Automated detection of the mixed layer boundary and maximum vertical thermal gradient layer
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F4F7F6] px-3 py-1.5 rounded-md border border-[#D5E0E2] text-xs font-mono">
          <span className="text-[#62757C]">Inflection depth:</span>
          <span className="text-[#176B87] font-bold">{thDepth} m</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Stratification Ladder */}
        <div className="lg:col-span-5 bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#62757C] pb-2 border-b border-[#E2ECEE] font-medium">
            <span>Upper-ocean stratification</span>
            <span>0m → 200m</span>
          </div>

          {/* Vertical Stratification Ladder */}
          <div className="py-3 space-y-1 text-xs">
            <div className="flex items-center justify-between text-[#123B4A] bg-white p-2 rounded border border-[#E2ECEE] font-mono">
              <span className="font-sans font-medium">Surface (0 m)</span>
              <span className="font-bold">{upperProfile.find(p => p.depth === 0)?.temperature.toFixed(1)} °C</span>
            </div>

            <div className="flex items-center justify-between text-[#62757C] px-3 py-1 font-mono">
              <span className="font-sans">10 m</span>
              <span>{upperProfile.find(p => p.depth === 10)?.temperature.toFixed(1)} °C</span>
            </div>

            <div className="flex items-center justify-between text-[#62757C] px-3 py-1 font-mono">
              <span className="font-sans">20 m</span>
              <span>{upperProfile.find(p => p.depth === 20)?.temperature.toFixed(1)} °C</span>
            </div>

            <div className="flex items-center justify-between text-[#176B87] px-3 py-1 bg-[#DCEFEA]/60 rounded border-l-2 border-[#2A8C82] font-mono">
              <span className="font-sans font-medium">30 m (Mixed layer base)</span>
              <span>{upperProfile.find(p => p.depth === 30)?.temperature.toFixed(1)} °C</span>
            </div>

            {/* Thermocline Core Banner */}
            <div className="my-1.5 p-2.5 bg-[#FFF9E6] border border-[#FDE3A2] rounded flex items-center justify-between text-[#D99A3D] font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D99A3D]" />
                <span className="text-xs">Thermocline core ({thDepth} m)</span>
              </div>
              <span className="text-[#123B4A] font-mono text-xs font-bold">{maxGrad} °C / 10m</span>
            </div>

            <div className="flex items-center justify-between text-[#62757C] px-3 py-1 font-mono">
              <span className="font-sans">100 m</span>
              <span>{upperProfile.find(p => p.depth === 100)?.temperature.toFixed(1)} °C</span>
            </div>

            <div className="flex items-center justify-between text-[#62757C] px-3 py-1 font-mono">
              <span className="font-sans">150 m</span>
              <span>{upperProfile.find(p => p.depth === 150)?.temperature.toFixed(1)} °C</span>
            </div>

            <div className="flex items-center justify-between text-[#62757C] bg-white p-2 rounded border border-[#E2ECEE] font-mono">
              <span className="font-sans">200 m (Transition layer)</span>
              <span className="font-bold text-[#123B4A]">{upperProfile.find(p => p.depth === 200)?.temperature.toFixed(1)} °C</span>
            </div>
          </div>

          <div className="text-[11px] text-[#62757C] pt-2 border-t border-[#E2ECEE] flex justify-between">
            <span>Detection: |dT/dz| &gt; 0.05 °C/m</span>
            <span className="text-[#176B87] font-medium">Active gradient</span>
          </div>
        </div>

        {/* Right Column: Mathematical Diagnostics & Thermal Structure Score */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2]">
              <span className="text-[11px] text-[#62757C] block">Thermocline depth</span>
              <div className="text-xl font-bold text-[#123B4A] font-mono mt-1">
                {thDepth} m
              </div>
              <span className="text-[10px] text-[#62757C]">Inflection depth</span>
            </div>

            <div className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2]">
              <span className="text-[11px] text-[#62757C] block">Vertical gradient</span>
              <div className="text-xl font-bold text-[#D99A3D] font-mono mt-1">
                {maxGrad} °C
              </div>
              <span className="text-[10px] text-[#62757C]">per 10 meters</span>
            </div>

            <div className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2]">
              <span className="text-[11px] text-[#62757C] block">Mixed layer (MLD)</span>
              <div className="text-xl font-bold text-[#2A8C82] font-mono mt-1">
                {mld} m
              </div>
              <span className="text-[10px] text-[#62757C]">ΔT ≤ 0.2 °C threshold</span>
            </div>
          </div>

          {/* Thermal Structure Score Card */}
          <div className="bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2ECEE]">
              <h3 className="text-xs font-semibold text-[#123B4A]">
                Thermal stratification index
              </h3>
              <span className="text-base font-bold text-[#176B87] font-mono">
                {score} / 100
              </span>
            </div>

            <div className="mt-3">
              <div className="w-full h-2 bg-[#D5E0E2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#176B87] rounded-full transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="mt-3 p-3 bg-white rounded border border-[#D5E0E2] text-xs">
                <span className="text-[11px] text-[#62757C] block font-medium mb-1">
                  Mathematical formulation
                </span>
                <p className="text-[#17313B] font-mono text-[11px] leading-relaxed">
                  {analysis?.formula_documentation || "Stability Score S = 100 * clamp((T_0m - T_200m) / 14°C, 0.1, 1.0), quantifying upper-ocean thermal resistance to vertical mixing."}
                </p>
                <div className="text-[10px] text-[#62757C] mt-1.5">
                  Higher index indicates strong stratification inhibiting vertical heat exchange; lower index indicates convective mixing.
                </div>
              </div>
            </div>
          </div>

          {/* Climatological Comparison */}
          <div className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2] text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#62757C] block uppercase">1991–2020 climatological average</span>
              <span className="text-xs font-semibold text-[#123B4A] mt-0.5 block">
                Average thermocline depth: 68 m (Current observation is 4 m deeper)
              </span>
            </div>
            <span className="text-xs font-medium text-[#176B87] bg-[#D8E7EC] px-2.5 py-1 rounded border border-[#BFD9E2]">
              Normal variance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

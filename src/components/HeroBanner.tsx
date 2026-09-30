import React, { useState } from 'react';
import { 
  ArrowRight,
  Compass,
  Sliders,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { SatelliteObservation, ReconstructionData } from '../types/ocean';

interface HeroBannerProps {
  satelliteData: SatelliteObservation | null;
  reconstructionData: ReconstructionData | null;
  selectedDepth: number;
  setSelectedDepth: (d: number) => void;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  onExploreClick: () => void;
  onRevealClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  satelliteData,
  reconstructionData,
  selectedDepth,
  setSelectedDepth,
  selectedYear,
  setSelectedYear,
  onExploreClick,
  onRevealClick
}) => {
  const currentTempAtDepth = reconstructionData?.depth_profile.find(p => p.depth === selectedDepth)?.temperature ?? 23.4;
  const currentUncertainty = reconstructionData?.uncertainty_profile.find(p => p.depth === selectedDepth)?.uncertainty ?? 0.75;
  const surfaceTemp = satelliteData?.sensors.sst.value ?? 29.4;
  const sss = satelliteData?.sensors.sss.value ?? 36.8;
  const ssh = satelliteData?.sensors.ssh.value ?? 0.12;

  // Climatology reference periods
  const [referencePeriod, setReferencePeriod] = useState<'1991-2020' | '2001-2020' | '2011-2020'>('1991-2020');

  // Baseline temperature estimate (WOA climatology approximation for selected depth)
  const baselineTempAtDepth = selectedDepth === 0 ? 28.2 : selectedDepth <= 50 ? 22.2 : selectedDepth <= 150 ? 17.5 : 10.4;
  const thermalAnomalyAtDepth = +(currentTempAtDepth - baselineTempAtDepth).toFixed(2);

  const depthValues = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];

  return (
    <div className="bg-[#FFFFFF] border border-[#D5E0E2] rounded-lg p-6 sm:p-7 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Research Introduction & Actions */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#D8E7EC]/60 border border-[#D5E0E2] text-[#123B4A] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#176B87]" />
            Subsurface ocean intelligence
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#123B4A] font-['Plus_Jakarta_Sans'] leading-tight">
              Subsurface ocean temperature: <br />
              <span className="text-[#176B87] font-semibold">understanding what happens beneath the surface.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#62757C] leading-relaxed">
              Neeraksh uses multi-sensor satellite surface observations and learned stratification representations to reconstruct continuous 3D subsurface temperature fields down to 1000 m, calibrated against autonomous in-situ ARGO profiling observations.
            </p>
          </div>

          {/* Clean Scientific CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#176B87] hover:bg-[#123B4A] text-white font-medium text-xs sm:text-sm transition shadow-xs cursor-pointer"
            >
              <span>Explore reconstruction</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onRevealClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#FFFFFF] hover:bg-[#F4F7F6] text-[#17313B] border border-[#D5E0E2] font-medium text-xs sm:text-sm transition cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#176B87]" />
              <span>Compare with ARGO validation</span>
            </button>
          </div>

          {/* Reference Period Selection */}
          <div className="pt-4 border-t border-[#D5E0E2]/80 flex flex-wrap items-center justify-between gap-3 text-xs text-[#62757C]">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#17313B]">Reference period:</span>
              <div className="inline-flex rounded-md border border-[#D5E0E2] p-0.5 bg-[#F4F7F6]">
                {(['1991-2020', '2001-2020', '2011-2020'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setReferencePeriod(period)}
                    className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                      referencePeriod === period 
                        ? 'bg-[#FFFFFF] text-[#123B4A] font-semibold shadow-2xs border border-[#D5E0E2]' 
                        : 'text-[#62757C] hover:text-[#17313B]'
                    }`}
                  >
                    {period.replace('-', '–')}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#62757C]">
              Current observation: <span className="font-semibold text-[#17313B]">September {selectedYear}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Current Ocean Conditions & Controls Panel */}
        <div className="lg:col-span-5 bg-[#F8FAFA] border border-[#D5E0E2] rounded-lg p-5 space-y-5">
          {/* Surface Conditions Section */}
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#D5E0E2]">
              <h2 className="text-xs font-bold text-[#123B4A] uppercase tracking-wider font-mono">
                Current ocean conditions
              </h2>
              <span className="text-[11px] text-[#62757C]">Sentinel-3 / Jason-3</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#D5E0E2]">
                <div className="text-[11px] text-[#62757C]">Sea surface temp</div>
                <div className="text-base font-semibold text-[#123B4A] font-mono mt-0.5">
                  {surfaceTemp.toFixed(1)} °C
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#D5E0E2]">
                <div className="text-[11px] text-[#62757C]">Sea salinity</div>
                <div className="text-base font-semibold text-[#123B4A] font-mono mt-0.5">
                  {sss.toFixed(1)} <span className="text-xs font-normal text-[#62757C]">PSU</span>
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#D5E0E2]">
                <div className="text-[11px] text-[#62757C]">Sea level anomaly</div>
                <div className="text-base font-semibold text-[#123B4A] font-mono mt-0.5">
                  +{ssh.toFixed(2)} <span className="text-xs font-normal text-[#62757C]">m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subsurface Estimate Summary */}
          <div className="pt-3 border-t border-[#D5E0E2] flex items-center justify-between">
            <div>
              <div className="text-xs text-[#62757C]">
                Estimated temperature at {selectedDepth} m:
              </div>
              <div className="text-lg font-bold text-[#123B4A] font-mono mt-0.5">
                {currentTempAtDepth.toFixed(1)} °C <span className="text-xs font-normal text-[#62757C]">± {currentUncertainty.toFixed(2)} °C</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-[#62757C]">Thermal anomaly:</div>
              <div className={`text-sm font-semibold font-mono mt-0.5 ${thermalAnomalyAtDepth >= 0 ? 'text-[#C85C4B]' : 'text-[#176B87]'}`}>
                {thermalAnomalyAtDepth >= 0 ? `+${thermalAnomalyAtDepth.toFixed(1)} °C` : `${thermalAnomalyAtDepth.toFixed(1)} °C`}
              </div>
            </div>
          </div>

          {/* Depth Range Slider */}
          <div className="pt-3 border-t border-[#D5E0E2] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#17313B] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#176B87]" />
                Depth
              </span>
              <span className="font-mono font-semibold text-[#123B4A] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#D5E0E2]">
                {selectedDepth === 0 ? 'Surface (0 m)' : `${selectedDepth} m`}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="14"
              step="1"
              value={depthValues.indexOf(selectedDepth)}
              onChange={(e) => {
                setSelectedDepth(depthValues[parseInt(e.target.value, 10)]);
              }}
              className="w-full h-1.5 bg-[#D5E0E2] rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-[11px] font-mono text-[#62757C]">
              <span>0m</span>
              <span>50m</span>
              <span>150m</span>
              <span>500m</span>
              <span>1000m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

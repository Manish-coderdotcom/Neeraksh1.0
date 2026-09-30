import React, { useState } from 'react';
import { 
  Sliders, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  Wind, 
  Droplets, 
  Layers, 
  Info,
  Thermometer
} from 'lucide-react';
import { ReconstructionData } from '../types/ocean';

interface WhatIfSimulatorProps {
  reconstructionData: ReconstructionData | null;
  onRunSimulation?: (offsets: { sst: number; sss: number; wind: number; ssh: number }) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  reconstructionData
}) => {
  const [sstOffset, setSstOffset] = useState<number>(1.0);
  const [sssOffset, setSssOffset] = useState<number>(0.5);
  const [windRatio, setWindRatio] = useState<number>(1.1); // +10%
  const [sshOffset, setSshOffset] = useState<number>(0.1);

  const resetDefaults = () => {
    setSstOffset(0);
    setSssOffset(0);
    setWindRatio(1.0);
    setSshOffset(0);
  };

  // Compute Baseline vs Counterfactual profile
  // Keyed off each sample's own depth: the old fixed 12-entry `depths` array was
  // indexed by a 15-entry depth_profile, so depths[12..14] were undefined, yCoord
  // returned NaN, and the browser discarded the whole SVG `d` attribute.
  const STANDARD_DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];
  const FALLBACK_TEMPS: Record<number, number> = {
    0: 29.4, 5: 29.35, 10: 29.3, 20: 29.1, 30: 28.9, 50: 28.6, 75: 27.4,
    100: 24.3, 125: 21.4, 150: 18.6, 200: 13.2, 300: 10.1, 500: 7.7, 700: 6.2, 1000: 5.2
  };

  const depths = STANDARD_DEPTHS;
  const apiTempsByDepth = new Map(
    (reconstructionData?.depth_profile ?? []).map(p => [p.depth, p.temperature])
  );
  const baselineTemps = STANDARD_DEPTHS.map(
    d => apiTempsByDepth.get(d) ?? FALLBACK_TEMPS[d] ?? 20
  );

  const simulatedTemps = depths.map((d, i) => {
    const base = baselineTemps[i] ?? 20;
    // Physical response to counterfactual perturbations:
    // SST warms upper 40m
    const surfaceEffect = sstOffset * Math.exp(-d / 45.0);
    // SSH deepens thermocline
    const thermoclineShift = (sshOffset * 40.0) * (d > 40 && d < 150 ? 0.04 : 0.0);
    // Wind deepens mixed layer
    const windMixing = (windRatio - 1.0) * (d < 50 ? -0.2 : 0.3);
    const sim = base + surfaceEffect + thermoclineShift + windMixing;
    return Math.round(sim * 100) / 100;
  });

  return (
    <div className="rounded-2xl glass-panel p-6 border border-cyan-500/25 bg-[#060e20]/90 shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              "What-If?" Counterfactual Surface Simulator
            </h2>
            <span className="text-xs font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded">
              SENSITIVITY EXPERIMENT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate how hypothetical shifts in surface satellite observations would propagate into the reconstructed subsurface thermal structure
          </p>
        </div>

        <button
          onClick={resetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Baseline</span>
        </button>
      </div>

      {/* Mandatory Prominent Scientific Disclaimer */}
      <div className="mt-4 p-3 bg-red-950/40 border border-red-500/50 rounded-xl flex items-center justify-between text-xs text-red-200">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <span className="font-extrabold uppercase tracking-wide text-red-300">
              MODEL SIMULATION — NOT AN OBSERVATION
            </span>
            <span className="block text-slate-300 mt-0.5">
              This interactive sandbox executes sensitivity perturbations across the latent depth decoder. It demonstrates model response dynamics, NOT validated causal real-world physical predictions.
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Profile Comparison on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-5 bg-[#040a16] p-4 rounded-xl border border-slate-800 space-y-4">
          <span className="text-xs font-mono text-cyan-400 uppercase font-bold block pb-1 border-b border-slate-800">
            SURFACE FORCING PERTURBATIONS
          </span>

          {/* SST Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-red-400">
                <Thermometer className="w-3.5 h-3.5" /> SST Delta (ΔSST)
              </span>
              <span className="font-bold text-white">
                {sstOffset > 0 ? `+${sstOffset}` : sstOffset}°C
              </span>
            </div>
            <input
              type="range"
              min="-2.5"
              max="2.5"
              step="0.1"
              value={sstOffset}
              onChange={(e) => setSstOffset(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>-2.5°C</span>
              <span>0°C (Baseline)</span>
              <span>+2.5°C</span>
            </div>
          </div>

          {/* SSS Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-teal-400">
                <Droplets className="w-3.5 h-3.5" /> Salinity Delta (ΔSSS)
              </span>
              <span className="font-bold text-white">
                {sssOffset > 0 ? `+${sssOffset}` : sssOffset} PSU
              </span>
            </div>
            <input
              type="range"
              min="-1.5"
              max="1.5"
              step="0.1"
              value={sssOffset}
              onChange={(e) => setSssOffset(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>-1.5 PSU</span>
              <span>0 PSU</span>
              <span>+1.5 PSU</span>
            </div>
          </div>

          {/* Wind Speed Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-indigo-400">
                <Wind className="w-3.5 h-3.5" /> Wind Stress
              </span>
              <span className="font-bold text-white">
                {Math.round((windRatio - 1.0) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={windRatio}
              onChange={(e) => setWindRatio(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>-30%</span>
              <span>Nominal</span>
              <span>+50%</span>
            </div>
          </div>

          {/* SSH Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-sky-400">
                <Layers className="w-3.5 h-3.5" /> Sea Level Anomaly (ΔSSH)
              </span>
              <span className="font-bold text-white">
                {sshOffset > 0 ? `+${sshOffset}` : sshOffset}m
              </span>
            </div>
            <input
              type="range"
              min="-0.3"
              max="0.3"
              step="0.02"
              value={sshOffset}
              onChange={(e) => setSshOffset(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>-0.3m (Upwelling)</span>
              <span>0m</span>
              <span>+0.3m (Downwelling)</span>
            </div>
          </div>
        </div>

        {/* Profile Comparison Chart */}
        <div className="lg:col-span-7 bg-[#040a16] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-semibold">T(z) Baseline vs Simulated Profile</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-0.5 bg-slate-400" /> Baseline
                </span>
                <span className="flex items-center gap-1 text-purple-400 font-bold">
                  <span className="w-2.5 h-0.5 bg-purple-400" /> Simulated
                </span>
              </div>
            </div>

            <div className="relative w-full h-64 mt-2">
              <svg className="w-full h-full" viewBox="0 0 320 200">
                <line x1="45" y1="15" x2="310" y2="15" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="45" y1="65" x2="310" y2="65" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="45" y1="115" x2="310" y2="115" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="45" y1="165" x2="310" y2="165" stroke="#1e293b" strokeDasharray="2,2" />

                <text x="40" y="19" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">0m</text>
                <text x="40" y="69" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">100m</text>
                <text x="40" y="119" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">300m</text>
                <text x="40" y="169" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">1000m</text>

                {(() => {
                  const xCoord = (t: number) => 45 + ((t - 4) / (34 - 4)) * 265;
                  const yCoord = (d: number) => {
                    if (d <= 100) return 15 + (d / 100) * 50;
                    if (d <= 300) return 65 + ((d - 100) / 200) * 50;
                    return 115 + ((d - 300) / 700) * 75;
                  };

                  const basePoints = baselineTemps.map((t, i) => `${xCoord(t)},${yCoord(depths[i])}`).join(' L ');
                  const simPoints = simulatedTemps.map((t, i) => `${xCoord(t)},${yCoord(depths[i])}`).join(' L ');

                  return (
                    <>
                      {/* Baseline Profile (Grey dashed) */}
                      <path d={`M ${basePoints}`} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3,3" />

                      {/* Simulated Counterfactual Profile (Purple glowing line) */}
                      <path d={`M ${simPoints}`} fill="none" stroke="#c084fc" strokeWidth="2.5" />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          <div className="p-3 bg-[#030713] rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 mt-2 flex justify-between items-center">
            <span>Surface Delta: {sstOffset > 0 ? `+${sstOffset}` : sstOffset}°C</span>
            <span className="text-purple-300 font-bold">
              Subsurface Shift at 75m: +{(() => {
                const i75 = STANDARD_DEPTHS.indexOf(75);
                return ((simulatedTemps[i75] ?? 25) - (baselineTemps[i75] ?? 25)).toFixed(2);
              })()}°C
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  MapPin, 
  Navigation, 
  Info, 
  Maximize2, 
  Thermometer, 
  Compass 
} from 'lucide-react';
import { TransectData } from '../types/ocean';
import { oceanApi } from '../services/oceanApi';

export const OceanCrossSection: React.FC = () => {
  const [transect, setTransect] = useState<TransectData | null>(null);
  const [selectedStationIndex, setSelectedStationIndex] = useState(2);

  useEffect(() => {
    oceanApi.getOceanTransect().then(setTransect);
  }, []);

  const stations = transect?.stations || [];
  const activeStation = stations[selectedStationIndex] || stations[0];

  return (
    <div className="rounded-2xl glass-panel p-6 border border-cyan-500/25 bg-[#060e20]/90 shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Ocean Cross-Section (Vertical Transect)
            </h2>
            <span className="text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded">
              2D DEPTH-DISTANCE CONTOUR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Meridional vertical transect from the Mumbai Continental Shelf to the Equatorial Maldives (1,420 km)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#040a16] px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-400">
          <Navigation className="w-3.5 h-3.5" />
          <span>TRANSECT: MUMBAI → MALDIVES</span>
        </div>
      </div>

      {/* Main Transect Heatmap Canvas View */}
      <div className="mt-6 bg-[#02050f] p-4 rounded-xl border border-cyan-500/20">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
          <span>DISTANCE ALONG TRANSECT (KM)</span>
          <span className="text-amber-400 font-bold">─── DASHED LINE: THERMOCLINE BOUNDARY</span>
          <span>DEPTH: 0m → 1000m</span>
        </div>

        {/* Scientific Transect Contour SVG */}
        <div className="relative w-full h-72">
          <svg className="w-full h-full" viewBox="0 0 600 240">
            {/* Depth strata background colorbands */}
            <defs>
              <linearGradient id="transectGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="15%" stopColor="#f97316" stopOpacity="0.75" />
                <stop offset="35%" stopColor="#14b8a6" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Ocean Water Column Fill */}
            <rect x="50" y="20" width="530" height="190" fill="url(#transectGrad)" rx="4" />

            {/* Depth Tick Marks */}
            <line x1="50" y1="20" x2="580" y2="20" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.3" />
            <line x1="50" y1="60" x2="580" y2="60" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.2" />
            <line x1="50" y1="110" x2="580" y2="110" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.2" />
            <line x1="50" y1="160" x2="580" y2="160" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.2" />
            <line x1="50" y1="210" x2="580" y2="210" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.3" />

            <text x="45" y="24" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">0m</text>
            <text x="45" y="64" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">75m</text>
            <text x="45" y="114" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">200m</text>
            <text x="45" y="164" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">500m</text>
            <text x="45" y="214" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">1000m</text>

            {/* Station Vertical Columns */}
            {stations.map((st, i) => {
              const x = 50 + (st.dist_km / 1420) * 530;
              const isSelected = selectedStationIndex === i;

              return (
                <g key={st.station} className="cursor-pointer" onClick={() => setSelectedStationIndex(i)}>
                  <line x1={x} y1="20" x2={x} y2="210" stroke={isSelected ? '#00e5ff' : '#ffffff'} strokeWidth={isSelected ? 2 : 1} strokeDasharray={isSelected ? 'none' : '2,2'} strokeOpacity={isSelected ? 1 : 0.4} />
                  <circle cx={x} cy="20" r={isSelected ? 5 : 3.5} fill={isSelected ? '#00e5ff' : '#f59e0b'} />
                  <text x={x} y="15" fill={isSelected ? '#00e5ff' : '#cbd5e1'} fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight={isSelected ? 'bold' : 'normal'}>
                    {st.station}
                  </text>
                </g>
              );
            })}

            {/* Dynamic Thermocline Boundary Line across transect */}
            {(() => {
              if (stations.length === 0) return null;
              const pathPoints = stations.map(st => {
                const x = 50 + (st.dist_km / 1420) * 530;
                // Map thermocline depth 55-110m to y 50-80
                const y = 20 + (st.thermocline_depth / 200) * 90;
                return `${x},${y}`;
              }).join(' L ');

              return (
                <>
                  <path d={`M ${pathPoints}`} fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,4" />
                  <text x="560" y="70" fill="#f59e0b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end" fontWeight="bold">
                    THERMOCLINE DEEPENING
                  </text>
                </>
              );
            })()}

            {/* Distance labels at bottom */}
            <text x="50" y="225" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono">0 km (Mumbai)</text>
            <text x="260" y="225" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono">580 km (Central Basin)</text>
            <text x="580" y="225" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">1,420 km (Maldives)</text>
          </svg>
        </div>

        {/* Legend color bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span>4°C (Deep Ocean)</span>
            <div className="w-36 h-2 rounded bg-gradient-to-r from-[#1e1b4b] via-[#0284c7] via-[#14b8a6] via-[#f97316] to-[#ef4444]" />
            <span>30°C (Surface)</span>
          </div>
          <span className="text-cyan-400 font-bold">
            Selected: {activeStation?.station} ({activeStation?.dist_km} km)
          </span>
        </div>
      </div>
    </div>
  );
};

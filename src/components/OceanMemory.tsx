import React, { useState } from 'react';
import { 
  Database, 
  History, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Layers,
  Thermometer
} from 'lucide-react';
import { ReconstructionData } from '../types/ocean';

interface OceanMemoryProps {
  reconstructionData: ReconstructionData | null;
  selectedRegion: string;
}

interface HistoricalAnalog {
  date: string;
  similarity: number;
  condition: string;
  mld: number;
  thermocline: number;
  outcome: string;
  profileTemps: number[];
}

export const OceanMemory: React.FC<OceanMemoryProps> = ({
  reconstructionData,
  selectedRegion
}) => {
  const [activeAnalogDate, setActiveAnalogDate] = useState<string>("August 2024");

  const analogs: HistoricalAnalog[] = [
    {
      date: "August 2024",
      similarity: 91,
      condition: "Late summer monsoon retreat",
      mld: 34,
      thermocline: 70,
      outcome: "Mild subsurface thermal elevation persisted for 4 weeks before winter convective cooling deepened the mixed layer.",
      profileTemps: [29.1, 29.0, 28.9, 28.7, 28.5, 27.2, 24.1, 21.0, 18.5, 16.2, 13.1, 10.2, 7.8, 6.1, 5.1]
    },
    {
      date: "September 2022",
      similarity: 88,
      condition: "Negative Indian Ocean Dipole (IOD)",
      mld: 36,
      thermocline: 74,
      outcome: "Downwelling planetary waves deepened the thermocline, reducing coastal upwelling along the western boundary.",
      profileTemps: [29.6, 29.5, 29.3, 29.1, 28.8, 27.8, 24.8, 21.6, 19.0, 16.8, 13.5, 10.4, 7.9, 6.2, 5.2]
    },
    {
      date: "October 2021",
      similarity: 84,
      condition: "Inter-monsoon atmospheric calm",
      mld: 30,
      thermocline: 68,
      outcome: "Shallow mixed layer led to elevated sea surface heating followed by moderate wind-induced mixing.",
      profileTemps: [29.2, 29.1, 29.0, 28.6, 28.2, 26.5, 23.5, 20.4, 17.9, 15.6, 12.8, 9.9, 7.6, 6.0, 5.0]
    },
    {
      date: "September 2020",
      similarity: 81,
      condition: "La Niña teleconnection",
      mld: 38,
      thermocline: 76,
      outcome: "Moderate surface temperatures with subsurface salinity intrusion from the northern Arabian Sea.",
      profileTemps: [28.9, 28.8, 28.7, 28.5, 28.2, 27.0, 24.2, 21.3, 18.8, 16.5, 13.2, 10.1, 7.7, 6.1, 5.1]
    }
  ];

  const currentTemps = reconstructionData?.depth_profile.map(p => p.temperature) || [
    29.4, 29.3, 29.1, 28.9, 28.6, 27.4, 24.3, 21.2, 18.6, 16.4, 13.2, 10.1, 7.7, 6.1, 5.2
  ];

  const activeAnalog = analogs.find(a => a.date === activeAnalogDate) || analogs[0];

  return (
    <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#DCEFEA] text-[#176B87]">
              <Database className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-[#123B4A]">
              Ocean memory: historical analog search
            </h2>
            <span className="text-[11px] font-mono bg-[#F4F7F6] text-[#62757C] border border-[#D5E0E2] px-2 py-0.5 rounded">
              Latent space similarity
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Matches the current multi-parameter ocean state with historical satellite-ARGO records to reveal recurring stratification patterns
          </p>
        </div>

        <div className="bg-[#F4F7F6] px-3 py-1.5 rounded-md border border-[#D5E0E2] text-xs font-mono text-[#176B87]">
          Region: {reconstructionData?.region_name || 'Arabian Sea'}
        </div>
      </div>

      {/* Scientific distinction note */}
      <div className="mt-4 p-3 bg-[#F8FAFA] border border-[#D5E0E2] rounded-md flex items-start gap-2.5 text-xs text-[#17313B]">
        <AlertTriangle className="w-4 h-4 text-[#176B87] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[#62757C]">
          <span className="font-semibold text-[#123B4A]">Episodic analog matching: </span>
          Ocean Memory identifies historical periods with similar multi-sensor satellite embeddings and stratification states to contextualize current observations within decadal ocean variability.
        </p>
      </div>

      {/* Main engine comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Current State vs Historical Matches */}
        <div className="lg:col-span-5 space-y-4">
          {/* Current State Card */}
          <div className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2]">
            <div className="flex items-center justify-between text-xs text-[#62757C] pb-2 border-b border-[#E2ECEE] font-medium">
              <span>Current observation</span>
              <span className="font-mono">September 2026</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#123B4A] block">
                  {reconstructionData?.region_name || 'Arabian Sea'}
                </span>
                <span className="text-[11px] text-[#62757C] font-mono">
                  SST 29.4°C • SSS 36.8 PSU • SSH +0.12m
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-[#176B87] font-bold block">128-dim</span>
                <span className="text-[10px] text-[#62757C]">Embedding</span>
              </div>
            </div>
          </div>

          {/* Historical Analogs List */}
          <div>
            <span className="text-xs text-[#62757C] uppercase block mb-2 font-medium">
              Similar historical periods
            </span>

            <div className="space-y-2">
              {analogs.map((a) => {
                const isActive = activeAnalogDate === a.date;
                return (
                  <div
                    key={a.date}
                    onClick={() => setActiveAnalogDate(a.date)}
                    className={`p-3 rounded-md border cursor-pointer transition ${
                      isActive 
                        ? 'bg-[#F4F7F6] border-[#176B87]' 
                        : 'bg-white border-[#D5E0E2] hover:bg-[#F8FAFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-3.5 h-3.5 ${isActive ? 'text-[#176B87]' : 'text-[#62757C]'}`} />
                        <span className={`text-xs font-semibold ${isActive ? 'text-[#123B4A]' : 'text-[#17313B]'}`}>
                          {a.date}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-medium text-[#2A8C82] bg-[#DCEFEA] px-2 py-0.5 rounded border border-[#BCE3DA]">
                        {a.similarity}% match
                      </span>
                    </div>

                    <p className="text-[11px] text-[#62757C] mt-1.5">
                      {a.condition}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Subsurface Profile Overlay & Outcome */}
        <div className="lg:col-span-7 bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2ECEE]">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#DCEFEA] text-[#176B87]">
                  <Thermometer className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-xs font-semibold text-[#123B4A]">
                  Profile comparison: Current vs {activeAnalog.date}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#62757C]">
                15 depth strata
              </span>
            </div>

            {/* Profile Comparison Chart */}
            <div className="relative w-full h-56 mt-4">
              <svg className="w-full h-full" viewBox="0 0 320 200">
                {/* Depth Grid Lines */}
                <line x1="50" y1="20" x2="310" y2="20" stroke="#E2ECEE" strokeDasharray="2,2" />
                <line x1="50" y1="65" x2="310" y2="65" stroke="#E2ECEE" strokeDasharray="2,2" />
                <line x1="50" y1="110" x2="310" y2="110" stroke="#E2ECEE" strokeDasharray="2,2" />
                <line x1="50" y1="155" x2="310" y2="155" stroke="#E2ECEE" strokeDasharray="2,2" />
                <line x1="50" y1="190" x2="310" y2="190" stroke="#D5E0E2" />

                <text x="45" y="24" fill="#62757C" fontSize="8" fontFamily="Inter" textAnchor="end">0m</text>
                <text x="45" y="69" fill="#62757C" fontSize="8" fontFamily="Inter" textAnchor="end">100m</text>
                <text x="45" y="114" fill="#62757C" fontSize="8" fontFamily="Inter" textAnchor="end">250m</text>
                <text x="45" y="159" fill="#62757C" fontSize="8" fontFamily="Inter" textAnchor="end">500m</text>
                <text x="45" y="194" fill="#62757C" fontSize="8" fontFamily="Inter" textAnchor="end">1000m</text>

                {(() => {
                  const depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];
                  const xCoord = (temp: number) => 50 + ((temp - 4) / (32 - 4)) * 260;
                  const yCoord = (depth: number) => {
                    if (depth <= 100) return 20 + (depth / 100) * 45;
                    if (depth <= 250) return 65 + ((depth - 100) / 150) * 45;
                    return 110 + ((depth - 250) / 750) * 80;
                  };

                  const curPoints = currentTemps.map((t, i) => `${xCoord(t)},${yCoord(depths[i])}`).join(' L ');
                  const analogPoints = activeAnalog.profileTemps.map((t, i) => `${xCoord(t)},${yCoord(depths[i])}`).join(' L ');

                  return (
                    <>
                      {/* Historical Analog Profile (Navy dashed line) */}
                      <path d={`M ${analogPoints}`} fill="none" stroke="#123B4A" strokeWidth="2" strokeDasharray="4,4" />

                      {/* Current Reconstructed Profile (Teal solid line) */}
                      <path d={`M ${curPoints}`} fill="none" stroke="#2A8C82" strokeWidth="2.5" />
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Profile Legend */}
            <div className="flex items-center justify-between text-xs text-[#62757C] mt-2 pt-2 border-t border-[#E2ECEE]">
              <span className="flex items-center gap-1.5 text-[#2A8C82] font-medium">
                <span className="w-3 h-0.5 bg-[#2A8C82]" /> Current profile (Sep 2026)
              </span>
              <span className="flex items-center gap-1.5 text-[#123B4A] font-medium">
                <span className="w-3 h-0.5 bg-[#123B4A] border-b border-dashed" /> Historical analog ({activeAnalog.date})
              </span>
            </div>
          </div>

          {/* Historical Observation Outcome */}
          <div className="mt-4 p-3 bg-white rounded border border-[#D5E0E2] text-xs">
            <span className="text-[11px] text-[#123B4A] font-semibold block mb-1">
              Historical outcome record ({activeAnalog.date})
            </span>
            <p className="text-[#62757C] leading-relaxed">
              "{activeAnalog.outcome}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

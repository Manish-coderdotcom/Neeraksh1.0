import React, { useState } from 'react';
import { 
  Cpu, 
  GitBranch, 
  BarChart3, 
  Layers, 
  Award, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const ModelLab: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'rmse' | 'mae' | 'bias' | 'r2'>('rmse');

  // Baseline comparison data across depth bands
  const depthBands = [
    { band: "0–30 m (Mixed layer)", baselineRmse: 0.58, neerakshRmse: 0.22, baselineMae: 0.44, neerakshMae: 0.18, baselineR2: 0.88, neerakshR2: 0.99 },
    { band: "30–100 m (Thermocline)", baselineRmse: 1.42, neerakshRmse: 0.65, baselineMae: 1.15, neerakshMae: 0.48, baselineR2: 0.74, neerakshR2: 0.96 },
    { band: "100–300 m (Transition)", baselineRmse: 0.89, neerakshRmse: 0.41, baselineMae: 0.71, neerakshMae: 0.31, baselineR2: 0.82, neerakshR2: 0.97 },
    { band: "300–1000 m (Abyssal)", baselineRmse: 0.38, neerakshRmse: 0.18, baselineMae: 0.31, neerakshMae: 0.14, baselineR2: 0.92, neerakshR2: 0.99 }
  ];

  return (
    <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#DCEFEA] text-[#009FE3]">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-[#071B33]">
              Model architecture & benchmark
            </h2>
            <span className="text-[11px] font-mono bg-[#F4F9FC] text-[#62757C] border border-[#D5E0E2] px-2 py-0.5 rounded">
              Ablation & benchmark study
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Quantitative research benchmark comparing OceanEmbed against standard climatological baseline and feed-forward MLP
          </p>
        </div>

        <div className="text-xs font-mono text-[#009FE3] bg-[#F4F9FC] px-3 py-1.5 rounded-md border border-[#D5E0E2]">
          Architecture: Latent Transformer + Attention-MLP Decoder
        </div>
      </div>

      {/* Model Architecture Specs Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
        <div className="bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2]">
          <span className="text-[10px] text-[#62757C] uppercase block font-medium">Model architecture</span>
          <span className="text-xs font-semibold text-[#071B33] font-mono mt-1 block">ViT-Latent-2.4</span>
        </div>
        <div className="bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2]">
          <span className="text-[10px] text-[#62757C] uppercase block font-medium">Input channels</span>
          <span className="text-xs font-semibold text-[#009FE3] font-mono mt-1 block">5 Surface variables</span>
        </div>
        <div className="bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2]">
          <span className="text-[10px] text-[#62757C] uppercase block font-medium">Embedding dim</span>
          <span className="text-xs font-semibold text-[#071B33] font-mono mt-1 block">128 Latent dim</span>
        </div>
        <div className="bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2]">
          <span className="text-[10px] text-[#62757C] uppercase block font-medium">Depth levels</span>
          <span className="text-xs font-semibold text-[#009FE3] font-mono mt-1 block">15 Coincident</span>
        </div>
        <div className="bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2]">
          <span className="text-[10px] text-[#62757C] uppercase block font-medium">Training profiles</span>
          <span className="text-xs font-semibold text-[#071B33] font-mono mt-1 block">114,000 ARGO</span>
        </div>
        <div className="bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2]">
          <span className="text-[10px] text-[#62757C] uppercase block font-medium">Validation split</span>
          <span className="text-xs font-semibold text-[#62757C] font-mono mt-1 block">14,250 Profiles</span>
        </div>
        <div className="bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2]">
          <span className="text-[10px] text-[#62757C] uppercase block font-medium">Test holdout</span>
          <span className="text-xs font-semibold text-[#009FE3] font-mono mt-1 block">14,250 Profiles</span>
        </div>
      </div>

      {/* Comparative Performance Section */}
      <div className="mt-6 bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E2ECEE]">
          <div>
            <h3 className="text-xs font-semibold text-[#071B33] uppercase tracking-wide">
              Baseline Model vs OceanEmbed Performance Across Depth Strata
            </h3>
            <p className="text-xs text-[#62757C] mt-0.5">
              Evaluated on independent holdout ARGO profiling floats
            </p>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-[#D5E0E2] text-xs">
            <button
              onClick={() => setSelectedMetric('rmse')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                selectedMetric === 'rmse' ? 'bg-[#009FE3] text-white font-medium shadow-xs' : 'text-[#62757C] hover:text-[#071B33]'
              }`}
            >
              RMSE (°C)
            </button>
            <button
              onClick={() => setSelectedMetric('mae')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                selectedMetric === 'mae' ? 'bg-[#009FE3] text-white font-medium shadow-xs' : 'text-[#62757C] hover:text-[#071B33]'
              }`}
            >
              MAE (°C)
            </button>
            <button
              onClick={() => setSelectedMetric('r2')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                selectedMetric === 'r2' ? 'bg-[#009FE3] text-white font-medium shadow-xs' : 'text-[#62757C] hover:text-[#071B33]'
              }`}
            >
              R² Score
            </button>
          </div>
        </div>

        {/* Comparative Bars Grid */}
        <div className="space-y-3 mt-4">
          {depthBands.map((band) => {
            const baselineVal = selectedMetric === 'rmse' ? band.baselineRmse : selectedMetric === 'mae' ? band.baselineMae : band.baselineR2;
            const modelVal = selectedMetric === 'rmse' ? band.neerakshRmse : selectedMetric === 'mae' ? band.neerakshMae : band.neerakshR2;
            const improvementPct = Math.round(((baselineVal - modelVal) / baselineVal) * 100);

            return (
              <div key={band.band} className="bg-white p-3.5 rounded-md border border-[#D5E0E2]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#071B33]">{band.band}</span>
                  <span className="text-[#3D806C] font-semibold text-xs">
                    {selectedMetric === 'r2' ? `+${Math.round((modelVal - baselineVal) * 100)}% higher correlation` : `${improvementPct}% error reduction`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Baseline bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-[#62757C] mb-1">
                      <span>Baseline (Climatology + MLP):</span>
                      <span className="text-[#071B33] font-bold">{baselineVal}{selectedMetric !== 'r2' ? ' °C' : ''}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E2ECEE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#A0B0B5] rounded-full"
                        style={{ width: `${Math.min(100, (baselineVal / 1.5) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* OceanEmbed bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-[#009FE3] mb-1 font-semibold">
                      <span>OceanEmbed (Latent Transformer):</span>
                      <span className="text-[#071B33] font-bold">{modelVal}{selectedMetric !== 'r2' ? ' °C' : ''}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E2ECEE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#009FE3] rounded-full"
                        style={{ width: `${Math.min(100, (modelVal / 1.5) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

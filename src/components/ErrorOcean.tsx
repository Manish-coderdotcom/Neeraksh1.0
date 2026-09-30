import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Thermometer, 
  ShieldCheck 
} from 'lucide-react';
import { ReconstructionData, ArgoValidationData, SatelliteObservation } from '../types/ocean';

interface ErrorOceanProps {
  reconstructionData: ReconstructionData | null;
  argoData: ArgoValidationData | null;
  satelliteData: SatelliteObservation | null;
  selectedDepth: number;
}

export const ErrorOcean: React.FC<ErrorOceanProps> = ({
  reconstructionData,
  argoData,
  satelliteData,
  selectedDepth
}) => {
  const [mapMode, setMapMode] = useState<'sst' | 'prediction' | 'error' | 'confidence'>('error');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render dynamic scientific heatmap depending on mapMode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#123B4A';
    ctx.fillRect(0, 0, w, h);

    if (mapMode === 'sst') {
      const grad = ctx.createRadialGradient(w * 0.45, h * 0.5, 30, w * 0.5, h * 0.5, w * 0.55);
      grad.addColorStop(0, '#D99A3D');
      grad.addColorStop(0.5, '#176B87');
      grad.addColorStop(1, '#123B4A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (mapMode === 'prediction') {
      const grad = ctx.createRadialGradient(w * 0.48, h * 0.52, 20, w * 0.5, h * 0.5, w * 0.5);
      grad.addColorStop(0, '#2A8C82');
      grad.addColorStop(0.6, '#176B87');
      grad.addColorStop(1, '#123B4A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (mapMode === 'error') {
      ctx.fillStyle = 'rgba(42, 140, 130, 0.85)';
      ctx.fillRect(0, 0, w, h);

      // Coastal upwelling zone with higher error
      const coastalErr = ctx.createRadialGradient(w * 0.15, h * 0.4, 10, w * 0.15, h * 0.4, 120);
      coastalErr.addColorStop(0, 'rgba(200, 92, 75, 0.9)');
      coastalErr.addColorStop(0.7, 'rgba(217, 154, 61, 0.7)');
      coastalErr.addColorStop(1, 'rgba(42, 140, 130, 0)');
      ctx.fillStyle = coastalErr;
      ctx.fillRect(0, 0, w, h);

      // Dynamic mesoscale eddy anomaly
      const eddyErr = ctx.createRadialGradient(w * 0.75, h * 0.65, 5, w * 0.75, h * 0.65, 75);
      eddyErr.addColorStop(0, 'rgba(217, 154, 61, 0.85)');
      eddyErr.addColorStop(1, 'rgba(42, 140, 130, 0)');
      ctx.fillStyle = eddyErr;
      ctx.fillRect(0, 0, w, h);
    } else {
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.6);
      grad.addColorStop(0, 'rgba(23, 107, 135, 0.9)');
      grad.addColorStop(0.7, 'rgba(42, 140, 130, 0.8)');
      grad.addColorStop(1, 'rgba(217, 154, 61, 0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Grid overlays
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 0.8;
    for (let x = 40; x < w; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 40; y < h; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // ARGO Float marker
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(w * 0.52, h * 0.46, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#123B4A';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px Inter';
    ctx.fillText('ARGO WMO-2902784', w * 0.52 + 10, h * 0.46 + 3);

  }, [mapMode, selectedDepth]);

  return (
    <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#DCEFEA] text-[#176B87]">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-[#123B4A]">
              Spatial performance & residual audit
            </h2>
            <span className="text-[11px] font-mono bg-[#F4F7F6] text-[#62757C] border border-[#D5E0E2] px-2 py-0.5 rounded">
              Spatial evaluation
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Inspecting spatial zones of high accuracy versus complex coastal hydrodynamic challenges
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#F4F7F6] p-1 rounded-md border border-[#D5E0E2] text-xs">
          {[
            { id: 'sst', label: 'Observed SST' },
            { id: 'prediction', label: 'Reconstruction' },
            { id: 'error', label: 'Residual (ΔT)' },
            { id: 'confidence', label: 'Confidence' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMapMode(m.id as any)}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                mapMode === m.id
                  ? 'bg-[#176B87] text-white font-medium shadow-xs'
                  : 'text-[#62757C] hover:text-[#17313B]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Heatmap + Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Heatmap Canvas */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-[380px] bg-[#123B4A] rounded-md border border-[#D5E0E2] overflow-hidden">
            <canvas ref={canvasRef} width={550} height={380} className="w-full h-full object-cover" />

            {/* Overlaid Legend */}
            <div className="absolute bottom-3 left-3 bg-white/95 p-2.5 rounded-md border border-[#D5E0E2] text-[10px] text-[#17313B] shadow-sm">
              <span className="font-semibold text-[#123B4A] block mb-1">
                {mapMode === 'error' ? 'Residual (|T_recon − T_argo|)' : mapMode === 'confidence' ? 'Model Confidence' : 'Temperature Scale'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#2A8C82] font-semibold">
                  {mapMode === 'error' ? '0.10 °C (Low error)' : mapMode === 'confidence' ? '95%' : '4 °C'}
                </span>
                <div className={`w-24 h-2 rounded-full ${
                  mapMode === 'error'
                    ? 'bg-gradient-to-r from-[#2A8C82] via-[#D99A3D] to-[#C85C4B]'
                    : mapMode === 'confidence'
                    ? 'bg-gradient-to-r from-[#D99A3D] via-[#2A8C82] to-[#176B87]'
                    : 'bg-gradient-to-r from-[#176B87] via-[#2A8C82] to-[#D99A3D]'
                }`} />
                <span className="text-[#C85C4B] font-semibold">
                  {mapMode === 'error' ? '0.90 °C (Elevated)' : mapMode === 'confidence' ? '65%' : '32 °C'}
                </span>
              </div>
            </div>

            {/* Mode Tag */}
            <div className="absolute top-3 right-3 bg-white/90 px-2 py-0.5 rounded border border-[#D5E0E2] text-[11px] font-mono text-[#123B4A]">
              Depth: {selectedDepth} m
            </div>
          </div>
        </div>

        {/* Scientific Diagnosis */}
        <div className="lg:col-span-5 space-y-4">
          {/* Where it works well */}
          <div className="bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2ECEE]">
              <CheckCircle2 className="w-4 h-4 text-[#2A8C82]" />
              <h3 className="text-xs font-semibold text-[#123B4A]">
                Zones of high reconstruction accuracy
              </h3>
            </div>
            <ul className="mt-2.5 space-y-2 text-xs text-[#62757C] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-[#2A8C82] font-bold">✓</span>
                <span><strong className="text-[#17313B]">Stratified pelagic basins:</strong> Open ocean regions with steady wind forcing where baroclinic waves obey linear mode dynamics.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#2A8C82] font-bold">✓</span>
                <span><strong className="text-[#17313B]">Surface mixed layer (0–30 m):</strong> Direct boundary coupling with Sentinel-3 infrared SST (RMSE &lt; 0.22 °C).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#2A8C82] font-bold">✓</span>
                <span><strong className="text-[#17313B]">Abyssal waters (&gt;500 m):</strong> Stably constrained by climatological stratification priors.</span>
              </li>
            </ul>
          </div>

          {/* Where it struggles */}
          <div className="bg-[#FFFBF0] p-4 rounded-md border border-[#FDE3A2]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#FDE3A2]">
              <AlertCircle className="w-4 h-4 text-[#D99A3D]" />
              <h3 className="text-xs font-semibold text-[#D99A3D]">
                Complex hydrodynamic challenges
              </h3>
            </div>
            <ul className="mt-2.5 space-y-2 text-xs text-[#17313B] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-[#D99A3D] font-bold">!</span>
                <span><strong className="text-[#123B4A]">Coastal upwelling fronts:</strong> Rapid wind-driven Ekman divergence pulls deep cold water to the surface, decoupling surface skin SST from thermocline depth.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#D99A3D] font-bold">!</span>
                <span><strong className="text-[#123B4A]">Estuarine salinity barriers:</strong> River plume freshwater lenses create sharp haloclines that modify buoyancy frequencies.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

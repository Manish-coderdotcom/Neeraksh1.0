import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Satellite, 
  Cpu, 
  Layers, 
  Compass, 
  ShieldCheck, 
  RotateCw,
  Waves
} from 'lucide-react';
import { ReconstructionData, ArgoValidationData, SatelliteObservation } from '../types/ocean';

interface RevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  reconstructionData: ReconstructionData | null;
  argoData: ArgoValidationData | null;
  satelliteData: SatelliteObservation | null;
}

export const RevealModal: React.FC<RevealModalProps> = ({
  isOpen,
  onClose,
  reconstructionData,
  argoData,
  satelliteData
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      return;
    }

    if (isAutoPlaying) {
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= 6) {
            setIsAutoPlaying(false);
            return 6;
          }
          return prev + 1;
        });
      }, 2400);
      return () => clearInterval(timer);
    }
  }, [isOpen, isAutoPlaying]);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: "Surface satellite observations",
      desc: "Sentinel-3, SMAP, Jason-3, and ASCAT provide observations of sea surface temperature, salinity, and dynamic topography.",
      icon: Satellite,
    },
    {
      num: 2,
      title: "Learned ocean representations",
      desc: "Multi-head attention maps surface variables into a 128-dimensional latent space capturing air-sea baroclinic state.",
      icon: Cpu,
    },
    {
      num: 3,
      title: "Subsurface vertical reconstruction",
      desc: "Physics-informed depth decoders reconstruct continuous temperature profiles across 15 strata down to 1000 m.",
      icon: Layers,
    },
    {
      num: 4,
      title: "Thermocline & mixed layer analysis",
      desc: "Reconstructions identify the thermocline inflection depth and compute vertical temperature gradient metrics.",
      icon: Waves,
    },
    {
      num: 5,
      title: "ARGO in-situ float validation",
      desc: "Autonomous CTD profiler observations provide direct ground-truth comparison (RMSE 0.38 °C, Pearson r = 0.9942).",
      icon: Compass,
    },
    {
      num: 6,
      title: "Verified subsurface intelligence",
      desc: "Calibrated outputs provide operational researchers with reliable subsurface ocean temperature profiles.",
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-lg border border-[#D5E0E2] p-6 sm:p-8 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-md text-[#62757C] hover:text-[#071B33] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-left">
          <span className="text-[11px] font-mono text-[#009FE3] bg-[#DCEFEA] px-2 py-0.5 rounded border border-[#BCE3DA] uppercase font-medium">
            System overview
          </span>
          <h2 className="text-xl font-semibold text-[#071B33] mt-2">
            Subsurface temperature reconstruction workflow
          </h2>
          <p className="text-xs text-[#62757C] mt-1">
            How satellite surface measurements translate into validated 3D subsurface temperature profiles
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="mt-6 grid grid-cols-6 gap-2">
          {steps.map((st) => {
            const isCompleted = currentStep >= st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div
                key={st.num}
                onClick={() => { setCurrentStep(st.num); setIsAutoPlaying(false); }}
                className="cursor-pointer flex flex-col items-center gap-1.5"
              >
                <div className={`h-1.5 w-full rounded-full transition-all ${
                  isCurrent ? 'bg-[#009FE3]' : isCompleted ? 'bg-[#009FE3]' : 'bg-[#E2ECEE]'
                }`} />
                <span className={`text-[10px] font-mono ${
                  isCurrent ? 'text-[#071B33] font-bold' : isCompleted ? 'text-[#62757C]' : 'text-[#A0B0B5]'
                }`}>
                  0{st.num}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Stage Display Card */}
        <div className="mt-6 bg-[#F8FAFA] p-6 rounded-md border border-[#D5E0E2]">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {(() => {
              const active = steps[currentStep - 1];
              const Icon = active.icon;
              return (
                <div className="w-14 h-14 rounded-md bg-[#DCEFEA] text-[#009FE3] flex items-center justify-center shrink-0 border border-[#BCE3DA]">
                  <Icon className="w-7 h-7" />
                </div>
              );
            })()}

            <div className="flex-1 text-center sm:text-left">
              <span className="text-[11px] font-mono uppercase text-[#62757C] block mb-1">
                Step 0{currentStep} of 06
              </span>
              <h3 className="text-base font-semibold text-[#071B33]">
                {steps[currentStep - 1].title}
              </h3>
              <p className="text-xs text-[#62757C] mt-1.5 leading-relaxed">
                {steps[currentStep - 1].desc}
              </p>
            </div>
          </div>

          {currentStep === 6 && (
            <div className="mt-5 pt-4 border-t border-[#D5E0E2] text-xs text-[#071B33] leading-relaxed">
              <span className="font-semibold text-[#071B33]">Core methodology summary: </span>
              OceanEmbed bridges the observational gap between satellite surface remote sensing and autonomous profiling floats, providing researchers with estimated 3D subsurface temperature profiles benchmarked against in-situ ARGO observations.
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#E2ECEE]">
          <button
            onClick={() => { setCurrentStep(1); setIsAutoPlaying(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-[#62757C] hover:text-[#071B33] bg-[#F4F9FC] border border-[#D5E0E2] transition cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                  setIsAutoPlaying(false);
                }
              }}
              disabled={currentStep === 1}
              className="px-3 py-1.5 rounded-md text-xs bg-[#F4F9FC] text-[#62757C] border border-[#D5E0E2] hover:bg-[#E8F0F2] disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>

            {currentStep < 6 ? (
              <button
                onClick={() => {
                  setCurrentStep(currentStep + 1);
                  setIsAutoPlaying(false);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#009FE3] hover:bg-[#071B33] text-white text-xs font-medium transition cursor-pointer"
              >
                <span>Next step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-md bg-[#009FE3] hover:bg-[#071B33] text-white text-xs font-medium transition cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

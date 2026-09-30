import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  Info
} from 'lucide-react';

import { 
  SatelliteObservation, 
  ReconstructionData, 
  ArgoValidationData, 
  OceanAnomalyData 
} from './types/ocean';
import { oceanApi } from './services/oceanApi';

// Component imports
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { SubsurfaceDigitalTwin } from './components/SubsurfaceDigitalTwin';
import { AiXRay } from './components/AiXRay';
import { EmbeddingConstellation } from './components/EmbeddingConstellation';
import { OceanMemory } from './components/OceanMemory';
import { TimeMachine } from './components/TimeMachine';
import { ThermoclineRadar } from './components/ThermoclineRadar';
import { TrustMeter } from './components/TrustMeter';
import { ArgoTruthCheck } from './components/ArgoTruthCheck';
import { ErrorOcean } from './components/ErrorOcean';
import { OceanAnomalyDetector } from './components/OceanAnomalyDetector';
import { OceanCrossSection } from './components/OceanCrossSection';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { AiOceanScientist } from './components/AiOceanScientist';
import { DataQualityCenter } from './components/DataQualityCenter';
import { ModelLab } from './components/ModelLab';
import { RevealModal } from './components/RevealModal';
import { MethodologyModal } from './components/MethodologyModal';
import { MarineTemperatureImpactPredictor } from './components/MarineTemperatureImpactPredictor';

export const App: React.FC = () => {
  // Navigation & Region state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedRegion, setSelectedRegion] = useState<string>('arabian_sea');
  const [selectedDepth, setSelectedDepth] = useState<number>(50);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Modals state
  const [isRevealOpen, setIsRevealOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Data state
  const [satelliteData, setSatelliteData] = useState<SatelliteObservation | null>(null);
  const [reconstructionData, setReconstructionData] = useState<ReconstructionData | null>(null);
  const [argoData, setArgoData] = useState<ArgoValidationData | null>(null);
  const [anomalyData, setAnomalyData] = useState<OceanAnomalyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load all telemetry upon region change
  useEffect(() => {
    let isMounted = true;
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [sat, recon, argo, anom] = await Promise.all([
          oceanApi.getSatelliteObservation(selectedRegion),
          oceanApi.getReconstruction(selectedRegion),
          oceanApi.getArgoValidation(selectedRegion),
          oceanApi.getOceanAnomaly(selectedRegion)
        ]);

        if (isMounted) {
          setSatelliteData(sat);
          setReconstructionData(recon);
          setArgoData(argo);
          setAnomalyData(anom);
        }
      } catch (err) {
        console.error("Telemetry fetch error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAllData();
    return () => { isMounted = false; };
  }, [selectedRegion]);

  return (
    <div className="min-h-screen bg-[#F4F9FC] text-[#071B33] flex flex-col font-sans selection:bg-[#DCEFEA] selection:text-[#071B33]">
      {/* 4. Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        onRevealClick={() => setIsRevealOpen(true)}
        onMethodologyClick={() => setIsMethodologyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Subtle loading indicator */}
        {isLoading && (
          <div className="w-full h-1 bg-[#D5E0E2] rounded-full overflow-hidden">
            <div className="h-full bg-[#009FE3] animate-pulse w-full" />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: OVERVIEW (EXECUTIVE DASHBOARD) */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 6. Hero Introduction + 7. Current Conditions Panel */}
            <HeroBanner
              satelliteData={satelliteData}
              reconstructionData={reconstructionData}
              selectedDepth={selectedDepth}
              setSelectedDepth={setSelectedDepth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              onExploreClick={() => setActiveTab('twin')}
              onRevealClick={() => setIsRevealOpen(true)}
            />

            {/* 10. Main Map & 11. Temperature Profile */}
            <SubsurfaceDigitalTwin
              reconstructionData={reconstructionData}
              argoData={argoData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
              setSelectedDepth={setSelectedDepth}
              selectedRegion={selectedRegion}
            />

            {/* 14. Unique Feature — Human-Readable Insights */}
            <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded bg-[#DCEFEA] text-[#009FE3] shrink-0 mt-0.5">
                  <Info className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[#071B33]">
                    What does this mean?
                  </h3>
                  <p className="text-xs text-[#071B33] leading-relaxed">
                    The reconstructed profile is approximately 2.1 °C warmer than the selected climatological baseline between 25 and 60 m depth. This places several temperature-sensitive species outside their preferred thermal range and alters upper ocean stratification, potentially affecting vertical nutrient flux and pelagic marine habitat distributions.
                  </p>
                  <div>
                    <button
                      onClick={() => setIsMethodologyOpen(true)}
                      className="text-xs text-[#009FE3] hover:text-[#071B33] font-medium inline-flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>View methodology</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subsurface Temperature Anomaly & ARGO Validation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <OceanAnomalyDetector
                anomalyData={anomalyData}
                selectedRegion={selectedRegion}
              />
              <ArgoTruthCheck
                argoData={argoData}
                reconstructionData={reconstructionData}
                selectedRegion={selectedRegion}
              />
            </div>

            {/* 13. Marine Temperature Impact */}
            <MarineTemperatureImpactPredictor initialRegion={selectedRegion} />

            {/* 12. How OceanEmbed Works: 5-step process */}
            <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
              <div className="pb-3 border-b border-[#E2ECEE] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#071B33]">
                    How OceanEmbed works
                  </h3>
                  <p className="text-xs text-[#62757C] mt-0.5">
                    From multi-satellite surface observations to calibrated 3D subsurface temperature profiles
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#62757C] bg-[#F4F9FC] px-2 py-0.5 rounded border border-[#D5E0E2]">
                  Process flow
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                <div 
                  onClick={() => setActiveTab('dataqc')}
                  className="p-3.5 rounded-md bg-[#F8FAFA] border border-[#D5E0E2] hover:border-[#009FE3] cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="w-7 h-7 rounded-full bg-[#071B33] text-white flex items-center justify-center text-xs font-semibold mb-2.5">
                      1
                    </div>
                    <h4 className="text-xs font-semibold text-[#071B33]">
                      Satellite observations
                    </h4>
                    <p className="text-[11px] text-[#62757C] mt-1.5 leading-relaxed">
                      Sentinel-3 SST, SMAP salinity, and Jason altimetry capture boundary skin measurements.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('dataqc')}
                  className="p-3.5 rounded-md bg-[#F8FAFA] border border-[#D5E0E2] hover:border-[#009FE3] cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="w-7 h-7 rounded-full bg-[#009FE3] text-white flex items-center justify-center text-xs font-semibold mb-2.5">
                      2
                    </div>
                    <h4 className="text-xs font-semibold text-[#071B33]">
                      Data preprocessing
                    </h4>
                    <p className="text-[11px] text-[#62757C] mt-1.5 leading-relaxed">
                      Observations are quality-controlled, spatialized, and aligned with climatological baselines.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('embedding')}
                  className="p-3.5 rounded-md bg-[#F8FAFA] border border-[#D5E0E2] hover:border-[#009FE3] cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="w-7 h-7 rounded-full bg-[#009FE3] text-white flex items-center justify-center text-xs font-semibold mb-2.5">
                      3
                    </div>
                    <h4 className="text-xs font-semibold text-[#071B33]">
                      Ocean embedding
                    </h4>
                    <p className="text-[11px] text-[#62757C] mt-1.5 leading-relaxed">
                      Spatial attention models compress surface variables into a 128-dim learned ocean manifold.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('twin')}
                  className="p-3.5 rounded-md bg-[#F8FAFA] border border-[#D5E0E2] hover:border-[#009FE3] cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="w-7 h-7 rounded-full bg-[#009FE3] text-white flex items-center justify-center text-xs font-semibold mb-2.5">
                      4
                    </div>
                    <h4 className="text-xs font-semibold text-[#071B33]">
                      Subsurface reconstruction
                    </h4>
                    <p className="text-[11px] text-[#62757C] mt-1.5 leading-relaxed">
                      Physics-informed neural decoders reconstruct vertical temperature profiles down to 1000 m.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('argo')}
                  className="p-3.5 rounded-md bg-[#F8FAFA] border border-[#D5E0E2] hover:border-[#009FE3] cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="w-7 h-7 rounded-full bg-[#071B33] text-white flex items-center justify-center text-xs font-semibold mb-2.5">
                      5
                    </div>
                    <h4 className="text-xs font-semibold text-[#071B33]">
                      ARGO validation
                    </h4>
                    <p className="text-[11px] text-[#62757C] mt-1.5 leading-relaxed">
                      Estimations are collocated and verified against autonomous profiling CTD floats.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 16. Data Sources Panel */}
            <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-[#071B33] uppercase tracking-wide mb-3">
                Data sources
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-[#F4F9FC] rounded-md border border-[#D5E0E2]">
                  <span className="text-[11px] text-[#62757C] block">Satellite</span>
                  <span className="font-semibold text-[#071B33] mt-0.5 block">Sentinel-3</span>
                  <span className="text-[11px] text-[#62757C]">SST, Altimetry (Jason), SMAP SSS</span>
                </div>
                <div className="p-3 bg-[#F4F9FC] rounded-md border border-[#D5E0E2]">
                  <span className="text-[11px] text-[#62757C] block">In-situ</span>
                  <span className="font-semibold text-[#071B33] mt-0.5 block">ARGO</span>
                  <span className="text-[11px] text-[#62757C]">Autonomous profiling float CTD observations</span>
                </div>
                <div className="p-3 bg-[#F4F9FC] rounded-md border border-[#D5E0E2]">
                  <span className="text-[11px] text-[#62757C] block">Reference</span>
                  <span className="font-semibold text-[#071B33] mt-0.5 block">Ocean climatology</span>
                  <span className="text-[11px] text-[#62757C]">1991–2020 30-year climatological baseline</span>
                </div>
                <div className="p-3 bg-[#F4F9FC] rounded-md border border-[#D5E0E2]">
                  <span className="text-[11px] text-[#62757C] block">Model</span>
                  <span className="font-semibold text-[#071B33] mt-0.5 block">OceanEmbed reconstruction</span>
                  <span className="text-[11px] text-[#62757C]">Subsurface temperature profile estimation</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: RECONSTRUCTION */}
        {/* ============================================================== */}
        {activeTab === 'twin' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <SubsurfaceDigitalTwin
              reconstructionData={reconstructionData}
              argoData={argoData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
              setSelectedDepth={setSelectedDepth}
              selectedRegion={selectedRegion}
            />
            <TrustMeter
              reconstructionData={reconstructionData}
              argoData={argoData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: MARINE IMPACT */}
        {/* ============================================================== */}
        {activeTab === 'marineimpact' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <MarineTemperatureImpactPredictor initialRegion={selectedRegion} />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: ARGO VALIDATION */}
        {activeTab === 'argo' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <ArgoTruthCheck
              argoData={argoData}
              reconstructionData={reconstructionData}
              selectedRegion={selectedRegion}
            />
            <ErrorOcean
              reconstructionData={reconstructionData}
              argoData={argoData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: OCEAN MEMORY */}
        {/* ============================================================== */}
        {activeTab === 'memory' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <OceanMemory
              reconstructionData={reconstructionData}
              selectedRegion={selectedRegion}
            />
            <EmbeddingConstellation />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: TIME MACHINE */}
        {/* ============================================================== */}
        {activeTab === 'timemachine' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <TimeMachine
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              reconstructionData={reconstructionData}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: THERMOCLINE */}
        {/* ============================================================== */}
        {activeTab === 'thermocline' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <ThermoclineRadar
              reconstructionData={reconstructionData}
            />
            <SubsurfaceDigitalTwin
              reconstructionData={reconstructionData}
              argoData={argoData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
              setSelectedDepth={setSelectedDepth}
              selectedRegion={selectedRegion}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: MODEL */}
        {/* ============================================================== */}
        {activeTab === 'modellab' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <ModelLab />
            <AiXRay
              reconstructionData={reconstructionData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
            />
            <DataQualityCenter
              satelliteData={satelliteData}
            />
          </div>
        )}

        {/* Additional routes/tabs kept accessible for full functionality */}
        {activeTab === 'xray' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <AiXRay
              reconstructionData={reconstructionData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
            />
            <ModelLab />
          </div>
        )}

        {activeTab === 'embedding' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <EmbeddingConstellation />
            <OceanMemory
              reconstructionData={reconstructionData}
              selectedRegion={selectedRegion}
            />
          </div>
        )}

        {activeTab === 'trust' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <TrustMeter
              reconstructionData={reconstructionData}
              argoData={argoData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
            />
            <ArgoTruthCheck
              argoData={argoData}
              reconstructionData={reconstructionData}
              selectedRegion={selectedRegion}
            />
          </div>
        )}

        {activeTab === 'error' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <ErrorOcean
              reconstructionData={reconstructionData}
              argoData={argoData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
            />
            <TrustMeter
              reconstructionData={reconstructionData}
              argoData={argoData}
              satelliteData={satelliteData}
              selectedDepth={selectedDepth}
            />
          </div>
        )}

        {activeTab === 'anomaly' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <OceanAnomalyDetector
              anomalyData={anomalyData}
              selectedRegion={selectedRegion}
            />
            <ThermoclineRadar
              reconstructionData={reconstructionData}
            />
          </div>
        )}

        {activeTab === 'transect' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <OceanCrossSection />
          </div>
        )}

        {activeTab === 'whatif' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <WhatIfSimulator
              reconstructionData={reconstructionData}
            />
          </div>
        )}

        {activeTab === 'analyst' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <AiOceanScientist
              selectedRegion={selectedRegion}
              selectedDepth={selectedDepth}
            />
          </div>
        )}

        {activeTab === 'dataqc' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <DataQualityCenter
              satelliteData={satelliteData}
            />
          </div>
        )}
      </main>

      {/* Footer with Scientific Provenance */}
      <footer className="mt-16 border-t border-[#D5E0E2] bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-[#62757C]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md overflow-hidden bg-white border border-[#D5E0E2] flex items-center justify-center shrink-0">
              <img src="/logo.jpg" alt="Team Neeraksh Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-sm font-semibold text-[#071B33]">OceanEmbed / Neeraksh</span>
              <span className="text-[#62757C] block text-[11px]">Subsurface ocean temperature reconstruction platform</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#62757C]">
            <span>Copernicus Marine</span>
            <span>•</span>
            <span>NASA JPL</span>
            <span>•</span>
            <span>ARGO Global Network</span>
            <span>•</span>
            <span>NOAA World Ocean Atlas</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="text-[#009FE3] hover:text-[#071B33] transition cursor-pointer"
            >
              Data & Methodology
            </button>
            <span className="text-[#D5E0E2]">|</span>
            <button
              onClick={() => setIsRevealOpen(true)}
              className="text-[#009FE3] hover:text-[#071B33] transition cursor-pointer"
            >
              Reconstruction flow
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#E2ECEE] text-[11px] text-[#62757C] text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Version 2.4.0 • Research release</span>
        </div>
      </footer>

      {/* Modals */}
      <RevealModal
        isOpen={isRevealOpen}
        onClose={() => setIsRevealOpen(false)}
        reconstructionData={reconstructionData}
        argoData={argoData}
        satelliteData={satelliteData}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
};

export default App;

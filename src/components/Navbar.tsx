import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Layers,
  Activity,
  Fish,
  Waves
} from 'lucide-react';
import { oceanApi } from '../services/oceanApi';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  onRevealClick: () => void;
  onMethodologyClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRegion,
  setSelectedRegion,
  onRevealClick,
  onMethodologyClick
}) => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    oceanApi.checkBackend().then((ok) => {
      if (!cancelled) setBackendOnline(ok);
    });
    return () => { cancelled = true; };
  }, []);

  const navTabs = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'twin', label: 'Reconstruction' },
    { id: 'marineimpact', label: 'Marine Impact' },
    { id: 'argo', label: 'ARGO Validation' },
    { id: 'memory', label: 'Ocean Memory' },
    { id: 'timemachine', label: 'Time Machine' },
    { id: 'thermocline', label: 'Thermocline' },
    { id: 'modellab', label: 'Model' },
    { id: 'anomaly', label: 'Anomaly Lens' },
    { id: 'transect', label: 'Cross-Section' },
    { id: 'analyst', label: 'Research Analyst' },
    { id: 'whatif', label: 'What-If Simulation' },
    { id: 'dataqc', label: 'Data Quality' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#D5E0E2] shadow-sm">
      {/* Top Metadata & Operational Status Bar */}
      <div className="bg-[#F8FAFA] px-4 sm:px-6 lg:px-8 py-1.5 border-b border-[#D5E0E2] text-xs text-[#62757C] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-4">
          <span
            className={`flex items-center gap-1.5 font-medium ${
              backendOnline === null
                ? 'text-[#62757C]'
                : backendOnline
                  ? 'text-[#3D806C]'
                  : 'text-[#D99A3D]'
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                backendOnline === null
                  ? 'bg-[#D5E0E2]'
                  : backendOnline
                    ? 'bg-[#3D806C]'
                    : 'bg-[#D99A3D]'
              }`}
            />
            {backendOnline === null
              ? 'Checking data pipeline'
              : backendOnline
                ? 'Data pipeline connected'
                : 'Offline - bundled dataset'}
          </span>
          <span className="text-[#D5E0E2]">|</span>
          <span className="text-[#62757C]">Data: Satellite + ARGO GDAC</span>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <span className="flex items-center gap-1 text-[#62757C]">
            <Calendar className="w-3.5 h-3.5 text-[#009FE3]" />
            Observation: 30 Sep 2026
          </span>
          <span className="text-[#D5E0E2]">|</span>
          <span className="text-[#62757C]">Reference: 1991–2020 Climatology</span>
        </div>
      </div>

      {/* Main Branding & Context Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-[#D5E0E2] p-0.5 shadow-sm flex items-center justify-center shrink-0">
            <img 
              src="/logo.jpg" 
              alt="Neeraksh Logo" 
              className="w-full h-full object-cover rounded-md" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#071B33] font-['Plus_Jakarta_Sans']">
                Neeraksh
              </span>
              <span className="text-[11px] font-normal text-[#009FE3] bg-[#D8E7EC]/70 px-2 py-0.5 rounded border border-[#D5E0E2]">
                OceanEmbed Framework
              </span>
            </div>
            <p className="text-xs text-[#62757C] hidden sm:block">
              Subsurface ocean temperature reconstruction
            </p>
          </div>
        </div>

        {/* Right Controls: Region Selector & Methodology */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#F4F9FC] border border-[#D5E0E2] px-2.5 py-1.5 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-[#009FE3]" />
            <label className="text-xs font-medium text-[#62757C] hidden sm:inline">Region:</label>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#071B33] focus:outline-none cursor-pointer"
            >
              <option value="arabian_sea">Arabian Sea (Northern Basin)</option>
              <option value="bay_of_bengal">Bay of Bengal (River Plume)</option>
              <option value="indian_ocean">Equatorial Indian Ocean</option>
            </select>
          </div>

          <button
            onClick={onMethodologyClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#071B33] hover:text-[#071B33] bg-[#FFFFFF] hover:bg-[#F4F9FC] border border-[#D5E0E2] transition shadow-xs"
            title="Data sources, model architecture, and scientific methodology"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#009FE3]" />
            <span className="hidden sm:inline">Methodology</span>
          </button>

          <button
            onClick={onRevealClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#009FE3] hover:bg-[#008CC8] text-white font-medium text-xs transition shadow-xs cursor-pointer"
            title="Step-by-step reconstruction walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5 text-white/90" />
            <span className="hidden sm:inline">Explore the subsurface</span>
          </button>
        </div>
      </div>

      {/* Simplified Navigation Bar */}
      <div className="bg-[#F8FAFA] border-t border-[#D5E0E2] px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex space-x-1 py-1">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-[#DCEFEA] text-[#071B33] font-semibold border border-[#009FE3]/40 shadow-xs' 
                    : 'text-[#62757C] hover:text-[#071B33] hover:bg-[#EBF2F3]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

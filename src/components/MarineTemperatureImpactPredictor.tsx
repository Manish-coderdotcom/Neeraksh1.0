import React, { useState, useMemo } from 'react';
import { 
  Fish, 
  Waves, 
  AlertTriangle, 
  HelpCircle, 
  Info, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Compass, 
  Calendar,
  Layers,
  ShieldAlert,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  SpeciesGroup, 
  SpeciesImpactEstimate, 
  StayOrMoveStatus, 
  StressCategory, 
  ForecastPeriod,
  MarineRegionImpact 
} from '../types/marineImpact';
import { 
  generateImpactSummary, 
  REGIONAL_BASELINES 
} from '../services/marineImpactEngine';

interface MarineTemperatureImpactPredictorProps {
  initialRegion?: string;
}

export const MarineTemperatureImpactPredictor: React.FC<MarineTemperatureImpactPredictorProps> = ({
  initialRegion = 'arabian_sea'
}) => {
  // Component State
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const [forecastPeriod, setForecastPeriod] = useState<ForecastPeriod>('48h');
  const [scenarioOffset, setScenarioOffset] = useState<number | null>(null); // null = natural prediction
  const [activeSpeciesFilter, setActiveSpeciesFilter] = useState<'all' | 'sessile' | 'mobile' | 'stressed'>('all');
  const [activeWhyModal, setActiveWhyModal] = useState<SpeciesImpactEstimate | null>(null);
  const [hoveredTimeseriesPoint, setHoveredTimeseriesPoint] = useState<any | null>(null);

  // Generate impact summary data from modular engine
  const impactData: MarineRegionImpact = useMemo(() => {
    return generateImpactSummary(selectedRegion, forecastPeriod, scenarioOffset);
  }, [selectedRegion, forecastPeriod, scenarioOffset]);

  // Filtered species list
  const filteredSpecies = useMemo(() => {
    return impactData.speciesEstimates.filter(s => {
      if (activeSpeciesFilter === 'sessile') return s.species.mobilityType === 'Sessile';
      if (activeSpeciesFilter === 'mobile') return s.species.mobilityType === 'Highly Mobile' || s.species.mobilityType === 'Migratory';
      if (activeSpeciesFilter === 'stressed') return s.stayOrMove === 'HIGH STRESS' || s.stayOrMove === 'SEVERE RISK';
      return true;
    });
  }, [impactData.speciesEstimates, activeSpeciesFilter]);

  // Map Stay/Move to scientific response terminology
  const getPotentialResponseText = (estimate: SpeciesImpactEstimate) => {
    if (estimate.stayOrMove === 'STAY') return 'Stable (within optimal physiological bounds)';
    if (estimate.stayOrMove === 'SHIFT') return 'Potential range shift to deeper/cooler waters';
    if (estimate.stayOrMove === 'HIGH STRESS') return 'Habitat pressure and high thermal stress';
    return 'Severe biological strain; potential local population pressure';
  };

  // Scientific badges using defined color tokens
  const getResponseBadge = (status: StayOrMoveStatus) => {
    switch (status) {
      case 'STAY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#DCEFEA] text-[#2A8C82] border border-[#BCE3DA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A8C82]" />
            Stable
          </span>
        );
      case 'SHIFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#D8E7EC] text-[#176B87] border border-[#BFD9E2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B87]" />
            Potential range shift
          </span>
        );
      case 'HIGH STRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF3D6] text-[#D99A3D] border border-[#FDE3A2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D99A3D]" />
            Thermal stress
          </span>
        );
      case 'SEVERE RISK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FCE8E6] text-[#C85C4B] border border-[#F7C6C2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85C4B]" />
            Habitat pressure
          </span>
        );
    }
  };

  const getStressLevelBadge = (category: StressCategory) => {
    switch (category) {
      case 'Likely to tolerate':
        return <span className="text-[#3D806C] font-medium">Stable</span>;
      case 'May experience stress':
        return <span className="text-[#D99A3D] font-medium">Mild stress</span>;
      case 'May shift habitat':
        return <span className="text-[#176B87] font-medium">Potential range shift</span>;
      case 'High biological stress':
        return <span className="text-[#C85C4B] font-medium">High thermal stress</span>;
      case 'Severe long-term risk':
        return <span className="text-[#A13A2B] font-semibold">Elevated habitat pressure</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Controls */}
      <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-[#DCEFEA] text-[#176B87]">
                <Fish className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-semibold text-[#123B4A]">
                Marine temperature impact
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F4F7F6] text-[#62757C] border border-[#D5E0E2]">
                Ecosystem response
              </span>
            </div>
            <p className="text-xs text-[#62757C] mt-1">
              Evaluates thermal stress thresholds, habitat shift likelihood, and biological risk chains across key marine organisms
            </p>
          </div>

          {/* Region & Forecast Period Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Region Selector */}
            <div className="flex items-center gap-1.5 bg-[#F4F7F6] border border-[#D5E0E2] rounded-md px-2.5 py-1 text-xs">
              <span className="text-[#62757C]">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-[#17313B] font-medium focus:outline-none cursor-pointer"
              >
                {Object.entries(REGIONAL_BASELINES).map(([k, v]) => (
                  <option key={k} value={k} className="bg-white text-[#17313B]">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Forecast Horizon Selector */}
            <div className="flex items-center bg-[#F4F7F6] border border-[#D5E0E2] rounded-md p-0.5 text-xs">
              {(['24h', '48h', '7d'] as ForecastPeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setForecastPeriod(period)}
                  className={`px-2.5 py-1 rounded transition ${
                    forecastPeriod === period
                      ? 'bg-[#176B87] text-white font-medium shadow-xs'
                      : 'text-[#62757C] hover:text-[#17313B]'
                  }`}
                >
                  {period === '24h' ? '24 Hours' : period === '48h' ? '48 Hours' : '7 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time Temperature & Anomaly Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="bg-[#F4F7F6] p-3 rounded-md border border-[#D5E0E2]">
            <span className="text-[11px] text-[#62757C] block">Normal baseline</span>
            <div className="text-xl font-bold text-[#123B4A] font-mono mt-0.5">
              {impactData.baselineTemp.toFixed(1)} °C
            </div>
            <span className="text-[10px] text-[#62757C]">1991–2020 climatology</span>
          </div>

          <div className="bg-[#F4F7F6] p-3 rounded-md border border-[#D5E0E2]">
            <span className="text-[11px] text-[#62757C] block">Current temperature</span>
            <div className="text-xl font-bold text-[#176B87] font-mono mt-0.5">
              {impactData.currentTemp.toFixed(1)} °C
            </div>
            <span className="text-[10px] text-[#62757C]">Sentinel-3 observation</span>
          </div>

          <div className="bg-[#F4F7F6] p-3 rounded-md border border-[#D5E0E2]">
            <span className="text-[11px] text-[#62757C] block">Predicted temperature</span>
            <div className="text-xl font-bold text-[#123B4A] font-mono mt-0.5">
              {impactData.predictedTemp.toFixed(1)} °C
            </div>
            <span className="text-[10px] text-[#62757C]">Horizon: {impactData.forecastPeriod}</span>
          </div>

          <div className="bg-[#F4F7F6] p-3 rounded-md border border-[#D5E0E2]">
            <span className="text-[11px] text-[#62757C] block">Temperature anomaly</span>
            <div className={`text-xl font-bold font-mono mt-0.5 ${impactData.temperatureAnomaly > 0 ? 'text-[#D99A3D]' : 'text-[#176B87]'}`}>
              {impactData.temperatureAnomaly > 0 ? `+${impactData.temperatureAnomaly.toFixed(1)}` : impactData.temperatureAnomaly.toFixed(1)} °C
            </div>
            <span className="text-[10px] text-[#62757C]">T_predicted − T_baseline</span>
          </div>

          <div className="bg-[#F4F7F6] p-3 rounded-md border border-[#D5E0E2]">
            <span className="text-[11px] text-[#62757C] block">Potential thermal stress</span>
            <div className="mt-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                impactData.temperatureAnomaly > 2.0 
                  ? 'bg-[#FFF3D6] text-[#D99A3D] border border-[#FDE3A2]' 
                  : 'bg-[#DCEFEA] text-[#2A8C82] border border-[#BCE3DA]'
              }`}>
                {impactData.temperatureAnomaly > 2.0 ? 'Elevated' : 'Moderate'}
              </span>
            </div>
            <span className="text-[10px] text-[#62757C] mt-1 block">Ecosystem indicator</span>
          </div>

          <div className="bg-[#F4F7F6] p-3 rounded-md border border-[#D5E0E2]">
            <span className="text-[11px] text-[#62757C] block">Affected depth</span>
            <div className="text-xl font-bold text-[#123B4A] font-mono mt-0.5">
              20–75 m
            </div>
            <span className="text-[10px] text-[#62757C]">Upper mixed & thermocline</span>
          </div>
        </div>

        {/* Diagnostic Summary */}
        <div className="mt-3.5 p-3 bg-[#F4F7F6] border border-[#D5E0E2] rounded-md text-xs text-[#17313B] leading-relaxed">
          <span className="font-semibold text-[#123B4A]">Analysis summary: </span>
          {impactData.summaryStatement}
        </div>
      </div>

      {/* 2. Marine Species Table */}
      <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E2ECEE]">
          <div>
            <h3 className="text-sm font-semibold text-[#123B4A] flex items-center gap-2">
              <Fish className="w-4 h-4 text-[#176B87]" />
              Marine species response matrix
            </h3>
            <p className="text-xs text-[#62757C] mt-0.5">
              Comparison of species thermal envelopes against current and predicted subsurface temperature
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F4F7F6] p-1 rounded-md border border-[#D5E0E2] text-xs">
            {[
              { id: 'all', label: 'All species' },
              { id: 'sessile', label: 'Sessile' },
              { id: 'mobile', label: 'Mobile' },
              { id: 'stressed', label: 'Elevated stress' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveSpeciesFilter(f.id as any)}
                className={`px-2.5 py-1 rounded transition ${
                  activeSpeciesFilter === f.id
                    ? 'bg-white text-[#123B4A] font-medium shadow-xs border border-[#D5E0E2]'
                    : 'text-[#62757C] hover:text-[#17313B]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Species Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F7F6] text-[#62757C] uppercase text-[10px] border-b border-[#D5E0E2]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Species</th>
                <th className="py-2.5 px-3 font-semibold">Thermal range</th>
                <th className="py-2.5 px-3 font-semibold">Current temperature</th>
                <th className="py-2.5 px-3 font-semibold">Stress level</th>
                <th className="py-2.5 px-3 font-semibold">Potential response</th>
                <th className="py-2.5 px-3 text-right font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2ECEE] text-[#17313B]">
              {filteredSpecies.map((estimate) => {
                const sp = estimate.species;
                return (
                  <tr key={sp.id} className="hover:bg-[#F8FAFA] transition">
                    {/* Species */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#123B4A]">
                        {sp.name}
                      </div>
                      <div className="text-[11px] text-[#62757C] mt-0.5">
                        {sp.scientificCategory.split('(')[0]} • {sp.typicalDepthRange}
                      </div>
                    </td>

                    {/* Thermal Range */}
                    <td className="py-3 px-3 font-mono text-[11px] text-[#62757C]">
                      {sp.baselineTempRange.min}°C – {sp.baselineTempRange.max}°C
                      <span className="block text-[10px] text-[#176B87]">
                        Optimal: {sp.baselineTempRange.optimal}°C
                      </span>
                    </td>

                    {/* Current Temperature */}
                    <td className="py-3 px-3 font-mono text-[11px] font-semibold text-[#17313B]">
                      {impactData.currentTemp.toFixed(1)} °C
                      <span className="block text-[10px] font-normal text-[#62757C]">
                        Predicted: {impactData.predictedTemp.toFixed(1)} °C
                      </span>
                    </td>

                    {/* Stress Level */}
                    <td className="py-3 px-3">
                      {getStressLevelBadge(estimate.stressLevel)}
                      <div className="text-[10px] text-[#62757C] mt-0.5">
                        Sensitivity: {sp.thermalSensitivity}
                      </div>
                    </td>

                    {/* Potential Response */}
                    <td className="py-3 px-3">
                      {getResponseBadge(estimate.stayOrMove)}
                      <div className="text-[11px] text-[#62757C] mt-1 max-w-xs leading-relaxed">
                        {getPotentialResponseText(estimate)}
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveWhyModal(estimate)}
                        className="px-2.5 py-1 rounded bg-[#F4F7F6] hover:bg-[#E8F0F2] text-[#176B87] text-[11px] border border-[#D5E0E2] transition cursor-pointer"
                      >
                        Explain
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Interactive Temperature Time-Series Graph */}
      <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#E2ECEE]">
          <div>
            <h3 className="text-sm font-semibold text-[#123B4A] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#176B87]" />
              Water temperature observation & forecast
            </h3>
            <p className="text-xs text-[#62757C] mt-0.5">
              Comparison of past 7-day observations, 30-year climatological baseline, and projected temperature trajectory
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#62757C]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#62757C] border-b border-dashed" /> Baseline ({impactData.baselineTemp}°C)
            </span>
            <span className="flex items-center gap-1.5 text-[#2A8C82] font-medium">
              <span className="w-3 h-0.5 bg-[#2A8C82]" /> Observed
            </span>
            <span className="flex items-center gap-1.5 text-[#D99A3D] font-medium">
              <span className="w-3 h-0.5 bg-[#D99A3D]" /> Forecast
            </span>
          </div>
        </div>

        {/* SVG Graph */}
        <div className="relative w-full h-60 bg-[#F8FAFA] rounded-md border border-[#D5E0E2] p-3">
          <svg className="w-full h-full" viewBox="0 0 600 200">
            {/* Grid Lines */}
            <line x1="45" y1="20" x2="580" y2="20" stroke="#E2ECEE" strokeDasharray="2,2" strokeWidth="0.8" />
            <line x1="45" y1="65" x2="580" y2="65" stroke="#E2ECEE" strokeDasharray="2,2" strokeWidth="0.8" />
            <line x1="45" y1="110" x2="580" y2="110" stroke="#E2ECEE" strokeDasharray="2,2" strokeWidth="0.8" />
            <line x1="45" y1="155" x2="580" y2="155" stroke="#E2ECEE" strokeDasharray="2,2" strokeWidth="0.8" />
            <line x1="45" y1="180" x2="580" y2="180" stroke="#D5E0E2" strokeWidth="1" />

            {/* Y-Axis Temperature Labels */}
            <text x="38" y="24" fill="#62757C" fontSize="9" fontFamily="Inter" textAnchor="end">32°C</text>
            <text x="38" y="69" fill="#62757C" fontSize="9" fontFamily="Inter" textAnchor="end">29°C</text>
            <text x="38" y="114" fill="#62757C" fontSize="9" fontFamily="Inter" textAnchor="end">26°C</text>
            <text x="38" y="159" fill="#62757C" fontSize="9" fontFamily="Inter" textAnchor="end">23°C</text>

            {(() => {
              const pts = impactData.temperatureTimeseries;
              const xCoord = (idx: number) => 50 + (idx / (pts.length - 1)) * 520;
              const yCoord = (t: number) => 170 - ((t - 22) / (32 - 22)) * 150;

              // Baseline horizontal path
              const basePoints = pts.map((p, i) => `${xCoord(i)},${yCoord(p.baseline)}`).join(' L ');

              // Safe Envelope Shaded Band
              const safeTop = pts.map((p, i) => `${xCoord(i)},${yCoord(p.safeMax)}`);
              const safeBottom = pts.map((p, i) => `${xCoord(i)},${yCoord(p.safeMin)}`).reverse();
              const envelopePath = `M ${safeTop.join(' L ')} L ${safeBottom.join(' L ')} Z`;

              // Observed Path
              const obsPts = pts.slice(0, 8).map((p, i) => `${xCoord(i)},${yCoord(p.observed || p.baseline)}`).join(' L ');

              // Predicted Path
              const predPts = pts.slice(7).map((p, i) => `${xCoord(i + 7)},${yCoord(p.predicted || p.baseline)}`).join(' L ');

              return (
                <>
                  {/* Safe thermal envelope shaded band */}
                  <path d={envelopePath} fill="rgba(42, 140, 130, 0.08)" />

                  {/* Baseline reference line */}
                  <path d={`M ${basePoints}`} fill="none" stroke="#62757C" strokeWidth="1.2" strokeDasharray="3,3" />

                  {/* Observed line (teal) */}
                  <path d={`M ${obsPts}`} fill="none" stroke="#2A8C82" strokeWidth="2.5" />

                  {/* Predicted line (amber) */}
                  <path d={`M ${predPts}`} fill="none" stroke="#D99A3D" strokeWidth="2.5" strokeDasharray="4,3" />

                  {/* Vertical separator for "Current Observation" */}
                  <line x1={xCoord(7)} y1="15" x2={xCoord(7)} y2="180" stroke="#176B87" strokeWidth="1" strokeDasharray="2,2" />
                  <text x={xCoord(7)} y="12" fill="#176B87" fontSize="8" fontFamily="Inter" textAnchor="middle" fontWeight="bold">CURRENT</text>

                  {/* Interactive Point Reticles */}
                  {pts.map((p, i) => {
                    const x = xCoord(i);
                    const val = i <= 7 ? (p.observed || p.baseline) : (p.predicted || p.baseline);
                    const y = yCoord(val);
                    const isHovered = hoveredTimeseriesPoint?.time === p.time;

                    return (
                      <g key={p.time} className="cursor-pointer" onMouseEnter={() => setHoveredTimeseriesPoint(p)}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 5 : 3}
                          fill={i <= 7 ? '#2A8C82' : '#D99A3D'}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                        <text x={x} y="194" fill="#62757C" fontSize="8" fontFamily="Inter" textAnchor="middle">
                          {p.time}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>

          {/* Interactive Hover HUD Display */}
          {hoveredTimeseriesPoint && (
            <div className="absolute top-4 right-4 bg-white border border-[#D5E0E2] rounded-md p-2.5 text-xs shadow-md text-[#17313B] pointer-events-none">
              <div className="font-semibold text-[#123B4A] flex items-center justify-between gap-3">
                <span>{hoveredTimeseriesPoint.fullDate} ({hoveredTimeseriesPoint.time})</span>
                <span className="text-[#176B87] font-bold font-mono">
                  {(hoveredTimeseriesPoint.observed || hoveredTimeseriesPoint.predicted).toFixed(1)} °C
                </span>
              </div>
              <div className="text-[11px] text-[#62757C] mt-1 font-mono">
                Baseline: {hoveredTimeseriesPoint.baseline.toFixed(1)}°C • Anomaly: {hoveredTimeseriesPoint.anomaly > 0 ? `+${hoveredTimeseriesPoint.anomaly.toFixed(1)}` : hoveredTimeseriesPoint.anomaly.toFixed(1)}°C
              </div>
              <div className="text-[10px] mt-1 pt-1 border-t border-[#E2ECEE] text-[#D99A3D] font-medium">
                Stress Level: {hoveredTimeseriesPoint.ecosystemStressLevel}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Consequence Simulator & Trophic Network */}
      <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E2ECEE]">
          <div>
            <h3 className="text-sm font-semibold text-[#123B4A] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#176B87]" />
              Scenario sensitivity analysis
            </h3>
            <p className="text-xs text-[#62757C] mt-0.5">
              Simulate hypothetical thermal anomalies and observe cascading biological stress across trophic levels
            </p>
          </div>

          {/* Scenario Buttons */}
          <div className="flex items-center gap-1.5 bg-[#F4F7F6] p-1 rounded-md border border-[#D5E0E2] text-xs">
            <button
              onClick={() => setScenarioOffset(null)}
              className={`px-2.5 py-1 rounded transition ${
                scenarioOffset === null ? 'bg-[#176B87] text-white font-medium shadow-xs' : 'text-[#62757C] hover:text-[#17313B]'
              }`}
            >
              Natural (+{REGIONAL_BASELINES[selectedRegion]?.mediumTermForecastDelta.toFixed(1)}°C)
            </button>
            <button
              onClick={() => setScenarioOffset(1.0)}
              className={`px-2.5 py-1 rounded transition ${
                scenarioOffset === 1.0 ? 'bg-[#2A8C82] text-white font-medium shadow-xs' : 'text-[#62757C] hover:text-[#17313B]'
              }`}
            >
              +1.0°C
            </button>
            <button
              onClick={() => setScenarioOffset(2.0)}
              className={`px-2.5 py-1 rounded transition ${
                scenarioOffset === 2.0 ? 'bg-[#D99A3D] text-white font-medium shadow-xs' : 'text-[#62757C] hover:text-[#17313B]'
              }`}
            >
              +2.0°C
            </button>
            <button
              onClick={() => setScenarioOffset(3.0)}
              className={`px-2.5 py-1 rounded transition ${
                scenarioOffset === 3.0 ? 'bg-[#C85C4B] text-white font-medium shadow-xs' : 'text-[#62757C] hover:text-[#17313B]'
              }`}
            >
              +3.0°C
            </button>
          </div>
        </div>

        {/* Custom Offset Slider */}
        <div className="bg-[#F4F7F6] p-3 rounded-md border border-[#D5E0E2] flex items-center gap-4 text-xs">
          <span className="text-[#62757C] whitespace-nowrap">Simulated anomaly offset:</span>
          <input
            type="range"
            min="-1.0"
            max="5.0"
            step="0.1"
            value={scenarioOffset !== null ? scenarioOffset : REGIONAL_BASELINES[selectedRegion]?.mediumTermForecastDelta || 3.0}
            onChange={(e) => setScenarioOffset(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#D5E0E2] rounded-lg appearance-none cursor-pointer accent-[#2A8C82]"
          />
          <span className="font-bold text-[#123B4A] font-mono w-16 text-right">
            {(scenarioOffset !== null ? scenarioOffset : REGIONAL_BASELINES[selectedRegion]?.mediumTermForecastDelta || 3.0).toFixed(1)} °C
          </span>
        </div>

        {/* Trophic Ecosystem Network */}
        <div className="mt-4 bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2]">
          <div className="flex items-center justify-between text-xs text-[#62757C] mb-3 pb-2 border-b border-[#E2ECEE]">
            <span className="font-medium text-[#123B4A]">
              Trophic levels & habitat coupling response (Scenario: {impactData.temperatureAnomaly > 0 ? `+${impactData.temperatureAnomaly.toFixed(1)}°C` : `${impactData.temperatureAnomaly.toFixed(1)}°C`})
            </span>
            <span className="text-[11px] text-[#62757C]">Ecological pressure cascade</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {impactData.networkNodes.slice(0, 10).map((node) => (
              <div
                key={node.id}
                className="bg-white p-2.5 rounded-md border border-[#D5E0E2] flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#62757C]">Trophic {node.trophicLevel}</span>
                    {getResponseBadge(node.status)}
                  </div>
                  <h4 className="text-xs font-semibold text-[#123B4A] mt-1.5">{node.label}</h4>
                </div>
                <div className="text-[10px] text-[#62757C] mt-2 pt-1 border-t border-[#E2ECEE]">
                  {node.stressLevel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Scientific Transparency & Prediction Disclaimer */}
      <div className="p-4 rounded-lg bg-[#DCEFEA] border border-[#BCE3DA] text-xs text-[#123B4A] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#2A8C82] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-[#123B4A]">
            Scientific context & interpretability
          </div>
          <p className="leading-relaxed text-[#17313B]">
            <strong>Temperature anomaly alone cannot establish species extinction.</strong> Marine organism responses depend on cumulative exposure duration, local acclimation capability, dissolved oxygen availability, primary productivity, ocean current advection, and bathymetric refugia. These outputs represent model-based empirical estimations calibrated against published marine physiological thresholds, designed to assist oceanographic research and ecological monitoring.
          </p>
        </div>
      </div>

      {/* "Why?" Explanation Modal */}
      {activeWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white border border-[#D5E0E2] rounded-lg p-6 shadow-xl text-xs space-y-4">
            <button
              onClick={() => setActiveWhyModal(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-[#62757C] hover:text-[#17313B] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pb-3 border-b border-[#E2ECEE]">
              <span className="p-1.5 rounded bg-[#DCEFEA] text-[#176B87]">
                <Info className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#123B4A]">
                  Scientific basis: {activeWhyModal.species.name}
                </h3>
                <span className="text-[11px] text-[#62757C]">
                  {activeWhyModal.species.scientificCategory}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-[#17313B] leading-relaxed">
              <div className="p-3 bg-[#F4F7F6] rounded-md border border-[#D5E0E2]">
                <span className="text-[11px] font-semibold text-[#123B4A] block mb-1">
                  Physiological rationale
                </span>
                <p>{activeWhyModal.whyExplanation}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#F4F7F6] p-2.5 rounded-md border border-[#D5E0E2]">
                  <span className="text-[#62757C] block text-[10px]">Optimal thermal range</span>
                  <span className="text-[#123B4A] font-bold font-mono">{activeWhyModal.species.baselineTempRange.optimal} °C</span> (Max: {activeWhyModal.species.baselineTempRange.max} °C)
                </div>
                <div className="bg-[#F4F7F6] p-2.5 rounded-md border border-[#D5E0E2]">
                  <span className="text-[#62757C] block text-[10px]">Calibration status</span>
                  <span className="text-[#3D806C] font-bold">Empirical literature benchmark</span>
                </div>
              </div>

              <div className="bg-[#F4F7F6] p-3 rounded-md border border-[#D5E0E2] text-[11px] text-[#62757C]">
                <span className="font-semibold text-[#123B4A] block mb-0.5">Data basis & references:</span>
                {activeWhyModal.dataBasis}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2ECEE] flex justify-end">
              <button
                onClick={() => setActiveWhyModal(null)}
                className="px-4 py-1.5 rounded-md bg-[#176B87] text-white font-medium text-xs hover:bg-[#123B4A] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  Info, 
  MapPin, 
  Calendar, 
  Thermometer, 
  Layers 
} from 'lucide-react';
import { EmbeddingPoint } from '../types/ocean';
import { oceanApi } from '../services/oceanApi';

interface EmbeddingConstellationProps {
  onSelectState?: (point: EmbeddingPoint) => void;
}

export const EmbeddingConstellation: React.FC<EmbeddingConstellationProps> = ({
  onSelectState
}) => {
  const [points, setPoints] = useState<EmbeddingPoint[]>([]);
  const [selectedBasin, setSelectedBasin] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<EmbeddingPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<EmbeddingPoint | null>(null);
  const [similarNeighbors, setSimilarNeighbors] = useState<EmbeddingPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEmbeddings();
  }, [selectedBasin]);

  const loadEmbeddings = async () => {
    setIsLoading(true);
    try {
      const data = await oceanApi.getEmbeddingSpace(selectedBasin);
      setPoints(data.embedding_points);
      const current = data.embedding_points.find(p => p.is_current) || data.embedding_points[0];
      setSelectedPoint(current);
      highlightNeighbors(current, data.embedding_points);
    } finally {
      setIsLoading(false);
    }
  };

  const highlightNeighbors = (target: EmbeddingPoint, allPoints: EmbeddingPoint[]) => {
    const distances = allPoints
      .filter(p => p.id !== target.id)
      .map(p => {
        const dx = p.umap_x - target.umap_x;
        const dy = p.umap_y - target.umap_y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const sim = Math.max(60, Math.min(99, Math.round(100 - dist * 4.5)));
        return { ...p, similarity: sim, dist };
      })
      .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
      .slice(0, 5);

    setSimilarNeighbors(distances);
  };

  const handlePointClick = (pt: EmbeddingPoint) => {
    setSelectedPoint(pt);
    highlightNeighbors(pt, points);
    if (onSelectState) onSelectState(pt);
  };

  const basins = ['all', 'Arabian Sea', 'Bay of Bengal', 'Indian Ocean', 'Pacific', 'Atlantic'];

  return (
    <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#DCEFEA] text-[#176B87]">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-[#123B4A]">
              Ocean embedding space (UMAP manifold)
            </h2>
            <span className="text-[11px] font-mono bg-[#F4F7F6] text-[#62757C] border border-[#D5E0E2] px-2 py-0.5 rounded">
              128-D → 2D Projection
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Learned representation where spatial proximity indicates similar vertical thermal stratification and air-sea coupling
          </p>
        </div>

        {/* Basin filter tabs */}
        <div className="flex items-center gap-1 bg-[#F4F7F6] p-1 rounded-md border border-[#D5E0E2] overflow-x-auto max-w-full">
          {basins.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBasin(b)}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedBasin.toLowerCase() === b.toLowerCase()
                  ? 'bg-[#176B87] text-white shadow-xs'
                  : 'text-[#62757C] hover:text-[#17313B]'
              }`}
            >
              {b === 'all' ? 'All basins' : b}
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive scatter layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: 2D UMAP Scatter Canvas */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative w-full h-[420px] bg-[#123B4A] rounded-md border border-[#D5E0E2] overflow-hidden p-4">
            {/* Scatter SVG Canvas */}
            <svg className="w-full h-full" viewBox="-12 -8 24 16">
              {/* Axes lines */}
              <line x1="-11" y1="0" x2="11" y2="0" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.05" strokeDasharray="0.2,0.2" />
              <line x1="0" y1="-7" x2="0" y2="7" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.05" strokeDasharray="0.2,0.2" />

              {/* Connecting lines */}
              {selectedPoint && similarNeighbors.map((nb) => (
                <line
                  key={`link-${nb.id}`}
                  x1={selectedPoint.umap_x}
                  y1={-selectedPoint.umap_y}
                  x2={nb.umap_x}
                  y2={-nb.umap_y}
                  stroke="#DCEFEA"
                  strokeWidth="0.08"
                  strokeDasharray="0.3,0.3"
                />
              ))}

              {/* Embedding points */}
              {points.map((pt) => {
                const isSelected = selectedPoint?.id === pt.id;
                const isNeighbor = similarNeighbors.some(nb => nb.id === pt.id);
                const isHovered = hoveredPoint?.id === pt.id;

                let color = '#2A8C82';
                if (pt.basin === 'Arabian Sea') color = '#2A8C82';
                if (pt.basin === 'Bay of Bengal') color = '#176B87';
                if (pt.basin === 'Indian Ocean') color = '#3D806C';
                if (pt.basin === 'Pacific') color = '#D99A3D';
                if (pt.basin === 'Atlantic') color = '#C85C4B';

                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => handlePointClick(pt)}
                  >
                    {(isSelected || isNeighbor || isHovered) && (
                      <circle
                        cx={pt.umap_x}
                        cy={-pt.umap_y}
                        r={isSelected ? 1.0 : isNeighbor ? 0.7 : 0.5}
                        fill="#FFFFFF"
                        opacity={0.25}
                      />
                    )}

                    <circle
                      cx={pt.umap_x}
                      cy={-pt.umap_y}
                      r={isSelected ? 0.45 : isNeighbor ? 0.35 : 0.25}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth={0.06}
                    />

                    {(isSelected || isNeighbor) && (
                      <text
                        x={pt.umap_x + 0.4}
                        y={-pt.umap_y + 0.15}
                        fill="#FFFFFF"
                        fontSize="0.55"
                        fontFamily="Inter"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {pt.name} {isNeighbor && `(${similarNeighbors.find(n => n.id === pt.id)?.similarity}%)`}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Overlaid legend */}
            <div className="absolute bottom-3 left-3 bg-white/95 border border-[#D5E0E2] rounded-md p-2 text-[10px] text-[#17313B] flex flex-wrap gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2A8C82]" /> Arabian Sea</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#176B87]" /> Bay of Bengal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3D806C]" /> Indian Ocean</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D99A3D]" /> Pacific</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C85C4B]" /> Atlantic</span>
            </div>

            {/* Hover Tooltip HUD */}
            {hoveredPoint && (
              <div className="absolute top-3 right-3 bg-white/95 border border-[#D5E0E2] rounded-md p-3 text-xs text-[#17313B] shadow-md pointer-events-none max-w-xs">
                <div className="text-[#123B4A] font-semibold text-xs mb-1">{hoveredPoint.name}</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-[#62757C]">
                  <div>Date: <span className="text-[#17313B] font-medium">{hoveredPoint.date}</span></div>
                  <div>Basin: <span className="text-[#17313B] font-medium">{hoveredPoint.basin}</span></div>
                  <div>SST: <span className="text-[#176B87] font-semibold font-mono">{hoveredPoint.sst} °C</span></div>
                  <div>Thermocline: <span className="text-[#123B4A] font-semibold font-mono">{hoveredPoint.thermocline_depth} m</span></div>
                </div>
                <div className="mt-2 text-[10px] text-[#62757C] pt-1.5 border-t border-[#E2ECEE]">
                  Condition: <span className="text-[#17313B]">{hoveredPoint.condition}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Nearest Historical States */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2]">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2ECEE]">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#176B87]" />
                <h3 className="text-xs font-semibold text-[#123B4A]">
                  Nearest manifold states
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#62757C] bg-white px-2 py-0.5 rounded border border-[#D5E0E2]">
                Top 5 analogs
              </span>
            </div>

            <p className="text-xs text-[#62757C] mt-2">
              Historical states matching <span className="text-[#123B4A] font-medium">{selectedPoint?.name || 'Current ocean state'}</span> in the 128-dimensional embedding space:
            </p>

            <div className="space-y-2 mt-3">
              {similarNeighbors.map((nb, i) => (
                <div
                  key={nb.id}
                  onClick={() => handlePointClick(nb)}
                  className="p-2.5 rounded-md bg-white hover:bg-[#F4F7F6] border border-[#D5E0E2] cursor-pointer transition flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-medium text-[#123B4A] flex items-center gap-1.5">
                      <span className="text-[#176B87] font-mono text-[10px]">#{i + 1}</span>
                      <span>{nb.name}</span>
                    </div>
                    <div className="text-[10px] text-[#62757C] mt-0.5 font-mono">
                      {nb.date} • {nb.condition}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#2A8C82] font-mono">
                      {nb.similarity}%
                    </span>
                    <span className="text-[9px] text-[#62757C] block">
                      match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active selection summary */}
          <div className="bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2]">
            <span className="text-[10px] uppercase text-[#62757C] block mb-1 font-medium">
              Selected manifold point
            </span>
            <div className="text-sm font-semibold text-[#123B4A]">
              {selectedPoint?.name}
            </div>
            <div className="text-xs text-[#62757C] mt-1 font-mono">
              Coordinates: {selectedPoint?.lat}°N, {selectedPoint?.lon}°E
            </div>
            <div className="text-xs text-[#176B87] mt-0.5 font-mono">
              SST: {selectedPoint?.sst} °C | Thermocline: {selectedPoint?.thermocline_depth} m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

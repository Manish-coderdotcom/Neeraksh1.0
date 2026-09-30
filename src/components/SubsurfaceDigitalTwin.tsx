import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Layers, 
  Compass, 
  Activity, 
  ShieldCheck, 
  Info, 
  Maximize2, 
  RotateCw,
  Waves,
  Eye,
  Sliders
} from 'lucide-react';
import { ReconstructionData, ArgoValidationData, SatelliteObservation } from '../types/ocean';

interface SubsurfaceDigitalTwinProps {
  reconstructionData: ReconstructionData | null;
  argoData: ArgoValidationData | null;
  satelliteData: SatelliteObservation | null;
  selectedDepth: number;
  setSelectedDepth: (d: number) => void;
  selectedRegion: string;
}

const DEPTH_LEVELS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];

export const SubsurfaceDigitalTwin: React.FC<SubsurfaceDigitalTwinProps> = ({
  reconstructionData,
  argoData,
  satelliteData,
  selectedDepth,
  setSelectedDepth,
  selectedRegion
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<'volumetric3d' | 'contour2d'>('volumetric3d');
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Active depth data
  const profile = reconstructionData?.depth_profile ?? [];
  const uncertainties = reconstructionData?.uncertainty_profile ?? [];
  const currentTemp = profile.find(p => p.depth === selectedDepth)?.temperature ?? 24.7;
  const currentUnc = uncertainties.find(p => p.depth === selectedDepth)?.uncertainty ?? 0.75;
  const mld = reconstructionData?.thermocline_analysis.mixed_layer_depth_m ?? 35;
  const thermoclineDepth = reconstructionData?.thermocline_analysis.estimated_depth_m ?? 72;

  // Confidence calculation
  const confidenceScore = Math.max(65, Math.round(98 - currentUnc * 22));
  const confidenceLevel = confidenceScore >= 85 ? 'HIGH CONFIDENCE' : confidenceScore >= 75 ? 'MEDIUM CONFIDENCE' : 'LOW CONFIDENCE';

  // Three.js Volumetric Ocean Column Animation
  useEffect(() => {
    if (!mountRef.current || viewMode !== 'volumetric3d') return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 4.0, 5.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.replaceChildren(renderer.domElement);

    // Ambient and directional lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00e5ff, 2.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x0284c7, 3, 20);
    pointLight.position.set(0, -2, 0);
    scene.add(pointLight);

    // Group for entire ocean column
    const oceanGroup = new THREE.Group();
    scene.add(oceanGroup);

    // 1. Water column outer bounding box
    const boxGeo = new THREE.BoxGeometry(2.4, 4.0, 2.4);
    const boxMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.333,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const columnBox = new THREE.Mesh(boxGeo, boxMat);
    oceanGroup.add(columnBox);

    // Wireframe edges
    const wireGeo = new THREE.EdgesGeometry(boxGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.4 });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    oceanGroup.add(wireMesh);

    // 2. 15 Depth strata horizontal plane slices
    const depthSlices: THREE.Mesh[] = [];
    DEPTH_LEVELS.forEach((d) => {
      // Map depth (0 - 1000m) to Y coordinate (+2.0 to -2.0)
      const yPos = 2.0 - (d / 1000) * 4.0;
      const sliceGeo = new THREE.PlaneGeometry(2.35, 2.35);
      sliceGeo.rotateX(-Math.PI / 2);

      // Color transition from warm cyan-orange (surface) to deep abyssal navy
      const tNorm = 1.0 - Math.min(d / 400, 1.0);
      const color = new THREE.Color().setHSL(0.55 + tNorm * 0.1, 0.9, 0.2 + tNorm * 0.4);

      const sliceMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: d === selectedDepth ? 0.85 : 0.08,
        wireframe: wireframeMode,
        side: THREE.DoubleSide
      });

      const sliceMesh = new THREE.Mesh(sliceGeo, sliceMat);
      sliceMesh.position.y = yPos;
      oceanGroup.add(sliceMesh);
      depthSlices.push(sliceMesh);
    });

    // 3. Highlighted active depth slicing plane with bright scanline ring
    const activeY = 2.0 - (selectedDepth / 1000) * 4.0;
    const highlightGeo = new THREE.PlaneGeometry(2.45, 2.45);
    highlightGeo.rotateX(-Math.PI / 2);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const highlightPlane = new THREE.Mesh(highlightGeo, highlightMat);
    highlightPlane.position.y = activeY;
    oceanGroup.add(highlightPlane);

    // Active plane glowing edge
    const ringGeo = new THREE.EdgesGeometry(highlightGeo);
    const ringMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const ringMesh = new THREE.LineSegments(ringGeo, ringMat);
    highlightPlane.add(ringMesh);

    // 4. Autonomous ARGO float model bobbing in the water column
    const argoGroup = new THREE.Group();
    const floatCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.28, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
    );
    const floatAntenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    floatAntenna.position.y = 0.2;
    argoGroup.add(floatCylinder);
    argoGroup.add(floatAntenna);
    argoGroup.position.set(0.6, activeY, 0.5);
    oceanGroup.add(argoGroup);

    // Sonar pulse ring from ARGO float
    const sonarGeo = new THREE.RingGeometry(0.08, 0.12, 32);
    sonarGeo.rotateX(-Math.PI / 2);
    const sonarMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const sonarMesh = new THREE.Mesh(sonarGeo, sonarMat);
    argoGroup.add(sonarMesh);

    // 5. Ocean current flow particles
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2.2;
      positions[i + 1] = (Math.random() - 0.5) * 3.8;
      positions[i + 2] = (Math.random() - 0.5) * 2.2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.65
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    oceanGroup.add(particleSystem);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (autoRotate) {
        oceanGroup.rotation.y += delta * 0.35;
      }

      // Sonar pulse animation
      const scale = 1.0 + (elapsed * 2.0 % 2.5);
      sonarMesh.scale.set(scale, scale, scale);
      sonarMat.opacity = Math.max(0, 0.9 - (scale / 3.5));

      // Particle subtle flow drift
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        pos[i] += delta * 0.15; // advection
        if (pos[i] > 1.1) pos[i] = -1.1;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // ARGO float subtle bobbing
      argoGroup.position.y = activeY + Math.sin(elapsed * 2.5) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [viewMode, selectedDepth, wireframeMode, autoRotate]);

  // 2D Contour Canvas Rendering
  useEffect(() => {
    if (viewMode !== 'contour2d' || !mapCanvasRef.current) return;
    const canvas = mapCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.fillStyle = '#050c1b';
    ctx.fillRect(0, 0, 0 + w, 0 + h);

    // Draw simulated thermal gradient contours
    const baseT = currentTemp;
    const grad = ctx.createRadialGradient(w * 0.45, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.6);

    // Map temp to color palette
    const colorFromTemp = (t: number) => {
      if (t > 28) return 'rgba(239, 68, 68, 0.7)'; // Warm red
      if (t > 24) return 'rgba(249, 115, 22, 0.7)'; // Orange
      if (t > 20) return 'rgba(234, 179, 8, 0.7)'; // Yellow
      if (t > 15) return 'rgba(20, 184, 166, 0.7)'; // Teal
      if (t > 10) return 'rgba(14, 165, 233, 0.7)'; // Blue
      return 'rgba(59, 130, 246, 0.7)'; // Deep blue
    };

    grad.addColorStop(0, colorFromTemp(baseT + 1.2));
    grad.addColorStop(0.5, colorFromTemp(baseT));
    grad.addColorStop(1, colorFromTemp(baseT - 1.8));

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw bathymetric contour lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.2;
    for (let r = 40; r < w * 0.8; r += 45) {
      ctx.beginPath();
      ctx.ellipse(w * 0.48, h * 0.52, r, r * 0.75, 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // ARGO Float marker
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(w * 0.62, h * 0.42, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(`${argoData?.float_metadata.wmo_id || 'ARGO-FLOAT'}`, w * 0.62 + 12, h * 0.42 + 3);

    // Crosshair target
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5, h);
    ctx.moveTo(0, h * 0.5); ctx.lineTo(w, h * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [viewMode, selectedDepth, currentTemp, argoData]);

  return (
    <div className="bg-[#FFFFFF] border border-[#D5E0E2] rounded-lg p-6 shadow-xs">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D5E0E2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#D8E7EC] text-[#176B87]">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-[#123B4A] font-['Plus_Jakarta_Sans']">
              Subsurface temperature reconstruction & vertical structure
            </h2>
            <span className="text-xs font-mono bg-[#EBF2F3] text-[#176B87] px-2 py-0.5 rounded border border-[#D5E0E2]">
              15 strata (0–1000 m)
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Dynamic vertical slice derived from multi-sensor surface boundary conditions and validated against ARGO in-situ floats
          </p>
        </div>

        {/* View toggles & controls */}
        <div className="flex items-center gap-2">
          <div className="bg-[#F4F7F6] p-1 rounded-md border border-[#D5E0E2] flex items-center gap-1">
            <button
              onClick={() => setViewMode('volumetric3d')}
              className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                viewMode === 'volumetric3d'
                  ? 'bg-[#FFFFFF] text-[#123B4A] font-semibold border border-[#D5E0E2] shadow-2xs'
                  : 'text-[#62757C] hover:text-[#17313B]'
              }`}
            >
              3D volumetric view
            </button>
            <button
              onClick={() => setViewMode('contour2d')}
              className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                viewMode === 'contour2d'
                  ? 'bg-[#FFFFFF] text-[#123B4A] font-semibold border border-[#D5E0E2] shadow-2xs'
                  : 'text-[#62757C] hover:text-[#17313B]'
              }`}
            >
              2D layer map
            </button>
          </div>

          {viewMode === 'volumetric3d' && (
            <>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 rounded-md border text-xs transition cursor-pointer ${
                  autoRotate ? 'bg-[#DCEFEA] text-[#123B4A] border-[#2A8C82]/40' : 'bg-[#FFFFFF] text-[#62757C] border-[#D5E0E2]'
                }`}
                title="Toggle rotation"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setWireframeMode(!wireframeMode)}
                className={`p-1.5 rounded-md border text-xs transition cursor-pointer ${
                  wireframeMode ? 'bg-[#DCEFEA] text-[#123B4A] border-[#2A8C82]/40' : 'bg-[#FFFFFF] text-[#62757C] border-[#D5E0E2]'
                }`}
                title="Toggle grid overlay"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main interactive visualization grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: 15-Depth Selector Ladder */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2]">
          <div className="flex items-center justify-between pb-2 border-b border-[#D5E0E2]">
            <span className="text-[11px] font-semibold text-[#123B4A] uppercase tracking-wider font-mono">Depth strata</span>
            <span className="text-[10px] text-[#62757C]">15 levels</span>
          </div>

          <div className="flex flex-col gap-1 mt-2 overflow-y-auto max-h-[460px] pr-1">
            {DEPTH_LEVELS.map((depth) => {
              const isSelected = selectedDepth === depth;
              const pVal = profile.find(p => p.depth === depth)?.temperature ?? 20;
              const isThermocline = Math.abs(depth - thermoclineDepth) <= 25;
              const isMLD = depth <= mld;

              return (
                <button
                  key={depth}
                  onClick={() => setSelectedDepth(depth)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#176B87] text-white font-bold shadow-xs'
                      : 'bg-[#FFFFFF] text-[#17313B] border border-[#D5E0E2] hover:bg-[#EBF2F3]'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : isMLD ? 'text-[#2A8C82] font-semibold' : isThermocline ? 'text-[#D99A3D] font-semibold' : 'text-[#62757C]'}>
                    {depth === 0 ? 'Surface' : `${depth}m`}
                  </span>
                  <span className={`text-[11px] ${isSelected ? 'text-white font-bold' : 'text-[#17313B]'}`}>
                    {pVal.toFixed(1)}°C
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#D5E0E2] text-[10px] text-[#62757C] flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[#2A8C82]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2A8C82]" /> Mixed layer: 0–{mld}m
            </span>
            <span className="flex items-center gap-1.5 text-[#D99A3D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D99A3D]" /> Thermocline: ~{thermoclineDepth}m
            </span>
          </div>
        </div>

        {/* Center Column: 3D Volumetric Ocean Canvas / 2D Layer */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative w-full h-[480px] bg-[#0E2430] rounded-md border border-[#D5E0E2] overflow-hidden flex items-center justify-center shadow-inner">
            {viewMode === 'volumetric3d' ? (
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            ) : (
              <canvas ref={mapCanvasRef} width={500} height={480} className="w-full h-full object-cover" />
            )}

            {/* Overlaid telemetry watermark HUD */}
            <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#D5E0E2] rounded-md p-2.5 text-[11px] font-mono text-[#17313B] shadow-sm pointer-events-none">
              <div className="text-[#176B87] font-bold mb-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> RECONSTRUCTED SLAB
              </div>
              <div>Region: <span className="font-semibold text-[#123B4A]">{satelliteData?.region_name || 'Arabian Sea'}</span></div>
              <div>Selected depth: <span className="font-bold text-[#2A8C82]">{selectedDepth} m</span></div>
              <div className="text-[10px] text-[#62757C]">{satelliteData?.coordinates.lat.toFixed(1)}°N, {satelliteData?.coordinates.lon.toFixed(1)}°E</div>
            </div>

            {/* In-situ ARGO Float Pin Indicator */}
            <div className="absolute bottom-3 right-3 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#D5E0E2] rounded-md p-2 text-[11px] font-mono text-[#123B4A] shadow-sm pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D99A3D]" />
                <span className="font-semibold">ARGO Float {argoData?.float_metadata.wmo_id || 'WMO-2902784'}</span>
              </div>
              <div className="text-[10px] text-[#62757C] mt-0.5">
                Collocation: 14.2 km distance
              </div>
            </div>
          </div>

          {/* Interactive Depth Slider below canvas */}
          <div className="mt-3 bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2] flex items-center gap-4">
            <Sliders className="w-4 h-4 text-[#176B87] shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-[#62757C] mb-1">
                <span>Surface (0 m)</span>
                <span className="text-[#123B4A] font-bold font-mono">Selected: {selectedDepth} m</span>
                <span>Deep (1000 m)</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="1"
                value={DEPTH_LEVELS.indexOf(selectedDepth)}
                onChange={(e) => setSelectedDepth(DEPTH_LEVELS[parseInt(e.target.value, 10)])}
                className="w-full h-1.5 bg-[#D5E0E2] rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: High-Resolution Vertical Profile & Metric Badges */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          {/* Active Depth Telemetry Card */}
          <div className="bg-[#F8FAFA] p-4 rounded-md border border-[#D5E0E2]">
            <div className="flex items-center justify-between text-xs text-[#62757C] pb-2 border-b border-[#D5E0E2]">
              <span className="font-medium text-[#123B4A]">Estimated layer metrics</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                confidenceScore >= 85 ? 'bg-[#DCEFEA] text-[#123B4A] border border-[#2A8C82]/30' : 'bg-[#FFF3D6] text-[#8C5E14] border border-[#D99A3D]/30'
              }`}>
                {confidenceScore >= 85 ? 'High confidence' : 'Medium confidence'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#D5E0E2]">
                <span className="text-[11px] text-[#62757C] block">Reconstructed temp</span>
                <div className="text-xl font-bold text-[#123B4A] font-mono mt-0.5">
                  {currentTemp.toFixed(2)} °C
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#D5E0E2]">
                <span className="text-[11px] text-[#62757C] block">Uncertainty (±1σ)</span>
                <div className="text-xl font-bold text-[#176B87] font-mono mt-0.5">
                  ±{currentUnc.toFixed(2)} °C
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#D5E0E2]">
                <span className="text-[11px] text-[#62757C] block">Data trust index</span>
                <div className="text-base font-bold text-[#2A8C82] font-mono mt-0.5">
                  {confidenceScore}%
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#D5E0E2]">
                <span className="text-[11px] text-[#62757C] block">ARGO in-situ</span>
                <div className="text-base font-bold text-[#123B4A] font-mono mt-0.5">
                  {argoData?.comparison_table.find(r => r.depth === selectedDepth)?.argo_observed.toFixed(2) || '24.5'} °C
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Profile SVG Visualization */}
          <div className="bg-[#FFFFFF] p-4 rounded-md border border-[#D5E0E2] flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#62757C] pb-2 border-b border-[#D5E0E2]">
              <span className="font-semibold text-[#123B4A]">Temperature with depth profile</span>
              <span className="text-[10px] text-[#62757C]">Depth inverted (0–1000 m)</span>
            </div>

            {/* Custom Scientific Profile SVG */}
            <div className="relative w-full h-56 mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 280 200">
                {/* Background grid */}
                <line x1="40" y1="10" x2="270" y2="10" stroke="#E2ECEE" strokeDasharray="2,2" />
                <line x1="40" y1="50" x2="270" y2="50" stroke="#E2ECEE" strokeDasharray="2,2" />
                <line x1="40" y1="100" x2="270" y2="100" stroke="#E2ECEE" strokeDasharray="2,2" />
                <line x1="40" y1="150" x2="270" y2="150" stroke="#E2ECEE" strokeDasharray="2,2" />
                <line x1="40" y1="190" x2="270" y2="190" stroke="#E2ECEE" strokeDasharray="2,2" />

                {/* Y-axis depth markers */}
                <text x="35" y="14" fill="#62757C" fontSize="8" fontFamily="Inter, sans-serif" textAnchor="end">0m</text>
                <text x="35" y="54" fill="#62757C" fontSize="8" fontFamily="Inter, sans-serif" textAnchor="end">100m</text>
                <text x="35" y="104" fill="#62757C" fontSize="8" fontFamily="Inter, sans-serif" textAnchor="end">300m</text>
                <text x="35" y="154" fill="#62757C" fontSize="8" fontFamily="Inter, sans-serif" textAnchor="end">600m</text>
                <text x="35" y="194" fill="#62757C" fontSize="8" fontFamily="Inter, sans-serif" textAnchor="end">1000m</text>

                {/* Thermocline highlight band */}
                <rect x="40" y="38" width="230" height="35" fill="rgba(217, 154, 61, 0.08)" stroke="rgba(217, 154, 61, 0.35)" strokeDasharray="3,3" />
                <text x="265" y="48" fill="#8C5E14" fontSize="7" fontFamily="Inter, sans-serif" textAnchor="end">Thermocline zone</text>

                {/* Reconstructed Temperature Line (Map temp 4C - 31C to x 40 - 270) */}
                {(() => {
                  const xCoord = (temp: number) => 40 + ((temp - 4) / (32 - 4)) * 230;
                  const yCoord = (depth: number) => {
                    if (depth <= 100) return 10 + (depth / 100) * 40;
                    if (depth <= 300) return 50 + ((depth - 100) / 200) * 50;
                    return 100 + ((depth - 300) / 700) * 90;
                  };

                  const points = profile.map(p => `${xCoord(p.temperature)},${yCoord(p.depth)}`);
                  const pathStr = `M ${points.join(' L ')}`;

                  const upperPoints = profile.map((p, idx) => {
                    const unc = uncertainties[idx]?.uncertainty || 0.6;
                    return `${xCoord(p.temperature + unc)},${yCoord(p.depth)}`;
                  });
                  const lowerPoints = profile.map((p, idx) => {
                    const unc = uncertainties[idx]?.uncertainty || 0.6;
                    return `${xCoord(p.temperature - unc)},${yCoord(p.depth)}`;
                  }).reverse();
                  const bandStr = `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;

                  const curY = yCoord(selectedDepth);
                  const curX = xCoord(currentTemp);

                  return (
                    <>
                      {/* Uncertainty Shading */}
                      <path d={bandStr} fill="rgba(42, 140, 130, 0.12)" />

                      {/* Main Profile Line: Solid Teal */}
                      <path d={pathStr} fill="none" stroke="#2A8C82" strokeWidth="2.5" />

                      {/* ARGO truth points: Dark Navy Dots */}
                      {argoData?.comparison_table.map((row) => (
                        <circle
                          key={row.depth}
                          cx={xCoord(row.argo_observed)}
                          cy={yCoord(row.depth)}
                          r="3"
                          fill="#123B4A"
                          stroke="#FFFFFF"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Active cursor line */}
                      <line x1="40" y1={curY} x2="270" y2={curY} stroke="#176B87" strokeWidth="1" strokeDasharray="3,3" />
                      <circle cx={curX} cy={curY} r="4.5" fill="#2A8C82" stroke="#FFFFFF" strokeWidth="1.5" />
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Profile Legend */}
            <div className="flex items-center justify-between text-[11px] text-[#62757C] pt-2 border-t border-[#D5E0E2]">
              <span className="flex items-center gap-1.5 text-[#123B4A] font-medium">
                <span className="w-3.5 h-0.75 bg-[#2A8C82] inline-block rounded" /> Neeraksh
              </span>
              <span className="flex items-center gap-1.5 text-[#62757C]">
                <span className="w-2.5 h-2 bg-[#2A8C82]/20 inline-block border border-[#2A8C82]/40 rounded-xs" /> ±1σ band
              </span>
              <span className="flex items-center gap-1.5 text-[#123B4A] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#123B4A] inline-block" /> ARGO in-situ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

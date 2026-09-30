import React from 'react';
import { 
  BookOpen, 
  X, 
  Layers, 
  Database, 
  Cpu, 
  Compass, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg border border-[#D5E0E2] p-6 sm:p-8 shadow-xl overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-md text-[#62757C] hover:text-[#071B33] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-[#E2ECEE]">
          <div className="w-9 h-9 rounded-md bg-[#DCEFEA] text-[#009FE3] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#071B33]">
              OceanEmbed / Neeraksh: Data & methodology
            </h2>
            <p className="text-xs text-[#62757C]">
              Theoretical formulation, mathematical structure, and validation protocols
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6 text-xs text-[#071B33] leading-relaxed">
          {/* 1. Problem Formulation */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-[#071B33] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#009FE3]" /> 1. Scientific problem formulation
            </h3>
            <p className="text-[#62757C]">
              Satellite remote sensing observes the surface boundary condition of the global ocean: infrared radiometers (Sentinel-3 SLSTR) measure Sea Surface Temperature (SST), microwave radiometers (SMAP) measure Sea Surface Salinity (SSS), and radar altimeters (Sentinel-6/Jason-3) measure dynamic Sea Surface Height anomalies (SSH).
            </p>
            <p className="text-[#62757C]">
              However, the interior 3D thermal structure T(x, y, z, t) down to 1000 m cannot be directly observed from satellites. OceanEmbed learns the non-linear transfer function f: X_surface → z_latent → Y_subsurface by leveraging baroclinic ocean dynamics and hydrographic stratification constraints.
            </p>
          </section>

          {/* 2. Model Architecture & Latent Space */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-[#071B33] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#009FE3]" /> 2. Learned representation architecture
            </h3>
            <p className="text-[#62757C]">
              The framework utilizes a multi-scale spatial convolutional encoder coupled with multi-head cross-attention. Surface observation grids are encoded into a compact 128-dimensional latent space capturing atmospheric-oceanic coupling states.
            </p>
            <div className="bg-[#F8FAFA] p-3 rounded-md border border-[#D5E0E2] font-mono text-[11px] text-[#071B33]">
              Loss: L = L_MSE(T, T_pred) + λ_1 · L_gradient(∂T/∂z, ∂T_pred/∂z) + λ_2 · L_stratification(N²)
            </div>
            <p className="text-[#62757C]">
              The depth decoder incorporates buoyancy stability penalization, ensuring reconstructed profiles maintain physically plausible density gradients without artificial inversions.
            </p>
          </section>

          {/* 3. In-Situ Validation Protocols */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-[#071B33] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#009FE3]" /> 3. Autonomous ARGO float collocation
            </h3>
            <p className="text-[#62757C]">
              Validation is performed against autonomous profiling CTD floats from the international ARGO program. Float observations are spatiotemporally collocated within Δr ≤ 25 km and Δt ≤ ±6 hours of coincident satellite observations. Evaluation metrics include Root Mean Square Error (RMSE), Mean Absolute Error (MAE), and Pearson correlation (r) across 15 standard oceanographic depth strata (0 m to 1000 m).
            </p>
          </section>

          {/* 4. Limitations */}
          <section className="space-y-2 bg-[#FFF9E6] p-4 rounded-md border border-[#FDE3A2]">
            <h3 className="text-sm font-semibold text-[#D99A3D] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> 4. Scientific limitations & operational boundaries
            </h3>
            <p className="text-[#071B33]">
              1. <strong>Cloud contamination:</strong> Heavy cloud cover degrades infrared SST accuracy, requiring microwave sensor fusion with coarser spatial resolution.
            </p>
            <p className="text-[#071B33]">
              2. <strong>Coastal dynamics:</strong> Estuarine runoff and bathymetric friction perturb geostrophic balance, elevating reconstruction uncertainty near continental shelves.
            </p>
            <p className="text-[#071B33]">
              3. <strong>Observational estimate:</strong> Reconstructions represent instantaneous vertical states from observational inputs rather than coupled numerical weather predictions.
            </p>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E2ECEE] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#009FE3] text-white font-medium text-xs hover:bg-[#071B33] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

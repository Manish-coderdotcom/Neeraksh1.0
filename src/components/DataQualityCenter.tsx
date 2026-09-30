import React from 'react';
import { 
  Database, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { SatelliteObservation } from '../types/ocean';

interface DataQualityCenterProps {
  satelliteData: SatelliteObservation | null;
}

export const DataQualityCenter: React.FC<DataQualityCenterProps> = ({
  satelliteData
}) => {
  const pipelineStages = [
    {
      step: 1,
      name: "Raw swath ingestion",
      desc: "Multi-satellite orbital swaths ingested from Sentinel-3, SMAP, Jason-3, and ASCAT.",
      metrics: "5 streams active • 1.2 GB/day",
      status: "Valid"
    },
    {
      step: 2,
      name: "Automated quality filtering",
      desc: "Cloud pixel masking, infrared sensor glint removal, and land contamination exclusion.",
      metrics: "QC-Flag 5 (Optimal)",
      status: "Valid"
    },
    {
      step: 3,
      name: "Spatio-temporal regridding",
      desc: "Kriging and spatio-temporal optimal interpolation onto a 0.25° uniform oceanographic grid.",
      metrics: "0.25° x 0.25° resolution",
      status: "Valid"
    },
    {
      step: 4,
      name: "Climatological standardization",
      desc: "Standardized relative to 30-year WOA climatological mean and variance (1991–2020).",
      metrics: "Mean μ=0, Std σ=1",
      status: "Valid"
    },
    {
      step: 5,
      name: "Model latent input tensor",
      desc: "Stacked 5-channel tensor [B, 5, H, W] projected into 128-dimensional attention encoder.",
      metrics: "Latency: 28 ms",
      status: "Ready"
    }
  ];

  const sensors = [
    { name: "Sea Surface Temperature (SST)", inst: "Sentinel-3 SLSTR", res: "1km L3S Gridded", cloud: "4.2%", completeness: "99.4%", latency: "2.8h", status: "Verified" },
    { name: "Sea Surface Salinity (SSS)", inst: "SMAP Radiometer", res: "25km 8-day mean", cloud: "N/A (L-Band)", completeness: "98.1%", latency: "12h", status: "Verified" },
    { name: "Sea Surface Height (SSH)", inst: "Sentinel-6 / Jason-3", res: "0.25° Altimetry", cloud: "N/A (Radar)", completeness: "99.8%", latency: "4.5h", status: "Verified" },
    { name: "Surface Geostrophic Currents", inst: "CMEMS Multi-Altimeter", res: "0.25° Vector Grid", cloud: "N/A", completeness: "99.2%", latency: "6.0h", status: "Verified" },
    { name: "Surface Wind Speed", inst: "MetOp ASCAT", res: "12.5km Scatterometer", cloud: "Clear", completeness: "97.9%", latency: "3.2h", status: "Verified" }
  ];

  return (
    <div className="bg-white border border-[#D5E0E2] rounded-lg p-5 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#DCEFEA] text-[#009FE3]">
              <Database className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-[#071B33]">
              Data quality control & ingestion pipeline
            </h2>
            <span className="text-[11px] font-mono bg-[#F4F9FC] text-[#62757C] border border-[#D5E0E2] px-2 py-0.5 rounded">
              L2 to L4 Pipeline
            </span>
          </div>
          <p className="text-xs text-[#62757C] mt-1">
            Data lineage, quality assurance flags, and spatial regridding protocols
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#009FE3] bg-[#DCEFEA] px-3 py-1 rounded-md border border-[#BCE3DA]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="font-medium">All sensor channels synchronized</span>
        </div>
      </div>

      {/* Visual Ingestion Pipeline */}
      <div className="mt-5">
        <span className="text-xs text-[#62757C] uppercase font-semibold block mb-3">
          Refinement pipeline: Raw satellite measurements to embedding tensor
        </span>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {pipelineStages.map((stage) => (
            <div key={stage.step} className="bg-[#F8FAFA] p-3.5 rounded-md border border-[#D5E0E2] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2ECEE]">
                  <span className="text-[10px] font-mono text-[#009FE3] font-semibold">Stage 0{stage.step}</span>
                  <span className="text-[10px] font-mono text-[#009FE3] bg-[#DCEFEA] px-1.5 py-0.5 rounded border border-[#BCE3DA]">
                    {stage.status}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#071B33] mt-2">{stage.name}</h4>
                <p className="text-[11px] text-[#62757C] mt-1 leading-relaxed">{stage.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E2ECEE] text-[10px] font-mono text-[#62757C]">
                {stage.metrics}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Stream QA Table */}
      <div className="mt-6 bg-[#F8FAFA] rounded-md border border-[#D5E0E2] overflow-hidden">
        <div className="p-3 bg-white border-b border-[#D5E0E2] flex items-center justify-between text-xs text-[#071B33] font-medium">
          <span>Satellite sensor channel telemetry audit</span>
          <span className="text-[11px] text-[#62757C]">5 sensor streams active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F4F9FC] text-[#62757C] uppercase text-[10px] border-b border-[#D5E0E2]">
              <tr>
                <th className="py-2.5 px-3">Variable</th>
                <th className="py-2.5 px-3">Instrument</th>
                <th className="py-2.5 px-3">Resolution</th>
                <th className="py-2.5 px-3">Cloud Fraction</th>
                <th className="py-2.5 px-3">Completeness</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2ECEE] text-[#071B33]">
              {sensors.map((s) => (
                <tr key={s.name} className="hover:bg-white transition">
                  <td className="py-2.5 px-3 font-semibold text-[#071B33] font-sans">{s.name}</td>
                  <td className="py-2.5 px-3 text-[#009FE3]">{s.inst}</td>
                  <td className="py-2.5 px-3 text-[#62757C]">{s.res}</td>
                  <td className="py-2.5 px-3 text-[#62757C]">{s.cloud}</td>
                  <td className="py-2.5 px-3 text-[#009FE3] font-semibold">{s.completeness}</td>
                  <td className="py-2.5 px-3 text-[#62757C]">{s.latency}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="bg-[#DCEFEA] text-[#009FE3] border border-[#BCE3DA] px-2 py-0.5 rounded text-[10px] font-medium">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

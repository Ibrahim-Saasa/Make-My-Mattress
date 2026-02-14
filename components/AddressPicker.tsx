import React, { useState, useEffect, useRef } from "react";
import L, { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Address } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
}

const AddressPicker: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pinPos, setPinPos] = useState({ lat: 18.5204, lng: 73.8567 }); // Pune center
  const [formData, setFormData] = useState({
    label: "Home",
    details: "",
    landmark: "",
    city: "Pune",
    pincode: "",
  });

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      if (data.address) {
        const addr = data.address;
        setFormData((prev) => ({
          ...prev,
          city: addr.city || addr.town || prev.city,
          landmark: addr.building || addr.public_building || "",
          pincode: addr.postcode || prev.pincode,
          details: data.display_name?.substring(0, 70) || "",
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const debouncedReverseGeocode = useRef(
    (() => {
      let timeout: NodeJS.Timeout;
      return (lat: number, lng: number) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => reverseGeocode(lat, lng), 400);
      };
    })(),
  ).current;

  // Initialize Leaflet map on modal open
  useEffect(() => {
    if (!isOpen || !containerRef.current || mapRef.current) return;

    // Initialize map centered on Pune
    const map = L.map(containerRef.current).setView(
      [pinPos.lat, pinPos.lng],
      15,
    );
    mapRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Add draggable marker
    const marker = L.marker([pinPos.lat, pinPos.lng], {
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    // Handle marker drag end
    marker.on("dragend", () => {
      const newLatLng = marker.getLatLng();
      setPinPos({ lat: newLatLng.lat, lng: newLatLng.lng });
      debouncedReverseGeocode(newLatLng.lat, newLatLng.lng);
    });

    // Initial reverse geocoding
    reverseGeocode(pinPos.lat, pinPos.lng);

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isOpen]);

  const handleSave = () => {
    if (!formData.details || !formData.pincode) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      lat: pinPos.lat,
      lng: pinPos.lng,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] md:h-[80vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              Pin Your Comfort
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Set precise delivery location
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Leaflet Map Container */}
          <div
            ref={containerRef}
            className="relative h-64 md:h-80 bg-slate-100"
            style={{ minHeight: "320px" }}
          />

          {/* Form Area */}
          <div className="p-8 space-y-6">
            <div className="flex gap-4">
              {["Home", "Work", "Other"].map((l) => (
                <button
                  key={l}
                  onClick={() => setFormData({ ...formData, label: l })}
                  className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    formData.label === l
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                      : "bg-slate-50 text-slate-400 border-slate-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  House/Flat No & Street
                </label>
                <input
                  type="text"
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors"
                  placeholder="e.g. 402, Signature Towers, Pune Road"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Landmark
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) =>
                    setFormData({ ...formData, landmark: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors"
                  placeholder="Near Metro Station"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pincode: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors"
                  placeholder="411001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={!formData.details || !formData.pincode}
            className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-30"
          >
            CONFIRM DELIVERY ADDRESS
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressPicker;


import React, { useState, useEffect, useRef } from 'react';
import { Address } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
}

const AddressPicker: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [pinPos, setPinPos] = useState({ x: 50, y: 50 });
  const [formData, setFormData] = useState({
    label: 'Home',
    details: '',
    landmark: '',
    city: 'Pune',
    pincode: ''
  });
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        // Just centering for visual effect in prototype
        setPinPos({ x: 50, y: 50 });
      });
    }
  }, [isOpen]);

  const handleMapClick = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinPos({ x, y });
  };

  const handleSave = () => {
    if (!formData.details || !formData.pincode) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      lat: 18.5204 + (pinPos.y - 50) * 0.01,
      lng: 73.8567 + (pinPos.x - 50) * 0.01
    });
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
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Pin Your Comfort</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Set precise delivery location</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Map Simulation Area */}
          <div 
            ref={mapRef}
            onClick={handleMapClick}
            className="relative h-64 md:h-80 bg-indigo-50 cursor-crosshair overflow-hidden group"
          >
            {/* Grid Pattern Background for "Map" Look */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'radial-gradient(#1E1B4B 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
            
            {/* Pulsing Pin */}
            <div 
              className="absolute transition-all duration-300 ease-out pointer-events-none"
              style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%`, transform: 'translate(-50%, -100%)' }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-600/40 animate-bounce">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px] animate-pulse" />
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
              Tap anywhere to move pin
            </div>
          </div>

          {/* Form Area */}
          <div className="p-8 space-y-6">
            <div className="flex gap-4">
              {['Home', 'Work', 'Other'].map(l => (
                <button
                  key={l}
                  onClick={() => setFormData({...formData, label: l})}
                  className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    formData.label === l ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">House/Flat No & Street</label>
                <input 
                  type="text"
                  value={formData.details}
                  onChange={e => setFormData({...formData, details: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors"
                  placeholder="e.g. 402, Signature Towers, Pune Road"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Landmark</label>
                <input 
                  type="text"
                  value={formData.landmark}
                  onChange={e => setFormData({...formData, landmark: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors"
                  placeholder="Near Metro Station"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Pincode</label>
                <input 
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
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

import React from 'react';
import { BRANDS } from '../constants';
import { BrandMetadata } from '../types';
import { useTheme } from '../src/contexts/ThemeContext'; // Import useTheme

interface Props {
  onSelectBrand: (brand: BrandMetadata) => void;
  userName: string | null; // New prop for user's name
}

const BrandHall: React.FC<Props> = ({ onSelectBrand, userName }) => {
  const { theme } = useTheme(); // Get current theme

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          {userName && (
            <p className="text-lg font-bold text-indigo-700 mb-2">Hello, {userName}!</p>
          )}
          <h2 className="text-3xl font-extrabold text-theme-primary tracking-tight">Select Your Sleep Series</h2>
          <p className="text-theme-secondary mt-2">Engineered sub-brands optimized for specific comfort profiles.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-theme-secondary uppercase tracking-widest">
            <span className="w-3 h-3 rounded-full bg-theme-border"></span>
            Filter by Technology
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BRANDS.map((brand, idx) => (
          <button 
            key={brand.id}
            onClick={() => onSelectBrand(brand)}
            className={`group relative h-[420px] rounded-[2rem] overflow-hidden bg-theme-card border border-theme-border hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 transition-all text-left hover:scale-[1.02]
              ${theme === 'dark' ? 'shadow-lg shadow-indigo-500/5' : ''}
            `}
          >
            {/* Visual Background/Texture representation */}
            <div className={`absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none ${
              brand.name === 'Slumbersoft' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 to-transparent' :
              brand.name === 'Sleepworks' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 to-transparent' :
              brand.name === 'Spinowell' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent' :
              brand.name === 'Bedding N More' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 to-transparent' :
              brand.name === 'Sleepson' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-500 to-transparent' :
              'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 to-transparent'
            }`}></div>

            <div className="p-8 h-full flex flex-col justify-between relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-theme-secondary mb-2 block">{brand.type}</span>
                <h3 className="text-3xl font-extrabold text-theme-primary group-hover:text-indigo-700 transition-colors">{brand.name}</h3>
                <p className="text-sm text-theme-secondary mt-4 leading-relaxed line-clamp-2">{brand.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(dot => (
                    <div key={dot} className={`h-1 flex-1 rounded-full ${dot <= (idx % 3 + 3) ? 'bg-indigo-700 shadow-sm' : 'bg-theme-input'}`}></div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-theme-secondary uppercase">Comfort Rating</span>
                  <div className="w-10 h-10 rounded-full border border-theme-border flex items-center justify-center group-hover:bg-indigo-700 group-hover:text-white group-hover:border-indigo-700 transition-all shadow-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Unique Iconography for "Vacuum Sealed" or "Ortho" */}
            <div className="absolute top-8 right-8">
               {brand.name === 'SleepGenie' && (
                 <div className="bg-indigo-900 text-white p-2 rounded-lg rotate-12 flex items-center gap-1 shadow-md">
                   <span className="text-[8px] font-bold">VACUUM TECH</span>
                 </div>
               )}
               {brand.name === 'Spinowell' && (
                 <div className="bg-blue-700 text-white p-2 rounded-lg -rotate-6 flex items-center gap-1 shadow-md">
                   <span className="text-[8px] font-bold">ORTHO ALIGN</span>
                 </div>
               )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandHall;
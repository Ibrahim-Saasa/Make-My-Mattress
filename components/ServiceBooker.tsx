
import React, { useState } from 'react';
import { ServiceType, ServiceRequest, RequestStatus } from '../types';

interface Props {
  onBack: () => void;
  onSuccess: (req: ServiceRequest) => void;
}

const ServiceBooker: React.FC<Props> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  // FIX: Using correct ServiceType.MEASURE instead of MEASUREMENT
  const [type, setType] = useState<ServiceType>(ServiceType.MEASURE);
  const [formData, setFormData] = useState({
    pincode: '',
    date: '',
    slot: '10:00 AM - 01:00 PM'
  });

  const slots = [
    '10:00 AM - 01:00 PM',
    '01:00 PM - 04:00 PM',
    '04:00 PM - 07:00 PM'
  ];

  const handleBooking = () => {
    // Technician Assignment Simulation
    // FIX: Aligned mockRequest with ServiceRequest interface and used correct RequestStatus enum
    const mockRequest: ServiceRequest = {
      request_id: `SR-${Math.random().toString(36).substring(2, 9)}`,
      user_id: 'GUEST_USER_ID',
      service_type: type,
      status: RequestStatus.ASSIGNED,
      scheduled_date: formData.date,
      time_slot: formData.slot,
      service_fee: 299,
      is_fee_adjusted: false,
      payment_transaction_id: `TXN-${Date.now()}`,
      sac_code: type === ServiceType.REPAIR ? '9987' : '9983'
    };
    onSuccess(mockRequest);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Service Context */}
        <div className="md:w-5/12 bg-indigo-600 p-12 text-white">
          <button onClick={onBack} className="mb-12 hover:opacity-70 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="space-y-6">
            <h2 className="text-4xl font-black leading-tight">Elite Support.</h2>
            <p className="text-indigo-100 text-sm leading-relaxed opacity-80">
              Our certified technicians ensure your mattress is perfect from dimensioning to disposal.
            </p>
            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                <span className="text-[10px] font-bold tracking-widest uppercase">Certified Agents</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                <span className="text-[10px] font-bold tracking-widest uppercase">Punctuality Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="md:w-7/12 p-12 space-y-10">
          {step === 1 && (
            <div className="animate-in slide-in-from-right duration-500">
              <h3 className="text-xl font-black text-slate-900 mb-6">What do you need help with?</h3>
              <div className="space-y-3">
                {[
                  // FIX: Using correct ServiceType.MEASURE instead of MEASUREMENT
                  { id: ServiceType.MEASURE, label: 'Standard Measurement', sub: 'Technician visits to measure your bed frame precisely.' },
                  { id: ServiceType.REPAIR, label: 'Professional Repair', sub: 'On-site foam adjustments or cover replacements.' },
                  { id: ServiceType.DISPOSAL, label: 'Eco-Friendly Disposal', sub: 'We collect and recycle your old mattress responsibly.' }
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => { setType(item.id); setStep(2); }}
                    className="w-full text-left p-6 rounded-3xl border border-slate-100 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all bg-white group"
                  >
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.label}</h4>
                    <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right duration-500 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Schedule Visit</h3>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Pincode</label>
                <input 
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={e => setFormData({...formData, pincode: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none"
                  placeholder="Enter 6-Digit Pincode"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Preferred Date</label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Available Time Slots</label>
                <div className="grid grid-cols-1 gap-2">
                  {slots.map(s => (
                    <button 
                      key={s}
                      onClick={() => setFormData({...formData, slot: s})}
                      className={`text-left p-4 rounded-xl text-xs font-bold border transition-all ${
                        formData.slot === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-slate-400">Back</button>
                <button 
                  disabled={!formData.pincode || !formData.date}
                  onClick={handleBooking} 
                  className="flex-1 bg-slate-900 text-white rounded-2xl font-bold py-4 hover:bg-black disabled:opacity-30 transition-all shadow-xl"
                >
                  Pay Booking Fee (₹299)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceBooker;

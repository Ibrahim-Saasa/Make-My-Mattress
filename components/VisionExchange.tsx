
import { GoogleGenAI } from "@google/genai";
import React, { useState } from 'react';

interface Props {
  onResult: (data: { size: string; condition: string; value: number }) => void;
}

const VisionExchange: React.FC<Props> = ({ onResult }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      analyzeImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      // Always initialize with named apiKey parameter
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = base64.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: "Analyze this old mattress. Detect: 1. Size (Single/Double/King). 2. Physical condition (Torn/Sagging/Stained). 3. Based on condition, suggest a buyback exchange value between ₹500 and ₹5000. Return only raw JSON string with keys: size, condition, value." }
          ]
        }
        // Removed responseMimeType as it is not supported for gemini-2.5-flash-image (nano banana series)
      });

      // Use response.text property access
      const text = response.text || '{}';
      const jsonStr = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);
      onResult(data);
    } catch (error) {
      console.error("Vision Analysis Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center transition-all hover:bg-slate-100/50">
      <input 
        type="file" 
        accept="image/*" 
        id="mattress-upload" 
        className="hidden" 
        onChange={handleFileChange}
      />
      
      {isAnalyzing ? (
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest animate-pulse">AI Scanning Condition...</p>
        </div>
      ) : image ? (
        <div className="space-y-4">
          <img src={image} className="h-32 mx-auto rounded-xl object-cover shadow-lg" alt="Upload preview" />
          <p className="text-xs font-medium text-slate-500">Scan Complete. AI is calculating exchange value...</p>
        </div>
      ) : (
        <label htmlFor="mattress-upload" className="cursor-pointer block">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Exchange & Save</h4>
          <p className="text-xs text-slate-500 max-w-[200px] mx-auto">Upload a photo of your old mattress for instant AI valuation.</p>
        </label>
      )}
    </div>
  );
};

export default VisionExchange;

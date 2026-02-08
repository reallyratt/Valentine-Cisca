
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ValentineStep, ValentineData, ButtonPosition } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<ValentineStep>(ValentineStep.PROPOSAL);
  const [data, setData] = useState<ValentineData>({
    willBeValentine: '',
    reason: '',
  });
  const [okButtonPos, setOkButtonPos] = useState<ButtonPosition>({ x: 0, y: 0 });
  const [isEscaping, setIsEscaping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // When Ci Cisca picks "Ew, no!", the button starts running away
  useEffect(() => {
    if (data.willBeValentine === 'Ew, no!') {
      setIsEscaping(true);
    } else {
      setIsEscaping(false);
      setOkButtonPos({ x: 0, y: 0 }); // Reset position
    }
  }, [data.willBeValentine]);

  const handleTeleport = useCallback(() => {
    if (!isEscaping) return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 120; // Safe area
      
      // Calculate random coordinates within the container bounds
      const maxX = (rect.width / 2) - 60;
      const maxY = (rect.height / 2) - 40;
      
      const newX = (Math.random() - 0.5) * 2 * maxX;
      const newY = (Math.random() - 0.5) * 2 * maxY;
      
      setOkButtonPos({ x: newX, y: newY });
    }
  }, [isEscaping]);

  const handleProposalSubmit = (e: React.MouseEvent) => {
    if (data.willBeValentine === 'Ew, no!') {
      e.preventDefault();
      handleTeleport(); // Keep moving if clicked
      return;
    }
    if (data.willBeValentine === 'YES!') {
      setStep(ValentineStep.WHY);
    }
  };

  const handleWhySubmit = () => {
    setStep(ValentineStep.SUMMARY);
  };

  const copyToClipboard = () => {
    const text = `Cisca said: Yes!\nBecause: ${data.reason}`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard! Send it to Cay! 😊');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#fff5f5]">
      <div 
        ref={containerRef}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 z-10 border border-pink-100 transition-all duration-500"
      >
        {step === ValentineStep.PROPOSAL && (
          <div className="text-center space-y-8 py-4">
            <h1 className="text-4xl font-romantic text-pink-600 mb-2">Hi, Ci Cisca!!</h1>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              Will you let me be your valentine this year? ✨
            </p>
            
            <div className="space-y-4">
              <select 
                value={data.willBeValentine}
                onChange={(e) => setData({ ...data, willBeValentine: e.target.value })}
                className="w-full p-4 rounded-xl border-2 border-pink-200 focus:border-pink-400 outline-none transition-all text-gray-700 font-semibold text-center appearance-none bg-white cursor-pointer"
              >
                <option value="" disabled>Choose...</option>
                <option value="YES!">YES! 😊</option>
                <option value="Ew, no!">Ew, no! 🤮</option>
              </select>
              
              <div className="relative h-24 flex items-center justify-center">
                <button
                  onMouseEnter={handleTeleport}
                  onClick={handleProposalSubmit}
                  style={{
                    position: isEscaping ? 'absolute' : 'relative',
                    transform: `translate(${okButtonPos.x}px, ${okButtonPos.y}px)`,
                    transition: isEscaping ? 'transform 0.1s ease-out' : 'all 0.3s ease'
                  }}
                  className={`px-12 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg transition-all active:scale-95 ${!data.willBeValentine ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!data.willBeValentine}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {step === ValentineStep.WHY && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-romantic text-pink-600">Why? 🤔</h2>
            <p className="text-gray-600">Give me your reasons, Cisca!</p>
            
            <textarea
              value={data.reason}
              onChange={(e) => setData({ ...data, reason: e.target.value })}
              placeholder="Because you are the best..."
              className="w-full min-h-[150px] p-5 rounded-2xl border-2 border-pink-100 focus:border-pink-400 outline-none transition-all text-gray-700 resize-none bg-pink-50/30"
            />
            
            <button
              onClick={handleWhySubmit}
              disabled={!data.reason.trim()}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                !data.reason.trim()
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-xl'
              }`}
            >
              Submit to Cay
            </button>
          </div>
        )}

        {step === ValentineStep.SUMMARY && (
          <div className="text-center space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="inline-block p-4 bg-pink-100 rounded-full mb-2">
              <span className="text-4xl">🧸</span>
            </div>
            <h2 className="text-3xl font-romantic text-pink-600">Yay! It's a Date!</h2>
            
            <div className="p-6 bg-white border-2 border-dashed border-pink-200 rounded-2xl relative text-left">
              <p className="text-gray-700 font-medium">Cisca said: Yes!</p>
              <p className="text-gray-700 font-medium">Because: {data.reason}</p>
            </div>

            <p className="text-sm text-gray-500 px-4">
              Copy this message and send it to Cay!
            </p>
            
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={copyToClipboard}
                className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Copy Response for Cay 📋
              </button>
              
              <button
                onClick={() => {
                  setData({ willBeValentine: '', reason: '' });
                  setStep(ValentineStep.PROPOSAL);
                }}
                className="text-gray-400 hover:text-pink-400 transition-colors text-sm"
              >
                Start Over?
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-4 text-pink-300 text-xs font-medium z-10">
        Personalized for Cisca by Cay
      </footer>
    </div>
  );
};

export default App;


import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
enum ValentineStep {
  PROPOSAL = 'PROPOSAL',
  WHY = 'WHY',
  SUMMARY = 'SUMMARY'
}

interface ValentineData {
  willBeValentine: string;
  reason: string;
}

interface ButtonPosition {
  x: number;
  y: number;
}

// --- Components ---

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * (30 - 10) + 10}px`,
      duration: `${Math.random() * (15 - 5) + 5}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .heart-particle {
          position: absolute;
          top: -10vh;
          animation: fall linear infinite;
        }
      `}</style>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-particle text-pink-400/30"
          style={{
            left: heart.left,
            fontSize: heart.size,
            animationDuration: heart.duration,
            animationDelay: heart.delay,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [step, setStep] = useState<ValentineStep>(ValentineStep.PROPOSAL);
  const [data, setData] = useState<ValentineData>({
    willBeValentine: '',
    reason: '',
  });
  const [okButtonPos, setOkButtonPos] = useState<ButtonPosition>({ x: 0, y: 0 });
  const [isEscaping, setIsEscaping] = useState(false);
  const [buttonText, setButtonText] = useState('Copy Response for Cay 📋');
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
      
      // Calculate random coordinates within the container bounds
      // Reduced bounds slightly to keep button easier to see on mobile
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
    
    // UI feedback instead of alert for better mobile experience
    setButtonText('Copied! Send it now! ✅');
    setTimeout(() => setButtonText('Copy Response for Cay 📋'), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#fff5f5]">
      <FloatingHearts />
      
      <div 
        ref={containerRef}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-2xl p-6 sm:p-8 z-10 border border-pink-100 transition-all duration-500"
      >
        {step === ValentineStep.PROPOSAL && (
          <div className="text-center space-y-8 py-4 animate-in fade-in duration-700">
            <h1 className="text-4xl sm:text-5xl font-romantic text-pink-600 mb-2 drop-shadow-sm">Hi, Ci Cisca!!</h1>
            <p className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed">
              Will you let me be your <span className="text-pink-500 font-bold">Valentine</span> this year? ✨
            </p>
            
            <div className="space-y-6">
              <div className="relative">
                <select 
                  value={data.willBeValentine}
                  onChange={(e) => setData({ ...data, willBeValentine: e.target.value })}
                  className="w-full p-4 rounded-xl border-2 border-pink-200 focus:border-pink-400 outline-none transition-all text-gray-700 font-semibold text-center appearance-none bg-white cursor-pointer shadow-sm"
                >
                  <option value="" disabled>Choose...</option>
                  <option value="YES!">YES! 😊</option>
                  <option value="Ew, no!">Ew, no! 🤮</option>
                </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-300">▼</div>
              </div>
              
              <div className="relative h-24 flex items-center justify-center">
                <button
                  onMouseEnter={handleTeleport}
                  onTouchStart={handleTeleport}
                  onClick={handleProposalSubmit}
                  style={{
                    position: isEscaping ? 'absolute' : 'relative',
                    transform: `translate(${okButtonPos.x}px, ${okButtonPos.y}px)`,
                    transition: isEscaping ? 'transform 0.1s ease-out' : 'all 0.3s ease'
                  }}
                  className={`px-12 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-lg transition-all active:scale-95 ${!data.willBeValentine ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                  disabled={!data.willBeValentine}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {step === ValentineStep.WHY && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
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
          <div className="text-center space-y-6 animate-in slide-in-from-bottom duration-700">
            <div className="inline-block p-4 bg-pink-100 rounded-full mb-2">
              <span className="text-4xl animate-bounce">🧸</span>
            </div>
            <h2 className="text-3xl font-romantic text-pink-600">Yay! It's a Date!</h2>
            
            <div className="p-6 bg-white border-2 border-dashed border-pink-200 rounded-2xl relative text-left shadow-sm">
              <p className="text-gray-700 font-medium text-lg">Cisca said: <span className="text-pink-500 font-bold">Yes!</span></p>
              <p className="text-gray-600 mt-2 text-sm">Because:</p>
              <p className="text-gray-800 font-medium italic pl-2 border-l-4 border-pink-200">{data.reason}</p>
            </div>

            <p className="text-sm text-gray-500 px-4">
              Copy this message and send it to Cay!
            </p>
            
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={copyToClipboard}
                className={`w-full py-4 font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  buttonText.includes('Copied') 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                }`}
              >
                {buttonText}
              </button>
              
              <button
                onClick={() => {
                  setData({ willBeValentine: '', reason: '' });
                  setStep(ValentineStep.PROPOSAL);
                }}
                className="text-gray-400 hover:text-pink-400 transition-colors text-sm font-medium"
              >
                Start Over?
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-4 text-pink-300 text-xs font-bold tracking-widest uppercase z-10 opacity-60">
        Personalized for Cisca by Cay
      </footer>
    </div>
  );
};

// Root Mounting
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

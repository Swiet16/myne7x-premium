import { useEffect, useState } from 'react';

interface CosmicLoaderProps {
  isLoading: boolean;
}

const CosmicLoader = ({ isLoading }: CosmicLoaderProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      {/* Cosmic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-neon-purple/10 to-neon-cyan/10 animate-pulse"></div>
        
        {/* Animated Stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-neon-cyan rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: (Math.random() * 2 + 1) + 's'
            }}
          />
        ))}
      </div>

      {/* Main Loader Content */}
      <div className="relative z-10 text-center">
        {/* Thor Lightning Effect */}
        <div className="relative mb-8">
          <div className="cosmic-lightning">
            <div className="lightning-bolt"></div>
            <div className="lightning-bolt lightning-bolt-2"></div>
            <div className="lightning-bolt lightning-bolt-3"></div>
          </div>
          
          {/* Central Energy Core */}
          <div className="energy-core">
            <div className="core-inner"></div>
            <div className="core-ring"></div>
            <div className="core-ring core-ring-2"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h1 className="text-6xl font-orbitron font-black text-glow cosmic-text">
            Myne7x
          </h1>
          <p className="text-lg text-muted-foreground font-inter">
            Loading{dots}
          </p>
        </div>
      </div>

      <style>{`
        .cosmic-lightning {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto;
        }

        .lightning-bolt {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 60px;
          background: linear-gradient(180deg, hsl(var(--neon-cyan)), hsl(var(--neon-blue)));
          transform: translate(-50%, -50%) rotate(0deg);
          border-radius: 2px;
          animation: lightningStrike 2s infinite ease-in-out;
          box-shadow: 0 0 20px hsl(var(--neon-cyan));
        }

        .lightning-bolt-2 {
          transform: translate(-50%, -50%) rotate(120deg);
          animation-delay: 0.7s;
          background: linear-gradient(180deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)));
          box-shadow: 0 0 20px hsl(var(--neon-purple));
        }

        .lightning-bolt-3 {
          transform: translate(-50%, -50%) rotate(240deg);
          animation-delay: 1.4s;
          background: linear-gradient(180deg, hsl(var(--neon-green)), hsl(var(--neon-orange)));
          box-shadow: 0 0 20px hsl(var(--neon-green));
        }

        .energy-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
        }

        .core-inner {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, hsl(var(--neon-blue)), hsl(var(--neon-purple)));
          border-radius: 50%;
          animation: coreGlow 2s infinite ease-in-out;
          box-shadow: 0 0 30px hsl(var(--neon-blue));
        }

        .core-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 60px;
          height: 60px;
          border: 2px solid hsl(var(--neon-cyan));
          border-radius: 50%;
          border-top-color: transparent;
          animation: coreRingRotate 3s infinite linear;
        }

        .core-ring-2 {
          top: -20px;
          left: -20px;
          width: 80px;
          height: 80px;
          border-color: hsl(var(--neon-purple));
          border-right-color: transparent;
          animation-duration: 4s;
          animation-direction: reverse;
        }

        .cosmic-text {
          background: linear-gradient(45deg, 
            hsl(var(--neon-blue)), 
            hsl(var(--neon-purple)), 
            hsl(var(--neon-cyan)), 
            hsl(var(--neon-pink))
          );
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: cosmicTextFlow 4s ease-in-out infinite;
        }

        @keyframes lightningStrike {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) scale(1);
          }
          50% {
            opacity: 0.7;
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) scale(1.2);
          }
        }

        @keyframes coreGlow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px hsl(var(--neon-blue));
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 50px hsl(var(--neon-purple));
          }
        }

        @keyframes coreRingRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes cosmicTextFlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default CosmicLoader;
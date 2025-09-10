import React from 'react';
import Ballpit from './Ballpit.jsx';
import LiquidEther from './LiquidEther.jsx';

const Background3D = ({ theme, section = 'home' }) => {
  // Respect the theme passed from App; fallback to system preference if undefined
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode = theme ?? (systemPrefersDark ? 'dark' : 'light');
  const isLight = mode === 'light';

  const lightPalette = ['#ffd47a', '#ff9f6b', '#ff6b9f'];
  const darkPalette = ['#5227FF', '#FF9FFC', '#B19EEF'];

  return (
    <div className="fixed inset-0 pointer-events-auto z-0" aria-hidden="true">
      <div className="w-full h-full" key={mode}>
        {isLight ? (
          <Ballpit
            count={200}
            gravity={0.7}
            friction={0.8}
            wallBounce={0.95}
            followCursor={true}
            colors={lightPalette}
            className="w-full h-full"

          />
        ) : (
          <LiquidEther
            colors={darkPalette}
            mouseForce={30}
            cursorSize={120}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

export default Background3D;
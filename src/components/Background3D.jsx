import React from 'react';
import Ballpit from './Ballpit.jsx';
import LiquidEther from './LiquidEther.jsx';


const Background3D = ({ theme, section = 'home' }) => {
  // Respect the theme passed from App; fallback to system preference if undefined
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode = theme ?? (systemPrefersDark ? 'dark' : 'light');
  const isLight = mode === 'light';

  const lightPalette = ['#ffe28a', '#ffd47a', '#ffb66b', '#ff9f6b', '#ff6b9f'];
  const darkPalette = ['#2a0aff', '#5227FF', '#A36BFF', '#B19EEF', '#FF9FFC'];


  return (
    <div className="fixed inset-0 pointer-events-auto z-0" aria-hidden="true">
      <div className="w-full h-full" key={mode}>
        {isLight ? (
          <Ballpit
            colors={lightPalette}
            className="w-full h-full"

          />
        ) : (
          <LiquidEther
            colors={darkPalette}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

export default Background3D;

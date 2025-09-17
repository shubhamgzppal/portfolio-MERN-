import React from 'react';
import Ballpit from './Ballpit.jsx';
import LiquidEther from './LiquidEther.jsx';


const Background3D = ({ theme, section = 'home' }) => {
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode = theme ?? (systemPrefersDark ? 'dark' : 'light');
  const isLight = mode === 'light';

  const lightPalette = ['#060016', '#bfb8b4', '#3f4ce0' , '#baadf0' ];
  const darkPalette = ['#5227FF', '#FF9FFC', '#B19EEF'];

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


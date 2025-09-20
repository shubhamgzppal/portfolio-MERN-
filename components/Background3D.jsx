import React from 'react';
import Ballpit from './Ballpit.jsx';
import LiquidEther from './LiquidEther.jsx';


const Background3D = ({ theme, section = 'home' }) => {
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode = theme ?? (systemPrefersDark ? 'dark' : 'light');
  const isLight = mode === 'light';

  return (
    <div className="fixed inset-0 pointer-events-auto z-0" aria-hidden="true">
      <div className="w-full h-full" key={mode}>
        {isLight ? (
          <Ballpit
            className="w-full h-full"
          />
        ) : (
          <LiquidEther
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

export default Background3D;


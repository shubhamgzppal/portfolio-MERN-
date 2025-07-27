import { useDomain } from '../contexts/DomainContext';

export default function DomainToggle() {
  const { currentDomain, toggleDomain } = useDomain();
  
  return (    
    <button
        onClick={toggleDomain}
        className="fixed bottom-5 right-4 z-50 p-2 hidden rounded-full bg-white/90 dark:bg-primary/90 shadow-xl border-2 border-secondary/20 backdrop-blur-sm hover:scale-105 group perspective-1000"
        title="Switch Domain"   //remove hidden from css to show domain change toggle
      >        
      <div className="w-24 h-24 relative">
          {/* Fixed center text */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="text-sm font-medium text-primary dark:text-white/90 bg-white/50 dark:bg-primary/50 px-2 py-1 rounded-full backdrop-blur-sm">
              Domain
            </div>
          </div>

          {/* Rotating outer ring */}
          <div className={`w-full h-full absolute [transform-style:preserve-3d] transition-all duration-700
            ${currentDomain === 'FULL_STACK' ? 'rotate-0' : 'rotate-y-180'}`}>
            
            {/* Front face (Full Stack) */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
              <div className="h-full flex flex-col justify-between py-3">
                {/* Top domain */}
                <div className="w-full flex justify-center">
                  <span className="bg-blue-500/10 px-3 py-1 rounded-full text-xs font-medium text-blue-700 dark:text-blue-700">
                    Full Stack
                  </span>
                </div>
                
                {/* Empty center space */}
                <div className="h-8"></div>
                
                {/* Bottom domain */}
                <div className="w-full flex justify-center">
                  <span className="bg-purple-500/10 px-3 py-1 rotate-y-180 rounded-full text-xs font-medium text-purple-700 dark:text-purple-700 opacity-30 group-hover:opacity-50">
                    Data Science
                  </span>
                </div>
              </div>
            </div>
            
            {/* Decorative circle */}
            <div className="absolute inset-0 border-2 border-secondary/20 rounded-full"></div>
          </div>
        </div>
    </button>
  );
}

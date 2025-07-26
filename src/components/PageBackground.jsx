import Background3D from './Background3D';

export default function PageBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
      {/* 3D Background */}
      <Background3D />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

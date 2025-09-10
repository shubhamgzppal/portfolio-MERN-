export default function PageBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
      
      {/* Content */}
      <div className="relative z-1">
        {children}
      </div>
    </div>
  );
}

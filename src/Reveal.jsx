import { useRevealOnScroll } from './useRevealOnScroll';
import './Reveal.css';

export default function Reveal({ children, className = '' }) {
  const ref = useRevealOnScroll();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
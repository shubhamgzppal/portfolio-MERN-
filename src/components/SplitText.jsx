import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Manual SplitText: wraps characters or words in spans and animates them with GSAP
export default function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars', // 'chars' or 'words'
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = 'left',
  onLetterAnimationComplete
}) {
  const el = useRef(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;

    // clear existing
    node.innerHTML = '';

    let targets = [];

    if (splitType === 'words') {
      const words = text.split(' ');
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'split-word inline-block';
        span.style.whiteSpace = 'pre';
        span.textContent = w + (i < words.length - 1 ? ' ' : '');
        node.appendChild(span);
        targets.push(span);
      });
    } else {
      // chars
      Array.from(text).forEach(ch => {
        const span = document.createElement('span');
        span.className = 'split-char inline-block';
        span.style.display = 'inline-block';
        // preserve spaces explicitly
        if (ch === ' ') {
          span.textContent = '\u00A0'; // non-breaking space
        } else {
          span.textContent = ch;
        }
        span.style.whiteSpace = 'pre';
        node.appendChild(span);
        targets.push(span);
      });
    }

    const tl = gsap.timeline();
    tl.fromTo(
      targets,
      { ...from },
      {
        ...to,
        duration,
        ease,
        stagger: 0.02,
        onComplete: () => { if (onLetterAnimationComplete) onLetterAnimationComplete(); }
      },
      delay / 1000
    );

    return () => {
      tl.kill();
      // leave DOM as-is; next render will replace content
    };
  }, [text, delay, duration, ease, splitType, onLetterAnimationComplete]);

  return <div ref={el} className={className} style={{ textAlign, display: 'inline-block' }} aria-hidden={false} />;
}

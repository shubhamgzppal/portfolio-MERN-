import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };
const cx = (...classes) => classes.filter(Boolean).join(' ');

const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = 'left',
    gap = 40,
    pauseOnHover = true,
    scaleOnHover = false,
    fadeOut = false,
    fadeOutColor = '#fff',
    ariaLabel = 'Partner logos',
    className,
    style
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);
    const [logoHeight, setLogoHeight] = useState(48); // will auto-update

    // Update logo height based on container height
    const updateLogoHeight = useCallback(() => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        setLogoHeight(height * 0.8); // use 80% of container height
      }
    }, []);

    // Calculate sequence width after images load
    const updateDimensions = useCallback(() => {
      if (!seqRef.current || !containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const sequenceWidth = seqRef.current.getBoundingClientRect()?.width ?? 0;
      if (sequenceWidth > 0) {
        setSeqWidth(sequenceWidth);
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, []);

    // Handle images loaded
    useEffect(() => {
      updateLogoHeight();

      const imgs = seqRef.current?.querySelectorAll('img') ?? [];
      let remaining = imgs.length;

      if (!remaining) {
        setTimeout(updateDimensions, 50);
        return;
      }

      const handleLoad = () => {
        remaining -= 1;
        if (remaining <= 0) setTimeout(updateDimensions, 50);
      };

      imgs.forEach(img => {
        if (img.complete) handleLoad();
        else {
          img.addEventListener('load', handleLoad, { once: true });
          img.addEventListener('error', handleLoad, { once: true });
        }
      });
    }, [logos, gap, updateDimensions, updateLogoHeight]);

    // Recalculate on resize
    useEffect(() => {
      const handleResize = () => {
        updateDimensions();
        updateLogoHeight();
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [updateDimensions, updateLogoHeight]);

    // Animation loop
    useEffect(() => {
      let offset = 0;
      let raf;

      const animate = () => {
        if (!seqWidth) {
          raf = requestAnimationFrame(animate);
          return;
        }

        const targetVel = pauseOnHover && isHovered ? 0 : speed;
        const vel = direction === 'left' ? targetVel : -targetVel;
        offset += vel * 0.016;
        offset %= seqWidth;
        if (trackRef.current) trackRef.current.style.transform = `translate3d(${-offset}px,0,0)`;
        raf = requestAnimationFrame(animate);
      };

      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }, [seqWidth, speed, direction, pauseOnHover, isHovered]);

    const handleMouseEnter = () => pauseOnHover && setIsHovered(true);
    const handleMouseLeave = () => pauseOnHover && setIsHovered(false);

    const cssVariables = useMemo(
      () => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        '--logoloop-fadeColor': fadeOutColor
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const renderLogoItem = useCallback(
      (item, key) => (
        <li key={key} className={cx('flex-none mr-[var(--logoloop-gap)]', scaleOnHover && 'group/item')}>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={cx('inline-flex items-center transition-opacity duration-200 ease-linear hover:opacity-80')}
            >
              {item.node ? (
                <span style={{ fontSize: logoHeight }}>{item.node}</span>
              ) : (
                <img src={item.src} alt={item.alt || ''} style={{ height: logoHeight, width: 'auto' }} />
              )}
            </a>
          ) : item.node ? (
            <span style={{ fontSize: logoHeight }}>{item.node}</span>
          ) : (
            <img src={item.src} alt={item.alt || ''} style={{ height: logoHeight, width: 'auto' }} />
          )}
        </li>
      ),
      [scaleOnHover, logoHeight]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }).map((_, i) => (
          <ul key={i} ref={i === 0 ? seqRef : undefined} className="flex items-center" aria-hidden={i > 0}>
            {logos.map((item, idx) => renderLogoItem(item, `${i}-${idx}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    return (
      <div
        ref={containerRef}
        className={cx('relative overflow-hidden group', className)}
        style={{ ...cssVariables, ...style }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label={ariaLabel}
      >
        {fadeOut && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-24 bg-gradient-to-r from-[var(--logoloop-fadeColor)] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-24 bg-gradient-to-l from-[var(--logoloop-fadeColor)] to-transparent" />
          </>
        )}

        <div
          ref={trackRef}
          className="flex w-max will-change-transform select-none motion-reduce:transform-none"
        >
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';
export default LogoLoop;

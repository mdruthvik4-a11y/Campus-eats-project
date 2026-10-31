import React, { useEffect, useState, useRef } from 'react';

export const CursorGlow: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const auraPos = useRef({ x: -100, y: -100 });
  const auraRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only activate cursor glow on devices with a fine pointer (mouse / trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) {
      return;
    }
    setIsPointerDevice(true);
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('[role="button"]'))
      ) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth lerp loop
    const animate = () => {
      const ease = 0.16;
      auraPos.current.x += (mousePos.current.x - auraPos.current.x) * ease;
      auraPos.current.y += (mousePos.current.y - auraPos.current.y) * ease;

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraPos.current.x}px, ${auraPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  if (!mounted || !isPointerDevice) return null;

  return (
    <>
      {/* Outer ambient luminous aura */}
      <div
        ref={auraRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-[width,height,opacity] duration-300 ease-out will-change-transform ${
          isHoveringClickable
            ? 'w-20 h-20 bg-amber-500/20 dark:bg-amber-400/25 blur-xl'
            : 'w-12 h-12 bg-amber-500/15 dark:bg-amber-400/20 blur-lg'
        }`}
      />

      {/* Subtle precision core dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-[width,height,background-color] duration-150 ease-out will-change-transform ${
          isHoveringClickable
            ? 'w-3 h-3 bg-amber-500/80 ring-4 ring-amber-400/30'
            : 'w-2 h-2 bg-amber-500/60'
        }`}
      />
    </>
  );
};

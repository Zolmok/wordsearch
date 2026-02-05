import { useRef, useEffect, useCallback } from 'react';

export function useCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    // Return the CSS size (for cell calculations, use canvas.width/height / dpr)
    return { width: size, height: size };
  }, []);

  useEffect(() => {
    resize();

    const observer = new ResizeObserver(() => {
      resize();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [resize]);

  return { canvasRef, containerRef, resize };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Particle = {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
};

const PARTICLE_GAP = 3;
const RETURN_FORCE = 0.0008;
const FRICTION = 0.99;
const MOUSE_RADIUS = 60;
const PULL_FORCE = 0.08;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function varyColor(r: number, g: number, b: number): string {
  const v = 30;
  return `rgb(${clamp(r + (Math.random() - 0.5) * v, 0, 255)}, ${clamp(g + (Math.random() - 0.5) * v, 0, 255)}, ${clamp(b + (Math.random() - 0.5) * v, 0, 255)})`;
}

type Props = {
  imageSize?: number;
};

export const FrogParticles: React.FC<Props> = ({ imageSize = 350 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    isDown: false,
    speed: 0,
  });
  const animFrameRef = useRef<number>(0);
  const dimsRef = useRef({ width: 0, height: 0, offsetX: 0, offsetY: 0 });
  const [isReady, setIsReady] = useState(false);

  const canvasHeight = imageSize * 1.4;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const setup = () => {
      const width = container.clientWidth;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = canvasHeight * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const offsetX = (width - imageSize) / 2;
      const offsetY = (canvasHeight - imageSize) / 2;
      dimsRef.current = { width, height: canvasHeight, offsetX, offsetY };
    };

    setup();

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = "/frog_circle.png";
    img.onload = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = imageSize;
      offscreen.height = imageSize;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, imageSize, imageSize);
      const imageData = offCtx.getImageData(0, 0, imageSize, imageSize);
      const pixels = imageData.data;

      const { offsetX, offsetY } = dimsRef.current;
      const particles: Particle[] = [];

      for (let y = 0; y < imageSize; y += PARTICLE_GAP) {
        for (let x = 0; x < imageSize; x += PARTICLE_GAP) {
          const i = (y * imageSize + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a < 128) continue;

          const ox = x + offsetX;
          const oy = y + offsetY;

          particles.push({
            originX: ox,
            originY: oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
            color: varyColor(r, g, b),
            size: PARTICLE_GAP * 0.7 + Math.random() * PARTICLE_GAP * 0.3,
          });
        }
      }

      particlesRef.current = particles;
      setIsReady(true);
    };

    const onResize = () => {
      const prevWidth = dimsRef.current.width;
      setup();
      const { width, offsetX, offsetY } = dimsRef.current;
      const scale = width / prevWidth;

      for (const p of particlesRef.current) {
        const imgX = p.originX - (prevWidth - imageSize) / 2;
        const imgY = p.originY - (canvasHeight - imageSize) / 2;
        p.originX = imgX + offsetX;
        p.originY = imgY + offsetY;
        p.x *= scale;
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [imageSize, canvasHeight]);

  useEffect(() => {
    if (!isReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      const { width, height } = dimsRef.current;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // Track mouse speed
      const mdx = mouse.x - mouse.prevX;
      const mdy = mouse.y - mouse.prevY;
      mouse.speed = Math.sqrt(mdx * mdx + mdy * mdy);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      const mouseMoving = mouse.speed > 1;

      for (const p of particles) {
        if (mouse.isDown) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_RADIUS && dist > 0) {
            const t = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;

            p.vx += (dx / dist) * t * PULL_FORCE;
            p.vy += (dy / dist) * t * PULL_FORCE;
          }
        }

        // Soft fluid-like return
        const dx = p.originX - p.x;
        const dy = p.originY - p.y;
        const distFromOrigin = Math.sqrt(dx * dx + dy * dy);

        if (distFromOrigin > 0.5) {
          // Stronger return when mouse stopped or released
          const boost = mouse.isDown && mouseMoving ? 1 : 2;
          const returnStrength = RETURN_FORCE * boost * Math.min(distFromOrigin * 0.01, 1);
          p.vx += dx * returnStrength;
          p.vy += dy * returnStrength;
        }

        p.vx *= FRICTION;
        p.vy *= FRICTION;

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isReady]);

  const toCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: -9999, y: -9999 };
    const rect = canvas.getBoundingClientRect();
    const { width, height } = dimsRef.current;
    return {
      x: ((clientX - rect.left) / rect.width) * width,
      y: ((clientY - rect.top) / rect.height) * height,
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coords = toCanvasCoords(e.clientX, e.clientY);
      mouseRef.current.x = coords.x;
      mouseRef.current.y = coords.y;
    },
    [toCanvasCoords],
  );

  const handleMouseDown = useCallback(() => {
    mouseRef.current.isDown = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
    mouseRef.current.isDown = false;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      const coords = toCanvasCoords(touch.clientX, touch.clientY);
      mouseRef.current.x = coords.x;
      mouseRef.current.y = coords.y;
      mouseRef.current.isDown = true;
    },
    [toCanvasCoords],
  );

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
    mouseRef.current.isDown = false;
  }, []);

  return (
    <div ref={containerRef} className="w-screen relative left-1/2 -translate-x-1/2">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full cursor-grab active:cursor-grabbing touch-none"
        style={{ height: canvasHeight }}
      />
    </div>
  );
};

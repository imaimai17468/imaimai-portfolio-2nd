"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef(null);
  const drawRef = useRef<((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void) | null>(null);
  const initParticlesRef = useRef<(() => void) | null>(null);
  const particleCount = props.particleCount || 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 100;
  const baseTTL = 50;
  const rangeTTL = 150;
  const baseSpeed = props.baseSpeed || 0.0;
  const rangeSpeed = props.rangeSpeed || 1.5;
  const baseRadius = props.baseRadius || 1;
  const rangeRadius = props.rangeRadius || 2;
  const baseHue = props.baseHue || 220;
  const rangeHue = 100;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  const backgroundColor = props.backgroundColor || "#000000";
  let tick = 0;
  const noise3D = createNoise3D();
  let particleProps = new Float32Array(particlePropsLength);
  const center: [number, number] = [0, 0];

  const TAU: number = 2 * Math.PI;
  const rand = (n: number): number => n * Math.random();
  const randRange = (n: number): number => n - rand(2 * n);
  const fadeInOut = (t: number, m: number): number => {
    const hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1: number, n2: number, speed: number): number => (1 - speed) * n1 + speed * n2;

  const resize = useCallback((canvas: HTMLCanvasElement) => {
    const { innerWidth, innerHeight } = window;

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    center[0] = 0.5 * canvas.width;
    center[1] = 0.5 * canvas.height;
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: rand, randRange, particleProps.set, and center are stable references that don't need to be in dependencies
  const initParticle = useCallback(
    (i: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const x: number = rand(canvas.width);
      const y: number = center[1] + randRange(rangeY);
      const vx: number = 0;
      const vy: number = 0;
      const life: number = 0;
      const ttl: number = baseTTL + rand(rangeTTL);
      const speed: number = baseSpeed + rand(rangeSpeed);
      const radius: number = baseRadius + rand(rangeRadius);
      const hue: number = baseHue + rand(rangeHue);

      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
    },
    [rangeY, baseTTL, rangeTTL, baseSpeed, rangeSpeed, baseRadius, rangeRadius, baseHue],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: tick and particleProps are mutable variables that don't need to be in dependencies
  const initParticles = useCallback(() => {
    tick = 0;
    // simplex = new SimplexNoise();
    particleProps = new Float32Array(particlePropsLength);

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  }, [particlePropsLength, particlePropCount, initParticle]);

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");

      if (ctx && initParticlesRef.current && drawRef.current) {
        resize(canvas);
        initParticlesRef.current();
        drawRef.current(canvas, ctx);
      }
    }
  }, [resize]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: tick is a mutable variable, drawParticles, renderGlow, and renderToScreen are stable references
  const draw = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      tick++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawParticles(ctx);
      renderGlow(canvas, ctx);
      renderToScreen(canvas, ctx);

      window.requestAnimationFrame(() => {
        if (drawRef.current) {
          drawRef.current(canvas, ctx);
        }
      });
    },
    [backgroundColor],
  );

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }
  };

  const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const i2 = 1 + i;
    const i3 = 2 + i;
    const i4 = 3 + i;
    const i5 = 4 + i;
    const i6 = 5 + i;
    const i7 = 6 + i;
    const i8 = 7 + i;
    const i9 = 8 + i;
    const x: number = particleProps[i];
    const y: number = particleProps[i2];
    const n: number = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
    const vx: number = lerp(particleProps[i3], Math.cos(n), 0.5);
    const vy: number = lerp(particleProps[i4], Math.sin(n), 0.5);
    let life: number = particleProps[i5];
    const ttl: number = particleProps[i6];
    const speed: number = particleProps[i7];
    const x2: number = x + vx * speed;
    const y2: number = y + vy * speed;
    const radius: number = particleProps[i8];
    const hue: number = particleProps[i9];

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    (checkBounds(x, y, canvas) || life > ttl) && initParticle(i);
  };

  const drawParticle = (
    x: number,
    y: number,
    x2: number,
    y2: number,
    life: number,
    ttl: number,
    radius: number,
    hue: number,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0;
  };

  const renderGlow = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const renderToScreen = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  useEffect(() => {
    initParticlesRef.current = initParticles;
    drawRef.current = draw;
    setup();
    window.addEventListener("resize", () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        resize(canvas);
      }
    });
  }, [setup, resize, initParticles, draw]);

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute h-full w-full inset-0 z-0 bg-transparent flex items-center justify-center"
      >
        <canvas ref={canvasRef} />
      </motion.div>

      <div className={cn("relative z-10", props.className)}>{props.children}</div>
    </div>
  );
};

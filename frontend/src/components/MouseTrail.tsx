"use client";

import { useEffect, useRef } from "react";

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const trail: { x: number; y: number; alpha: number; size: number }[] = [];
    let mouse = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      trail.push({ x: mouse.x, y: mouse.y, alpha: 0.6, size: Math.random() * 4 + 2 });
      if (trail.length > 30) trail.shift();
    };

    window.addEventListener("mousemove", onMove);

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trail.forEach((p, i) => {
        p.alpha -= 0.02;
        if (p.alpha <= 0) return;
        const hue = i % 2 === 0 ? "0,229,255" : "139,92,246";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (i / trail.length), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hue},${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

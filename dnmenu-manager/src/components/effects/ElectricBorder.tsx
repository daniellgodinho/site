'use client';

import { useEffect, useRef } from 'react';
import { THEME_CONFIG } from '@/config/theme';

interface ElectricBorderProps {
    children: React.ReactNode;
    color?: string;
    intensity?: number;
    className?: string;
}

export function ElectricBorder({
    children,
    color = THEME_CONFIG.electricBorderColor,
    intensity = 1,
    className = '',
}: ElectricBorderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        let animationId: number;
        let time = 0;

        const animate = () => {
            time += 0.05 * intensity;

            // Limpar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Desenhar borda com efeito elétrico
            const borderWidth = 2;

            ctx.strokeStyle = color;
            ctx.lineWidth = borderWidth;

            // Função para desenhar linha com efeito
            const drawElectricLine = (
                x1: number,
                y1: number,
                x2: number,
                y2: number
            ) => {
                ctx.beginPath();
                ctx.moveTo(x1, y1);

                const steps = Math.hypot(x2 - x1, y2 - y1) / 5;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const x = x1 + (x2 - x1) * t;
                    const y = y1 + (y2 - y1) * t;

                    const wave = Math.sin(time + i * 0.1) * 2 * intensity;
                    const perpX = -(y2 - y1) / Math.hypot(x2 - x1, y2 - y1);
                    const perpY = (x2 - x1) / Math.hypot(x2 - x1, y2 - y1);

                    ctx.lineTo(x + perpX * wave, y + perpY * wave);
                }

                ctx.stroke();
            };

            // Desenhar as 4 bordas
            drawElectricLine(0, 0, canvas.width, 0); // Top
            drawElectricLine(canvas.width, 0, canvas.width, canvas.height); // Right
            drawElectricLine(canvas.width, canvas.height, 0, canvas.height); // Bottom
            drawElectricLine(0, canvas.height, 0, 0); // Left

            // Adicionar brilho
            ctx.shadowColor = color;
            ctx.shadowBlur = 10 * intensity;
            ctx.strokeStyle = color + '80';
            ctx.lineWidth = 4;

            ctx.beginPath();
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.stroke();

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [color, intensity]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

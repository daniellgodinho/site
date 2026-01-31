'use client';

import { useEffect, useRef } from 'react';
import { THEME_CONFIG } from '@/config/theme';

interface PixelBlastProps {
    color?: string;
    variant?: 'triangle' | 'square' | 'circle';
    className?: string;
}

export function PixelBlast({
    color = THEME_CONFIG.pixelBlastColor,
    variant = 'triangle',
    className = '',
}: PixelBlastProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configurar tamanho do canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Criar partículas
        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            life: number;
        }> = [];

        const createParticles = () => {
            for (let i = 0; i < 3; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 20 + 10,
                    life: 1,
                });
            }
        };

        const drawParticle = (p: typeof particles[0]) => {
            ctx.fillStyle = color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
            ctx.globalAlpha = p.life;

            if (variant === 'triangle') {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y - p.size / 2);
                ctx.lineTo(p.x - p.size / 2, p.y + p.size / 2);
                ctx.lineTo(p.x + p.size / 2, p.y + p.size / 2);
                ctx.closePath();
                ctx.fill();
            } else if (variant === 'square') {
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.01;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                } else {
                    drawParticle(p);
                }
            }

            if (Math.random() < 0.1) {
                createParticles();
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [color, variant]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none ${className}`}
        />
    );
}

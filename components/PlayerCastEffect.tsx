import React, { useState, useEffect } from 'react';

interface PlayerCastEffectProps {
  isActive: boolean;
}

const PARTICLE_COUNT = 15;

const PlayerCastEffect: React.FC<PlayerCastEffectProps> = ({ isActive }) => {
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: PARTICLE_COUNT }).map(() => {
        const angle = Math.random() * 2 * Math.PI;
        const radius = 50 + Math.random() * 50; // Burst radius
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          delay: Math.random() * 0.2,
        };
      });
      setParticles(newParticles);
    }
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="particle-burst" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            '--x': `${p.x}px`,
            '--y': `${p.y}px`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default PlayerCastEffect;

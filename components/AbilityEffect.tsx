import React, { useEffect } from 'react';

type EffectType = 'powerful-strike' | 'frostbolt' | 'sneak-attack' | 'healing-light';

interface AbilityEffectProps {
  effectType: EffectType;
  onAnimationEnd: () => void;
}

const FROST_PARTICLE_COUNT = 12;

const AbilityEffect: React.FC<AbilityEffectProps> = ({ effectType, onAnimationEnd }) => {
  useEffect(() => {
    // Un temporizador para limpiar el estado del efecto en el componente padre
    const timer = setTimeout(onAnimationEnd, 1000);
    return () => clearTimeout(timer);
  }, [effectType, onAnimationEnd]);

  const renderEffect = () => {
    switch (effectType) {
      case 'powerful-strike':
        return <div className="effect-powerful-strike"></div>;
      case 'sneak-attack':
        return <div className="effect-sneak-attack"></div>;
      case 'healing-light':
        return <div className="effect-healing-light"></div>;
      case 'frostbolt':
        const particles = Array.from({ length: FROST_PARTICLE_COUNT }).map(() => {
          const angle = Math.random() * 2 * Math.PI;
          const radius = 30 + Math.random() * 40;
          return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            delay: Math.random() * 0.2,
          };
        });
        return (
          <div className="effect-frostbolt">
            {particles.map((p, i) => (
              <div
                key={i}
                className="frost-particle"
                style={{
                  '--x': `${p.x}px`,
                  '--y': `${p.y}px`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="ability-effect-container">{renderEffect()}</div>;
};

export default AbilityEffect;

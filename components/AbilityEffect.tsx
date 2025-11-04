import React, { useEffect } from 'react';

type EffectType = 'powerful-strike' | 'frostbolt' | 'sneak-attack' | 'healing-light' | 'perception' | 'diplomacy' | 'nature-affinity' | 'arcane-knowledge' | 'stonecunning' | 'battle-forging' | 'intimidation' | 'survivalist';

interface AbilityEffectProps {
  effectType: EffectType;
  onAnimationEnd: () => void;
}

const PARTICLE_COUNT = 12;

const AbilityEffect: React.FC<AbilityEffectProps> = ({ effectType, onAnimationEnd }) => {
  useEffect(() => {
    // Un temporizador para limpiar el estado del efecto en el componente padre
    const timer = setTimeout(onAnimationEnd, 1200); // Increased duration for some effects
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
      case 'perception':
        return <div className="effect-perception"></div>;
      case 'diplomacy':
        return <div className="effect-diplomacy"></div>;
      case 'intimidation':
          return <div className="effect-intimidation"></div>;
      case 'survivalist':
          return <div className="effect-survivalist"></div>;
      case 'frostbolt': {
        const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          delay: Math.random() * 0.2,
        }));
        return <div className="effect-frostbolt">{particles.map((p, i) => <div key={i} className="frost-particle" style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, animationDelay: `${p.delay}s` } as React.CSSProperties} />)}</div>;
      }
      case 'nature-affinity': {
        const particles = Array.from({ length: 6 }).map((_, i) => ({
            x: Math.cos(i * (Math.PI / 3)) * 40,
            y: Math.sin(i * (Math.PI / 3)) * 40,
            delay: i * 0.1
        }));
        return <div className="effect-nature-affinity">{particles.map((p, i) => <div key={i} className="leaf" style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, animationDelay: `${p.delay}s` } as React.CSSProperties} />)}</div>;
      }
      case 'arcane-knowledge': {
        const runes = ['✧', '⊹', '✦', '✳︎'];
        return <div className="effect-arcane-knowledge">{runes.map((rune, i) => <div key={i} className="rune" style={{ animationDelay: `${i * 0.15}s` }}>{rune}</div>)}</div>;
      }
      case 'stonecunning': {
        return <div className="effect-stonecunning" style={{ '--x': '5px', '--y': '-3px' } as React.CSSProperties}></div>;
      }
      case 'battle-forging': {
        const sparks = Array.from({ length: 8 }).map(() => ({
            angle: Math.random() * 360,
            dist: 30 + Math.random() * 20
        }));
        return <div className="effect-battle-forging">{sparks.map((s, i) => <div key={i} className="spark" style={{ '--angle': `${s.angle}deg`, '--x': `${Math.cos(s.angle * Math.PI / 180) * s.dist}px`, '--y': `${Math.sin(s.angle * Math.PI / 180) * s.dist}px` } as React.CSSProperties}/>)}</div>
      }
      default:
        return null;
    }
  };

  return <div className="ability-effect-container">{renderEffect()}</div>;
};

export default AbilityEffect;
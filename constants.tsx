// Fix: Added game constants for races, classes, and skills.
import { Race, CharacterClass, Skill } from './types';

export const RACE_DESCRIPTIONS: Record<Race, string> = {
  [Race.Humano]: "Versátiles y ambiciosos, los humanos se adaptan a cualquier desafío.",
  [Race.Elfo]: "Ágiles y sabios, los elfos tienen una conexión innata con la naturaleza y la magia.",
  [Race.Enano]: "Robustos y tenaces, los enanos son maestros artesanos y guerreros formidables.",
  [Race.Orco]: "Fuertes y feroces, los orcos son guerreros natos con un profundo sentido del honor tribal.",
};

export const CLASS_DESCRIPTIONS: Record<CharacterClass, string> = {
  [CharacterClass.Guerrero]: "Maestro del combate, hábil con una variedad de armas y armaduras.",
  [CharacterClass.Mago]: "Estudioso de lo arcano, capaz de doblegar la realidad con poderosos hechizos.",
  [CharacterClass.Pícaro]: "Experto en el sigilo y el engaño, letal con un ataque sorpresa.",
  [CharacterClass.Clérigo]: "Un conducto de poder divino, que sana a los aliados y castiga a los impíos.",
};

// Skills
const perceptionSkill: Skill = { name: "Percepción Aguda", description: "Bonificación para detectar trampas y enemigos ocultos.", iconName: 'IconEye' };
const diplomacySkill: Skill = { name: "Diplomacia", description: "Bonificación en las interacciones sociales para persuadir a otros.", iconName: 'IconScroll' };
const natureAffinitySkill: Skill = { name: "Afinidad Natural", description: "Puedes hablar con animales pequeños y moverte sigilosamente en bosques.", iconName: 'IconLeaf' };
const arcaneKnowledgeSkill: Skill = { name: "Conocimiento Arcano", description: "Puedes identificar objetos mágicos simples.", iconName: 'IconSparkle' };
const stonecunningSkill: Skill = { name: "Saber de Piedra", description: "Reconoces trabajos en piedra inusuales y tienes ventaja en entornos subterráneos.", iconName: 'IconMountain' };
const blacksmithingSkill: Skill = { name: "Forja de Batalla", description: "Puedes reparar tu propio equipo una vez al día.", iconName: 'IconHammer' };
const intimidationSkill: Skill = { name: "Intimidación", description: "Bonificación para asustar a los enemigos o sacar información.", iconName: 'IconSkull' };
const survivalistSkill: Skill = { name: "Superviviente", description: "Puedes encontrar comida y agua en la naturaleza con facilidad.", iconName: 'IconFootprints' };


export const RACE_SKILL_POOLS: Record<Race, [Skill, Skill]> = {
    [Race.Humano]: [diplomacySkill, perceptionSkill],
    [Race.Elfo]: [natureAffinitySkill, arcaneKnowledgeSkill],
    [Race.Enano]: [stonecunningSkill, blacksmithingSkill],
    [Race.Orco]: [intimidationSkill, survivalistSkill],
};

// New Class Skills
const powerfulStrike: Skill = { name: "Ataque Poderoso", description: "Realiza un ataque cuerpo a cuerpo con fuerza bruta, sacrificando precisión por daño.", iconName: 'IconSword' };
const secondWind: Skill = { name: "Segundo Aliento", description: "Una vez por combate, recupera una pequeña cantidad de tu propia salud.", iconName: 'IconHeart' };
const battleCry: Skill = { name: "Grito de Batalla", description: "Desmoraliza a un enemigo, reduciendo su efectividad en combate por un turno.", iconName: 'IconMegaphone' };

const frostbolt: Skill = { name: "Rayo de Escarcha", description: "Un proyectil de hielo que daña y ralentiza a un enemigo.", iconName: 'IconSnowflake' };
const arcaneShield: Skill = { name: "Escudo Arcano", description: "Invoca una barrera mágica que absorbe una cantidad de daño.", iconName: 'IconShield' };
const magicMissile: Skill = { name: "Proyectil Mágico", description: "Lanza tres dardos de energía que nunca fallan su objetivo.", iconName: 'IconSparkles' };

const sneakAttack: Skill = { name: "Ataque Furtivo", description: "Inflige daño extra si el enemigo está desprevenido o flanqueado.", iconName: 'IconDagger' };
const evasion: Skill = { name: "Evasión", description: "Usa tu reacción para reducir a la mitad el daño de un ataque que puedas ver.", iconName: 'IconWind' };
const distraction: Skill = { name: "Distracción", description: "Crea una distracción para aturdir a un enemigo por un turno.", iconName: 'IconEyeOff' };

const cureWounds: Skill = { name: "Curar Heridas Leves", description: "Toca a una criatura para restaurarle una pequeña cantidad de salud.", iconName: 'IconCross' };
const blessing: Skill = { name: "Bendición", description: "Otorga a tus aliados una bonificación en sus ataques y salvaciones.", iconName: 'IconStar' };
const divineSmite: Skill = { name: "Castigo Divino", description: "Imbuye tu arma con energía divina para infligir daño sagrado extra.", iconName: 'IconZap' };

export const CLASS_SKILL_POOLS: Record<CharacterClass, Skill[]> = {
  [CharacterClass.Guerrero]: [powerfulStrike, secondWind, battleCry],
  [CharacterClass.Mago]: [frostbolt, arcaneShield, magicMissile],
  [CharacterClass.Pícaro]: [sneakAttack, evasion, distraction],
  [CharacterClass.Clérigo]: [cureWounds, blessing, divineSmite],
};
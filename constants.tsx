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


export const INITIAL_SKILLS: Record<CharacterClass, Skill[]> = {
  [CharacterClass.Guerrero]: [{ name: "Ataque Poderoso", description: "Puedes hacer un ataque más fuerte a costa de precisión.", iconName: 'IconSword' }],
  [CharacterClass.Mago]: [{ name: "Rayo de Escarcha", description: "Un hechizo menor que ralentiza a un enemigo.", iconName: 'IconSnowflake' }],
  [CharacterClass.Pícaro]: [{ name: "Ataque Furtivo", description: "Inflige daño extra al atacar desde el sigilo.", iconName: 'IconDagger' }],
  [CharacterClass.Clérigo]: [{ name: "Curar Heridas Leves", description: "Restaura una pequeña cantidad de salud a un aliado.", iconName: 'IconCross' }],
};

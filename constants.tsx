import React from 'react';
import { Race, CharacterClass, Skill } from './types';
// Fix: Imported IconGear to resolve 'Cannot find name' error.
import { IconSword, IconScroll, IconDagger, IconCross, IconHeart, IconLeaf, IconAnvil, IconFootprint, IconDragon, IconBrain, IconHandshake, IconAxe, IconFire, IconGear } from './components/Icons';

export const RACE_DESCRIPTIONS: { [key in Race]: string } = {
    [Race.Humano]: "Versátiles y ambiciosos, los humanos se adaptan a cualquier desafío. Su tenacidad es su mayor fortaleza.",
    [Race.Elfo]: "Elegantes y longevos, los elfos son maestros de la magia y el arco. Sienten una profunda conexión con la naturaleza.",
    [Race.Enano]: "Robustos y leales, los enanos son artesanos inigualables y guerreros formidables. Valoran el oro, la familia y el honor.",
    [Race.Mediano]: "Pequeños y de buen corazón, los medianos disfrutan de los placeres sencillos de la vida, pero demuestran un coraje sorprendente cuando es necesario.",
    [Race.Draconido]: "Nacidos de dragones, los dracónidos son una raza orgullosa y honorable, con una afinidad natural por los elementos.",
    [Race.Gnomo]: "Curiosos e inventivos, los gnomos son maestros de la ilusión y la ingeniería. Su ingenio es tan grande como su entusiasmo.",
    [Race.Semielfo]: "Atrapados entre dos mundos, los semielfos combinan la gracia élfica con la ambición humana, haciéndolos diplomáticos y líderes natos.",
    [Race.Semiorco]: "De sangre humana y orca, los semiorcos son fieros y resistentes, a menudo luchando por encontrar su lugar en el mundo.",
    [Race.Tiflin]: "Con un linaje infernal, los tiflines son astutos y carismáticos, a menudo malinterpretados por su apariencia.",
};

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsMEMyMi4zOSwwLDAsMjIuMzksMCw1MGMwLDI3LjYxLDIyLjM5LDUwLDUwLDUwczUwLTIyLjM5LDUwLTUwQzEwMCwyMi4zOSw3Ny42MSwwLDUwLDB6IE01MCw5MCBDMjcuOTQsOTAsMTAsNzIuMDYsMTAsNTBDMTAsMjcuOTQsMjcuOTQsMTAsNTAsMTB2ODB6IiBmaWxsPSIjYmNjN2Q5Ii8+PHBhdGggZD0iTTUwLDEwYzIyLjA2LDAsNDAsMTcuOTQsNDAsNDBjMCwyMi4wNi0xNy45NCw0MC00MCw0MEw1MCwxMHoiIGZpbGw9IiM0MjQyNDIiLz48L3N2Zz4=";

export const RACE_IMAGES: { [key in Race]: string } = {
    [Race.Humano]: placeholderImage,
    [Race.Elfo]: placeholderImage,
    [Race.Enano]: placeholderImage,
    [Race.Mediano]: placeholderImage,
    [Race.Draconido]: placeholderImage,
    [Race.Gnomo]: placeholderImage,
    [Race.Semielfo]: placeholderImage,
    [Race.Semiorco]: placeholderImage,
    [Race.Tiflin]: placeholderImage,
};


export const CLASS_DESCRIPTIONS: { [key in CharacterClass]: string } = {
    [CharacterClass.Guerrero]: "Maestro de las armas y el combate. Protege a sus aliados en primera línea con su fuerza y valor.",
    [CharacterClass.Mago]: "Estudioso de las artes arcanas. Lanza poderosos hechizos para controlar el campo de batalla y aniquilar a sus enemigos.",
    [CharacterClass.Picaro]: "Ágil y sigiloso. Se especializa en el engaño, el robo y los ataques sorpresa desde las sombras.",
    [CharacterClass.Clerigo]: "Un conducto del poder divino. Sana a los heridos, protege a los justos y castiga a los impíos.",
};

export const CLASS_ICONS: { [key in CharacterClass]: React.ReactNode } = {
    [CharacterClass.Guerrero]: <IconSword />,
    [CharacterClass.Mago]: <IconScroll />,
    [CharacterClass.Picaro]: <IconDagger />,
    [CharacterClass.Clerigo]: <IconCross />,
};

export const RACE_SKILL_POOLS: { [key in Race]: Skill[] } = {
    [Race.Humano]: [
        { name: 'Coraje Humano', description: 'Gana un bono de ataque temporal en tu próximo turno.', cooldown: 5, currentCooldown: 0, icon: <IconHeart /> },
        { name: 'Ingenio Rápido', description: 'Reduce el enfriamiento de otra habilidad en 1 turno.', cooldown: 6, currentCooldown: 0, icon: <IconBrain /> },
    ],
    [Race.Elfo]: [
        { name: 'Visión Aguda', description: 'Tu próximo ataque tiene una probabilidad de acierto mucho mayor.', cooldown: 4, currentCooldown: 0, icon: <IconLeaf /> },
        { name: 'Paso Silencioso', description: 'Aumenta tu evasión durante un turno.', cooldown: 5, currentCooldown: 0, icon: <IconFootprint /> },
    ],
    [Race.Enano]: [
        { name: 'Piel de Piedra', description: 'Aumenta tu Clase de Armadura durante 2 turnos.', cooldown: 6, currentCooldown: 0, icon: <IconAnvil /> },
        { name: 'Resistencia Enana', description: 'Reduce a la mitad el daño del próximo golpe que recibas.', cooldown: 5, currentCooldown: 0, icon: <IconHeart /> },
    ],
    [Race.Mediano]: [
        { name: 'Suerte del Mediano', description: 'Tu próximo ataque que falle, acertará en su lugar.', cooldown: 7, currentCooldown: 0, icon: <IconFootprint /> },
        { name: 'Lanzamiento Certero', description: 'Lanza una piedra con gran precisión, interrumpiendo al enemigo.', cooldown: 4, currentCooldown: 0, icon: <IconDagger /> },
    ],
    [Race.Draconido]: [
        { name: 'Aliento de Dragón', description: 'Exhalas un cono de energía que daña al enemigo.', cooldown: 5, currentCooldown: 0, icon: <IconDragon /> },
        { name: 'Presencia Aterradora', description: 'Reduce el bono de ataque del enemigo durante 2 turnos.', cooldown: 6, currentCooldown: 0, icon: <IconFire /> },
    ],
    [Race.Gnomo]: [
        { name: 'Artilugio Ingenioso', description: 'Despliegas un artilugio que distrae al enemigo, reduciendo su CA.', cooldown: 5, currentCooldown: 0, icon: <IconGear /> },
        { name: 'Escape Veloz', description: 'Esquivas el próximo ataque enemigo por completo.', cooldown: 6, currentCooldown: 0, icon: <IconFootprint /> },
    ],
    [Race.Semielfo]: [
        { name: 'Encanto Feérico', description: 'El enemigo tiene una probabilidad de no atacarte en su próximo turno.', cooldown: 6, currentCooldown: 0, icon: <IconHandshake /> },
        { name: 'Linaje Versátil', description: 'Copia temporalmente la defensa de tu oponente.', cooldown: 7, currentCooldown: 0, icon: <IconBrain /> },
    ],
    [Race.Semiorco]: [
        { name: 'Ataque Salvaje', description: 'Tu próximo ataque inflige daño adicional.', cooldown: 4, currentCooldown: 0, icon: <IconAxe /> },
        { name: 'Resistencia Implacable', description: 'Si un golpe te dejara a 0 PS, sobrevives con 1 PS.', cooldown: 8, currentCooldown: 0, icon: <IconHeart /> },
    ],
    [Race.Tiflin]: [
        { name: 'Engaño Infernal', description: 'Creas una ilusión que reduce la probabilidad de acierto del enemigo.', cooldown: 5, currentCooldown: 0, icon: <IconFire /> },
        { name: 'Reprensión Diabólica', description: 'Devuelves parte del daño recibido al atacante.', cooldown: 6, currentCooldown: 0, icon: <IconScroll /> },
    ],
};
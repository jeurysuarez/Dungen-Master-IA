import React from 'react';
import { Race, CharacterClass } from './types';
import { IconSword, IconScroll, IconDagger, IconCross } from './components/Icons';

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

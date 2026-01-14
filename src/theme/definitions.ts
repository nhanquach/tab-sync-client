
export interface ThemeDefinition {
  id: string;
  name: string;
  seed: {
    primaryHue: number;
    secondaryHue: number;
    tertiaryHue: number;
  };
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "indigo",
    name: "Indigo (Default)",
    seed: {
      primaryHue: 265,
      secondaryHue: 260,
      tertiaryHue: 330,
    },
  },
  {
    id: "teal",
    name: "Teal",
    seed: {
      primaryHue: 170,
      secondaryHue: 180,
      tertiaryHue: 20,
    },
  },
  {
    id: "rose",
    name: "Rose",
    seed: {
      primaryHue: 340,
      secondaryHue: 350,
      tertiaryHue: 160,
    },
  },
  {
    id: "blue",
    name: "Blue",
    seed: {
      primaryHue: 210,
      secondaryHue: 220,
      tertiaryHue: 30,
    },
  },
  {
    id: "orange",
    name: "Orange",
    seed: {
      primaryHue: 25,
      secondaryHue: 35,
      tertiaryHue: 200,
    },
  },
    {
    id: "green",
    name: "Green",
    seed: {
      primaryHue: 120,
      secondaryHue: 130,
      tertiaryHue: 300,
    },
  },
];

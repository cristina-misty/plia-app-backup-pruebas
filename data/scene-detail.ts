export type HeaderInfoProps = {
  episode_order?: string;
  version?: string;
  scene_id: string;
  scene_title: string;
  screen_time: string;
  int_ext: string;
  day_night: string;
  location: string;
  synopsis: string;
  emotion_label: string;
};

export type TabsProps = {
  id: string;
  name: string;
};

export type ExampleDepartmentsProps = {
  id: string;
  name: string;
};

export type ExampleDialogueProps = {
  id: string;
  name: string;
  dialog: string;
};

export type ExampleDepartmentsTabProps = {
  name: string;
  text: string[];
};

export const tabs: TabsProps[] = [
  {
    id: "cast",
    name: "Cast",
  },
  {
    id: "screenplay",
    name: "Screenplay",
  },
  {
    id: "departments",
    name: "Departments",
  },
  {
    id: "history",
    name: "History",
  },
  {
    id: "docs",
    name: "Docs",
  },
  {
    id: "version",
    name: "Version",
  },
  {
    id: "calendar",
    name: "Calendar",
  },
];

export const exampleDepartments: ExampleDepartmentsProps[] = [
  {
    id: "production",
    name: "Production",
  },
  {
    id: "camera",
    name: "Camera",
  },
  {
    id: "sound",
    name: "Sound",
  },
  {
    id: "grip-electric",
    name: "Grip/Electric",
  },
  {
    id: "post-production",
    name: "Post-production",
  },
  {
    id: "wardrobe",
    name: "Wardrobe",
  },
];

export const exampleDialogue: ExampleDialogueProps[] = [
  {
    id: "1",
    name: "CEO",
    dialog: "Hello, I'm the CEO of the company. How can I help you?",
  },
  {
    id: "2",
    name: "Customer",
    dialog: "I need to know the price of the product.",
  },
  {
    id: "3",
    name: "CEO",
    dialog: "The price of the product is $100.",
  },
];

export const exampleDepartmentsTab: ExampleDepartmentsTabProps[] = [
  {
    name: "LIGHTING",
    text: ["Luces blancas de la sala (agudizan las expresiones)"],
  },
  {
    name: "MAKEUP",
    text: [
      "Expresiones demacradas de GALARRETA",
      "Expresiones demacradas de VALENZUELA",
    ],
  },
  {
    name: "SOUND",
    text: [
      "GALARRETA (presente en la escena)",
      "VALENZUELA (presente en la escena)",
      "DELIA (presente en la escena)",
      "INÉS (presente en la escena)",
      "CEO (presente en la escena)",
      "GALÁN (presente en la escena)",
    ],
  },
  {
    name: "WARDROBE",
    text: [
      "Camisas remangadas de GALARRETA",
      "Nudos de las corbatas destensados de GALARRETA",
      "Camisas remangadas de VALENZUELA",
      "Nudos de las corbatas destensados de VALENZUELA",
      "DELIA: impecable (vestuario)",
    ],
  },
];

export const headerInfo: HeaderInfoProps = {
  version: "EP.1.1 Version 17:53 2/8 p011",
  scene_id: "1.13",
  scene_title: "EL ESCAPE DE SAMUEL",
  screen_time: "00:28",
  int_ext: "EXT.",
  day_night: "DAY",
  location: "SEDE DISKIN - rampa salida lateral",
  synopsis:
    "Samuel corre hacia la salida del edificio Diskin, su figura empequeñece frente a la inmensidad del lugar.",
  emotion_label: "MIEDO",
};

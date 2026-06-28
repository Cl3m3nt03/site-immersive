export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  content: string[];
  memoryFragment?: string;
  effect?: 'glitch' | 'blood' | 'flash' | 'rain' | 'bullets';
}

export const INTRO_DATA = {
  scenes: [
    "La ville respire lentement.",
    "Les lumières de Los Santos clignotent au loin.",
    "La pluie tombe sans bruit réel.",
    "Ils disent que les gens changent…",
    "Mais certains… deviennent juste ce qu’ils ont toujours été.",
    "Bienvenue dans une histoire où la loyauté coûte plus cher que la vie."
  ]
};

export const STORY_DATA: Chapter[] = [
  {
    id: 1,
    title: "Oakland",
    subtitle: "L'enfance brisée",
    content: [
      "DeShawn Carter naît dans le chaos d'Oakland. Dans ce quartier où le béton dévore les rêves, il n'a jamais connu la chaleur d'un foyer.",
      "Placé en famille d’accueil jusqu’à ses 10 ans, il grandit sans repère affectif, apprenant que le monde est une machine froide qui ne s'arrête jamais pour personne."
    ],
    memoryFragment: "Le silence d'une chambre vide est plus bruyant qu'un cri.",
    effect: 'rain'
  },
  {
    id: 2,
    title: "Le Retour",
    subtitle: "L'enfer biologique",
    content: [
      "À 10 ans, sa mère biologique le récupère. Ce n'est pas un acte d'amour, mais une transaction administrative.",
      "Détruite par la drogue et entourée de violence, elle transforme sa jeunesse en une suite d'humiliations. Chez elle, DeShawn n'apprend pas à vivre, il apprend à survivre."
    ],
    memoryFragment: "Ses yeux étaient des trous noirs. Elle me regardait sans me voir.",
    effect: 'glitch'
  },
  {
    id: 3,
    title: "Darius Reed",
    subtitle: "Le sang de la rue",
    content: [
      "Dans cette obscurité, Darius Reed devient sa seule lumière. Plus qu'un ami, un frère choisi, même si leurs noms les séparent.",
      "Ensemble, ils apprennent les codes de la rue, construisant une bulle de loyauté dans un océan d'instabilité. Leur lien est la seule vérité dans un monde de mensonges."
    ],
    memoryFragment: "On s'était promis : personne ne reste derrière.",
    effect: 'flash'
  },
  {
    id: 4,
    title: "La Rupture",
    subtitle: "Point de non-retour",
    content: [
      "À 18 ans, le destin bascule. Une violente dispute, un éclat d'acier. Darius Reed, voulant protéger DeShawn, tue sa mère et un homme présent.",
      "Dans la panique et les larmes, ils fuient Oakland. Direction Los Santos. Derrière eux, le sang sèche. Devant eux, l'inconnu."
    ],
    memoryFragment: "Le goût de la poudre mélangé à la pluie sur le pare-brise.",
    effect: 'bullets'
  },
  {
    id: 5,
    title: "Los Santos",
    subtitle: "L'ombre qui grandit",
    content: [
      "La Cité des Saints ne leur fait pas de cadeaux. Petits trafics, débrouille, mais surtout une loyauté sans faille.",
      "Leur duo devient le noyau d'une structure qui prend de l'ampleur. Ils ne sont plus deux gamins en fuite, ils deviennent une force."
    ],
    memoryFragment: "L'argent ne dort jamais, mais la loyauté, elle, veille sur ton sommeil.",
    effect: 'rain'
  },
  {
    id: 6,
    title: "Le Drive-By",
    subtitle: "Le massacre",
    content: [
      "À 26 ans, alors que leur empire émerge, le passé réapparaît sous la forme du père biologique de DeShawn, membre d'un cartel.",
      "Une rafale. Un crissement de pneus. Le monde s'arrête. Darius Reed s'effondre. Le sang de son frère d'armes imbibe l'asphalte de Los Santos."
    ],
    memoryFragment: "Darius... ses derniers mots n'étaient que du silence.",
    effect: 'bullets'
  },
  {
    id: 7,
    title: "Le Vide",
    subtitle: "L'extinction",
    content: [
      "La perte de Darius brise quelque chose de définitif chez DeShawn. Il devient une machine froide, vide de toute émotion.",
      "Il ne cherche plus à aimer ou à ressentir. Il ne vit plus — il construit. La douleur est devenue le carburant de son ambition."
    ],
    memoryFragment: "J'ai enterré mon cœur avec lui. Maintenant, je n'ai plus rien à perdre.",
    effect: 'glitch'
  },
  {
    id: 8,
    title: "La Résurrection",
    subtitle: "Le contrôle total",
    content: [
      "Il remonte une organisation, mais cette fois, rien n'est laissé au hasard. Contrôle absolu. Loyauté chirurgicale.",
      "Il transforme son chaos intérieur en un ordre implacable. Les erreurs du passé sont les leçons de son présent."
    ],
    memoryFragment: "Ne fais confiance à personne, sauf à celui qui n'a plus rien à gagner.",
    effect: 'flash'
  },
  {
    id: 9,
    title: "Le Nightlife",
    subtitle: "La façade",
    content: [
      "Propriétaire d'un club influent, il est le visage du succès. Les lumières néon masquent les ténèbres de ses affaires.",
      "Entrepreneur respecté le jour, il reste le boss d'un empire silencieux la nuit."
    ],
    memoryFragment: "Le bruit de la musique couvre celui des transactions.",
    effect: 'rain'
  },
  {
    id: 10,
    title: "L'Empire",
    subtitle: "Le Boss de 27 ans",
    content: [
      "Aujourd'hui, à 27 ans, DeShawn Carter est au sommet. Respecté, craint, influent.",
      "Mais derrière l'image publique, il reste un homme hanté, guidé par une seule règle : ne plus jamais perdre sa famille."
    ],
    memoryFragment: "Le silence est le plus grand des empires.",
    effect: 'flash'
  }
];

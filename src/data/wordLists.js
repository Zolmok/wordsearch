export const CATEGORIES = {
  animals: {
    label: 'Animals',
    words: [
      'ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'CHEETAH',
      'GORILLA', 'LEOPARD', 'BUFFALO', 'PANTHER', 'GAZELLE',
      'HAMSTER', 'OCTOPUS', 'PELICAN', 'SPARROW', 'VULTURE',
      'IGUANA', 'FALCON', 'BADGER', 'JAGUAR', 'PYTHON',
      'TOUCAN', 'WALRUS', 'ZEBRA', 'OTTER', 'CRANE',
      'BISON', 'RAVEN', 'SHARK', 'MOOSE', 'EAGLE',
      'TIGER', 'COBRA', 'HAWK', 'WOLF', 'BEAR',
    ],
  },
  sports: {
    label: 'Sports',
    words: [
      'FOOTBALL', 'BASEBALL', 'SWIMMING', 'CLIMBING', 'LACROSSE',
      'HANDBALL', 'SOFTBALL', 'ARCHERY', 'BOWLING', 'CRICKET',
      'CYCLING', 'FENCING', 'SURFING', 'SAILING', 'SKATING',
      'JAVELIN', 'ROWING', 'TENNIS', 'BOXING', 'DIVING',
      'HOCKEY', 'KARATE', 'SOCCER', 'SQUASH', 'DISCUS',
      'RUGBY', 'TRACK', 'POLO', 'GOLF', 'JUDO',
      'RELAY', 'VAULT', 'LUGE', 'DASH', 'SWIM',
    ],
  },
  science: {
    label: 'Science',
    words: [
      'MOLECULE', 'ELECTRON', 'FRICTION', 'SPECTRUM', 'CATALYST',
      'BACTERIA', 'NUCLEUS', 'NEUTRON', 'ISOTOPE', 'VOLTAGE',
      'QUANTUM', 'PHOTON', 'PLASMA', 'PROTON', 'ENZYME',
      'FUSION', 'GENOME', 'QUASAR', 'NEBULA', 'PRISM',
      'COMET', 'ORBIT', 'FORCE', 'RADAR', 'LASER',
      'NERVE', 'GAMMA', 'ALPHA', 'HELIX', 'OXIDE',
      'TESLA', 'MAGNET', 'THEORY', 'ENERGY', 'ATOMIC',
    ],
  },
  food: {
    label: 'Food',
    words: [
      'MUSHROOM', 'BROCCOLI', 'SANDWICH', 'CHOCOLATE', 'DUMPLING',
      'PANCAKE', 'AVOCADO', 'NOODLES', 'POPCORN', 'PRETZEL',
      'BURRITO', 'BISCUIT', 'MUFFIN', 'WAFFLE', 'BUTTER',
      'CHEESE', 'GARLIC', 'GINGER', 'PEPPER', 'TOMATO',
      'CELERY', 'SALMON', 'PASTRY', 'CEREAL', 'TURNIP',
      'BREAD', 'PASTA', 'LEMON', 'MELON', 'OLIVE',
      'PEACH', 'MANGO', 'GRAPE', 'STEAK', 'SALAD',
    ],
  },
  geography: {
    label: 'Geography',
    words: [
      'MOUNTAIN', 'ATLANTIC', 'WATERFALL', 'PENINSULA', 'TROPICAL',
      'VOLCANO', 'GLACIER', 'PLATEAU', 'EQUATOR', 'TUNDRA',
      'CANYON', 'DESERT', 'ISLAND', 'LAGOON', 'VALLEY',
      'FOREST', 'STRAIT', 'RAVINE', 'SUMMIT', 'MEADOW',
      'BASIN', 'DELTA', 'RIDGE', 'COAST', 'FJORD',
      'OCEAN', 'RIVER', 'MARSH', 'CLIFF', 'CREEK',
      'REEF', 'LAKE', 'CAVE', 'DUNE', 'CAPE',
    ],
  },
  technology: {
    label: 'Technology',
    words: [
      'COMPUTER', 'SOFTWARE', 'INTERNET', 'DATABASE', 'DOWNLOAD',
      'KEYBOARD', 'BROWSER', 'NETWORK', 'DIGITAL', 'DISPLAY',
      'FIREWALL', 'PROGRAM', 'STORAGE', 'WEBSITE', 'SILICON',
      'SERVER', 'ROUTER', 'BINARY', 'CODING', 'CURSOR',
      'KERNEL', 'STREAM', 'SCRIPT', 'CLOUD', 'PIXEL',
      'ROBOT', 'FIBER', 'CACHE', 'TOKEN', 'DRONE',
      'CHIP', 'BYTE', 'DATA', 'WIFI', 'NODE',
    ],
  },
  music: {
    label: 'Music',
    words: [
      'SYMPHONY', 'ACOUSTIC', 'CLASSICAL', 'BARITONE', 'HARMONICA',
      'TRUMPET', 'UKULELE', 'CONCERT', 'DRUMMER', 'FALSETTO',
      'SOPRANO', 'BASSOON', 'GUITAR', 'RHYTHM', 'TREBLE',
      'MELODY', 'VIOLIN', 'CHORUS', 'OCTAVE', 'BALLAD',
      'TEMPO', 'CHORD', 'FLUTE', 'FORTE', 'OPERA',
      'BANJO', 'PIANO', 'ORGAN', 'BRASS', 'TENOR',
      'ALTO', 'BEAT', 'BASS', 'DRUM', 'JAZZ',
    ],
  },
  movies: {
    label: 'Movies',
    words: [
      'DIRECTOR', 'THRILLER', 'ANIMATED', 'PREMIERE', 'PRODUCER',
      'FESTIVAL', 'WESTERN', 'COSTUME', 'TRAILER', 'CREDITS',
      'FICTION', 'HORROR', 'SEQUEL', 'SCRIPT', 'CINEMA',
      'ACTION', 'COMEDY', 'SCREEN', 'STUDIO', 'SERIES',
      'SCENE', 'GENRE', 'DRAMA', 'ACTOR', 'AWARD',
      'MOVIE', 'EXTRA', 'PILOT', 'STAGE', 'SCORE',
      'CAST', 'EPIC', 'FILM', 'PLOT', 'ROLE',
    ],
  },
};

export function getWordsForCategory(category, count) {
  const cat = CATEGORIES[category];
  if (!cat) return [];

  // Shuffle and take `count` words, preferring longer words first
  const sorted = [...cat.words]
    .map((w) => w.toUpperCase())
    .sort((a, b) => b.length - a.length);

  // Take top candidates and shuffle them
  const candidates = sorted.slice(0, Math.min(count * 2, sorted.length));
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  return candidates.slice(0, count);
}

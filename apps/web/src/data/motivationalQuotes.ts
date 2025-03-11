// Define quotes in both languages
export const motivationalQuotes = {
  en: [
    "Every step forward is progress",
    "Growth comes from understanding yourself",
    "Your journey is unique and valuable",
    "Small changes lead to big transformations",
    "Self-awareness is the key to growth",
    "Knowledge is the path to enlightenment",
    "Challenge your beliefs to find truth",
    "Understanding others starts with understanding yourself",
    "Your perspective matters in the bigger picture",
    "Every opinion has value in the dialogue",
    "Question everything, learn constantly",
    "Today's reflection shapes tomorrow's wisdom",
    "Growth happens outside your comfort zone",
    "Your voice can make a difference",
    "Embrace the journey of self-discovery",
    "Wisdom comes from listening to all sides",
    "Be curious, stay open-minded",
    "Your thoughts shape your reality",
    "Understanding breeds compassion",
    "Each day brings new insights",
    "Progress is better than perfection",
    "Your values define your path",
    "Learning never stops",
    "Think deeply, act wisely",
    "Today's choices shape tomorrow's world"
  ],
  es: [
    "Cada paso adelante es progreso",
    "El crecimiento viene de entenderte a ti mismo",
    "Tu viaje es único y valioso",
    "Pequeños cambios llevan a grandes transformaciones",
    "La autoconciencia es la clave para el crecimiento",
    "El conocimiento es el camino hacia la iluminación",
    "Desafía tus creencias para encontrar la verdad",
    "Entender a los demás comienza por entenderte a ti mismo",
    "Tu perspectiva importa en el panorama general",
    "Cada opinión tiene valor en el diálogo",
    "Cuestiona todo, aprende constantemente",
    "La reflexión de hoy forma la sabiduría del mañana",
    "El crecimiento ocurre fuera de tu zona de confort",
    "Tu voz puede marcar la diferencia",
    "Abraza el viaje del autodescubrimiento",
    "La sabiduría viene de escuchar todos los lados",
    "Sé curioso, mantén la mente abierta",
    "Tus pensamientos dan forma a tu realidad",
    "La comprensión genera compasión",
    "Cada día trae nuevas perspectivas",
    "El progreso es mejor que la perfección",
    "Tus valores definen tu camino",
    "El aprendizaje nunca se detiene",
    "Piensa profundamente, actúa sabiamente",
    "Las elecciones de hoy dan forma al mundo del mañana"
  ]
};

// Helper function to get quotes in the current language
export function getQuotesForLanguage(language: 'en' | 'es') {
  return motivationalQuotes[language] || motivationalQuotes.en;
} 
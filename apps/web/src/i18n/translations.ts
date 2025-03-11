export const translations = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      submit: 'Submit',
      continue: 'Continue',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      search: 'Search',
      clear: 'Clear',
      share: 'Share'
    },
    settings: {
      title: 'Settings',
      membership: {
        premium: 'Premium Member',
        basic: 'Basic Member',
        expiryDate: 'Expiry Date',
        noSubscription: 'No active subscription',
        upgrade: 'Upgrade to Awaken Pro',
        unlockFeatures: 'Unlock advanced features and exclusive content'
      },
      items: {
        notifications: 'Notifications',
        darkTheme: 'Dark Theme',
        language: 'Language',
        privacyPolicy: 'View Privacy Policy',
        helpCenter: 'Help Center',
        reportIssue: 'Report an Issue'
      },
      signOut: 'Sign Out',
      signingOut: 'Signing out...'
    },
    home: {
      welcome: 'Welcome',
      todaysInsight: "Today's Insight",
      viewAll: 'View All',
      completedTests: 'Completed Tests',
      noTestsYet: 'No tests completed yet',
      takeTest: 'Take a Test',
      verifyAccount: 'Verify your account',
      verifyModal: {
        title: 'Not Verified yet?',
        description: 'Use your World ID app to verify your identity!',
        instruction: 'Simply tap "Verify!" below and follow the prompts to complete verification.',
        benefits: 'By verifying you will have access to more features on the app.',
        maybeLater: 'Maybe Later',
        verify: 'Verify!'
      }
    },
    signIn: {
      title: 'Sign In',
      subtitle: 'Your journey toward understanding your true self begins here.',
      worldIdButton: 'Continue with World ID',
      privacyNotice: 'By continuing, you agree to our Terms of Service and Privacy Policy.'
    },
    register: {
      title: "Let's get to know a little bit about you...",
      subtitle: 'Please fill up the following spaces to begin.',
      form: {
        name: 'Name',
        lastName: 'Last Name',
        email: 'Email',
        age: 'Age',
        country: 'Country',
        submit: 'Complete Registration'
      }
    },
    welcome: {
      title: 'Welcome to your journey',
      greeting: 'Hi, {{name}}!',
      description: 'Your journey of self-discovery begins now. Explore tests, gain insights, and understand yourself better.',
      getStarted: 'Get Started'
    },
    ideologyTest: {
      title: 'Ideology Test',
      instructions: 'Please answer the following questions honestly to get accurate results.',
      questionCount: 'Question {{current}} of {{total}}',
      options: {
        stronglyAgree: 'Strongly Agree',
        agree: 'Agree',
        neutral: 'Neutral',
        disagree: 'Disagree',
        stronglyDisagree: 'Strongly Disagree'
      },
      navigation: {
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish Test'
      },
      leaveTest: 'Leave Test',
      leaveConfirmation: 'Are you sure you want to leave? Your progress will be saved.'
    },
    results: {
      title: 'Your Results',
      summary: 'Test completed successfully!',
      shareResults: 'Share Results',
      viewInsights: 'View Insights',
      retakeTest: 'Retake Test',
      scores: {
        economic: 'Economic',
        diplomatic: 'Diplomatic',
        civil: 'Civil',
        societal: 'Societal'
      }
    },
    insights: {
      title: 'Your Insights',
      description: 'Deeper understanding of your test results',
      advancedInsights: 'Advanced Insights',
      shareInsights: 'Share Insights',
      categories: {
        economic: 'Economic',
        diplomatic: 'Diplomatic',
        civil: 'Civil',
        societal: 'Societal'
      },
      loading: 'Generating insights...',
      aiAnalysis: 'AI Analysis',
      viewMore: 'View More'
    },
    testSelection: {
      title: 'Available Tests',
      description: 'Explore our collection of tests to understand yourself better',
      searchPlaceholder: 'Search for tests...',
      ideologyTest: 'Ideology Test',
      personalityTest: 'Personality Test',
      startTest: 'Start Test',
      achievementsSoon: 'Achievements coming soon! 🏆',
      moreSoon: 'More tests coming soon! Stay tuned 🎉'
    },
    leaderboard: {
      title: 'Leaderboard',
      description: 'See how you compare with others',
      rank: 'Rank',
      user: 'User',
      score: 'Score',
      comingSoon: 'Coming Soon',
      comingSoonDescription: 'The leaderboard feature is currently under development. Check back soon to compete with others!',
      filter: {
        all: 'All Time',
        month: 'This Month',
        week: 'This Week',
        day: 'Today'
      }
    },
    achievements: {
      title: 'Achievements',
      description: 'Celebrate your progress and discover what\'s next on your journey',
      points: '{{current}}/{{max}} points',
      nextLevel: 'Reach the next level to unlock new badges and exclusive content!',
      locked: 'Locked',
      unlocked: 'Unlocked',
      progress: '{{current}}/{{total}} completed',
      comingSoon: 'Coming Soon',
      comingSoonDescription: 'The achievements feature is currently under development. Check back soon to celebrate your progress!'
    },
    awakenPro: {
      title: 'Step Into the Next Level',
      description: 'Unlock premium features and content',
      currentPlan: 'Current plan:',
      popular: 'Popular',
      billingCycle: 'Per month, billed monthly',
      paymentDescription: 'Upgrade to Awaken Pro - 1 Month Subscription',
      features: {
        advancedInsights: 'Advanced Insights',
        earlyAccess: 'Early access to new features',
        exclusiveCommunity: 'Exclusive Community Access',
        prioritySupport: 'Priority Support',
        aiChat: 'Soon chat with AI',
        moreSoon: 'More coming soon...'
      },
      pricing: {
        monthly: '$3.50/month',
        yearly: '$35/year',
        lifetime: '$99 one-time'
      },
      subscribe: 'Upgrade to Pro',
      alreadySubscribed: 'You are already subscribed'
    },
    notFound: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      backHome: 'Back to Home'
    },
    tests: {
      instructions: {
        title: 'Uncover Your Political Values',
        beforeYouStart: 'Before you start',
        testDescription: 'This test consists of {{count}} thought-provoking statements designed to explore your political beliefs. Your answers will reflect your position across eight core values.',
        honestResponses: 'Please respond honestly, based on your true opinions.',
        estimatedTime: 'Estimated Time',
        minutes: '{{count}} min',
        progress: 'Progress',
        startTest: 'Start test',
        continueTest: 'Continue test'
      }
    },
    testCard: {
      progress: 'Progress',
      ofTestCompleted: 'of test completed',
      achievements: 'Achievements',
      achievement: 'achievement'
    },
    achievementCard: {
      obtainedOn: 'Obtained on {{date}}'
    },
    toggle: {
      notificationsOn: 'Notifications are enabled',
      notificationsOff: 'Notifications are disabled',
      darkModeOn: 'Dark mode is enabled',
      darkModeOff: 'Dark mode is disabled'
    }
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Ha ocurrido un error',
      retry: 'Reintentar',
      cancel: 'Cancelar',
      save: 'Guardar',
      submit: 'Enviar',
      continue: 'Continuar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      close: 'Cerrar',
      search: 'Buscar',
      clear: 'Limpiar',
      share: 'Compartir'
    },
    settings: {
      title: 'Configuración',
      membership: {
        premium: 'Miembro Premium',
        basic: 'Miembro Básico',
        expiryDate: 'Fecha de Vencimiento',
        noSubscription: 'Sin suscripción activa',
        upgrade: 'Actualizar a Awaken Pro',
        unlockFeatures: 'Desbloquea funciones avanzadas y contenido exclusivo'
      },
      items: {
        notifications: 'Notificaciones',
        darkTheme: 'Tema Oscuro',
        language: 'Idioma',
        privacyPolicy: 'Ver Política de Privacidad',
        helpCenter: 'Centro de Ayuda',
        reportIssue: 'Reportar un Problema'
      },
      signOut: 'Cerrar Sesión',
      signingOut: 'Cerrando sesión...'
    },
    home: {
      welcome: 'Bienvenido',
      todaysInsight: 'Perspectiva del Día',
      viewAll: 'Ver Todo',
      completedTests: 'Pruebas Completadas',
      noTestsYet: 'Aún no has completado pruebas',
      takeTest: 'Realizar una Prueba',
      verifyAccount: 'Verifica tu cuenta',
      verifyModal: {
        title: '¿Aún no verificado?',
        description: '¡Usa tu aplicación World ID para verificar tu identidad!',
        instruction: 'Simplemente toca "¡Verificar!" abajo y sigue las instrucciones para completar la verificación.',
        benefits: 'Al verificarte tendrás acceso a más funciones en la aplicación.',
        maybeLater: 'Quizás Después',
        verify: '¡Verificar!'
      }
    },
    signIn: {
      title: 'Iniciar Sesión',
      subtitle: 'Tu viaje hacia la comprensión de tu verdadero yo comienza aquí.',
      worldIdButton: 'Continuar con World ID',
      privacyNotice: 'Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.'
    },
    register: {
      title: 'Conozcamos un poco sobre ti...',
      subtitle: 'Por favor completa los siguientes espacios para comenzar.',
      form: {
        name: 'Nombre',
        lastName: 'Apellido',
        email: 'Correo Electrónico',
        age: 'Edad',
        country: 'País',
        submit: 'Completar Registro'
      }
    },
    welcome: {
      title: 'Bienvenido a tu viaje',
      greeting: '¡Hola, {{name}}!',
      description: 'Tu viaje de autodescubrimiento comienza ahora. Explora pruebas, obtén perspectivas y comprende mejor tu personalidad.',
      getStarted: 'Comenzar'
    },
    ideologyTest: {
      title: 'Prueba de Ideología',
      instructions: 'Por favor responde las siguientes preguntas honestamente para obtener resultados precisos.',
      questionCount: 'Pregunta {{current}} de {{total}}',
      options: {
        stronglyAgree: 'Totalmente de Acuerdo',
        agree: 'De Acuerdo',
        neutral: 'Neutral',
        disagree: 'En Desacuerdo',
        stronglyDisagree: 'Totalmente en Desacuerdo'
      },
      navigation: {
        next: 'Siguiente',
        previous: 'Anterior',
        finish: 'Finalizar Prueba'
      },
      leaveTest: 'Abandonar Prueba',
      leaveConfirmation: '¿Estás seguro de que quieres salir? Tu progreso será guardado.'
    },
    results: {
      title: 'Tus Resultados',
      summary: '¡Prueba completada con éxito!',
      shareResults: 'Compartir Resultados',
      viewInsights: 'Ver Perspectivas',
      retakeTest: 'Repetir Prueba',
      scores: {
        economic: 'Económico',
        diplomatic: 'Diplomático',
        civil: 'Civil',
        societal: 'Social'
      }
    },
    insights: {
      title: 'Tus Perspectivas',
      description: 'Comprensión más profunda de tus resultados',
      advancedInsights: 'Perspectivas Avanzadas',
      shareInsights: 'Compartir Perspectivas',
      categories: {
        economic: 'Económico',
        diplomatic: 'Diplomático',
        civil: 'Civil',
        societal: 'Social'
      },
      loading: 'Generando perspectivas...',
      aiAnalysis: 'Análisis de IA',
      viewMore: 'Ver Más'
    },
    testSelection: {
      title: 'Pruebas Disponibles',
      description: 'Explora nuestra colección de pruebas para entenderte mejor',
      searchPlaceholder: 'Buscar pruebas...',
      ideologyTest: 'Prueba de Ideología',
      personalityTest: 'Prueba de Personalidad',
      startTest: 'Iniciar Prueba',
      achievementsSoon: '¡Logros próximamente! 🏆',
      moreSoon: '¡Más pruebas próximamente! Mantente atento 🎉'
    },
    leaderboard: {
      title: 'Tabla de Clasificación',
      description: 'Mira cómo te comparas con otros',
      rank: 'Posición',
      user: 'Usuario',
      score: 'Puntuación',
      comingSoon: 'Próximamente',
      comingSoonDescription: 'La función de tabla de clasificación está actualmente en desarrollo. ¡Vuelve pronto para competir con otros!',
      filter: {
        all: 'Todo el Tiempo',
        month: 'Este Mes',
        week: 'Esta Semana',
        day: 'Hoy'
      }
    },
    achievements: {
      title: 'Logros',
      description: 'Celebra tu progreso y descubre qué sigue en tu viaje',
      points: '{{current}}/{{max}} puntos',
      nextLevel: '¡Alcanza el siguiente nivel para desbloquear nuevas insignias y contenido exclusivo!',
      locked: 'Bloqueado',
      unlocked: 'Desbloqueado',
      progress: '{{current}}/{{total}} completados',
      comingSoon: 'Próximamente',
      comingSoonDescription: 'La función de logros está actualmente en desarrollo. ¡Vuelve pronto para celebrar tu progreso!'
    },
    awakenPro: {
      title: 'Da el Siguiente Paso',
      description: 'Desbloquea funciones y contenido premium',
      currentPlan: 'Plan actual:',
      popular: 'Popular',
      billingCycle: 'Por mes, facturado mensualmente',
      paymentDescription: 'Actualizar a Awaken Pro - Suscripción de 1 Mes',
      features: {
        advancedInsights: 'Análisis Avanzados',
        earlyAccess: 'Acceso anticipado a nuevas funciones',
        exclusiveCommunity: 'Acceso a Comunidad Exclusiva',
        prioritySupport: 'Soporte Prioritario',
        aiChat: 'Próximamente chat con IA',
        moreSoon: 'Más próximamente...'
      },
      pricing: {
        monthly: '3,50€/mes',
        yearly: '35€/año',
        lifetime: '99€ pago único'
      },
      subscribe: 'Actualizar a Pro',
      alreadySubscribed: 'Ya estás suscrito'
    },
    notFound: {
      title: 'Página No Encontrada',
      description: 'La página que estás buscando no existe.',
      backHome: 'Volver al Inicio'
    },
    tests: {
      instructions: {
        title: 'Descubre Tus Valores Políticos',
        beforeYouStart: 'Antes de comenzar',
        testDescription: 'Esta prueba consta de {{count}} declaraciones estimulantes diseñadas para explorar tus creencias políticas. Tus respuestas reflejarán tu posición en ocho valores fundamentales.',
        honestResponses: 'Por favor, responde honestamente, basándote en tus verdaderas opiniones.',
        estimatedTime: 'Tiempo Estimado',
        minutes: '{{count}} min',
        progress: 'Progreso',
        startTest: 'Iniciar prueba',
        continueTest: 'Continuar prueba'
      }
    },
    testCard: {
      progress: 'Progreso',
      ofTestCompleted: 'de la prueba completada',
      achievements: 'Logros',
      achievement: 'logro'
    },
    achievementCard: {
      obtainedOn: 'Obtenido el {{date}}'
    },
    toggle: {
      notificationsOn: 'Las notificaciones están habilitadas',
      notificationsOff: 'Las notificaciones están deshabilitadas',
      darkModeOn: 'El modo oscuro está habilitado',
      darkModeOff: 'El modo oscuro está deshabilitado'
    }
  }
}; 
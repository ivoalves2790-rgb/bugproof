// Motivational messages that leverage financial aspiration and FOMO
// Shown at strategic moments to drive engagement
// Theme: vibecoding = building real apps with AI = making money

export interface MotivationMessage {
  text: string;
  textEs: string;
}

// After completing a lesson
export const COMPLETION_MESSAGES: MotivationMessage[] = [
  {
    text: "Top vibecoders earn $150K+ a year from their apps. You just got one step closer.",
    textEs: "Los mejores vibecoders ganan $150K+ al año con sus apps. Acabas de acercarte un paso más.",
  },
  {
    text: "Most people talk about learning to vibecode. You're actually doing it.",
    textEs: "La mayoría habla de aprender vibecoding. Tú lo estás haciendo.",
  },
  {
    text: "Every lesson you finish is worth more than a college lecture. And it's free.",
    textEs: "Cada lección que terminas vale más que una clase universitaria. Y es gratis.",
  },
  {
    text: "The top 1% of earners didn't get there by quitting. Keep going.",
    textEs: "El 1% que más gana no llegó ahí rindiéndose. Sigue adelante.",
  },
  {
    text: "Basic apps earn pocket change. Bulletproof apps earn $200K+. This is how you get there.",
    textEs: "Las apps básicas generan centavos. Las apps sólidas generan $200K+. Así es como llegas.",
  },
  {
    text: "While others scroll social media, you're building a $100K+ skill.",
    textEs: "Mientras otros ven redes sociales, tú estás construyendo una habilidad de $100K+.",
  },
  {
    text: "Companies are desperate for reliable apps. You're learning to build what they need.",
    textEs: "Las empresas buscan apps confiables desesperadamente. Estás aprendiendo a construir lo que necesitan.",
  },
  {
    text: "You just learned something most CS graduates don't know. Seriously.",
    textEs: "Acabas de aprender algo que la mayoría de graduados en informática no sabe. En serio.",
  },
  {
    text: "Remote work. Six figures. Your own schedule. That's the vibecoder life.",
    textEs: "Trabajo remoto. Seis cifras. Tu propio horario. Esa es la vida de vibecoder.",
  },
  {
    text: "Only 3% of people finish what they start. You're in that 3%.",
    textEs: "Solo el 3% de la gente termina lo que empieza. Tú estás en ese 3%.",
  },
  {
    text: "That lesson just made your future app more bulletproof. Clients pay premium for that.",
    textEs: "Esa lección acaba de hacer tu futura app más sólida. Los clientes pagan extra por eso.",
  },
  {
    text: "Vibecoding without this knowledge? Risky. Vibecoding WITH it? Unstoppable.",
    textEs: "Vibecoding sin este conocimiento? Arriesgado. Vibecoding CON el? Imparable.",
  },
  {
    text: "Every concept you learn is another tool in your money-making toolkit.",
    textEs: "Cada concepto que aprendes es otra herramienta en tu kit para generar dinero.",
  },
  {
    text: "You're not just learning to vibecode. You're learning to build products people pay for.",
    textEs: "No solo estás aprendiendo vibecoding. Estás aprendiendo a construir productos por los que la gente paga.",
  },
  {
    text: "Freelancers who understand this charge 3x more. You're becoming one of them.",
    textEs: "Los freelancers que entienden esto cobran 3 veces más. Te estás convirtiendo en uno de ellos.",
  },
];

// Streak messages
export const STREAK_MESSAGES: MotivationMessage[] = [
  {
    text: "Day {streak} streak! Consistency beats talent every time.",
    textEs: "Racha de {streak} días! La constancia le gana al talento siempre.",
  },
  {
    text: "{streak} days in a row. Most people quit by day 2. Not you.",
    textEs: "{streak} días seguidos. La mayoría renuncia en el día 2. Tú no.",
  },
  {
    text: "Your streak is {streak} days. That's {streak} days closer to a six-figure career.",
    textEs: "Tu racha es de {streak} días. Eso es {streak} días más cerca de una carrera de seis cifras.",
  },
  {
    text: "{streak} days building your future. Most people spend {streak} days binge-watching Netflix.",
    textEs: "{streak} días construyendo tu futuro. La mayoría pasa {streak} días viendo Netflix.",
  },
  {
    text: "Day {streak}. Every day you show up, you're beating 97% of people who gave up.",
    textEs: "Día {streak}. Cada día que apareces, superas al 97% de la gente que se rindió.",
  },
];

// Dashboard / app open messages
export const DASHBOARD_MESSAGES: MotivationMessage[] = [
  {
    text: "Demand for app builders went up 12% this year. Your timing is perfect.",
    textEs: "La demanda de creadores de apps subió 12% este año. Tu momento es perfecto.",
  },
  {
    text: "Every day you don't learn is a day your future competitors do.",
    textEs: "Cada día que no aprendes es un dia que tus futuros competidores sí lo hacen.",
  },
  {
    text: "AI won't replace vibecoders. It will replace vibecoders who don't understand what they're building.",
    textEs: "La IA no reemplazará a los vibecoders. Reemplazará a los vibecoders que no entienden lo que construyen.",
  },
  {
    text: "You're building the most in-demand skill of the decade. Don't stop.",
    textEs: "Estás construyendo la habilidad más demandada de la década. No pares.",
  },
  {
    text: "15 minutes a day. That's all it takes to change your income forever.",
    textEs: "15 minutos al día. Es todo lo que necesitas para cambiar tus ingresos para siempre.",
  },
  {
    text: "Your future self will thank you for today's lesson.",
    textEs: "Tu yo del futuro te agradecerá por la lección de hoy.",
  },
  {
    text: "Freelance vibecoders charge $100-300/hr. You're learning to be one.",
    textEs: "Los vibecoders freelance cobran $100-300/hr. Estás aprendiendo a ser uno.",
  },
  {
    text: "Tech layoffs? Companies are still paying vibecoders who can actually ship.",
    textEs: "Despidos en tech? Las empresas siguen pagando a vibecoders que saben entregar.",
  },
  {
    text: "People are launching $10K/month SaaS products with vibecoding. This is how you join them.",
    textEs: "La gente está lanzando productos SaaS de $10K/mes con vibecoding. Así es como te unes a ellos.",
  },
  {
    text: "One app idea + the skills you're building = a business. Keep learning.",
    textEs: "Una idea de app + las habilidades que estás construyendo = un negocio. Sigue aprendiendo.",
  },
  {
    text: "The difference between a hobby vibecoder and a paid one? What you're learning right now.",
    textEs: "La diferencia entre un vibecoder aficionado y uno pagado? Lo que estás aprendiendo ahora.",
  },
];

// Return after absence
export const RETURN_MESSAGES: MotivationMessage[] = [
  {
    text: "Welcome back. The best vibecoders never stop learning.",
    textEs: "Bienvenido de vuelta. Los mejores vibecoders nunca paran de aprender.",
  },
  {
    text: "You took a break, but you came back. That's what winners do.",
    textEs: "Te tomaste un descanso, pero volviste. Eso es lo que hacen los ganadores.",
  },
  {
    text: "While you were away, thousands of new apps were launched by vibecoders. Let's get you ready.",
    textEs: "Mientras no estabas, miles de nuevas apps fueron lanzadas por vibecoders. Prepárate.",
  },
  {
    text: "Every vibecoder who paused and came back ended up stronger. Welcome back.",
    textEs: "Cada vibecoder que pausó y volvió terminó siendo más fuerte. Bienvenido de vuelta.",
  },
];

// Course page messages — shown when viewing a course
export const COURSE_PAGE_MESSAGES: MotivationMessage[] = [
  {
    text: "This course alone could be worth thousands in freelance income. Dive in.",
    textEs: "Solo este curso podría valer miles en ingresos freelance. Sumérgete.",
  },
  {
    text: "Vibecoders who master this topic build better apps and charge more. That's a fact.",
    textEs: "Los vibecoders que dominan este tema construyen mejores apps y cobran más. Es un hecho.",
  },
  {
    text: "Every unit you complete here is a line on your resume that gets interviews.",
    textEs: "Cada unidad que completas aquí es una línea en tu CV que consigue entrevistas.",
  },
  {
    text: "This is what separates vibecoders who make money from vibecoders who don't.",
    textEs: "Esto es lo que separa a los vibecoders que ganan dinero de los que no.",
  },
  {
    text: "Companies pay $150/hr for contractors who know this. You're learning it for free.",
    textEs: "Las empresas pagan $150/hr a contratistas que saben esto. Tú lo estás aprendiendo gratis.",
  },
  {
    text: "Your future clients won't know you used AI to build their app. But they'll know it works. That's this course.",
    textEs: "Tus futuros clientes no sabrán que usaste IA para construir su app. Pero sabrán que funciona. Este curso es eso.",
  },
];

// Unit page messages — shown when viewing a unit's lesson list
export const UNIT_PAGE_MESSAGES: MotivationMessage[] = [
  {
    text: "Each lesson here is a building block toward your first paid project.",
    textEs: "Cada lección aquí es un bloque de construcción hacia tu primer proyecto pagado.",
  },
  {
    text: "Finish this unit and you'll know more than 90% of vibecoders out there.",
    textEs: "Termina esta unidad y sabrás más que el 90% de los vibecoders.",
  },
  {
    text: "This is real knowledge that makes real money. Not theory — practice.",
    textEs: "Este es conocimiento real que genera dinero real. No teoría — práctica.",
  },
  {
    text: "Every lesson completed = one less thing that can go wrong in your paid projects.",
    textEs: "Cada lección completada = una cosa menos que puede salir mal en tus proyectos pagados.",
  },
  {
    text: "The vibecoders making $5K-20K/month from apps? They all learned this.",
    textEs: "Los vibecoders que ganan $5K-20K/mes con apps? Todos aprendieron esto.",
  },
  {
    text: "You're not just studying. You're building the foundation of a business.",
    textEs: "No solo estás estudiando. Estás construyendo la base de un negocio.",
  },
];

// Teaching phase messages — shown during lesson teach slides
export const TEACHING_MESSAGES: MotivationMessage[] = [
  {
    text: "Every concept you absorb here makes your AI-built apps more reliable — and more profitable.",
    textEs: "Cada concepto que absorbes aquí hace tus apps construidas con IA más confiables — y más rentables.",
  },
  {
    text: "This is the knowledge that turns a side project into a paying product.",
    textEs: "Este es el conocimiento que convierte un proyecto personal en un producto que paga.",
  },
  {
    text: "AI writes the code. You call the shots. That's vibecoding — and that's where the money is.",
    textEs: "La IA escribe el código. Tú tomas las decisiones. Eso es vibecoding — y ahí es donde está el dinero.",
  },
  {
    text: "Understanding this puts you ahead of every vibecoder who skipped the fundamentals.",
    textEs: "Entender esto te pone por delante de cada vibecoder que se saltó los fundamentos.",
  },
  {
    text: "Clients pay for apps that work. This lesson teaches you why they break — and how to prevent it.",
    textEs: "Los clientes pagan por apps que funcionan. Esta lección te enseña por qué fallan — y cómo prevenirlo.",
  },
  {
    text: "This isn't just education. It's an investment in your earning potential.",
    textEs: "Esto no es solo educación. Es una inversión en tu potencial de ingresos.",
  },
];

// Exercise start messages — shown before an exercise begins
export const EXERCISE_START_MESSAGES: MotivationMessage[] = [
  {
    text: "Time to prove you've got what it takes. The best vibecoders understand the problems they're solving.",
    textEs: "Hora de demostrar lo que vales. Los mejores vibecoders entienden los problemas que resuelven.",
  },
  {
    text: "This exercise simulates what you'll face in real projects — the ones that pay.",
    textEs: "Este ejercicio simula lo que enfrentarás en proyectos reales — los que pagan.",
  },
  {
    text: "Practice makes profit. Every exercise makes your future apps more bulletproof.",
    textEs: "La práctica genera ganancias. Cada ejercicio hace tus futuras apps más sólidas.",
  },
  {
    text: "The difference between a $20/hr vibecoder and a $200/hr one? Practice like this.",
    textEs: "La diferencia entre un vibecoder de $20/hr y uno de $200/hr? Practica como esta.",
  },
  {
    text: "Nail this and you're one step closer to launching your own product.",
    textEs: "Domina esto y estarás un paso más cerca de lanzar tu propio producto.",
  },
  {
    text: "This is where knowledge becomes skill — and skill becomes income.",
    textEs: "Aquí es donde el conocimiento se convierte en habilidad — y la habilidad en ingresos.",
  },
];

export function getRandomMessage(messages: MotivationMessage[], locale: string, vars?: Record<string, string | number>): string {
  const msg = messages[Math.floor(Math.random() * messages.length)];
  let text = locale === "es" ? msg.textEs : msg.text;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}

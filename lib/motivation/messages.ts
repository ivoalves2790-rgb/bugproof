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
    text: "Software engineers earn $150K+ on average. You just got one step closer.",
    textEs: "Los ingenieros de software ganan $150K+ en promedio. Acabas de acercarte un paso mas.",
  },
  {
    text: "Most people talk about learning to code. You're actually doing it.",
    textEs: "La mayoria habla de aprender a programar. Tu lo estas haciendo.",
  },
  {
    text: "Every lesson you finish is worth more than a college lecture. And it's free.",
    textEs: "Cada leccion que terminas vale mas que una clase universitaria. Y es gratis.",
  },
  {
    text: "The top 1% of earners didn't get there by quitting. Keep going.",
    textEs: "El 1% que mas gana no llego ahi rindiendose. Sigue adelante.",
  },
  {
    text: "Junior devs start at $80K. Seniors hit $200K+. This is how you get there.",
    textEs: "Los juniors empiezan en $80K. Los seniors llegan a $200K+. Asi es como llegas.",
  },
  {
    text: "While others scroll social media, you're building a $100K+ skill.",
    textEs: "Mientras otros ven redes sociales, tu estas construyendo una habilidad de $100K+.",
  },
  {
    text: "Companies are desperate for engineers. You're becoming what they need.",
    textEs: "Las empresas buscan ingenieros desesperadamente. Te estas convirtiendo en lo que necesitan.",
  },
  {
    text: "You just learned something most CS graduates don't know. Seriously.",
    textEs: "Acabas de aprender algo que la mayoria de graduados en informatica no sabe. En serio.",
  },
  {
    text: "Remote work. Six figures. Your own schedule. That's the engineering life.",
    textEs: "Trabajo remoto. Seis cifras. Tu propio horario. Esa es la vida de ingeniero.",
  },
  {
    text: "Only 3% of people finish what they start. You're in that 3%.",
    textEs: "Solo el 3% de la gente termina lo que empieza. Tu estas en ese 3%.",
  },
  {
    text: "That lesson just made your future app more bulletproof. Clients pay premium for that.",
    textEs: "Esa leccion acaba de hacer tu futura app mas solida. Los clientes pagan extra por eso.",
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
    text: "You're not just learning to code. You're learning to build products people pay for.",
    textEs: "No solo estas aprendiendo a programar. Estas aprendiendo a construir productos por los que la gente paga.",
  },
  {
    text: "Freelancers who understand this charge 3x more. You're becoming one of them.",
    textEs: "Los freelancers que entienden esto cobran 3 veces mas. Te estas convirtiendo en uno de ellos.",
  },
];

// Streak messages
export const STREAK_MESSAGES: MotivationMessage[] = [
  {
    text: "Day {streak} streak! Consistency beats talent every time.",
    textEs: "Racha de {streak} dias! La constancia le gana al talento siempre.",
  },
  {
    text: "{streak} days in a row. Most people quit by day 2. Not you.",
    textEs: "{streak} dias seguidos. La mayoria renuncia en el dia 2. Tu no.",
  },
  {
    text: "Your streak is {streak} days. That's {streak} days closer to a six-figure career.",
    textEs: "Tu racha es de {streak} dias. Eso es {streak} dias mas cerca de una carrera de seis cifras.",
  },
  {
    text: "{streak} days building your future. Most people spend {streak} days binge-watching Netflix.",
    textEs: "{streak} dias construyendo tu futuro. La mayoria pasa {streak} dias viendo Netflix.",
  },
  {
    text: "Day {streak}. Every day you show up, you're beating 97% of people who gave up.",
    textEs: "Dia {streak}. Cada dia que apareces, superas al 97% de la gente que se rindio.",
  },
];

// Dashboard / app open messages
export const DASHBOARD_MESSAGES: MotivationMessage[] = [
  {
    text: "The average engineer salary went up 12% this year. Your timing is perfect.",
    textEs: "El salario promedio de ingeniero subio 12% este ano. Tu momento es perfecto.",
  },
  {
    text: "Every day you don't learn is a day your future competitors do.",
    textEs: "Cada dia que no aprendes es un dia que tus futuros competidores si lo hacen.",
  },
  {
    text: "AI won't replace engineers. It will replace people who can't work with engineers.",
    textEs: "La IA no reemplazara a los ingenieros. Reemplazara a los que no sepan trabajar con ellos.",
  },
  {
    text: "You're building the most in-demand skill of the decade. Don't stop.",
    textEs: "Estas construyendo la habilidad mas demandada de la decada. No pares.",
  },
  {
    text: "15 minutes a day. That's all it takes to change your income forever.",
    textEs: "15 minutos al dia. Es todo lo que necesitas para cambiar tus ingresos para siempre.",
  },
  {
    text: "Your future self will thank you for today's lesson.",
    textEs: "Tu yo del futuro te agradecera por la leccion de hoy.",
  },
  {
    text: "Freelance engineers charge $100-300/hr. You're learning to be one.",
    textEs: "Los ingenieros freelance cobran $100-300/hr. Estas aprendiendo a ser uno.",
  },
  {
    text: "Tech layoffs? Companies are still hiring engineers who can actually build.",
    textEs: "Despidos en tech? Las empresas siguen contratando ingenieros que saben construir.",
  },
  {
    text: "People are launching $10K/month SaaS products with vibecoding. This is how you join them.",
    textEs: "La gente esta lanzando productos SaaS de $10K/mes con vibecoding. Asi es como te unes a ellos.",
  },
  {
    text: "One app idea + the skills you're building = a business. Keep learning.",
    textEs: "Una idea de app + las habilidades que estas construyendo = un negocio. Sigue aprendiendo.",
  },
  {
    text: "The difference between a hobby coder and a paid engineer? What you're learning right now.",
    textEs: "La diferencia entre un programador aficionado y un ingeniero pagado? Lo que estas aprendiendo ahora.",
  },
];

// Return after absence
export const RETURN_MESSAGES: MotivationMessage[] = [
  {
    text: "Welcome back. The best engineers never stop learning.",
    textEs: "Bienvenido de vuelta. Los mejores ingenieros nunca paran de aprender.",
  },
  {
    text: "You took a break, but you came back. That's what winners do.",
    textEs: "Te tomaste un descanso, pero volviste. Eso es lo que hacen los ganadores.",
  },
  {
    text: "While you were away, 50,000 new dev jobs were posted. Let's get you ready.",
    textEs: "Mientras no estabas, se publicaron 50,000 nuevos empleos de desarrollo. Preparate.",
  },
  {
    text: "Every vibecoder who paused and came back ended up stronger. Welcome back.",
    textEs: "Cada vibecoder que pauso y volvio termino siendo mas fuerte. Bienvenido de vuelta.",
  },
];

// Course page messages — shown when viewing a course
export const COURSE_PAGE_MESSAGES: MotivationMessage[] = [
  {
    text: "This course alone could be worth thousands in freelance income. Dive in.",
    textEs: "Solo este curso podria valer miles en ingresos freelance. Sumergete.",
  },
  {
    text: "Engineers who master this topic get promoted faster. That's a fact.",
    textEs: "Los ingenieros que dominan este tema ascienden mas rapido. Es un hecho.",
  },
  {
    text: "Every unit you complete here is a line on your resume that gets interviews.",
    textEs: "Cada unidad que completas aqui es una linea en tu CV que consigue entrevistas.",
  },
  {
    text: "This is what separates vibecoders who make money from vibecoders who don't.",
    textEs: "Esto es lo que separa a los vibecoders que ganan dinero de los que no.",
  },
  {
    text: "Companies pay $150/hr for contractors who know this. You're learning it for free.",
    textEs: "Las empresas pagan $150/hr a contratistas que saben esto. Tu lo estas aprendiendo gratis.",
  },
  {
    text: "Your future clients won't know you used AI to build their app. But they'll know it works. That's this course.",
    textEs: "Tus futuros clientes no sabran que usaste IA para construir su app. Pero sabran que funciona. Este curso es eso.",
  },
];

// Unit page messages — shown when viewing a unit's lesson list
export const UNIT_PAGE_MESSAGES: MotivationMessage[] = [
  {
    text: "Each lesson here is a building block toward your first paid project.",
    textEs: "Cada leccion aqui es un bloque de construccion hacia tu primer proyecto pagado.",
  },
  {
    text: "Finish this unit and you'll know more than 90% of self-taught developers.",
    textEs: "Termina esta unidad y sabras mas que el 90% de los desarrolladores autodidactas.",
  },
  {
    text: "This is real knowledge that makes real money. Not theory — practice.",
    textEs: "Este es conocimiento real que genera dinero real. No teoria — practica.",
  },
  {
    text: "Every lesson completed = one less thing that can go wrong in your paid projects.",
    textEs: "Cada leccion completada = una cosa menos que puede salir mal en tus proyectos pagados.",
  },
  {
    text: "The vibecoders making $5K-20K/month from apps? They all learned this.",
    textEs: "Los vibecoders que ganan $5K-20K/mes con apps? Todos aprendieron esto.",
  },
  {
    text: "You're not just studying. You're building the foundation of a business.",
    textEs: "No solo estas estudiando. Estas construyendo la base de un negocio.",
  },
];

// Teaching phase messages — shown during lesson teach slides
export const TEACHING_MESSAGES: MotivationMessage[] = [
  {
    text: "Every concept you absorb here makes your AI-built apps more reliable — and more profitable.",
    textEs: "Cada concepto que absorbes aqui hace tus apps construidas con IA mas confiables — y mas rentables.",
  },
  {
    text: "This is the knowledge that turns a side project into a paying product.",
    textEs: "Este es el conocimiento que convierte un proyecto personal en un producto que paga.",
  },
  {
    text: "AI writes the code. You make the decisions. That's where the money is.",
    textEs: "La IA escribe el codigo. Tu tomas las decisiones. Ahi es donde esta el dinero.",
  },
  {
    text: "Understanding this puts you ahead of every vibecoder who skipped the fundamentals.",
    textEs: "Entender esto te pone por delante de cada vibecoder que se salto los fundamentos.",
  },
  {
    text: "Clients pay for apps that work. This lesson teaches you why they break — and how to prevent it.",
    textEs: "Los clientes pagan por apps que funcionan. Esta leccion te ensena por que fallan — y como prevenirlo.",
  },
  {
    text: "This isn't just education. It's an investment in your earning potential.",
    textEs: "Esto no es solo educacion. Es una inversion en tu potencial de ingresos.",
  },
];

// Exercise start messages — shown before an exercise begins
export const EXERCISE_START_MESSAGES: MotivationMessage[] = [
  {
    text: "Time to prove you've got what it takes. Real engineers solve real problems.",
    textEs: "Hora de demostrar lo que vales. Los ingenieros reales resuelven problemas reales.",
  },
  {
    text: "This exercise simulates what you'll face in real projects — the ones that pay.",
    textEs: "Este ejercicio simula lo que enfrentaras en proyectos reales — los que pagan.",
  },
  {
    text: "Practice makes profit. Every exercise makes your future apps more bulletproof.",
    textEs: "La practica genera ganancias. Cada ejercicio hace tus futuras apps mas solidas.",
  },
  {
    text: "The difference between a $20/hr coder and a $200/hr engineer? Practice like this.",
    textEs: "La diferencia entre un programador de $20/hr y un ingeniero de $200/hr? Practica como esta.",
  },
  {
    text: "Nail this and you're one step closer to launching your own product.",
    textEs: "Domina esto y estaras un paso mas cerca de lanzar tu propio producto.",
  },
  {
    text: "This is where knowledge becomes skill — and skill becomes income.",
    textEs: "Aqui es donde el conocimiento se convierte en habilidad — y la habilidad en ingresos.",
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

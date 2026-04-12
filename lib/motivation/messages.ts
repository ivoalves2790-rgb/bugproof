// Motivational messages that leverage financial aspiration and FOMO
// Shown at strategic moments to drive engagement

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

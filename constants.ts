

import { Phrase, LessonStage, GameLevel, QuizQuestion } from './types';

export const CONVERSATION_PHRASES: Phrase[] = [
  { id: '1', text: 'put someone at ease', category: 'green', ccq: ['Relaxed or nervous? (Relaxed)', 'Comfortable speaking? (Yes)'], definition: 'To make someone feel relaxed and comfortable.' },
  { id: '2', text: 'listen enthusiastically', category: 'green', ccq: ['Interested or bored? (Interested)', 'Phone in hand? (No)'], definition: 'To show genuine interest while listening.' },
  { id: '3', text: 'establish shared interests', category: 'green', ccq: ['Find something you both like? (Yes)', 'Easier conversation after? (Yes)'], definition: 'To find topics you both enjoy.' },
  { id: '4', text: 'ask appropriate questions', category: 'green', ccq: ['Polite? (Yes)', 'Too personal? (No)'], definition: 'Asking questions that fit the situation.' },
  { id: '5', text: 'make small talk', category: 'green', ccq: ['Deep topic? (No)', 'Safe topics? (Yes)'], definition: 'Polite conversation about unimportant things.' },
  { id: '6', text: 'make a good impression', category: 'green', ccq: ['Want them to like you? (Yes)', 'Important for first meeting? (Yes)'], definition: 'To make people admire or like you.' },
  { id: '7', text: 'tell an entertaining story', category: 'green', ccq: ['Boring? (No)', 'Do people laugh? (Often)'], definition: 'Sharing a story that amuses others.' },
  { id: '8', text: 'hit it off', category: 'green', ccq: ['Like each other quickly? (Yes)', 'Easy conversation? (Yes)'], definition: 'To be friendly with each other immediately.' },
  { id: '9', text: 'have awkward silences', category: 'yellow', ccq: ['Comfortable? (No)', 'People nervous? (Yes)'], definition: 'Uncomfortable pauses in conversation.' },
  { id: '10', text: 'have a misunderstanding', category: 'yellow', ccq: ['Same meaning? (No)', 'Need to clarify? (Yes)'], definition: 'A failure to understand correctly.' },
  { id: '11', text: 'have a row', category: 'red', ccq: ['Friendly? (No)', 'Loud voices? (Yes)'], definition: 'To have a noisy argument.' },
  { id: '12', text: 'put your foot in it', category: 'red', ccq: ['Situation better? (No)', 'Embarrassed? (Yes)'], definition: 'To say something upsetting or embarrassing by accident.' },
  { id: '13', text: 'offend someone', category: 'red', ccq: ['Do they feel happy? (No)', 'Need to apologize? (Yes)'], definition: 'To make someone upset or angry.' },
  { id: '14', text: 'dominate the conversation', category: 'red', ccq: ['Others speak? (No)', 'Polite? (No)'], definition: 'To talk too much and prevent others from speaking.' },
];

export const LESSON_PLAN: LessonStage[] = [
  {
    id: 'stage-1',
    title: 'Lead-in: Cringe Detector',
    duration: 5,
    type: 'lead-in',
    content: {
      description: 'Look at the pictures. Identify the awkward moment.',
      instructions: 'Pick ONE picture and say what the misunderstanding is.',
      icqs: ['One picture or all? (One)', 'Writing? (No)', 'Explain why? (Yes)'],
    }
  },
  {
    id: 'stage-2',
    title: 'Vibe Cards: Lexis Sorting',
    duration: 10,
    type: 'vocabulary',
    content: {
      description: 'Sort the phrases into Green (Do it), Yellow (Careful), Red (Avoid).',
      instructions: 'Drag the cards to the correct zone.',
      icqs: ['How many columns? (3)', 'Green good or bad? (Good)'],
    }
  },
  {
    id: 'stage-3',
    title: 'Grammar Focus: Question Types',
    duration: 20,
    type: 'grammar',
    content: {
      description: 'Learn the rules for Subject, Indirect, and Preposition questions.',
      instructions: 'Analyze the sentence structures on the board.',
      icqs: ['Are we learning rules? (Yes)', 'Do subject questions need "do"? (No)'],
    }
  },
  {
    id: 'stage-4',
    title: 'Task: Cross-Cultural Survival Quest',
    duration: 25,
    type: 'task',
    content: {
      description: 'Complete the survival missions using 4 Green Phrases + 1 Indirect Q + 1 Prep Q.',
      instructions: 'Roleplay: Airport -> New Class -> Café.',
      icqs: ['How many missions? (3)', 'Reading from a book? (No)'],
    }
  },
  {
    id: 'stage-5',
    title: 'Exit Ticket',
    duration: 1,
    type: 'feedback',
    content: {
      description: 'Reflect on the lesson.',
      instructions: 'Write 2 lines: what you will use and your best question type.',
      icqs: ['Two lines? (Yes)', 'Essay? (No)'],
    }
  }
];

export const BOARD_PLAN_LAYOUT = {
  left: { title: 'LEXIS: "Vibe Cards"', color: 'text-emerald-500' },
  middle: { title: 'GRAMMAR: Q TYPES', color: 'text-blue-500' },
  right: { title: 'EC: Upgrade Zone', color: 'text-purple-500' }
};

export const SPEAKING_QUESTIONS = [
    "Who comments on your posts the most?",
    "Do you know why some people are obsessed with TikTok?",
    "What are you listening to on Spotify right now?",
    "Who usually sends the funniest memes in your group chat?",
    "Do you think it's rude to leave someone on 'read'?",
    "What app do you spend the most time on?",
    "Who has the best aesthetic on Instagram?",
    "Do you know if your parents check your phone history?",
    "What are you stressing about regarding your online reputation?",
    "Who taught you how to edit videos?",
    "Do you know where the best place to take selfies is?",
    "What are you waiting for before you post a new photo?",
    "Who unfollowed you recently (if anyone)?",
    "Do you know if it's possible to live without a smartphone today?",
    "What video game are you addicted to lately?",
    "Who plays video games better: you or your best friend?",
    "Do you know why ‘ghosting’ has become so common?",
    "What are you looking for in a gaming partner?",
    "Who usually dominates the conversation in your group chat?",
    "Do you think influencers actually make a good impression?",
];

// --- KAHOOT QUIZ DATA GENERATION ---

// Define distinct categories to mix and match
const QUESTION_BANK = {
  // Category 1: Subject Questions (Who called you?)
  subject_q: [
    { q: "Subject Q: Who ___ (call) you?", correct: "called", distractors: ["did call", "does call", "calling"] },
    { q: "Subject Q: What ___ (happen) next?", correct: "happened", distractors: ["did happen", "does happen", "happening"] },
    { q: "Subject Q: Who ___ (break) the vase?", correct: "broke", distractors: ["did break", "did broke", "broken"] },
    { q: "Subject Q: Which car ___ (cost) more?", correct: "cost", distractors: ["did cost", "does cost", "costed"] },
    { q: "Subject Q: Who ___ (want) ice cream?", correct: "wants", distractors: ["does want", "do want", "wanting"] },
    { q: "Subject Q: What ___ (fall) off the shelf?", correct: "fell", distractors: ["did fall", "fall", "fallen"] },
  ],
  
  // Category 2: Indirect Questions (Do you know where...)
  indirect_q: [
    { q: "Indirect: 'Where is he?'", correct: "Do you know where he is?", distractors: ["Do you know where is he?", "Where he is?", "Do you know where is?"] },
    { q: "Indirect: 'Why did she leave?'", correct: "Can you tell me why she left?", distractors: ["Can you tell me why did she leave?", "Can you tell me why she did leave?", "Why she left?"] },
    { q: "Indirect: 'What time does it start?'", correct: "Do you know what time it starts?", distractors: ["Do you know what time does it start?", "Do you know what time starts it?", "What time starts?"] },
    { q: "Indirect: 'Who is that?'", correct: "I wonder who that is.", distractors: ["I wonder who is that.", "I wonder who is.", "Who is that I wonder."] },
    { q: "Indirect: 'Did he call?'", correct: "Do you know if he called?", distractors: ["Do you know did he call?", "Do you know if he call?", "Do you know he called?"] },
    { q: "Indirect: 'How much is it?'", correct: "Could you tell me how much it is?", distractors: ["Could you tell me how much is it?", "How much it is?", "Tell me how much is."] },
  ],

  // Category 3: Prepositions (Who ... for?)
  prep_q: [
    { q: "Fix: 'About what are you thinking?'", correct: "What are you thinking about?", distractors: ["What about you thinking?", "Thinking about what are you?", "About what you think?"] },
    { q: "Fix: 'For who are you waiting?'", correct: "Who are you waiting for?", distractors: ["Who you waiting for?", "For who you wait?", "Who for you waiting?"] },
    { q: "Fix: 'To where are you going?'", correct: "Where are you going (to)?", distractors: ["Where going you to?", "To where you going?", "Where you go?"] },
    { q: "Complete: Who are you listening ___?", correct: "to", distractors: ["at", "on", "for"] },
    { q: "Complete: What are you afraid ___?", correct: "of", distractors: ["by", "on", "at"] },
    { q: "Complete: Who does this belong ___?", correct: "to", distractors: ["at", "with", "for"] },
  ],

  // Category 4: Vocab & Idioms
  vocab: [
    { q: "Meaning: 'Hit it off'", correct: "Like each other immediately", distractors: ["Hit someone", "Leave quickly", "Argue loudly"] },
    { q: "Meaning: 'Put your foot in it'", correct: "Say something embarrassing", distractors: ["Step in mud", "Walk fast", "Kick a ball"] },
    { q: "Meaning: 'Row'", correct: "Noisy argument", distractors: ["Boat trip", "Line of people", "Friendly chat"] },
    { q: "Meaning: 'See eye to eye'", correct: "Agree with someone", distractors: ["Stare contest", "Wear glasses", "Disagree"] },
    { q: "Meaning: 'Cold shoulder'", correct: "Ignore someone", distractors: ["Frozen arm", "Winter coat", "Friendly hug"] },
    { q: "Meaning: 'Spill the tea'", correct: "Gossip / Tell the truth", distractors: ["Make a mess", "Drink tea", "Cook dinner"] },
  ],

  // Category 5: Social Scenarios (Pragmatics)
  social: [
    { q: "Rude or Polite: Checking phone while listening", correct: "Rude", distractors: ["Polite", "Normal", "Professional"] },
    { q: "Rude or Polite: Asking someone's salary immediately", correct: "Rude", distractors: ["Polite", "Friendly", "Standard"] },
    { q: "Rude or Polite: Remembering someone's name", correct: "Polite", distractors: ["Rude", "Creepy", "Unnecessary"] },
    { q: "Best response: 'I failed my test.'", correct: "Oh no, I'm sorry to hear that.", distractors: ["Haha, loser.", "Did you study?", "I passed mine."] },
    { q: "Best response: 'I just got promoted!'", correct: "Congratulations! That's amazing!", distractors: ["About time.", "How much money?", "Okay."] },
  ],

  // Category 6: Slang (Gen Z)
  slang: [
    { q: "Slang: 'No Cap'", correct: "No lie / For real", distractors: ["No hat", "Quiet", "Stop talking"] },
    { q: "Slang: 'Ghosting'", correct: "Ignoring messages suddenly", distractors: ["Scaring people", "Dying", "Being pale"] },
    { q: "Slang: 'Simp'", correct: "Overly desperate for attention", distractors: ["Simple person", "Simpson character", "Smart person"] },
    { q: "Slang: 'Rent free'", correct: "Stuck in your head", distractors: ["Free house", "No money", "Homeless"] },
    { q: "Slang: 'Rizz'", correct: "Charisma / Flirting skill", distractors: ["Rice", "Resting", "Rising up"] },
    { q: "Slang: 'Sus'", correct: "Suspicious", distractors: ["Sustainable", "Sussudio", "Success"] },
    { q: "Slang: 'Bet'", correct: "Yes / Agreed", distractors: ["Gambling", "No way", "Maybe"] },
  ]
};

// Helper to mix categories
const getRandomQuestions = (count: number, categories: (keyof typeof QUESTION_BANK)[]) => {
    let pool: any[] = [];
    categories.forEach(cat => {
        if (QUESTION_BANK[cat]) {
            pool = [...pool, ...QUESTION_BANK[cat]];
        }
    });
    
    if (pool.length === 0) return []; // Safety check

    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    return pool.slice(0, count);
};

// Helper to shuffle options inside a question
const processQuestion = (template: any, id: string, timeMod: number = 0): QuizQuestion => {
    const allOptions = [template.correct, ...template.distractors];
    // Fisher-Yates shuffle for options
    for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    const correctIndex = allOptions.indexOf(template.correct);
    const isIndirect = template.q.includes("Indirect");
    const isReading = template.q.length > 50;
    
    return {
        id,
        text: template.q,
        options: allOptions,
        correctIndex,
        timeLimit: Math.max(5, (isIndirect || isReading ? 20 : 10) + timeMod), // Ensure at least 5 seconds
        isDoublePoints: Math.random() > 0.85
    };
};

export const GAME_LEVELS: GameLevel[] = [];

// GENERATE 30 UNIQUE LEVELS
for (let i = 1; i <= 30; i++) {
    let title = `Level ${i}`;
    let difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE' = 'EASY';
    let cats: (keyof typeof QUESTION_BANK)[] = [];
    let xp = 100 + (i * 10);
    
    // Design the Level Curve
    if (i <= 5) {
        title = `Novice Basics ${i}`;
        difficulty = 'EASY';
        cats = ['subject_q', 'social', 'vocab'];
    } else if (i <= 10) {
        title = `Slang & Grammar ${i}`;
        difficulty = 'MEDIUM';
        cats = ['slang', 'prep_q', 'social'];
    } else if (i <= 15) {
        title = `Indirect Master ${i}`;
        difficulty = 'MEDIUM';
        cats = ['indirect_q', 'vocab'];
    } else if (i <= 20) {
        title = `Grammar Gauntlet ${i}`;
        difficulty = 'HARD';
        cats = ['indirect_q', 'subject_q', 'prep_q'];
    } else if (i <= 25) {
        title = `Expert Mix ${i}`;
        difficulty = 'HARD';
        cats = ['vocab', 'slang', 'indirect_q', 'social'];
    } else {
        title = `Grandmaster Final ${i}`;
        difficulty = 'INSANE';
        cats = ['subject_q', 'indirect_q', 'prep_q', 'vocab', 'social', 'slang'];
    }

    const templates = getRandomQuestions(15, cats);
    const questions = templates.map((t, idx) => processQuestion(t, `l${i}-q${idx}`, difficulty === 'INSANE' ? -5 : 0));

    if (questions.length > 0) {
        GAME_LEVELS.push({
            id: `kahoot-${i}`,
            number: i,
            title,
            type: 'KAHOOT',
            difficulty,
            description: `${difficulty} difficulty. ${cats.join(', ')}`,
            data: { questions },
            xpReward: xp
        });
    }
}

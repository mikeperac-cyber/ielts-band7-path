import { Lesson } from "./types";

export const week2day4: Lesson = {
  id: "week-2-day-4",
  day: "Day 4",
  title: "Listening + Reading (Band 9 Mastery): Prediction, Distractors, and Evidence",
  duration: "90–120 min",
  topic: "Quantum Computing",
  audioLabel: "Expert Panel Discussion · 12 min practice",
  questions: [
    "1. What is the primary challenge associated with quantum error correction as discussed by Prof. X?",
    "2. According to Dr. Y, what are the potential applications of quantum computing in healthcare?",
    "3. What does the Moderator mention as a common misconception about quantum computers?",
    "4. How does Prof. X suggest that quantum computing could impact traditional encryption methods?",
    "5. During the debate, what evidence does Dr. Y present to support the economic benefits of quantum technology?",
    "6. What future scenario does the Moderator propose regarding societal changes due to quantum advancements?"
],
  phrases: [
    {
        "phrase": "exponential leap",
        "use": "To describe a rapid and significant improvement in technology or knowledge."
    },
    {
        "phrase": "paradigm shift",
        "use": "When discussing a fundamental change in approach or underlying assumptions in a field or discipline."
    },
    {
        "phrase": "catalyst for change",
        "use": "To refer to something that causes significant transformation or advancement."
    }
],
  review: {
    answers: [
    "1. The primary challenge is maintaining coherence in quantum states due to environmental interference.",
    "2. Quantum computing could enable advanced diagnostics and personalized treatment approaches in healthcare.",
    "3. The common misconception is that quantum computers will replace classical computers entirely.",
    "4. Prof. X suggests that quantum computing could render current encryption methods obsolete, making data more vulnerable.",
    "5. Dr. Y presents case studies showing increased productivity in industries leveraging quantum technology.",
    "6. The Moderator proposes that societal roles in technology development may evolve as quantum computing becomes mainstream."
],
    transcript: "Moderator: Welcome to today’s panel on the future of quantum computing. We have with us leading experts in the field, Prof. X and Dr. Y. Let’s dive right in. Prof. X, could you elaborate on the challenges of quantum error correction?\n\nProf. X: Absolutely. The primary challenge lies in maintaining coherence in quantum states. Environmental factors can easily interfere, leading to errors that are notoriously difficult to correct. This remains a significant barrier to reliable quantum computing.\n\nDr. Y: I’d like to add that despite this, the potential applications in healthcare are exceedingly promising. For example, quantum computing could revolutionize diagnostics and enable highly personalized treatment approaches by analyzing vast amounts of data in real-time.\n\nModerator: Fascinating insights! But there’s a common misconception that I frequently encounter: many people believe that quantum computers will entirely replace classical computers. Prof. X, do you share that sentiment?\n\nProf. X: Not at all. While quantum computers will excel in specific tasks, classical computers will still play an essential role in everyday applications.\n\nDr. Y: Yes, and let’s discuss encryption for a moment. With advancements in quantum computing, we might soon see traditional encryption methods rendered obsolete. This raises substantial security concerns.\n\nModerator: That’s a crucial point. What evidence do you have regarding the economic benefits of quantum technology, Dr. Y?\n\nDr. Y: I've seen case studies where companies integrating quantum computing are experiencing significant productivity boosts, which could lead to job creation in emerging sectors.\n\nModerator: Lastly, I envision a future where societal roles in technology development evolve dramatically as quantum computing becomes mainstream. How do you foresee this transformation?\n\nProf. X: It’s a catalyst for change, affecting not just technology but also how we approach various global challenges."
  }
};

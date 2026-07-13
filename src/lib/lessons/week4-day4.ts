import { Lesson } from "./types";

export const week4day4: Lesson = {
  id: "week-4-day-4",
  day: "Day 4",
  title: "Listening + Reading (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing and Cryptography",
  audioLabel: "Intensive Academic Discussion · 10 min practice",
  questions: [
    "1. Quantum computers utilize qubits instead of traditional bits due to their ability to _______.",
    "2. One significant advantage of quantum encryption is that it offers ____ security against eavesdropping.",
    "3. The concept of superposition allows quantum systems to exist in ______ states concurrently.",
    "4. A major distractor in the field is the misconception that quantum computers will easily solve all ______ problems.",
    "5. The speaker mentions a theoretical framework called 'quantum supremacy' which refers to _______.",
    "6. According to Dr. Y, one of the biggest challenges in quantum computing is maintaining ______ coherence. "
],
  phrases: [
    {
        "phrase": "beyond the horizon",
        "use": "to refer to concepts or technologies that are currently unexplored but hold potential for future advancements."
    },
    {
        "phrase": "a double-edged sword",
        "use": "to describe a situation that has both positive and negative consequences."
    },
    {
        "phrase": "to bridge the gap",
        "use": "to mean connecting two different ideas or fields, especially in tackling complex interdisciplinary challenges."
    }
],
  review: {
    answers: [
    "1. exist in multiple",
    "2. unbreakable",
    "3. multiple",
    "4. computational",
    "5. the point at which quantum computers outperform classical computers",
    "6. quantum"
],
    transcript: "Moderator: Welcome to today’s discussion on the fascinating intersection of quantum computing and cryptography. Let’s dive right in. Professor X, can you explain why quantum computers utilize qubits instead of traditional bits? \n\nProf. X: Absolutely. Quantum computers are built on the principles of quantum mechanics, which allows qubits to exist in multiple states simultaneously. This ability to operate on numerous possibilities at once significantly amplifies their computational power.\n\nDr. Y: Exactly. This is where the concept of superposition comes into play. Unlike classical bits, which are either 0 or 1, qubits can be both at the same time, opening up unprecedented capabilities in processing information.\n\nModerator: That sounds incredibly powerful. But what about security? How does quantum encryption enhance it over classical methods? \n\nProf. X: One significant advantage of quantum encryption is that it provides virtually unbreakable security against eavesdropping. The very act of measuring qubits changes their state, immediately revealing any attempts to intercept the data.\n\nDr. Y: However, we must be cautious. It’s also a double-edged sword because this technology brings about new types of vulnerabilities that we haven’t fully understood yet.\n\nModerator: Fascinating! There’s also talk about 'quantum supremacy.' What does that mean in practical terms? \n\nProf. X: Quantum supremacy refers to the moment when a quantum computer performs a calculation that is infeasible for classical computers. It marks a groundbreaking achievement in the field.\n\nDr. Y: Yet, despite these advancements, a major challenge remains—maintaining quantum coherence. The qubits are extremely delicate, and any environmental interference can lead to a loss of information.\n\nModerator: Thank you for those insights. This dialogue illustrates how far we have come in our understanding of quantum computing yet highlights the many challenges that lie ahead."
  }
};

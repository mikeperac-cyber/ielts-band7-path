import { Lesson } from "./types";

export const week1day4: Lesson = {
  id: "week-1-day-4",
  day: "Day 4",
  title: "Listening + Reading (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing",
  audioLabel: "Advanced Debate \u0000 12 min practice",
  questions: [
    "Quantum computing holds the potential to solve __________ problems much faster than classical computers can.",
    "One of the primary challenges in quantum computing is __________ due to quantum entanglement.",
    "The panel agrees that a key advantage of quantum computing is its ability to handle __________ data sets efficiently.",
    "Prof. X highlights that current classical encryption methods may become __________ in the era of quantum computing.",
    "Dr. Y argues that public awareness about quantum computing is still __________, hindering its adoption.",
    "The speakers predict that within the next decade, quantum computing could revolutionize __________ industries."
],
  phrases: [
    {
        "phrase": "exponentially complex",
        "use": "Use this phrase when discussing phenomena that grow extremely fast and become intricate."
    },
    {
        "phrase": "paradigm shift",
        "use": "This phrase describes a fundamental change in approach or underlying assumptions."
    },
    {
        "phrase": "cognitive dissonance",
        "use": "Employ when referring to the mental discomfort experienced from holding conflicting beliefs, especially in technological debates."
    }
],
  review: {
    answers: [
    "NP-complete",
    "error correction",
    "large-scale",
    "obsolete",
    "limited",
    "various"
],
    transcript: "Moderator: Welcome to today’s debate on the future of quantum computing. We have a distinguished panel of experts to delve into this rapidly evolving field.\n\nProf. X: Thank you, Moderator. To kick off, let’s understand that quantum computing holds the potential to solve NP-complete problems exponentially faster than classical computers can, which opens doors to previously unsolvable issues.\n\nDr. Y: I completely agree, Prof. X, but we must address the primary challenges we face. Quantum error correction is particularly problematic due to phenomena like quantum entanglement, which makes traditional methods ineffective.\n\nProf. Z: That’s a great point, Dr. Y. Additionally, the key advantage of quantum computing lies in its ability to handle extraordinarily large datasets efficiently, something that is increasingly crucial as we generate vast amounts of information daily.\n\nModerator: Interesting perspectives. However, we cannot ignore the risks involved. Prof. X, can you elaborate on how this technology might impact security?\n\nProf. X: Certainly. The panel believes that current classical encryption methods may soon become obsolete in the era of quantum computing, posing significant risks to data security.\n\nDr. Y: However, there’s also a communication gap. Public awareness about quantum computing is still quite limited, hindering its adoption on a larger scale. We must do our part to educate the masses.\n\nProf. Z: Precisely, Dr. Y. As we look forward, the speakers predict that within the next decade, quantum computing will revolutionize various industries, from pharmaceuticals to finance, but public understanding is crucial for this revolution."
  }
};

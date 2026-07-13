import { Lesson } from "./types";

export const week9day1: Lesson = {
  id: "week-9-day-1",
  day: "Day 1",
  title: "Listening + Speaking (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing",
  audioLabel: "Sophisticated Debate on Quantum Computing Applications · 12 min",
  questions: [
    "What does Prof. X identify as the primary challenge in current quantum computing technology?",
    "According to Dr. Y, how does quantum computing differ fundamentally from classical computing?",
    "What potential application of quantum computing is suggested by Moderator?",
    "How does Prof. X characterize the role of superposition in quantum algorithms?",
    "What ethical considerations does Dr. Y raise regarding the widespread use of quantum computing?",
    "Which industries does Prof. X mention as potential early adopters of quantum computing technology?"
],
  phrases: [
    {
        "phrase": "paradigm shift",
        "use": "To describe a fundamental change in approach or underlying assumptions."
    },
    {
        "phrase": "exponential growth",
        "use": "To highlight rapid, significant increases, often used in technological advancements."
    },
    {
        "phrase": "cognitive leap",
        "use": "To indicate a significant advancement in understanding or capability, often applied to complex ideas."
    }
],
  review: {
    answers: [
    "The primary challenge identified by Prof. X is error correction in quantum bits that inhibit scalability.",
    "Dr. Y explains that quantum computing utilizes qubits that can exist in multiple states simultaneously, unlike classical bits that are binary.",
    "The Moderator suggests potential applications like cryptography and drug discovery for quantum computing.",
    "Prof. X characterizes superposition as crucial for enabling quantum algorithms to run multiple calculations at once, leading to faster problem-solving.",
    "Dr. Y raises concerns about data security and ethical implications of quantum capabilities that could outpace current regulations.",
    "Prof. X mentions industries such as pharmaceuticals and finance as potential early adopters."
],
    transcript: "Moderator: Welcome to today’s discussion on the breakthrough developments in quantum computing. Let's start with you, Prof. X. What do you see as the current primary challenges?\n\nProf. X: Thank you, Moderator. The primary challenge lies in quantum error correction. Unlike classical bits, qubits are highly susceptible to environmental noise, which can lead to decoherence. This instability significantly hampers large-scale quantum computing, affecting the technology’s scalability.\n\nDr. Y: I would like to add that the fundamental difference between quantum and classical computing is rooted in the mechanics of information processing. Classical computing relies on binary bits, which are persistent and deterministic. On the other hand, qubits can exist in superpositions of states—a phenomenon that exponentially amplifies computational power.\n\nModerator: That’s a fascinating point, Dr. Y. Prof. X, could you elaborate on the applications of this technology?\n\nProf. X: Certainly. The potential applications are vast, particularly in fields like cryptography, where quantum entanglement can enable virtually unbreakable codes. Additionally, areas such as drug discovery could benefit tremendously from the ability to model molecular interactions at unprecedented speeds.\n\nDr. Y: However, it’s essential to acknowledge the ethical implications of deploying such power. With quantum capabilities, we face questions of data security. Who will regulate and manage this technology, especially if it falls into the wrong hands?\n\nProf. X: Absolutely, Dr. Y. We also need to consider industries ready to embrace these advancements; finance and pharmaceuticals stand out as potential early adopters given their data-driven nature. We are indeed on the brink of a paradigm shift in how we think about computation."
  }
};

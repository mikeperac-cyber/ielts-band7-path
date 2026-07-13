import { Lesson } from "./types";

export const week7day7: Lesson = {
  id: "week-7-day-7",
  day: "Day 7",
  title: "Listening + Reading (Band 9 Mastery)",
  duration: "2 h 45 min",
  topic: "Quantum Computing: Implications for Modern Cryptography",
  audioLabel: "Detailed Debate on Technology \u0000· 10 min practice",
  questions: [
    "Quantum computing poses challenges for which traditional aspect of security?",
    "What is the significance of superposition in quantum processing?",
    "Experts suggest that quantum encryption might lead to what future developments?",
    "Which algorithm is mentioned as being vulnerable to quantum attacks?",
    "What is the consensus among researchers about the timeline for widespread quantum computing adoption?",
    "How might quantum technology change data transactions in the next decade?"
],
  phrases: [
    {
        "phrase": "Disruptive innovation",
        "use": "Use when discussing technologies that significantly alter industries or market dynamics."
    },
    {
        "phrase": "Paradigm shift",
        "use": "Use when referring to fundamental changes in approach or underlying assumptions."
    },
    {
        "phrase": "At the forefront of research",
        "use": "To describe leading-edge work in a specific field."
    }
],
  review: {
    answers: [
    "It undermines traditional encryption methods.",
    "It allows quantum bits to exist in multiple states simultaneously for faster processing.",
    "Advancements in secure communications and previously unattainable computational powers.",
    "Shor's algorithm.",
    "Within the next 10 to 20 years, researchers predict.",
    "It is expected to enhance speed and security, revolutionizing transactions."
],
    transcript: "Moderator: Welcome to our debate on quantum computing and its implications for modern cryptography. To start, Prof. X, could you elaborate on the primary concerns quantum computers present for current encryption protocols?\n\nProf. X: Certainly. Quantum computing fundamentally disrupts traditional notions of security. Specifically, it poses significant challenges to public-key encryption, which relies on the fundamental difficulty of factoring large numbers.\n\nDr. Y: Absolutely, Prof. X. Additionally, the concept of superposition in quantum computing enables qubits to operate in multiple states at once, vastly increasing processing power. This characteristic has profound implications for how we process information.\n\nModerator: Interesting point! What future developments do you foresee in secure communications as quantum encryption matures?\n\nDr. Y: I believe we are on the brink of a paradigm shift. As quantum encryption protocols become more robust, we could see entirely new forms of secure communication that were previously impossible.\n\nProf. X: That's a crucial point, Dr. Y. However, we must also remain vigilant. For instance, Shor's algorithm creates vulnerabilities by efficiently solving mathematical problems that underpin current encryption methods.\n\nModerator: What about the timeline? When do you think quantum computing will be adopted widely?\n\nProf. X: While advancements are rapid, the consensus is that it will take at least another decade, possibly 10 to 20 years, for us to see widespread application.\n\nDr. Y: Agreed. Moreover, as we consider the implications of quantum technology, it is essential to note that it is poised to be at the forefront of research in cryptography and data transactions, significantly enhancing both speed and security."
  }
};

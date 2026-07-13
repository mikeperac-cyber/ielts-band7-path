import { Lesson } from "./types";

export const week4day3: Lesson = {
  id: "week-4-day-3",
  day: "Day 3",
  title: "Listening + Reading (Band 9 Mastery)",
  duration: "2 h 45 min",
  topic: "Quantum Computing in Modern Technology",
  audioLabel: "High-Level Academic Debate · 10 min Practice",
  questions: [
    "What is the primary advantage of quantum computing as discussed by Prof. X?",
    "How does Dr. Y counter Prof. X's argument regarding the energy consumption of quantum computers?",
    "According to the debate, what is one potential application of quantum computing mentioned by the speakers?",
    "What concerns does Prof. X raise about the ethical implications of quantum technology?",
    "How does the Moderator summarize the main points at the end of the discussion?",
    "What does Dr. Y suggest as a solution to the current limitations of quantum computing?"
],
  phrases: [
    {
        "phrase": "Paradigm shift",
        "use": "To describe a fundamental change in approach or underlying assumptions."
    },
    {
        "phrase": "Treading on thin ice",
        "use": "To indicate that a situation is risky or precarious."
    },
    {
        "phrase": "Cutting-edge technology",
        "use": "To refer to the most advanced technology available."
    }
],
  review: {
    answers: [
    "The primary advantage is the speed of computation due to quantum superposition and entanglement.",
    "Dr. Y argues that quantum computers could potentially consume more energy than classical ones, making them less efficient.",
    "One potential application is in cryptography, where quantum computers could vastly improve security.",
    "Prof. X raises concerns about data privacy and surveillance related to quantum technology.",
    "The Moderator summarizes by stating that the conversation highlighted both the potential and the pitfalls of quantum computing.",
    "Dr. Y suggests increased investment in research to address the current limitations."
],
    transcript: "Moderator: Welcome to today’s debate on the implications of quantum computing in modern technology. We have two distinguished speakers: Prof. X, an expert in quantum algorithms, and Dr. Y, a leading researcher in computational ethics.\n\nProf. X: Thank you. The primary advantage of quantum computing lies in its ability to perform calculations at unprecedented speeds. Utilizing principles like superposition and entanglement, quantum computers can simultaneously process a multitude of inputs, fundamentally changing the landscape of computing.\n\nDr. Y: While I acknowledge that argument, we cannot overlook the potential downsides. Quantum computers may consume significantly more energy compared to traditional computers when integrated into large-scale systems. Thus, questioning their efficiency in practical applications is essential.\n\nModerator: Interesting point, Dr. Y. Prof. X, would you care to respond?\n\nProf. X: Certainly! The efficiency debate is valid, yet the transformative applications in fields like cryptography are compelling. Quantum computers could render current encryption methods obsolete, enhancing security exponentially.\n\nDr. Y: True, but with great power comes great responsibility. The ethical implications of such technology are vast. For instance, the capacity to decode encrypted communications poses severe risks to privacy. Are we ready for a world that treads on thin ice with such capabilities?\n\nModerator: Let’s pivot back to the applications. Prof. X, could you elaborate on a specific real-world instance?\n\nProf. X: Absolutely. One application we’re exploring is in drug discovery, where quantum algorithms can simulate molecular interactions with extraordinary accuracy.\n\nDr. Y: However, we must first solve current technological limitations. I advocate for increased funding directed toward research to ensure that we harness this cutting-edge technology responsibly.\n\nModerator: Thank you, Prof. X and Dr. Y, for such thought-provoking insights. It seems clear that while quantum computing holds remarkable potential, it also presents ethical quandaries that we must navigate thoughtfully."
  }
};

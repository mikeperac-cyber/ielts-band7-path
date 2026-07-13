import { Lesson } from "./types";

export const week8day3: Lesson = {
  id: "week-8-day-3",
  day: "Day 3",
  title: "Integrated Exam Pressure Performance Check (Band 9 Mastery)",
  duration: "2 h 45 min",
  topic: "Quantum Computing and Its Implications",
  audioLabel: "Intensive Academic Discussion · 12 min practice",
  questions: [
    "1. What are the two primary characteristics that differentiate quantum computing from classical computing?",
    "2. How does the concept of superposition enhance computational capabilities?",
    "3. What potential applications of quantum computing are mentioned in the discussion?",
    "4. Why is quantum decoherence considered a significant challenge in developing practical quantum computers?",
    "5. How might quantum computing impact sectors such as cryptography and pharmaceuticals, according to the speakers?",
    "6. What is the overall tone of the debate regarding the future trajectory of quantum technology?"
],
  phrases: [
    {
        "phrase": "quantum entanglement",
        "use": "Used to describe the complex correlation between particles that distinguishes quantum mechanics from classical physics."
    },
    {
        "phrase": "exponentially greater efficiency",
        "use": "Refers to the dramatic increase in computational processing power of quantum systems compared to traditional systems."
    },
    {
        "phrase": "intractable problems",
        "use": "Describes problems that are challenging to solve using conventional computing methods but may be addressed by quantum solutions."
    }
],
  review: {
    answers: [
    "1. Superposition and quantum entanglement.",
    "2. It allows quantum systems to exist in multiple states simultaneously, vastly increasing processing power.",
    "3. The speakers mention applications in cryptography, drug discovery, and optimization problems.",
    "4. Quantum decoherence undermines the stability of qubits, making it difficult to maintain quantum states.",
    "5. Quantum computing could render current encryption methods obsolete and accelerate drug discovery processes.",
    "6. The tone is cautiously optimistic, recognizing both the potential and the hurdles ahead."
],
    transcript: "Moderator: Good evening, and welcome to today’s discussion on the implications of quantum computing. With us are Dr. Y, a prominent physicist, and Prof. X, an expert in computational models.\n\nDr. Y: Thank you. To begin, it’s crucial to delineate the two primary characteristics that differentiate quantum computing from classical computing: superposition and quantum entanglement. These principles allow quantum systems to outperform classical counterparts significantly.\n\nProf. X: Precisely, Dr. Y. Superposition enables qubits to exist in multiple states at once, which exponentially increases computational efficiency. While classical bits are either 0 or 1, qubits can embody both simultaneously, thus enhancing processing capabilities for complex tasks.\n\nModerator: And what about the concept of quantum entanglement?\n\nDr. Y: Quantum entanglement refers to the interconnectedness of qubits. When they become entangled, the state of one qubit can depend on the state of another, regardless of the distance separating them, creating extraordinary correlations that classical systems cannot replicate.\n\nProf. X: Interestingly, these properties lead to potential applications in several fields. For instance, in pharmaceuticals, quantum computing could revolutionize drug discovery by simulating molecular interactions with unprecedented accuracy.\n\nModerator: That raises an important point. Are there challenges we should consider?\n\nDr. Y: Absolutely. A significant challenge is quantum decoherence, which occurs when qubits lose their quantum state due to interactions with the environment. This phenomenon can undermine the reliability of quantum computations.\n\nProf. X: Moreover, we must acknowledge the ramifications for cybersecurity. Quantum computing might render today’s encryption methods obsolete, necessitating an overhaul of how we protect sensitive data.\n\nModerator: It seems we’re at a crossroads, balancing the prospects against the inherent challenges. What’s your perspective on the future of quantum technology, Prof. X?\n\nProf. X: I am cautiously optimistic. The potential to solve previously intractable problems is phenomenal, but we should approach with a sense of responsibility and preparedness for the hurdles ahead."
  }
};

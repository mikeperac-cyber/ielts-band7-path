import { Lesson } from "./types";

export const week4day1: Lesson = {
  id: "week-4-day-1",
  day: "Day 1",
  title: "Listening + Speaking (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing and Its Future Implications",
  audioLabel: "Expert Panel Discussion · 10 min practice",
  questions: [
    "What is the principal challenge in scaling quantum computers?",
    "How does quantum entanglement contribute to computational power?",
    "According to Dr. Y, what industries might benefit most from quantum advancements?",
    "What ethical concerns are raised by Prof. X regarding quantum technology?",
    "What analogy does the Moderator use to explain quantum superposition?",
    "How does the panel suggest addressing the potential job displacement caused by quantum automation?"
],
  phrases: [
    {
        "phrase": "Quantum Leap",
        "use": "To signify a significant advancement or breakthrough in technology or knowledge."
    },
    {
        "phrase": "Entangled Realities",
        "use": "Referring to the interconnectedness of various outcomes in quantum mechanics, often used metaphorically in discussions."
    },
    {
        "phrase": "Paradigm Shift",
        "use": "Describing a fundamental change in approach or underlying assumptions, particularly in technology or science."
    }
],
  review: {
    answers: [
    "The principal challenge in scaling quantum computers is maintaining coherence among qubits while reducing errors.",
    "Quantum entanglement allows qubits to be interconnected, thus exponentially increasing computational power compared to classical bits.",
    "Dr. Y suggests that sectors like pharmaceuticals and logistics could greatly benefit from quantum advancements.",
    "Prof. X expresses concerns regarding privacy and security in the context of quantum decryption capabilities.",
    "The Moderator uses a metaphor of a spinning coin to illustrate the concept of quantum superposition, where it represents multiple states at once.",
    "The panel proposes educational initiatives and retraining programs to mitigate job displacement due to automation fueled by quantum technology."
],
    transcript: "Moderator: Welcome to today's discussion on quantum computing and its future implications. We have with us Prof. X, a physicist specializing in quantum technologies, and Dr. Y, an expert in computational ethics. Let’s dive right in. Prof. X, what do you believe is the principal challenge in scaling quantum computers?\n\nProf. X: Thank you. The principal challenge lies in maintaining coherence among qubits, which are the fundamental units of quantum information. As we scale up these systems, we encounter significant error rates, which complicate computational tasks.\n\nDr. Y: Absolutely, and this issue is exacerbated by the fact that any attempt to measure a qubit can disturb its state, which leads to errors.\n\nModerator: That leads us to the concept of quantum entanglement. Dr. Y, could you elaborate on its role in enhancing computational power?\n\nDr. Y: Certainly. Quantum entanglement allows qubits that are entangled to affect one another instantaneously, regardless of distance. This phenomenon exponentially increases the potential for faster computations compared to classical bits, which rely on binary states.\n\nProf. X: However, while the potential is immense, it raises ethical concerns as well. The ability to decrypt information from seemingly secure sources is worrisome.\n\nModerator: Very true. What specific industries do you think might benefit most from advancements in quantum technology, Dr. Y?\n\nDr. Y: I would argue that sectors like pharmaceuticals and logistics could see the most benefit, enabling them to solve complex problems more efficiently.\n\nProf. X: And let’s not forget the economic implications, as this could spark a significant paradigm shift in how we view processing power.\n\nModerator: Exactly, but with all these advancements, there are also ramifications such as potential job displacements. How should we address this?\n\nProf. X: Education is key. We will need retraining programs to help workers transition into new roles that this technology creates, or even to augment their existing skills."
  }
};

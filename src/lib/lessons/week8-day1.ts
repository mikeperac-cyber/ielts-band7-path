import { Lesson } from "./types";

export const week8day1: Lesson = {
  id: "week-8-day-1",
  day: "Day 1",
  title: "Listening + Speaking (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing: The Future of Technology",
  audioLabel: "Expert Panel Discussion · 15 min",
  questions: [
    "Quantum computing fundamentally alters how we process information. Explain the main principle behind this technology.",
    "What is the predicted timeline for widespread implementation of quantum computers, according to Prof. X?",
    "Dr. Y discusses potential applications in cybersecurity. What is one major concern he raises?",
    "Moderator: What technological limitations does Prof. X state regarding classical computers? Summarize his point.",
    "According to the discussion, how does quantum entanglement contribute to computational power?",
    "Why does Dr. Y emphasize the necessity for ethical guidelines in quantum computing?"
],
  phrases: [
    {
        "phrase": "The crux of the matter",
        "use": "To highlight the most important point in a discussion or argument."
    },
    {
        "phrase": "Radical paradigm shift",
        "use": "To describe a fundamental change in approach or underlying assumptions."
    },
    {
        "phrase": "Navigating uncharted waters",
        "use": "To refer to dealing with new, unknown situations or challenges."
    }
],
  review: {
    answers: [
    "Quantum computing relies on the principles of quantum mechanics, notably superposition and entanglement, to process information at unprecedented speeds.",
    "Prof. X estimates that we may see widespread implementation within the next 10 to 15 years.",
    "Dr. Y raises concerns about the potential vulnerabilities in existing cybersecurity protocols due to quantum advancements.",
    "Prof. X points out that classical computers struggle with problems that require simultaneous multiple calculations, which quantum computers can solve efficiently.",
    "Quantum entanglement allows qubits to be interconnected, which exponentially increases computational power compared to classical bits.",
    "Dr. Y stresses ethical guidelines are crucial to prevent misuse and to foster responsible development of quantum technology."
],
    transcript: "Moderator: Welcome to today’s expert panel discussion on the future of quantum computing. We're joined by leading experts in the field, Prof. X and Dr. Y. Let’s dive right in. Prof. X, what’s the crux of the matter when it comes to quantum computing?\n\nProf. X: Thank you. The primary principle behind quantum computing is rooted in quantum mechanics, particularly two phenomena: superposition and entanglement. Unlike classical bits which are binary, quantum bits, or qubits, can exist in multiple states at once. This fundamental shift provides exponential computational power.\n\nDr. Y: Absolutely, and looking ahead, there are various applications we can consider—especially in fields like cryptography. However, that brings us to significant concerns. The radical paradigm shift we’re witnessing raises questions about cybersecurity; existing systems may become vulnerable with the advent of quantum encryption capabilities.\n\nModerator: Interesting point, Dr. Y. Prof. X, could you elaborate on the limitations classical computers face?\n\nProf. X: Certainly. Classical computers excel at linear tasks but struggle significantly with problems that require simultaneous complex calculations. Quantum computers can process vast amounts of data simultaneously due to their unique qubit properties.\n\nDr. Y: Right, and also, as we navigate these uncharted waters, it’s crucial to underscore the need for robust regulatory frameworks. Without ethical guidelines, the technological advancements in quantum computing could lead to unanticipated consequences.\n\nModerator: Thank you both for your insights. This has been a riveting discussion on the future of quantum technology."
  }
};

import { Lesson } from "./types";

export const week8day2: Lesson = {
  id: "week-8-day-2",
  day: "Day 2",
  title: "Reading for Evidence + Writing with Control (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing: Paradigms and Implications",
  audioLabel: "In-depth Debate \u001e 20 min practice",
  questions: [
    "Quantum computing differs from classical computing primarily in its use of __________.",
    "One potential application of quantum computing is in __________ problems which are currently intractable.",
    "The debate highlights significant concerns regarding __________ in quantum algorithms.",
    "According to Prof. X, a major challenge in quantum computing is the issue of __________.",
    "Dr. Y suggests that public perception of quantum technology is often skewed due to __________.",
    "The speakers agree that the future workforce will require skills in __________ to adapt to quantum advancements."
],
  phrases: [
    {
        "phrase": "conventional wisdom",
        "use": "Use this phrase when discussing widely accepted beliefs that may be challenged."
    },
    {
        "phrase": "a double-edged sword",
        "use": "Apply this idiom to describe a situation or development that has both positive and negative consequences."
    },
    {
        "phrase": "paradigm shift",
        "use": "Use this phrase to denote a significant change in the way something is understood or approached."
    }
],
  review: {
    answers: [
    "quantum bits (qubits)",
    "optimization",
    "security vulnerabilities",
    "coherence and error rates",
    "media sensationalism",
    "quantum algorithms"
],
    transcript: "Moderator: Welcome to today’s debate on the implications of quantum computing. We have two esteemed guests, Prof. X and Dr. Y. Let’s begin with you, Prof. X. \n\nProf. X: Thank you. Quantum computing represents a monumental leap beyond classical computing, relying on qubits instead of conventional bits. This allows for an exponential increase in computational power, particularly for solving optimization problems that are currently intractable. However, this also raises significant concerns regarding security vulnerabilities, especially as we transition into a quantum era.\n\nDr. Y: Absolutely, Prof. X. While the computational advantages are promising, it's essential to recognize that quantum algorithms are not without their challenges. The intricacies of coherence and error rates present formidable obstacles in realizing practical quantum devices.\n\nModerator: What about public perception, Dr. Y?\n\nDr. Y: That’s an interesting point! The media often sensationalizes advancements in quantum technology, leading to widespread misconceptions about its applicability and timeline. As a result, public understanding is frequently skewed. \n\nProf. X: Yes, and this misrepresentation might affect funding and support for research. We must strive for transparent communication to demystify this technology. This brings us to the necessity of new skill sets; the future workforce will require increased proficiency in quantum algorithms, which embed a new level of complexity into computational education.\n\nDr. Y: It's indeed a double-edged sword. While addressing these educational needs can pave the way for innovation, neglect might exacerbate existing inequalities in the tech sector. A paradigm shift in our educational systems is imperative if we are to leverage the true potential of quantum computing. \n\nModerator: Thank you both for this insightful dialogue.'"
  }
};

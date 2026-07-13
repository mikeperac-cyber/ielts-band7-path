import { Lesson } from "./types";

export const week7day6: Lesson = {
  id: "week-7-day-6",
  day: "Day 6",
  title: "Reading + Writing (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing and Its Societal Implications",
  audioLabel: "Expert Panel Discussion · 10 min Practice",
  questions: [
    "Quantum computing promises to revolutionize which field according to Prof. X?",
    "Dr. Y mentions a potential risk of quantum computing; what is it?",
    "The Moderator states that public understanding of quantum tech is lacking. Why is this significant?",
    "Prof. X cites an example of a modern application of quantum computing. What is it?",
    "According to Dr. Y, how does quantum computing differ fundamentally from classical computing?",
    "What solution does the panel propose to address public misconceptions about quantum computing?"
],
  phrases: [
    {
        "phrase": "a double-edged sword",
        "use": "To describe a situation or development that has both positive and negative consequences."
    },
    {
        "phrase": "the tip of the iceberg",
        "use": "To indicate that what is being discussed is just a small part of a much larger issue."
    },
    {
        "phrase": "to pave the way for",
        "use": "To create a situation that makes something possible or easier to achieve."
    }
],
  review: {
    answers: [
    "Cryptography and data security.",
    "It could exacerbate inequality in tech access.",
    "It may hinder proper policy-making and education.",
    "Optimization in logistics and quantum simulations.",
    "Quantum computing leverages qubits rather than bits.",
    "They suggest educational initiatives and public outreach."
],
    transcript: "Moderator: Welcome to today’s panel discussion on the transformative capabilities of quantum computing and its societal implications. We are joined by Dr. Y, an expert in quantum algorithms, and Prof. X, who specializes in quantum cryptography.\n\nProf. X: Thank you. To begin, I’d like to assert that quantum computing promises to revolutionize the field of cryptography. Unlike classical methods, it relies on the principles of quantum mechanics, particularly superposition and entanglement, allowing for unprecedented data security.\n\nDr. Y: That’s correct, Prof. X. However, we must tread carefully. While these advancements are promising, they also present risks—specifically, they could exacerbate inequality in access to technology, creating a digital divide between those who can leverage quantum capabilities and those who cannot.\n\nModerator: Interesting point, Dr. Y. In fact, the lack of public understanding of quantum technology is quite alarming. If the general populace remains uninformed, we might struggle with policy-making and education surrounding this groundbreaking field.\n\nProf. X: Absolutely. As a point of illustration, consider optimization in logistics. Companies are already utilizing quantum computing for better route calculations, which not only increases efficiency but also reduces carbon footprints.\n\nDr. Y: Moreover, the foundational differences between quantum and classical computing lie in their basic units of computation. Classical computing uses bits, whereas quantum computing utilizes qubits, which can represent multiple states simultaneously—a fundamental shift in processing power.\n\nModerator: So what do we do moving forward? How can we address the public misconceptions about quantum technology?\n\nProf. X: It’s imperative that we invest in educational initiatives and outreach programs, engaging not just academics, but also industry stakeholders and the community at large to demystify this technology.\n\nDr. Y: I wholeheartedly agree, and it’s essential that we approach this topic proactively, as it is just the tip of the iceberg in terms of potential societal transformation."
  }
};

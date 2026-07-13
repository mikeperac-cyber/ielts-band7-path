import { Lesson } from "./types";

export const week7day3: Lesson = {
  id: "week-7-day-3",
  day: "Day 3",
  title: "Listening + Reading (Band 9 Mastery)",
  duration: "2 h 45 min",
  topic: "Quantum Computing: Implications and Challenges",
  audioLabel: "In-depth Debate Session · 12 min practice",
  questions: [
    "Quantum computing poses questions about the limits of __________ in classical computing.",
    "The panel discusses the ethical implications of __________ in quantum technology.",
    "Prof. X argues that quantum computers could __________ current encryption methods.",
    "Dr. Y raises concerns about the __________ in terms of accessibility and equity.",
    "According to the debate, the primary challenge with quantum computing is __________.",
    "The moderator emphasizes the need for __________ in the development of quantum technologies."
],
  phrases: [
    {
        "phrase": "paradigm shift",
        "use": "To describe a fundamental change in approach or underlying assumptions."
    },
    {
        "phrase": "ethical quandary",
        "use": "To refer to a complex moral dilemma that requires careful consideration."
    },
    {
        "phrase": "expedited advancement",
        "use": "To discuss the rapid progress in technology or research."
    }
],
  review: {
    answers: [
    "efficiency",
    "privacy",
    "compromise",
    "risk",
    "integration",
    "regulation"
],
    transcript: "Moderator: Welcome to today's panel discussion on quantum computing. We have esteemed guests from various fields. Let’s start with the foundational question: what implications do you see quantum computing having on traditional computing methods?\n\nProf. X: It represents a significant paradigm shift. Quantum computers can process an immense amount of data simultaneously, which fundamentally challenges the limits of efficiency in classical computing.\n\nDr. Y: However, we must also consider the ethical quandary it presents, particularly concerning data privacy. As we develop more powerful encryption methods, the potential to compromise current systems grows.\n\nModerator: That's an excellent point, Dr. Y. Do you believe that these advancements in quantum computing could ultimately outpace our regulatory frameworks?\n\nProf. X: Precisely. The expedited advancement in this field outstrips our ability to effectively govern it, leading to risks in both security and public trust.\n\nDr. Z: Additionally, we must discuss accessibility. The financial and technical barriers to entry can exacerbate inequalities. The primary challenge lies not only in the technology itself but in ensuring equitable access to its benefits.\n\nModerator: So, to synthesize, while quantum computing offers remarkable opportunities, it introduces a complex tapestry of ethical, regulatory, and social issues that we must address moving forward. Thank you all for your insights."
  }
};

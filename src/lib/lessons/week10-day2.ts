import { Lesson } from "./types";

export const week10day2: Lesson = {
  id: "week-10-day-2",
  day: "Day 2",
  title: "Reading for Evidence + Writing with Control (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing",
  audioLabel: "In-depth Panel Discussion · 12 min practice",
  questions: [
    "What is the primary advantage of quantum computers over classical computers according to Dr. Yu?",
    "How does Prof. Mitchell characterize the potential societal implications of quantum technology?",
    "What evidence does Dr. Chang provide to support the idea that quantum computing could revolutionize certain industries?",
    "According to the panel, what ethical considerations are raised by the advancements in quantum computing?",
    "How does the moderator summarize the consensus among the panelists regarding future research directions?",
    "What is the significance of error correction in quantum computing as explained by Dr. Yu?"
],
  phrases: [
    {
        "phrase": "exponential growth",
        "use": "to describe rapid advancements in technology or knowledge."
    },
    {
        "phrase": "paradigm shift",
        "use": "to indicate a fundamental change in approach or underlying assumptions."
    },
    {
        "phrase": "double-edged sword",
        "use": "to refer to a situation that has both positive and negative outcomes."
    }
],
  review: {
    answers: [
    "The primary advantage of quantum computers is their ability to perform complex calculations exponentially faster due to superposition and entanglement principles.",
    "Prof. Mitchell suggests that quantum technology could exacerbate inequality, benefiting those with access while sidelining others.",
    "Dr. Chang points to the healthcare sector, citing quantum algorithms that could optimize drug discovery significantly.",
    "The ethical considerations include privacy concerns and the potential for misuse of quantum technology in surveillance or cyber warfare.",
    "The moderator encapsulates the discussion by emphasizing the need for interdisciplinary research to address both challenges and opportunities.",
    "Error correction is crucial as quantum bits are prone to errors, and effective error correction protocols are necessary for reliable quantum computing."
],
    transcript: "Moderator: Welcome, everyone, to today’s panel discussion on the future of quantum computing. Let’s start with Dr. Yu. What would you say is the primary advantage of quantum computers?\nDr. Yu: Certainly, Moderator. The key advantage lies in their capability to execute computations at an exponential growth rate over classical computers, mainly due to the principles of superposition and entanglement. This allows them to tackle problems that are currently infeasible.\nProf. Mitchell: Building on that, we must also consider the societal implications. While quantum computing holds great potential, it may also lead to a paradigm shift in technological access, arguably widening the gap between privileged and underprivileged sectors.\nDr. Chang: Absolutely, and I’d like to emphasize the industries that could perceive a revolution. For instance, in the healthcare sector, algorithms derived from quantum mechanics could lead to breakthroughs in drug discovery that are significantly more efficient than traditional methods.\nModerator: Interesting points! But with these advancements arise ethical dilemmas, do you agree, Dr. Yu?\nDr. Yu: Yes, it’s a double-edged sword. While we advance technological frontiers, we must also navigate complex ethical considerations, particularly regarding privacy and the potential misuse in areas such as surveillance.\nProf. Mitchell: That’s a significant concern. It’ll be essential for regulatory bodies to incorporate ethical frameworks to govern the usage of these technologies.\nDr. Chang: Furthermore, a focused effort on error correction will be paramount. Quantum bits are highly susceptible to errors, and without robust correction methods, any advances made could be rendered ineffective.\nModerator: Thank you all. As we conclude, it's clear that interdisciplinary collaboration will be pivotal in guiding future research directions in quantum computing."
  }
};

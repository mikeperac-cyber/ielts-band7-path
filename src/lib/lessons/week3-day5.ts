import { Lesson } from "./types";

export const week3day5: Lesson = {
  id: "week-3-day-5",
  day: "Day 5",
  title: "Developing Ideas with Clarity and Precision: Writing + Speaking (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing",
  audioLabel: "In-depth Panel Discussion · 15 min analysis",
  questions: [
    "What is the primary advantage of quantum computing over classical computing?",
    "Describe one major challenge faced by researchers in the field of quantum computing.",
    "How does quantum entanglement contribute to the potential power of quantum computers?",
    "In what way is quantum supremacy a significant milestone in technology?",
    "Discuss the implications of quantum computing on data security as mentioned by Dr. Y.",
    "Why is interdisciplinary collaboration essential in advancing quantum computing research?"
],
  phrases: [
    {
        "phrase": "A double-edged sword",
        "use": "Use when discussing a situation that has both positive and negative consequences."
    },
    {
        "phrase": "Paradigm shift",
        "use": "Utilized to describe a fundamental change in approach or underlying assumptions."
    },
    {
        "phrase": "Cutting-edge technology",
        "use": "Applicable when referring to the latest advancements in a particular field."
    }
],
  review: {
    answers: [
    "The primary advantage of quantum computing lies in its ability to process vast amounts of data simultaneously due to superposition.",
    "One major challenge faced by researchers is maintaining quantum coherence, as even slight disturbances can disrupt quantum states.",
    "Quantum entanglement enables particles to remain interconnected, allowing for the instantaneous transfer of information across distances.",
    "Quantum supremacy marks a point where quantum computers can solve problems that are infeasible for classical computers, thereby demonstrating their unique capabilities.",
    "Dr. Y emphasized that quantum computing poses new challenges for data security, as it could potentially undermine traditional encryption methods.",
    "Interdisciplinary collaboration is crucial to bring together diverse expertise, facilitating innovations that can accelerate quantum computing advancements."
],
    transcript: "Moderator: Good afternoon, everyone. Today, we delve into the fascinating world of quantum computing. To start off, Prof. X, could you elucidate the primary advantages of quantum computers compared to classical ones?\n\nProf. X: Certainly. The primary advantage of quantum computing lies in its phenomenal potential to process data. Unlike classical computers, which operate through binary bits, quantum computers utilize qubits, allowing them to exist in multiple states simultaneously. This principle of superposition enables quantum computers to perform complex calculations at unprecedented speeds.\n\nDr. Y: Precisely. However, we must acknowledge the challenges we face in this burgeoning field. One of the most significant obstacles is ensuring quantum coherence. Any minor disturbance can lead to decoherence, jeopardizing the quantum state and thus the computation.\n\nModerator: That’s a compelling point. Can you elaborate on how quantum entanglement contributes to the power of these computers?\n\nProf. X: Quantum entanglement creates correlations between qubits, regardless of the distance separating them. This interconnectedness can facilitate instant information transfer, optimizing computation time.\n\nDr. Y: I’d also like to add that achieving quantum supremacy has been a pivotal milestone. It's the moment when a quantum computer solves a problem that a classical computer cannot feasibly resolve, showcasing the unique advantages of this technology.\n\nModerator: Interesting. However, there are also ramifications concerning data security. Dr. Y, could you explain these implications?\n\nDr. Y: Certainly. The advent of quantum computing poses significant threats to current encryption methodologies. Particularly, algorithms that we rely on today could become obsolete, necessitating a reevaluation of our data protection strategies.\n\nProf. X: In light of these challenges and innovations, interdisciplinary collaboration becomes essential. It combines expertise from physics, computer science, and even ethics, propelling the entire field forward effectively.\n\nModerator: Thank you for your insights, Prof. X and Dr. Y. It’s clear that while quantum computing offers groundbreaking opportunities, it also presents formidable challenges."
  }
};

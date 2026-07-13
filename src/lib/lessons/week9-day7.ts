import { Lesson } from "./types";

export const week9day7: Lesson = {
  id: "week-9-day-7",
  day: "Day 7",
  title: "Listening + Reading (Band 9 Mastery)",
  duration: "2 h 45 min",
  topic: "Quantum Computing",
  audioLabel: "Intense Academic Debate · 25 min discussion",
  questions: [
    "1. What distinguishes quantum computing from classical computing as discussed in the debate?",
    "2. How does Prof. X describe potential applications of quantum technology in medicine?",
    "3. Which challenges associated with quantum computing does Dr. Y highlight?",
    "4. What analogy does the Moderator use to explain the concept of superposition?",
    "5. According to the discussion, why is quantum encryption deemed more secure than traditional methods?",
    "6. What future societal impacts of quantum technology does Prof. X predict?"
],
  phrases: [
    {
        "phrase": "paradigm shift",
        "use": "to describe a fundamental change in approach or underlying assumptions"
    },
    {
        "phrase": "exponential growth",
        "use": "to refer to rapid increase at an accelerating rate, often used in technology discussions"
    },
    {
        "phrase": "cognitive dissonance",
        "use": "to express the mental discomfort experienced by a person who holds two or more contradictory beliefs."
    }
],
  review: {
    answers: [
    "1. Quantum computing leverages superposition and entanglement to perform complex calculations much faster than classical computers.",
    "2. Prof. X describes its application in personalized medication through rapid simulations of molecular interactions.",
    "3. Dr. Y highlights scalability, error rates, and the current limits of qubit technology as significant challenges.",
    "4. The Moderator likens superposition to a spinning coin that represents multiple outcomes simultaneously until measured.",
    "5. Quantum encryption is deemed more secure due to its reliance on the principles of quantum mechanics, which prevent eavesdropping without detection.",
    "6. Prof. X predicts that quantum technology could lead to transformative changes in AI, security, and problem-solving capabilities."
],
    transcript: "Moderator: Welcome everyone to today’s discussion on quantum computing. We have leading experts in the field, Prof. X and Dr. Y, here to delve into the intricacies and implications of this groundbreaking technology.\n\nProf. X: Thank you, Moderator. To draw a distinction, quantum computing operates on the principles of quantum mechanics, unlike classical computing which relies on binary bits. In essence, quantum bits, or qubits, can exist in multiple states at once due to a phenomenon known as superposition, allowing for vastly superior computational power.\n\nDr. Y: Absolutely. However, while the potential is immense, we face considerable challenges. The intricacies of scaling qubit systems and maintaining coherence without error are significant hurdles.\n\nModerator: Profound insights indeed. Could you expand on the applications, Prof. X? \n\nProf. X: Certainly! One of the most exciting applications lies in medicine. Imagine simulating entire molecular interactions instantaneously to design personalized medication. The implications could revolutionize drug development.\n\nDr. Y: While that is revolutionary, we must also approach it with caution. The rapid advancements can lead to cognitive dissonance in our perception of what is achievable versus what is practical, particularly concerning ethics in technology use.\n\nModerator: An excellent point. Now, let’s discuss security. Prof. X, why might quantum encryption be considered a game changer?\n\nProf. X: Quantum encryption operates on the principle that any attempt to intercept a qubit alters its state, thereby notifying the sender and receiver of a breach. In contrast, traditional encryption could be compromised silently.\n\nDr. Y: Nonetheless, the true challenge lies ahead––scalability and the requisite technological advancements needed to achieve widespread implementation.\n\nModerator: Thank you both for this enlightening discussion. Future societal impacts are bound to be profound, as we navigate through the evolving landscape of quantum technology."
  }
};

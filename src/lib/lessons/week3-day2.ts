import { Lesson } from "./types";

export const week3day2: Lesson = {
  id: "week-3-day-2",
  day: "Day 2",
  title: "Reading for Evidence + Writing with Control (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing",
  audioLabel: "Advanced Panel Discussion · 12 min practice",
  questions: [
    "1. What is one key advantage of quantum computing mentioned during the discussion?",
    "2. How does Dr. Y differentiate between classical and quantum bits?",
    "3. According to Prof. X, what implications does quantum computing have on cryptography?",
    "4. What future application of quantum computing does the panel foresee?",
    "5. What concern regarding quantum computing is raised by the moderator?",
    "6. How does the panel suggest addressing the accessibility issue in quantum technology?"
],
  phrases: [
    {
        "phrase": "paradigm shift",
        "use": "Use this to describe a fundamental change in approach or underlying assumptions."
    },
    {
        "phrase": "exponential growth",
        "use": "Used to convey rapid increases in capabilities or numbers."
    },
    {
        "phrase": "cutting-edge technology",
        "use": "Describes advanced or innovative technological developments."
    }
],
  review: {
    answers: [
    "1. A key advantage of quantum computing is its potential for solving complex problems significantly faster than classical computers.",
    "2. Dr. Y states that classical bits can be either '0' or '1', whereas quantum bits (qubits) can exist in multiple states simultaneously due to superposition.",
    "3. Prof. X indicates that quantum computing has profound implications for cryptography, potentially rendering traditional encryption methods obsolete.",
    "4. The panel foresees applications of quantum computing in drug discovery and materials science, which involve intricate calculations.",
    "5. The moderator raises concerns about the ethical implications and potential misuse of quantum technology in surveillance.",
    "6. The panel suggests that fostering educational initiatives and partnerships with tech companies can help address accessibility in quantum technology."
],
    transcript: "Moderator: Welcome to today’s panel discussion on quantum computing, a field that promises to revolutionize how we handle complex calculations and data processing. \n\nProf. X: Indeed, the potential of quantum computing can be described as a paradigm shift in technology. Unlike classical computing, where we rely on bits that represent either a '0' or a '1', quantum bits, or qubits, can exist in a state of superposition. This capability allows quantum computers to process vast amounts of information simultaneously.\n\nDr. Y: Exactly, Prof. X. This property of qubits leads to what one might call exponential growth in computational power. Imagine algorithms that can factor large integers much more efficiently, which poses significant implications for the field of cryptography and data security.\n\nModerator: That’s a crucial point. Speaking of implications, can you elaborate on how quantum computing might affect current cryptographic practices?\n\nProf. X: Well, traditional forms of encryption could become obsolete as quantum computers become more common. For instance, RSA encryption relies on the difficulty of factoring large numbers, but quantum algorithms can solve this problem efficiently, jeopardizing data security across all sectors.\n\nDr. Z: Furthermore, we're not just looking at enhanced compute power; there's also the potential for groundbreaking applications in drug discovery and materials sciences, which require intricate calculations that classical computing struggles with.\n\nModerator: While all these advancements sound promising, what concerns do we face moving forward? \n\nDr. Y: A key issue is the ethical implications. If quantum technology becomes mainstream, we could see significant misuse, particularly in surveillance and privacy violations.\n\nProf. X: That’s a valid concern. It underscores the necessity for a robust ethical framework. Additionally, we must address accessibility. Currently, the field is somewhat exclusive to elite advancements and research institutions.\n\nModerator: How can we address that accessibility issue?\n\nDr. Z: One approach could involve fostering educational initiatives. Partnerships between universities and tech companies might open pathways for broader access to quantum computing education and resources."
  }
};

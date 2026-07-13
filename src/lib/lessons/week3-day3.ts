import { Lesson } from "./types";

export const week3day3: Lesson = {
  id: "week-3-day-3",
  day: "Day 3",
  title: "Writing Structure and Idea Control Performance Check",
  duration: "2 h 45 min",
  topic: "Quantum Computing and its Societal Implications",
  audioLabel: "Complex Panel Discussion · 10 min practice",
  questions: [
    "What are the key differences between classical and quantum computing according to Prof. X?",
    "How does Dr. Y suggest quantum computing could impact data security?",
    "What ethical concerns regarding quantum computing are identified by the panel?",
    "Which industry does Prof. X specifically mention could benefit the most from quantum developments?",
    "According to Dr. Y, what is a potential negative outcome of widespread quantum computing?",
    "What solution does the panel propose to address the concerns surrounding quantum computing?"
],
  phrases: [
    {
        "phrase": "pushing the envelope",
        "use": "Used to describe pushing the boundaries of what is known or possible."
    },
    {
        "phrase": "a double-edged sword",
        "use": "Refers to something that has both positive and negative consequences."
    },
    {
        "phrase": "to navigate uncharted waters",
        "use": "Indicates dealing with uncertain or complex situations."
    }
],
  review: {
    answers: [
    "Classical computing relies on bits as the smallest unit of data, whereas quantum computing uses qubits that exploit quantum states for processing power.",
    "Dr. Y suggests that quantum computing could radically enhance encryption, making data far more secure.",
    "Ethical concerns include the potential misuse of quantum technologies for surveillance and data breaches.",
    "Prof. X mentions the healthcare industry as potentially reaping significant benefits from advancements in quantum computation.",
    "Dr. Y warns that widespread quantum computing may lead to a loss of privacy and security.",
    "The panel suggests establishing a regulatory framework to oversee the ethical deployment of quantum technologies."
],
    transcript: "Moderator: Welcome to today’s panel discussion on quantum computing and its societal implications. We have an esteemed panel of experts here to share their insights. Prof. X, could you start us off by explaining the key differences between classical and quantum computing?\n\nProf. X: Certainly. The fundamental distinction lies in the data units. While classical computing uses bits as the smallest unit of information, quantum computing operates with qubits. Qubits can exist in multiple states simultaneously, thanks to superposition, which exponentially increases processing power.\n\nDr. Y: That's an essential point, Prof. X. Furthermore, this capability allows for unprecedented increases in speed for certain complex calculations. One area where this could have profound implications is data security, particularly in encryption.\n\nModerator: Intriguing. Can you elaborate on that, Dr. Y?\n\nDr. Y: Yes, with quantum algorithms, we can theoretically create encryption methods that are virtually unbreakable, thus enhancing data security in sectors like banking and personal privacy. However, this technology is a double-edged sword; while it secures information, it could also be exploited for malicious purposes.\n\nProf. X: Exactly. Additionally, we must address the ethical concerns surrounding the misuse of such power. The potential for surveillance and violations of privacy must be mitigated.\n\nDr. Y: Indeed, there's a pressing concern here! As we navigate uncharted waters with quantum applications, we need robust regulations to govern its use. Which industries do you believe will benefit the most, Prof. X?\n\nProf. X: I’d argue the healthcare sector stands to gain significantly. Quantum computing could expedite drug discovery, personalize treatments, and manage vast datasets effectively, thus saving lives more efficiently.\n\nModerator: A fascinating perspective! But what about potential negative outcomes? Dr. Y, what should we be aware of?\n\nDr. Y: Well, there's the risk that as quantum technology becomes more accessible, it could lead to systemic breaches of privacy. The implications are vast, and we should promote public awareness and regulatory measures now to address these challenges.\n\nModerator: Thank you both for your valuable insights. It’s clear that while quantum computing holds immense potential, it comes with significant responsibilities."
  }
};

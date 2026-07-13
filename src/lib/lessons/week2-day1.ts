import { Lesson } from "./types";

export const week2day1: Lesson = {
  id: "week-2-day-1",
  day: "Day 1",
  title: "Listening + Speaking (Band 9 Mastery)",
  duration: "90–120 min",
  topic: "Quantum Computing",
  audioLabel: "High-Level Panel Discussion · 10 min practice",
  questions: [
    "What is the primary advantage of quantum computing over classical computing as mentioned by Prof. X?",
    "How does Dr. Y predict quantum technology will impact data security?",
    "Identify one potential application of quantum computing highlighted in the discussion.",
    "What concern does the Moderator express regarding the accessibility of quantum computing technology?",
    "According to Prof. X, what is the main challenge that researchers currently face in quantum computing?",
    "What ethical implications did Dr. Y touch upon concerning quantum advancements?"
],
  phrases: [
    {
        "phrase": "pushing the envelope",
        "use": "Used when discussing innovative advancements or expanding the boundaries of current knowledge."
    },
    {
        "phrase": "a double-edged sword",
        "use": "Refers to something that has both positive and negative consequences."
    },
    {
        "phrase": "navigating uncharted waters",
        "use": "Describes the process of dealing with situations that are new and unknown."
    }
],
  review: {
    answers: [
    "The primary advantage is its ability to process complex problems at unparalleled speeds.",
    "Dr. Y predicts that quantum technology will revolutionize data security through unparalleled encryption methods.",
    "One potential application highlighted is the optimization of logistical networks.",
    "The Moderator expresses concern that access to quantum computing may widen the digital divide.",
    "The main challenge mentioned is error rates in qubit operations that hinder reliable computations.",
    "Dr. Y discussed the ethical implications of decision-making processes influenced by AI powered by quantum computing."
],
    transcript: "Moderator: Welcome to today's panel discussion on the burgeoning field of quantum computing. Our esteemed guests are Prof. X, a leading researcher in quantum algorithms, and Dr. Y, an expert in quantum ethics.\n\nProf. X: Thank you for having us. The primary advantage of quantum computing lies in its ability to process complex problems exponentially faster than classical computers. This efficiency makes it indispensable for fields like cryptography, materials science, and even pharmaceuticals.\n\nDr. Y: Absolutely, Prof. X. However, as we embrace this transformative technology, we must also navigate uncharted waters concerning its ethical implications. Quantum technology offers unparalleled data protection, but it also raises significant concerns about privacy and surveillance.\n\nModerator: Interesting point, Dr. Y. Could you elaborate on how quantum computing might revolutionize data security?\n\nDr. Y: Certainly. The algorithms derived from quantum mechanics could lead to encryption that is virtually unbreakable by classical means, thus significantly enhancing data security. However, this also presents a double-edged sword in terms of data accountability.\n\nProf. X: That’s a crucial point, Dr. Y. Moreover, one of the major challenges we face is error rates in qubit operations. This limitation hampers reliable computation and, consequently, affects the practicality of quantum applications.\n\nModerator: It seems the potential of quantum computing could perpetuate the digital divide. As access remains limited, it's essential we consider equitable distribution of this technology. How do you see us addressing these disparities?\n\nDr. Y: A proactive approach is necessary. We must ensure that as developments unfold, measures are taken to democratize access to quantum technologies; otherwise, we risk creating a socioeconomic rift.\n\nProf. X: Agreed, and it's vital that we push the envelope in both research and policy to ensure these tools benefit society as a whole."
  }
};

import { Lesson } from "./types";

export const week5day1: Lesson = {
  id: "week-5-day-1",
  day: "Day 1",
  title: "Listening + Reading (Advanced Distractors)",
  duration: "110 min",
  topic: "Neurological Impacts of Deep Space Travel",
  audioLabel: "Fast-paced Monologue (Section 4 style) · 6 min practice",
  questions: [
    "Initial studies indicated that astronauts suffer from degraded ________ within the first month.",
    "Unlike previous assumptions, the primary cause of spatial disorientation is not zero-gravity, but rather ________.",
    "The 'Holloway Protocol' mandates a minimum of two hours of ________ daily.",
    "Researchers were surprised to find that cognitive decline reversed rapidly upon exposure to ________.",
    "Future missions to Mars will require vessels to be equipped with artificial ________ generators.",
    "The speaker emphasizes that psychological resilience is just as critical as ________ fitness.",
  ],
  phrases: [
    { phrase: "Contrary to popular belief, ...", use: "introduce a counter-intuitive fact" },
    { phrase: "A striking manifestation of this is ...", use: "provide a vivid example" },
    { phrase: "This paradigm shift necessitates ...", use: "explain a required change in approach" },
  ],
  review: {
    answers: ["proprioception", "radiation", "resistance training", "gravity", "magnetic field", "physiological"],
    transcript:
      "Good morning, everyone. Today's lecture delves into the neurological impacts of deep space travel, a field that has seen a complete paradigm shift over the last decade.\n\n" +
      "Historically, aerospace medicine focused on muscle atrophy and bone density. However, initial studies from the extended ISS missions indicated that astronauts suffer from degraded proprioception within the first month. Proprioception, your body's ability to sense movement and location, deteriorates rapidly, leading to severe clumsiness upon return to Earth.\n\n" +
      "For a long time, the scientific community assumed this spatial disorientation was purely a consequence of zero-gravity. But, contrary to popular belief, recent data confirms that the primary cause of spatial disorientation is not zero-gravity, but rather cosmic radiation. The high-energy particles literally degrade the neural pathways responsible for spatial mapping.\n\n" +
      "To mitigate muscle loss, we implemented the 'Holloway Protocol', which mandates a minimum of two hours of resistance training daily. While this preserves muscle mass, it does nothing for the neurological degradation.\n\n" +
      "Interestingly, a breakthrough occurred by accident during a centrifuge test. Researchers were surprised to find that cognitive decline reversed rapidly upon exposure to simulated gravity. Even short bursts of 1G were enough to prompt neural repair.\n\n" +
      "Looking ahead, if we are to survive the multi-year transit to Mars, we cannot rely solely on spinning habitats. Future missions to Mars will require vessels to be equipped with artificial magnetic field generators. Without this active shielding, the radiation exposure would render a crew incapable of operating the landing craft.\n\n" +
      "Ultimately, as we push further into the cosmos, the speaker emphasizes that psychological resilience is just as critical as physiological fitness. The isolation, combined with neurological stress, represents the true final frontier of human spaceflight."
  },
};

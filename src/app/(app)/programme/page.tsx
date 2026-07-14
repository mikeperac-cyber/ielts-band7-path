import Link from "next/link";
import { ChevronRight, Clock3, LockKeyhole } from "lucide-react";
import { programme, weeklyThemes } from "@/lib/course-plan";

export default function ProgrammePage() {
  return <div className="page-wrap programme-page"><div className="page-intro"><div><h1>Your 10-week programme</h1><p>Five focused two-skill lessons and two timed diagnostic checkpoints each week.</p></div><span className="programme-count">50 lessons · 20 diagnostics</span></div>{weeklyThemes.map((theme, weekIndex) => { const week = weekIndex + 1; const days = programme.filter((day) => day.week === week); return <section className="week-card" key={theme}><header><span>WEEK {week}</span><h2>{theme}</h2><p>{week < 4 ? "Build accurate habits before adding pressure." : week < 8 ? "Increase precision, range, and time control." : "Perform consistently under timed conditions."}</p></header><div className="programme-days">{days.map((day) => <Link href={day.isMock ? `/mocks/${week}/${day.localDay === 7 ? 2 : 1}` : `/learn/${week}/${day.day}`} key={day.day} className={day.isMock ? "programme-day mock" : "programme-day"}><strong>Day {day.day}</strong><span>{day.isMock ? day.diagnosticLabel : day.skills.join(" + ")}</span><small><Clock3 size={14} /> {day.duration}</small>{week > 1 && <LockKeyhole size={15} />}{!day.isMock && <ChevronRight size={16} />}</Link>)}</div></section>; })}</div>;
}

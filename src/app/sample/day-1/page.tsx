import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { LessonPlayer } from "@/components/lesson-player";
import { convertLegacyLesson } from "@/lib/course-content/legacy";

export default function SampleLessonPage() {
  const converted = convertLegacyLesson(1, 1);
  if (!converted) return null;
  const lesson = { ...converted.content, activities: converted.content.activities.map((activity) => activity.kind === "listening" ? { ...activity, audioUrl: "/sample-listening.mp3" } : activity) };
  return <main className="sample-page"><header><Link href="/"><ArrowLeft size={16} /> Back to overview</Link><span>Public sample · Day 1</span><Link className="text-link" href="/sign-in">Unlock full course <LockKeyhole size={15} /></Link></header><LessonPlayer sample lesson={lesson} sampleReview={converted.review} /></main>;
}

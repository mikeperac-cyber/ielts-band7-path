import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { LessonPlayer } from "@/components/lesson-player";
import { week1day1 } from "@/lib/lessons/week1-day1";

export default function SampleLessonPage() { return <main className="sample-page"><header><Link href="/"><ArrowLeft size={16} /> Back to overview</Link><span>Public sample · Day 1</span><Link className="text-link" href="/sign-in">Unlock full course <LockKeyhole size={15} /></Link></header><LessonPlayer sample lesson={week1day1} /></main>; }

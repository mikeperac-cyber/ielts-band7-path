import { MockExam } from "@/components/mock-exam";

export default async function MockPage({ params }: { params: Promise<{ week: string; mock: string }> }) { const { week, mock } = await params; return <MockExam week={Number(week)} harder={Number(mock) === 2} />; }

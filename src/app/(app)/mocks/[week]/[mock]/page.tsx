import { MockExam } from "@/components/mock-exam";

export default async function MockPage({ params }: { params: Promise<{ week: string; mock: string }> }) { const { mock } = await params; return <MockExam harder={Number(mock) === 2} />; }

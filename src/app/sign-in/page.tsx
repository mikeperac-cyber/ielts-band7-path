import Link from "next/link";
import { BookOpen } from "lucide-react";
import { SignInForm } from "@/components/sign-in-form";

export default function SignInPage() { return <main className="sign-in-page"><Link href="/" className="sign-in-brand"><BookOpen size={20} /><span><strong>IELTS</strong> ACADEMIC</span></Link><SignInForm /><p className="sign-in-return">Want to look around first? <Link href="/sample/day-1">Open the public sample.</Link></p></main>; }

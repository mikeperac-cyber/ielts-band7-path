import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ielts-band7-path.vercel.app"),
  title: {
    default: "IELTS Academic Band 7 Path | 10-Week Self-Study Programme",
    template: "%s | IELTS Academic Band 7 Path",
  },
  description: "Build Band 7 IELTS Academic skills with daily study plans, original Listening audio, full timed mocks, and a lexical tracker.",
  keywords: ["IELTS Academic", "IELTS Band 7", "IELTS self-study", "IELTS Listening practice", "IELTS mock test"],
  openGraph: {
    title: "IELTS Academic Band 7 Path",
    description: "A focused 10-week IELTS Academic self-study programme for learners moving from Band 6 towards Band 7.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "IELTS Academic Band 7 Path",
    description: "A focused 10-week IELTS Academic self-study programme for Band 6 to Band 7 learners.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { PwaRegistry } from "@/components/pwa-registry";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ielts-band7-path.vercel.app"),
  title: {
    default: "IELTS Academic Band 9 Path | 10-Week Self-Study Programme",
    template: "%s | IELTS Academic Band 9 Path",
  },
  description: "Build Band 9 IELTS Academic skills with daily study plans, original Listening audio, full timed mocks, and a lexical tracker.",
  keywords: ["IELTS Academic", "IELTS Band 9", "IELTS self-study", "IELTS Listening practice", "IELTS mock test"],
  openGraph: {
    title: "IELTS Academic Band 9 Path",
    description: "A focused 10-week IELTS Academic self-study programme for learners moving from Band 7 towards Band 9.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "IELTS Academic Band 9 Path",
    description: "A focused 10-week IELTS Academic self-study programme for Band 7 to Band 9 learners.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#203a52" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PwaRegistry />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Headphones,
  Mic2,
  ShieldCheck,
  Timer,
  TrendingUp,
} from "lucide-react";

const features: Array<[typeof Headphones, string, string]> = [
  [
    Headphones,
    "Original Listening audio",
    "Listen to original academic practice recordings, take notes, then reveal the explanation after your attempt.",
  ],
  [
    Timer,
    "Real exam pressure",
    "Take two full four-skill mocks each week at official IELTS timing.",
  ],
  [
    TrendingUp,
    "Lexical evidence",
    "Track phrase confidence, your own examples, and successful reuse across every skill.",
  ],
];

const faqs = [
  [
    "Who is this for?",
    "Independent IELTS Academic learners currently around Band 7.5 who want a structured route towards Band 9.",
  ],
  [
    "What does the free sample include?",
    "A complete Listening and Speaking Day 1 practice area, including a real audio recording, notes, phrase work, and answer review.",
  ],
  [
    "How much study is required?",
    "Most days take 90–120 minutes. Day 3 and Day 7 are full four-skill mock days, using official IELTS timing.",
  ],
];

export default function Home() {
  return (
    <main className="marketing">
      {/* ── Nav ── */}
      <header className="marketing-nav" id="marketing-nav">
        <Link href="/" className="marketing-brand">
          <span><BookOpen size={20} /></span>
          <strong>IELTS ACADEMIC</strong>
        </Link>
        <nav>
          <a href="#programme">Programme</a>
          <a href="#method">Method</a>
          <a href="#faq">Questions</a>
        </nav>
        <Link className="nav-cta" href="/sign-in">
          Sign in <ArrowRight size={16} />
        </Link>
      </header>

      {/* Frosted-glass scroll script (vanilla, no React state needed) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              var nav = document.getElementById('marketing-nav');
              if(!nav) return;
              window.addEventListener('scroll', function(){
                if(window.scrollY > 30){ nav.classList.add('scrolled'); }
                else { nav.classList.remove('scrolled'); }
              }, { passive: true });
            })();
          `,
        }}
      />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-copy">
          <h1>Reach Band 9 with a daily plan that tells you exactly what to do.</h1>
          <p>
            A rigorous 10-week Academic IELTS programme for independent learners
            moving from Band 7 towards Band 9.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/sample/day-1">
              Try the free audio lesson <ArrowRight size={17} />
            </Link>
            <Link className="text-link" href="/sign-in">
              Start the full course
            </Link>
          </div>
          <div className="trust-line">
            <CheckCircle2 size={17} />
            Free sample · no card required · original IELTS-style practice
          </div>
        </div>

        {/* Mock dashboard card */}
        <div
          className="hero-dashboard"
          aria-label="Example learner dashboard"
        >
          <div className="hero-dashboard-top">
            <span>Week 1 of 10</span>
            <b>12% complete</b>
          </div>
          <h2>Today: Listening + Speaking</h2>
          <p>Accuracy in understanding. Clarity in response.</p>
          <div className="hero-task">
            <Headphones size={23} />
            <span>
              <b>Listening</b>
              <small>Note completion · 30 min</small>
            </span>
            <i>1</i>
          </div>
          <div className="hero-task">
            <Mic2 size={23} />
            <span>
              <b>Speaking</b>
              <small>Part 1 &amp; 2 practice · 30 min</small>
            </span>
            <i>2</i>
          </div>
          <div className="hero-lexical">
            <span>LEXICAL PHRASE OF THE DAY</span>
            <strong>in the long term</strong>
            <p>Saved · Ready to reuse</p>
          </div>
        </div>
      </section>

      {/* ── Programme band ── */}
      <section id="programme" className="marketing-band">
        <div>
          <span className="section-kicker">A complete study system</span>
          <h2>70 study days. 20 full mocks. One clear route to Band 9.</h2>
        </div>
        <p>
          Every day gives you a focused pair of IELTS skills, guided preparation,
          difficult Band 9+ practice, note-taking space, phrase work, and a specific
          reflection step.
        </p>
      </section>

      {/* ── Method grid ── */}
      <section className="method-grid" id="method">
        <article>
          <span>01</span>
          <h2>Learn the exact skill</h2>
          <p>
            Concise notes explain what the examiner rewards and where Band 7.5 habits
            usually limit performance.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Perform under time</h2>
          <p>
            Complete realistic papers with the same timing decisions you will need on
            test day.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Record the evidence</h2>
          <p>
            Save phrases, diagnose errors, and turn every repeated mistake into a
            personal prevention rule.
          </p>
        </article>
      </section>

      {/* ── Feature section ── */}
      <section className="feature-section">
        <div className="feature-copy">
          <span className="section-kicker">Practice that remembers</span>
          <h2>Progress is more than a score.</h2>
          <p>
            Band 9 requires controlled language, accurate judgement, and consistent
            timing. The tracker shows the evidence behind each improvement—not just
            a percentage.
          </p>
          <Link href="/sample/day-1" className="text-link">
            Explore the free lesson <ArrowRight size={16} />
          </Link>
        </div>
        <div className="feature-list">
          {features.map(([FeatureIcon, title, description]) => (
            <article key={title}>
              <FeatureIcon size={22} />
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Mock band ── */}
      <section className="mock-band">
        <div>
          <ShieldCheck size={26} />
          <span className="section-kicker">Mock days: Day 3 and Day 7</span>
          <h2>Full four-skill examinations, built to get harder every week.</h2>
        </div>
        <div className="mock-timing">
          <strong>2 h 45 m</strong>
          <span>Listening · Reading · Writing · Speaking</span>
          <Link href="/sign-in">
            Unlock full mocks <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section" id="faq">
        <span className="section-kicker">Before you begin</span>
        <h2>Questions learners ask before starting.</h2>
        <div>
          {faqs.map(([question, answer]) => (
            <article key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="final-cta">
        <div>
          <span className="section-kicker">Start today</span>
          <h2>Try the first lesson before committing to the programme.</h2>
          <p>
            Experience the audio, note-taking, phrase tracker, and feedback flow for
            yourself.
          </p>
        </div>
        <Link className="primary-button" href="/sample/day-1">
          Open the free lesson <ArrowRight size={17} />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="marketing-footer">
        <span>© {new Date().getFullYear()} IELTS Academic: Band 9 Path</span>
        <Link href="/sample/day-1">Free sample</Link>
        <Link href="/sign-in">Sign in</Link>
      </footer>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Cloud,
  Code2,
  Cpu,
  Download,
  Flame,
  GitFork,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Rocket,
  Send,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  Users,
  Wrench,
  X,
  Youtube,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        property: "og:url",
        content: "/",
      },
    ],
  }),
  component: PortfolioPage,
});

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "timeline", label: "Journey" },
  { id: "certifications", label: "Certs" },
  { id: "stats", label: "Stats" },
  { id: "contact", label: "Contact" },
];

const TYPING_WORDS = [
  "Software Engineer",
  "Java Developer",
  "Cloud & DevOps Learner",
  "AI Automation Builder",
];

type SkillGroup = {
  title: string;
  icon: LucideIcon;
  color: "green" | "blue";
  skills: string[];
};

const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Programming Languages",
    icon: Code2,
    color: "green",
    skills: ["Java", "C", "Python", "JavaScript", "HTML", "CSS", "SQL"],
  },
  {
    title: "Frontend",
    icon: Rocket,
    color: "blue",
    skills: ["React", "TanStack Router", "Tailwind CSS", "Vite"],
  },
  {
    title: "Core Computer Science",
    icon: Cpu,
    color: "blue",
    skills: [
      "Data Structures & Algorithms",
      "Object Oriented Programming",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    color: "green",
    skills: [
      "AWS",
      "Linux",
      "Git",
      "GitHub",
      "Docker (Learning)",
      "Kubernetes (Learning)",
      "CI/CD (Learning)",
    ],
  },
  {
    title: "Automation",
    icon: Sparkles,
    color: "green",
    skills: [
      "n8n",
      "Gemini API",
      "YouTube Data API",
      "Google Sheets API",
      "Google Drive API",
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    color: "blue",
    skills: [
      "VS Code",
      "IntelliJ IDEA",
      "GitHub Desktop",
      "Canva",
      "Adobe Photoshop",
      "n8n",
    ],
  },
];

type Project = {
  title: string;
  category: "Automation" | "Web" | "AI";
  description: string;
  stack: string[];
  highlights: string[];
  status: "Live" | "In Progress";
};

const PROJECTS: Project[] = [
  {
    title: "AI Powered YouTube Automation System",
    category: "AI",
    description:
      "End-to-end n8n workflow that generates titles, descriptions, tags, and thumbnails, uploads the video, and sends a Telegram notification — fully hands-off.",
    stack: ["n8n", "Gemini API", "YouTube API", "Google Drive", "Google Sheets", "Telegram"],
    highlights: [
      "AI-generated metadata & thumbnails",
      "Automated video upload pipeline",
      "Live status alerts on Telegram",
    ],
    status: "Live",
  },
  {
    title: "Photo Studio Automation",
    category: "Automation",
    description:
      "Automates passport photo production — removes background, corrects colors, crops precisely, and lays out a print-ready sheet. (In Progress)",
    stack: ["n8n", "Image APIs", "Node", "Automation"],
    highlights: [
      "One-click background removal",
      "Auto color & crop correction",
      "Printable passport-sheet output",
    ],
    status: "Live",
  },
  {
    title: "Personal Portfolio Website",
    category: "Web",
    description:
      "The site you're on — a premium, responsive portfolio with glassmorphism, gradients, and smooth motion built on modern React.",
    stack: ["React", "TanStack", "Tailwind v4", "Motion"],
    highlights: [
      "Dark, minimal, premium aesthetic",
      "SEO optimized and fast",
      "Framer-style micro-interactions",
    ],
    status: "Live",
  },
];

const PROJECT_FILTERS = ["All", "AI", "Automation", "Web"] as const;

const TIMELINE = [
  { title: "Java", detail: "Fell in love with the language & OOP fundamentals." },
  { title: "DSA", detail: "Sharpened problem-solving with data structures & algorithms." },
  { title: "AWS", detail: "Explored cloud computing — earned Cloud Practitioner." },
  { title: "DevOps", detail: "Learning Docker, Kubernetes, and CI/CD pipelines." },
  { title: "AI Automation", detail: "Building agents & workflows with n8n + Gemini." },
  { title: "Full Stack", detail: "Shipping end-to-end products with React and Java." },
];

const CERTIFICATIONS = [
  { title: "AWS Cloud Practitioner", issuer: "GeeksforGeeks" },
  { title: "Google Cloud Arcade Skill Badges", issuer: "Google Cloud" },
  { title: "Python Certification", issuer: "Online" },
];

const ACHIEVEMENTS = [
  { value: "3.6K+", label: "YouTube Subscribers" },
  { value: "50+", label: "DSA Problems Solved" },
  { value: "2+", label: "Cloud Certifications" },
  { value: "100%", label: "Learning Mindset" },
];

const SOCIALS = [
  {
    label: "Email",
    href: "mailto:appubdm06@gmail.com",
    icon: Mail,
    handle: "appubdm06@gmail.com",
  },
  {
    label: "GitHub",
    href: "https://github.com/ImmPappu",
    icon: Github,
    handle: "@ImmPappu",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/immpappu",
    icon: Linkedin,
    handle: "/in/immpappu",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@PeditzVerse",
    icon: Youtube,
    handle: "@PeditzVerse",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/i_mm_pappu",
    icon: Instagram,
    handle: "@i_mm_pappu",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

function PortfolioPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 700);
    return () => clearTimeout(t);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.2 });

  return (
    <>
      <AnimatePresence>{!loaded && <LoadingOverlay />}</AnimatePresence>

      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-linear-to-r from-brand-green via-brand-cyan to-brand-blue"
      />

      <ParticlesBackground />

      <Nav />

      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Certifications />
        <Stats />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Loading                                                                    */
/* -------------------------------------------------------------------------- */

function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="h-14 w-14 rounded-full border-2 border-brand-green/30 border-t-brand-green"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
        <p className="font-mono text-xs tracking-widest text-muted-foreground">LOADING</p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Particles                                                                  */
/* -------------------------------------------------------------------------- */

function ParticlesBackground() {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 10 + 12,
        delay: Math.random() * 5,
        blue: Math.random() > 0.5,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-blue/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-brand-green/15 blur-[130px]" />
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className={`absolute rounded-full ${d.blue ? "bg-brand-blue" : "bg-brand-green"}`}
          style={{
            width: d.size,
            height: d.size,
            left: `${d.x}%`,
            top: `${d.y}%`,
            opacity: 0.5,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Nav                                                                        */
/* -------------------------------------------------------------------------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <nav
          className={`glass-strong flex items-center justify-between rounded-2xl px-4 py-3 transition-shadow ${
            scrolled ? "shadow-2xl shadow-black/40" : ""
          }`}
        >
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-brand-green to-brand-blue font-display text-sm font-bold text-background">
              PK
            </span>
            <span className="hidden font-display text-sm font-semibold sm:inline">Pappu Kumar</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <a
              href="#contact"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-brand-green to-brand-cyan px-4 py-2 text-sm font-medium text-background transition-all hover:shadow-[0_0_30px_-8px_var(--brand-green)]"
            >
              Let's talk
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <button
            className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-strong mt-2 flex flex-col rounded-2xl p-2 md:hidden"
            >
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  {n.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reusable                                                                   */
/* -------------------------------------------------------------------------- */

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-brand-green">
            <span className="h-1 w-1 rounded-full bg-brand-green" />
            {eyebrow}
          </div>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">{title}</h2>
          {intro && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{intro}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

function TypingEffect() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex];
    const speed = deleting ? 40 : 90;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setWordIndex((i) => (i + 1) % TYPING_WORDS.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, wordIndex]);

  return (
    <span className="text-gradient">
      {text}
      <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-1 animate-pulse bg-brand-green" />
    </span>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center px-4 pt-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-brand-green">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-green" />
            </span>
            Available for opportunities
          </div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="text-gradient">Pappu Kumar</span>
          </h1>

          <div className="mt-4 text-2xl font-medium text-foreground/90 sm:text-3xl">
            <TypingEffect />
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            B.Tech IT student at Rajkiya Engineering College, Banda. I build with{" "}
            <span className="text-foreground">Java</span>, learn{" "}
            <span className="text-foreground">Cloud &amp; DevOps</span>, and ship real-world{" "}
            <span className="text-foreground">AI automation</span> workflows.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-green to-brand-cyan px-5 py-3 text-sm font-semibold text-background shadow-lg shadow-brand-green/20 transition-all hover:shadow-[0_0_40px_-8px_var(--brand-green)]"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-blue/30 bg-brand-blue/10 px-5 py-3 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue/20"
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> India
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" /> B.Tech IT — REC Banda
            </span>
          </div>
        </motion.div>

        {/* Terminal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="relative"
        >
          <div className="glass-strong relative overflow-hidden rounded-2xl p-1 shadow-2xl shadow-black/50">
            <div className="rounded-xl bg-background/70 p-5 font-mono text-[13px] leading-relaxed">
              <div className="mb-4 flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-brand-green" />
                <span className="ml-3 text-xs text-muted-foreground">~ / pappu.dev</span>
              </div>
              <div className="space-y-1.5">
                <p>
                  <span className="text-brand-blue">const</span>{" "}
                  <span className="text-brand-green">pappu</span> = {"{"}
                </p>
                <p className="pl-4">
                  name: <span className="text-brand-cyan">"Pappu Kumar"</span>,
                </p>
                <p className="pl-4">
                  role: <span className="text-brand-cyan">"Software Engineer"</span>,
                </p>
                <p className="pl-4">
                  stack: [
                  <span className="text-brand-cyan">"Java"</span>,{" "}
                  <span className="text-brand-cyan">"AWS"</span>,{" "}
                  <span className="text-brand-cyan">"n8n"</span>],
                </p>
                <p className="pl-4">
                  learning: <span className="text-brand-cyan">"Docker + K8s + CI/CD"</span>,
                </p>
                <p className="pl-4">
                  building: <span className="text-brand-cyan">"AI Automation"</span>,
                </p>
                <p>{"}"};</p>
                <p className="pt-2 text-muted-foreground">
                  <span className="text-brand-green">$</span> ship --daily
                  <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-brand-green" />
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -inset-2 -z-10 rounded-3xl bg-linear-to-r from-brand-green/30 to-brand-blue/30 opacity-40 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  About                                                                      */
/* -------------------------------------------------------------------------- */

function About() {
  const highlights = [
    { icon: Code2, label: "Software Development" },
    { icon: Cpu, label: "DSA & OOP" },
    { icon: Cloud, label: "Cloud Computing" },
    { icon: Terminal, label: "DevOps" },
    { icon: Sparkles, label: "AI Automation" },
    { icon: Rocket, label: "Real-world Problem Solving" },
  ];
  return (
    <Section
      id="about"
      eyebrow="About Me"
      title={
        <>
          Curious builder,{" "}
          <span className="text-gradient">relentless learner.</span>
        </>
      }
      intro="I'm passionate about software development, Java, and DSA — with a strong interest in Cloud, DevOps, and AI Automation. I love designing workflows that remove repetitive work and building products that solve real problems."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            I'm a B.Tech IT student at{" "}
            <span className="text-foreground">Rajkiya Engineering College, Banda</span>. My
            playground: writing clean Java, sharpening DSA, exploring AWS, and stitching together
            APIs into automations that run themselves. Outside code, I run a YouTube channel where I
            share what I build and learn.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm transition-all hover:border-brand-green/40 hover:bg-brand-green/5"
              >
                <Icon className="h-4 w-4 text-brand-green transition-transform group-hover:scale-110" />
                <span className="text-foreground/80">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.label}
              className="glass rounded-2xl p-5 transition-transform hover:-translate-y-1"
            >
              <div className="font-display text-3xl font-bold text-gradient">{a.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{a.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Skills                                                                     */
/* -------------------------------------------------------------------------- */

function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title={
        <>
          Toolkit I <span className="text-gradient">build with.</span>
        </>
      }
      intro="Languages, frameworks, and platforms I actively use — grouped by domain, no self-rated percentages."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, i) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="glass group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-white/20"
          >
            <div
              className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 ${
                group.color === "green" ? "bg-brand-green/10" : "bg-brand-blue/10"
              } opacity-60 group-hover:opacity-100`}
            />
            <div className="relative flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  group.color === "green"
                    ? "bg-brand-green/15 text-brand-green"
                    : "bg-brand-blue/15 text-brand-blue"
                }`}
              >
                <group.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold">{group.title}</h3>
            </div>
            <ul className="relative mt-5 flex flex-wrap gap-2">
              {group.skills.map((name) => (
                <li key={name}>
                  <SkillBadge name={name} color={group.color} />
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function SkillBadge({ name, color }: { name: string; color: "green" | "blue" }) {
  const learning = /learning/i.test(name);
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 will-change-transform";
  const tone = learning
    ? "border-yellow-400/25 bg-yellow-400/[0.06] text-yellow-200/90 hover:border-yellow-400/50 hover:shadow-[0_0_20px_-6px_rgba(250,204,21,0.5)]"
    : color === "green"
      ? "border-brand-green/25 bg-brand-green/[0.06] text-foreground/90 hover:border-brand-green/60 hover:text-brand-green hover:shadow-[0_0_22px_-6px_var(--brand-green)]"
      : "border-brand-blue/25 bg-brand-blue/[0.06] text-foreground/90 hover:border-brand-blue/60 hover:text-brand-blue hover:shadow-[0_0_22px_-6px_var(--brand-blue)]";
  return (
    <span className={`${base} ${tone} hover:-translate-y-0.5`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          learning
            ? "bg-yellow-400"
            : color === "green"
              ? "bg-brand-green"
              : "bg-brand-blue"
        }`}
      />
      {name}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Projects                                                                   */
/* -------------------------------------------------------------------------- */

function Projects() {
  const [filter, setFilter] = useState<(typeof PROJECT_FILTERS)[number]>("All");
  const filtered = PROJECTS.filter((p) => filter === "All" || p.category === filter);

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title={
        <>
          Things I've <span className="text-gradient">built.</span>
        </>
      }
      intro="A few projects I've shipped. More coming as I keep learning and building."
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {PROJECT_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
              filter === f
                ? "border-brand-green/50 bg-brand-green/15 text-brand-green"
                : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.article
              key={p.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="glass group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-white/20"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-green/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand-blue">
                  {p.category}
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${
                    p.status === "Live" ? "text-brand-green" : "text-yellow-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      p.status === "Live" ? "bg-brand-green" : "bg-yellow-400"
                    }`}
                  />
                  {p.status}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold leading-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-foreground/75">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-green" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-2xl border-dashed p-6 text-center"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-brand-green">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="font-display font-semibold">More projects incoming</p>
          <p className="text-xs text-muted-foreground">
            Space reserved for what I'm building next.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Timeline                                                                   */
/* -------------------------------------------------------------------------- */

function Timeline() {
  return (
    <Section
      id="timeline"
      eyebrow="Journey"
      title={
        <>
          My learning <span className="text-gradient">path.</span>
        </>
      }
      intro="Each step compounded into the engineer I am today — and where I'm headed next."
    >
      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-linear-to-b from-brand-green/60 via-brand-blue/40 to-transparent sm:left-1/2 sm:-translate-x-1/2" />
        <ol className="space-y-8">
          {TIMELINE.map((t, i) => {
            const left = i % 2 === 0;
            return (
              <motion.li
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`relative grid gap-4 pl-12 sm:grid-cols-2 sm:pl-0 ${
                  left ? "" : "sm:[&>*:first-child]:col-start-2"
                }`}
              >
                <div
                  className={`glass rounded-2xl p-5 ${
                    left ? "sm:mr-8 sm:text-right" : "sm:ml-8"
                  }`}
                >
                  <div className="font-mono text-[11px] uppercase tracking-widest text-brand-green">
                    Step {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.detail}</p>
                </div>
                <span className="absolute left-4 top-6 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-brand-green shadow-[0_0_0_4px_var(--background),0_0_20px_var(--brand-green)] sm:left-1/2" />
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Certifications                                                             */
/* -------------------------------------------------------------------------- */

function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="Certifications & Achievements"
      title={
        <>
          Wins along the <span className="text-gradient">way.</span>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-4">
          {CERTIFICATIONS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass flex items-center gap-4 rounded-2xl p-5"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-green/15 text-brand-green">
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-semibold">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.issuer}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold">Achievements</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Youtube className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              <span>
                <span className="text-foreground">3.6K+ YouTube Subscribers</span> —
                sharing tutorials & builds.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
              <span>
                Designed & deployed <span className="text-foreground">10+ automation workflows</span>{" "}
                using n8n.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Cloud className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
              <span>
                Active learner in{" "}
                <span className="text-foreground">Cloud Computing & DevOps</span>.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats (GitHub + LeetCode)                                                  */
/* -------------------------------------------------------------------------- */

const GITHUB_USER = "ImmPappu";
const LEETCODE_USER = "immpappu";

function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current || inView) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setInView(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);
  return { ref, inView };
}

function useAnimatedCount(target: number | null | undefined, duration = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (target == null || Number.isNaN(target)) return;
    const start = performance.now();
    const from = 0;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function StatTile({
  icon: Icon,
  label,
  value,
  loading,
  accent = "green",
}: {
  icon: LucideIcon;
  label: string;
  value: number | string | null;
  loading?: boolean;
  accent?: "green" | "blue" | "cyan";
}) {
  const numeric = typeof value === "number" ? value : null;
  const animated = useAnimatedCount(numeric);
  const display =
    loading || value == null
      ? null
      : numeric != null
        ? animated.toLocaleString()
        : value;
  const accentText =
    accent === "blue"
      ? "text-brand-blue"
      : accent === "cyan"
        ? "text-brand-cyan"
        : "text-brand-green";
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${accentText}`} aria-hidden="true" />
        {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-bold text-foreground">
        {display === null ? (
          <span className="inline-block h-7 w-16 animate-pulse rounded-md bg-white/5" />
        ) : (
          display
        )}
      </div>
    </div>
  );
}

function CardShell({
  title,
  subtitle,
  icon: Icon,
  href,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  href?: string;
  children: ReactNode;
}) {
  return (
    <div className="glass relative flex flex-col overflow-hidden rounded-2xl p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-brand-green">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold">{title}</h3>
            {subtitle && (
              <p className="truncate font-mono text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${title}`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-brand-green/50 hover:text-brand-green"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
      {children}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
      <AlertCircle className="h-4 w-4 shrink-0 text-yellow-400" />
      {message}
    </div>
  );
}

/* ---------- GitHub ---------- */

type GhUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
};

type GhRepo = {
  name: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

type ContribDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

function computeStreaks(days: ContribDay[]) {
  if (!days.length) return { current: 0, longest: 0, total: 0 };
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  let longest = 0;
  let run = 0;
  for (const d of sorted) {
    if (d.count > 0) {
      run += 1;
      if (run > longest) longest = run;
    } else run = 0;
  }
  let current = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) current += 1;
    else break;
  }
  const total = sorted.reduce((s, d) => s + d.count, 0);
  return { current, longest, total };
}

function GitHubSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[] | null>(null);
  const [contrib, setContrib] = useState<ContribDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    (async () => {
      try {
        const [uRes, rRes, cRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USER}`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`),
        ]);
        if (!uRes.ok || !rRes.ok) throw new Error("gh");
        const uJson: GhUser = await uRes.json();
        const rJson: GhRepo[] = await rRes.json();
        let cJson: { contributions: ContribDay[] } | null = null;
        if (cRes.ok) cJson = await cRes.json();
        if (cancelled) return;
        setUser(uJson);
        setRepos(rJson);
        setContrib(cJson?.contributions ?? []);
      } catch {
        if (!cancelled) setError("Unable to fetch GitHub data.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inView]);

  const stars = useMemo(
    () => (repos ? repos.reduce((s, r) => s + (r.stargazers_count ?? 0), 0) : null),
    [repos],
  );

  const topLangs = useMemo(() => {
    if (!repos) return null;
    const map = new Map<string, number>();
    for (const r of repos) {
      if (r.fork) continue;
      if (!r.language) continue;
      map.set(r.language, (map.get(r.language) ?? 0) + 1);
    }
    const total = Array.from(map.values()).reduce((s, n) => s + n, 0) || 1;
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, pct: Math.round((count / total) * 100) }));
  }, [repos]);

  const streaks = useMemo(() => (contrib ? computeStreaks(contrib) : null), [contrib]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <CardShell
        title={user?.name ?? "GitHub"}
        subtitle={`@${GITHUB_USER}`}
        icon={Github}
        href={`https://github.com/${GITHUB_USER}`}
      >
        {error ? (
          <ErrorState message={error} />
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {user ? (
                  <img
                    src={user.avatar_url}
                    alt={`${user.login} avatar`}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="h-14 w-14 rounded-full border border-white/10"
                  />
                ) : (
                  <div className="h-14 w-14 animate-pulse rounded-full bg-white/5" />
                )}
              </div>
              <p className="min-w-0 text-sm text-muted-foreground">
                {user?.bio ?? "Building things with Java, Cloud, and AI Automation."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile icon={BookOpen} label="Repos" value={user?.public_repos ?? null} loading={!user} />
              <StatTile icon={Star} label="Stars" value={stars} loading={stars === null} accent="cyan" />
              <StatTile icon={Users} label="Followers" value={user?.followers ?? null} loading={!user} accent="blue" />
              <StatTile icon={GitFork} label="Following" value={user?.following ?? null} loading={!user} accent="blue" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatTile
                icon={Flame}
                label="Current Streak"
                value={streaks ? `${streaks.current}d` : null}
                loading={!streaks}
                accent="green"
              />
              <StatTile
                icon={Trophy}
                label="Longest Streak"
                value={streaks ? `${streaks.longest}d` : null}
                loading={!streaks}
                accent="cyan"
              />
              <StatTile
                icon={Activity}
                label="Contributions (1y)"
                value={streaks ? streaks.total : null}
                loading={!streaks}
                accent="blue"
              />
            </div>

            {topLangs && topLangs.length > 0 && (
              <div>
                <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Top Languages
                </div>
                <div className="flex flex-wrap gap-2">
                  {topLangs.map((l) => (
                    <span
                      key={l.name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/25 bg-brand-blue/[0.06] px-3 py-1 text-xs text-foreground/90"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                      {l.name}
                      <span className="text-muted-foreground">· {l.pct}%</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Contribution Heatmap · last year
              </div>
              <ContribHeatmap days={contrib} />
            </div>
          </div>
        )}
      </CardShell>
    </motion.div>
  );
}

function ContribHeatmap({ days }: { days: ContribDay[] | null }) {
  if (!days) {
    return <div className="h-[92px] w-full animate-pulse rounded-lg bg-white/5" />;
  }
  if (days.length === 0) return <ErrorState message="Contribution data unavailable." />;
  // Group by week (7 days each), align to weeks
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const firstDow = new Date(sorted[0].date).getUTCDay();
  const padded: (ContribDay | null)[] = Array(firstDow).fill(null).concat(sorted);
  const weeks: (ContribDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

  const levelClass = (lvl: number) =>
    [
      "bg-white/5",
      "bg-brand-green/25",
      "bg-brand-green/45",
      "bg-brand-green/70",
      "bg-brand-green",
    ][lvl] ?? "bg-white/5";

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px]" role="img" aria-label="GitHub contribution heatmap">
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => {
              const d = w[di];
              return (
                <span
                  key={di}
                  title={d ? `${d.date}: ${d.count} contributions` : ""}
                  className={`h-[10px] w-[10px] rounded-[2px] ${
                    d ? levelClass(d.level) : "bg-transparent"
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- LeetCode ---------- */

type LcStats = {
  status: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
};

function LeetCodeSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [data, setData] = useState<LcStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USER}`);
        if (!res.ok) throw new Error("lc");
        const json: LcStats = await res.json();
        if (json.status && json.status !== "success") throw new Error("lc-status");
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("Unable to fetch LeetCode data.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      <CardShell
        title="LeetCode"
        subtitle={`@${LEETCODE_USER}`}
        icon={Code2}
        href={`https://leetcode.com/${LEETCODE_USER}/`}
      >
        {error ? (
          <ErrorState message={error} />
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile icon={Trophy} label="Solved" value={data?.totalSolved ?? null} loading={!data} />
              <StatTile
                icon={Activity}
                label="Acceptance"
                value={data ? `${data.acceptanceRate}%` : null}
                loading={!data}
                accent="cyan"
              />
              <StatTile
                icon={Users}
                label="Global Rank"
                value={data?.ranking ?? null}
                loading={!data}
                accent="blue"
              />
              <StatTile
                icon={Star}
                label="Reputation"
                value={data?.reputation ?? null}
                loading={!data}
                accent="cyan"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <DifficultyRow
                label="Easy"
                solved={data?.easySolved}
                total={data?.totalEasy}
                color="from-brand-green to-brand-cyan"
              />
              <DifficultyRow
                label="Medium"
                solved={data?.mediumSolved}
                total={data?.totalMedium}
                color="from-yellow-400 to-orange-400"
              />
              <DifficultyRow
                label="Hard"
                solved={data?.hardSolved}
                total={data?.totalHard}
                color="from-rose-400 to-red-500"
              />
            </div>

            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Submission Calendar · 52 weeks
              </div>
              <LeetHeatmap calendar={data?.submissionCalendar ?? null} />
            </div>
          </div>
        )}
      </CardShell>
    </motion.div>
  );
}

function DifficultyRow({
  label,
  solved,
  total,
  color,
}: {
  label: string;
  solved?: number;
  total?: number;
  color: string;
}) {
  const pct = solved != null && total ? Math.min(100, Math.round((solved / total) * 100)) : 0;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {solved != null && total ? `${solved} / ${total}` : "—"}
        </span>
      </div>
      <div className="mt-2 font-display text-xl font-bold text-foreground">
        {solved != null ? solved : <span className="inline-block h-6 w-10 animate-pulse rounded bg-white/5" />}
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={`h-full rounded-full bg-linear-to-r ${color}`}
        />
      </div>
    </div>
  );
}

function LeetHeatmap({ calendar }: { calendar: Record<string, number> | null }) {
  if (!calendar) {
    return <div className="h-[92px] w-full animate-pulse rounded-lg bg-white/5" />;
  }
  const now = Math.floor(Date.now() / 1000);
  const weeks = 52;
  const startDate = new Date((now - weeks * 7 * 86400) * 1000);
  startDate.setUTCHours(0, 0, 0, 0);
  const dow = startDate.getUTCDay();
  startDate.setUTCDate(startDate.getUTCDate() - dow);

  const cells: { ts: number; count: number }[] = [];
  const totalDays = (weeks + 1) * 7;
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + i);
    const key = Math.floor(d.getTime() / 1000).toString();
    cells.push({ ts: d.getTime(), count: Number(calendar[key] ?? 0) });
  }

  const max = cells.reduce((m, c) => Math.max(m, c.count), 0);
  const levelFor = (n: number) => {
    if (n <= 0 || max <= 0) return 0;
    const r = n / max;
    if (r > 0.75) return 4;
    if (r > 0.5) return 3;
    if (r > 0.25) return 2;
    return 1;
  };
  const levelClass = (lvl: number) =>
    [
      "bg-white/5",
      "bg-brand-blue/25",
      "bg-brand-blue/45",
      "bg-brand-blue/70",
      "bg-brand-blue",
    ][lvl];

  const weeksArr: { ts: number; count: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeksArr.push(cells.slice(i, i + 7));

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px]" role="img" aria-label="LeetCode submission heatmap">
        {weeksArr.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {w.map((c, di) => (
              <span
                key={di}
                title={`${new Date(c.ts).toISOString().slice(0, 10)}: ${c.count} submissions`}
                className={`h-[10px] w-[10px] rounded-[2px] ${levelClass(levelFor(c.count))}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stats() {
  return (
    <Section
      id="stats"
      eyebrow="Live Coding Stats"
      title={
        <>
          Numbers that keep me <span className="text-gradient">building.</span>
        </>
      }
      intro="Real-time GitHub and LeetCode activity — fetched live, never hardcoded."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <GitHubSection />
        <LeetCodeSection />
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title={
        <>
          Roles &amp; <span className="text-gradient">contributions.</span>
        </>
      }
    >
      <div className="glass flex items-start gap-4 rounded-2xl p-6">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-blue/15 text-brand-blue">
          <Briefcase className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-semibold">Student Developer Club — Volunteer</h3>
            <span className="font-mono text-xs text-muted-foreground">Ongoing</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Volunteering with the campus developer community — organizing sessions,
            supporting peers, and sharing what I learn about Java, Cloud, and Automation.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contact                                                                    */
/* -------------------------------------------------------------------------- */

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title={
        <>
          Let's build <span className="text-gradient">something.</span>
        </>
      }
      intro="Have an opportunity, project, or idea? Drop a message — I reply fast."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="glass group flex items-center gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-white/20"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-brand-green transition-colors group-hover:bg-brand-green/15">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm font-semibold">{s.label}</div>
                <div className="truncate text-xs text-muted-foreground">{s.handle}</div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-green" />
            </a>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setTimeout(() => setSent(false), 3500);
            (e.currentTarget as HTMLFormElement).reset();
          }}
          className="glass rounded-2xl p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Name</span>
              <input
                required
                name="name"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green/60"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Email</span>
              <input
                required
                type="email"
                name="email"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green/60"
                placeholder="you@email.com"
              />
            </label>
          </div>
          <label className="mt-4 grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Subject</span>
            <input
              name="subject"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green/60"
              placeholder="What's this about?"
            />
          </label>
          <label className="mt-4 grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Message</span>
            <textarea
              required
              name="message"
              rows={5}
              className="resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green/60"
              placeholder="Tell me a bit more..."
            />
          </label>
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Or email me directly at{" "}
              <span className="text-foreground">appubdm06@gmail.com</span>
            </p>
            <button
              type="submit"
              className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-green to-brand-cyan px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-brand-green/20 transition-all hover:shadow-[0_0_30px_-8px_var(--brand-green)]"
            >
              {sent ? "Sent!" : "Send Message"}
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                     */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="relative mt-12 border-t border-white/5 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-linear-to-br from-brand-green to-brand-blue font-display text-xs font-bold text-background">
            PK
          </span>
          <span>Designed &amp; Developed by <span className="text-foreground">Pappu Kumar</span></span>
        </div>
        <div className="flex items-center gap-3">
          {SOCIALS.slice(1).map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-brand-green/40 hover:text-brand-green"
              aria-label={s.label}
            >
              <s.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} — Built with love in India</p>
      </div>
    </footer>
  );
}

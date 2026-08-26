import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import profilePhoto from "@/assets/pappu-kumar.png";
import skillforgeBanner from "@/assets/skillforge-banner.png";
import { CreativeStudio } from "@/components/CreativeStudio";
import { Canvas3D } from "@/components/3d/Canvas3D";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { fetchGitHubStatsServer, type GhUser, type GhRepo, type ContribDay } from "@/lib/github";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import emailjs from "@emailjs/browser";
import certificatesData from "../data/certificates.json";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Cloud,
  Code2,
  Cpu,
  Download,
  CheckCircle2,
  Eye,
  Loader2,
  Flame,
  GitFork,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Rocket,
  Search,
  Sun,
  ArrowUp,
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

/* -------------------------------------------------------------------------- */
/*  Theme hook                                                                 */
/* -------------------------------------------------------------------------- */

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
    } catch {
      /* ignore storage access restriction */
    }
    return true; // default dark
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      /* ignore storage access restriction */
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}

/* -------------------------------------------------------------------------- */
/*  Visitor Counter hook & component                                           */
/* -------------------------------------------------------------------------- */

function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const STORAGE_KEY = "portfolio_visitor_count";
    const SESSION_KEY = "portfolio_visited_session";
    const BASELINE_COUNT = 0;

    let current = BASELINE_COUNT;
    try {
      current = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      if (isNaN(current) || current < BASELINE_COUNT) {
        current = BASELINE_COUNT;
      }

      const hasVisitedSession = sessionStorage.getItem(SESSION_KEY);
      if (!hasVisitedSession) {
        current += 1;
        localStorage.setItem(STORAGE_KEY, current.toString());
        sessionStorage.setItem(SESSION_KEY, "true");
      }
    } catch {
      /* ignore storage access restriction */
    }

    setCount(current);

    fetch("https://api.counterapi.dev/v1/immpappu-portfolio/visitors/up")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count === "number" && data.count > 0) {
          const apiCount = Math.max(data.count, current);
          setCount(apiCount);
          try {
            localStorage.setItem(STORAGE_KEY, apiCount.toString());
          } catch {
            /* ignore storage access restriction */
          }
        }
      })
      .catch(() => {
        /* Fallback seamlessly to local session counter */
      });
  }, []);

  return count;
}

function VisitorBadge({ className = "" }: { className?: string }) {
  const count = useVisitorCount();

  return (
    <div
      title="Total site visitors"
      aria-label="Visitor count"
      className={`inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 px-2.5 py-1 font-mono text-xs font-medium text-brand-green shadow-xs transition-all hover:border-brand-green/50 hover:bg-brand-green/15 ${className}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-green" />
      </span>
      <Users className="h-3.5 w-3.5" />
      <span>{count !== null ? count.toLocaleString() : "..."}</span>
    </div>
  );
}

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
  { id: "creative", label: "Creative" },
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
    skills: ["React", "JavaScript", "HTML", "CSS"],
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
    skills: ["n8n", "Gemini API", "YouTube Data API", "Google Sheets API", "Google Drive API"],
  },
  {
    title: "Tools",
    icon: Wrench,
    color: "blue",
    skills: ["VS Code", "IntelliJ IDEA", "GitHub Desktop", "Canva", "Adobe Photoshop", "n8n"],
  },
];

type Project = {
  title: string;
  category: "Automation" | "Web" | "AI";
  description: string;
  stack: string[];
  highlights: string[];
  status: "Live" | "In Progress";
  featured?: boolean;
  demoUrl?: string;
  githubUrl?: string;
  isWorkflowProject?: boolean;
  workflowUrl?: string;
  workflowArchitecture?: string[];
  longDescription?: string;
  problemStatement?: string;
  challengesSolved?: string[];
  featuresList?: string[];
  imageUrl?: string;
  hackathonBadge?: string;
  developmentWindow?: string;
};

const PROJECTS: Project[] = [
  {
    title: "SkillForge",
    category: "Web",
    featured: true,
    hackathonBadge: "⚡ Built in 10 Hours",
    description:
      "SkillForge is a full-stack student career development platform that helps students build and track their career journey through skill tracking, learning roadmaps, technical assessments, project management and personalized progress monitoring. Built from scratch and deployed during a 10-hour one-day hackathon.",
    longDescription:
      "SkillForge is a full-stack student career development platform designed to help students build and track their career journey through structured skill tracking, role selection, learning roadmaps, technical assessments, project management, and personalized progress monitoring. SkillForge combines authentication, student profiles, skill tracking, learning roadmaps, assessments, project management, progress monitoring and a responsive dashboard in one platform.",
    problemStatement:
      "Hackathon Challenge: Build and deploy a functional student-focused career development platform within a single 10-hour development window (Sunday, 9 August 2026 · 9:00 AM – 7:00 PM).",
    developmentWindow: "9 August 2026 · 9:00 AM – 7:00 PM (10-Hour Development Window)",
    stack: [
      "React",
      "Vite",
      "JavaScript",
      "React Router",
      "Supabase",
      "PostgreSQL",
      "Supabase Auth",
      "Supabase Storage",
      "Row Level Security",
      "Vercel",
      "GitHub",
    ],
    highlights: [
      "Student profile & target role selection",
      "Skill tracking, learning roadmaps & technical assessments",
      "Built & deployed in a 10-hour one-day hackathon",
    ],
    featuresList: [
      "Student profile management",
      "Target career role selection",
      "Technical skill tracking and progress monitoring",
      "Structured learning roadmap",
      "Technical assessments with scoring",
      "Assessment attempt tracking",
      "Project management with GitHub & Live Demo links",
      "Supabase Authentication & Storage for profile photos",
      "Row Level Security & user-specific data management",
      "Responsive student dashboard",
    ],
    challengesSolved: [
      "Hackathon Window: Built from scratch and deployed within 10 hours (9:00 AM – 7:00 PM).",
      "Full-Stack Integration: Configured PostgreSQL schema, Row Level Security (RLS) policies, and Supabase Storage for profile photos.",
      "Assessment & Progress Pipeline: Engine for technical assessments, attempt tracking, and structured role-based learning roadmaps.",
      "Future Development: Future development may include Gemini-powered personalized roadmaps, AI-generated assessments and intelligent learning recommendations.",
    ],
    status: "Live",
    demoUrl: "https://skillforge-immpappu.vercel.app",
    githubUrl: "https://github.com/ImmPappu/SkillForge",
    imageUrl: skillforgeBanner,
  },
  {
    title: "InfinityFitAI",
    category: "AI",
    featured: true,
    description:
      "Modern AI-assisted fitness & nutrition app providing BMI, BMR, TDEE & water calculators, meal planning, workout recommendations, yoga guidance, and PDF health reports.",
    longDescription:
      "InfinityFitAI is a modern AI-assisted fitness and nutrition web application designed to empower users with personalized health analytics. It calculates critical biometric metrics including BMI, BMR, TDEE, daily calorie intake, protein requirements, and water intake while offering tailored meal planning, workout guidance, yoga routines, and downloadable PDF health reports.",
    problemStatement:
      "Tracking accurate fitness metrics, computing TDEE/BMR precisely, and receiving customized nutrition or workout advice typically requires multiple fragmented tools or expensive subscriptions. InfinityFitAI unifies biometric calculations, meal planning, workout guidance, and exportable PDF reports into one responsive, PWA-enabled application.",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vite",
      "Framer Motion",
      "jsPDF",
      "html2canvas",
      "PWA",
      "Netlify",
    ],
    highlights: [
      "BMI, BMR & TDEE Biometric Calculators",
      "Personalized Meal Planner & Yoga Guidance",
      "Downloadable PDF Health Reports & PWA Support",
    ],
    featuresList: [
      "BMI, BMR & TDEE Calculator",
      "Daily Protein & Water Requirement Calculator",
      "Personalized Meal Planner",
      "Workout Recommendations",
      "Yoga Guidance",
      "Nutrition Dashboard",
      "Downloadable PDF Health Report",
      "Responsive Design",
      "Progressive Web App (PWA)",
      "Multi-language Support",
      "SEO Optimized",
    ],
    challengesSolved: [
      "Redesigned the UI from a dark theme to a clean modern interface.",
      "Fixed responsive layout issues across multiple screen sizes.",
      "Debugged and fixed PDF export generation using jsPDF and html2canvas.",
      "Resolved TypeScript build and deployment issues.",
      "Improved application performance and user experience.",
    ],
    status: "Live",
    demoUrl: "https://infinityfitai.netlify.app/",
    githubUrl: "https://github.com/ImmPappu/InfinityfitAI",
    imageUrl: "/infinityfit-ai.png",
  },
  {
    title: "AI Powered YouTube Automation System",
    category: "AI",
    isWorkflowProject: true,
    description:
      "An end-to-end n8n automation workflow for automating the YouTube publishing process.",
    longDescription:
      "An end-to-end n8n automation workflow for automating the YouTube publishing process, featuring AI video analysis, automated metadata generation, thumbnail creation, YouTube publishing, Google Sheets tracking, and Telegram status notifications.",
    stack: [
      "n8n",
      "Gemini API",
      "Google Drive API",
      "Google Sheets API",
      "YouTube Data API",
      "Telegram API",
    ],
    highlights: [
      "Video input from Google Drive & AI analysis",
      "Automated YouTube metadata & thumbnail generation",
      "Google Sheets tracking & Telegram notifications",
    ],
    featuresList: [
      "Video input from Google Drive",
      "AI-powered video/content analysis",
      "AI-generated YouTube title",
      "AI-generated description",
      "AI-generated tags",
      "Automated thumbnail generation",
      "Automated YouTube upload",
      "Google Sheets workflow tracking",
      "Telegram status notifications",
    ],
    workflowArchitecture: [
      "Video",
      "Google Drive",
      "n8n",
      "Gemini AI",
      "Title + Description + Tags",
      "Thumbnail Generation",
      "YouTube Upload",
      "Google Sheets",
      "Telegram Notification",
    ],
    challengesSolved: [
      "Visual n8n Automation: Orchestrated an automated end-to-end publishing pipeline connecting drive files, AI generation, and webhooks.",
      "SEO Metadata Optimization: Configured Gemini API prompt templates to extract key topics and auto-generate high-converting titles, descriptions, and tags.",
      "Real-time Monitoring: Integrated Telegram webhook triggers to deliver instant upload logs and status alerts directly to mobile.",
    ],
    status: "Live",
    imageUrl: "/youtube-automation-banner.png",
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
    demoUrl: "https://portfolio-immpappu.vercel.app/",
    githubUrl: "https://github.com/ImmPappu/Portfolio-immpappu",
    imageUrl: "/portfolio-banner.png",
  },
];

const PROJECT_FILTERS = ["All", "AI", "Automation", "Web"] as const;

const TIMELINE = [
  { title: "Java", detail: "Fell in love with the language & OOP fundamentals." },
  { title: "DSA", detail: "Sharpened problem-solving with data structures & algorithms." },
  { title: "AWS", detail: "Explored cloud computing — earned Cloud Practitioner." },
  { title: "DevOps", detail: "Learning Docker, Kubernetes, and CI/CD pipelines." },
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
    href: "https://instagram.com/immpappu",
    icon: Instagram,
    handle: "@immpappu",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page new                                                                       */
/* -------------------------------------------------------------------------- */

function PortfolioPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Lenis smooth scrolling — respects reduced-motion, disabled on touch
  useEffect(() => {
    if (typeof window === "undefined") return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let mounted = true;
    import("lenis").then(({ default: Lenis }) => {
      if (!mounted) return;
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }) as unknown as { raf: (t: number) => void; destroy: () => void };
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.2 });

  return (
    <>
      <AnimatePresence>{!loaded && <LoadingOverlay />}</AnimatePresence>

      <Canvas3D />
      <ScrollProgress />

      <ParticlesBackground />

      <Nav />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <CreativeStudio />
        <Timeline />
        <Certifications />
        <Stats />
        <Experience />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
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
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-brand-green to-brand-blue font-display text-xl font-bold text-background shadow-[0_0_60px_-10px_var(--brand-green)]"
      >
        PK
        <span className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-brand-green to-brand-blue blur-2xl opacity-60" />
      </motion.div>
      <div className="relative h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-brand-green to-transparent"
        />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
        Pappu Kumar
      </p>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Particles                                                                  */
/* -------------------------------------------------------------------------- */

function ParticlesBackground() {
  const reduce = useReducedMotion();
  const dots = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 10 + 14,
        delay: Math.random() * 5,
        blue: Math.random() > 0.5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* Aurora — animated gradient sweep */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, oklch(0.82 0.19 152 / 0.18), oklch(0.68 0.18 240 / 0.18), oklch(0.82 0.13 200 / 0.15), oklch(0.82 0.19 152 / 0.18))",
            filter: "blur(60px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Floating blurred blobs */}
      <motion.div
        className="absolute left-[15%] top-[20%] h-[520px] w-[520px] rounded-full bg-brand-blue/20 blur-[130px] transform-gpu will-change-transform"
        animate={reduce ? undefined : { x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[5%] right-[5%] h-[520px] w-[520px] rounded-full bg-brand-green/15 blur-[140px] transform-gpu will-change-transform"
        animate={reduce ? undefined : { x: [0, -40, 20, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particles */}
      {!reduce &&
        dots.map((d) => (
          <motion.span
            key={d.id}
            className={`absolute rounded-full transform-gpu ${d.blue ? "bg-brand-blue" : "bg-brand-green"}`}
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

function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative h-8 w-[54px] shrink-0 cursor-pointer rounded-full p-[3px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
      style={{
        background: isDark
          ? "linear-gradient(135deg, oklch(0.18 0.05 270), oklch(0.23 0.06 250))"
          : "linear-gradient(135deg, oklch(0.97 0.07 80), oklch(0.93 0.11 70))",
        border: isDark ? "1px solid oklch(1 0 0 / 14%)" : "1px solid oklch(0.82 0.14 75 / 55%)",
        boxShadow: isDark
          ? "inset 0 1px 4px oklch(0 0 0 / 50%)"
          : "inset 0 1px 3px oklch(0.7 0.1 75 / 30%), 0 0 14px -3px oklch(0.82 0.18 75 / 45%)",
      }}
    >
      {/* Stars — visible in dark mode */}
      <AnimatePresence>
        {isDark && (
          <motion.span
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute right-[9px] top-1/2 flex -translate-y-1/2 flex-col gap-[3.5px]"
          >
            <span className="block h-[2.5px] w-[2.5px] rounded-full bg-white/60" />
            <span className="ml-[4px] block h-[2px] w-[2px] rounded-full bg-white/40" />
            <span className="block h-[2.5px] w-[2.5px] rounded-full bg-white/55" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Sun rays — visible in light mode */}
      <AnimatePresence>
        {!isDark && (
          <motion.span
            key="rays"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute left-[9px] top-1/2 -translate-y-1/2"
          >
            {[0, 45, 90, 135].map((deg) => (
              <span
                key={deg}
                className="absolute block h-[2.5px] w-[2.5px] rounded-full bg-amber-400/70"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%,-50%) rotate(${deg}deg) translateX(7px)`,
                }}
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Sliding thumb */}
      <motion.span
        className="relative flex h-[26px] w-[26px] items-center justify-center rounded-full"
        style={{
          background: isDark
            ? "linear-gradient(145deg, #e2e8f0, #cbd5e1)"
            : "linear-gradient(145deg, #ffffff, #fef3c7)",
          boxShadow: isDark
            ? "0 2px 6px oklch(0 0 0 / 55%), 0 0 0 0.5px oklch(1 0 0 / 18%)"
            : "0 2px 6px oklch(0.65 0.12 75 / 45%), 0 0 10px -1px oklch(0.82 0.18 75 / 55%)",
        }}
        animate={{ x: isDark ? 0 : 22 }}
        transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.55 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, scale: 0.3, rotate: -60 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.3, rotate: 60 }}
            transition={{ duration: 0.14 }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Moon className="h-[13px] w-[13px] text-slate-500" fill="currentColor" />
            ) : (
              <Sun className="h-[14px] w-[14px] text-amber-500" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("about");
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
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
            {NAV.map((n) => {
              const isActive = active === n.id;
              return (
                <li key={n.id} className="relative">
                  <a
                    href={`#${n.id}`}
                    className={`relative rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-linear-to-r from-brand-green to-brand-blue"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2.5 md:flex">
            <VisitorBadge />
            <ThemeToggle isDark={isDark} toggle={toggle} />
            <a
              href="#contact"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-brand-green to-brand-cyan px-4 py-2 text-sm font-medium text-background transition-all hover:shadow-[0_0_30px_-8px_var(--brand-green)]"
            >
              Let's talk
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <VisitorBadge />
            <ThemeToggle isDark={isDark} toggle={toggle} />
            <button
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/5"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
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
    <section id={id} className="section-contain relative scroll-mt-24 px-4 py-24 sm:py-32">
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
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="relative flex min-h-screen items-center px-4 pt-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-brand-green">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-green" />
            </span>
            Open to Internship Opportunities
          </div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            {["Hi,", "I'm"].map((w, i) => (
              <motion.span
                key={w + i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="mr-3 inline-block"
              >
                {w}
              </motion.span>
            ))}
            {["Pappu", "Kumar"].map((w, i) => (
              <motion.span
                key={w + i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.35 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="text-gradient mr-3 inline-block"
              >
                {w}
              </motion.span>
            ))}
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
              data-magnetic
              data-cursor="hover"
              className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-green to-brand-cyan px-5 py-3 text-sm font-semibold text-background shadow-lg shadow-brand-green/20 transition-all hover:shadow-[0_0_40px_-8px_var(--brand-green)] hover:-translate-y-0.5"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#creative"
              data-magnetic
              data-cursor="hover"
              aria-label="Navigate to Creative section"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-cyan/30 bg-brand-cyan/10 px-5 py-3 text-sm font-semibold text-brand-cyan transition-all hover:bg-brand-cyan/20 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-8px_var(--brand-cyan)]"
            >
              <Sparkles className="h-4 w-4" />
              Creative Work ↗
            </a>
            <a
              href="/Pappu_Resume.pdf"
              download="Pappu_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              data-magnetic
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition-all hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.35)]"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
            <a
              href="#contact"
              data-magnetic
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-blue/30 bg-brand-blue/10 px-5 py-3 text-sm font-semibold text-brand-blue transition-all hover:bg-brand-blue/20 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-8px_var(--brand-blue)]"
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

        {/* Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="relative order-first mx-auto w-full max-w-sm lg:order-none"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto aspect-square w-64 sm:w-80 lg:w-full"
          >
            <div className="absolute -inset-4 -z-10 rounded-full bg-linear-to-br from-brand-green/40 via-brand-cyan/20 to-brand-blue/40 opacity-60 blur-3xl" />
            <div className="glass-strong relative z-10 h-full w-full overflow-hidden rounded-full p-1.5 shadow-2xl shadow-brand-green/20 ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative z-10 h-full w-full overflow-hidden rounded-full">
                <img
                  src={profilePhoto}
                  alt="Pappu Kumar - Software Engineering Student"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={640}
                  height={640}
                  className="relative z-10 h-full w-full rounded-full object-cover object-center"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "50%",
                  }}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.endsWith("/pappu-kumar.png")) {
                      target.src = "/pappu-kumar.png";
                    }
                  }}
                />
                <div className="pointer-events-none absolute inset-0 z-20 rounded-full ring-1 ring-inset ring-white/10" />
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-brand-green/40 bg-background/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brand-green shadow-lg backdrop-blur">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-green" />
              Available
            </div>
          </motion.div>
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
          Curious builder, <span className="text-gradient">relentless learner.</span>
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
    ? "badge-learning border-yellow-400/40 bg-yellow-400/[0.10] text-yellow-300 hover:border-yellow-400/70 hover:text-yellow-200 hover:shadow-[0_0_20px_-6px_rgba(250,204,21,0.5)]"
    : color === "green"
      ? "border-brand-green/25 bg-brand-green/[0.06] text-foreground/90 hover:border-brand-green/60 hover:text-brand-green hover:shadow-[0_0_22px_-6px_var(--brand-green)]"
      : "border-brand-blue/25 bg-brand-blue/[0.06] text-foreground/90 hover:border-brand-blue/60 hover:text-brand-blue hover:shadow-[0_0_22px_-6px_var(--brand-blue)]";
  return (
    <span className={`${base} ${tone} hover:-translate-y-0.5`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          learning ? "bg-yellow-400" : color === "green" ? "bg-brand-green" : "bg-brand-blue"
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const filtered = PROJECTS.filter((p) => filter === "All" || p.category === filter);

  return (
    <>
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
              <TiltProjectCard
                key={p.title}
                project={p}
                index={i}
                onSelect={(proj) => setSelectedProject(proj)}
              />
            ))}
          </AnimatePresence>

          <motion.div
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

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </>
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
                  className={`glass rounded-2xl p-5 ${left ? "sm:mr-8 sm:text-right" : "sm:ml-8"}`}
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

/* -------------------------------------------------------------------------- */
/*  Certifications                                                             */
/* -------------------------------------------------------------------------- */

type CertificateItem = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  categories: string[];
  fileName: string;
  imagePath: string;
  downloadPath: string;
};

const CERT_CATEGORIES = [
  "All",
  "Cloud",
  "AWS",
  "Java",
  "Development",
  "Workshop",
  "Leadership",
  "Hackathon",
  "AI",
] as const;

function Certifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Filter & sort certificates (newest date first)
  const filteredCertificates = useMemo(() => {
    let result = [...(certificatesData as CertificateItem[])];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((cert) =>
        cert.categories.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase()),
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (cert) =>
          cert.title.toLowerCase().includes(q) ||
          cert.issuer.toLowerCase().includes(q) ||
          cert.description.toLowerCase().includes(q) ||
          cert.categories.some((cat) => cat.toLowerCase().includes(q)),
      );
    }

    // Sort newest date first
    return result.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }, [searchQuery, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setIsSearching(true);
    setSelectedCategory(category);
    setTimeout(() => setIsSearching(false), 180);
  };

  return (
    <Section
      id="certifications"
      eyebrow="Certifications"
      title={
        <>
          Courses, Workshops and <span className="text-gradient">Professional Learning.</span>
        </>
      }
      intro="Verified completion credentials automatically recognized and displayed."
    >
      <div className="space-y-6">
        {/* Controls: Search Bar & Category Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates by title, issuer, keyword..."
              className="glass w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none focus:ring-1 focus:ring-brand-green/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {CERT_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
                    active
                      ? "bg-linear-to-r from-brand-green to-brand-cyan font-semibold text-background shadow-md shadow-brand-green/20"
                      : "border border-white/10 bg-white/[0.04] text-muted-foreground hover:border-white/20 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Cards Responsive Grid (Desktop 4 col, Laptop 3 col, Tablet 2 col, Mobile 1 col) */}
        {isSearching ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="glass flex h-[380px] flex-col overflow-hidden rounded-2xl p-4 animate-pulse"
              >
                <div className="h-44 w-full rounded-xl bg-white/5" />
                <div className="mt-4 h-5 w-3/4 rounded-md bg-white/5" />
                <div className="mt-2 h-4 w-1/2 rounded-md bg-white/5" />
                <div className="mt-4 h-12 w-full rounded-md bg-white/5" />
              </div>
            ))}
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center">
            <Award className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
            <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
              No certificates found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search query or filter category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-xl border border-brand-green/40 bg-brand-green/10 px-4 py-2 font-mono text-xs text-brand-green hover:bg-brand-green/20 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredCertificates.map((cert, index) => (
                <motion.article
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:border-brand-green/40 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),0_0_20px_-8px_var(--brand-green)] transform-gpu"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/40 border-b border-white/10">
                    <img
                      src={cert.imagePath}
                      alt={cert.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-3 py-1.5 text-xs font-semibold text-background shadow-lg transition-transform hover:scale-105"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-green">
                        {cert.issuer}
                      </span>
                      {cert.issueDate && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground shrink-0">
                          <Calendar className="h-3 w-3" />
                          {cert.issueDate}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 font-display text-base font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-brand-green transition-colors">
                      {cert.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2 flex-1">
                      {cert.description}
                    </p>

                    {/* Category tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {cert.categories.map((cat) => (
                        <span
                          key={cat}
                          className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-brand-green/20 to-brand-cyan/20 px-3 py-2 font-mono text-xs font-semibold text-brand-green border border-brand-green/30 transition-all hover:bg-brand-green/30"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Certificate
                      </button>

                      <a
                        href={cert.imagePath}
                        target="_blank"
                        rel="noreferrer"
                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
                        title="Open in new tab"
                        aria-label="Open certificate in new tab"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>

                      <a
                        href={cert.downloadPath}
                        download={cert.fileName}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
                        title="Download Certificate"
                        aria-label="Download certificate"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Certificate Modal Lightbox */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-strong relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-green" />
                  <span className="font-display font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                    {selectedCert.title}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Certificate Image Preview */}
              <div className="relative max-h-[60vh] overflow-hidden bg-black/60 p-4 flex items-center justify-center">
                <img
                  src={selectedCert.imagePath}
                  alt={selectedCert.title}
                  className="max-h-[55vh] w-auto max-w-full rounded-lg object-contain shadow-xl"
                />
              </div>

              {/* Certificate Info & Actions */}
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-brand-green">
                      {selectedCert.issuer}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                      {selectedCert.title}
                    </h3>
                  </div>
                  {selectedCert.issueDate && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted-foreground">
                      Issued: {selectedCert.issueDate}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {selectedCert.description}
                </p>

                {/* Footer Buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <a
                    href={selectedCert.imagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs font-semibold text-foreground hover:bg-white/10 transition-all"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Open in new tab
                  </a>
                  <a
                    href={selectedCert.downloadPath}
                    download={selectedCert.fileName}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-green to-brand-cyan px-5 py-2.5 font-mono text-xs font-semibold text-background shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats (GitHub + LeetCode)                                                  */
/* -------------------------------------------------------------------------- */

const GITHUB_USER = "ImmPappu";
const LEETCODE_USER = "immpappu";
const GFG_USER = "immpappu";
const GFG_PROFILE_URL = `https://www.geeksforgeeks.org/user/${GFG_USER}/`;

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
    loading || value == null ? null : numeric != null ? animated.toLocaleString() : value;
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
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-2xl p-6">
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

/** Compute current LeetCode streak from submissionCalendar (unix-second keys). */
function computeLcStreak(calendar: Record<string, number>): number {
  if (!calendar || Object.keys(calendar).length === 0) return 0;
  const dayS = 86400;
  const nowS = Math.floor(Date.now() / 1000);
  const todayStart = nowS - (nowS % dayS);
  let streak = 0;
  let d = todayStart;
  // If no submission today, start counting from yesterday
  if (!calendar[d.toString()]) d -= dayS;
  while (calendar[d.toString()]) {
    streak++;
    d -= dayS;
  }
  return streak;
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

    // 1. Session Storage Caching (6-hour TTL)
    const CACHE_KEY = `gh-stats-${GITHUB_USER}`;
    const CACHE_TTL = 1000 * 60 * 60 * 6;
    try {
      const cached = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(CACHE_KEY) : null;
      if (cached) {
        const parsed = JSON.parse(cached) as { t: number; u: GhUser; r: GhRepo[]; c: ContribDay[] };
        if (Date.now() - parsed.t < CACHE_TTL) {
          setUser(parsed.u);
          setRepos(parsed.r);
          setContrib(parsed.c);
          return;
        }
      }
    } catch {
      /* ignore storage access error */
    }

    // 2. Fetch using Server Function (or fallback)
    (async () => {
      try {
        const serverData = await fetchGitHubStatsServer();
        if (cancelled) return;

        if (serverData && (serverData.user || serverData.repos)) {
          if (serverData.user) setUser(serverData.user);
          if (serverData.repos) setRepos(serverData.repos);
          setContrib(serverData.contrib ?? []);

          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                t: Date.now(),
                u: serverData.user,
                r: serverData.repos,
                c: serverData.contrib ?? [],
              }),
            );
          } catch {
            /* ignore storage access error */
          }
          return;
        }

        // Direct browser fallback with Promise.allSettled
        const results = await Promise.allSettled([
          fetch(`https://api.github.com/users/${GITHUB_USER}`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`),
        ]);

        const uRes = results[0].status === "fulfilled" ? results[0].value : null;
        const rRes = results[1].status === "fulfilled" ? results[1].value : null;
        const cRes = results[2].status === "fulfilled" ? results[2].value : null;

        let uJson: GhUser | null = null;
        let rJson: GhRepo[] | null = null;
        let cJsonList: ContribDay[] = [];

        if (uRes && uRes.ok) {
          uJson = await uRes.json();
        } else if (uRes) {
          console.warn(`[GitHub API User Error] Status: ${uRes.status} ${uRes.statusText}`);
        }

        if (rRes && rRes.ok) {
          rJson = await rRes.json();
        } else if (rRes) {
          console.warn(`[GitHub API Repos Error] Status: ${rRes.status} ${rRes.statusText}`);
        }

        if (cRes && cRes.ok) {
          const cData = await cRes.json();
          cJsonList = cData?.contributions ?? [];
        }

        if (cancelled) return;

        if (uJson) setUser(uJson);
        if (rJson) setRepos(rJson);
        setContrib(cJsonList);

        if (!uJson && !rJson) {
          console.warn("[GitHub API Rate Limited] Direct browser fallback also rate limited.");
          setError("GitHub data temporarily unavailable");
        } else if (uJson && rJson) {
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ t: Date.now(), u: uJson, r: rJson, c: cJsonList }),
            );
          } catch {
            /* ignore storage access error */
          }
        }
      } catch (err) {
        console.error("[GitHub API Fetch Exception]", err);
        if (!cancelled) setError("GitHub data temporarily unavailable");
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
      className="h-full"
    >
      <CardShell
        title={user?.name ?? "GitHub"}
        subtitle={`@${GITHUB_USER}`}
        icon={Github}
        href={`https://github.com/${GITHUB_USER}`}
      >
        {error && !user ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <Github className="h-6 w-6 text-brand-green shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">@ImmPappu on GitHub</div>
                  <div className="mt-0.5 text-[11px]">{error}</div>
                </div>
              </div>
            </div>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand-green/50 hover:bg-brand-green/10 hover:text-brand-green"
            >
              View GitHub Profile
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-between gap-5">
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
                <StatTile
                  icon={BookOpen}
                  label="Repos"
                  value={user?.public_repos ?? null}
                  loading={!user}
                />
                <StatTile
                  icon={Star}
                  label="Stars"
                  value={stars}
                  loading={stars === null}
                  accent="cyan"
                />
                <StatTile
                  icon={Users}
                  label="Followers"
                  value={user?.followers ?? null}
                  loading={!user}
                  accent="blue"
                />
                <StatTile
                  icon={GitFork}
                  label="Following"
                  value={user?.following ?? null}
                  loading={!user}
                  accent="blue"
                />
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

            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub profile in a new tab"
              className="mt-auto group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand-green/50 hover:bg-brand-green/10 hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60"
            >
              View GitHub Profile
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
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
    ["bg-white/5", "bg-brand-green/25", "bg-brand-green/45", "bg-brand-green/70", "bg-brand-green"][
      lvl
    ] ?? "bg-white/5";

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
    const CACHE_KEY = `lc-stats-${LEETCODE_USER}`;
    const CACHE_TTL = 1000 * 60 * 60 * 6; // 6h
    try {
      const cached =
        typeof sessionStorage !== "undefined" ? sessionStorage.getItem(CACHE_KEY) : null;
      if (cached) {
        const parsed = JSON.parse(cached) as { t: number; d: LcStats };
        if (Date.now() - parsed.t < CACHE_TTL) setData(parsed.d);
      }
    } catch {
      /* ignore storage/fetch error */
    }

    const endpoints = [
      `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USER}`,
      `https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USER}`,
    ];

    const normalizeLc = async (url: string): Promise<LcStats> => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("bad status");
      const raw = await res.json();
      if (raw?.errors || raw?.error) throw new Error("api error");
      const totalSolved = raw.totalSolved ?? raw.solvedProblem ?? 0;
      if (!totalSolved && !raw.easySolved) throw new Error("no data");
      return {
        status: "success",
        totalSolved,
        totalQuestions: raw.totalQuestions ?? 0,
        easySolved: raw.easySolved ?? 0,
        totalEasy: raw.totalEasy ?? 0,
        mediumSolved: raw.mediumSolved ?? 0,
        totalMedium: raw.totalMedium ?? 0,
        hardSolved: raw.hardSolved ?? 0,
        totalHard: raw.totalHard ?? 0,
        acceptanceRate: 0,
        ranking: raw.ranking ?? 0,
        contributionPoints: raw.contributionPoint ?? raw.contributionPoints ?? 0,
        reputation: raw.reputation ?? 0,
        submissionCalendar: raw.submissionCalendar ?? {},
      };
    };

    Promise.any(endpoints.map(normalizeLc))
      .then((normalized) => {
        if (cancelled) return;
        setData(normalized);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: normalized }));
        } catch {
          /* ignore storage/fetch error */
        }
      })
      .catch(() => {
        if (!cancelled) setError("Unable to fetch LeetCode data right now.");
      });
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
      className="h-full"
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
          <div className="flex flex-1 flex-col justify-between gap-5">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <StatTile
                  icon={Trophy}
                  label="Total Solved"
                  value={data?.totalSolved ?? null}
                  loading={!data}
                />
                <StatTile
                  icon={Flame}
                  label="Current Streak"
                  value={data ? `${computeLcStreak(data.submissionCalendar)}d` : null}
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
                  Submission Heatmap · last 26 weeks
                </div>
                <LcHeatmap calendar={data?.submissionCalendar ?? null} />
              </div>
            </div>

            <a
              href={`https://leetcode.com/${LEETCODE_USER}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LeetCode profile in a new tab"
              className="mt-auto group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand-cyan/50 hover:bg-brand-cyan/10 hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60"
            >
              View LeetCode Profile
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        )}
      </CardShell>
    </motion.div>
  );
}

function LcHeatmap({ calendar }: { calendar: Record<string, number> | null }) {
  if (!calendar) {
    return <div className="h-[92px] w-full animate-pulse rounded-lg bg-white/5" />;
  }

  // Build last 26 weeks of cells from unix-second keyed dict
  const now = Math.floor(Date.now() / 1000);
  const WEEKS = 26;
  const startSec = now - WEEKS * 7 * 86400;
  // Align start to the Sunday of that week
  const startDate = new Date(startSec * 1000);
  startDate.setUTCHours(0, 0, 0, 0);
  startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());

  const cells: { dateStr: string; count: number }[] = [];
  const totalDays = WEEKS * 7;
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + i);
    const key = Math.floor(d.getTime() / 1000).toString();
    cells.push({
      dateStr: d.toISOString().slice(0, 10),
      count: Number(calendar[key] ?? 0),
    });
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
  // LeetCode orange palette
  const levelClass = (lvl: number) =>
    ["bg-white/5", "bg-orange-500/25", "bg-orange-500/45", "bg-orange-500/70", "bg-orange-500"][
      lvl
    ] ?? "bg-white/5";

  // Group into weeks (columns)
  const weeks: { dateStr: string; count: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const totalSubmissions = cells.reduce((s, c) => s + c.count, 0);
  const activeDays = cells.filter((c) => c.count > 0).length;

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]" role="img" aria-label="LeetCode submission heatmap">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {w.map((c, di) => (
                <span
                  key={di}
                  title={`${c.dateStr}: ${c.count} submission${c.count !== 1 ? "s" : ""}`}
                  className={`h-[10px] w-[10px] rounded-[2px] transition-opacity hover:opacity-80 ${levelClass(levelFor(c.count))}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Legend row */}
      <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
        <span>
          {totalSubmissions} submissions · {activeDays} active days
        </span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span key={lvl} className={`h-[9px] w-[9px] rounded-[2px] ${levelClass(lvl)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
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
        {solved != null ? (
          solved
        ) : (
          <span className="inline-block h-6 w-10 animate-pulse rounded bg-white/5" />
        )}
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

/* ---------- GeeksforGeeks ---------- */

type GfgStats = {
  totalSolved: number | null;
  codingScore: number | null;
  instituteRank: number | null;
  currentStreak: number | null;
  maxStreak: number | null;
  monthlyScore: number | null;
  easy: number | null;
  medium: number | null;
  hard: number | null;
};

function pickNumber(...vals: unknown[]): number | null {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
    if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v)) && Number(v) > 0)
      return Number(v);
  }
  return null;
}

function normalizeGfg(raw: unknown): GfgStats | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const info = (r.info ?? r.data ?? r) as Record<string, unknown>;
  const solved = (r.solvedStats ?? r.solved_stats ?? {}) as Record<string, unknown>;
  const bucket = (name: string) => {
    const b = solved[name];
    if (b && typeof b === "object") {
      const bb = b as Record<string, unknown>;
      return pickNumber(bb.count, bb.solved, bb.total);
    }
    return null;
  };
  const stats: GfgStats = {
    totalSolved: pickNumber(
      info.totalProblemsSolved,
      info.total_problems_solved,
      info.problemsSolved,
    ),
    codingScore: pickNumber(info.codingScore, info.coding_score, info.score),
    instituteRank: pickNumber(info.instituteRank, info.institute_rank),
    currentStreak: pickNumber(
      info.currentStreak,
      info.current_streak,
      info.pod_solved_longest_streak,
    ),
    maxStreak: pickNumber(info.maxStreak, info.max_streak, info.longestStreak),
    monthlyScore: pickNumber(info.monthlyCodingScore, info.monthly_coding_score),
    easy: bucket("easy") ?? bucket("Easy"),
    medium: bucket("medium") ?? bucket("Medium"),
    hard: bucket("hard") ?? bucket("Hard"),
  };
  const anyValue = Object.values(stats).some((v) => v != null);
  return anyValue ? stats : null;
}

function GfgSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [data, setData] = useState<GfgStats | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "fallback">("idle");

  useEffect(() => {
    if (!inView) return;
    const CACHE_KEY = `gfg-stats-${GFG_USER}`;
    const CACHE_TTL = 1000 * 60 * 60 * 6;
    try {
      const cached =
        typeof sessionStorage !== "undefined" ? sessionStorage.getItem(CACHE_KEY) : null;
      if (cached) {
        const parsed = JSON.parse(cached) as { t: number; d: GfgStats };
        if (Date.now() - parsed.t < CACHE_TTL) {
          setData(parsed.d);
          setStatus("success");
        }
      }
    } catch {
      /* ignore */
    }

    let cancelled = false;
    setStatus((s) => (s === "success" ? s : "loading"));

    const endpoints = [
      `https://geeks-for-geeks-api.vercel.app/${GFG_USER}`,
      `https://gfg-api-orpin.vercel.app/${GFG_USER}`,
    ];

    Promise.any(
      endpoints.map(async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error("bad status");
        const raw = await res.json();
        const normalized = normalizeGfg(raw);
        if (!normalized) throw new Error("no data");
        return normalized;
      }),
    )
      .then((normalized) => {
        if (cancelled) return;
        setData(normalized);
        setStatus("success");
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: normalized }));
        } catch {
          /* ignore storage/fetch error */
        }
      })
      .catch(() => {
        if (!cancelled) setStatus((s) => (s === "success" ? s : "fallback"));
      });

    return () => {
      cancelled = true;
    };
  }, [inView]);

  const tiles = useMemo(() => {
    if (!data)
      return [] as {
        icon: LucideIcon;
        label: string;
        value: number;
        accent?: "green" | "blue" | "cyan";
      }[];
    const list: {
      icon: LucideIcon;
      label: string;
      value: number;
      accent?: "green" | "blue" | "cyan";
    }[] = [];
    if (data.totalSolved != null)
      list.push({ icon: Trophy, label: "Solved", value: data.totalSolved });
    if (data.codingScore != null)
      list.push({ icon: Sparkles, label: "Coding Score", value: data.codingScore, accent: "cyan" });
    if (data.instituteRank != null)
      list.push({
        icon: Users,
        label: "Institute Rank",
        value: data.instituteRank,
        accent: "blue",
      });
    const streak = data.currentStreak ?? data.maxStreak;
    if (streak != null)
      list.push({
        icon: Flame,
        label: data.currentStreak != null ? "Current Streak" : "Longest Streak",
        value: streak,
        accent: "cyan",
      });
    if (data.monthlyScore != null && list.length < 4)
      list.push({
        icon: Activity,
        label: "Monthly Score",
        value: data.monthlyScore,
        accent: "blue",
      });
    return list.slice(0, 4);
  }, [data]);

  const showFallback = status === "fallback" && !data;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <CardShell
        title="GeeksforGeeks"
        subtitle={`@${GFG_USER} · Active Learner`}
        icon={BookOpen}
        href={GFG_PROFILE_URL}
      >
        <div className="flex flex-1 flex-col justify-between gap-5">
          <div className="flex flex-col gap-5">
            {showFallback ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-brand-green/20 bg-brand-green/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-green/15 text-brand-green">
                      <BookOpen className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">
                        Active GeeksforGeeks Profile
                      </p>
                      <p className="text-xs text-brand-green">Continuous Learner</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {status !== "success"
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <StatTile
                          key={i}
                          icon={Trophy}
                          label="Loading"
                          value={null}
                          loading
                          accent={i % 2 ? "cyan" : "green"}
                        />
                      ))
                    : tiles.map((t) => (
                        <StatTile
                          key={t.label}
                          icon={t.icon}
                          label={t.label}
                          value={t.value}
                          accent={t.accent}
                        />
                      ))}
                </div>

                {(status !== "success" ||
                  data?.easy != null ||
                  data?.medium != null ||
                  data?.hard != null) && (
                  <div className="grid grid-cols-3 gap-3">
                    <DifficultyRow
                      label="Easy"
                      solved={data?.easy ?? undefined}
                      color="from-brand-green to-brand-cyan"
                    />
                    <DifficultyRow
                      label="Medium"
                      solved={data?.medium ?? undefined}
                      color="from-yellow-400 to-orange-400"
                    />
                    <DifficultyRow
                      label="Hard"
                      solved={data?.hard ?? undefined}
                      color="from-rose-400 to-red-500"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <a
            href={GFG_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GeeksforGeeks profile in a new tab"
            className="mt-auto group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand-green/50 hover:bg-brand-green/10 hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60"
          >
            View GeeksforGeeks Profile
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </CardShell>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Coding Dashboard — summary bar                                             */
/* -------------------------------------------------------------------------- */

function CodingDashboardSummary() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [problemsSolved, setProblemsSolved] = useState<number | null>(null);
  const [ghContribs, setGhContribs] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;

    (async () => {
      // GitHub contributions (1 year)
      try {
        const CACHE_KEY = "gh-contribs-summary";
        const CACHE_TTL = 1000 * 60 * 60 * 6;
        let contribs: number | null = null;
        try {
          const cached =
            typeof sessionStorage !== "undefined" ? sessionStorage.getItem(CACHE_KEY) : null;
          if (cached) {
            const p = JSON.parse(cached) as { t: number; d: number };
            if (Date.now() - p.t < CACHE_TTL) contribs = p.d;
          }
        } catch {
          /* ignore */
        }
        if (contribs === null) {
          const res = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`,
          );
          if (res.ok) {
            const data = (await res.json()) as { contributions: ContribDay[] };
            contribs = data.contributions.reduce((s, d) => s + d.count, 0);
            try {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: contribs }));
            } catch {
              /* ignore storage/fetch error */
            }
          }
        }
        if (!cancelled && contribs !== null) setGhContribs(contribs);
      } catch {
        /* ignore */
      }
    })();

    // LeetCode — parallel, independent of GitHub fetch above
    (async () => {
      if (cancelled) return;
      try {
        const CACHE_KEY = "lc-summary";
        const CACHE_TTL = 1000 * 60 * 60 * 6;
        try {
          const raw =
            typeof sessionStorage !== "undefined" ? sessionStorage.getItem(CACHE_KEY) : null;
          if (raw) {
            const p = JSON.parse(raw) as { t: number; lc: number; streak: number };
            if (Date.now() - p.t < CACHE_TTL) {
              if (!cancelled) {
                setProblemsSolved(p.lc);
                if (p.streak > 0) setCurrentStreak(p.streak);
              }
              return;
            }
          }
        } catch {
          /* ignore storage/fetch error */
        }

        const lcEndpoints = [
          `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USER}`,
          `https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USER}`,
        ];
        const d = await Promise.any(
          lcEndpoints.map(async (url) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error("bad");
            const j = await res.json();
            if (j?.errors || j?.error) throw new Error("err");
            const lc = j.totalSolved ?? j.solvedProblem ?? 0;
            if (!lc) throw new Error("empty");
            return {
              lc,
              streak: computeLcStreak((j.submissionCalendar ?? {}) as Record<string, number>),
            };
          }),
        );
        if (!cancelled) {
          setProblemsSolved(d.lc);
          if (d.streak > 0) setCurrentStreak(d.streak);
          try {
            sessionStorage.setItem(
              "lc-summary",
              JSON.stringify({ t: Date.now(), lc: d.lc, streak: d.streak }),
            );
          } catch {
            /* ignore storage/fetch error */
          }
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inView]);

  const summaryStats = [
    {
      icon: Trophy,
      label: "Problems Solved",
      value: problemsSolved,
      accent: "green" as const,
    },
    {
      icon: Activity,
      label: "GitHub Contributions",
      value: ghContribs,
      accent: "blue" as const,
    },
    {
      icon: Code2,
      label: "Coding Platforms",
      value: 3,
      accent: "cyan" as const,
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: currentStreak != null ? `${currentStreak}d` : null,
      accent: "green" as const,
    },
  ] as const;

  return (
    <div ref={ref} className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {summaryStats.map((s) => (
        <StatTile
          key={s.label}
          icon={s.icon}
          label={s.label}
          value={s.value}
          loading={s.value === null}
          accent={s.accent}
        />
      ))}
    </div>
  );
}

function Stats() {
  return (
    <Section
      id="stats"
      eyebrow="Coding Dashboard"
      title={
        <>
          Competitive Programming &amp; <span className="text-gradient">Open Source Activity.</span>
        </>
      }
      intro="Real-time GitHub, LeetCode and GeeksforGeeks activity — fetched live, never hardcoded."
    >
      <CodingDashboardSummary />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <GitHubSection />
        <LeetCodeSection />
        <GfgSection />
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
            <h3 className="font-display text-lg font-semibold">
              Student Developer Club — Coordinator
            </h3>
            <span className="font-mono text-xs text-muted-foreground">Ongoing</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Coordinating with the campus developer community — organizing sessions, supporting
            peers, and sharing what I learn about Java, Cloud, and Automation.
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

        <ContactForm />
      </div>
    </Section>
  );
}

type FormStatus = "idle" | "sending" | "success" | "error";

const CONTACT_COOLDOWN_MS = 60 * 1000; // 1 minute between submissions

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const lastSentRef = useRef<number>(0);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn(
      "[Contact] EmailJS env vars missing. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY.",
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Cooldown check — prevent spam
    const timeSinceLast = Date.now() - lastSentRef.current;
    if (lastSentRef.current > 0 && timeSinceLast < CONTACT_COOLDOWN_MS) {
      const remaining = Math.ceil((CONTACT_COOLDOWN_MS - timeSinceLast) / 1000);
      setStatus("error");
      setErrorMsg(`Please wait ${remaining}s before sending another message.`);
      return;
    }
    // Honeypot — bots fill hidden fields; humans don't.
    if (String(fd.get("website") ?? "").length > 0) {
      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const subject = String(fd.get("subject") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (name.length < 2) {
      setStatus("error");
      setErrorMsg("Please enter your name (min 2 characters).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (message.length < 10) {
      setStatus("error");
      setErrorMsg("Message should be at least 10 characters.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        const { default: emailjs } = await import("@emailjs/browser");
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            from_name: name,
            from_email: email,
            reply_to: email,
            subject: subject || "New message from portfolio",
            message,
            to_email: "appubdm06@gmail.com",
          },
          { publicKey: PUBLIC_KEY },
        );
        lastSentRef.current = Date.now();
        setStatus("success");
        form.reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        // Fallback: open user's mail client pre-filled to appubdm06@gmail.com
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        const mailto = `mailto:appubdm06@gmail.com?subject=${encodeURIComponent(
          subject || "Portfolio contact",
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        lastSentRef.current = Date.now();
        setStatus("success");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (err) {
      console.error("EmailJS send failed", err);
      setStatus("error");
      setErrorMsg(
        "Sorry, message failed to send. Please email me directly at appubdm06@gmail.com.",
      );
    }
  }

  const sending = status === "sending";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="glass rounded-2xl p-6" noValidate>
      {/* Honeypot — hidden from users, catches naive bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">Name</span>
          <input
            required
            name="name"
            maxLength={80}
            disabled={sending}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green/60 disabled:opacity-60"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">Email</span>
          <input
            required
            type="email"
            name="email"
            maxLength={120}
            disabled={sending}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green/60 disabled:opacity-60"
            placeholder="you@email.com"
          />
        </label>
      </div>
      <label className="mt-4 grid gap-1.5 text-sm">
        <span className="text-muted-foreground">Subject</span>
        <input
          name="subject"
          maxLength={120}
          disabled={sending}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green/60 disabled:opacity-60"
          placeholder="What's this about?"
        />
      </label>
      <label className="mt-4 grid gap-1.5 text-sm">
        <span className="text-muted-foreground">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          maxLength={2000}
          disabled={sending}
          className="resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green/60 disabled:opacity-60"
          placeholder="Tell me a bit more..."
        />
      </label>

      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-start gap-2 rounded-lg border border-brand-green/30 bg-brand-green/10 px-3 py-2.5 text-sm text-brand-green"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Message sent — I&apos;ll get back to you soon.</span>
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Or email me directly at{" "}
          <a
            href="mailto:appubdm06@gmail.com"
            className="text-foreground underline-offset-4 hover:underline"
          >
            appubdm06@gmail.com
          </a>
        </p>
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-green to-brand-cyan px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-brand-green/20 transition-all hover:shadow-[0_0_30px_-8px_var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
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
          <span>
            Designed &amp; Developed by <span className="text-foreground">Pappu Kumar</span>
          </span>
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
        <p className="whitespace-pre-line text-center font-mono text-xs text-muted-foreground sm:text-right">
          © {new Date().getFullYear()} — Made with React + TypeScript + Tailwind + Vite
          {"\n\n\u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0"}Hosted on Vercel
        </p>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Motion FX — Tilt cards, Custom cursor, Back-to-top                         */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Project Modal & Tilt Card                                                  */
/* -------------------------------------------------------------------------- */

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong relative my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/20 p-6 shadow-2xl md:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 pr-10">
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-brand-green/50 bg-brand-green/15 px-3 py-1 font-mono text-xs font-semibold text-brand-green shadow-[0_0_15px_-3px_var(--brand-green)]">
              <Sparkles className="h-3.5 w-3.5" />
              Featured Project
            </span>
          )}
          {project.hackathonBadge && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-xs font-semibold text-amber-300 shadow-[0_0_12px_-3px_rgba(251,191,36,0.3)]">
              {project.hackathonBadge}
            </span>
          )}
          <span className="rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-brand-blue">
            {project.category}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 font-mono text-xs font-semibold text-brand-green">
            <span className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
            {project.status}
          </span>
        </div>

        {/* Header Title */}
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {project.title}
        </h2>

        {/* Preview Image if available */}
        {project.imageUrl && (
          <div className="relative mt-5 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-xl">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="h-auto max-h-[500px] w-full object-contain object-top rounded-2xl"
            />
          </div>
        )}

        {/* Overview & Problem Statement */}
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-brand-green">
              Project Overview
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">
              {project.longDescription || project.description}
            </p>
          </div>

          {project.problemStatement && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h4 className="font-mono text-xs uppercase tracking-wider text-brand-cyan">
                Problem Statement &amp; Solution
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {project.problemStatement}
              </p>
            </div>
          )}
        </div>

        {/* Key Features */}
        {project.featuresList && project.featuresList.length > 0 && (
          <div className="mt-6">
            <h4 className="font-mono text-xs uppercase tracking-wider text-brand-green">
              Key Features
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {project.featuresList.map((feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-xs text-foreground/80"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mt-6">
          <h4 className="font-mono text-xs uppercase tracking-wider text-brand-blue">
            Tech Stack &amp; Tools
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-brand-green/30 hover:text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Workflow Architecture Flow Diagram */}
        {project.workflowArchitecture && project.workflowArchitecture.length > 0 && (
          <div className="mt-6 rounded-2xl border border-brand-cyan/30 bg-brand-cyan/[0.05] p-5">
            <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-cyan">
              <Sparkles className="h-4 w-4" />
              n8n Workflow Architecture Flow
            </h4>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              {project.workflowArchitecture.map((step, idx) => (
                <div key={step + idx} className="flex items-center gap-2">
                  <span className="rounded-xl border border-brand-cyan/30 bg-black/40 px-3 py-1.5 font-mono font-medium text-foreground backdrop-blur">
                    {step}
                  </span>
                  {idx < project.workflowArchitecture!.length - 1 && (
                    <span className="font-mono text-xs text-brand-cyan">↓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges Solved */}
        {project.challengesSolved && project.challengesSolved.length > 0 && (
          <div className="mt-6 rounded-2xl border border-brand-green/20 bg-brand-green/5 p-5">
            <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-green">
              <Wrench className="h-4 w-4" />
              Challenges Solved &amp; What I Learned
            </h4>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground/90">
              {project.challengesSolved.map((chal) => (
                <li key={chal} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                  <span>{chal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-green/50 bg-brand-green px-5 py-2.5 font-mono text-xs font-semibold text-background shadow-lg transition-transform hover:scale-105"
            >
              <Rocket className="h-4 w-4" />
              🚀 Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-xs font-semibold text-foreground hover:bg-white/10 transition-all"
            >
              <Github className="h-4 w-4" />
              💻 GitHub Repository
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TiltProjectCard({
  project: p,
  index: i,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect?: (project: Project) => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className="group relative"
    >
      <motion.article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="glass relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 ease-out hover:border-white/25 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
      >
        {/* Browser mockup */}
        <div className="relative overflow-hidden border-b border-white/10 bg-linear-to-br from-white/[0.04] to-white/[0.01]">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/20 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-green/70" />
            <div className="ml-3 flex-1 truncate rounded-md bg-white/[0.04] px-2 py-0.5 text-center font-mono text-[10px] text-muted-foreground">
              pappu.dev/
              {p.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .slice(0, 24)}
            </div>
            {p.featured && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[9px] font-medium text-foreground/80">
                <Sparkles className="h-3 w-3 text-brand-green" />
                Featured
              </span>
            )}
          </div>
          <div className="relative grid h-36 place-items-center overflow-hidden">
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
                <div
                  className={`absolute -inset-8 opacity-40 blur-3xl transition-transform duration-500 group-hover:scale-105 ${
                    p.category === "AI"
                      ? "bg-linear-to-tr from-brand-blue/40 via-brand-cyan/30 to-brand-green/30"
                      : p.category === "Automation"
                        ? "bg-linear-to-tr from-brand-green/40 via-brand-cyan/25 to-brand-blue/30"
                        : "bg-linear-to-tr from-brand-cyan/30 via-brand-green/30 to-brand-blue/40"
                  }`}
                />
                <span className="relative font-display text-4xl font-bold text-gradient opacity-80">
                  {p.title
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 3)
                    .toUpperCase()}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand-blue">
                {p.category}
              </span>
              {p.hackathonBadge && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amber-300 shadow-[0_0_12px_-3px_rgba(251,191,36,0.3)]">
                  {p.hackathonBadge}
                </span>
              )}
            </div>
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
          <h3 className="mt-3 font-display text-lg font-semibold leading-tight">{p.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {p.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-foreground/75">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-green" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.stack.map((s, idx) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + idx * 0.03 }}
                className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                {s}
              </motion.span>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-2 pt-5">
            {p.demoUrl ? (
              <a
                href={p.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.title} Live Demo`}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-green/40 bg-brand-green/10 px-3 py-2 text-xs font-semibold text-brand-green transition-all hover:bg-brand-green/20"
              >
                <Rocket className="h-3.5 w-3.5" />
                🚀 Live Demo
              </a>
            ) : (
              <span
                aria-hidden="true"
                className="inline-flex flex-1 cursor-default items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-muted-foreground/70"
                title="Live demo coming soon"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                Live
              </span>
            )}

            {p.isWorkflowProject ? (
              p.workflowUrl ? (
                <a
                  href={p.workflowUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} Workflow`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-2 text-xs font-semibold text-brand-cyan transition-all hover:bg-brand-cyan/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />⚡ View Workflow
                </a>
              ) : (
                <button
                  onClick={() => onSelect && onSelect(p)}
                  aria-label={`${p.title} Workflow Details`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-2 text-xs font-semibold text-brand-cyan transition-all hover:bg-brand-cyan/20 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />⚡ View Workflow
                </button>
              )
            ) : (
              <a
                href={p.githubUrl || `https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.title} on GitHub`}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-foreground/80 transition-all hover:border-brand-green/40 hover:text-brand-green"
              >
                <Github className="h-3.5 w-3.5" />
                💻 GitHub
              </a>
            )}

            {onSelect && (
              <button
                onClick={() => onSelect(p)}
                aria-label={`View details for ${p.title}`}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-all hover:border-white/20 hover:text-foreground"
                title="View details"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-cursor="hover"
          aria-label="Back to top"
          className="glass-strong fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full text-brand-green shadow-[0_10px_40px_-10px_var(--brand-green)] transition-shadow hover:shadow-[0_10px_50px_-6px_var(--brand-green)]"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

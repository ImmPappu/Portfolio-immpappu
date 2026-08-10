import { motion } from "motion/react";
import {
  Camera,
  Film,
  Youtube,
  Instagram,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

/**
 * Instagram Highlight URLs for photography and cinematography work.
 * Exact URLs provided for @immpappu highlights.
 */
export const INSTAGRAM_PHOTOGRAPHY_HIGHLIGHT_URL =
  "https://www.instagram.com/stories/highlights/18005568509914347/";

export const INSTAGRAM_CINEMATOGRAPHY_HIGHLIGHT_URL =
  "https://www.instagram.com/stories/highlights/18109295048486103/";

export const PHOTOGRAPHY_URL = INSTAGRAM_PHOTOGRAPHY_HIGHLIGHT_URL;

type CreativeTool = {
  name: string;
  category: string;
};

const YOUTUBE_TOOLS: CreativeTool[] = [
  { name: "CapCut", category: "Video Editing" },
  { name: "DaVinci Resolve", category: "Color & Post-Production" },
  { name: "Adobe Photoshop", category: "Thumbnails & Design" },
  { name: "Remini", category: "AI Enhancement" },
  { name: "Vance AI", category: "Image Processing" },
];

const PHOTOGRAPHY_HIGHLIGHTS: string[] = [
  "Cinematic Photography",
  "Travel Moments",
  "Campus Life",
  "Portraits",
  "Visual Stories",
];

export function CreativeStudio() {
  return (
    <section
      id="creative"
      className="section-contain relative scroll-mt-24 px-4 py-24 sm:py-32"
      aria-label="Creative Studio Section"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-brand-green">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            Creative Studio
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Visual Storytelling, Video Editing &amp;{" "}
            <span className="text-gradient">Photography</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Beyond software engineering, I create cinematic videos, personal vlogs, travel films,
            and photography—bringing compositional depth, color grading, and creative detail to
            every visual project.
          </p>
        </motion.div>

        {/* Two Visually Distinct Cards: YouTube & Video Editing vs Cinematic Photography */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Card 1: YouTube & Video Editing */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="glass relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-xl"
          >
            <div className="absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-red-400">
                  <Youtube className="h-3.5 w-3.5 text-red-400" />
                  YouTube &amp; Motion
                </span>
                <span className="font-mono text-xs text-muted-foreground">PeditzVerse</span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                YouTube &amp; Video Editing
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                <strong className="font-semibold text-foreground">PeditzVerse</strong> is my
                personal YouTube channel where I create cinematic travel videos, personal vlogs,
                college/event content, short-form videos and visual stories, focusing on pacing,
                editing, and color grading.
              </p>

              {/* Editing & Tool Experience */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Editing Tools &amp; Software
                </h4>
                <div className="flex flex-wrap gap-2">
                  {YOUTUBE_TOOLS.map((tool) => (
                    <span
                      key={tool.name}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs font-medium text-foreground/90 transition-all hover:border-brand-green/40 hover:bg-brand-green/10 hover:text-brand-green"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-green" />
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href="https://youtube.com/@PeditzVerse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit PeditzVerse YouTube channel in a new tab"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 to-rose-600 px-5 py-3 font-mono text-xs font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-red-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Youtube className="h-4 w-4" />
                <span>Visit YouTube ↗</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Cinematic Photography & Instagram Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="glass relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-xl"
          >
            <div className="absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-brand-cyan/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-brand-cyan">
                  <Camera className="h-3.5 w-3.5 text-brand-cyan" />
                  Visual Arts
                </span>
                <span className="font-mono text-xs text-muted-foreground">@immpappu</span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                Cinematic Photography
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Cinematic photography, travel moments, campus life, portraits and visual stories.
                Explore selected work through my Instagram Highlights.
              </p>

              {/* Photography Focus & Highlights */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Focus &amp; Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {PHOTOGRAPHY_HIGHLIGHTS.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs font-medium text-foreground/90 transition-all hover:border-brand-cyan/40 hover:bg-brand-cyan/10 hover:text-brand-cyan"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons: Instagram Photography & Cinematography Highlights */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <a
                href={INSTAGRAM_PHOTOGRAPHY_HIGHLIGHT_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Photography Instagram Highlights"
                className="group inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-brand-cyan to-brand-blue px-4 py-3 font-mono text-xs font-semibold text-background shadow-lg shadow-brand-cyan/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-cyan/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              >
                <Camera className="h-3.5 w-3.5 text-background shrink-0" />
                <span>Photography Highlights ↗</span>
              </a>

              <a
                href={INSTAGRAM_CINEMATOGRAPHY_HIGHLIGHT_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Cinematography Instagram Highlights"
                className="group inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-xs font-semibold text-foreground backdrop-blur transition-all duration-300 hover:bg-white/10 hover:border-brand-cyan/40 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              >
                <Film className="h-3.5 w-3.5 text-brand-cyan shrink-0" />
                <span>Cinematography Highlights ↗</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

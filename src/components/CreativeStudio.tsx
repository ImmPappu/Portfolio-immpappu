import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Video,
  Camera,
  Palette,
  Image as ImageIcon,
  Film,
  Sparkles,
  Play,
  Youtube,
  ArrowUpRight,
  X,
  Maximize2,
  Sliders,
  Clock,
  Layers,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types & Data                                                              */
/* -------------------------------------------------------------------------- */

type CreativeSkill = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accent: "green" | "blue" | "cyan" | "purple";
};

const CREATIVE_SKILLS: CreativeSkill[] = [
  {
    id: "editing",
    icon: Video,
    title: "Cinematic Editing",
    description:
      "Crafting high-tempo cuts, rhythmic pacing, sound design, and seamless visual transitions.",
    accent: "green",
  },
  {
    id: "photography",
    icon: Camera,
    title: "Photography",
    description:
      "Capturing depth, framing, natural lighting, and raw human storytelling in every frame.",
    accent: "cyan",
  },
  {
    id: "grading",
    icon: Palette,
    title: "Color Grading",
    description:
      "Building custom LUTs, harmonizing color palettes, atmosphere, and cinematic visual tones.",
    accent: "purple",
  },
  {
    id: "manipulation",
    icon: ImageIcon,
    title: "Photo Manipulation",
    description:
      "Compositing imagery, fine retouching, visual effects, and high-impact graphic design.",
    accent: "blue",
  },
  {
    id: "storytelling",
    icon: Film,
    title: "Visual Storytelling",
    description:
      "Structuring compelling narratives with intentional pacing, emotion, and thematic depth.",
    accent: "green",
  },
  {
    id: "motion",
    icon: Sparkles,
    title: "Motion Design",
    description: "Designing fluid UI micro-interactions, kinetic typography, and motion graphics.",
    accent: "cyan",
  },
];

type ToolBadge = {
  name: string;
  category: string;
  icon?: LucideIcon;
};

const CREATIVE_TOOLS: ToolBadge[] = [
  { name: "DaVinci Resolve", category: "Color & Video", icon: Video },
  { name: "CapCut", category: "Shortform Video", icon: Film },
  { name: "Adobe Photoshop", category: "Photo & Graphics", icon: ImageIcon },
  { name: "Remini", category: "AI Enhancement", icon: Sparkles },
  { name: "Vance AI", category: "Image Processing", icon: Sliders },
  { name: "Canva", category: "Visual Design", icon: Layers },
];

type PhotoCategory = "All" | "Travel" | "Nature" | "College" | "Street" | "Portrait";

type PhotoItem = {
  id: string;
  title: string;
  category: Exclude<PhotoCategory, "All">;
  location: string;
  imageUrl: string;
  aspect: "aspect-square" | "aspect-[4/3]" | "aspect-[3/4]" | "aspect-[16/9]";
  description: string;
};

const PHOTO_GALLERY: PhotoItem[] = [
  {
    id: "photo-1",
    title: "Highland Horizon",
    category: "Travel",
    location: "Himalayas, India",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[4/3]",
    description: "Layered mountain peaks bathed in golden dusk light, capturing scale and silence.",
  },
  {
    id: "photo-2",
    title: "Misty Forest Canopy",
    category: "Nature",
    location: "Western Ghats",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[3/4]",
    description:
      "Morning mist filtering through ancient pine trees, showcasing organic depth and mood.",
  },
  {
    id: "photo-3",
    title: "Campus Golden Hour",
    category: "College",
    location: "REC Banda",
    imageUrl:
      "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[16/9]",
    description: "Architectural shadows and warm ambient sunlight across the academic courtyard.",
  },
  {
    id: "photo-4",
    title: "Midnight Neon Glow",
    category: "Street",
    location: "Varanasi Ghats",
    imageUrl:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-square",
    description: "Low-light street photography focusing on neon reflections and night movement.",
  },
  {
    id: "photo-5",
    title: "Chiaroscuro Silhouette",
    category: "Portrait",
    location: "Visual Studio",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[3/4]",
    description:
      "Cinematic key lighting creating strong contrast, depth, and character expression.",
  },
  {
    id: "photo-6",
    title: "Serene Lake Mirror",
    category: "Nature",
    location: "Alpine Lake",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[4/3]",
    description: "Glassy water reflection capturing symmetry, color balance, and tranquility.",
  },
  {
    id: "photo-7",
    title: "Monsoon Rain Trails",
    category: "Street",
    location: "Urban Alleyways",
    imageUrl:
      "https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[16/9]",
    description: "Raindrop refractions and moody atmospheric city color grading.",
  },
  {
    id: "photo-8",
    title: "Student Developer Hub",
    category: "College",
    location: "Innovation Lab",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[4/3]",
    description: "Collaborative coding sessions, late-night building, and student energy.",
  },
  {
    id: "photo-9",
    title: "Golden Hour Trail",
    category: "Portrait",
    location: "Sunlit Ridge",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-square",
    description: "Warm rim light and natural bokeh framing candid emotion.",
  },
  {
    id: "photo-10",
    title: "Ancient Architecture",
    category: "Travel",
    location: "Heritage Fort",
    imageUrl:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[3/4]",
    description: "Intricate stone carving detail, leading lines, and historic storytelling.",
  },
];

type FeaturedVideo = {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
};

const FEATURED_VIDEOS: FeaturedVideo[] = [
  {
    id: "video-1",
    title: "Wanderlust India: A Cinematic Journey",
    category: "Travel Film",
    duration: "03:45",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://youtube.com/@PeditzVerse",
    description:
      "A visual exploration of diverse landscapes, vibrant colors, and rhythmic edits across India.",
  },
  {
    id: "video-2",
    title: "Varanasi: Timeless Ghats & Color",
    category: "Cultural Short",
    duration: "04:12",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://youtube.com/@PeditzVerse",
    description:
      "Capturing spiritual energy, morning river mist, and rich color grading along the ancient Ganges.",
  },
  {
    id: "video-3",
    title: "College Chronicles & Campus Stories",
    category: "Cinematic Edit",
    duration: "02:50",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://youtube.com/@PeditzVerse",
    description:
      "Fast-paced storytelling blending student life, tech sessions, and visual creative projects.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function CreativeStudio() {
  const reduce = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const categories: PhotoCategory[] = ["All", "Travel", "Nature", "College", "Street", "Portrait"];

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") return PHOTO_GALLERY;
    return PHOTO_GALLERY.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section
      id="creative"
      className="section-contain relative scroll-mt-24 px-4 py-24 sm:py-32"
      aria-label="Creative Studio Section"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Eyebrow & Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-brand-green">
            <span className="h-1 w-1 rounded-full bg-brand-green" />
            Creative Studio
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Visual storytelling, photography &amp; motion{" "}
            <span className="text-gradient">beyond software.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Cinematic storytelling, photography and visual design beyond software.
          </p>
        </motion.div>

        {/* Introduction Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass relative mb-16 overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-10"
        >
          <div className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-cyan">
                <Sparkles className="h-4 w-4" />
                Creative Philosophy
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold text-foreground">
                Creative Studio
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Alongside software engineering, I enjoy creating cinematic videos, photography and
                digital storytelling. Exploring visual design has strengthened my attention to
                detail, composition, color, motion and user experience—skills that also influence
                how I build software.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Creative Skills Grid */}
        <div className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-foreground">Creative Skills</h3>
            <span className="font-mono text-xs text-muted-foreground">6 Disciplines</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CREATIVE_SKILLS.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="glass relative flex h-full flex-col justify-between rounded-2xl border border-white/10 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/40">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-brand-green transition-colors group-hover:bg-brand-green/15 group-hover:scale-105">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                          0{index + 1}
                        </span>
                      </div>

                      <h4 className="mt-4 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-brand-green">
                        {skill.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {skill.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 font-mono text-[11px] text-brand-green/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span>Explore domain</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tools & YouTube Grid */}
        <div className="mb-20 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Creative Toolkit */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="glass flex flex-col justify-between rounded-2xl border border-white/10 p-6 sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-cyan">
                  <Sliders className="h-4 w-4" />
                  Software &amp; Stack
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Workflow
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
                Creative Toolkit
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Industry-standard production software and AI-assisted visual enhancement suites.
              </p>

              {/* Rounded Badges */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {CREATIVE_TOOLS.map((tool) => {
                  const ToolIcon = tool.icon || CheckCircle2;
                  return (
                    <div
                      key={tool.name}
                      className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-foreground/90 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/40 hover:bg-brand-green/10 hover:text-brand-green"
                    >
                      <ToolIcon className="h-3.5 w-3.5 text-brand-green transition-transform group-hover:scale-110" />
                      <span>{tool.name}</span>
                      <span className="text-[10px] text-muted-foreground/60">
                        • {tool.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Color Correction · Video Editing · Image Processing</span>
              <span className="font-mono text-brand-green">100% Handcrafted</span>
            </div>
          </motion.div>

          {/* YouTube Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="glass relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8"
          >
            <div className="absolute -right-16 -bottom-16 -z-10 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-red-400">
                  <Youtube className="h-3.5 w-3.5 text-red-400" />
                  Channel Showcase
                </div>
                <span className="font-mono text-xs text-muted-foreground">@PeditzVerse</span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">YouTube</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                "I create cinematic travel videos, edits and visual stories."
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-sm font-semibold text-foreground">PeditzVerse</p>
                <p className="text-xs text-muted-foreground">
                  Travel Films &amp; Visual Storytelling
                </p>
              </div>

              <a
                href="https://youtube.com/@PeditzVerse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit YouTube Channel @PeditzVerse in a new tab"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 to-rose-600 px-5 py-2.5 font-mono text-xs font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-red-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Youtube className="h-4 w-4" />
                <span>Visit Channel</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Photo Gallery (Masonry Style) */}
        <div className="mb-20">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-green">
                <Camera className="h-4 w-4" />
                Visual Archives
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">
                Photo Gallery
              </h3>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1.5 backdrop-blur">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                    {isActive && (
                      <motion.div
                        layoutId="photo-category-pill"
                        className="absolute inset-0 -z-10 rounded-lg bg-white/10 border border-white/15"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Masonry Layout Grid */}
          <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid"
                >
                  <div
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-lg transition-all duration-300 hover:border-white/25 hover:shadow-2xl"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={`${photo.title} - ${photo.category} photography`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                    {/* Content on Hover */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 font-mono text-[10px] text-white backdrop-blur">
                          {photo.category}
                        </span>
                        <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Maximize2 className="h-3.5 w-3.5" />
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display text-base font-semibold text-white">
                          {photo.title}
                        </h4>
                        <p className="mt-0.5 font-mono text-[11px] text-white/70">
                          📍 {photo.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Video Showcase */}
        <div>
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-cyan">
                <Film className="h-4 w-4" />
                Featured Motion
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">
                Featured Videos
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Handcrafted travel films, visual edits, and short stories.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURED_VIDEOS.map((video, index) => (
              <motion.article
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="group glass relative flex flex-col overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />

                  {/* Duration Badge */}
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md border border-black/40 bg-black/70 px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </span>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-green group-hover:text-background group-hover:border-brand-green shadow-xl">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-2.5 py-0.5 font-mono text-[10px] uppercase text-brand-cyan">
                      {video.category}
                    </span>
                    <h4 className="mt-3 font-display text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-brand-green">
                      {video.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {video.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10">
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Watch video: ${video.title}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-semibold text-foreground transition-all duration-300 hover:border-brand-green/40 hover:bg-brand-green/10 hover:text-brand-green"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Watch Video</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-strong relative z-10 my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-brand-green" />
                  <span className="font-display font-semibold text-foreground">
                    {selectedPhoto.title}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {selectedPhoto.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative max-h-[70vh] overflow-hidden bg-black flex items-center justify-center p-2">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {selectedPhoto.title}
                    </h3>
                    <p className="font-mono text-xs text-brand-green">
                      📍 {selectedPhoto.location}
                    </p>
                  </div>
                  <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 font-mono text-xs text-brand-cyan">
                    {selectedPhoto.category}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {selectedPhoto.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Target, Layers, Compass } from "lucide-react";

/**
 * Lightwell Labs — Premium, modern, slightly animated, ADA-friendly site.
 * Fonts: Playfair Display (headings) + Montserrat (body)
 * Styling: TailwindCSS
 * Icons: lucide-react
 * Animations: framer-motion (respects prefers-reduced-motion)
 * Accessibility: skip link, focus-visible outlines, aria labels, decorative icons hidden.
 *
 * NOTE: This file includes a tiny, dependency-free client-side router so Privacy Policy
 * and Terms of Use render on separate pages (/privacy and /terms) while staying single-file.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: 0.08 * i },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.08 * i },
  }),
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-black/85 backdrop-blur">
      {children}
    </span>
  );
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker?: string;
  title: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section id={id} className="scroll-mt-28 py-16 md:py-28">
      <div className="mx-auto w-full max-w-5xl px-5">
        <motion.div
          variants={reduceMotion ? undefined : fadeUp}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.35 }}
          className="max-w-3xl"
        >
          {kicker ? (
            <div className="mb-3 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-black/60" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-black/70">{kicker}</p>
            </div>
          ) : null}
          <h2 className="font-playfair text-3xl leading-tight text-black md:text-4xl">
            {title}
          </h2>
        </motion.div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function useMiniRouter() {
  const [path, setPath] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: string) => {
    if (typeof window === "undefined") return;
    if (to === window.location.pathname) return;
    window.history.pushState({}, "", to);
    setPath(to);
    // Helpful for screen readers when changing "pages"
    requestAnimationFrame(() => {
      const main = document.getElementById("main");
      main?.focus?.();
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  };

  return { path, navigate };
}

function Link({
  href,
  onNavigate,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  onNavigate: (to: string) => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={(e) => {
        // Allow cmd/ctrl click for new tab
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onNavigate(href);
      }}
    >
      {children}
    </a>
  );
}

function SiteFrame({
  children,
  navigate,
  showNav = true,
}: {
  children: React.ReactNode;
  navigate: (to: string) => void;
  showNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#F7F3EE] text-black font-montserrat">
      {/* Fonts + accessibility helpers */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@500;600;700&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-montserrat { font-family: 'Montserrat', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }

        /* ADA: visible keyboard focus */
        :focus-visible { outline: 2px solid rgba(0,0,0,0.9); outline-offset: 3px; }

        /* ADA: skip link */
        .skip-link { position:absolute; left:-999px; top:auto; width:1px; height:1px; overflow:hidden; }
        .skip-link:focus { left: 16px; top: 16px; width:auto; height:auto; padding: 10px 14px; background: #000; color:#fff; border-radius: 9999px; z-index: 1000; }

        html { scroll-behavior: smooth; }
      `}</style>

      <a href="#main" className="skip-link">Skip to content</a>

      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#F7F3EE]/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" onNavigate={navigate} className="flex items-center gap-2" ariaLabel="Lightwell Labs home">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/75">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="leading-none">
              <div className="font-playfair text-lg">Lightwell Labs</div>
              <div className="text-[11px] tracking-[0.22em] text-black/70">STRATEGIC CLARITY</div>
            </div>
          </Link>

          {showNav ? (
            <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm text-black/85 md:flex">
              <a className="hover:text-black" href="#work">Work</a>
              <a className="hover:text-black" href="#founders">For Founders</a>
              <a className="hover:text-black" href="#companies">For Companies</a>
              <a className="hover:text-black" href="#about">About</a>
            </nav>
          ) : (
            <nav aria-label="Main navigation" className="hidden md:flex text-sm text-black/85">
              <Link href="/" onNavigate={navigate} className="hover:text-black">Home</Link>
            </nav>
          )}

          <div className="flex items-center gap-3">
            
            <a
              href="#book"
              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
            >
              Request an Alignment Call <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main
        id="main"
        tabIndex={-1}
        aria-label="Main content"
        className="outline-none"
      >
        {children}

        <footer className="border-t border-black/10 bg-[#F7F3EE]">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-playfair text-xl">Lightwell Labs</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-black/70">
                Strategic clarity that unlocks momentum
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-black/80" aria-label="Footer navigation">
              <Link href="/privacy" onNavigate={navigate} className="hover:text-black">Privacy Policy</Link>
              <Link href="/terms" onNavigate={navigate} className="hover:text-black">Terms of Use</Link>
            </div>
            <div className="text-xs text-black/70">© {new Date().getFullYear()} Lightwell Labs, LLC. All rights reserved.</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div id="top" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div
          variants={reduceMotion ? undefined : fadeIn}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0)_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0)_60%)]" />
          </div>
        </motion.div>

        <div className="mx-auto max-w-5xl px-5 py-16 md:py-24">
          <div className="grid items-start gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <motion.div
                variants={reduceMotion ? undefined : fadeUp}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "show"}
                custom={0}
                className="flex flex-wrap items-center gap-2"
              >
                <Pill>Strategic Catalyst</Pill>
                <Pill>Product Architect</Pill>
                <Pill>Brand Activator</Pill>
              </motion.div>

              <motion.h1
                variants={reduceMotion ? undefined : fadeUp}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "show"}
                custom={1}
                className="mt-6 font-playfair text-4xl leading-[1.05] tracking-tight text-black md:text-6xl"
              >
                Strategic clarity that unlocks momentum — <span className="italic">now</span>.
              </motion.h1>

              <motion.p
                variants={reduceMotion ? undefined : fadeUp}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "show"}
                custom={2}
                className="mt-6 max-w-xl text-base leading-relaxed text-black/85 md:text-lg"
              >
                Lightwell Labs helps founders, executives, and leadership teams identify the{" "}
                <span className="font-semibold text-black">real problem</span>, clarify strategy, and build the structure that
                moves work forward.
              </motion.p>

              <motion.div
                variants={reduceMotion ? undefined : fadeUp}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "show"}
                custom={3}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <a
                  href="#book"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90"
                >
                  Request an Alignment Call <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white/75 px-6 py-3 text-sm font-semibold text-black hover:bg-white"
                  aria-label="Explore how Lightwell Labs works"
                >
                  Explore How I Work <Compass className="h-4 w-4" aria-hidden="true" />
                </a>
              </motion.div>

              <motion.p
                variants={reduceMotion ? undefined : fadeUp}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "show"}
                custom={4}
                className="mt-6 text-sm text-black/75"
              >
                Brought in when something important needs to move forward.
              </motion.p>
            </div>

            <div className="md:col-span-5">
              <motion.div
                variants={reduceMotion ? undefined : fadeUp}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "show"}
                custom={2}
                className="rounded-3xl border border-black/10 bg-white/75 p-7 shadow-sm backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/70">Often brought into</p>
                    <p className="mt-2 font-playfair text-2xl">Pivotal Moments</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
                    <Zap className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-black/80">
                  {[
                    "An idea that needs sharper clarity",
                    "Too many strategic options and no clear path",
                    "Teams feeling misaligned on direction",
                    "Innovation efforts that need structure",
                    "A product or brand that isn’t landing",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-black/50" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-black/10 bg-[#F7F3EE] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/70">The outside lens</p>
                  <p className="mt-2 text-sm text-black/85">
                    Often the expertise already exists within the organization. The challenge is that when everyone is living
                    inside the system every day, it can be difficult to clearly see certain patterns. Sometimes it takes a neutral
                    outside perspective to identify misalignment, hidden constraints, or new opportunities.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How I Work */}
      <Section
        id="work"
        kicker="How I work"
        title="Identify the real problem. Clarify the strategy. Build what unlocks momentum."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: <Target className="h-5 w-5" aria-hidden="true" />,
              title: "Diagnose the constraint",
              text: "We separate symptoms from root cause — and make the real bottleneck visible.",
            },
            {
              icon: <Compass className="h-5 w-5" aria-hidden="true" />,
              title: "Clarify the opportunity",
              text: "We refine positioning, priorities, and direction so decisions become simpler.",
            },
            {
              icon: <Layers className="h-5 w-5" aria-hidden="true" />,
              title: "Design the structure",
              text: "We create a path teams can execute — clear, focused, and built for momentum.",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              variants={reduceMotion ? undefined : fadeUp}
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.35 }}
              custom={i}
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
              className="rounded-3xl border border-black/10 bg-white/75 p-7 shadow-sm backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
                  {c.icon}
                </span>
                <h3 className="font-playfair text-xl">{c.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-black/80">{c.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={reduceMotion ? undefined : fadeUp}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.35 }}
          className="mt-10 rounded-3xl border border-black/10 bg-white/70 p-7 backdrop-blur"
        >
          <p className="font-playfair text-2xl">Clarity compounds.</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-black/80">
            When noise disappears, priorities sharpen. When priorities sharpen, momentum returns.
          </p>
        </motion.div>
      </Section>

      {/* Founders */}
      <Section id="founders" kicker="For founders" title="Turn your idea into traction">
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            variants={reduceMotion ? undefined : fadeUp}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.35 }}
            className="rounded-3xl border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur"
          >
            <h3 className="font-playfair text-2xl">Clarity Intensive</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/80">
              A focused strategy session designed to solve the biggest bottleneck in your business.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-black/80">
              {[
                "Positioning & audience clarity",
                "Offer structure",
                "Messaging & brand voice",
                "Next steps you can execute",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/50" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="#book"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90"
            >
              Book the Intensive <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.div
            variants={reduceMotion ? undefined : fadeUp}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.35 }}
            custom={1}
            className="rounded-3xl border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur"
          >
            <h3 className="font-playfair text-2xl">Clarity to Launch Sprint</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/80">
              A structured sprint to transform an idea into a launch-ready brand.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-black/80">
              {[
                "Brand positioning",
                "Messaging & voice",
                "Foundational website copy",
                "Launch roadmap",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/50" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="#book"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white"
            >
              Explore the Sprint <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </Section>

      {/* Companies */}
      <Section id="companies" kicker="For companies" title="Strategic clarity for growing organizations">
        <div className="grid gap-6 md:grid-cols-12">
          <motion.div
            variants={reduceMotion ? undefined : fadeUp}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.35 }}
            className="md:col-span-7 rounded-3xl border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur"
          >
            <h3 className="font-playfair text-2xl">Strategic Catalyst Engagement</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/80">
              A focused engagement designed to unlock progress around a key initiative.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-black/80">
              Leadership teams often have the expertise to solve the issue. The difficulty is living inside the system — certain
              patterns become hard to see.
            </p>
            <div className="mt-5 rounded-2xl border border-black/10 bg-[#F7F3EE] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-black/70">Common focus areas</p>
              <div className="mt-3 grid gap-2 text-sm text-black/80 sm:grid-cols-2">
                {[
                  "Product / platform strategy",
                  "Brand positioning",
                  "Innovation initiatives",
                  "New venture design",
                  "Ecosystem & portfolio strategy",
                  "Strategic alignment",
                ].map((t) => (
                  <div key={t} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/50" aria-hidden="true" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <a
              href="#book"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90"
            >
              Start a Conversation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.div
            variants={reduceMotion ? undefined : fadeUp}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.35 }}
            custom={1}
            className="md:col-span-5 rounded-3xl border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur"
          >
            <h3 className="font-playfair text-2xl">Innovation & systems thinking</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/80">
              Many organizations pursue growth through isolated initiatives.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-black/80">
              This work focuses on designing coherent systems instead of disconnected efforts — product ecosystems, platform
              strategy, brand architecture, and innovation pipelines.
            </p>

            <a
              href="#book"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white"
            >
              Discuss Your Initiative <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </Section>

      {/* About */}
      <Section id="about" kicker="About" title="Lightwell Labs">
        <div className="grid gap-6 md:grid-cols-12">
          <motion.div
            variants={reduceMotion ? undefined : fadeUp}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.35 }}
            className="md:col-span-7 rounded-3xl border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur"
          >
            <p className="text-sm leading-relaxed text-black/85">Lightwell Labs exists to bring clarity to complex ideas.</p>
            <p className="mt-4 text-sm leading-relaxed text-black/85">
              The name reflects the belief that when the right light is applied to a challenge, the path forward becomes
              illuminated.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-black/85">
              The work focuses on helping founders and organizations transform ideas into clear strategy and effective structure.
            </p>
          </motion.div>

          <motion.div
            variants={reduceMotion ? undefined : fadeUp}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.35 }}
            custom={1}
            className="md:col-span-5 rounded-3xl border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur"
          >
            <p className="font-playfair text-2xl">Chelsea Lowry</p>
            <p className="mt-2 text-sm text-black/80">Strategic Catalyst</p>
            <p className="text-sm text-black/80">Product Architect & Brand Activator</p>
            <p className="mt-5 text-sm leading-relaxed text-black/85">
              Chelsea works with founders, executives, and leadership teams to transform complex ideas into clear strategy,
              compelling brands, and actionable structure.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-black/85">
              Her approach blends pattern recognition, strategic thinking, and decisive execution — because when the real problem
              becomes visible, progress follows naturally.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Booking */}
      <Section id="book" kicker="Start here" title="Request an Alignment Call">
        <motion.div
          variants={reduceMotion ? undefined : fadeUp}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-3xl border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur"
        >
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-sm leading-relaxed text-black/85">
                If you're navigating a complex idea, a growth decision, or a new venture, the first step is a short alignment call. We'll quickly determine whether there is a meaningful opportunity to work together and what the right next step would be.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://calendly.com/cnlowry/30min"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90"
                  aria-label="Book via Calendly"
                >
                  Book via Calendly <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-black/10 bg-[#F7F3EE] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-black/70">What we cover on the alignment call</p>
                <ul className="mt-3 space-y-2 text-sm text-black/80">
                  {[
                    "A brief overview of your situation and the context around the project",
                    "The outcome you are trying to achieve",
                    "Whether and how a deeper engagement could best support the work",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/50" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
}

function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-4xl px-5">
        <h1 className="font-playfair text-4xl leading-tight text-black md:text-5xl">{title}</h1>
        <div className="mt-8 rounded-3xl border border-black/10 bg-white/75 p-7 shadow-sm backdrop-blur">
          <div className="prose max-w-none prose-p:leading-relaxed prose-a:underline prose-a:text-black">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        Lightwell Labs respects your privacy. This website may collect limited personal information such as your name and email
        address when you voluntarily submit it (for example, through scheduling tools).
      </p>
      <p>
        We may also collect basic usage data through analytics to understand how visitors use the website and to improve site
        experience.
      </p>
      <p>
        Your information will not be sold. It may be used to communicate with you, deliver services, or improve this website.
      </p>
      <p>
        Questions about this policy may be sent to <a href="mailto:hello@LightwellLabs.com">hello@LightwellLabs.com</a>.
      </p>
    </LegalLayout>
  );
}

function TermsPage() {
  return (
    <LegalLayout title="Terms of Use">
      <p>This website is provided for informational purposes about Lightwell Labs and its consulting services.</p>
      <p>
        Content on this website may not be reproduced, distributed, or used commercially without written permission.
      </p>
      <p>
        Information presented on this site does not constitute professional advice or a formal consulting agreement.
      </p>
      <p>
        By using this website, you agree to these terms. Lightwell Labs may update these terms at any time.
      </p>
      <p>
        Questions about these terms may be sent to <a href="mailto:hello@LightwellLabs.com">hello@LightwellLabs.com</a>.
      </p>
    </LegalLayout>
  );
}

export default function LightwellLabsPremiumSite() {
  const { path, navigate } = useMiniRouter();

  const page = useMemo(() => {
    if (path === "/privacy") return { node: <PrivacyPage />, showNav: false };
    if (path === "/terms") return { node: <TermsPage />, showNav: false };
    return { node: <HomePage />, showNav: true };
  }, [path]);

  return (
    <SiteFrame navigate={navigate} showNav={page.showNav}>
      {page.node}
    </SiteFrame>
  );
}

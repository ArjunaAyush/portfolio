"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Webhook } from "lucide-react";
import { cn } from "@/lib/utils";
import { BackgroundCubesGrid } from "@/components/ui/background-cubes-grid";

// Brand paths from simple-icons (CC0), viewBox 0 0 24 24.
const ICONS = {
  discord:
    "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
  telegram:
    "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  googlechat:
    "M1.637 0C.733 0 0 .733 0 1.637v16.5c0 .904.733 1.636 1.637 1.636h3.955v3.323c0 .804.97 1.207 1.539.638l3.963-3.96h11.27c.903 0 1.636-.733 1.636-1.637V5.592L18.408 0Zm3.955 5.592h12.816v8.59H8.455l-2.863 2.863Z",
  mattermost:
    "M12.081 0C7.048-.034 2.339 3.125.637 8.153c-2.125 6.276 1.24 13.086 7.516 15.21 6.276 2.125 13.086-1.24 15.21-7.516 1.727-5.1-.172-10.552-4.311-13.557l.126 2.547c2.065 2.282 2.88 5.512 1.852 8.549-1.534 4.532-6.594 6.915-11.3 5.321-4.708-1.593-7.28-6.559-5.745-11.092 1.031-3.046 3.655-5.121 6.694-5.67l1.642-1.94A4.87 4.87 0 0 0 12.08 0zm3.528 1.094a.284.284 0 0 0-.123.024l-.004.001a.33.33 0 0 0-.109.071c-.145.142-.657.828-.657.828L13.6 3.4l-1.3 1.585-2.232 2.776s-1.024 1.278-.798 2.851c.226 1.574 1.396 2.34 2.304 2.648.907.307 2.302.408 3.438-.704 1.135-1.112 1.098-2.75 1.098-2.75l-.087-3.56-.07-2.05-.047-1.775s.01-.856-.02-1.057a.33.33 0 0 0-.035-.107l-.006-.012-.007-.011a.277.277 0 0 0-.229-.14z",
};

type Glyph = keyof typeof ICONS | "webhook";
type Platform = { word: string; bg: string; fg: string; glyph: Glyph };

const platforms: Platform[] = [
  { word: "Discord", bg: "#5865F2", fg: "#fff", glyph: "discord" },
  { word: "Telegram", bg: "#fff", fg: "#26A5E4", glyph: "telegram" },
  { word: "WhatsApp", bg: "#25D366", fg: "#fff", glyph: "whatsapp" },
  { word: "Google Chat", bg: "#fff", fg: "#34A853", glyph: "googlechat" },
  { word: "Mattermost", bg: "#0058CC", fg: "#fff", glyph: "mattermost" },
  { word: "any webhook", bg: "#fcd462", fg: "#241a00", glyph: "webhook" },
];

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;
const STAGGER = 0.09;
const START = 0.15;

const TONES = {
  dark: {
    heading: "text-white",
    body: "text-neutral-400",
    note: "text-neutral-500",
    pill: "bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur",
    primary: "bg-white text-[#111] shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)] hover:bg-neutral-200",
    secondary: "text-white hover:bg-white/[0.08]",
  },
};

type HeroTone = keyof typeof TONES;

function Icon({ name, className }: { name: Glyph; className?: string }) {
  if (name === "webhook") return <Webhook className={className} strokeWidth={2.25} />;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={ICONS[name]} />
    </svg>
  );
}

function InlinePill({ platform, delay, tone }: { platform: Platform; delay: number; tone: HeroTone }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      initial={reduceMotion ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
      className={cn(
        "mx-[0.06em] inline-flex translate-y-[-0.06em] items-center gap-[0.28em] rounded-full py-[0.08em] pr-[0.42em] pl-[0.1em] align-middle leading-none",
        TONES[tone].pill,
      )}
    >
      <span
        className="inline-flex size-[0.92em] items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
        style={{ backgroundColor: platform.bg, color: platform.fg }}
      >
        <Icon name={platform.glyph} className="size-[0.5em]" />
      </span>
      {platform.word}
    </motion.span>
  );
}

function HeroContent({ tone }: { tone: HeroTone }) {
  const reduceMotion = useReducedMotion();
  const t = TONES[tone];
  const [discord, telegram, whatsapp, googleChat, mattermost, webhook] = platforms;

  const pill = (p: Platform, suffix = ""): ReactNode => (
    <span className="whitespace-nowrap">
      <InlinePill platform={p} tone={tone} delay={START + platforms.indexOf(p) * STAGGER} />
      {suffix}
    </span>
  );

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE_OUT, delay },
  });

  return (
    <div className="pointer-events-none mx-auto flex max-w-[1080px] flex-col items-center text-center antialiased">
      <h1
        className={cn(
          "max-w-[24ch] text-[clamp(32px,4.6vw,58px)] leading-[1.32] font-medium tracking-[-0.03em] text-balance",
          t.heading,
        )}
      >
        Page your team on {pill(discord, ",")} {pill(telegram, ",")} {pill(whatsapp, ",")}{" "}
        {pill(googleChat, ",")} {pill(mattermost)} and {pill(webhook)} at once.
      </h1>

      <motion.p
        {...fadeUp(0.7)}
        className={cn("mt-8 max-w-[600px] text-[clamp(17px,1.5vw,19px)] leading-[1.6] text-pretty", t.body)}
      >
        Relay is incident alerting for small engineering teams. Route alerts by severity, run
        on-call rotations, and keep one clean thread per incident.
      </motion.p>

      <motion.div
        {...fadeUp(0.8)}
        className="pointer-events-auto mt-9 flex flex-col items-center gap-2 sm:flex-row"
      >
        <a
          href="#"
          className={cn(
            "inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium transition-colors",
            t.primary,
          )}
        >
          Start for free
        </a>
        <a
          href="#"
          className={cn(
            "inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium transition-colors",
            t.secondary,
          )}
        >
          Read the docs
        </a>
      </motion.div>

      <motion.p {...fadeUp(0.9)} className={cn("mt-4 text-[13px]", t.note)}>
        Free for up to 5 seats · No credit card required
      </motion.p>
    </div>
  );
}

export default function BackgroundCubesGridPerspectiveDemo() {
  return (
    <div className="relative isolate flex min-h-[50rem] w-full items-center justify-center overflow-hidden px-5 py-24 sm:px-8">
      <BackgroundCubesGrid variant="perspective" className="-z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_45%,rgba(11,11,13,0.8),transparent)]"
      />
      <HeroContent tone="dark" />
    </div>
  );
}

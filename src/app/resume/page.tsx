import type { Metadata } from "next";
import Link from "next/link";
import {
  education,
  experience,
  languages,
  profile,
  projects,
  publications,
  skillGroups,
} from "@/content/portfolio";
import { PrintButton } from "@/app/resume/PrintButton";

export const metadata: Metadata = {
  title: "Dossier",
  description: `Resume of ${profile.name} — ${profile.discipline}.`,
};

/**
 * The 2D dossier: the complete portfolio as a clean, print-ready page.
 * Serves as the no-WebGL fallback and the PDF export (Ctrl/Cmd+P).
 */
export default function ResumePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-800">
      {/* on-screen toolbar */}
      <div className="no-print sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 hover:text-cyan-900"
          >
            ← Return to the Nexus
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* header */}
        <header className="mb-8 border-b-2 border-zinc-900 pb-6">
          <h1
            className="text-3xl font-black tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {profile.name}
          </h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
            {profile.role} · {profile.discipline}
          </p>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-zinc-600">
            {profile.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-zinc-600">
            <span>{profile.location}</span>
            <a className="underline decoration-cyan-600/40 underline-offset-2" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <span>{profile.phone}</span>
            <a className="underline decoration-cyan-600/40 underline-offset-2" href={profile.links.linkedin}>
              LinkedIn
            </a>
            <a className="underline decoration-cyan-600/40 underline-offset-2" href={profile.links.github}>
              GitHub
            </a>
          </div>
        </header>

        <Section title="Education">
          {education.map((e) => (
            <Item
              key={e.degree}
              title={e.school}
              sub={e.degree}
              meta={`${e.date} · ${e.location} · ${e.gpa}`}
            />
          ))}
        </Section>

        <Section title="Experience">
          {experience.map((e) => (
            <Item key={e.role + e.date} title={e.role} sub={e.company} meta={e.date}>
              <Bullets points={e.points} />
            </Item>
          ))}
        </Section>

        <Section title="Research & Projects">
          {projects.map((p) => (
            <Item key={p.id} title={p.title} sub={p.subtitle}>
              <Bullets points={p.points} />
            </Item>
          ))}
        </Section>

        <Section title="Publications">
          {publications.map((p) => (
            <p key={p.title} className="mb-2 text-[13px] leading-relaxed">
              <span className="font-bold">{p.venue}</span> — “{p.title}” ({p.kind})
            </p>
          ))}
        </Section>

        <Section title="Technical Skills">
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {skillGroups.map((g) => (
              <div key={g.title}>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                  {g.title}
                </p>
                <p className="text-[13px] leading-relaxed text-zinc-700">
                  {g.skills.map((s) => s.name).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Languages">
          <p className="text-[13px] text-zinc-700">
            {languages.map((l) => `${l.name} (${l.level})`).join(" · ")}
          </p>
        </Section>

        <footer className="mt-10 border-t border-zinc-200 pt-4 text-center text-[11px] text-zinc-400">
          {profile.links.website} — the interactive 3D edition of this dossier
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 border-b border-zinc-300 pb-1 text-[13px] font-black uppercase tracking-[0.3em] text-zinc-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Item({
  title,
  sub,
  meta,
  children,
}: {
  title: string;
  sub: string;
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-[14.5px] font-bold text-zinc-900">{title}</h3>
        {meta && <span className="text-[11px] text-zinc-500">{meta}</span>}
      </div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
        {sub}
      </p>
      {children}
    </div>
  );
}

function Bullets({ points }: { points: string[] }) {
  return (
    <ul className="mt-1.5 space-y-1">
      {points.map((p, i) => (
        <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-zinc-700">
          <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-cyan-600" />
          {p}
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useState } from "react";
import {
  Copy,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Rss,
  Send,
} from "lucide-react";
import { audio } from "@/lib/audio";
import { profile } from "@/content/portfolio";
import { PanelSection } from "@/components/ui/panels/kit";

/**
 * Communication Hub — every channel in one place, plus a composer that
 * hands off to the visitor's mail client (the site is fully static).
 */
export function ContactPanel({ accent }: { accent: string }) {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      audio.sfx("success");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the mailto path still works */
    }
  };

  const compose = () => {
    const subject = encodeURIComponent(
      `Transmission from ${name || "a Nexus visitor"}`
    );
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    audio.sfx("open");
  };

  const channels = [
    { icon: <Github size={15} />, label: "GitHub", href: profile.links.github },
    { icon: <Linkedin size={15} />, label: "LinkedIn", href: profile.links.linkedin },
    { icon: <Rss size={15} />, label: "Blog", href: profile.links.blog },
    { icon: <Globe size={15} />, label: "Website", href: profile.links.website },
  ];

  return (
    <div>
      <p className="mb-6 text-[13.5px] leading-relaxed text-white/70">
        {profile.availability} Signal strength is excellent — pick a channel.
      </p>

      {/* primary channel */}
      <div className="hud-corners mb-4 border border-line/70 bg-abyss/60 p-4">
        <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          <Mail size={12} /> Primary channel
        </p>
        <div className="flex items-center justify-between gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="truncate text-[15px] font-semibold text-white transition-colors hover:text-primary"
          >
            {profile.email}
          </a>
          <button onClick={copyEmail} className="btn-hud shrink-0 px-2.5 py-1.5 text-[9px]">
            <Copy size={11} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-line/50 pt-2.5 text-[11.5px] text-dim">
          <span className="flex items-center gap-1.5">
            <Phone size={11} /> {profile.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={11} /> {profile.location}
          </span>
        </div>
      </div>

      {/* social channels */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audio.sfx("click")}
            onMouseEnter={() => audio.sfx("hover")}
            className="btn-hud justify-start gap-2.5 px-3.5 py-3 text-[11px]"
          >
            {c.icon}
            {c.label}
          </a>
        ))}
      </div>

      {/* composer */}
      <PanelSection title="Open a transmission" accent={accent}>
        <div className="space-y-2.5">
          <input
            className="field"
            placeholder="YOUR NAME / ORGANIZATION"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="field min-h-[110px] resize-none"
            placeholder="MESSAGE…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={compose}
            disabled={!message.trim()}
            className="btn-hud w-full gap-2 px-4 py-3 text-[11px] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={13} />
            Transmit via your mail client
          </button>
        </div>
      </PanelSection>
    </div>
  );
}

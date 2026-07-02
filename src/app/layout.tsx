import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dhanushkumarsv.github.io"),
  title: {
    default: "Dhanush Kumar S V — The Process Nexus",
    template: "%s — Dhanush Kumar S V",
  },
  description:
    "A cinematic 3D portfolio world. Dhanush Kumar S V — chemical engineering graduate researcher: process simulation (Aspen Plus), membrane distillation, green hydrogen and supply-chain optimization.",
  keywords: [
    "Dhanush Kumar S V",
    "chemical engineering",
    "process engineer",
    "Aspen Plus",
    "membrane distillation",
    "green hydrogen",
    "portfolio",
  ],
  authors: [{ name: "Dhanush Kumar S V" }],
  openGraph: {
    title: "Dhanush Kumar S V — The Process Nexus",
    description:
      "Explore a living industrial world of research: eight facilities, one engineer.",
    url: "https://dhanushkumarsv.github.io",
    siteName: "The Process Nexus",
    type: "website",
    images: [{ url: "/profile.jpg", width: 800, height: 1000 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#04060c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Chatbot from "@/components/Chatbot";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dhanush Kumar | Chemical Engineer Portfolio",
  description: "Portfolio of Dhanush Kumar S V, a Chemical Engineering Graduate Student specializing in Process Simulation, Integration, and Data Analysis.",
  keywords: ["Chemical Engineer", "Process Simulation", "Aspen Plus", "GAMS", "Wastewater Treatment", "Hydrogen Systems", "Portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <main className="flex-grow">{children}</main>
        <Chatbot />
      </body>
    </html>
  );
}

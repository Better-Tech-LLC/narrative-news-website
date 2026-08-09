import type { Metadata } from "next";
import {
  Newsreader,
  Source_Serif_4,
  Archivo,
  Spline_Sans_Mono,
} from "next/font/google";
import "./globals.css";
import Masthead from "@/components/Masthead";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-spline-mono",
});

export const metadata: Metadata = {
  title: "narrativeAI.dev — Six models. One briefing.",
  description:
    "Daily news analyzed by a panel of six AI models. Every perspective attributed. Where the panel diverges is the story.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${sourceSerif.variable} ${archivo.variable} ${splineMono.variable}`}
    >
      <body>
        <Masthead />
        <Ticker />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

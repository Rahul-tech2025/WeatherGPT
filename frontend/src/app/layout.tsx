import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#02040a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "WeatherGPT | Aerospace Weather Intelligence & Machine Learning",
  description: "Enterprise meteorological platform integrating real-time Open-Meteo telemetry, Google Gemini conversational assistant, and Scikit-Learn predictive machine learning models.",
  applicationName: "WeatherGPT",
  authors: [{ name: "Rahul Choudhary", url: "https://github.com/RahulChoudhary" }],
  creator: "Rahul Choudhary",
  publisher: "WeatherGPT Research Lab",
  keywords: [
    "WeatherGPT",
    "Meteorological AI",
    "Scikit-Learn Machine Learning",
    "Linear Regression Temperature",
    "Logistic Regression Rainfall",
    "Google Gemini AI",
    "Lovely Professional University",
    "Rahul Choudhary"
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    "copyright": "© 2026 WeatherGPT. All rights reserved. Rahul Choudhary (Reg: 12504340).",
    "security-contact": "rahul.choudhary@weathergpt.local",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#02040a] text-slate-100 min-h-screen selection:bg-white selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}

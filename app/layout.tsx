import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { MedicineProvider } from "@/context/MedicineContext";

const spaceGroteskHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareCue AI | Accessible Medicine Reminder & Caregiver Dashboard",
  description:
    "An accessible, privacy-centric medicine reminder and caregiver dashboard powered by open-source AI with browser Web Audio chimes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        montserrat.variable,
        spaceGroteskHeading.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased">
        <MedicineProvider>{children}</MedicineProvider>
      </body>
    </html>
  );
}

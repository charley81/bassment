import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BASSMENT — Manhattan's Valve Sound System Venue",
  description:
    "Manhattan's only Valve Sound System venue. 96,000 watts of hand-built analog power. Four stories beneath 70 Pine Street.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bass-bg text-bass-text">
        {children}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}

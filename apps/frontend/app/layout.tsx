import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Appbar } from "../components/Appbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UpFlux — Real-Time Infrastructure Monitoring",
  description: "Monitor your websites, APIs, and services with real-time uptime checks, instant alerts, and powerful analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Suppressing hydration error because dark mode is being rendered on client side, while on the server side, bright mode is being rendered which is causing a mismatch(cause of hydration error)
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body
          className={`${inter.className} antialiased`}
        >
          <ThemeProvider defaultTheme="dark" attribute="class" forcedTheme="dark">
            <Appbar />
            {children}
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}

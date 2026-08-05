import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandMenuProvider } from "@/components/command-menu-provider";
import { CommandMenu } from "@/components/command-menu";
import { FocusTimerProvider } from "@/components/focus-timer-provider";
import { ShortcutsHelpProvider } from "@/components/shortcuts-help-provider";
import { GlobalShortcuts } from "@/components/global-shortcuts";
import { ShortcutsHelpDialog } from "@/components/shortcuts-help-dialog";
import { OnboardingGate } from "@/components/onboarding-gate";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BluePrint",
  description: "A modern productivity platform for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <MotionConfig reducedMotion="user">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <CommandMenuProvider>
              <FocusTimerProvider>
                <ShortcutsHelpProvider>
                  <div className="flex min-h-screen">
                    <Sidebar />
                    <div className="flex flex-1 flex-col">
                      <Topbar />
                      <main className="flex-1">{children}</main>
                    </div>
                  </div>
                  <CommandMenu />
                  <GlobalShortcuts />
                  <ShortcutsHelpDialog />
                  <OnboardingGate />
                </ShortcutsHelpProvider>
              </FocusTimerProvider>
            </CommandMenuProvider>
          </ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
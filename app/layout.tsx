import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import PageNavbar from "@/components/page-navbar";
import AuthProvider from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taskr - The Ultimate Task Management Solution",
  description:
    "Taskr is a task management solution for your projects and daily activities",
  keywords: [
    "task",
    "management",
    "project",
    "todo",
    "list",
    "daily",
    "activity",
    "productivity",
    "planning",
    "task management",
    "project management",
    "taskr",
    "Taskr",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body className={inter.className}>
            <Analytics />
            <PageNavbar />
            {children}
            <Toaster />
          </body>
        </ThemeProvider>
      </AuthProvider>
    </html>
  );
}

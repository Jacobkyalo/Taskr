import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PageNavbar from "@/components/page-navbar";
import AuthProvider from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taskr - The Ultimate Task Management Solution",
  description:
    "Taskr is a task management solution for your projects and daily activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <PageNavbar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}

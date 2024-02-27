"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggler } from "./theme-toggler";

export default function PageNavbar() {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/dashboard" ? (
        ""
      ) : (
        <header className="container flex items-center py-4 justify-between">
          <Link
            href="/"
            className="text-2xl text-destructive font-bold leading-none"
          >
            <span>Taskr</span>
          </Link>

          <div className="flex items-center gap-x-4 sm:gap-x-8">
            <nav>
              <ul className="flex items-center gap-x-4 sm:gap-x-8">
                <li>
                  <Link href="/signup" className="hover:text-destructive">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-destructive">
                    Login
                  </Link>
                </li>
              </ul>
            </nav>
            <ThemeToggler />
          </div>
        </header>
      )}
    </>
  );
}

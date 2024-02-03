"use client";

import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

export default function Homepage() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      redirect("/dashboard");
    }
  });
  return (
    <section className="py-24 flex-col gap-y-4 w-full max-w-4xl mx-auto text-center flex justify-center items-center">
      <h2 className="text-4xl md:text-7xl font-bold">
        Your Ultimate Task Management Solution
      </h2>
      <p className="text-sm md:text-base w-full max-w-2xl font-medium">
        Taskr helps your to manage your tasks and projects with ease. It&apos;s
        a one stop solution for all your task management needs. Signup now to
        get started.
      </p>
      <div className="flex gap-x-6 items-center mt-10">
        <Link href="/signup">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="destructive">
            Login
          </Button>
        </Link>
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import tasks from "@/assets/images/tasks.svg";
import useAuth from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function Login() {
  const { user, loading, loginUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    loginUser(data.email, data.password);
  };

  useEffect(() => {
    if (user) {
      redirect("/dashboard");
    }
  }, [user]);

  return (
    <main className="container">
      <section className="flex justify-center">
        <div className="hidden lg:block flex-1 p-20">
          <Image src={tasks} alt="tasks_image" width={500} height={500} />
        </div>
        <div className="md:px-20 py-20 w-full max-w-xl">
          <div className="flex flex-col gap-y-1 mb-6">
            <h3 className="text-2xl font-bold leading-none">
              Login to your account
            </h3>
            <p className="text-muted-foreground text-sm">
              Enter your email and password below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="johndoe@gmail.com"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="your password"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <Link
                      href="/forgot-password"
                      className="text-sm hover:underline mt-1 block text-end text-destructive"
                    >
                      Forgot password?
                    </Link>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                variant="destructive"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>

              <p className="text-muted-foreground text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-destructive">
                  Signup
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </section>
    </main>
  );
}

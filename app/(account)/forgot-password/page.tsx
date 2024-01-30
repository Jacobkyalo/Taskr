"use client";

import Link from "next/link";
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
import Container from "@/components/container";

import forgotPassword from "@/assets/images/forgot-password.svg";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <main>
      <Container>
        <section className="flex justify-center">
          <div className="hidden lg:block flex-1 p-20">
            <Image
              src={forgotPassword}
              alt="tasks_image"
              width={500}
              height={500}
            />
          </div>
          <div className="md:px-20 py-20 w-full max-w-xl">
            <div className="flex flex-col gap-y-1 mb-6">
              <h3 className="text-2xl font-bold leading-none">
                Reset your password
              </h3>
              <p className="text-muted-foreground text-sm">
                Enter your email to get a password reset link.
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

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  variant="destructive"
                >
                  Get Reset Link
                </Button>

                <p className="text-muted-foreground text-sm">
                  Return back to{" "}
                  <Link href="/login" className="text-destructive">
                    Login
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </section>
      </Container>
    </main>
  );
}

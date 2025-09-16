"use client";
import * as React from "react";
import AuthCard from "@/components/auth/AuthCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SigninPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    console.log("signin submit", payload);
    setTimeout(() => setIsSubmitting(false), 600);
  };

  return (
    <div className="mx-auto grid min-h-[100dvh] max-w-6xl grid-cols-1 items-center gap-8 px-4 py-8 md:grid-cols-2">
      <div className="order-2 md:order-1">
        <h2 className="text-2xl font-semibold">Welcome back to a8n</h2>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Continue where you left off. Sign in to access your workflows and projects.
        </p>
      </div>
      <div className="order-1 md:order-2 md:justify-self-end">
        <AuthCard title="Sign in" subtitle="Use your email and password" fullScreen={false} className="w-[28rem]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="you@example.com" type="email" required aria-label="Email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" placeholder="••••••••" type="password" required aria-label="Password" />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting} aria-label="Sign in">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
};

export default SigninPage;

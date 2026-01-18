"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "@/app/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AuthCardProps {
  initialMode: "login" | "signup";
  onSignIn: (values: LoginInput) => Promise<{ error?: string; success?: string }>;
  onSignUp: (values: SignupInput) => Promise<{ error?: string; success?: string }>;
}

export function AuthCard({ initialMode, onSignIn, onSignUp }: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const form = useForm<LoginInput & { confirmPassword?: string }>({
    resolver: zodResolver(mode === "login" ? loginSchema : signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: LoginInput & { confirmPassword?: string }) => {
    setStatus(null);
    startTransition(async () => {
      const result = mode === "login" 
        ? await onSignIn(values as LoginInput)
        : await onSignUp(values as SignupInput);

      if (result?.error) {
        setStatus({ type: "error", message: result.error });
      } else if (result?.success) {
        setStatus({ type: "success", message: result.success });
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold tracking-tight text-xl">Signal AI</span>
          </div>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Welcome back" : "Get Started"}
          </CardTitle>
          <CardDescription>
            {mode === "login" 
              ? "Sign in to your account to continue your applications" 
              : "Create an account to start optimizing your resume with AI"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} autoComplete="email" />
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
                      <Input type="password" placeholder="••••••••" {...field} autoComplete="current-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AnimatePresence mode="popLayout">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="pt-2">
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} autoComplete="new-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {status && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 rounded-md text-sm font-medium ${
                    status.type === "error" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  {status.message}
                </motion.div>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link 
                href={mode === "login" ? "/signup" : "/login"}
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setStatus(null);
                  form.reset();
                }}
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
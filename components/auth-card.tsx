"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, Sparkles, MailCheck } from "lucide-react";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "@/app/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

interface AuthCardProps {
  onSignIn: (
    values: LoginInput,
  ) => Promise<{ error?: string; success?: boolean }>;
  onSignUp: (
    values: SignupInput,
  ) => Promise<{ error?: string; success?: boolean }>;
}

export default function AuthCard({ onSignIn, onSignUp }: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const router = useRouter();

  const form = useForm<SignupInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(mode === "login" ? loginSchema : signupSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupInput) => {
    setStatus(null);
    startTransition(async () => {
      // Logic split based on mode
      const result =
        mode === "login"
          ? await onSignIn({ email: values.email, password: values.password })
          : await onSignUp(values);
          console.log("AuthCard onSubmit result:", result);

      if (result?.error) {
        setStatus({ type: "error", message: result.error });
      } else if (result?.success) {
        if (mode === "signup") {
          setIsSuccess(true);
        } else {
          router.push("/");
        }
      }
    });
  };

  return (
    <motion.div layout className="w-full max-w-md">
      <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl uppercase tracking-wider">
              Signal AI
            </span>
          </div>
          <CardTitle className="text-2xl">
            {isSuccess
              ? "Verify Email"
              : mode === "login"
                ? "Welcome back"
                : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? `Verification link sent to ${form.getValues("email")}`
              : mode === "login"
                ? "Enter your credentials to access your dashboard"
                : "Join Signal AI to start your smarter job search"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center py-4 text-center"
              >
                <MailCheck className="h-12 w-12 text-emerald-500 mb-4" />
                <p className="text-sm text-muted-foreground mb-6">
                  Check your inbox and click the link to activate your account.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSuccess(false);
                    setMode("login");
                  }}
                >
                  Back to Login
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
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
                              placeholder="••••••••"
                              {...field}
                            />
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
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {status && (
                      <div
                        className={`p-3 rounded-md text-sm ${status.type === "error" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"}`}
                      >
                        {status.message}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : mode === "login" ? (
                        "Sign In"
                      ) : (
                        "Register"
                      )}
                      {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "login" ? "signup" : "login");
                      form.reset();
                      setStatus(null);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {mode === "login"
                      ? "Need an account? Sign up"
                      : "Have an account? Log in"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use server";

import { createClient } from "@/app/lib/supabase/server";
import {
  LoginInput,
  loginSchema,
  SignupInput,
  signupSchema,
} from "@/schemas/auth.schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

const getBaseUrl = async () => {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return normalizeBaseUrl(origin);
  }

  const forwardedHost =
    headerStore.get("x-forwarded-host") || headerStore.get("host");
  if (forwardedHost) {
    const protocol =
      headerStore.get("x-forwarded-proto") ||
      (forwardedHost.includes("localhost") ? "http" : "https");
    return `${protocol}://${forwardedHost}`;
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL);
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

const validateAuthData = (
  type: "login" | "signup",
  data: LoginInput | SignupInput,
) => {
  if (type === "login") {
    const validatedData = loginSchema.safeParse(data);
    if (validatedData.error) {
      return "Invalid login data, please check your email and password.";
    }
    return validatedData.data;
  } else if (type === "signup") {
    const validatedData = signupSchema.safeParse(data);
    if (validatedData.error) {
      return "Invalid signup data, please check your email, password, and name.";
    }
    return validatedData.data;
  }
};

export const signIn = async (data: LoginInput) => {
  const validatedData = validateAuthData("login", data);

  if (typeof validatedData === "string") {
    return { error: validatedData };
  }

  if (!validatedData) {
    return { error: "Invalid data" };
  }

  const { email, password } = validatedData;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return {
        error:
          "Invalid login credentials. If this account was created with Google, use Google sign-in or set a password from Settings after signing in with Google.",
      };
    }
    return { error: error.message };
  }
  revalidatePath("/");
  
  return { success: true, message: "Successfully signed in." };
};

export const signUp = async (data: SignupInput) => {
  const validatedData = validateAuthData("signup", data);
  if (typeof validatedData === "string") {
    return { error: validatedData };
  }
  if (!validatedData) {
    return { error: "Invalid data" };
  }

  const { email, password } = validatedData;
  const baseUrl = await getBaseUrl();

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/`,
    },
  });
  if (error) return { error: error.message };
  return {
    success: true,
    message: "Please check your email to verify your account.",
  };
};

export const googleAuth = async () => {
  const supabase = await createClient();
  const baseUrl = await getBaseUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  if (data.url) {
    redirect(data.url);
  }

  return { error: "Failed to get authentication URL" };
};

export const demoSignIn = async () => {
  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;

  if (!email || !password) {
    return { error: "Demo credentials are not configured on the server." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    console.error("Demo sign in failed:", error.message);
    return { error: "Failed to sign in with demo credentials." };
  }
  
  revalidatePath("/");
  return { success: true };
};

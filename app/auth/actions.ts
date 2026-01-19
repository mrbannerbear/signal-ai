"use server"

import { createClient } from "@/app/lib/supabase/server";
import { LoginInput, loginSchema, SignupInput, signupSchema } from "@/app/schemas/auth.schema";
import { revalidatePath } from "next/cache";

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
        return { error: validatedData }
    }

    if (!validatedData) {
        return { error: "Invalid data" }
    }

    const { email, password } = validatedData; 

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) return { error: error.message }
    revalidatePath("/");
    return { success: true, message: "Successfully signed in." }
}

export const signUp = async (data: SignupInput) => {
    const validatedData = validateAuthData("signup", data);
    if (typeof validatedData === "string") {
        return { error: validatedData }
    }
    if (!validatedData) {
        return { error: "Invalid data" }
    }

    const { email, password } = validatedData; 

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({ email, password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        }
     });
    if(error) return { error: error.message }
    return { success: true, message: "Please check your email to verify your account." }
}
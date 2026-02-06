"use server";

import { createClient } from "@/app/lib/supabase/server";
import {
  updateEmailSchema,
  updatePasswordSchema,
  UpdateEmailInput,
  UpdatePasswordInput,
} from "@/schemas/account.schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export const getCurrentUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    provider: user.app_metadata?.provider || "email",
    createdAt: user.created_at,
  };
};

export const updateEmail = async (
  data: UpdateEmailInput
): Promise<ActionResponse> => {
  const validation = updateEmailSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "You must be logged in to update your email.",
    };
  }

  // Check if user is OAuth user
  if (user.app_metadata?.provider && user.app_metadata.provider !== "email") {
    return {
      success: false,
      message: `You signed up with ${user.app_metadata.provider}. Email cannot be changed.`,
    };
  }

  const { error } = await supabase.auth.updateUser({
    email: validation.data.email,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Verification email sent to your new address. Please check your inbox.",
  };
};

export const updatePassword = async (
  data: UpdatePasswordInput
): Promise<ActionResponse> => {
  const validation = updatePasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "You must be logged in to update your password.",
    };
  }

  // Check if user is OAuth user
  if (user.app_metadata?.provider && user.app_metadata.provider !== "email") {
    return {
      success: false,
      message: `You signed up with ${user.app_metadata.provider}. Password cannot be changed.`,
    };
  }

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: validation.data.currentPassword,
  });

  if (signInError) {
    return {
      success: false,
      message: "Current password is incorrect.",
    };
  }

  // Update to new password
  const { error } = await supabase.auth.updateUser({
    password: validation.data.newPassword,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard/settings");

  return {
    success: true,
    message: "Password updated successfully.",
  };
};

export const signOut = async (scope: "local" | "global" = "local"): Promise<ActionResponse> => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({
    scope: scope,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect("/auth");
};

export const deleteAccount = async (password: string): Promise<ActionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "You must be logged in to delete your account.",
    };
  }

  // For email users, verify password
  if (!user.app_metadata?.provider || user.app_metadata.provider === "email") {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password,
    });

    if (signInError) {
      return {
        success: false,
        message: "Password is incorrect.",
      };
    }
  }

  // Delete user data in order (respecting foreign key constraints)
  // 1. Delete analysis results
  await supabase.from("analysis_results").delete().eq("user_id", user.id);

  // 2. Delete jobs
  await supabase.from("jobs").delete().eq("user_id", user.id);

  // 3. Delete resumes
  await supabase.from("resumes").delete().eq("user_id", user.id);

  // 4. Delete profile
  await supabase.from("profiles").delete().eq("user_id", user.id);

  // 5. Delete the auth user using admin API or RPC
  // Note: This requires either a database function or service role key
  // For now, we'll use the user's own session to request deletion
  // In production, you'd want a server-side function with admin privileges
  
  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to home
  redirect("/");
};

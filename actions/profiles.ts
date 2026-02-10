"use server";

import { createClient } from "@/app/lib/supabase/server";
import { profileSchema } from "@/schemas/profiles.schema";
import { parseProfileSkills } from "@/utils/parseProfileSkills";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileAction(
  profileId: string,
  formData: unknown,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  // Owner check
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("id", profileId)
    .single();
  if (!profile || profile.user_id !== user.id)
    return { success: false, message: "Forbidden" };

  const validated = profileSchema.safeParse(formData);
  if (!validated.success)
    return { success: false, errors: validated.error.flatten().fieldErrors };

  const profileData = validated.data;

  try {
    const { error: pError } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", profileId);
    if (pError) throw pError;

    // Clean sync for related tables
    await Promise.all([
      supabase.from("experience").delete().eq("profile_id", profileId),
      supabase.from("education").delete().eq("profile_id", profileId),
    ]);

    if (profileData.experience?.length) {
      const { error: expError } = await supabase
        .from("experience")
        .insert(profileData.experience);
      if (expError) throw expError;
    }
    if (profileData.education?.length) {
      const { error: eduError } = await supabase
        .from("education")
        .insert(profileData.education);
      if (eduError) throw eduError;
    }

    revalidatePath("/profile");

    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createProfileAction(formData: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const validated = profileSchema.safeParse(formData);
  if (!validated.success)
    return { success: false, errors: validated.error.flatten().fieldErrors };

  try {
    const { error: pError } = await supabase
      .from("profiles")
      .insert({ ...validated.data, user_id: user.id })
      .select("id")
      .single();

    if (pError) throw pError;
    if (validated.data.experience?.length) {
      const { error: expError } = await supabase
        .from("experience")
        .insert(validated.data.experience);
      if (expError) throw expError;
    }
    if (validated.data.education?.length) {
      const { error: eduError } = await supabase
        .from("education")
        .insert(validated.data.education);
      if (eduError) throw eduError;
    }

    revalidatePath("/profile");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, experience(*), education(*)")
      .eq("user_id", user.id)
      .single();
    const parsedSkills = parseProfileSkills(profile.skills);
    profile.skills = parsedSkills;
    return {
      user,
      profile: profile,
    };
  } catch {
    return {
      user,
      profile: {
        id: "",
        first_name: "",
        last_name: "",
        headline: "",
        bio: "",
        skills: [],
        location: "",
        portfolio_url: "",
        linkedin_url: "",
        experience: [],
        education: [],
      },
    };
  }
}

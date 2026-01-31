"use server";

import { createClient } from "@/app/lib/supabase/server";
import { profileSchema } from "@/schemas/profiles.schema";
import { mapDbToProfile, mapProfileToDb } from "@/utils/mapToDb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileAction(profileId: string, formData: unknown) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  // Owner check
  const { data: profile } = await supabase.from("profiles").select("user_id").eq("id", profileId).single();
  if (!profile || profile.user_id !== user.id) return { success: false, message: "Forbidden" };

  const validated = profileSchema.safeParse(formData);
  if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

  const dbData = mapProfileToDb(validated.data, profileId);

  try {
    const { error: pError } = await supabase.from("profiles").update(dbData.profile).eq("id", profileId);
    if (pError) throw pError;

    // Clean sync for related tables
    await Promise.all([
      supabase.from("experience").delete().eq("profile_id", profileId),
      supabase.from("education").delete().eq("profile_id", profileId),
    ]);

  if (dbData.experience?.length) {
      const { error: expError } = await supabase.from("experience").insert(dbData.experience);
      if (expError) throw expError;
    }
    if (dbData.education?.length) {
      const { error: eduError } = await supabase.from("education").insert(dbData.education);
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const validated = profileSchema.safeParse(formData);
  if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

  let newId = "";
  try {
    const { data: newProfile, error: pError } = await supabase
      .from("profiles")
      .insert({ ...mapProfileToDb(validated.data).profile, user_id: user.id })
      .select("id")
      .single();

    if (pError) throw pError;
    newId = newProfile.id;

    const dbData = mapProfileToDb(validated.data, newId);
    
  if (dbData.experience?.length) {
      const { error: expError } = await supabase.from("experience").insert(dbData.experience);
      if (expError) throw expError;
    }
    if (dbData.education?.length) {
      const { error: eduError } = await supabase.from("education").insert(dbData.education);
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

    const mappedProfile = profile ? mapDbToProfile(profile) : null;

  return {
    user,
    profile: mappedProfile,
  };
  } catch {
    return {
      user,
      profile: {
        id: "",
        firstName: "",
        lastName: "",
        headline: "",
        bio: "",
        skills: [],
        location: "",
        portfolioUrl: "",
        linkedinUrl: "",
        experience: [],
        education: [],
      },
    };
}
}

import { getProfile } from "@/actions/profiles";
import { ProfilePageContent } from "./_components/ProfilePageContent";

export default async function ProfilePage() {
  const { profile, user } = await getProfile();
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* 
        This header is now likely redundant in the new design (ProfilePageContent handles headers), 
        or we keep it for "Page Title" consistency? 
        Actually, ProfilePageContent now provides its own Headers for Edit/Read modes. 
        So we might want to remove this or make it conditional.
        The current design in ProfilePageContent includes headers. 
        Let's remove this outer wrapper text to avoid duplication.
      */}
      <ProfilePageContent initialProfile={profile ?? undefined} email={user?.email} />
    </div>
  );
}

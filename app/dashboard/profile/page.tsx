import { getProfile } from "@/actions/profiles";
import { ProfilePageContent } from "./_components/ProfilePageContent";

export default async function ProfilePage() {
  const { profile, user } = await getProfile();
  return (
    <div className="max-w-4xl mx-auto py-4 md:py-6 lg:py-10 px-4 space-y-8">
      <ProfilePageContent initialProfile={profile ?? undefined} email={user?.email} />
    </div>
  );
}

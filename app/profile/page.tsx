import { getProfile } from "../actions/profiles";
import { ProfileForm } from "./_components/ProfileForm";

export default async function ProfilePage() {
  const { profile } = await getProfile();
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">
          Your Career Signal
        </h1>
        <p className="text-muted-foreground">
          The AI uses this data to calculate your Match Score against job
          postings.
        </p>
      </div>

      <ProfileForm initialData={profile ?? undefined} />
    </div>
  );
}

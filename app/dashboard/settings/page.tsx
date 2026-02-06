import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { getCurrentUser } from "@/actions/account";
import {
  EmailSection,
  PasswordSection,
  SessionSection,
  DangerZone,
} from "./_components";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const isOAuthUser = user.provider !== "email";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences and security settings
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        <EmailSection
          currentEmail={user.email || ""}
          isOAuthUser={isOAuthUser}
          provider={user.provider}
        />

        <PasswordSection isOAuthUser={isOAuthUser} provider={user.provider} />

        <SessionSection provider={user.provider} createdAt={user.createdAt} />

        <DangerZone isOAuthUser={isOAuthUser} />
      </div>
    </div>
  );
}

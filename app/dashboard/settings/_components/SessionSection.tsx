"use client";

import { useState } from "react";
import { LogOut, Loader2, Monitor } from "lucide-react";
import { signOut } from "@/actions/account";

interface SessionSectionProps {
  provider: string;
  createdAt: string;
}

export default function SessionSection({ provider, createdAt }: SessionSectionProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutScope, setLogoutScope] = useState<"local" | "global" | null>(null);

  const handleLogout = async (scope: "local" | "global") => {
    setIsLoggingOut(true);
    setLogoutScope(scope);

    try {
      await signOut(scope);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      setLogoutScope(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Monitor className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Session</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Signed in via:</span>{" "}
            <span className="font-medium capitalize">{provider}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Account created:</span>{" "}
            <span className="font-medium">{formatDate(createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => handleLogout("local")}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            {isLoggingOut && logoutScope === "local" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isLoggingOut && logoutScope === "local" ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

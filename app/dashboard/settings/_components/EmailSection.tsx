"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { updateEmail } from "@/actions/account";

interface EmailSectionProps {
  currentEmail: string;
  isOAuthUser: boolean;
  provider?: string;
}

export default function EmailSection({
  currentEmail,
  isOAuthUser,
  provider,
}: EmailSectionProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateEmail({ email });
      if (result.success) {
        setMessage({ type: "success", text: result.message || "Email updated" });
        setEmail("");
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update email" });
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Email Address</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Current Email</label>
          <p className="mt-1 font-medium">{currentEmail}</p>
        </div>

        {isOAuthUser ? (
          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>
              You signed in with <span className="font-medium capitalize">{provider}</span>.
              Email address cannot be changed for OAuth accounts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                New Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter new email address"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>

            {message && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Updating..." : "Update Email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

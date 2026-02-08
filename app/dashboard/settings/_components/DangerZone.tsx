"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { deleteAccount } from "@/actions/account";

interface DangerZoneProps {
  isOAuthUser: boolean;
}

export default function DangerZone({ isOAuthUser }: DangerZoneProps) {
  const [showModal, setShowModal] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmation === "DELETE" && (isOAuthUser || password.length > 0);

  const handleDelete = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteAccount(password);
      if (!result.success) {
        setError(result.message || "Failed to delete account");
        setIsDeleting(false);
      }
      // If successful, the action will redirect
    } catch {
      setError("An unexpected error occurred");
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setConfirmation("");
    setPassword("");
    setError(null);
  };

  return (
    <>
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        </div>

        <p className="text-sm text-red-800 mb-4">
          Once you delete your account, there is no going back. All your data including
          your profile, saved jobs, and analysis results will be permanently deleted.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold">Delete Account</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              This action is <span className="font-semibold text-red-600">irreversible</span>.
              All your data will be permanently deleted, including:
            </p>

            <ul className="text-sm text-muted-foreground mb-4 list-disc list-inside space-y-1">
              <li>Your profile information</li>
              <li>All saved job postings</li>
              <li>Analysis results and comparisons</li>
              <li>Uploaded resumes</li>
            </ul>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Type <span className="font-mono text-red-600">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={isDeleting}
                />
              </div>

              {!isOAuthUser && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Enter your password to verify
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={isDeleting}
                  />
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!canDelete || isDeleting}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

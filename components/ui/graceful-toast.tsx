"use client";

import { toast } from "sonner";
import { AlertCircle, RotateCcw, X } from "lucide-react";

interface GracefulErrorProps {
  message: string;
  retryFn?: () => void | Promise<void>;
  title?: string;
  duration?: number;
  actionLabel?: string;
}

export const showGracefulError = ({
  message,
  retryFn,
  title = "Something went wrong",
  duration = 5000,
  actionLabel = "Try Again",
}: GracefulErrorProps) => {
  toast.custom(
    (t) => (
      <div className="w-89 flex flex-col gap-3 rounded-xl border border-red-100 bg-white p-4 shadow-xl shadow-black/5 ring-1 ring-black/5 transition-all">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 ring-4 ring-white">
            <AlertCircle size={18} />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-zinc-900 text-sm leading-none pt-1.5">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-zinc-400 hover:text-zinc-600 transition-colors -mr-1 -mt-1 p-1 rounded-md hover:bg-zinc-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Footer / Actions */}
        {retryFn && (
          <div className="flex justify-end pl-11">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                toast.dismiss(t);
                try {
                  await retryFn();
                } catch {
                  await showGracefulError({
                    message,
                    retryFn,
                    title,
                    duration,
                    actionLabel,
                  });
                }
              }}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 active:scale-95"
            >
              <RotateCcw size={12} />
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    ),
    {
      duration: retryFn ? Infinity : duration,
      position: "bottom-right",
    },
  );
};

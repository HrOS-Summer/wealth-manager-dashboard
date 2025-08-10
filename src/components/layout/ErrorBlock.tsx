import React from "react";
import clsx from "clsx";

export default function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="p-6 text-center">
      <div className="text-red-600 font-medium mb-2">Something went wrong</div>
      <div className="text-neutral-600 dark:text-neutral-400 mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className={clsx(
            "px-3 py-1.5 rounded-full",
            "bg-neutral-900 text-white text-sm",
            "hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600"
          )}
        >
          Retry
        </button>
      )}
    </div>
  );
}

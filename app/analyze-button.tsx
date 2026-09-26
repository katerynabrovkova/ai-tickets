"use client";

import { useState, useTransition } from "react";
import { analyzeTicket } from "./actions";

export function AnalyzeButton({ ticketId }: { ticketId: number }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await analyzeTicket(ticketId);
        if (!result.ok) setError(result.error);
      } catch {
        setError("Не вдалося виконати аналіз. Спробуйте ще раз.");
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-50"
      >
        {pending ? "Аналізуємо..." : "Аналізувати (AI)"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

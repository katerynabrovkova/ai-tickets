"use client";

import { useActionState } from "react";
import { createTicket, type CreateTicketState } from "./actions";

const initialState: CreateTicketState = { success: false };

export function TicketForm() {
  const [state, formAction, pending] = useActionState(
    createTicket,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5"
    >
      <div>
        <label
          htmlFor="customerName"
          className="mb-1 block text-sm font-medium text-zinc-700"
        >
          Ім&apos;я клієнта
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          required
          maxLength={100}
          defaultValue={state.values?.customerName}
          aria-describedby="customerName-error"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
        <FieldError id="customerName-error" errors={state.errors?.customerName} />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-zinc-700"
        >
          Текст звернення
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={5000}
          defaultValue={state.values?.message}
          aria-describedby="message-error"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
        <FieldError id="message-error" errors={state.errors?.message} />
      </div>

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Збереження..." : "Додати звернення"}
      </button>
    </form>
  );
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {errors[0]}
    </p>
  );
}

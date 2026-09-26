import { desc } from "drizzle-orm";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import { TicketForm } from "./ticket-form";

// Always read fresh tickets from the database
export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Kyiv",
});

export default async function Home() {
  const allTickets = await db
    .select()
    .from(tickets)
    .orderBy(desc(tickets.createdAt), desc(tickets.id));

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Звернення клієнтів
      </h1>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-zinc-900">Нове звернення</h2>
        <TicketForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-zinc-900">
          Усі звернення ({allTickets.length})
        </h2>

        {allTickets.length === 0 ? (
          <p className="text-sm text-zinc-500">Звернень поки немає.</p>
        ) : (
          <ul className="space-y-3">
            {allTickets.map((ticket) => (
              <li
                key={ticket.id}
                className="rounded-lg border border-zinc-200 bg-white p-4"
              >
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <span className="font-medium text-zinc-900">
                    {ticket.customerName}
                  </span>
                  <time
                    dateTime={ticket.createdAt.toISOString()}
                    className="shrink-0 text-xs text-zinc-500"
                  >
                    {dateFormatter.format(ticket.createdAt)}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm text-zinc-700">
                  {ticket.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

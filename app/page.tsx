import { desc } from "drizzle-orm";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import { categoryBadge, priorityBadge } from "@/lib/analysis-labels";
import { AnalyzeButton } from "./analyze-button";
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

                {ticket.analyzedAt && (
                  <div className="mt-4 space-y-3 border-t border-zinc-100 pt-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      {ticket.priority && (
                        <Badge {...priorityBadge(ticket.priority)} />
                      )}
                      {ticket.category && (
                        <Badge {...categoryBadge(ticket.category)} />
                      )}
                    </div>
                    {ticket.summary && (
                      <p className="text-zinc-800">{ticket.summary}</p>
                    )}
                    {ticket.draftReply && (
                      <div>
                        <p className="mb-1 text-xs font-medium text-zinc-500">
                          Чернетка відповіді
                        </p>
                        <p className="whitespace-pre-wrap rounded-md bg-zinc-50 p-3 text-zinc-700">
                          {ticket.draftReply}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-zinc-500">
                      Проаналізовано: {dateFormatter.format(ticket.analyzedAt)}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <AnalyzeButton ticketId={ticket.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

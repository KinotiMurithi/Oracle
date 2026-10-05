import { ArrowRight, Brain } from "lucide-react";
import Link from "next/link";

import { getEvents, type Event } from "@/lib/api";

function formatCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

function formatClosingDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EventsPage() {
  let events: Event[] = [];

  try {
    events = await getEvents();
  } catch {
    events = [];
  }

  const openEvents = events.filter(
    (event) => event.status === "OPEN",
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            The Oracle
          </Link>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link
              href="/events"
              className="text-white"
            >
              Events
            </Link>

            <Link
              href="/predictions"
              className="transition hover:text-white"
            >
              My predictions
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-white/15 px-5 py-2 transition hover:bg-white hover:text-slate-950"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Forecasting
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Open events
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Choose a real-world question, make your forecast,
            and put your judgment to the test.
          </p>
        </div>

        {openEvents.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/10 px-6 py-24 text-center">
            <Brain
              size={42}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-5 text-xl font-semibold">
              No open events
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              New forecasting events will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {openEvents.map((event) => (
              <article
                key={event.id}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    {formatCategory(event.category)}
                  </span>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
                    Open
                  </span>
                </div>

                <h2 className="mt-8 min-h-20 text-xl font-semibold leading-7">
                  {event.question}
                </h2>

                {event.description && (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                    {event.description}
                  </p>
                )}

                <div className="mt-8 border-t border-white/10 pt-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-600">
                        Closes
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {formatClosingDate(event.closes_at)}
                      </p>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className="flex items-center gap-2 text-sm font-medium transition group-hover:gap-3"
                    >
                      Forecast
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
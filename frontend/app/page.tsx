import {
  ArrowRight,
  BarChart3,
  Brain,
  Clock3,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import { getEvents } from "@/lib/api";

type Event = {
  id: number;
  question: string;
  description: string;
  category: string;
  status: string;
  resolution_source: string;
  opens_at: string;
  closes_at: string;
  resolved_at: string | null;
  winning_outcome: number | null;
  outcomes: {
    id: number;
    label: string;
    created_at: string;
  }[];
  created_at: string;
  updated_at: string;
};

function formatCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export default async function Home() {
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
            className="flex items-center gap-3"
          >
            <img
              src="/ratzon-logo.png"
              alt="Ratzon"
              className="h-10 w-10 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                The Oracle
              </h1>

              <p className="text-xs text-slate-500">
                Forecast. Learn. Improve.
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <Link
              href="/events"
              className="transition hover:text-white"
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
              href="/leaderboard"
              className="transition hover:text-white"
            >
              Leaderboard
            </Link>
          </div>

          <Link
            href="/login"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium transition hover:bg-white hover:text-slate-950"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              The forecasting platform
            </p>

            <h2 className="text-5xl font-bold tracking-tight md:text-7xl">
              Predict the future.
              <br />
              <span className="text-slate-500">
                Prove your judgment.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Make forecasts about real-world events, track
              your accuracy, improve your judgment, and climb
              the Oracle leaderboard.
            </p>

            <Link
              href="/events"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-105"
            >
              Explore events
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          <Stat
            icon={<Brain size={20} />}
            label="Active forecasters"
            value="—"
          />

          <Stat
            icon={<BarChart3 size={20} />}
            label="Predictions made"
            value="—"
          />

          <Stat
            icon={<Clock3 size={20} />}
            label="Open events"
            value={String(openEvents.length)}
          />

          <Stat
            icon={<Trophy size={20} />}
            label="Top rating"
            value="—"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Forecasting
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              Open events
            </h3>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            View all events
            <ArrowRight size={16} />
          </Link>
        </div>

        {openEvents.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
            <Brain
              className="mx-auto text-slate-600"
              size={40}
            />

            <h4 className="mt-5 text-xl font-semibold">
              No open events yet
            </h4>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              The Oracle is ready. Once forecasting events
              are published, they will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {openEvents.slice(0, 3).map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {formatCategory(event.category)}
                </span>

                <h4 className="mt-6 min-h-20 text-xl font-semibold leading-7">
                  {event.question}
                </h4>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium"
                  >
                    View event
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              How it works
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              Forecast. Get evaluated. Improve.
            </h3>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              title="Choose an event"
              description="Select a real-world question with a clearly defined outcome."
            />

            <Step
              number="02"
              title="Make your forecast"
              description="Choose an outcome and express how confident you are."
            />

            <Step
              number="03"
              title="Build your record"
              description="When the event resolves, your forecast is evaluated and your record improves."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3">
            <img
              src="/ratzon-logo.png"
              alt="Ratzon"
              className="h-7 w-7 object-contain"
            />

            <span className="text-sm text-slate-600">
              The Oracle
            </span>
          </div>

          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} The Oracle
          </p>
        </div>
      </footer>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-8">
      <div className="text-slate-500">
        {icon}
      </div>

      <div>
        <p className="text-xl font-bold">
          {value}
        </p>

        <p className="text-xs text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
      <span className="text-sm font-semibold tracking-widest text-slate-600">
        {number}
      </span>

      <h4 className="mt-8 text-xl font-semibold">
        {title}
      </h4>

      <p className="mt-3 text-sm leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}
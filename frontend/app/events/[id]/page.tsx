"use client";

import { ArrowLeft, Check, Clock3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { createPrediction, getEvent, type Event } from "@/lib/api";

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EventPage({ params }: EventPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(
    null,
  );
  const [confidence, setConfidence] = useState(50);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      const { id } = await params;

      try {
        const data = await getEvent(id);
        setEvent(data);
      } catch {
        setError("Unable to load this event.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [params]);

  async function handleSubmit() {
    if (!selectedOutcome) {
      setError("Select an outcome first.");
      return;
    }

    const token = localStorage.getItem("oracle_access_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!event) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createPrediction(
        token,
        event.id,
        selectedOutcome,
        confidence,
      );

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Prediction submission failed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-500">
            Loading event...
          </p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-slate-400"
          >
            <ArrowLeft size={17} />
            Back to events
          </Link>

          <h1 className="mt-12 text-3xl font-bold">
            Event unavailable
          </h1>

          <p className="mt-3 text-slate-500">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to events
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {event.category}
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            {event.question}
          </h1>

          {event.description && (
            <p className="mt-6 text-lg leading-8 text-slate-400">
              {event.description}
            </p>
          )}

          <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={17} />
            <span>
              Closes{" "}
              {new Date(event.closes_at).toLocaleString(
                "en-KE",
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                },
              )}
            </span>
          </div>
        </div>

        {success ? (
          <div className="mt-16 max-w-2xl rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
              <Check size={24} />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Forecast submitted
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Your forecast has been recorded. Once the event
              is resolved, The Oracle will evaluate it.
            </p>

            <Link
              href="/predictions"
              className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950"
            >
              View my predictions
            </Link>
          </div>
        ) : (
          <div className="mt-16 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Your forecast
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              What do you think will happen?
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {event.outcomes.map((outcome) => {
                const selected =
                  selectedOutcome === outcome.id;

                return (
                  <button
                    key={outcome.id}
                    type="button"
                    onClick={() =>
                      setSelectedOutcome(outcome.id)
                    }
                    className={`rounded-2xl border p-7 text-left transition ${
                      selected
                        ? "border-white bg-white/[0.08]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold">
                        {outcome.label}
                      </span>

                      {selected && (
                        <Check
                          size={20}
                          className="text-emerald-400"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    Confidence
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    How confident are you in this forecast?
                  </p>
                </div>

                <span className="text-2xl font-bold">
                  {confidence}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(event) =>
                  setConfidence(Number(event.target.value))
                }
                className="mt-6 w-full"
              />
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-8 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit forecast"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getPredictions,
  type Prediction,
} from "@/lib/api";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<
    Prediction[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPredictions() {
      const token = localStorage.getItem(
        "oracle_access_token",
      );

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const data = await getPredictions(token);
        setPredictions(data);
      } catch {
        setError("Unable to load your predictions.");
      } finally {
        setLoading(false);
      }
    }

    loadPredictions();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold"
          >
            The Oracle
          </Link>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link
              href="/events"
              className="hover:text-white"
            >
              Events
            </Link>

            <Link
              href="/predictions"
              className="text-white"
            >
              My predictions
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Your record
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          My predictions
        </h1>

        {loading && (
          <p className="mt-10 text-slate-500">
            Loading predictions...
          </p>
        )}

        {error && (
          <div className="mt-10 rounded-xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          predictions.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
              <h2 className="text-xl font-semibold">
                No predictions yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your forecasting record will appear here.
              </p>

              <Link
                href="/events"
                className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950"
              >
                Explore events
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          predictions.length > 0 && (
            <div className="mt-10 space-y-4">
              {predictions.map((prediction) => (
                <article
                  key={prediction.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">
                        Event #{prediction.event}
                      </p>

                      <p className="mt-2 font-semibold">
                        Outcome #{prediction.outcome}
                      </p>
                    </div>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                      {prediction.status}
                    </span>
                  </div>

                  <div className="mt-6 flex gap-8 text-sm">
                    <div>
                      <p className="text-slate-600">
                        Confidence
                      </p>

                      <p className="mt-1 font-semibold">
                        {prediction.confidence}%
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-600">
                        Points
                      </p>

                      <p className="mt-1 font-semibold">
                        {prediction.reward_points}
                      </p>
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
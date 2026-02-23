"use client";

import { useState } from "react";

export default function TeamPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    setError(null);

    const payload = {
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      discord: formData.get("discord")?.toString() ?? "",
      roleInterest: formData.get("roleInterest")?.toString() ?? "",
      experience: formData.get("experience")?.toString() ?? "",
      motivation: formData.get("motivation")?.toString() ?? "",
    };

    try {
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to submit application.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error while submitting application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#070707] px-4 py-10 text-slate-50 md:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            Join the Rapid Role team
          </p>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Help build the future of iGaming.
          </h1>
          <p className="max-w-2xl text-sm text-gray-400">
            We&apos;re looking for sharp minds across operations, community, product, and risk to
            help scale Rapid Role. Tell us who you are and why you&apos;d be a great fit.
          </p>
        </header>

        <main className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-6 shadow-[0_0_30px_rgba(0,0,0,0.7)]">
          {submitted ? (
            <div className="space-y-3 text-sm text-gray-300">
              <h2 className="text-lg font-semibold text-white">Application received ✅</h2>
              <p>
                Thanks for applying to join the admin team. We&apos;ll review your application and
                reach out via email or Discord if there&apos;s a fit.
              </p>
            </div>
          ) : (
            <form
              className="space-y-5"
              action={handleSubmit}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-gray-300">
                    Full name<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-gray-300">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="discord" className="text-xs font-medium text-gray-300">
                  Discord handle
                </label>
                <input
                  id="discord"
                  name="discord"
                  placeholder="username#0001"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="roleInterest" className="text-xs font-medium text-gray-300">
                  What roles are you interested in?
                </label>
                <input
                  id="roleInterest"
                  name="roleInterest"
                  placeholder="e.g. community mod, risk operations, product feedback"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="experience" className="text-xs font-medium text-gray-300">
                  Relevant experience
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={3}
                  placeholder="Share any experience with iGaming, crypto, moderation, operations, or similar."
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="motivation" className="text-xs font-medium text-gray-300">
                  Why Rapid Role?
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  rows={3}
                  placeholder="Tell us why you want to be part of the Rapid Role admin team."
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white outline-none focus:border-primary"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <p className="text-[11px] text-gray-500">
                  By submitting, you agree that we may contact you regarding this application.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-black shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-opacity hover:opacity-95 disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit application"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}


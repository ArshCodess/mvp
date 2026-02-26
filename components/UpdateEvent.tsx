"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface EventForm {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

const EMPTY: EventForm = {
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  location: "",
  imageUrl: "",
};

const CATEGORIES = [
  "Technology", "Business", "Arts & Culture", "Sports", "Music",
  "Education", "Health & Wellness", "Networking", "Workshop", "Other",
];

const STEPS = [
  { id: 1, label: "Basics",   icon: "✦" },
  { id: 2, label: "Details",  icon: "◈" },
  { id: 3, label: "Location", icon: "◎" },
  { id: 4, label: "Preview",  icon: "◐" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toDateInput(iso: string) {
  // "2025-06-15T10:30:00.000Z" → "2025-06-15"
  return iso ? new Date(iso).toISOString().slice(0, 10) : "";
}

function toTimeInput(iso: string) {
  // "2025-06-15T10:30:00.000Z" → "10:30"
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// ─── Shared components ────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-pink-600/70">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 text-sm " +
  "focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-200";

// ─── Steps ────────────────────────────────────────────────────────────────────
function Step1({ form, set, errors }: { form: EventForm; set: (k: keyof EventForm, v: string) => void; errors: Partial<EventForm> }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Event Title" error={errors.title}>
        <input
          className={inputCls}
          placeholder="Give your event a compelling name…"
          value={form.title}
          onChange={e => set("title", e.target.value)}
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          className={inputCls + " resize-none h-36"}
          placeholder="What's this event about? What should attendees expect?"
          value={form.description}
          onChange={e => set("description", e.target.value)}
        />
      </Field>

      <Field label="Category" error={errors.category}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => set("category", cat)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-200 text-left
                ${form.category === cat
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 border-transparent text-white shadow-md shadow-pink-200"
                  : "bg-white border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function Step2({ form, set, errors }: { form: EventForm; set: (k: keyof EventForm, v: string) => void; errors: Partial<EventForm> }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" error={errors.date}>
          <input
            type="date"
            className={inputCls}
            value={form.date}
            onChange={e => set("date", e.target.value)}
          />
        </Field>
        <Field label="Time" error={errors.time}>
          <input
            type="time"
            className={inputCls}
            value={form.time}
            onChange={e => set("time", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Cover Image URL" error={errors.imageUrl}>
        <input
          className={inputCls}
          placeholder="https://example.com/image.jpg (optional)"
          value={form.imageUrl}
          onChange={e => set("imageUrl", e.target.value)}
        />
        {form.imageUrl && (
          <div className="mt-2 rounded-xl overflow-hidden h-36 border border-gray-100 shadow-sm">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={e => ((e.target as HTMLImageElement).style.display = "none")}
            />
          </div>
        )}
      </Field>
    </div>
  );
}

function Step3({ form, set, errors }: { form: EventForm; set: (k: keyof EventForm, v: string) => void; errors: Partial<EventForm> }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Venue / Location" error={errors.location}>
        <input
          className={inputCls}
          placeholder="Building, street address, or 'Online'"
          value={form.location}
          onChange={e => set("location", e.target.value)}
        />
      </Field>

      <div className="rounded-2xl overflow-hidden border border-gray-100 h-56 bg-gray-50 flex items-center justify-center relative">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(236,72,153,0.25) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {form.location ? (
          <div className="relative text-center px-6">
            <div className="text-4xl mb-3">📍</div>
            <p className="text-gray-700 text-sm font-medium">{form.location}</p>
            <p className="text-gray-400 text-xs mt-1">Map preview coming soon</p>
          </div>
        ) : (
          <p className="relative text-gray-300 text-sm">Enter a location to see preview</p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-pink-50 border border-pink-100 text-sm text-pink-600/80 flex gap-3 items-start">
        <span className="text-pink-400 mt-0.5 flex-shrink-0">ℹ</span>
        <span>Make sure the venue is accessible. Consider adding parking info or nearest transit in your description.</span>
      </div>
    </div>
  );
}

function Step4Preview({ form }: { form: EventForm }) {
  const eventDate = form.date && form.time
    ? new Date(`${form.date}T${form.time}`)
    : null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold text-center mb-2">
        Review your changes
      </p>

      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <div className="relative h-40 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt={form.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => ((e.target as HTMLImageElement).style.display = "none")}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          {form.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
                {form.category}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-gray-900 font-bold text-lg mb-1 leading-tight">
            {form.title || <span className="text-gray-300 italic font-normal">Event title…</span>}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {form.description || <span className="italic">Description…</span>}
          </p>

          <div className="space-y-2 text-sm text-gray-500">
            {eventDate && (
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>{eventDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            )}
            {form.time && (
              <div className="flex items-center gap-2">
                <span>🕐</span>
                <span>{form.time}</span>
              </div>
            )}
            {form.location && (
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{form.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        {[
          ["Title", form.title],
          ["Description", form.description],
          ["Category", form.category],
          ["Date & Time", form.date && form.time ? "Set" : ""],
          ["Location", form.location],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span className={value ? "text-green-500" : "text-gray-300"}>
              {value ? "✓" : "○"}
            </span>
            <span className={value ? "text-gray-600" : "text-gray-300"}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function FormSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-11 bg-gray-100 rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-36 bg-gray-100 rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UpdateEventPage() {
  const router = useRouter();
  const { eventId } = useParams();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<EventForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<EventForm>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // ── Fetch existing event and pre-fill form ──
  useEffect(() => {
    if (!eventId) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setForm({
          title:       data.title       ?? "",
          description: data.description ?? "",
          category:    data.category    ?? "",
          date:        toDateInput(data.date),
          time:        toTimeInput(data.date),
          location:    data.location    ?? "",
          imageUrl:    data.imageUrl    ?? "",
        });
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const set = useCallback((k: keyof EventForm, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: "" }));
  }, []);

  const validate = (s: number): boolean => {
    const e: Partial<EventForm> = {};
    if (s === 1) {
      if (!form.title.trim()) e.title = "Title is required";
      if (!form.description.trim()) e.description = "Description is required";
      if (!form.category) e.category = "Please pick a category";
    }
    if (s === 2) {
      if (!form.date) e.date = "Date is required";
      if (!form.time) e.time = "Time is required";
    }
    if (s === 3) {
      if (!form.location.trim()) e.location = "Location is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const eventDate = new Date(`${form.date}T${form.time}`);

      const payload = {
        title:       form.title,
        description: form.description,
        category:    form.category,
        date:        eventDate.toISOString(),
        location:    form.location,
        imageUrl:    form.imageUrl || null,
      };

      const res = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update event");

      setSubmitted(true);
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── States ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-3xl mx-auto mb-6 animate-bounce shadow-lg shadow-pink-200">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Updated!</h2>
          <p className="text-gray-400 text-sm">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-400 text-sm mb-6">We couldn't load this event. It may have been deleted.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col items-center justify-start py-10 px-4">

      {/* Header */}
      <div className="w-full max-w-lg mb-8 text-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          ← Back
        </button>
        <p className="text-pink-500 text-xs tracking-widest uppercase font-semibold mb-1">Edit Event</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {step === 4 ? "Save changes?" : STEPS[step - 1].label === "Basics" ? "Update the basics" : `Edit ${STEPS[step - 1].label}`}
        </h1>
      </div>

      {/* Step indicators */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => !loading && step > s.id && setStep(s.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                    ${step === s.id
                      ? "bg-gradient-to-br from-pink-500 to-purple-500 border-transparent text-white shadow-lg shadow-pink-200 scale-110"
                      : step > s.id
                        ? "bg-gradient-to-br from-pink-400 to-purple-400 border-transparent text-white cursor-pointer hover:scale-105"
                        : "bg-white border-gray-200 text-gray-300 cursor-default"
                    }`}
                >
                  {step > s.id ? "✓" : s.icon}
                </button>
                <span className={`text-xs mt-1.5 font-medium transition-colors ${step === s.id ? "text-pink-500" : step > s.id ? "text-purple-400" : "text-gray-300"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-2 mb-5 relative overflow-hidden bg-gray-200 rounded-full">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500 rounded-full"
                    style={{ width: step > s.id ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-100/80">
          <div key={step} style={{ animation: "fadeSlideIn 0.3s ease" }}>
            {loading ? (
              <FormSkeleton />
            ) : (
              <>
                {step === 1 && <Step1 form={form} set={set} errors={errors} />}
                {step === 2 && <Step2 form={form} set={set} errors={errors} />}
                {step === 3 && <Step3 form={form} set={set} errors={errors} />}
                {step === 4 && <Step4Preview form={form} />}
              </>
            )}
          </div>

          {/* Navigation */}
          {!loading && (
            <div className={`flex gap-3 mt-8 ${step === 1 ? "justify-end" : "justify-between"}`}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 hover:text-gray-700 transition-all"
                >
                  ← Back
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 transition-all duration-200"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? "Saving…" : "💾 Save Changes"}
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-gray-300 text-xs mt-4">
          Step {step} of {STEPS.length}
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
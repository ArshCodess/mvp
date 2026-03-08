"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type LinkType = "WHATSAPP" | "MEET" | "ZOOM" | "DISCORD" | "YOUTUBE" | "OTHER";

interface EventLink {
  id: string;
  label: string;
  url: string;
  type: LinkType;
}

interface EventHighlight {
  id: string;
  text: string;
}

interface EventReward {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface EventForm {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  capacity: string;
  location: string;
  imageUrl: string;
  highlights: EventHighlight[];
  rewards: EventReward[];
  links: EventLink[];
}

const EMPTY: EventForm = {
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  capacity: "",
  location: "",
  imageUrl: "",
  highlights: [],
  rewards: [],
  links: [],
};

const CATEGORIES = [
  "Technology", "Business", "Arts & Culture", "Sports", "Music",
  "Education", "Health & Wellness", "Networking", "Workshop", "Other",
];

const STEPS = [
  { id: 1, label: "Basics",   icon: "✦" },
  { id: 2, label: "Details",  icon: "◈" },
  { id: 3, label: "Location", icon: "◎" },
  { id: 4, label: "Extras",   icon: "◇" },
  { id: 5, label: "Preview",  icon: "◐" },
];

const LINK_TYPE_META: Record<LinkType, { label: string; placeholder: string; color: string; icon: string }> = {
  WHATSAPP: { label: "WhatsApp",    placeholder: "https://chat.whatsapp.com/...", color: "bg-green-50 border-green-300 text-green-700",   icon: "💬" },
  MEET:     { label: "Google Meet", placeholder: "https://meet.google.com/...",   color: "bg-blue-50 border-blue-300 text-blue-700",     icon: "🎥" },
  ZOOM:     { label: "Zoom",        placeholder: "https://zoom.us/j/...",          color: "bg-sky-50 border-sky-300 text-sky-700",        icon: "📹" },
  DISCORD:  { label: "Discord",     placeholder: "https://discord.gg/...",         color: "bg-indigo-50 border-indigo-300 text-indigo-700", icon: "🎮" },
  YOUTUBE:  { label: "YouTube",     placeholder: "https://youtube.com/live/...",   color: "bg-red-50 border-red-300 text-red-700",        icon: "▶️" },
  OTHER:    { label: "Other",       placeholder: "https://...",                    color: "bg-gray-50 border-gray-300 text-gray-700",     icon: "🔗" },
};

const REWARD_ICON_OPTIONS = ["🏆", "🎁", "📜", "🤝", "🎓", "🍕", "👕", "💡", "🌟", "🎤"];

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toDateInput(iso: string) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "";
}
function toTimeInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// ─── Shared components ────────────────────────────────────────────────────────
function Field({
  label, error, hint, children,
}: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-pink-600/70">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 -mt-1">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 text-sm " +
  "focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-200";

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function Step1({
  form, set, errors,
}: { form: EventForm; set: (k: keyof EventForm, v: string) => void; errors: Partial<Record<keyof EventForm, string>> }) {
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
          className={inputCls + " resize-none h-36 whitespace-pre-wrap"}
          placeholder="What's this event about?"
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

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function Step2({
  form, set, errors,
}: { form: EventForm; set: (k: keyof EventForm, v: string) => void; errors: Partial<Record<keyof EventForm, string>> }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" error={errors.date}>
          <input type="date" className={inputCls} value={form.date} onChange={e => set("date", e.target.value)} />
        </Field>
        <Field label="Time" error={errors.time}>
          <input type="time" className={inputCls} value={form.time} onChange={e => set("time", e.target.value)} />
        </Field>
      </div>

      <Field label="Capacity" error={errors.capacity} hint="Leave blank for unlimited">
        <div className="relative">
          <input
            type="number"
            min="1"
            className={inputCls + " pr-16"}
            placeholder="e.g. 200"
            value={form.capacity}
            onChange={e => set("capacity", e.target.value)}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-300 pointer-events-none">seats</span>
        </div>
        {form.capacity && (
          <p className="text-xs text-pink-500 mt-1">
            Up to <span className="font-bold">{parseInt(form.capacity).toLocaleString()}</span> attendees
          </p>
        )}
      </Field>

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

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function Step3({
  form, set, errors,
}: { form: EventForm; set: (k: keyof EventForm, v: string) => void; errors: Partial<Record<keyof EventForm, string>> }) {
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
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(236,72,153,0.25) 1px, transparent 0)", backgroundSize: "28px 28px" }}
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

// ─── Step 4 — Extras ─────────────────────────────────────────────────────────
function Step4Extras({
  form, setHighlights, setRewards, setLinks,
}: {
  form: EventForm;
  setHighlights: (h: EventHighlight[]) => void;
  setRewards: (r: EventReward[]) => void;
  setLinks: (l: EventLink[]) => void;
}) {
  const [activeTab, setActiveTab] = useState<"highlights" | "rewards" | "links">("highlights");

  const addHighlight    = () => setHighlights([...form.highlights, { id: uid(), text: "" }]);
  const updateHighlight = (id: string, text: string) => setHighlights(form.highlights.map(h => h.id === id ? { ...h, text } : h));
  const removeHighlight = (id: string) => setHighlights(form.highlights.filter(h => h.id !== id));

  const addReward    = () => setRewards([...form.rewards, { id: uid(), icon: "🏆", title: "", description: "" }]);
  const updateReward = (id: string, key: keyof EventReward, value: string) => setRewards(form.rewards.map(r => r.id === id ? { ...r, [key]: value } : r));
  const removeReward = (id: string) => setRewards(form.rewards.filter(r => r.id !== id));

  const addLink    = () => setLinks([...form.links, { id: uid(), label: "", url: "", type: "OTHER" }]);
  const updateLink = (id: string, key: keyof EventLink, value: string) => setLinks(form.links.map(l => l.id === id ? { ...l, [key]: value } : l));
  const removeLink = (id: string) => setLinks(form.links.filter(l => l.id !== id));

  const tabs = [
    { key: "highlights" as const, emoji: "✨", label: "Highlights", count: form.highlights.length },
    { key: "rewards"    as const, emoji: "🎁", label: "Rewards",    count: form.rewards.length },
    { key: "links"      as const, emoji: "🔗", label: "Links",      count: form.links.length },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar */}
      <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5
              ${activeTab === tab.key
                ? "bg-white text-pink-600 shadow-sm border border-gray-100"
                : "text-gray-400 hover:text-gray-600"
              }`}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold leading-none
                ${activeTab === tab.key ? "bg-pink-100 text-pink-600" : "bg-gray-200 text-gray-500"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Highlights */}
      {activeTab === "highlights" && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400">List what makes your event special.</p>
          {form.highlights.map((h, i) => (
            <div key={h.id} className="flex items-center gap-2">
              <span className="w-5 h-5 flex-shrink-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <textarea
                className={inputCls + " flex-1 whitespace-pre-wrap"}
                placeholder="e.g. Hands-on workshops with industry experts"
                value={h.text}
                onChange={e => updateHighlight(h.id, e.target.value)}
              />
              <button type="button" onClick={() => removeHighlight(h.id)}
                className="flex-shrink-0 w-8 h-8 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-all text-lg leading-none">
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={addHighlight}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50/50 transition-all duration-200 flex items-center justify-center gap-2">
            <span className="text-lg leading-none">+</span> Add Highlight
          </button>
        </div>
      )}

      {/* Rewards */}
      {activeTab === "rewards" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-400">Show attendees what they'll receive.</p>
          {form.rewards.map(r => (
            <div key={r.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 relative">
              <button type="button" onClick={() => removeReward(r.id)}
                className="absolute top-3 right-3 w-7 h-7 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-all text-lg leading-none">
                ×
              </button>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-widest uppercase text-pink-600/70">Icon</label>
                <div className="flex flex-wrap gap-1.5">
                  {REWARD_ICON_OPTIONS.map(icon => (
                    <button key={icon} type="button" onClick={() => updateReward(r.id, "icon", icon)}
                      className={`w-9 h-9 rounded-xl text-base flex items-center justify-center transition-all border
                        ${r.icon === icon
                          ? "bg-gradient-to-br from-pink-100 to-purple-100 border-pink-300 shadow-sm scale-110"
                          : "bg-white border-gray-200 hover:border-pink-200 hover:scale-105"
                        }`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
                <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-widest uppercase text-pink-600/70">Title</label>
                  <textarea className={inputCls + " resize-none h-20 whitespace-pre-wrap"} placeholder="e.g. Certificate" value={r.title} onChange={e => updateReward(r.id, "title", e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-widest uppercase text-pink-600/70">Description</label>
                  <textarea className={inputCls + " resize-none h-20 whitespace-pre-wrap"} placeholder="e.g. Attendance cert" value={r.description} onChange={e => updateReward(r.id, "description", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addReward}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50/50 transition-all duration-200 flex items-center justify-center gap-2">
            <span className="text-lg leading-none">+</span> Add Reward
          </button>
        </div>
      )}

      {/* Links */}
      {activeTab === "links" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-400">Add WhatsApp groups, Meet links, Discord servers, and more.</p>
          {form.links.map(link => {
            const meta = LINK_TYPE_META[link.type];
            return (
              <div key={link.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 relative">
                <button type="button" onClick={() => removeLink(link.id)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-all text-lg leading-none">
                  ×
                </button>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-widest uppercase text-pink-600/70">Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.keys(LINK_TYPE_META) as LinkType[]).map(type => (
                      <button key={type} type="button" onClick={() => updateLink(link.id, "type", type)}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all
                          ${link.type === type
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 border-transparent text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-600"
                          }`}>
                        {LINK_TYPE_META[type].icon} {LINK_TYPE_META[type].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-widest uppercase text-pink-600/70">Label</label>
                    <input className={inputCls} placeholder={`e.g. ${meta.label} Group`} value={link.label} onChange={e => updateLink(link.id, "label", e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-widest uppercase text-pink-600/70">URL</label>
                    <textarea className={inputCls + " resize-none h-20 whitespace-pre-wrap"} placeholder={meta.placeholder} value={link.url} onChange={e => updateLink(link.id, "url", e.target.value)} />
                  </div>
                </div>
                {link.url && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${meta.color}`}>
                    <span>{meta.icon}</span>
                    <span className="truncate">{link.label || meta.label}</span>
                    <span className="ml-auto opacity-60 truncate max-w-[120px]">{link.url}</span>
                  </div>
                )}
              </div>
            );
          })}
          <button type="button" onClick={addLink}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50/50 transition-all duration-200 flex items-center justify-center gap-2">
            <span className="text-lg leading-none">+</span> Add Link
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step 5 — Preview ─────────────────────────────────────────────────────────
function Step5Preview({ form }: { form: EventForm }) {
  const eventDate = form.date && form.time ? new Date(`${form.date}T${form.time}`) : null;

  const checks: [string, boolean, boolean][] = [
    ["Title",       !!form.title,                         true],
    ["Description", !!form.description,                   true],
    ["Category",    !!form.category,                      true],
    ["Date & Time", !!(form.date && form.time),           true],
    ["Location",    !!form.location,                      true],
    ["Capacity",    !!form.capacity,                      false],
    ["Highlights",  form.highlights.length > 0,           false],
    ["Rewards",     form.rewards.length > 0,              false],
    ["Links",       form.links.length > 0,                false],
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold text-center mb-2">
        Review your changes
      </p>

      {/* Event card preview */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <div className="relative h-40 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
          {form.imageUrl && (
            <img src={form.imageUrl} alt={form.title} className="absolute inset-0 w-full h-full object-cover"
              onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
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
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 whitespace-pre-wrap">
            {form.description || <span className="italic">Description…</span>}
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            {eventDate && (
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>{eventDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            )}
            {form.location && <div className="flex items-center gap-2"><span>📍</span><span>{form.location}</span></div>}
            {form.capacity && (
              <div className="flex items-center gap-2">
                <span>👥</span><span>Up to {parseInt(form.capacity).toLocaleString()} seats</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extras counters */}
      {(form.highlights.length > 0 || form.rewards.length > 0 || form.links.length > 0) && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: "✨", label: "Highlights", count: form.highlights.length },
            { emoji: "🎁", label: "Rewards",    count: form.rewards.length },
            { emoji: "🔗", label: "Links",      count: form.links.length },
          ].map(({ emoji, label, count }) => (
            <div key={label} className={`rounded-xl p-3 text-center border ${count > 0 ? "bg-pink-50 border-pink-100" : "bg-gray-50 border-gray-100"}`}>
              <div className="text-xl mb-1">{emoji}</div>
              <div className={`text-lg font-bold ${count > 0 ? "text-pink-600" : "text-gray-300"}`}>{count}</div>
              <div className={`text-xs ${count > 0 ? "text-pink-500" : "text-gray-300"}`}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Checklist */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Checklist</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {checks.map(([label, value, required]) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <span className={value ? "text-green-500" : required ? "text-red-400" : "text-gray-300"}>
                {value ? "✓" : required ? "✗" : "○"}
              </span>
              <span className={value ? "text-gray-600" : required ? "text-red-400" : "text-gray-300"}>
                {label}
              </span>
              {!value && required && <span className="text-red-300 text-xs">(required)</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
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
export default function UpdateEventPage({eventId}: { eventId: string }) {
  const router = useRouter();

  // ── BUG FIX: useParams() can return string | string[] | undefined.
  //    Normalise to a plain string before using in fetch.
  const [step,       setStep]       = useState(1);
  const [form,       setForm]       = useState<EventForm>(EMPTY);
  const [errors,     setErrors]     = useState<Partial<Record<keyof EventForm, string>>>({});
  const [loading,    setLoading]    = useState(true);   // starts true; set false after fetch OR on error
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // ── Fetch & pre-fill ──────────────────────────────────────────────────────
  useEffect(() => {
    // BUG FIX: Don't return early without calling setLoading(false).
    // If eventId is still empty on first render we wait; once it resolves the
    // effect re-runs. But we guard against an infinite empty-string loop by
    // only skipping when eventId is truly absent.
    if (!eventId) {
      // Give Next.js one tick to resolve the param before giving up.
      const timer = setTimeout(() => {
        if (!eventId) {
          setFetchError(true);
          setLoading(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();

        if (cancelled) return;

        setForm({
          title:       data.title       ?? "",
          description: data.description ?? "",
          category:    data.category    ?? "",
          date:        toDateInput(data.date),
          time:        toTimeInput(data.date),
          capacity:    data.capacity ? String(data.capacity) : "",
          location:    data.location    ?? "",
          imageUrl:    data.imageUrl    ?? "",
          // Map existing DB rows → local state (preserve IDs for stable keys)
          highlights: (data.highlights ?? []).map((h: { id: string; text: string }) => ({
            id:   h.id,
            text: h.text,
          })),
          rewards: (data.rewards ?? []).map((r: { id: string; icon: string; title: string; description: string }) => ({
            id:          r.id,
            icon:        r.icon,
            title:       r.title,
            description: r.description,
          })),
          links: (data.links ?? []).map((l: { id: string; label: string; url: string; type: LinkType }) => ({
            id:    l.id,
            label: l.label,
            url:   l.url,
            type:  l.type,
          })),
        });
      } catch {
        if (!cancelled) setFetchError(true);
      } finally {
        if (!cancelled) setLoading(false); // ← always reached now
      }
    };

    load();
    return () => { cancelled = true; };
  }, [eventId]);

  // ── Form helpers ──────────────────────────────────────────────────────────
  const set = useCallback((k: keyof EventForm, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: "" }));
  }, []);

  const setHighlights = (h: EventHighlight[]) => setForm(prev => ({ ...prev, highlights: h }));
  const setRewards    = (r: EventReward[])    => setForm(prev => ({ ...prev, rewards: r }));
  const setLinks      = (l: EventLink[])      => setForm(prev => ({ ...prev, links: l }));

  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof EventForm, string>> = {};
    if (s === 1) {
      if (!form.title.trim())       e.title       = "Title is required";
      if (!form.description.trim()) e.description = "Description is required";
      if (!form.category)           e.category    = "Please pick a category";
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

  // ── Submit ────────────────────────────────────────────────────────────────
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
        capacity:    form.capacity ? parseInt(form.capacity) : 0,
        imageUrl:    form.imageUrl || null,
        highlights:  form.highlights.filter(h => h.text.trim()),
        rewards:     form.rewards.filter(r => r.title.trim()),
        links:       form.links.filter(l => l.url.trim()),
      };

      const res = await fetch(`/api/events/${eventId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
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

  // ── Render states ─────────────────────────────────────────────────────────
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

  const stepTitles: Record<number, string> = {
    1: "Update the basics",
    2: "Edit Details",
    3: "Edit Location",
    4: "Extras & Links",
    5: "Save changes?",
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{stepTitles[step]}</h1>
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
                {step === 4 && (
                  <Step4Extras
                    form={form}
                    setHighlights={setHighlights}
                    setRewards={setRewards}
                    setLinks={setLinks}
                  />
                )}
                {step === 5 && <Step5Preview form={form} />}
              </>
            )}
          </div>

          {/* Navigation — hidden while loading */}
          {!loading && (
            <div className={`flex gap-3 mt-8 ${step === 1 ? "justify-end" : "justify-between"}`}>
              {step > 1 && (
                <button type="button" onClick={back}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 hover:text-gray-700 transition-all">
                  ← Back
                </button>
              )}
              {step < 5 ? (
                <button type="button" onClick={next}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 transition-all duration-200">
                  {step === 4 ? "Preview →" : "Continue →"}
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {submitting ? "Saving…" : "💾 Save Changes"}
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-gray-300 text-xs mt-4">Step {step} of {STEPS.length}</p>
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
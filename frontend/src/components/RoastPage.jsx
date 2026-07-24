import { useMemo, useState } from "react";
import {
  Bookmark,
  Copy,
  Flame,
  LoaderCircle,
  MessageSquare,
  Quote,
  RotateCcw,
  Send,
  Share2,
  Skull,
  SlidersHorizontal,
  WandSparkles,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { createRoast, updateRoastFavorite } from "../api/roastApi";

const roastStyles = [
  { label: "Friendly", value: "friendly" },
  { label: "Savage", value: "savage" },
  { label: "Brutal", value: "brutal" },
  { label: "Corporate", value: "corporate" },
  { label: "Study", value: "study" },
  { label: "Shakespeare", value: "shakespeare" },
  { label: "Gamer", value: "gamer" },
  { label: "Satire", value: "satire" },
  { label: "Sarcastic", value: "Sarcastic" },
  { label: "Gen-Z", value: "genz" },
];

const languages = [
  { label: "English", value: "english" },
  { label: "Hinglish", value: "hinglish" },
  { label: "Hindi", value: "hindi" },
];

const topics = [
  { label: "General", value: "general" },
  { label: "Coding", value: "coding" },
  { label: "Career", value: "career" },
  { label: "School", value: "school" },
  { label: "College", value: "college" },
  { label: "Gaming", value: "gaming" },
  { label: "Fitness", value: "fitness" },
  { label: "Gym", value: "gym" },
  { label: "Sports", value: "sports" },
  { label: "Anime", value: "anime" },
  { label: "Movies", value: "movies" },
  { label: "Technology", value: "technology" },
  { label: "Social Media", value: "social_media" },
  { label: "Relationships", value: "relationships" },
  { label: "Dating", value: "dating" },
  { label: "Friends", value: "friends" },
  { label: "Family", value: "family" },
  { label: "Fashion", value: "fashion" },
  { label: "Food", value: "food" },
  { label: "Travel", value: "travel" },
  { label: "Music", value: "music" },
  { label: "Study", value: "study" },
  { label: "Business", value: "business" },
  { label: "Startup", value: "startup" },
  { label: "AI", value: "ai" },
  { label: "Memes", value: "memes" },
  { label: "Cricket", value: "cricket" },
  { label: "Football", value: "football" },
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Habits", value: "habits" },
];

const quickPrompts = [
  "Roast my coding habits.",
  "My friend is always late.",
  "Roast a startup founder pitch.",
];

const damageLabels = {
  1: { level: 30, copy: "Soft Toast" },
  2: { level: 48, copy: "Warm Burn" },
  3: { level: 66, copy: "Direct Hit" },
  4: { level: 82, copy: "Critical Hit" },
  5: { level: 95, copy: "Fatal Damage" },
};

const sampleRoast =
  "Bro writes console.log() like it is a debugging strategy, a coping mechanism, and somehow still the only senior engineer on the team.";

function getRoastText(result) {
  if (!result) return sampleRoast;
  if (typeof result.roast === "string") return result.roast;
  return result.roast?.roast || sampleRoast;
}

function scrollToSettings() {
  document
    .getElementById("roast-settings")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function RoastPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [target, setTarget] = useState("");
  const [weapon, setWeapon] = useState("savage");
  const [intensity, setIntensity] = useState(4);
  const [language, setLanguage] = useState("english");
  const [topic, setTopic] = useState("coding");
  const [appliedWeapon, setAppliedWeapon] = useState("savage");
  const [appliedIntensity, setAppliedIntensity] = useState(4);
  const [appliedLanguage, setAppliedLanguage] = useState("english");
  const [appliedTopic, setAppliedTopic] = useState("coding");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const damage = damageLabels[appliedIntensity];
  const draftDamage = damageLabels[intensity];
  const roastText = useMemo(() => getRoastText(result), [result]);
  const selectedStyle = roastStyles.find((style) => style.value === appliedWeapon);
  const selectedLanguage = languages.find((item) => item.value === appliedLanguage);
  const currentRoastId = result?.roast?._id;

  const hasSettingChanges =
    weapon !== appliedWeapon ||
    intensity !== appliedIntensity ||
    language !== appliedLanguage ||
    topic !== appliedTopic;

  const applySettings = () => {
    setAppliedWeapon(weapon);
    setAppliedIntensity(intensity);
    setAppliedLanguage(language);
    setAppliedTopic(topic);
    setError("");
  };

  const submitRoast = async (event) => {
    event?.preventDefault();

    const trimmedTarget = target.trim();
    if (!trimmedTarget) {
      setError("Give Roaster a target first.");
      return;
    }

    const input =
      appliedTopic === "general"
        ? trimmedTarget
        : `${trimmedTarget} Topic: ${appliedTopic}.`;

    try {
      setLoading(true);
      setError("");
      setSaved(false);
      const data = await createRoast({
        input,
        weapon: appliedWeapon,
        intensity: appliedIntensity,
        language: appliedLanguage,
      });
      setResult(data);
      setSaved(Boolean(data?.roast?.isFavorite));
    } catch (error) {
      if (error?.response?.status === 401) {
        setUser(null);
        navigate("/register", { replace: true });
        return;
      }

      const fallback =
        "Roaster missed the target. Try again in a moment.";
      setError(error?.response?.data?.message || fallback);
    } finally {
      setLoading(false);
    }
  };

  const copyRoast = async () => {
    try {
      await navigator.clipboard?.writeText(roastText);
    } catch {
      setError("Copy failed in this browser.");
    }
  };

  const shareRoast = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Roaster", text: roastText });
      } else {
        await navigator.clipboard?.writeText(roastText);
      }
    } catch {
      setError("Share was cancelled.");
    }
  };

  const saveFavorite = async () => {
    if (!currentRoastId) {
      setError("Generate a roast first, then save it.");
      return;
    }

    try {
      setFavoriteLoading(true);
      setError("");
      const data = await updateRoastFavorite(currentRoastId, !saved);
      setSaved(Boolean(data.roast?.isFavorite));
      setResult((value) => ({
        ...value,
        roast: data.roast,
      }));
    } catch (error) {
      if (error?.response?.status === 401) {
        setUser(null);
        navigate("/register", { replace: true });
        return;
      }

      setError(error?.response?.data?.message || "Failed to update favorite.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#111010] text-white antialiased">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#111010_0%,#151211_42%,#241711_100%)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,99,31,.18),transparent_34%)]" />

      <header className="sticky top-0 z-20 border-b border-orange-500/10 bg-[#111010]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:min-h-20 sm:gap-4 sm:px-6 lg:px-8 2xl:px-10">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-[#1d1715] text-orange-400 shadow-[0_0_28px_rgba(255,91,31,.18)] sm:h-12 sm:w-12">
              <Flame size={22} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-black italic tracking-wide text-[#ffb195] sm:text-2xl">
                ROASTER
              </p>
              <p className="hidden text-xs font-bold uppercase tracking-[2px] text-[#75645d] sm:block">
                High impact burns
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/favorites")}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-orange-400/20 bg-[#1b1715] px-3 text-sm font-bold text-[#ffb195] transition hover:border-orange-400/50 hover:bg-[#241d1a] focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] sm:h-12 sm:px-4"
            >
              <Bookmark size={18} />
              <span className="md:hidden">Saved</span>
              <span className="hidden md:inline">Favorites</span>
            </button>
            <button
              type="button"
              onClick={scrollToSettings}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-orange-400/20 bg-[#1b1715] px-3 text-sm font-bold text-[#ffb195] transition hover:border-orange-400/50 hover:bg-[#241d1a] focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] sm:h-12 sm:px-4"
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:gap-10 lg:px-8 lg:py-10 xl:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)] 2xl:px-10">
        <section className="min-w-0 space-y-6 sm:space-y-8 lg:space-y-10">
          <section className="overflow-hidden rounded-2xl border border-orange-500/10 bg-[#191514]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,.34)] sm:rounded-3xl sm:p-6 lg:p-8">
            <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
              <div className="min-w-0 space-y-5 sm:space-y-6">
                <div className="flex w-fit max-w-full items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs font-black uppercase tracking-[2px] text-[#ffb195] sm:px-4">
                  <Zap size={14} />
                  <span className="truncate">Roast Toaster</span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h1 className="max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                    Start a smarter roast.
                  </h1>
                  <p className="max-w-2xl text-sm font-semibold leading-6 text-[#bba9a0] sm:text-base sm:leading-7 lg:text-lg">
                    Drop a name, habit, link, or topic. Roaster will keep it
                    sharp, fast, and on target.
                  </p>
                </div>
              </div>

              <div className="min-w-0 rounded-2xl border border-orange-500/10 bg-[#100f0e] p-4 shadow-[0_18px_42px_rgba(0,0,0,.24)] sm:p-5">
                <div className="flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[2px] text-[#8f7a72]">
                  <span>Damage</span>
                  <span>{damage.level}%</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#302825]">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#ffd43b] via-[#ff7a1f] to-[#ff4635] transition-all duration-500"
                    style={{ width: `${damage.level}%` }}
                  />
                </div>
                <p className="mt-4 text-base font-black text-[#ffb195]">
                  {damage.copy}
                </p>
              </div>
            </div>

            <form onSubmit={submitRoast} className="mt-6 sm:mt-8">
              <div className="min-w-0 rounded-2xl border border-orange-500/10 bg-[#111010] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition focus-within:border-orange-400/60 focus-within:ring-4 focus-within:ring-orange-500/10 sm:rounded-3xl sm:p-6">
                <div className="mb-4 flex items-center gap-3 text-[#a67565]">
                  <MessageSquare size={20} />
                  <span className="text-xs font-black uppercase tracking-[2px]">
                    Target
                  </span>
                </div>

                <textarea
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                  placeholder="Ask Roaster to burn someone..."
                  rows={4}
                  className="block min-h-40 w-full resize-none rounded-2xl border border-orange-500/10 bg-[#100f0e] p-4 text-base font-semibold leading-7 text-white outline-none placeholder:text-[#5f5550] sm:min-h-48 sm:p-5"
                />

                <div className="mt-6 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex min-w-0 flex-1 flex-wrap gap-3">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setTarget(prompt)}
                        className="min-h-11 max-w-full rounded-xl border border-orange-500/10 bg-[#1c1715] px-3 py-2 text-left text-xs font-bold leading-5 text-[#cab8ae] transition hover:border-orange-400/40 hover:bg-[#241d1a] hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] sm:px-4 sm:text-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !target.trim()}
                    className={`flex h-14 w-full shrink-0 items-center justify-center gap-3 rounded-xl px-8 text-base font-black shadow-[0_18px_42px_rgba(255,91,31,.24)] transition focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto lg:min-w-44 ${
                      loading
                        ? "border border-orange-400/30 bg-[#392018] text-[#ffb195]"
                        : "bg-linear-to-r from-[#ff5b1f] via-[#ff6f1f] to-[#d44708] text-white hover:shadow-[0_18px_52px_rgba(255,91,31,.35)]"
                    }`}
                  >
                    {loading ? "Roasting" : "Roast"}
                    {loading ? (
                      <LoaderCircle size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-orange-500/10 bg-[#151312] p-4 shadow-[0_28px_90px_rgba(0,0,0,.42)] sm:rounded-3xl sm:p-6 lg:p-8">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3 text-[#ffb195]">
                <Quote size={28} />
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[2px]">
                    Generated Roast
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#8f7a72]">
                    Live output from the current roast settings
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full border border-orange-500/10 bg-[#201917] px-4 py-2 text-[#d5c0b8]">
                  {selectedStyle?.label}
                </span>
                <span className="rounded-full border border-orange-500/10 bg-[#201917] px-4 py-2 text-[#d5c0b8]">
                  {selectedLanguage?.label}
                </span>
              </div>
            </div>

            <div className="mt-6 flex min-h-60 min-w-0 items-center justify-center rounded-2xl border border-orange-500/10 bg-[#100f0e] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] sm:min-h-80 sm:rounded-3xl sm:p-8 lg:min-h-85">
              <p className="w-full whitespace-normal wrap-break-words text-center text-xl font-black  italic leading-tight text-[#f5efec] min-[390px]:text-2xl sm:text-2xl lg:text-3xl 2xl:text-4xl">
                {loading ? "Preheating the burn..." : roastText}
              </p>
            </div>

            <div className="mt-6 space-y-6">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-base font-black text-[#ffb195] sm:text-lg">
                    {damage.level}% {damage.copy}
                  </span>
                  <span className="text-xs font-black uppercase tracking-[2px] text-[#8f7a72]">
                    Level {intensity}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#332a26]">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#ffd43b] via-[#ff7a1f] to-[#ff4635] transition-all duration-500"
                    style={{ width: `${damage.level}%` }}
                  />
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-4">
                <button
                  type="button"
                  onClick={copyRoast}
                  className="flex h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-orange-500/10 bg-[#201917] px-4 text-sm font-bold text-[#cab8ae] transition hover:border-orange-400/40 hover:bg-[#241d1a] hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] sm:h-14"
                  aria-label="Copy roast"
                >
                  <Copy size={18} />
                  <span>Copy</span>
                </button>
                <button
                  type="button"
                  onClick={saveFavorite}
                  disabled={!currentRoastId || favoriteLoading}
                  className={`flex h-12 min-w-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 ${
                    favoriteLoading
                      ? "border-orange-400/30 bg-[#392018] text-[#ffb195]"
                      : saved
                        ? "border-[#ffb195] bg-[#4a2a22] text-white hover:bg-[#573026]"
                        : "border-orange-500/10 bg-[#201917] text-[#cab8ae] hover:border-orange-400/40 hover:bg-[#241d1a] hover:text-white"
                  }`}
                  aria-label="Save roast"
                >
                  {favoriteLoading ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Bookmark
                      size={18}
                      className={saved ? "fill-[#ffb195] text-[#ffb195]" : ""}
                    />
                  )}
                  <span>
                    {favoriteLoading ? "Saving" : saved ? "Saved" : "Save"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={submitRoast}
                  disabled={loading || !target.trim()}
                  className="flex h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-orange-500/10 bg-[#201917] px-4 text-sm font-bold text-[#cab8ae] transition hover:border-orange-400/40 hover:bg-[#241d1a] hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45 sm:h-14"
                  aria-label="Retry roast"
                >
                  <RotateCcw size={18} />
                  <span>Retry</span>
                </button>
                <button
                  type="button"
                  onClick={shareRoast}
                  className="flex h-12 min-w-0 items-center justify-center gap-2 rounded-xl bg-[#ffb195] px-4 text-sm font-black text-[#32120d] transition hover:bg-[#ffc4b0] focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] sm:h-14"
                  aria-label="Share roast"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>

              {error && (
                <p className="rounded-2xl border border-[#6c3027] bg-[#2a1512] px-5 py-4 text-sm font-bold leading-6 text-[#ffb195]">
                  {error}
                </p>
              )}
            </div>
          </section>
        </section>

        <aside
          id="roast-settings"
          className="h-fit min-w-0 rounded-2xl border border-orange-500/10 bg-[#191514]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,.34)] sm:rounded-3xl sm:p-6 lg:p-8 xl:sticky xl:top-28 xl:p-6 2xl:p-8"
        >
          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[2px] text-[#8f7a72]">
                Control Room
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Customize
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#bba9a0]">
                Tune the tone before Roaster swings.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-[#ffb195]">
              <WandSparkles size={22} />
            </span>
          </div>

          <div className="mt-8 space-y-8">


            <div>
              <label className="text-xs font-black uppercase tracking-[2px] text-[#a99087]">
                Roast Style
              </label>
              <div className="mt-4 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-2">
                {roastStyles.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => setWeapon(style.value)}
                    className={` h-12 min-w-0 rounded-xl border px-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] ${
                      weapon === style.value
                        ? "border-[#ffb195] bg-[#4a2a22] text-white shadow-[0_0_24px_rgba(255,91,31,.18)]"
                        : "border-orange-500/10 bg-[#100f0e] text-[#c7b5ad] hover:border-orange-400/40 hover:bg-[#241d1a] hover:text-white"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-orange-500/10 pt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <label className="text-xs font-black uppercase tracking-[2px] text-[#a99087]">
                  Intensity
                </label>
                <span className="rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-black text-[#ffb195]">
                  {draftDamage.copy}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-[#ff6a1f]"
              />
              <div className="mt-4 flex items-center justify-between text-[#ffb195]">
                <Flame size={22} />
                <Skull size={22} />
              </div>
            </div>

            <div className="grid gap-6 border-t border-orange-500/10 pt-8 sm:grid-cols-2 xl:grid-cols-1">
              <div className="min-w-0">
                <label className="text-xs font-black uppercase tracking-[2px] text-[#a99087]">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="mt-4 h-14 w-full rounded-xl border border-orange-500/10 bg-[#100f0e] px-4 text-sm font-bold text-white outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
                >
                  {languages.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0">
                <label className="text-xs font-black uppercase tracking-[2px] text-[#a99087]">
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="mt-4 h-14 w-full rounded-xl border border-orange-500/10 bg-[#100f0e] px-4 text-sm font-bold text-white outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
                >
                  {topics.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={applySettings}
              disabled={loading || !hasSettingChanges}
              className={`flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 text-base font-black transition focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-70 ${
                loading
                  ? "border border-orange-400/30 bg-[#392018] text-[#ffb195]"
                  : hasSettingChanges
                    ? "bg-[#ffb195] text-[#32120d] hover:bg-[#ffc4b0]"
                    : "border border-orange-500/10 bg-[#100f0e] text-[#8f7a72]"
              }`}
            >
              {loading
                ? "Roasting..."
                : hasSettingChanges
                  ? "Apply Settings"
                  : "Settings Applied"}
              {loading ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                <Flame size={20} />
              )}
            </button>

          
          </div>
        </aside>
      </main>
    </div>
  );
}

export default RoastPage;
 

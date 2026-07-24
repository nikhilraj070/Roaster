import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Flame,
  LoaderCircle,
  Quote,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getFavoriteRoasts, updateRoastFavorite } from "../api/roastApi";

function FavoritesPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFavoriteRoasts();
      setFavorites(data.favorites || []);
    } catch (error) {
      if (error?.response?.status === 401) {
        setUser(null);
        navigate("/register", { replace: true });
        return;
      }

      setError(error?.response?.data?.message || "Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser]);

  const removeFavorite = async (roastId) => {
    try {
      setUpdatingId(roastId);
      await updateRoastFavorite(roastId, false);
      setFavorites((items) => items.filter((item) => item._id !== roastId));
      
    } catch (error) {
      if (error?.response?.status === 401) {
        setUser(null);
        navigate("/register", { replace: true });
        return;
      }

      setError(error?.response?.data?.message || "Failed to remove favorite.");
    } finally {
      setUpdatingId("");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#111010] text-white antialiased">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#111010_0%,#151211_42%,#241711_100%)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,99,31,.18),transparent_34%)]" />

      <header className="sticky top-0 z-20 border-b border-orange-500/10 bg-[#111010]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:min-h-20 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-[#1d1715] text-orange-400 shadow-[0_0_28px_rgba(255,91,31,.18)]">
              <Flame size={22} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-black italic tracking-wide text-[#ffb195] sm:text-2xl">
                ROASTER
              </p>
              <p className="hidden text-xs font-bold uppercase tracking-[2px] text-[#75645d] sm:block">
                Saved favorites
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-orange-400/20 bg-[#1b1715] px-3 text-sm font-bold text-[#ffb195] transition hover:border-orange-400/50 hover:bg-[#241d1a] focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98] sm:h-12 sm:px-4"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Generator</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-2xl border border-orange-500/10 bg-[#191514]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,.34)] sm:rounded-3xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div className="min-w-0">
              <div className="flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs font-black uppercase tracking-[2px] text-[#ffb195]">
                <Bookmark size={14} />
                Favorites
              </div>
              <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-5xl">
                Saved burns.
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-[#bba9a0] sm:text-base sm:leading-7">
                Your favorite generated roasts stay here so you can reuse,
                compare, or clean them up later.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/10 bg-[#100f0e] p-5">
              <p className="text-xs font-black uppercase tracking-[2px] text-[#8f7a72]">
                Total Saved
              </p>
              <p className="mt-3 text-4xl font-black text-[#ffb195]">
                {favorites.length}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <p className="mt-6 rounded-2xl border border-[#6c3027] bg-[#2a1512] px-5 py-4 text-sm font-bold leading-6 text-[#ffb195]">
            {error}
          </p>
        )}

        {loading ? (
          <div className="mt-8 flex min-h-80 items-center justify-center rounded-3xl border border-orange-500/10 bg-[#151312]">
            <LoaderCircle size={28} className="animate-spin text-[#ffb195]" />
          </div>
        ) : favorites.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-orange-500/10 bg-[#151312] p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,.42)] sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-[#ffb195]">
              <Bookmark size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-black text-white">
              No favorites yet.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[#bba9a0]">
              Generate a roast, hit Save, and it will appear here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#ffb195] px-6 text-sm font-black text-[#32120d] transition hover:bg-[#ffc4b0] focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[.98]"
            >
              Create Roast
            </button>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map((item) => (
              <article
                key={item._id}
                className="flex min-w-0 flex-col rounded-3xl border border-orange-500/10 bg-[#151312] p-5 shadow-[0_24px_80px_rgba(0,0,0,.28)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3 text-[#ffb195]">
                    <Quote size={22} />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black uppercase tracking-[2px]">
                        {item.weapon || "roast"}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#8f7a72]">
                        Level {item.intensity || 3}
                      </p>
                    </div>
                  </div>


                </div>

                <p className="mt-6 flex-1 whitespace-normal wrap-break-word text-lg font-black italic leading-7 text-[#f5efec]">
                  {item.roast}
                </p>

                <div className="mt-6 rounded-2xl border border-orange-500/10 bg-[#100f0e] p-4">
                  <p className="text-xs font-black uppercase tracking-[2px] text-[#8f7a72]">
                    Target
                  </p>
                  <p className="mt-2 line-clamp-2 wrap-break-word text-sm font-semibold leading-6 text-[#bba9a0]">
                    {item.input}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default FavoritesPage;

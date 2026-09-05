import React, { useState, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { Venue, VenueCategory } from "@/types/venue";
import { 
  Search, MapPin, Star, Flame, Users, Navigation, 
  Map as MapIcon, Filter, Check, Heart, Bookmark 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES: VenueCategory[] = [
  "Tümü",
  "Kebap & Ocakbaşı",
  "Kahve & Kafe",
  "Restoran & Dünya",
  "Bar & Gece Hayatı",
  "Tatlı & Fırın",
];

const DISTRICTS = ["Tümü", "Seyhan", "Çukurova", "Yüreğir"];

export const DiscoverView: React.FC = () => {
  const { 
    venues, 
    setSelectedVenue, 
    setCheckInVenue, 
    toggleFavorite, 
    isFavorite 
  } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory>("Tümü");
  const [selectedDistrict, setSelectedDistrict] = useState("Tümü");
  const [quickFilter, setQuickFilter] = useState<"all" | "trend" | "quiet" | "top" | "favs">("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      // Arama filtresi
      const matchSearch =
        venue.name.toLowerCase().includes(search.toLowerCase()) ||
        venue.address.toLowerCase().includes(search.toLowerCase()) ||
        venue.subcategory.toLowerCase().includes(search.toLowerCase()) ||
        (venue.popularItems && venue.popularItems.some(item => item.toLowerCase().includes(search.toLowerCase())));

      if (!matchSearch) return false;

      // Kategori filtresi
      if (selectedCategory !== "Tümü" && venue.category !== selectedCategory) {
        return false;
      }

      // İlçe filtresi
      if (selectedDistrict !== "Tümü" && venue.district !== selectedDistrict) {
        return false;
      }

      // Hızlı filtreler
      if (quickFilter === "trend" && venue.activityScore < 85) return false;
      if (quickFilter === "quiet" && venue.activityScore > 65) return false;
      if (quickFilter === "top" && venue.rating < 4.8) return false;
      if (quickFilter === "favs" && !isFavorite(venue.id)) return false;

      return true;
    });
  }, [venues, search, selectedCategory, selectedDistrict, quickFilter, isFavorite]);

  return (
    <div className="space-y-6">
      {/* Başlık ve Görünüm Değiştirici */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#79928a]">
            Adana Mekân Radarı
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#17362c]">
            Keşfet & Gez
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[#e6ede8] p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "list" ? "bg-white text-[#17362c] shadow-sm" : "text-[#70887e]"
              }`}
            >
              <Navigation size={13} /> Liste
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "map" ? "bg-white text-[#17362c] shadow-sm" : "text-[#70887e]"
              }`}
            >
              <MapIcon size={13} /> Harita
            </button>
          </div>
        </div>
      </div>

      {/* Arama Alanı */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa39a]" size={18} />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Mekân adı, lezzet (kebap, cheesecake) veya bölge ara..."
          className="h-13 rounded-2xl border-[#dbe6df] bg-white pl-11 pr-4 text-sm shadow-[0_6px_25px_rgba(23,54,44,0.04)] placeholder:text-[#a0b2aa] focus-visible:ring-[#17362c]"
        />
      </div>

      {/* Kategoriler Yatay Kaydırma */}
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                isActive
                  ? "bg-[#17362c] text-[#dfff62] shadow-sm"
                  : "bg-white text-[#567266] border border-[#dbe5df] hover:border-[#b7c9bf]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* İlçe ve Hızlı Filtre Butonları */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-y border-[#dfe8e1] py-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[#79928a] flex items-center gap-1">
            <MapPin size={13} /> İlçe:
          </span>
          {DISTRICTS.map((dist) => (
            <button
              key={dist}
              onClick={() => setSelectedDistrict(dist)}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                selectedDistrict === dist
                  ? "bg-[#dfff62] text-[#1c392f] font-extrabold"
                  : "text-[#627d72] hover:bg-white"
              }`}
            >
              {dist}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setQuickFilter(quickFilter === "trend" ? "all" : "trend")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold border transition ${
              quickFilter === "trend"
                ? "bg-[#ffebe0] text-[#e05b1c] border-[#fbcbb3]"
                : "bg-white text-[#70887e] border-[#dbe6df]"
            }`}
          >
            🔥 Çok Trend
          </button>
          <button
            onClick={() => setQuickFilter(quickFilter === "quiet" ? "all" : "quiet")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold border transition ${
              quickFilter === "quiet"
                ? "bg-[#e8f7ee] text-[#197a4a] border-[#bfe5cd]"
                : "bg-white text-[#70887e] border-[#dbe6df]"
            }`}
          >
            🍃 Sakin Yerler
          </button>
          <button
            onClick={() => setQuickFilter(quickFilter === "favs" ? "all" : "favs")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold border transition ${
              quickFilter === "favs"
                ? "bg-[#ffebee] text-[#dc2626] border-[#fca5a5]"
                : "bg-white text-[#70887e] border-[#dbe6df]"
            }`}
          >
            ❤️ Favorilerim
          </button>
        </div>
      </div>

      {/* Mekân Listesi / Harita */}
      {viewMode === "map" ? (
        <div className="relative overflow-hidden rounded-[28px] border border-[#dce8dd] bg-[#eef4ee] p-6 shadow-[0_10px_35px_rgba(23,54,44,0.05)] text-center min-h-[350px] flex flex-col items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#17362c] text-[#dfff62] mb-3">
            <MapIcon size={28} />
          </div>
          <h3 className="font-display text-xl font-bold text-[#17362c]">
            Adana Canlı Harita Görünümü
          </h3>
          <p className="text-xs text-[#637d72] max-w-sm mt-1 mb-4">
            Aşağıdaki filtrelenmiş {filteredVenues.length} mekân harita üzerinde aktif olarak işaretlendi.
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {filteredVenues.slice(0, 8).map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVenue(v)}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1c392f] shadow-sm hover:bg-[#dfff62] transition"
              >
                📍 {v.name} ({v.activityScore}%)
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredVenues.length === 0 ? (
            <div className="col-span-2 rounded-[28px] bg-white p-12 text-center text-sm text-[#738d81] border border-[#e2eae4]">
              <div className="text-3xl mb-2">🔍</div>
              <p className="font-bold text-[#203c30]">Aradığınız kriterlere uygun mekân bulunamadı.</p>
              <p className="text-xs text-[#899f94] mt-1">Filtreleri sıfırlayarak tekrar arayabilirsiniz.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Tümü");
                  setSelectedDistrict("Tümü");
                  setQuickFilter("all");
                }}
                className="mt-4 rounded-xl border-[#cfded4] text-xs font-bold"
              >
                Tüm Filtreleri Sıfırla
              </Button>
            </div>
          ) : (
            filteredVenues.map((venue, index) => {
              const favorite = isFavorite(venue.id);
              return (
                <article
                  key={venue.id}
                  className="group rounded-[26px] border border-[#e4ede6] bg-white p-4 shadow-[0_8px_25px_rgba(23,54,44,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(23,54,44,0.08)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div
                        onClick={() => setSelectedVenue(venue)}
                        className="cursor-pointer flex-1"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-full bg-[#f0f5f1] px-2.5 py-0.5 text-[10px] font-bold text-[#3d5d4f]">
                            {venue.category}
                          </span>
                          <span className="text-[11px] font-medium text-[#7e948a]">
                            {venue.district}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-extrabold tracking-tight text-[#1b3b2f] group-hover:text-[#4d6c12] transition">
                          {venue.name}
                        </h3>
                        <p className="text-xs text-[#7e948a] line-clamp-1 mt-0.5">
                          {venue.subcategory} · {venue.address}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleFavorite(venue.id)}
                        className={`size-8 rounded-full flex items-center justify-center transition ${
                          favorite ? "text-red-500 bg-red-50" : "text-[#b2c4ba] hover:text-[#7f998c]"
                        }`}
                        aria-label="Favori"
                      >
                        <Heart size={16} fill={favorite ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Popüler İtemler */}
                    {venue.popularItems && venue.popularItems.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {venue.popularItems.slice(0, 2).map((item, i) => (
                          <span
                            key={i}
                            className="rounded-lg bg-[#f8faf8] border border-[#e3ece5] px-2 py-0.5 text-[10px] font-semibold text-[#486356]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Alt Bilgi ve Check-in Butonu */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f1] pt-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-extrabold text-[#3a5649]">
                        <Star size={13} fill="#f59e0b" className="text-[#f59e0b]" /> {venue.rating}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-0.5 ${
                          venue.activityScore >= 85
                            ? "bg-[#fff1e7] text-[#e05b1c]"
                            : venue.activityScore >= 70
                            ? "bg-[#fff8df] text-[#b45309]"
                            : "bg-[#e9f8f0] text-[#16805c]"
                        }`}
                      >
                        <Flame size={10} fill="currentColor" /> {venue.activityScore}%
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedVenue(venue)}
                        className="h-8 rounded-full text-xs font-bold text-[#446254] hover:bg-[#f1f6f2]"
                      >
                        Detay
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setCheckInVenue(venue)}
                        className="h-8 rounded-full bg-[#17362c] px-3.5 text-xs font-extrabold text-[#dfff62] hover:bg-[#264b3d] shadow-sm"
                      >
                        <Check size={13} className="mr-1" /> Check-in
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

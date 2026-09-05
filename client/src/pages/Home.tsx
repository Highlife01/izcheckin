import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { DiscoverView } from "@/pages/DiscoverView";
import { NotificationsView } from "@/pages/NotificationsView";
import { ProfileView } from "@/pages/ProfileView";
import { VenueDetailModal } from "@/components/VenueDetailModal";
import { CheckInModal } from "@/components/CheckInModal";
import { BadgeUnlockedModal } from "@/components/BadgeUnlockedModal";
import { Venue } from "@/types/venue";
import { 
  Compass, Search, Bell, Users, MapPin, LocateFixed, 
  Sparkles, Star, Flame, Check, Plus, Heart, ChevronRight, TrendingUp, Bookmark 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home({ initialTab = "home" }: { initialTab?: string }) {
  const { 
    venues, 
    user, 
    notifications, 
    setSelectedVenue, 
    setCheckInVenue, 
    toggleFavorite, 
    isFavorite,
    activeTab,
    setActiveTab 
  } = useApp();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");

  // Sync initialTab if given
  React.useEffect(() => {
    if (initialTab && ["home", "discover", "notifications", "profile"].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab, setActiveTab]);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const categories = [
    { label: "Tümü", icon: "✨" },
    { label: "Kebap & Ocakbaşı", icon: "🥩" },
    { label: "Kahve & Kafe", icon: "☕" },
    { label: "Restoran & Dünya", icon: "🍽️" },
    { label: "Bar & Gece Hayatı", icon: "🍸" },
    { label: "Tatlı & Fırın", icon: "🍰" },
  ];

  const filteredVenues = venues.filter((v) => {
    const matchCat = category === "Tümü" || v.category === category;
    const matchSearch = !search || 
      v.name.toLowerCase().includes(search.toLowerCase()) || 
      v.district.toLowerCase().includes(search.toLowerCase()) ||
      v.subcategory.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const trendingVenues = [...venues].sort((a, b) => b.activityScore - a.activityScore).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-[#18342b] pb-28">
      {/* Üst Bar / Header */}
      <header className="sticky top-0 z-30 border-b border-[#dfe8e2]/80 bg-[#f7f8f6]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2.5 transition active:scale-95"
            >
              <span className="flex size-10 items-center justify-center rounded-[14px] bg-[#17362c] text-[#dfff62] shadow-[0_4px_14px_rgba(23,54,44,0.15)]">
                <MapPin size={20} fill="currentColor" />
              </span>
              <span className="font-display text-[22px] font-extrabold tracking-[-0.04em]">
                mekân<span className="text-[#9aaa00]">.</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="hidden items-center gap-2 rounded-full border border-[#d9e3db] bg-white px-3.5 py-2 text-xs font-bold text-[#527066] md:flex shadow-sm hover:border-[#b8cdbe] transition"
              onClick={() => toast.success("Mevcut konumun: Seyhan, Adana (GPS Doğrulandı)")}
            >
              <LocateFixed size={14} className="text-[#7fa32c]" /> Seyhan, Adana{" "}
              <ChevronRight size={13} />
            </button>

            {/* Puan Rozeti */}
            <div 
              onClick={() => setActiveTab("profile")}
              className="cursor-pointer flex items-center gap-1.5 rounded-full bg-[#eef8dd] px-3 py-1.5 border border-[#d9ecad] text-xs font-extrabold text-[#3a591e] shadow-sm hover:scale-105 transition"
            >
              <Sparkles size={14} className="text-[#84a323]" />
              <span>{user.currentPoints} Puan</span>
            </div>

            {/* Kullanıcı Avatarı */}
            <button
              onClick={() => setActiveTab("profile")}
              className="flex size-10 items-center justify-center rounded-full bg-[#17362c] text-xs font-extrabold text-[#dfff62] shadow-sm ring-2 ring-white hover:opacity-90 transition"
              aria-label="Profil"
            >
              {user.avatarText}
            </button>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="mx-auto max-w-6xl px-5 pt-8 lg:px-8 lg:pt-10">
        {activeTab === "home" && (
          <div className="space-y-12">
            {/* Karşılama ve Hero Bölümü */}
            <section className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wide text-[#738e83]">
                  <span className="size-2.5 rounded-full bg-[#9ebb2a] animate-pulse" />{" "}
                  Adana’da canlı şehir ritmi
                </div>
                <h1 className="max-w-xl font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#18342b] sm:text-[56px]">
                  Şu an<br />
                  <span className="text-[#8e9e10]">neresi hareketli?</span>
                </h1>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#657d72]">
                  Adana'nın en sevilen lezzet ve kahve duraklarını keşfet, anlık yoğunluğu gör ve iz bırak.
                </p>

                {/* Arama Barı */}
                <div className="relative mt-6 max-w-xl">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa39a]"
                    size={19}
                  />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Mekân, kebapçı, 3. nesil kafe veya semt ara..."
                    className="h-14 rounded-2xl border-[#dbe5de] bg-white pl-12 pr-4 text-[14px] shadow-[0_9px_30px_rgba(37,70,54,0.05)] placeholder:text-[#a2b2aa] focus-visible:border-[#9ead3b] focus-visible:ring-[#dfff62]"
                  />
                </div>
              </div>

              {/* Günün Sinyali Kartı */}
              <div className="relative hidden min-h-[220px] overflow-hidden rounded-[30px] bg-[#183d32] p-7 text-white shadow-[0_20px_60px_rgba(23,54,44,0.18)] lg:block">
                <div className="absolute -right-10 -top-16 size-52 rounded-full border-[28px] border-[#2a5645] opacity-60 pointer-events-none" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#dfff62]">
                      <Sparkles size={15} /> Günün Sinyali
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#c4d7cb]">
                      Bugün · Adana
                    </span>
                  </div>
                  <div className="my-2">
                    <p className="font-display text-2xl font-bold leading-tight">
                      Ziyapaşa & Kazancılar'da<br />hafta sonu trafiği yükseliyor.
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#183d32] bg-[#fac9b4] text-[10px] font-bold text-[#623c2a]">
                          CK
                        </span>
                        <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#183d32] bg-[#e5d8ff] text-[10px] font-bold text-[#56387d]">
                          ED
                        </span>
                        <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#183d32] bg-[#cbe9a6] text-[10px] font-bold text-[#3d591b]">
                          MA
                        </span>
                      </div>
                      <span className="text-xs text-[#c4d7cb]">
                        Şu an 58 kişi çevrede check-in yaptı
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Kategoriler */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#93a69c]">
                    Keşfetmeye başla
                  </p>
                  <h2 className="mt-1 font-display text-[24px] font-extrabold tracking-[-0.04em]">
                    Kategoriler
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab("discover")}
                  className="text-xs font-bold text-[#7f941e] hover:underline"
                >
                  Tümünü Gör ({venues.length})
                </button>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                {categories.map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => setCategory(label)}
                    className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold transition ${
                      category === label
                        ? "border-[#d9ed65] bg-[#dfff62] text-[#243e21] shadow-sm"
                        : "border-[#dfe8e1] bg-white text-[#637d72] hover:border-[#b9cbbb]"
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Popüler Mekanlar Listesi */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#93a69c]">
                    En Çok Konuşulanlar
                  </p>
                  <h2 className="mt-1 font-display text-[24px] font-extrabold tracking-[-0.04em]">
                    Şu Anda Trend Mekânlar
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {filteredVenues.slice(0, 6).map((venue, index) => {
                  const favorite = isFavorite(venue.id);
                  return (
                    <article
                      key={venue.id}
                      className="group rounded-[26px] border border-[#e4ece6] bg-white p-5 shadow-[0_8px_30px_rgba(34,64,48,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(34,64,48,0.09)] flex flex-col justify-between"
                    >
                      <div className="flex gap-4">
                        <div
                          onClick={() => setSelectedVenue(venue)}
                          className={`cursor-pointer relative flex h-[105px] w-[105px] shrink-0 items-end overflow-hidden rounded-[20px] p-2.5 ${
                            ["bg-[#d8eee0]", "bg-[#f8dfc9]", "bg-[#e8ddfa]", "bg-[#d8e9f6]"][
                              index % 4
                            ]
                          }`}
                        >
                          <div
                            className="absolute inset-0 opacity-40"
                            style={{
                              background:
                                "radial-gradient(circle at 30% 20%, rgba(255,255,255,.9), transparent 40%), linear-gradient(145deg, transparent 30%, rgba(41,76,56,.18))",
                            }}
                          />
                          <span className="relative rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-extrabold text-[#355b46] backdrop-blur">
                            {venue.category}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div 
                              onClick={() => setSelectedVenue(venue)}
                              className="cursor-pointer"
                            >
                              <h3 className="truncate font-display text-[17px] font-extrabold tracking-[-0.035em] text-[#234238] group-hover:text-[#527015] transition">
                                {venue.name}
                              </h3>
                              <p className="mt-1 truncate text-xs text-[#899b92]">
                                {venue.district} · {venue.address}
                              </p>
                            </div>

                            <button
                              onClick={() => toggleFavorite(venue.id)}
                              aria-label="Favori"
                              className={`p-1 transition ${
                                favorite ? "text-red-500" : "text-[#b7c6bd] hover:text-[#8c9f22]"
                              }`}
                            >
                              <Heart size={17} fill={favorite ? "currentColor" : "none"} />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 font-extrabold text-[#4c655b]">
                              <Star size={13} fill="#edb94c" className="text-[#edb94c]" />{" "}
                              {venue.rating}
                            </span>
                            <span className="text-[#a1b0a8]">{index * 350 + 200} m</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                venue.activityScore >= 85
                                  ? "text-[#e05b1c] bg-[#fff1e7]"
                                  : "text-[#16805c] bg-[#e9f8f0]"
                              }`}
                            >
                              <Flame size={10} className="mr-0.5 inline" /> {venue.activityScore}% Canlı
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#edf1ed] pt-3">
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7b9187]">
                          <Users size={13} className="text-[#8aa224]" /> {venue.checkinCount} toplam check-in
                        </span>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedVenue(venue)}
                            className="h-8 rounded-full text-xs font-bold text-[#3b594b] hover:bg-[#edf5f0]"
                          >
                            İncele
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setCheckInVenue(venue)}
                            className="h-8 rounded-full bg-[#17362c] px-3.5 text-[11px] font-extrabold text-[#dfff62] hover:bg-[#294d3f] shadow-sm"
                          >
                            <Check size={13} className="mr-1" /> Check-in
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Sosyal Nabız & Bu Hafta En Çok Yükselen */}
            <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_35px_rgba(34,64,48,0.04)] border border-[#e4ede6]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a0b0a8]">
                      Sosyal Nabız
                    </p>
                    <h2 className="mt-1 font-display text-xl font-extrabold tracking-[-0.04em]">
                      Adana'da Şu Anda Neredeler?
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className="text-xs font-bold text-[#8a9b20] hover:underline"
                  >
                    Tüm Akış
                  </button>
                </div>

                <div className="mt-5 space-y-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full text-xs font-bold bg-[#ffd8c8] text-[#714432]">
                      CK
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[#4c655b]">
                        <strong className="font-bold text-[#29493b]">Cebrail Kara</strong> Kebapçı Mesut'ta check-in yaptı 🥩
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#a0b0a8]">25 dk önce · Seyhan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full text-xs font-bold bg-[#d9cdfc] text-[#4d3a77]">
                      ED
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[#4c655b]">
                        <strong className="font-bold text-[#29493b]">Elif Demir</strong> Ziyapaşa Kahve'de fotoğraf paylaştı ☕
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#a0b0a8]">42 dk önce · Ziyapaşa</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-[#eaf7d5] p-6 border border-[#d6ecb5] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#dfff62] text-[#546404]">
                      <TrendingUp size={20} />
                    </div>
                    <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#65761a]">
                      Haftanın Yıldızı
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-[#778844]">
                    En Çok Yükselen Mekân
                  </p>
                  <h3 className="mt-1 font-display text-[22px] font-extrabold tracking-tight text-[#223b1f]">
                    Arka Sokak Gastro Pub
                  </h3>
                  <p className="text-xs text-[#526a45] mt-1">
                    Bu hafta sonu gece check-in trafiği %45 arttı!
                  </p>
                </div>

                <Button
                  onClick={() => {
                    const arkaSokak = venues.find((v) => v.slug === "arka-sokak-pub");
                    if (arkaSokak) setSelectedVenue(arkaSokak);
                  }}
                  className="mt-5 rounded-2xl bg-[#17362c] text-xs font-extrabold text-[#dfff62] hover:bg-[#254b3d]"
                >
                  Mekânı İncele
                </Button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "discover" && <DiscoverView />}
        {activeTab === "notifications" && <NotificationsView />}
        {activeTab === "profile" && <ProfileView />}
      </main>

      {/* Sabit Alt Navigasyon Çubuğu */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#dfe8e2] bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl shadow-[0_-5px_25px_rgba(23,54,44,0.05)]">
        <div className="mx-auto flex max-w-md items-end justify-between">
          <div className="flex flex-1 justify-around">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex min-w-[56px] flex-col items-center gap-1 text-[10px] font-bold transition ${
                activeTab === "home" ? "text-[#3f570e]" : "text-[#8d9e96] hover:text-[#536d62]"
              }`}
            >
              <Compass size={20} strokeWidth={activeTab === "home" ? 2.6 : 1.8} />
              <span>Ana sayfa</span>
            </button>

            <button
              onClick={() => setActiveTab("discover")}
              className={`flex min-w-[56px] flex-col items-center gap-1 text-[10px] font-bold transition ${
                activeTab === "discover" ? "text-[#3f570e]" : "text-[#8d9e96] hover:text-[#536d62]"
              }`}
            >
              <Search size={20} strokeWidth={activeTab === "discover" ? 2.6 : 1.8} />
              <span>Keşfet</span>
            </button>
          </div>

          {/* Orta Büyük Check-in Butonu */}
          <button
            onClick={() => {
              if (venues.length > 0) {
                setCheckInVenue(venues[0]);
              }
            }}
            className="-mt-9 flex flex-col items-center gap-1.5 group"
          >
            <span className="flex size-[60px] items-center justify-center rounded-[22px] border-[5px] border-[#f7f8f6] bg-[#dfff62] text-[#1c3624] shadow-[0_8px_20px_rgba(153,190,35,0.3)] transition group-hover:-translate-y-1 group-active:scale-95">
              <Plus size={28} strokeWidth={2.8} />
            </span>
            <span className="text-[10px] font-extrabold text-[#526b61]">Check-in</span>
          </button>

          <div className="flex flex-1 justify-around">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`relative flex min-w-[56px] flex-col items-center gap-1 text-[10px] font-bold transition ${
                activeTab === "notifications" ? "text-[#3f570e]" : "text-[#8d9e96] hover:text-[#536d62]"
              }`}
            >
              <Bell size={20} strokeWidth={activeTab === "notifications" ? 2.6 : 1.8} />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 right-3.5 flex size-4 items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-extrabold text-white">
                  {unreadNotifsCount}
                </span>
              )}
              <span>Bildirim</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex min-w-[56px] flex-col items-center gap-1 text-[10px] font-bold transition ${
                activeTab === "profile" ? "text-[#3f570e]" : "text-[#8d9e96] hover:text-[#536d62]"
              }`}
            >
              <Users size={20} strokeWidth={activeTab === "profile" ? 2.6 : 1.8} />
              <span>Profil</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Global Modallar */}
      <VenueDetailModal />
      <CheckInModal />
      <BadgeUnlockedModal />
    </div>
  );
}

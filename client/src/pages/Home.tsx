import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { DiscoverView } from "@/pages/DiscoverView";
import { NotificationsView } from "@/pages/NotificationsView";
import { ProfileView } from "@/pages/ProfileView";
import { VenueDetailModal } from "@/components/VenueDetailModal";
import { CheckInModal } from "@/components/CheckInModal";
import { BadgeUnlockedModal } from "@/components/BadgeUnlockedModal";
import { CitySelectModal } from "@/components/CitySelectModal";
import { POPULAR_CITIES } from "@/data/venuesData";
import { 
  Compass, Search, Bell, Users, MapPin, LocateFixed, 
  Sparkles, Star, Flame, Check, Plus, Heart, ChevronRight, TrendingUp, ChevronDown 
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
    setActiveTab,
    selectedCity,
    setSelectedCity,
    setIsCityModalOpen 
  } = useApp();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");

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

  const cityVenues = selectedCity === "Tüm Türkiye"
    ? venues
    : venues.filter((v) => v.city === selectedCity);

  const filteredVenues = cityVenues.filter((v) => {
    const matchCat = category === "Tümü" || v.category === category;
    const matchSearch = !search || 
      v.name.toLowerCase().includes(search.toLowerCase()) || 
      v.district.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase()) ||
      v.subcategory.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getHeroSignal = () => {
    switch (selectedCity) {
      case "İstanbul":
        return {
          title: "Kadıköy & Beşiktaş'ta\nkahve ve sokak trafiği yükseliyor.",
          count: "124 kişi son saatte çevrede",
        };
      case "Ankara":
        return {
          title: "Tunalı & Esat hattında\nakşam saatleri çok hareketli.",
          count: "86 kişi son saatte çevrede",
        };
      case "İzmir":
        return {
          title: "Alsancak Kordon & Bostanlı'da\ngün batımı buluşmaları başladı.",
          count: "94 kişi son saatte çevrede",
        };
      case "Gaziantep":
        return {
          title: "Tarihi Çarşı & Şahinbey'de\nlezzet durakları dolup taşıyor.",
          count: "68 kişi son saatte çevrede",
        };
      case "Adana":
        return {
          title: "Ziyapaşa & Kazancılar'da\nakşam ziyafeti ve kahve nabzı yüksek.",
          count: "58 kişi son saatte çevrede",
        };
      default:
        return {
          title: "Türkiye genelinde\ncanlı sosyalleşme noktaları parlıyor.",
          count: "340+ kişi şu an keşifte",
        };
    }
  };

  const heroSignal = getHeroSignal();

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

          <div className="flex items-center gap-2.5">
            {/* Şehir Seçici Buton */}
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#d9e3db] bg-white px-3.5 py-2 text-xs font-bold text-[#3d5e50] shadow-sm hover:border-[#b8cdbe] transition active:scale-95"
            >
              <LocateFixed size={14} className="text-[#7fa32c]" />
              <span>{selectedCity}</span>
              <ChevronDown size={13} className="text-[#8ba096]" />
            </button>

            {/* Puan Rozeti */}
            <div 
              onClick={() => setActiveTab("profile")}
              className="cursor-pointer hidden sm:flex items-center gap-1.5 rounded-full bg-[#eef8dd] px-3 py-1.5 border border-[#d9ecad] text-xs font-extrabold text-[#3a591e] shadow-sm hover:scale-105 transition"
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
                  {selectedCity === "Tüm Türkiye" ? "Türkiye Canlı Şehir Radarı" : `${selectedCity} Canlı Şehir Radarı`}
                </div>
                <h1 className="max-w-xl font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#18342b] sm:text-[56px]">
                  Şu an<br />
                  <span className="text-[#8e9e10]">neresi hareketli?</span>
                </h1>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#657d72]">
                  {selectedCity === "Tüm Türkiye"
                    ? "Türkiye genelinde en sevilen kafe, lezzet ve buluşma duraklarını keşfet, anlık yoğunluğu takip et."
                    : `${selectedCity} şehrindeki en popüler mekânları keşfet, canlı doluluk oranlarını gör ve iz bırak.`}
                </p>

                {/* Hızlı Şehir Seçim Hapları */}
                <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                  <button
                    onClick={() => setIsCityModalOpen(true)}
                    className="shrink-0 flex items-center gap-1 rounded-full bg-[#17362c] text-[#dfff62] px-3.5 py-1 text-xs font-extrabold shadow-sm hover:bg-[#274f40] transition"
                  >
                    <span>🇹🇷 81 İl ({selectedCity})</span>
                    <ChevronDown size={12} />
                  </button>
                  {POPULAR_CITIES.slice(0, 7).map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition ${
                        selectedCity === city
                          ? "bg-[#dfff62] text-[#1c3829] font-extrabold shadow-sm"
                          : "bg-white text-[#567266] border border-[#dbe5df] hover:border-[#b7c9bf]"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsCityModalOpen(true)}
                    className="shrink-0 rounded-full bg-[#eef4ef] px-3 py-1 text-xs font-bold text-[#4e6b5e] hover:bg-[#e2ece5]"
                  >
                    Tüm 81 İl...
                  </button>
                </div>

                {/* Arama Barı */}
                <div className="relative mt-5 max-w-xl">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa39a]"
                    size={19}
                  />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Mekân adı, şehir (İstanbul, Ankara, İzmir), tatlı veya kahve ara..."
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
                      {selectedCity}
                    </span>
                  </div>
                  <div className="my-2">
                    <p className="font-display text-2xl font-bold leading-tight whitespace-pre-line">
                      {heroSignal.title}
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
                        {heroSignal.count}
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
                  Tümünü Gör ({cityVenues.length})
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
                    {selectedCity === "Tüm Türkiye" ? "Türkiye’de Trend Mekânlar" : `${selectedCity} Trend Mekânları`}
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {filteredVenues.length === 0 ? (
                  <div className="col-span-2 rounded-[28px] bg-white p-8 text-center text-xs text-[#789286] border border-[#e3ece5]">
                    Bu filtreye uygun mekân bulunamadı. Şehri veya kategoriyi değiştirebilirsin.
                  </div>
                ) : (
                  filteredVenues.slice(0, 6).map((venue, index) => {
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
                              {venue.city}
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
                                  {venue.district}, {venue.city} · {venue.subcategory}
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
                              <span className="text-[#a1b0a8]">{venue.priceRange}</span>
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
                  })
                )}
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
              if (cityVenues.length > 0) {
                setCheckInVenue(cityVenues[0]);
              } else if (venues.length > 0) {
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
      <CitySelectModal />
    </div>
  );
}

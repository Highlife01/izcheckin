import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Bell, Bookmark, Check, ChevronRight, Compass, Coffee, Flame, Heart, LocateFixed, Map as MapIcon, MapPin, Menu, Navigation, Plus, Search, Sparkles, Star, TrendingUp, Users, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { MapView as ProxyMapView } from "@/components/Map";

const categories = [
  { label: "Tümü", icon: Compass }, { label: "Restoran", icon: Utensils }, { label: "Kahve", icon: Coffee },
  { label: "Bar", icon: MusicIcon }, { label: "Alışveriş", icon: ShoppingIcon },
];
const fallbackVenues = [
  { id: 1, slug: "ziyapasa-kahve-adana", name: "Ziyapaşa Kahve", category: "Kahve", address: "Ziyapaşa Blv. 32, Seyhan", district: "Seyhan", city: "Adana", latitude: 37.0004, longitude: 35.3213, rating: 4.8, ratingCount: 824, checkinCount: 2140, activityScore: 86, coverImageUrl: null },
  { id: 2, slug: "kebapci-musa-adana", name: "Kebapçı Musa", category: "Restoran", address: "Tepebağ Mah. 14, Seyhan", district: "Seyhan", city: "Adana", latitude: 37.0018, longitude: 35.3275, rating: 4.6, ratingCount: 516, checkinCount: 1320, activityScore: 72, coverImageUrl: null },
  { id: 3, slug: "arka-sokak-bar", name: "Arka Sokak", category: "Bar", address: "Kurtuluş Cad. 9, Seyhan", district: "Seyhan", city: "Adana", latitude: 37.0051, longitude: 35.3181, rating: 4.7, ratingCount: 301, checkinCount: 980, activityScore: 94, coverImageUrl: null },
  { id: 4, slug: "merkez-coffee-roasters", name: "Merkez Coffee Roasters", category: "Kahve", address: "Gazipaşa Bulvarı 80, Çukurova", district: "Çukurova", city: "Adana", latitude: 37.0268, longitude: 35.2924, rating: 4.9, ratingCount: 412, checkinCount: 875, activityScore: 58, coverImageUrl: null },
];
type Venue = typeof fallbackVenues[number];

function activityLabel(score: number) { return score >= 90 ? "Trend" : score >= 75 ? "Çok hareketli" : score >= 55 ? "Hareketli" : "Sakin"; }
function activityTone(score: number) { return score >= 90 ? "text-[#f97316] bg-[#fff1e7]" : score >= 75 ? "text-[#e11d48] bg-[#fff0f3]" : score >= 55 ? "text-[#b45309] bg-[#fff8df]" : "text-[#16805c] bg-[#e9f8f0]"; }

export default function Home({ initialTab = "home" }: { initialTab?: string }) {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [view, setView] = useState<"list" | "map">("list");
  const [checkingInId, setCheckingInId] = useState<number | null>(null);
  const venuesQuery = trpc.venue.list.useQuery({ query: search || undefined, category });
  const checkinMutation = trpc.checkin.create.useMutation({
    onSuccess: ({ venueName }) => { toast.success(`${venueName} için check-in tamamlandı`, { description: "Arkadaşların artık nerede olduğunu görebilir." }); setCheckingInId(null); venuesQuery.refetch(); },
    onError: error => { setCheckingInId(null); toast.error("Check-in tamamlanamadı", { description: error.message }); },
  });
  const venues = (venuesQuery.data as Venue[] | undefined) ?? fallbackVenues;
  const firstName = user?.name?.split(" ")[0] ?? "Adana";

  const handleCheckIn = (venue: Venue) => {
    if (!isAuthenticated) { toast.info("Check-in yapmak için giriş yapmalısın"); startLogin(); return; }
    setCheckingInId(venue.id);
    const submit = (latitude: number, longitude: number, accuracy?: number) => checkinMutation.mutate({ venueId: venue.id, latitude, longitude, accuracy, visibility: "public", mood: "Takılıyorum" });
    if (!navigator.geolocation) { setCheckingInId(null); toast.error("Bu cihaz konum desteği sunmuyor"); return; }
    navigator.geolocation.getCurrentPosition(
      position => submit(position.coords.latitude, position.coords.longitude, position.coords.accuracy),
      error => { setCheckingInId(null); toast.error("Konum doğrulanamadı", { description: error.code === error.PERMISSION_DENIED ? "Check-in için konum izni vermelisin." : "Konum sinyali alınamadı, tekrar dene." }); },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 15_000 },
    );
  };
  const goToNav = (path: string) => { if (path === "/profil" && !isAuthenticated) { toast.info("Profilini görmek için giriş yapmalısın"); startLogin(); return; } if (path === "/bildirimler") toast.info("Bildirim merkezi yakında", { description: "Arkadaş check-in'leri ve rozetlerin burada görünecek." }); setLocation(path); };
  const navItems = [{ label: "Ana sayfa", icon: Compass, path: "/" }, { label: "Keşfet", icon: Search, path: "/kesfet" }, { label: "Bildirimler", icon: Bell, path: "/bildirimler" }, { label: "Profil", icon: Users, path: "/profil" }];

  return <div className="min-h-screen bg-[#f7f8f6] text-[#18342b] pb-28">
    <header className="sticky top-0 z-30 border-b border-[#dfe8e2]/80 bg-[#f7f8f6]/95 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8"><div className="flex items-center gap-3"><button className="flex size-10 items-center justify-center rounded-full bg-[#deff55] text-[#17362c] lg:hidden" aria-label="Menüyü aç"><Menu size={19} /></button><Link href="/" className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-[13px] bg-[#17362c] text-[#deff55]"><MapPin size={19} fill="currentColor" /></span><span className="font-display text-[21px] font-extrabold tracking-[-0.04em]">mekân<span className="text-[#9aaa00]">.</span></span></Link></div><div className="flex items-center gap-3"><button className="hidden items-center gap-2 rounded-full border border-[#d9e3db] bg-white px-3.5 py-2 text-xs font-semibold text-[#527066] md:flex" onClick={() => toast.success("Konum: Seyhan, Adana")}><LocateFixed size={14} className="text-[#6c8d31]" /> Seyhan, Adana <ChevronRight size={13} /></button>{authLoading ? <span className="size-9 animate-pulse rounded-full bg-[#dfe8e2]" /> : user ? <div className="flex size-9 items-center justify-center rounded-full bg-[#e5d8ff] text-sm font-bold text-[#604a93]">{firstName.slice(0, 1).toUpperCase()}</div> : <Button onClick={startLogin} variant="outline" size="sm" className="rounded-full border-[#cbdace] bg-transparent text-xs font-bold text-[#355448] hover:bg-white">Giriş yap</Button>}</div></div></header>
    <main className="mx-auto max-w-6xl px-5 pt-8 lg:px-8 lg:pt-12">
      <section className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"><div><div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#79928a]"><span className="size-2 rounded-full bg-[#a7c92c]" /> Adana’da canlı keşif</div><h1 className="max-w-xl font-display text-[42px] font-extrabold leading-[0.98] tracking-[-0.065em] text-[#18342b] sm:text-[58px]">Şu an<br /><span className="text-[#93a000]">neresi hareketli?</span></h1><p className="mt-5 max-w-md text-[15px] leading-7 text-[#6c8179]">Yakınındaki mekânları keşfet, arkadaşlarının izini sür ve iyi hissettiren yerlere birlikte uğra.</p><div className="relative mt-7 max-w-xl"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8ca098]" size={19} /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Mekân, kategori veya bölge ara..." className="h-14 rounded-2xl border-[#dbe5de] bg-white pl-12 pr-4 text-[14px] shadow-[0_9px_30px_rgba(37,70,54,0.05)] placeholder:text-[#a2b2aa] focus-visible:border-[#9ead3b] focus-visible:ring-[#dfff62]" /></div></div><div className="relative hidden min-h-[210px] overflow-hidden rounded-[28px] bg-[#183d32] p-7 text-white shadow-[0_20px_60px_rgba(23,54,44,0.18)] lg:block"><div className="absolute -right-10 -top-16 size-52 rounded-full border-[28px] border-[#2a5645] opacity-60" /><div className="relative z-10 flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#dfff62]"><Sparkles size={15} /> Günün sinyali</span><span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#c4d7cb]">05 Eyl · Cumartesi</span></div><div><p className="font-display text-2xl font-bold leading-tight">Ziyapaşa’da<br />kahve trafiği yükseliyor.</p><div className="mt-4 flex items-center gap-3"><div className="flex -space-x-2"><span className="size-7 rounded-full border-2 border-[#183d32] bg-[#fac9b4]" /><span className="size-7 rounded-full border-2 border-[#183d32] bg-[#e5d8ff]" /><span className="size-7 rounded-full border-2 border-[#183d32] bg-[#cbe9a6]" /></div><span className="text-xs text-[#c4d7cb]">42 kişi son saatte burada</span></div></div></div></div></section>
      <section className="mt-12 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#98a9a0]">Bugün çevrende</p><h2 className="mt-2 font-display text-[25px] font-extrabold tracking-[-0.045em]">Yakınında neler oluyor?</h2></div><div className="flex rounded-xl bg-[#eaf0eb] p-1"><button onClick={() => setView("list")} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${view === "list" ? "bg-white text-[#315448] shadow-sm" : "text-[#8aa097]"}`}><Navigation size={14} /> Liste</button><button onClick={() => setView("map")} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${view === "map" ? "bg-white text-[#315448] shadow-sm" : "text-[#8aa097]"}`}><MapIcon size={14} /> Harita</button></div></section>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">{categories.map(({ label, icon: Icon }) => <button key={label} onClick={() => setCategory(label)} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition ${category === label ? "border-[#d9ed65] bg-[#dfff62] text-[#294226]" : "border-[#dfe8e1] bg-white text-[#6f877d] hover:border-[#b9cbbb]"}`}><Icon size={14} /> {label}</button>)}</div>
      {view === "map" ? <MapView venues={venues.slice(0, 3)} onCheckIn={handleCheckIn} /> : <section className="mt-5 grid gap-3 lg:grid-cols-2">{venuesQuery.isLoading ? <div className="col-span-2 rounded-3xl bg-white p-8 text-center text-sm text-[#81968b]">Yakınındaki mekânlar yükleniyor...</div> : venues.map((venue, index) => <VenueCard key={venue.id} venue={venue} index={index} onCheckIn={handleCheckIn} checkingIn={checkingInId === venue.id} />)}</section>}
      <section className="mt-12 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]"><div className="rounded-[26px] bg-white p-6 shadow-[0_10px_35px_rgba(34,64,48,0.05)]"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a0b0a8]">Sosyal nabız</p><h2 className="mt-1 font-display text-xl font-extrabold tracking-[-0.04em]">Arkadaşların nerede?</h2></div><button onClick={() => toast.info("Arkadaş keşfi yakında")} className="text-xs font-bold text-[#8a9b20]">Tümünü gör</button></div><div className="mt-5 space-y-4"><ActivityRow initials="CE" color="bg-[#ffd8c8]" name="Cebrail" action="Ziyapaşa Kahve’de check-in yaptı" time="12 dk önce" emoji="☕" /><ActivityRow initials="EA" color="bg-[#d9cdfc]" name="Elif" action="Merkez Coffee’de fotoğraf paylaştı" time="28 dk önce" emoji="📸" /></div></div><div className="rounded-[26px] bg-[#e9f8d8] p-6"><div className="flex items-center justify-between"><div className="flex size-10 items-center justify-center rounded-2xl bg-[#dfff62] text-[#5f7100]"><TrendingUp size={19} /></div><span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#6e801a]">Bu hafta</span></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#7d8d47]">En çok yükselen</p><h3 className="mt-1 font-display text-[23px] font-extrabold tracking-[-0.04em] text-[#294226]">Arka Sokak</h3><div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#637738]"><Flame size={15} fill="currentColor" /> %38 daha hareketli <ChevronRight size={14} /></div></div></section>
    </main>
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#dfe8e2] bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl"><div className="mx-auto flex max-w-md items-end justify-between"><div className="flex flex-1 justify-around">{navItems.slice(0, 2).map(item => <NavItem key={item.path} {...item} active={item.path === "/" ? initialTab === "home" : initialTab === "discover"} onClick={() => goToNav(item.path)} />)}</div><button onClick={() => document.querySelector("main")?.scrollIntoView({ behavior: "smooth" })} className="-mt-9 flex flex-col items-center gap-1.5"><span className="flex size-[58px] items-center justify-center rounded-[21px] border-[5px] border-[#f7f8f6] bg-[#dfff62] text-[#26422f] shadow-[0_7px_18px_rgba(153,190,35,0.28)] transition hover:-translate-y-1 active:scale-95"><Plus size={25} strokeWidth={2.5} /></span><span className="text-[10px] font-bold text-[#617970]">Check-in</span></button><div className="flex flex-1 justify-around">{navItems.slice(2).map(item => <NavItem key={item.path} {...item} active={item.path === "/bildirimler" ? initialTab === "notifications" : initialTab === "profile"} onClick={() => goToNav(item.path)} />)}</div></div></nav>
  </div>;
}
function VenueCard({ venue, index, onCheckIn, checkingIn }: { venue: Venue; index: number; onCheckIn: (venue: Venue) => void; checkingIn: boolean }) { return <article className="group rounded-[25px] border border-[#e4ece6] bg-white p-4 shadow-[0_8px_30px_rgba(34,64,48,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(34,64,48,0.09)]"><div className="flex gap-4"><div className={`relative flex h-[110px] w-[110px] shrink-0 items-end overflow-hidden rounded-[18px] p-2.5 ${["bg-[#d8eee0]", "bg-[#f8dfc9]", "bg-[#e8ddfa]", "bg-[#d8e9f6]"][index % 4]}`}><div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,.9), transparent 38%), linear-gradient(145deg, transparent 30%, rgba(41,76,56,.18))" }} /><span className="relative rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-[#355b46] backdrop-blur">{venue.category}</span></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h3 className="truncate font-display text-[17px] font-extrabold tracking-[-0.035em] text-[#234238]">{venue.name}</h3><p className="mt-1 truncate text-xs text-[#899b92]">{venue.address}</p></div><button onClick={() => toast.success("Mekân kaydedildi")} aria-label="Mekânı kaydet" className="text-[#b7c6bd] transition hover:text-[#8c9f22]"><Bookmark size={17} /></button></div><div className="mt-3 flex items-center gap-3 text-xs"><span className="flex items-center gap-1 font-bold text-[#4c655b]"><Star size={13} fill="#edb94c" className="text-[#edb94c]" /> {venue.rating}</span><span className="text-[#a1b0a8]">{index + 1 === 1 ? "250 m" : `${index + 2}20 m`}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${activityTone(venue.activityScore)}`}><Flame size={10} className="mr-0.5 inline" /> {activityLabel(venue.activityScore)}</span></div></div></div><div className="mt-4 flex items-center justify-between border-t border-[#edf1ed] pt-3"><span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7b9187]"><Users size={13} className="text-[#9bac35]" /> {venue.activityScore > 80 ? 42 : venue.activityScore > 60 ? 18 : 9} kişi son saatte burada</span><Button size="sm" onClick={() => onCheckIn(venue)} disabled={checkingIn} className="h-8 rounded-full bg-[#17362c] px-3 text-[11px] font-bold text-white hover:bg-[#294d3f]">{checkingIn ? "Gönderiliyor..." : <><Check size={13} /> Check-in</>}</Button></div></article>; }
function MapView({ venues, onCheckIn }: { venues: Venue[]; onCheckIn: (venue: Venue) => void }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach(marker => { marker.map = null; });
    markersRef.current = venues.map((venue, index) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: venue.latitude, lng: venue.longitude },
        title: `${venue.name} · ${activityLabel(venue.activityScore)}`,
      });
      marker.addListener("click", () => onCheckIn(venue));
      return marker;
    });
    return () => { markersRef.current.forEach(marker => { marker.map = null; }); };
  }, [venues, onCheckIn]);

  return <div className="relative mt-5 overflow-hidden rounded-[28px] border border-[#dce8dd] bg-[#dfeada] shadow-[0_10px_35px_rgba(34,64,48,0.05)]">
    <ProxyMapView
      className="h-[430px] w-full"
      initialCenter={{ lat: 37.0018, lng: 35.3235 }}
      initialZoom={14}
      onMapReady={map => { mapRef.current = map; }}
    />
    <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-[#4e6c5c] shadow-sm"><MapPin size={13} className="mr-1 inline text-[#92a620]" /> Seyhan, Adana</div>
    <div className="pointer-events-none absolute bottom-5 left-5 rounded-2xl bg-white/95 p-3 shadow-sm backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9aaa00]">Canlı yoğunluk</p><p className="mt-1 text-xs font-semibold text-[#4c655b]">Marker’a dokunarak check-in başlat.</p></div>
  </div>;
}
function ActivityRow({ initials, color, name, action, time, emoji }: { initials: string; color: string; name: string; action: string; time: string; emoji: string }) { return <div className="flex items-center gap-3"><span className={`flex size-10 items-center justify-center rounded-full text-xs font-bold text-[#4b5f55] ${color}`}>{initials}</span><div className="min-w-0 flex-1"><p className="truncate text-sm text-[#4c655b]"><strong className="font-bold text-[#29493b]">{name}</strong> {action} <span className="ml-1">{emoji}</span></p><p className="mt-0.5 text-[11px] text-[#a0b0a8]">{time}</p></div><button onClick={() => toast.success("Aktivite beğenildi")} className="text-[#b4c2bb] hover:text-[#e36f68]"><Heart size={16} /></button></div>; }
function NavItem({ label, icon: Icon, active, onClick }: { label: string; icon: typeof Compass; path: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`flex min-w-[58px] flex-col items-center gap-1 text-[10px] font-bold transition ${active ? "text-[#4e660e]" : "text-[#91a19a] hover:text-[#587267]"}`}><Icon size={19} strokeWidth={active ? 2.5 : 1.8} /><span>{label}</span></button>; }
function MusicIcon(props: React.ComponentProps<typeof Sparkles>) { return <Sparkles {...props} />; }
function ShoppingIcon(props: React.ComponentProps<typeof Sparkles>) { return <Sparkles {...props} />; }

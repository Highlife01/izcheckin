import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Venue } from "@/types/venue";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Coffee, 
  Flame, 
  Sunset, 
  Cake, 
  GlassWater, 
  Dices, 
  MapPin, 
  Star, 
  Navigation, 
  CheckCircle2, 
  Search,
  ArrowRight,
  Zap,
  RotateCw
} from "lucide-react";
import { sound } from "@/lib/sound";

interface QuickMood {
  id: string;
  label: string;
  icon: React.ReactNode;
  category?: string;
  keyword: string;
  gradient: string;
}

const QUICK_MOODS: QuickMood[] = [
  {
    id: "work_coffee",
    label: "Sakin Kafe & Wi-Fi",
    icon: <Coffee className="w-4 h-4 text-amber-400" />,
    category: "Kahve & Kafe",
    keyword: "kahve çalışma wi-fi sakin",
    gradient: "from-amber-500/20 to-orange-500/10 hover:border-amber-500/50",
  },
  {
    id: "kebap_feast",
    label: "Zırh Kebap & Gurme Et",
    icon: <Flame className="w-4 h-4 text-rose-400" />,
    category: "Kebap & Ocakbaşı",
    keyword: "kebap et ocakbaşı zırh",
    gradient: "from-rose-500/20 to-red-500/10 hover:border-rose-500/50",
  },
  {
    id: "sunset_view",
    label: "Manzaralı & Teras",
    icon: <Sunset className="w-4 h-4 text-sky-400" />,
    category: "Restoran & Dünya",
    keyword: "teras manzara boğaz deniz gün batımı",
    gradient: "from-sky-500/20 to-indigo-500/10 hover:border-sky-500/50",
  },
  {
    id: "dessert_craving",
    label: "Tatlı Krizi & Baklava",
    icon: <Cake className="w-4 h-4 text-pink-400" />,
    category: "Tatlı & Fırın",
    keyword: "tatlı baklava künefe pasta kahve",
    gradient: "from-pink-500/20 to-rose-500/10 hover:border-pink-500/50",
  },
  {
    id: "night_vibes",
    label: "Gece Hayatı & Kokteyl",
    icon: <GlassWater className="w-4 h-4 text-emerald-400" />,
    category: "Bar & Gece Hayatı",
    keyword: "bar kokteyl müzik canlı eğlence pub",
    gradient: "from-emerald-500/20 to-teal-500/10 hover:border-emerald-500/50",
  },
  {
    id: "lucky_spin",
    label: "Şansıma Ne Çıkarsa 🎲",
    icon: <Dices className="w-4 h-4 text-[#deff55]" />,
    keyword: "şans rastgele sürpriz",
    gradient: "from-[#deff55]/20 to-lime-500/10 hover:border-[#deff55]/50",
  },
];

export const AIAssistantModal: React.FC = () => {
  const { 
    isAIModalOpen, 
    setIsAIModalOpen, 
    venues, 
    selectedCity, 
    setSelectedVenue, 
    setCheckInVenue 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeMoodId, setActiveMoodId] = useState<string | null>(null);
  const [recommendedVenue, setRecommendedVenue] = useState<Venue | null>(null);
  const [aiReasoning, setAiReasoning] = useState<string>("");
  const [isThinking, setIsThinking] = useState(false);

  // Filter pool by selected city if specific city chosen
  const cityVenues = venues.filter(v => 
    selectedCity === "Tüm Türkiye" ? true : v.city.toLowerCase() === selectedCity.toLowerCase()
  );

  const findRecommendation = (mood?: QuickMood, customText?: string) => {
    setIsThinking(true);
    sound.playSuccess();

    setTimeout(() => {
      let pool = cityVenues.length > 0 ? cityVenues : venues;

      let result: Venue | null = null;
      let reason = "";

      if (mood) {
        if (mood.id === "lucky_spin") {
          // Pure random top rated venue
          const highRated = pool.filter(v => v.activityScore >= 70);
          result = highRated[Math.floor(Math.random() * highRated.length)] || pool[Math.floor(Math.random() * pool.length)];
          reason = `Şans çarkı senin için döndü! Bu mekân ${result.city} şehrinde %${result.activityScore} canlılık skoru ve ${result.rating} puanıyla bugün keşfetmen için en sürpriz ve popüler nokta.`;
        } else if (mood.category) {
          const matchedCategory = pool.filter(v => v.category === mood.category);
          const candidates = matchedCategory.length > 0 ? matchedCategory : pool;
          result = candidates.sort((a, b) => b.activityScore - a.activityScore)[0] || candidates[0];
          reason = `${mood.label} arzuna göre analiz yapıldı. Bu mekân yüksek müşteri memnuniyeti (${result.rating} ★), geniş menüsü (${result.popularItems.slice(0, 2).join(", ")}) ve şu anki hareketliliğiyle aradığın an için biçilmiş kaftan.`;
        } else {
          result = pool[0];
          reason = `Şehirdeki popüler eğilimler doğrultusunda en çok tavsiye edilen mekân seçildi.`;
        }
      } else if (customText && customText.trim()) {
        const lower = customText.toLowerCase();
        const matches = pool.filter(v => 
          v.name.toLowerCase().includes(lower) ||
          v.category.toLowerCase().includes(lower) ||
          v.subcategory.toLowerCase().includes(lower) ||
          v.popularItems.some(item => item.toLowerCase().includes(lower)) ||
          v.features.some(f => f.toLowerCase().includes(lower)) ||
          v.district.toLowerCase().includes(lower) ||
          v.city.toLowerCase().includes(lower)
        );

        if (matches.length > 0) {
          result = matches.sort((a, b) => b.rating - a.rating)[0];
          reason = `"${customText}" aramana tam uyan; ${result.district}, ${result.city} konumundaki bu seçkin mekân menüsündeki ${result.popularItems[0]} ve canlı atmosferiyle öne çıkıyor.`;
        } else {
          // fallback to top rated in pool
          result = pool.sort((a, b) => b.activityScore - a.activityScore)[0];
          reason = `Doğrudan eşleşme bulunamadı ancak ${selectedCity} genelinde şu anda en canlı ve benzer lezzetleri sunan bu mekânı senin için seçtim.`;
        }
      }

      setRecommendedVenue(result);
      setAiReasoning(reason);
      setIsThinking(false);
    }, 450);
  };

  const handleMoodSelect = (mood: QuickMood) => {
    setActiveMoodId(mood.id);
    findRecommendation(mood);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveMoodId(null);
    findRecommendation(undefined, searchQuery);
  };

  const handleOpenDetail = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsAIModalOpen(false);
  };

  const handleDirectCheckIn = (venue: Venue) => {
    setCheckInVenue(venue);
    setIsAIModalOpen(false);
  };

  return (
    <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
      <DialogContent className="max-w-xl p-0 bg-[#0f1715] text-white border border-[#234338] shadow-2xl rounded-2xl overflow-hidden">
        {/* Glowing Header */}
        <div className="relative p-6 bg-gradient-to-br from-[#1b3d32] via-[#132a22] to-[#0c1a15] border-b border-[#234338]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#deff55]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#deff55] to-emerald-400 text-[#0f1715] flex items-center justify-center font-bold shadow-lg shadow-[#deff55]/20">
              <Sparkles className="w-5 h-5 text-[#132a22]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Nereye Gitsem?
                <Badge className="bg-[#deff55] text-[#132a22] text-[10px] font-black hover:bg-[#deff55]">
                  AI ASİSTAN
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-white/60">
                {selectedCity === "Tüm Türkiye" ? "Türkiye geneli" : selectedCity} canlı mekân zekâsı ile sana en uygun yeri bulalım.
              </DialogDescription>
            </div>
          </div>

          {/* Natural Language Prompt Input */}
          <form onSubmit={handleCustomSubmit} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: Sessiz kafe, zırh kebap, boğaz manzarası..."
                className="pl-9 bg-[#17362c]/60 border-[#2b594b] text-white placeholder:text-white/40 text-sm h-10 rounded-xl focus:border-[#deff55] focus:ring-[#deff55]/20"
              />
            </div>
            <Button
              type="submit"
              className="bg-[#deff55] hover:bg-[#c9ea47] text-[#132a22] font-bold text-sm px-4 h-10 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#deff55]/20 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              Bul
            </Button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Quick Mood Pills */}
          <div>
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2.5">
              Hızlı Tercih Seçin
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {QUICK_MOODS.map((mood) => {
                const isActive = activeMoodId === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${mood.gradient} ${
                      isActive 
                        ? "border-[#deff55] bg-[#deff55]/15 ring-1 ring-[#deff55]" 
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-black/30 shrink-0">
                      {mood.icon}
                    </div>
                    <span className="text-xs font-semibold text-white truncate">
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommendation Output Card */}
          {isThinking ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-2 border-[#deff55] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-white/70">
                {selectedCity} genelindeki canlı veriler ve puanlar analiz ediliyor...
              </p>
            </div>
          ) : recommendedVenue ? (
            <div className="relative rounded-2xl border border-[#2b594b] bg-gradient-to-b from-[#17362c]/80 to-[#10251e]/80 p-5 space-y-4 shadow-xl overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#deff55] uppercase tracking-wider">
                      ✨ AI Tavsiyesi
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      🔥 %{recommendedVenue.activityScore} Canlılık
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    {recommendedVenue.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-white/60 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-white/40" />
                      {recommendedVenue.district}, {recommendedVenue.city}
                    </span>
                    <span>•</span>
                    <span className="text-[#deff55] font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      {recommendedVenue.rating}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-white/80">{recommendedVenue.priceRange}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const activeMood = QUICK_MOODS.find(m => m.id === activeMoodId);
                    findRecommendation(activeMood, searchQuery);
                  }}
                  className="text-white/60 hover:text-white hover:bg-white/10 p-2 h-auto rounded-lg"
                  title="Başka Öner"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>

              {/* Cover Image */}
              {recommendedVenue.coverImageUrl && (
                <div className="relative h-36 rounded-xl overflow-hidden border border-white/10 group">
                  <img
                    src={recommendedVenue.coverImageUrl}
                    alt={recommendedVenue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="text-white/80 font-medium truncate">
                      {recommendedVenue.subcategory}
                    </span>
                    <span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[11px] text-white/90 font-mono">
                      {recommendedVenue.openingHours}
                    </span>
                  </div>
                </div>
              )}

              {/* AI Reasoning box */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#deff55] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#deff55] mr-1">Neden bu mekân?</span>
                  {aiReasoning}
                </div>
              </div>

              {/* Features / Items */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recommendedVenue.popularItems.slice(0, 3).map((item, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-white/90">
                    🍽️ {item}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <Button
                  onClick={() => handleOpenDetail(recommendedVenue)}
                  variant="outline"
                  className="bg-transparent border-[#2b594b] hover:bg-white/10 text-white font-semibold text-xs h-10 rounded-xl"
                >
                  Mekânı İncele
                </Button>
                <Button
                  onClick={() => handleDirectCheckIn(recommendedVenue)}
                  className="bg-[#deff55] hover:bg-[#c9ea47] text-[#132a22] font-black text-xs h-10 rounded-xl shadow-md shadow-[#deff55]/20 flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Hemen Check-In
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-white/50 text-xs">
              Yukarıdaki tercihlerden birine dokunun veya arama kutusuna ne aradığınızı yazın.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

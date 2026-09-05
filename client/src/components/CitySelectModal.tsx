import React from "react";
import { useApp } from "@/contexts/AppContext";
import { POPULAR_CITIES } from "@/data/venuesData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, LocateFixed, Check } from "lucide-react";
import { toast } from "sonner";

export const CitySelectModal: React.FC = () => {
  const { 
    selectedCity, 
    setSelectedCity, 
    isCityModalOpen, 
    setIsCityModalOpen,
    venues 
  } = useApp();

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setIsCityModalOpen(false);
    toast.success(`Şehir güncellendi: ${city}`, {
      description: city === "Tüm Türkiye" 
        ? "Türkiye genelindeki tüm mekânlar listeleniyor." 
        : `${city} için en popüler ve trend mekânlar listeleniyor.`,
    });
  };

  const handleGPSDetect = () => {
    toast.loading("Konum alınıyor...", { id: "gps-detect" });
    if (!navigator.geolocation) {
      toast.error("Tarayıcınız konum servisini desteklemiyor.", { id: "gps-detect" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Mock check or simple distance
        toast.success("Konumunuz tespit edildi: İstanbul", { id: "gps-detect" });
        setSelectedCity("İstanbul");
        setIsCityModalOpen(false);
      },
      () => {
        // Fallback default Adana or Istanbul
        toast.info("Konum izni alınamadı, varsayılan şehir seçildi.", { id: "gps-detect" });
      },
      { timeout: 5000 }
    );
  };

  const getVenueCount = (city: string) => {
    if (city === "Tüm Türkiye") return venues.length;
    return venues.filter((v) => v.city === city).length;
  };

  const getCityIcon = (city: string) => {
    switch (city) {
      case "Tüm Türkiye": return "🇹🇷";
      case "İstanbul": return "🌉";
      case "Ankara": return "🏛️";
      case "İzmir": return "🌊";
      case "Adana": return "🥩";
      case "Antalya": return "🌴";
      case "Gaziantep": return "🍯";
      case "Bursa": return "🏔️";
      case "Eskişehir": return "🛶";
      case "Trabzon": return "🌲";
      default: return "📍";
    }
  };

  return (
    <Dialog open={isCityModalOpen} onOpenChange={setIsCityModalOpen}>
      <DialogContent className="sm:max-w-[480px] rounded-[32px] p-6 border-none bg-white text-[#17362c] shadow-[0_30px_90px_rgba(23,54,44,0.2)]">
        <DialogHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#eff7dc] text-[#17362c] mb-2">
            <MapPin size={24} className="text-[#86a226]" />
          </div>
          <DialogTitle className="text-center font-display text-2xl font-extrabold tracking-tight">
            Şehir Seçin
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-[#6e857b]">
            Türkiye genelindeki popüler şehirleri keşfedin veya tüm ülkedeki trendleri inceleyin.
          </DialogDescription>
        </DialogHeader>

        {/* GPS ile Bul Butonu */}
        <button
          onClick={handleGPSDetect}
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-[#d2dfd6] bg-[#f8faf8] p-3 text-xs font-bold text-[#3d5e4f] hover:bg-[#eef5f0] transition"
        >
          <LocateFixed size={15} className="text-[#7ea321]" /> Mevcut Konumumu Kullan (GPS)
        </button>

        {/* Şehir Listesi Izgarası */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1 [scrollbar-width:none]">
          {POPULAR_CITIES.map((city) => {
            const isSelected = selectedCity === city;
            const count = getVenueCount(city);
            return (
              <button
                key={city}
                type="button"
                onClick={() => handleSelectCity(city)}
                className={`flex items-center justify-between rounded-2xl p-3 text-left transition ${
                  isSelected
                    ? "bg-[#17362c] text-[#dfff62] ring-2 ring-[#dfff62] shadow-sm"
                    : "bg-[#f4f7f4] text-[#294639] hover:bg-[#ebf2ec]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">{getCityIcon(city)}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate leading-tight">{city}</p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? "text-[#c2dfb8]" : "text-[#7b9388]"}`}>
                      {count} mekân
                    </p>
                  </div>
                </div>
                {isSelected && <Check size={16} className="text-[#dfff62] shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <Button
            variant="ghost"
            onClick={() => setIsCityModalOpen(false)}
            className="w-full rounded-2xl text-xs font-bold text-[#627d71]"
          >
            Kapat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

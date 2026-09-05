import React, { useState, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { TURKEY_PROVINCES, Province } from "@/data/venuesData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, LocateFixed, Check, Search, X } from "lucide-react";
import { toast } from "sonner";

const REGIONS = [
  "Tümü",
  "Marmara",
  "Ege",
  "Akdeniz",
  "İç Anadolu",
  "Karadeniz",
  "Doğu Anadolu",
  "Güneydoğu Anadolu",
];

export const CitySelectModal: React.FC = () => {
  const { 
    selectedCity, 
    setSelectedCity, 
    isCityModalOpen, 
    setIsCityModalOpen,
    venues 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Tümü");

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setIsCityModalOpen(false);
    setSearchTerm("");
    toast.success(`Şehir seçildi: ${city}`, {
      description: city === "Tüm Türkiye" 
        ? "81 il genelindeki tüm popüler mekânlar listeleniyor." 
        : `${city} ilindeki tüm popüler ve trend mekânlar listeleniyor.`,
    });
  };

  const handleGPSDetect = () => {
    toast.loading("Konumunuz alınıyor...", { id: "gps-detect" });
    if (!navigator.geolocation) {
      toast.error("Tarayıcınız konum servisini desteklemiyor.", { id: "gps-detect" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // En yakın ili hesaplayalım (haversine approx)
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        let closestProvince = TURKEY_PROVINCES[0];
        let minDistance = Number.MAX_VALUE;

        TURKEY_PROVINCES.forEach((p) => {
          const d = Math.hypot(p.centerCoords.lat - userLat, p.centerCoords.lng - userLng);
          if (d < minDistance) {
            minDistance = d;
            closestProvince = p;
          }
        });

        toast.success(`Konumunuz tespit edildi: ${closestProvince.name} (${closestProvince.plate})`, { id: "gps-detect" });
        setSelectedCity(closestProvince.name);
        setIsCityModalOpen(false);
      },
      () => {
        toast.info("Konum izni alınamadı, listeden seçebilirsiniz.", { id: "gps-detect" });
      },
      { timeout: 6000 }
    );
  };

  const filteredProvinces = useMemo(() => {
    return TURKEY_PROVINCES.filter((p) => {
      // Bölge filtresi
      if (selectedRegion !== "Tümü" && p.region !== selectedRegion) {
        return false;
      }

      // Arama filtresi (İsim veya Plaka)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchPlate = p.plate.includes(query);
        return matchName || matchPlate;
      }

      return true;
    });
  }, [searchTerm, selectedRegion]);

  const getVenueCount = (city: string) => {
    if (city === "Tüm Türkiye") return venues.length;
    return venues.filter((v) => v.city.toLowerCase() === city.toLowerCase()).length;
  };

  return (
    <Dialog open={isCityModalOpen} onOpenChange={setIsCityModalOpen}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-hidden rounded-[32px] p-6 border-none bg-white text-[#17362c] shadow-[0_30px_90px_rgba(23,54,44,0.25)] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#eff7dc] text-[#17362c] mb-2">
            <MapPin size={24} className="text-[#86a226]" />
          </div>
          <DialogTitle className="text-center font-display text-2xl font-extrabold tracking-tight">
            Türkiye 81 İl Seçimi
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-[#6e857b]">
            Dilediğiniz ili plaka veya isimle arayın, ya da bölgelere göre filtreleyin.
          </DialogDescription>
        </DialogHeader>

        {/* GPS ile Bul & Arama Girişi */}
        <div className="mt-3 space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8da398]" size={17} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İl adı veya plaka ara (örn: 34, 01, Diyarbakır, Rize)..."
              className="h-11 rounded-2xl border-[#dbe6df] bg-[#f8faf8] pl-10 pr-9 text-xs placeholder:text-[#a1b4ab] focus-visible:ring-[#17362c]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8da398] hover:text-[#17362c]"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGPSDetect}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#d2dfd6] bg-[#f8faf8] py-2 text-xs font-bold text-[#3d5e4f] hover:bg-[#eef5f0] transition"
            >
              <LocateFixed size={14} className="text-[#7ea321]" /> Konumumu Bul (GPS)
            </button>

            <button
              onClick={() => handleSelectCity("Tüm Türkiye")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition border ${
                selectedCity === "Tüm Türkiye"
                  ? "bg-[#17362c] text-[#dfff62] border-[#17362c]"
                  : "bg-white text-[#3d5e4f] border-[#d2dfd6] hover:bg-[#f8faf8]"
              }`}
            >
              🇹🇷 Tüm Türkiye ({venues.length})
            </button>
          </div>

          {/* Bölge Filtreleri Sekmesi */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  selectedRegion === region
                    ? "bg-[#dfff62] text-[#1e3b2b] font-extrabold shadow-xs"
                    : "bg-[#f2f6f3] text-[#607c70] hover:bg-[#e6eee8]"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* 81 İl Listesi Kaydırılabilir Izgara */}
        <div className="mt-3 flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2 [scrollbar-width:none] min-h-[220px]">
          {filteredProvinces.length === 0 ? (
            <div className="col-span-3 py-10 text-center text-xs text-[#789387]">
              "{searchTerm}" ile eşleşen bir il bulunamadı.
            </div>
          ) : (
            filteredProvinces.map((province) => {
              const isSelected = selectedCity === province.name;
              const count = getVenueCount(province.name);
              return (
                <button
                  key={province.plate}
                  type="button"
                  onClick={() => handleSelectCity(province.name)}
                  className={`flex items-center justify-between rounded-xl p-2.5 text-left transition border ${
                    isSelected
                      ? "bg-[#17362c] text-[#dfff62] border-[#17362c] ring-2 ring-[#dfff62] shadow-sm"
                      : "bg-[#f9fbf9] border-[#e2eae4] text-[#294639] hover:bg-[#edf5ef]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold rounded-md px-1.5 py-0.5 ${
                        isSelected ? "bg-white/20 text-[#dfff62]" : "bg-[#e2eae4] text-[#557064]"
                      }`}>
                        {province.plate}
                      </span>
                      <span className="text-xs font-bold truncate leading-tight">
                        {province.name}
                      </span>
                    </div>
                    <span className={`text-[9px] block mt-0.5 ${
                      isSelected ? "text-[#c2dfb8]" : "text-[#7f978d]"
                    }`}>
                      {province.region} {count > 0 ? `· ${count} mekân` : ""}
                    </span>
                  </div>
                  {isSelected && <Check size={14} className="text-[#dfff62] shrink-0 ml-1" />}
                </button>
              );
            })
          )}
        </div>

        <div className="mt-3 shrink-0 pt-2 border-t border-[#edf2ee]">
          <Button
            variant="ghost"
            onClick={() => setIsCityModalOpen(false)}
            className="w-full rounded-xl text-xs font-bold text-[#627d71] h-9"
          >
            Vazgeç
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

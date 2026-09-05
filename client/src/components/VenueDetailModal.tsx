import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Star, Heart, Check, Clock, Phone, Instagram, 
  Flame, Navigation, Users, Sparkles, Share2 
} from "lucide-react";
import { toast } from "sonner";

export const VenueDetailModal: React.FC = () => {
  const { 
    selectedVenue, 
    setSelectedVenue, 
    setCheckInVenue, 
    toggleFavorite, 
    isFavorite 
  } = useApp();

  if (!selectedVenue) return null;

  const favorite = isFavorite(selectedVenue.id);

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${selectedVenue.latitude},${selectedVenue.longitude}`;
    window.open(url, "_blank");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedVenue.name} - mekân. Adana`,
        text: `${selectedVenue.name} mekânını keşfet!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Mekân bağlantısı kopyalandı!");
    }
  };

  // Saatlik yoğunluk çubukları
  const hours = [8, 10, 12, 14, 16, 18, 20, 22];
  const busyness = selectedVenue.busynessHours || [10, 20, 40, 70, 85, 90, 80, 50];

  return (
    <Dialog open={!!selectedVenue} onOpenChange={(open) => !open && setSelectedVenue(null)}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[32px] p-0 border-none bg-white text-[#17362c] shadow-[0_30px_90px_rgba(23,54,44,0.25)] [scrollbar-width:none]">
        {/* Üst Banner & Görsel */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-tr from-[#17362c] via-[#214b3d] to-[#608035] p-6 text-white flex flex-col justify-between">
          <div className="flex items-center justify-between z-10">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md text-[#dfff62]">
              {selectedVenue.category}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex size-9 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition"
                aria-label="Paylaş"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={() => toggleFavorite(selectedVenue.id)}
                className={`flex size-9 items-center justify-center rounded-full backdrop-blur-md transition ${
                  favorite ? "bg-red-500 text-white" : "bg-black/20 text-white hover:bg-black/40"
                }`}
                aria-label="Favorilere ekle"
              >
                <Heart size={16} fill={favorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="z-10">
            <h2 className="font-display text-2xl font-extrabold tracking-tight leading-tight">
              {selectedVenue.name}
            </h2>
            <p className="text-xs text-white/80 mt-1 flex items-center gap-1.5">
              <MapPin size={13} className="text-[#dfff62]" /> {selectedVenue.address}
            </p>
          </div>

          {/* Arka plan dekorasyon halkaları */}
          <div className="absolute -right-8 -bottom-10 size-44 rounded-full border-[20px] border-white/10 pointer-events-none" />
          <div className="absolute right-16 -top-10 size-32 rounded-full bg-[#dfff62]/10 pointer-events-none blur-xl" />
        </div>

        <div className="p-6 space-y-6">
          {/* İstatistik Çubuğu */}
          <div className="grid grid-cols-4 gap-2 rounded-2xl bg-[#f4f7f4] p-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-[#385648]">
                <Star size={13} fill="#f59e0b" className="text-[#f59e0b]" /> {selectedVenue.rating}
              </div>
              <p className="text-[10px] text-[#869990] mt-0.5">{selectedVenue.ratingCount} oy</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-[#e16a2b]">
                <Flame size={13} fill="currentColor" /> {selectedVenue.activityScore}%
              </div>
              <p className="text-[10px] text-[#869990] mt-0.5">Canlı Skor</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-[#17362c]">
                <Users size={13} /> {selectedVenue.checkinCount}
              </div>
              <p className="text-[10px] text-[#869990] mt-0.5">Check-in</p>
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#17362c]">
                {selectedVenue.priceRange}
              </div>
              <p className="text-[10px] text-[#869990] mt-0.5">Fiyat</p>
            </div>
          </div>

          {/* Canlı Yoğunluk Grafiği */}
          <div className="rounded-2xl border border-[#dfe7e2] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#698276] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#96a724]" /> Günlük Hareketlilik Grafiği
              </span>
              <span className="rounded-full bg-[#eaf8e9] px-2.5 py-0.5 text-[10px] font-bold text-[#1f7943]">
                Şu an açık
              </span>
            </div>
            <div className="flex items-end justify-between gap-1.5 h-20 pt-2">
              {hours.map((h, i) => {
                const val = busyness[h] || 30;
                const isHigh = val >= 75;
                return (
                  <div key={h} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        isHigh ? "bg-[#f97316]" : "bg-[#9dbf3b]"
                      }`}
                      style={{ height: `${val}%` }}
                      title={`Saat ${h}:00 - %${val} yoğunluk`}
                    />
                    <span className="text-[9px] font-semibold text-[#8b9e95]">{h}:00</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popüler Lezzetler & Öne Çıkanlar */}
          {selectedVenue.popularItems && selectedVenue.popularItems.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b9e95] mb-2.5">
                Meşhur Lezzetler / Öne Çıkanlar
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedVenue.popularItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-[#f4f7f4] px-3 py-1.5 text-xs font-bold text-[#27483a] border border-[#dbe6df]"
                  >
                    ✨ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mekân Olanakları */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b9e95] mb-2.5">
              Olanaklar & Detaylar
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedVenue.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="rounded-xl bg-[#eef3f0] px-2.5 py-1 text-xs font-medium text-[#466356]"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Saat ve İletişim */}
          <div className="space-y-2 rounded-2xl bg-[#f8faf8] p-3 text-xs text-[#526f62]">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#849c31]" />
              <span>Çalışma Saatleri: <strong>{selectedVenue.openingHours}</strong></span>
            </div>
            {selectedVenue.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#849c31]" />
                <span>Telefon: <strong>{selectedVenue.phone}</strong></span>
              </div>
            )}
            {selectedVenue.instagram && (
              <div className="flex items-center gap-2">
                <Instagram size={14} className="text-[#849c31]" />
                <span>Instagram: <strong className="text-[#17362c]">{selectedVenue.instagram}</strong></span>
              </div>
            )}
          </div>

          {/* Eylemler */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenMaps}
              className="flex-1 rounded-2xl border-[#cbdace] text-xs font-bold text-[#355346] hover:bg-[#edf3ef]"
            >
              <Navigation size={14} className="mr-1.5" /> Yol Tarifi Al
            </Button>
            <Button
              type="button"
              onClick={() => {
                const venueToSave = selectedVenue;
                setSelectedVenue(null);
                setCheckInVenue(venueToSave);
              }}
              className="flex-1 rounded-2xl bg-[#17362c] text-xs font-extrabold text-[#dfff62] hover:bg-[#254d3f] shadow-[0_8px_25px_rgba(23,54,44,0.25)]"
            >
              <Check size={16} className="mr-1.5" /> Şimdi Check-in Yap
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

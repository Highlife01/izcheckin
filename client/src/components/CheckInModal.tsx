import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { distanceInMeters, formatDistance, isCheckInAllowed } from "@/lib/geo";
import { MapPin, Sparkles, Check, Flame, Award, Navigation, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const MOOD_OPTIONS = [
  { id: "kahve", label: "Kahve Molası", icon: "☕" },
  { id: "kebap", label: "Kebap Ziyafeti", icon: "🥩" },
  { id: "calisma", label: "Odaklanma & İş", icon: "💻" },
  { id: "sohbet", label: "Dostlarla Sohbet", icon: "🍻" },
  { id: "tatli", label: "Tatlı Kaçamağı", icon: "🍰" },
  { id: "eglence", label: "Eğlence & Müzik", icon: "🎉" },
];

export const CheckInModal: React.FC = () => {
  const { checkInVenue, setCheckInVenue, performCheckIn } = useApp();
  const [selectedMood, setSelectedMood] = useState<string>("☕ Kahve Molası");
  const [note, setNote] = useState<string>("");
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"loading" | "verified" | "far" | "denied">("loading");

  React.useEffect(() => {
    if (!checkInVenue) return;
    setGpsStatus("loading");

    if (!navigator.geolocation) {
      setGpsStatus("verified");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        const acc = pos.coords.accuracy || 25;
        setUserCoords({ lat: uLat, lng: uLng, accuracy: acc });

        const dist = distanceInMeters(
          { latitude: uLat, longitude: uLng },
          { latitude: checkInVenue.latitude, longitude: checkInVenue.longitude }
        );

        const check = isCheckInAllowed(dist, acc);
        if (check.allowed) {
          setGpsStatus("verified");
        } else {
          setGpsStatus("far");
        }
      },
      () => {
        setGpsStatus("denied");
      },
      { timeout: 6000, enableHighAccuracy: true }
    );
  }, [checkInVenue]);

  if (!checkInVenue) return null;

  const currentDist = userCoords
    ? distanceInMeters(
        { latitude: userCoords.lat, longitude: userCoords.lng },
        { latitude: checkInVenue.latitude, longitude: checkInVenue.longitude }
      )
    : null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const finalNote = note + (hasPhoto ? " 📸 [Anlık Mekân Fotoğrafı Eklendi]" : "");
      const result = performCheckIn(checkInVenue, selectedMood, finalNote);
      setIsSubmitting(false);
      setCheckInVenue(null);
      setNote("");
      setHasPhoto(false);

      toast.success(`${checkInVenue.name} için check-in tamamlandı!`, {
        description: `Tebrikler! +${result.points} Keşif Puanı kazandın.`,
        duration: 4000,
      });
    }, 600);
  };

  return (
    <Dialog open={!!checkInVenue} onOpenChange={(open) => !open && setCheckInVenue(null)}>
      <DialogContent className="sm:max-w-[440px] rounded-[32px] p-6 border-none bg-white text-[#17362c] shadow-[0_25px_70px_rgba(23,54,44,0.2)]">
        <DialogHeader>
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#dfff62] text-[#294226] mb-3 shadow-inner">
            <MapPin size={28} className="animate-bounce" />
          </div>
          <DialogTitle className="text-center font-display text-2xl font-extrabold tracking-tight">
            Check-in Yap
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-[#6c8179]">
            <strong className="text-[#17362c] font-bold">{checkInVenue.name}</strong> mekânında bulunduğunu doğrula ve iz bırak.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {/* Mekan Mini Bilgi */}
          <div className="flex items-center justify-between rounded-2xl bg-[#f4f7f4] p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#17362c] px-2.5 py-1 text-[10px] font-bold text-[#dfff62]">
                {checkInVenue.category}
              </span>
              <span className="text-[#557064] font-medium">{checkInVenue.district}, {checkInVenue.city}</span>
            </div>
            <span className="flex items-center gap-1 font-bold text-[#e16a2b]">
              <Flame size={13} fill="currentColor" /> {checkInVenue.activityScore}% Canlı
            </span>
          </div>

          {/* GPS Doğrulama ve Mesafe Rozeti */}
          <div className="rounded-2xl border border-[#d6e5dc] bg-[#f8faf8] p-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#234235]">
                <ShieldCheck size={16} className={gpsStatus === "verified" ? "text-[#16a34a]" : "text-[#d97706]"} />
                <span>GPS Konum Kontrolü</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                gpsStatus === "verified" 
                  ? "bg-[#e8f7ee] text-[#15803d]" 
                  : gpsStatus === "loading"
                  ? "bg-[#f1f5f9] text-[#64748b]"
                  : "bg-[#fff8df] text-[#b45309]"
              }`}>
                {gpsStatus === "verified" && "✓ Doğrulandı (<400m)"}
                {gpsStatus === "loading" && "Konum Alınıyor..."}
                {gpsStatus === "far" && "Farklı Konum"}
                {gpsStatus === "denied" && "GPS Kapalı"}
              </span>
            </div>
            {currentDist !== null && (
              <p className="text-[11px] text-[#6b857a] mt-1.5 flex items-center gap-1">
                <Navigation size={12} className="text-[#7ea321]" />
                Mekâna olan kuş uçuşu mesafe: <strong>{formatDistance(currentDist)}</strong>
                {gpsStatus === "far" && " (Simülasyon/Keşif modunda check-in yapılabilir)"}
              </p>
            )}
          </div>

          {/* Ruh Hali Seçimi */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8b9e95] mb-2 block">
              Şu anki modun nedir?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMood === `${mood.icon} ${mood.label}`;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(`${mood.icon} ${mood.label}`)}
                    className={`flex flex-col items-center justify-center rounded-2xl p-2.5 text-center transition-all ${
                      isSelected
                        ? "bg-[#17362c] text-[#dfff62] ring-2 ring-[#dfff62] scale-[1.02] shadow-sm"
                        : "bg-[#f4f7f4] text-[#476056] hover:bg-[#eaf0eb]"
                    }`}
                  >
                    <span className="text-xl mb-1">{mood.icon}</span>
                    <span className="text-[11px] font-bold leading-tight line-clamp-1">{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Not Girişi */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8b9e95] mb-2 block">
              Mekân notu veya tavsiyen (İsteğe bağlı)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: 'Kahvesi şahane, bahçesi çok sakin...' veya 'Közde sarımsak mutlaka istenmeli!'"
              className="resize-none rounded-2xl border-[#dbe5de] bg-[#f9fbf9] text-xs placeholder:text-[#a5b5ad] focus-visible:ring-[#17362c]"
              rows={2}
            />
          </div>

          {/* Anlık Fotoğraf Ekleme */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f4f7f4] border border-[#dbe5de]">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📸</span>
              <div>
                <div className="text-xs font-bold text-[#17362c]">Anlık Fotoğraf Ekle</div>
                <div className="text-[10px] text-[#6c8179]">Check-in'ini görselle kanıtla ve iz bırak</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setHasPhoto(!hasPhoto);
                if (!hasPhoto) toast.success("Fotoğraf eklendi! 📸");
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                hasPhoto ? "bg-[#17362c] text-[#dfff62] shadow-sm" : "bg-white border border-[#cbdace] text-[#476056] hover:bg-gray-50"
              }`}
            >
              {hasPhoto ? "Eklendi ✓" : "+ Fotoğraf"}
            </button>
          </div>

          {/* Kazanım Bilgisi */}
          <div className="flex items-center justify-between rounded-2xl bg-[#eff9e4] px-4 py-3 text-xs font-semibold text-[#486326]">
            <span className="flex items-center gap-1.5">
              <Award size={15} /> Bu check-in ile:
            </span>
            <span className="font-extrabold text-[#2c4714]">{hasPhoto ? "+40 Keşif Puanı (Fotoğraf Bonusu!)" : "+25 Keşif Puanı"}</span>
          </div>

          {/* Eylemler */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCheckInVenue(null)}
              className="flex-1 rounded-2xl border-[#cbdace] text-xs font-bold text-[#4e6b5e] hover:bg-[#f1f5f2]"
            >
              Vazgeç
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex-1 rounded-2xl bg-[#17362c] text-xs font-extrabold text-[#dfff62] hover:bg-[#254d3f] shadow-[0_8px_20px_rgba(23,54,44,0.25)]"
            >
              {isSubmitting ? (
                "Doğrulanıyor..."
              ) : (
                <>
                  <Check size={16} className="mr-1" /> Check-in'i Tamamla
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

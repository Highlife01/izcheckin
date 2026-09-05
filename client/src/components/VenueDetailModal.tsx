import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { distanceInMeters, formatDistance } from "@/lib/geo";
import { 
  MapPin, Star, Heart, Check, Clock, Phone, Instagram, 
  Flame, Navigation, Users, Sparkles, Share2, Compass 
} from "lucide-react";
import { toast } from "sonner";

export const VenueDetailModal: React.FC = () => {
  const { 
    selectedVenue, 
    setSelectedVenue, 
    setCheckInVenue, 
    toggleFavorite, 
    isFavorite,
    sendCheer,
    reviews,
    addReview,
  } = useApp();

  const [userDist, setUserDist] = React.useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [newRating, setNewRating] = React.useState(5);
  const [newComment, setNewComment] = React.useState("");
  const [newPhoto, setNewPhoto] = React.useState("");

  React.useEffect(() => {
    if (!selectedVenue || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = distanceInMeters(
          { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          { latitude: selectedVenue.latitude, longitude: selectedVenue.longitude }
        );
        setUserDist(d);
      },
      () => {},
      { timeout: 5000 }
    );
  }, [selectedVenue]);

  if (!selectedVenue) return null;

  const favorite = isFavorite(selectedVenue.id);
  const venueReviews = reviews[selectedVenue.id] || [];

  const handleSubmitReview = () => {
    if (!newComment.trim()) {
      toast.error("Lütfen bir yorum veya değerlendirme yazın.");
      return;
    }
    addReview(selectedVenue.id, newRating, newComment.trim(), newPhoto || undefined);
    setNewComment("");
    setNewPhoto("");
    setShowReviewForm(false);
  };

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
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/80 mt-1">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-[#dfff62]" /> {selectedVenue.district}, {selectedVenue.city}
              </span>
              {userDist !== null && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold text-[#dfff62] backdrop-blur-sm">
                  📍 {formatDistance(userDist)} mesafedesiniz
                </span>
              )}
            </div>
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

          {/* Mekân Muhtarı (Mayor) Kartı */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black text-sm flex items-center justify-center border-2 border-amber-300 shadow-md">
                  {selectedVenue.mayor ? selectedVenue.mayor.avatar : "👑"}
                </div>
                <div className="absolute -top-1.5 -right-1.5 text-xs">
                  👑
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#17362c]">
                    {selectedVenue.mayor ? selectedVenue.mayor.name : "Henüz Muhtar Yok"}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 font-bold uppercase tracking-wider">
                    Mekân Muhtarı
                  </span>
                </div>
                <p className="text-[11px] text-[#557365] mt-0.5">
                  {selectedVenue.mayor
                    ? `${selectedVenue.mayor.checkinCount} check-in ile mekânın lideri (${selectedVenue.mayor.since})`
                    : "Bu mekânda 2 veya daha fazla check-in yaparak muhtarlık tacını sen kap!"}
                </p>
              </div>
            </div>
          </div>

          {/* Jest Yap / Selam Gönder (Cheers) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b9e95] mb-2.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> Masaya Jest Yap & Selam Gönder
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: "Kahve Ismarla", icon: "☕", color: "hover:border-amber-500 hover:bg-amber-50" },
                { type: "Selam Gönder", icon: "👋", color: "hover:border-emerald-500 hover:bg-emerald-50" },
                { type: "Kadeh Kaldır", icon: "🥂", color: "hover:border-purple-500 hover:bg-purple-50" },
                { type: "İkram Gönder", icon: "🍰", color: "hover:border-pink-500 hover:bg-pink-50" },
              ].map((cheer) => (
                <button
                  key={cheer.type}
                  onClick={() => sendCheer(selectedVenue, cheer.type)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border border-[#dbe6df] bg-[#f8faf8] transition-all active:scale-95 ${cheer.color}`}
                >
                  <span className="text-lg mb-0.5">{cheer.icon}</span>
                  <span className="text-[11px] font-bold text-[#27483a]">{cheer.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topluluk Değerlendirmeleri ve Yorumlar */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b9e95]">
                Topluluk Yorumları ({venueReviews.length})
              </h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-bold text-[#2a5948] hover:text-[#17362c] underline"
              >
                {showReviewForm ? "Formu Kapat" : "+ Değerlendirme Yaz"}
              </button>
            </div>

            {/* Yeni Yorum Formu */}
            {showReviewForm && (
              <div className="p-4 rounded-2xl border border-[#c5d8cd] bg-[#f4f7f4] space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17362c]">Puanınız:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          size={18}
                          className={star <= newRating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Mekânın ortamı, lezzetleri ve servisi hakkında ne düşünüyorsunuz?..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-[#d0ded5] bg-white text-[#17362c] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#17362c]"
                />

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewPhoto(newPhoto ? "" : "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80");
                      toast.info(newPhoto ? "Fotoğraf kaldırıldı" : "Örnek anlık fotoğraf eklendi 📸");
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${
                      newPhoto ? "border-[#17362c] bg-[#17362c] text-[#dfff62]" : "border-[#c5d8cd] bg-white text-[#385648]"
                    }`}
                  >
                    📸 {newPhoto ? "Fotoğraf Eklendi ✓" : "Fotoğraf Ekle"}
                  </button>

                  <Button
                    type="button"
                    onClick={handleSubmitReview}
                    className="bg-[#17362c] hover:bg-[#27483a] text-[#dfff62] text-xs font-bold rounded-xl h-8 px-4"
                  >
                    Paylaş (+15 P)
                  </Button>
                </div>
              </div>
            )}

            {/* Yorumlar Listesi */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {venueReviews.length === 0 ? (
                <p className="text-xs text-[#869990] py-3 text-center">
                  Henüz yorum yazılmamış. İlk değerlendirmeyi sen yap!
                </p>
              ) : (
                venueReviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-[#f8faf8] border border-[#e4ede7] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-[#deff55] text-[#17362c] font-bold text-[10px] flex items-center justify-center">
                          {rev.userAvatar}
                        </div>
                        <span className="font-bold text-[#17362c]">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={11} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#869990] ml-1">{rev.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-[#385648] text-xs leading-relaxed">{rev.text}</p>
                    {rev.photoUrl && (
                      <div className="mt-1.5 rounded-lg overflow-hidden border border-[#dbe6df] max-h-32">
                        <img src={rev.photoUrl} alt="Ziyaretçi fotoğrafı" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
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

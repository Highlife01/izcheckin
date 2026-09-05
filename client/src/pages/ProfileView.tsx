import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { 
  Trophy, MapPin, Heart, Flame, Star, Award, 
  Calendar, CheckCircle2, ChevronRight, Lock, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProfileView: React.FC = () => {
  const { user, checkins, badges, favorites, venues, setSelectedVenue } = useApp();
  const [activeTab, setActiveTab] = useState<"badges" | "checkins" | "favorites">("badges");

  const progressPercent = Math.min(
    100,
    Math.round((user.currentPoints / user.nextLevelPoints) * 100)
  );

  const favoriteVenues = venues.filter((v) => favorites.includes(v.id));

  return (
    <div className="space-y-6">
      {/* Profil Başlık Kartı */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#17362c] via-[#22483a] to-[#3b6647] p-6 text-white shadow-[0_20px_50px_rgba(23,54,44,0.18)]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-[#dfff62] text-xl font-extrabold text-[#17362c] shadow-[0_8px_20px_rgba(223,255,98,0.25)]">
              {user.avatarText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold tracking-tight">
                  {user.name}
                </h1>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-[#dfff62]">
                  Lvl {user.level}
                </span>
              </div>
              <p className="text-xs text-[#c5dbcf] mt-0.5 font-medium">
                {user.title} · Seyhan, Adana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-[#dfff62]">Keşif Puanı</span>
              <p className="text-lg font-extrabold">{user.currentPoints} <span className="text-xs font-normal text-[#c5dbcf]">/ {user.nextLevelPoints}</span></p>
            </div>
          </div>
        </div>

        {/* Seviye İlerleme Çubuğu */}
        <div className="relative z-10 mt-5">
          <div className="flex justify-between text-[11px] font-semibold text-[#c5dbcf] mb-1.5">
            <span>Sonraki Seviye: <strong>Seviye {user.level + 1}</strong></span>
            <span>%{progressPercent}</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-black/25 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-[#dfff62] transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Arka plan süsleri */}
        <div className="absolute -right-10 -bottom-10 size-48 rounded-full border-[24px] border-white/5 pointer-events-none" />
      </div>

      {/* İstatistik Özet Kutuları */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center border border-[#e3ebe5] shadow-sm">
          <div className="text-2xl font-extrabold text-[#17362c]">{user.totalCheckins}</div>
          <span className="text-[11px] font-bold text-[#7a9489] uppercase tracking-wider">Check-in</span>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center border border-[#e3ebe5] shadow-sm">
          <div className="text-2xl font-extrabold text-[#95a822]">
            {badges.filter((b) => b.unlocked).length} <span className="text-xs text-[#a0b2aa]">/ {badges.length}</span>
          </div>
          <span className="text-[11px] font-bold text-[#7a9489] uppercase tracking-wider">Rozet</span>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center border border-[#e3ebe5] shadow-sm">
          <div className="text-2xl font-extrabold text-[#e11d48]">{favorites.length}</div>
          <span className="text-[11px] font-bold text-[#7a9489] uppercase tracking-wider">Favori</span>
        </div>
      </div>

      {/* Sekmeler Butonları */}
      <div className="flex rounded-2xl bg-[#e8efe9] p-1 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab("badges")}
          className={`flex-1 rounded-xl py-2.5 transition flex items-center justify-center gap-1.5 ${
            activeTab === "badges" ? "bg-white text-[#17362c] shadow-sm" : "text-[#718a7f]"
          }`}
        >
          <Trophy size={14} /> Rozetler ({badges.filter((b) => b.unlocked).length})
        </button>
        <button
          onClick={() => setActiveTab("checkins")}
          className={`flex-1 rounded-xl py-2.5 transition flex items-center justify-center gap-1.5 ${
            activeTab === "checkins" ? "bg-white text-[#17362c] shadow-sm" : "text-[#718a7f]"
          }`}
        >
          <MapPin size={14} /> Geçmiş ({checkins.length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex-1 rounded-xl py-2.5 transition flex items-center justify-center gap-1.5 ${
            activeTab === "favorites" ? "bg-white text-[#17362c] shadow-sm" : "text-[#718a7f]"
          }`}
        >
          <Heart size={14} /> Favoriler ({favorites.length})
        </button>
      </div>

      {/* Sekme İçerikleri */}
      {activeTab === "badges" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-start gap-3.5 rounded-[24px] p-4 border transition ${
                badge.unlocked
                  ? "bg-white border-[#d2e4d7] shadow-[0_6px_20px_rgba(23,54,44,0.04)]"
                  : "bg-[#f5f8f5] border-[#e2eae3] opacity-60"
              }`}
            >
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                  badge.unlocked
                    ? "bg-[#eef8dd] border border-[#d6ebac]"
                    : "bg-[#e7eee9] grayscale"
                }`}
              >
                {badge.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-extrabold text-[#17362c]">
                    {badge.title}
                  </h4>
                  {badge.unlocked ? (
                    <span className="rounded-full bg-[#e9f8ee] px-2 py-0.5 text-[9px] font-bold text-[#1f7943]">
                      Kazanıldı ✓
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#8ba096]">
                      <Lock size={11} /> {badge.progress} / {badge.maxProgress}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#638073] mt-1 leading-snug">
                  {badge.description}
                </p>
                {!badge.unlocked && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-[#d8e3db] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#17362c]"
                      style={{
                        width: `${Math.round((badge.progress / badge.maxProgress) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "checkins" && (
        <div className="space-y-3">
          {checkins.length === 0 ? (
            <div className="rounded-[24px] bg-white p-8 text-center text-xs text-[#7d968b] border border-[#dfe8e1]">
              Henüz hiç check-in yapmadın. Mekânları gezerek ilk izini bırak!
            </div>
          ) : (
            checkins.map((chk) => (
              <div
                key={chk.id}
                className="flex items-start gap-3.5 rounded-[24px] bg-white p-4 border border-[#e3ece5] shadow-sm"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#f0f6f2] text-base font-bold text-[#17362c]">
                  📍
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-extrabold text-[#17362c] truncate">
                      {chk.venueName}
                    </h4>
                    <span className="rounded-full bg-[#eff8e7] px-2 py-0.5 text-[10px] font-bold text-[#446622]">
                      +{chk.pointsEarned} Puan
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#607c70] mt-0.5">
                    <span className="font-semibold text-[#17362c]">{chk.mood}</span>
                    <span>·</span>
                    <span className="text-[11px] text-[#8ea49a]">
                      {new Date(chk.timestamp).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {chk.note && (
                    <p className="mt-2 rounded-xl bg-[#f8faf8] border border-[#e6eee8] p-2 text-xs text-[#486658] italic">
                      "{chk.note}"
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {favoriteVenues.length === 0 ? (
            <div className="col-span-2 rounded-[24px] bg-white p-8 text-center text-xs text-[#7d968b] border border-[#dfe8e1]">
              Favorilerine henüz bir mekân eklemedin. Mekân detayından kalp ikonuna tıklayarak ekleyebilirsin!
            </div>
          ) : (
            favoriteVenues.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVenue(v)}
                className="cursor-pointer flex items-center justify-between rounded-[24px] bg-white p-4 border border-[#e3ece5] shadow-sm hover:border-[#b8cdbf] transition"
              >
                <div>
                  <span className="rounded-full bg-[#f1f6f2] px-2 py-0.5 text-[10px] font-bold text-[#416152]">
                    {v.category}
                  </span>
                  <h4 className="font-display text-base font-extrabold text-[#17362c] mt-1">
                    {v.name}
                  </h4>
                  <p className="text-xs text-[#80978c]">{v.district} · {v.rating} ⭐</p>
                </div>
                <ChevronRight size={18} className="text-[#a1b5ac]" />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

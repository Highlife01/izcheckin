import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { LeaderboardUser } from "@/types/venue";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  Sparkles, 
  MapPin, 
  Award, 
  Compass,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export const LeaderboardModal: React.FC = () => {
  const { 
    isLeaderboardOpen, 
    setIsLeaderboardOpen, 
    leaderboardUsers, 
    selectedCity,
    user 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"turkey" | "city">("turkey");

  // Filter if city tab is active
  const displayedUsers = activeTab === "city" && selectedCity !== "Tüm Türkiye"
    ? leaderboardUsers.filter(u => u.city.toLowerCase() === selectedCity.toLowerCase())
    : leaderboardUsers;

  const top3 = displayedUsers.slice(0, 3);
  const remaining = displayedUsers.slice(3);

  return (
    <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
      <DialogContent className="max-w-xl p-0 bg-[#0c1613] text-white border border-[#234338] shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-[#1d4336] via-[#122c23] to-[#0a1813] border-b border-[#234338]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-[#0f1715] flex items-center justify-center font-bold shadow-lg shadow-amber-400/20">
              <Trophy className="w-5 h-5 text-[#132a22]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Şehir ve Keşif Liderleri
                <Badge className="bg-amber-400 text-[#132a22] text-[10px] font-black hover:bg-amber-400">
                  LİDERLİK TABLOSU
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-white/60">
                Türkiye'nin en aktif mekân kaşifleri, gurmeleri ve muhtarları.
              </DialogDescription>
            </div>
          </div>

          {/* Switch tabs */}
          <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("turkey")}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "turkey"
                  ? "bg-[#deff55] text-[#132a22] shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span>🇹🇷</span> Tüm Türkiye
            </button>
            <button
              onClick={() => setActiveTab("city")}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "city"
                  ? "bg-[#deff55] text-[#132a22] shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {selectedCity === "Tüm Türkiye" ? "Şehir Sıralaması" : `${selectedCity} Liderleri`}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Podium for Top 3 */}
          {top3.length >= 3 && (
            <div className="pt-4 pb-2">
              <div className="flex items-end justify-center gap-3">
                {/* 2nd Place (Left) */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-black text-base flex items-center justify-center border-2 border-slate-300 shadow-lg">
                      {top3[1]?.avatarText}
                    </div>
                    <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-bold text-xs flex items-center justify-center shadow">
                      2
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-white truncate max-w-[100px]">
                      {top3[1]?.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      {top3[1]?.points} Puan
                    </div>
                  </div>
                  <div className="w-full h-16 mt-2 rounded-t-xl bg-gradient-to-t from-white/5 to-white/10 border-t border-slate-400/30 flex items-center justify-center text-xs font-bold text-slate-300">
                    🥈 2.
                  </div>
                </div>

                {/* 1st Place (Center - Elevated) */}
                <div className="flex-1 flex flex-col items-center -mt-4">
                  <div className="relative mb-2">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
                      <Crown className="w-6 h-6 text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black text-lg flex items-center justify-center border-2 border-amber-300 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/40">
                      {top3[0]?.avatarText}
                    </div>
                    <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-bold text-xs flex items-center justify-center shadow">
                      1
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-black text-amber-300 truncate max-w-[110px]">
                      {top3[0]?.name}
                    </div>
                    <div className="text-[11px] text-amber-400/90 font-bold">
                      {top3[0]?.points} Puan
                    </div>
                  </div>
                  <div className="w-full h-24 mt-2 rounded-t-xl bg-gradient-to-t from-amber-500/10 to-amber-500/20 border-t border-amber-400/50 flex items-center justify-center text-sm font-black text-amber-400 shadow-inner">
                    🥇 1.
                  </div>
                </div>

                {/* 3rd Place (Right) */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-600 text-amber-100 font-black text-base flex items-center justify-center border-2 border-amber-700 shadow-lg">
                      {top3[2]?.avatarText}
                    </div>
                    <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-600 text-amber-100 font-bold text-xs flex items-center justify-center shadow">
                      3
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-white truncate max-w-[100px]">
                      {top3[2]?.name}
                    </div>
                    <div className="text-[10px] text-amber-600 font-semibold">
                      {top3[2]?.points} Puan
                    </div>
                  </div>
                  <div className="w-full h-12 mt-2 rounded-t-xl bg-gradient-to-t from-white/5 to-white/10 border-t border-amber-700/30 flex items-center justify-center text-xs font-bold text-amber-600">
                    🥉 3.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* List of Remaining Users + Current User Highlight */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Sıralama Listesi
            </div>

            {displayedUsers.map((item) => {
              const isMe = item.isCurrentUser || item.name === user.name;
              return (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isMe
                      ? "bg-[#deff55]/15 border-[#deff55] ring-1 ring-[#deff55]/50 shadow-md shadow-[#deff55]/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center text-xs font-black font-mono text-white/60">
                      #{item.rank}
                    </div>

                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${item.avatarBg}`}>
                      {item.avatarText}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {item.name}
                        </span>
                        {isMe && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#deff55] text-[#132a22] font-black uppercase tracking-wider">
                            Sen
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/50">
                        <span>{item.city}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">{item.title}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-[#deff55]">
                      {item.points} P
                    </div>
                    <div className="text-[10px] text-white/50">
                      {item.checkins} Check-in
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* How to Earn Points Guide */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-[#deff55]" />
              Nasıl Puan Kazanılır & Sıralamada Yükselinir?
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <span className="text-emerald-400 font-bold">+25 P</span>
                <span>Her Mekân Check-in</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <span className="text-amber-400 font-bold">+15 P</span>
                <span>Fotoğraf & Yorum</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <span className="text-purple-400 font-bold">+50 P</span>
                <span>Kazanılan Yeni Rozet</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <span className="text-[#deff55] font-bold">👑 Muhtarlık</span>
                <span>En çok check-in yapan</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

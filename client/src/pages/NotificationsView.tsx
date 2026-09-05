import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Bell, CheckCheck, Sparkles, Trophy, MapPin, Heart, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotificationsView: React.FC = () => {
  const { notifications, markAllNotificationsAsRead } = useApp();

  const getIcon = (type: string, fallback: string) => {
    switch (type) {
      case "badge":
        return <Trophy size={18} className="text-[#eab308]" />;
      case "trend":
        return <Flame size={18} className="text-[#f97316]" />;
      case "social":
        return <Heart size={18} className="text-[#ef4444]" />;
      case "checkin":
      default:
        return <MapPin size={18} className="text-[#10b981]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#79928a]">
            Canlı Sosyal Akış
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#17362c]">
            Bildirimler & Sinyaller
          </h1>
        </div>

        {notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            className="rounded-full border-[#d2dfd7] text-xs font-bold text-[#446254] hover:bg-white"
          >
            <CheckCheck size={14} className="mr-1.5" /> Tümünü Oku
          </Button>
        )}
      </div>

      {/* Güncel Önemli Sinyal Kartı */}
      <div className="rounded-[28px] bg-gradient-to-r from-[#17362c] to-[#2a5645] p-5 text-white shadow-[0_12px_35px_rgba(23,54,44,0.12)] flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#dfff62] text-[#17362c]">
          <Sparkles size={20} />
        </div>
        <div>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-[#dfff62] uppercase tracking-wider">
            Adana Canlı Nabız
          </span>
          <h3 className="font-display text-base font-extrabold mt-1">
            Hafta Sonu Zirvesi: Kazancılar & Ziyapaşa
          </h3>
          <p className="text-xs text-[#cadcd2] mt-1 leading-relaxed">
            Bugün öğleden sonra tarihi ciğerciler ve 3. nesil kafelerde hareketlilik zirveye ulaştı. 
            Check-in yaparak +25 Keşif Puanı ve özel hafta sonu rozeti kazanabilirsin!
          </p>
        </div>
      </div>

      {/* Bildirim Listesi */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-[28px] bg-white p-12 text-center text-sm text-[#738d81] border border-[#e2eae4]">
            <div className="text-3xl mb-2">🔔</div>
            <p className="font-bold text-[#203c30]">Henüz yeni bir bildirim yok.</p>
            <p className="text-xs text-[#899f94] mt-1">Mekânlarda check-in yaparak ve rozet kazanarak akışı başlatabilirsin.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3.5 rounded-[24px] p-4 transition border ${
                item.read
                  ? "bg-white border-[#e6ede8] opacity-90"
                  : "bg-[#f8fbf9] border-[#cbe1d3] shadow-[0_6px_20px_rgba(23,54,44,0.04)]"
              }`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#f0f5f2]">
                {getIcon(item.type, item.icon)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display text-sm font-extrabold text-[#17362c] truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-medium text-[#8da298] shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-[#527063] mt-0.5 leading-normal">
                  {item.message}
                </p>
              </div>

              {!item.read && (
                <span className="size-2 rounded-full bg-[#849f2b] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

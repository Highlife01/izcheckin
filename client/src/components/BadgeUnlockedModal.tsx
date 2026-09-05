import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy } from "lucide-react";

export const BadgeUnlockedModal: React.FC = () => {
  const { unlockedBadgeAlert, setUnlockedBadgeAlert } = useApp();

  if (!unlockedBadgeAlert) return null;

  return (
    <Dialog open={!!unlockedBadgeAlert} onOpenChange={(open) => !open && setUnlockedBadgeAlert(null)}>
      <DialogContent className="sm:max-w-[400px] rounded-[36px] p-6 text-center border-none bg-[#17362c] text-white shadow-[0_30px_90px_rgba(23,54,44,0.4)] overflow-hidden relative">
        {/* Dekoratif Işık Efekti */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-48 rounded-full bg-[#dfff62]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[#dfff62] text-4xl shadow-[0_12px_30px_rgba(223,255,98,0.35)] animate-bounce mb-4">
            {unlockedBadgeAlert.icon}
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#dfff62] mb-2">
            <Sparkles size={13} /> Yeni Rozet Açıldı!
          </div>

          <DialogTitle className="font-display text-2xl font-extrabold tracking-tight text-white mb-2">
            {unlockedBadgeAlert.title}
          </DialogTitle>

          <DialogDescription className="text-sm text-[#c5d8cf] px-4">
            {unlockedBadgeAlert.description}
          </DialogDescription>

          <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-3 text-xs font-semibold text-[#dfff62] flex items-center justify-center gap-2">
            <Trophy size={16} /> +50 Bonus Keşif Puanı Hesabına Eklendi!
          </div>

          <div className="mt-6">
            <Button
              onClick={() => setUnlockedBadgeAlert(null)}
              className="w-full rounded-2xl bg-[#dfff62] py-6 font-extrabold text-[#17362c] text-sm hover:bg-[#c9ea47] shadow-[0_10px_25px_rgba(223,255,98,0.3)]"
            >
              Harika, Devam Et!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

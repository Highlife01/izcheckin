import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Venue, 
  CheckInRecord, 
  Badge, 
  UserProfile, 
  ActivityNotification 
} from "@/types/venue";
import { 
  INITIAL_VENUES, 
  INITIAL_BADGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CHECKINS 
} from "@/data/venuesData";
import { toast } from "sonner";

interface AppContextType {
  venues: Venue[];
  user: UserProfile;
  checkins: CheckInRecord[];
  badges: Badge[];
  notifications: ActivityNotification[];
  favorites: number[];
  selectedVenue: Venue | null;
  setSelectedVenue: (venue: Venue | null) => void;
  checkInVenue: Venue | null;
  setCheckInVenue: (venue: Venue | null) => void;
  unlockedBadgeAlert: Badge | null;
  setUnlockedBadgeAlert: (badge: Badge | null) => void;
  toggleFavorite: (venueId: number) => void;
  isFavorite: (venueId: number) => boolean;
  performCheckIn: (venue: Venue, mood: string, note?: string) => { success: boolean; points: number; newBadge?: Badge };
  markAllNotificationsAsRead: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  VENUES: "izcheckin_venues_v1",
  USER: "izcheckin_user_v1",
  CHECKINS: "izcheckin_checkins_v1",
  BADGES: "izcheckin_badges_v1",
  NOTIFICATIONS: "izcheckin_notifs_v1",
  FAVORITES: "izcheckin_favorites_v1",
};

const DEFAULT_USER: UserProfile = {
  id: "user-cebrail-1",
  name: "Cebrail Kara",
  avatarText: "CK",
  avatarBg: "bg-[#deff55] text-[#17362c]",
  title: "Adana Şehir Kaşifi",
  level: 2,
  currentPoints: 125,
  nextLevelPoints: 200,
  totalCheckins: 2,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State from LocalStorage or Initial Data
  const [venues, setVenues] = useState<Venue[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VENUES);
      return saved ? JSON.parse(saved) : INITIAL_VENUES;
    } catch {
      return INITIAL_VENUES;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [checkins, setCheckins] = useState<CheckInRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CHECKINS);
      return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
    } catch {
      return INITIAL_CHECKINS;
    }
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BADGES);
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [1, 2];
    } catch {
      return [1, 2];
    }
  });

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [checkInVenue, setCheckInVenue] = useState<Venue | null>(null);
  const [unlockedBadgeAlert, setUnlockedBadgeAlert] = useState<Badge | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.VENUES, JSON.stringify(venues));
    } catch (e) { console.error(e); }
  }, [venues]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) { console.error(e); }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CHECKINS, JSON.stringify(checkins));
    } catch (e) { console.error(e); }
  }, [checkins]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch (e) { console.error(e); }
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) { console.error(e); }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) { console.error(e); }
  }, [favorites]);

  const toggleFavorite = (venueId: number) => {
    setFavorites(prev => {
      const exists = prev.includes(venueId);
      if (exists) {
        toast.info("Favorilerden çıkarıldı");
        return prev.filter(id => id !== venueId);
      } else {
        toast.success("Favorilere eklendi ❤️");
        return [...prev, venueId];
      }
    });
  };

  const isFavorite = (venueId: number) => favorites.includes(venueId);

  const performCheckIn = (venue: Venue, mood: string, note?: string) => {
    const pointsToAdd = 25;
    const newCheckIn: CheckInRecord = {
      id: `chk-${Date.now()}`,
      venueId: venue.id,
      venueName: venue.name,
      venueCategory: venue.category,
      district: venue.district,
      userName: user.name,
      userAvatar: user.avatarText,
      mood: mood || "☕ Takılıyorum",
      note: note || "",
      timestamp: new Date().toISOString(),
      pointsEarned: pointsToAdd,
    };

    const updatedCheckins = [newCheckIn, ...checkins];
    setCheckins(updatedCheckins);

    // 1. Update Venue check-in count and activity score
    setVenues(prev => prev.map(v => {
      if (v.id === venue.id) {
        const newScore = Math.min(100, v.activityScore + 4);
        return {
          ...v,
          checkinCount: v.checkinCount + 1,
          activityScore: newScore,
        };
      }
      return v;
    }));

    // 2. Check for badges unlocked
    let freshlyUnlockedBadge: Badge | undefined;
    const totalVenueCount = new Set(updatedCheckins.map(c => c.venueId)).size;
    const kebapCheckins = updatedCheckins.filter(c => c.venueCategory === "Kebap & Ocakbaşı").length;
    const coffeeCheckins = updatedCheckins.filter(c => c.venueCategory === "Kahve & Kafe").length;
    const sweetCheckins = updatedCheckins.filter(c => c.venueCategory === "Tatlı & Fırın").length;

    const updatedBadges = badges.map(badge => {
      if (badge.unlocked) return badge;

      let newProgress = badge.progress;
      let shouldUnlock = false;

      if (badge.id === "first_checkin") {
        newProgress = 1;
        shouldUnlock = true;
      } else if (badge.id === "kebap_guru") {
        newProgress = kebapCheckins;
        shouldUnlock = newProgress >= badge.maxProgress;
      } else if (badge.id === "coffee_holic") {
        newProgress = coffeeCheckins;
        shouldUnlock = newProgress >= badge.maxProgress;
      } else if (badge.id === "sweet_tooth") {
        newProgress = sweetCheckins;
        shouldUnlock = newProgress >= badge.maxProgress;
      } else if (badge.id === "adana_explorer") {
        newProgress = totalVenueCount;
        shouldUnlock = newProgress >= badge.maxProgress;
      }

      if (shouldUnlock) {
        const unlockedBadge: Badge = {
          ...badge,
          progress: badge.maxProgress,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
        freshlyUnlockedBadge = unlockedBadge;
        return unlockedBadge;
      }

      return { ...badge, progress: Math.min(newProgress, badge.maxProgress) };
    });

    setBadges(updatedBadges);

    // 3. Update User points, checkin count, level
    const newTotalPoints = user.currentPoints + pointsToAdd + (freshlyUnlockedBadge ? 50 : 0);
    const newCheckinsCount = user.totalCheckins + 1;
    let newLevel = user.level;
    let newNextLevelPoints = user.nextLevelPoints;
    let newTitle = user.title;

    if (newTotalPoints >= 350) {
      newLevel = 4;
      newNextLevelPoints = 600;
      newTitle = "Adana Muhtarı 👑";
    } else if (newTotalPoints >= 200) {
      newLevel = 3;
      newNextLevelPoints = 350;
      newTitle = "Kıdemli Kaşif 🌟";
    }

    setUser({
      ...user,
      currentPoints: newTotalPoints,
      totalCheckins: newCheckinsCount,
      level: newLevel,
      nextLevelPoints: newNextLevelPoints,
      title: newTitle,
    });

    // 4. Add Notification
    const newNotification: ActivityNotification = {
      id: `notif-${Date.now()}`,
      type: "checkin",
      title: `${venue.name} için check-in tamamlandı!`,
      message: `${mood} · +${pointsToAdd} puan kazandın.`,
      time: "Şimdi",
      icon: "📍",
      read: false,
    };

    if (freshlyUnlockedBadge) {
      const badgeNotif: ActivityNotification = {
        id: `notif-badge-${Date.now()}`,
        type: "badge",
        title: `Tebrikler! ${freshlyUnlockedBadge.title} rozetini açtın!`,
        message: `${freshlyUnlockedBadge.description} (+50 Puan)`,
        time: "Şimdi",
        icon: freshlyUnlockedBadge.icon,
        read: false,
      };
      setNotifications(prev => [badgeNotif, newNotification, ...prev]);
      setUnlockedBadgeAlert(freshlyUnlockedBadge);
    } else {
      setNotifications(prev => [newNotification, ...prev]);
    }

    return {
      success: true,
      points: pointsToAdd,
      newBadge: freshlyUnlockedBadge,
    };
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Tüm bildirimler okundu olarak işaretlendi");
  };

  return (
    <AppContext.Provider
      value={{
        venues,
        user,
        checkins,
        badges,
        notifications,
        favorites,
        selectedVenue,
        setSelectedVenue,
        checkInVenue,
        setCheckInVenue,
        unlockedBadgeAlert,
        setUnlockedBadgeAlert,
        toggleFavorite,
        isFavorite,
        performCheckIn,
        markAllNotificationsAsRead,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

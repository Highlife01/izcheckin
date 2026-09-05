import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Venue, 
  CheckInRecord, 
  Badge, 
  UserProfile, 
  ActivityNotification,
  Review,
  LeaderboardUser 
} from "@/types/venue";
import { 
  INITIAL_VENUES, 
  INITIAL_BADGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CHECKINS,
  INITIAL_REVIEWS,
  INITIAL_LEADERBOARD,
  POPULAR_CITIES 
} from "@/data/venuesData";
import { triggerConfetti } from "@/lib/confetti";
import { sound } from "@/lib/sound";
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
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isCityModalOpen: boolean;
  setIsCityModalOpen: (open: boolean) => void;
  isAIModalOpen: boolean;
  setIsAIModalOpen: (open: boolean) => void;
  isLeaderboardOpen: boolean;
  setIsLeaderboardOpen: (open: boolean) => void;
  reviews: Record<number, Review[]>;
  addReview: (venueId: number, rating: number, text: string, photoUrl?: string) => void;
  sendCheer: (venue: Venue, type: string) => void;
  leaderboardUsers: LeaderboardUser[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  VENUES: "izcheckin_venues_v2",
  USER: "izcheckin_user_v2",
  CHECKINS: "izcheckin_checkins_v2",
  BADGES: "izcheckin_badges_v2",
  NOTIFICATIONS: "izcheckin_notifs_v2",
  FAVORITES: "izcheckin_favorites_v2",
  CITY: "izcheckin_city_v2",
  REVIEWS: "izcheckin_reviews_v2",
};

const DEFAULT_USER: UserProfile = {
  id: "user-cebrail-1",
  name: "Cebrail Kara",
  avatarText: "CK",
  avatarBg: "bg-[#deff55] text-[#17362c]",
  title: "Türkiye Şehir Kaşifi",
  level: 2,
  currentPoints: 150,
  nextLevelPoints: 250,
  totalCheckins: 2,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venues, setVenues] = useState<Venue[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VENUES);
      return saved ? JSON.parse(saved) : INITIAL_VENUES;
    } catch {
      return INITIAL_VENUES;
    }
  });

  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CITY);
      return saved || "Tüm Türkiye";
    } catch {
      return "Tüm Türkiye";
    }
  });

  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CITY, city);
    } catch (e) { console.error(e); }
  };

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
      return saved ? JSON.parse(saved) : [101, 2];
    } catch {
      return [101, 2];
    }
  });

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [checkInVenue, setCheckInVenue] = useState<Venue | null>(null);
  const [unlockedBadgeAlert, setUnlockedBadgeAlert] = useState<Badge | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);

  const [reviews, setReviews] = useState<Record<number, Review[]>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

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

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) { console.error(e); }
  }, [reviews]);

  const addReview = (venueId: number, rating: number, text: string, photoUrl?: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      venueId,
      userName: user.name,
      userAvatar: user.avatarText,
      rating,
      text,
      photoUrl,
      timestamp: "Şimdi",
      likesCount: 0,
    };

    setReviews(prev => ({
      ...prev,
      [venueId]: [newRev, ...(prev[venueId] || [])],
    }));

    const pointsAward = 15;
    setUser(prev => ({
      ...prev,
      currentPoints: prev.currentPoints + pointsAward,
    }));

    const targetVenue = venues.find(v => v.id === venueId);
    setNotifications(prev => [
      {
        id: `notif-rev-${Date.now()}`,
        type: "checkin",
        title: `${targetVenue ? targetVenue.name : "Mekân"} için değerlendirmen paylaşıldı! ⭐`,
        message: `Topluluk katkısı için +${pointsAward} Keşif Puanı kazandın.`,
        time: "Şimdi",
        icon: "✍️",
        read: false,
      },
      ...prev,
    ]);

    sound.playSuccess();
    triggerConfetti();
    toast.success("Yorum ve puanınız paylaşıldı! +15 Keşif Puanı kazandınız 🎉");
  };

  const sendCheer = (venue: Venue, type: string) => {
    sound.playSuccess();
    triggerConfetti();
    toast.success(`${venue.name} masasına "${type}" jestiniz iletildi! 🥂`);
  };

  const leaderboardUsers: LeaderboardUser[] = React.useMemo(() => {
    const list = INITIAL_LEADERBOARD.map(u => {
      if (u.isCurrentUser) {
        return {
          ...u,
          name: user.name,
          avatarText: user.avatarText,
          avatarBg: user.avatarBg,
          points: user.currentPoints,
          checkins: user.totalCheckins,
          badgesCount: badges.filter(b => b.unlocked).length,
          title: user.title,
        };
      }
      return u;
    });
    return list.sort((a, b) => b.points - a.points).map((u, idx) => ({ ...u, rank: idx + 1 }));
  }, [user, badges]);

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
      district: `${venue.district}, ${venue.city}`,
      userName: user.name,
      userAvatar: user.avatarText,
      mood: mood || "☕ Takılıyorum",
      note: note || "",
      timestamp: new Date().toISOString(),
      pointsEarned: pointsToAdd,
    };

    const updatedCheckins = [newCheckIn, ...checkins];
    setCheckins(updatedCheckins);

    // 1. Update Venue checkin count & activity score
    setVenues(prev => prev.map(v => {
      if (v.id === venue.id) {
        const newScore = Math.min(100, v.activityScore + 3);
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
    const visitedCities = new Set(
      updatedCheckins.map(c => {
        const v = venues.find(item => item.id === c.venueId);
        return v ? v.city : venue.city;
      })
    ).size;

    const kebapCheckins = updatedCheckins.filter(c => c.venueCategory === "Kebap & Ocakbaşı").length;
    const coffeeCheckins = updatedCheckins.filter(c => c.venueCategory === "Kahve & Kafe").length;
    const sweetCheckins = updatedCheckins.filter(c => c.venueCategory === "Tatlı & Fırın").length;
    const coastCheckin = ["İstanbul", "İzmir", "Antalya"].includes(venue.city);

    const updatedBadges = badges.map(badge => {
      if (badge.unlocked) return badge;

      let newProgress = badge.progress;
      let shouldUnlock = false;

      if (badge.id === "first_checkin") {
        newProgress = 1;
        shouldUnlock = true;
      } else if (badge.id === "turkey_explorer") {
        newProgress = visitedCities;
        shouldUnlock = newProgress >= badge.maxProgress;
      } else if (badge.id === "kebap_guru") {
        newProgress = kebapCheckins;
        shouldUnlock = newProgress >= badge.maxProgress;
      } else if (badge.id === "coffee_holic") {
        newProgress = coffeeCheckins;
        shouldUnlock = newProgress >= badge.maxProgress;
      } else if (badge.id === "sweet_tooth") {
        newProgress = sweetCheckins;
        shouldUnlock = newProgress >= badge.maxProgress;
      } else if (badge.id === "bosphorus_coast") {
        if (coastCheckin) {
          newProgress = 1;
          shouldUnlock = true;
        }
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

    // 3. Update User stats
    const newTotalPoints = user.currentPoints + pointsToAdd + (freshlyUnlockedBadge ? 50 : 0);
    const newCheckinsCount = user.totalCheckins + 1;
    let newLevel = user.level;
    let newNextLevelPoints = user.nextLevelPoints;
    let newTitle = user.title;

    if (newTotalPoints >= 400) {
      newLevel = 4;
      newNextLevelPoints = 750;
      newTitle = "Türkiye Gezgini 👑";
    } else if (newTotalPoints >= 250) {
      newLevel = 3;
      newNextLevelPoints = 400;
      newTitle = "Milli Şehir Kaşifi 🌟";
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
      title: `${venue.name} (${venue.city}) için check-in tamamlandı!`,
      message: `${mood} · +${pointsToAdd} Keşif Puanı kazandın.`,
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

    // 5. Sound and Confetti effects
    triggerConfetti();
    if (freshlyUnlockedBadge) {
      sound.playBadgeFanfare();
    } else {
      sound.playSuccess();
    }

    // 6. Check for Venue Mayorship (Muhtarlık)
    const userVenueCheckins = updatedCheckins.filter(c => c.venueId === venue.id).length;
    if (userVenueCheckins >= 2) {
      setVenues(prev => prev.map(v => {
        if (v.id === venue.id) {
          return {
            ...v,
            mayor: {
              name: user.name,
              avatar: user.avatarText,
              checkinCount: userVenueCheckins,
              since: "Yeni Muhtar 👑",
            }
          };
        }
        return v;
      }));
      toast.success(`🏆 Tebrikler! ${venue.name} mekânının yeni MUHTARI oldun!`);
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
        selectedCity,
        setSelectedCity,
        isCityModalOpen,
        setIsCityModalOpen,
        isAIModalOpen,
        setIsAIModalOpen,
        isLeaderboardOpen,
        setIsLeaderboardOpen,
        reviews,
        addReview,
        sendCheer,
        leaderboardUsers,
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

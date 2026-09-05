export type VenueCategory = 
  | "Tümü"
  | "Kebap & Ocakbaşı"
  | "Kahve & Kafe"
  | "Restoran & Dünya"
  | "Bar & Gece Hayatı"
  | "Tatlı & Fırın";

export interface Venue {
  id: number;
  slug: string;
  name: string;
  category: VenueCategory;
  subcategory: string;
  address: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  ratingCount: number;
  checkinCount: number;
  activityScore: number; // 0 - 100
  priceRange: "₺" | "₺₺" | "₺₺₺" | "₺₺₺₺";
  openingHours: string;
  features: string[]; // Wi-Fi, Otopark, Açık Alan, Vale, Canlı Müzik vb.
  popularItems: string[];
  coverImageUrl?: string | null;
  phone?: string;
  instagram?: string;
  busynessHours?: number[]; // 24 saatlik yoğunluk oranları (0-100)
}

export interface CheckInRecord {
  id: string;
  venueId: number;
  venueName: string;
  venueCategory: VenueCategory;
  district: string;
  userName: string;
  userAvatar: string;
  mood: string;
  note?: string;
  timestamp: string; // ISO format
  pointsEarned: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "checkin" | "food" | "coffee" | "night" | "explorer";
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarText: string;
  avatarBg: string;
  title: string;
  level: number;
  currentPoints: number;
  nextLevelPoints: number;
  totalCheckins: number;
}

export interface ActivityNotification {
  id: string;
  type: "checkin" | "badge" | "trend" | "social";
  title: string;
  message: string;
  time: string;
  icon: string;
  read: boolean;
}

import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { checkins, InsertUser, users, venues } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export type VenueSummary = {
  id: number;
  slug: string;
  name: string;
  category: string;
  address: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  ratingCount: number;
  checkinCount: number;
  activityScore: number;
  coverImageUrl: string | null;
};

const fallbackVenues: VenueSummary[] = [
  { id: 1, slug: "ziyapasa-kahve-adana", name: "Ziyapaşa Kahve", category: "Kahve", address: "Ziyapaşa Blv. 32, Seyhan", district: "Seyhan", city: "Adana", latitude: 37.0004, longitude: 35.3213, rating: 4.8, ratingCount: 824, checkinCount: 2140, activityScore: 86, coverImageUrl: null },
  { id: 2, slug: "kebapci-musa-adana", name: "Kebapçı Musa", category: "Restoran", address: "Tepebağ Mah. 14, Seyhan", district: "Seyhan", city: "Adana", latitude: 37.0018, longitude: 35.3275, rating: 4.6, ratingCount: 516, checkinCount: 1320, activityScore: 72, coverImageUrl: null },
  { id: 3, slug: "arka-sokak-bar", name: "Arka Sokak", category: "Bar", address: "Kurtuluş Cad. 9, Seyhan", district: "Seyhan", city: "Adana", latitude: 37.0051, longitude: 35.3181, rating: 4.7, ratingCount: 301, checkinCount: 980, activityScore: 94, coverImageUrl: null },
  { id: 4, slug: "merkez-coffee-roasters", name: "Merkez Coffee Roasters", category: "Kahve", address: "Gazipaşa Bulvarı 80, Çukurova", district: "Çukurova", city: "Adana", latitude: 37.0268, longitude: 35.2924, rating: 4.9, ratingCount: 412, checkinCount: 875, activityScore: 58, coverImageUrl: null },
  { id: 5, slug: "sahil-yolu", name: "Sahil Yolu", category: "Gezilecek Yer", address: "Seyhan Nehri kıyısı", district: "Seyhan", city: "Adana", latitude: 36.9912, longitude: 35.3258, rating: 4.5, ratingCount: 129, checkinCount: 640, activityScore: 43, coverImageUrl: null },
];

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

function fallbackFilter(query?: string, category?: string) {
  const normalized = query?.trim().toLocaleLowerCase("tr-TR");
  return fallbackVenues.filter(venue => {
    const matchesCategory = !category || category === "Tümü" || venue.category === category;
    const haystack = `${venue.name} ${venue.category} ${venue.address} ${venue.district}`.toLocaleLowerCase("tr-TR");
    return matchesCategory && (!normalized || haystack.includes(normalized));
  });
}

export async function getVenues(params: { query?: string; category?: string } = {}): Promise<VenueSummary[]> {
  const db = await getDb();
  if (!db) return fallbackFilter(params.query, params.category);

  const conditions = [];
  if (params.category && params.category !== "Tümü") conditions.push(eq(venues.category, params.category));
  if (params.query?.trim()) {
    const term = `%${params.query.trim()}%`;
    conditions.push(or(like(venues.name, term), like(venues.category, term), like(venues.address, term), like(venues.district, term)));
  }
  const rows = await db.select({
    id: venues.id, slug: venues.slug, name: venues.name, category: venues.category,
    address: venues.address, district: venues.district, city: venues.city,
    latitude: venues.latitude, longitude: venues.longitude, rating: venues.rating,
    ratingCount: venues.ratingCount, checkinCount: venues.checkinCount,
    activityScore: venues.activityScore, coverImageUrl: venues.coverImageUrl,
  }).from(venues).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(venues.activityScore), desc(venues.rating));
  return rows.length ? rows : fallbackFilter(params.query, params.category);
}

export async function getVenueBySlug(slug: string): Promise<VenueSummary | undefined> {
  const db = await getDb();
  if (!db) return fallbackVenues.find(venue => venue.slug === slug);
  const result = await db.select({
    id: venues.id, slug: venues.slug, name: venues.name, category: venues.category,
    address: venues.address, district: venues.district, city: venues.city,
    latitude: venues.latitude, longitude: venues.longitude, rating: venues.rating,
    ratingCount: venues.ratingCount, checkinCount: venues.checkinCount,
    activityScore: venues.activityScore, coverImageUrl: venues.coverImageUrl,
  }).from(venues).where(eq(venues.slug, slug)).limit(1);
  return result[0] ?? fallbackVenues.find(venue => venue.slug === slug);
}

export function distanceInMeters(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const earthRadius = 6_371_000;
  const toRadians = (value: number) => value * Math.PI / 180;
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const a = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(deltaLongitude / 2) ** 2;
  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function createCheckin(input: {
  userId: number;
  venueId: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  visibility: "public" | "friends" | "private";
  text?: string;
  mood?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const venue = await db.select().from(venues).where(eq(venues.id, input.venueId)).limit(1);
  if (!venue[0]) throw new Error("Venue not found");

  const distance = distanceInMeters(
    { latitude: input.latitude, longitude: input.longitude },
    { latitude: venue[0].latitude, longitude: venue[0].longitude },
  );
  const reportedAccuracy = Number.isFinite(input.accuracy) ? Math.max(0, input.accuracy ?? 0) : 0;
  const allowedDistance = Math.min(400, 250 + Math.min(reportedAccuracy, 150));
  if (distance > allowedDistance) {
    throw new Error(`Bu mekânda check-in yapabilmek için ${Math.round(distance)} m daha yaklaşmalısın.`);
  }

  const { accuracy: _accuracy, ...checkinValues } = input;
  const inserted = await db.insert(checkins).values(checkinValues);
  await db.update(venues).set({
    checkinCount: sql`${venues.checkinCount} + 1`,
    activityScore: sql`LEAST(100, ${venues.activityScore} + 4)`,
    updatedAt: new Date(),
  }).where(eq(venues.id, input.venueId));
  return { id: Number(inserted[0].insertId), venue: venue[0] };
}

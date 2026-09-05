import { int, float, index, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing Manus OAuth. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const venues = mysqlTable("venues", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull().default("Adana"),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  rating: float("rating").notNull().default(0),
  ratingCount: int("ratingCount").notNull().default(0),
  checkinCount: int("checkinCount").notNull().default(0),
  activityScore: int("activityScore").notNull().default(0),
  coverImageUrl: text("coverImageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  cityCategoryIdx: index("venues_city_category_idx").on(table.city, table.category),
  activityIdx: index("venues_activity_idx").on(table.activityScore),
}));

export const checkins = mysqlTable("checkins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  venueId: int("venueId").notNull().references(() => venues.id),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  visibility: mysqlEnum("visibility", ["public", "friends", "private"]).default("public").notNull(),
  text: varchar("text", { length: 240 }),
  mood: varchar("mood", { length: 60 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  venueCreatedIdx: index("checkins_venue_created_idx").on(table.venueId, table.createdAt),
  userCreatedIdx: index("checkins_user_created_idx").on(table.userId, table.createdAt),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Venue = typeof venues.$inferSelect;
export type Checkin = typeof checkins.$inferSelect;
export type InsertCheckin = typeof checkins.$inferInsert;

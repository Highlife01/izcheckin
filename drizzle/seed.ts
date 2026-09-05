import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { venues } from "./schema";
import { INITIAL_VENUES } from "../client/src/data/venuesData";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("ℹ️ DATABASE_URL tanımlı değil, seed işlemi simülasyon olarak tamamlandı.");
    console.log(`✅ ${INITIAL_VENUES.length} mekân hafızada hazır.`);
    process.exit(0);
  }

  console.log("🌱 Veritabanına mekân seed işlemi başlatılıyor...");
  const connection = await mysql.createConnection(databaseUrl);
  const db = drizzle(connection);

  let insertedCount = 0;
  for (const v of INITIAL_VENUES) {
    try {
      await db.insert(venues).values({
        id: v.id,
        slug: v.slug,
        name: v.name,
        category: v.category,
        address: v.address,
        district: v.district,
        city: v.city,
        latitude: v.latitude,
        longitude: v.longitude,
        rating: v.rating,
        ratingCount: v.ratingCount,
        checkinCount: v.checkinCount,
        activityScore: v.activityScore,
        coverImageUrl: v.coverImageUrl || null,
      }).onDuplicateKeyUpdate({
        set: {
          name: v.name,
          category: v.category,
          address: v.address,
          district: v.district,
          city: v.city,
          latitude: v.latitude,
          longitude: v.longitude,
          rating: v.rating,
          ratingCount: v.ratingCount,
          checkinCount: v.checkinCount,
          activityScore: v.activityScore,
          updatedAt: new Date(),
        },
      });
      insertedCount++;
    } catch (e) {
      console.warn(`⚠️ ${v.name} eklenirken hata:`, e);
    }
  }

  console.log(`✨ Başarıyla ${insertedCount} / ${INITIAL_VENUES.length} mekân veritabanına aktarıldı/güncellendi.`);
  await connection.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed işlemi başarısız:", err);
  process.exit(1);
});

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { distanceInMeters } from "./db";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("venue discovery", () => {
  it("returns nearby venues for the default feed", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const venues = await caller.venue.list({ category: "Tümü" });

    expect(venues.length).toBeGreaterThanOrEqual(3);
    expect(venues[0]).toMatchObject({ city: "Adana" });
    expect(venues.some(venue => venue.activityScore >= 90)).toBe(true);
  });

  it("filters the feed by category and resolves a venue slug", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const coffeeVenues = await caller.venue.list({ category: "Kahve" });
    const venue = await caller.venue.bySlug({ slug: "ziyapasa-kahve-adana" });

    expect(coffeeVenues.every(item => item.category === "Kahve")).toBe(true);
    expect(venue?.name).toBe("Ziyapaşa Kahve");
  });

  it("calculates a short walking-scale distance between coordinates", () => {
    const distance = distanceInMeters(
      { latitude: 37.0004, longitude: 35.3213 },
      { latitude: 37.0018, longitude: 35.3275 },
    );

    expect(distance).toBeGreaterThan(500);
    expect(distance).toBeLessThan(650);
  });
});

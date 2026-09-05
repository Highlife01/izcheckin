import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createCheckin, getVenueBySlug, getVenues } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  venue: router({
    list: publicProcedure
      .input(z.object({ query: z.string().optional(), category: z.string().optional() }).optional())
      .query(({ input }) => getVenues(input ?? {})),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(({ input }) => getVenueBySlug(input.slug)),
  }),
  checkin: router({
    create: protectedProcedure
      .input(z.object({
        venueId: z.number().int().positive(),
        latitude: z.number(),
        longitude: z.number(),
        accuracy: z.number().nonnegative().max(500).optional(),
        visibility: z.enum(["public", "friends", "private"]).default("public"),
        text: z.string().max(240).optional(),
        mood: z.string().max(60).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await createCheckin({ userId: ctx.user.id, ...input });
        return { success: true as const, checkinId: result.id, venueName: result.venue.name };
      }),
  }),
});

export type AppRouter = typeof appRouter;

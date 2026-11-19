import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const cocoxIpaDownloadCountsTable = pgTable(
  "cocox_ipa_download_counts",
  {
    id: integer("id").primaryKey(),
    count: integer("count").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
);

export const insertCocoXIpaDownloadCountSchema = createInsertSchema(
  cocoxIpaDownloadCountsTable,
).omit({ updatedAt: true });

export type InsertCocoXIpaDownloadCount = z.infer<
  typeof insertCocoXIpaDownloadCountSchema
>;
export type CocoXIpaDownloadCount =
  typeof cocoxIpaDownloadCountsTable.$inferSelect;

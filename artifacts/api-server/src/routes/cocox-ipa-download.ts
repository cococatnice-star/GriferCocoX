import { Router, type IRouter } from "express";
import { db, cocoxIpaDownloadCountsTable } from "@workspace/db";
import {
  GetCocoXIpaDownloadCountResponse,
  RecordCocoXIpaDownloadResponse,
} from "@workspace/api-zod";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();
const cocoXIpaDownloadCounterId = 1;
const initialCocoXIpaDownloadCount = 20_588;

router.get("/cocox-ipa-download-count", async (_req, res): Promise<void> => {
  const [created] = await db
    .insert(cocoxIpaDownloadCountsTable)
    .values({
      id: cocoXIpaDownloadCounterId,
      count: initialCocoXIpaDownloadCount,
      updatedAt: new Date(),
    })
    .onConflictDoNothing()
    .returning({ count: cocoxIpaDownloadCountsTable.count });

  const [counter] = created
    ? [created]
    : await db
        .select({ count: cocoxIpaDownloadCountsTable.count })
        .from(cocoxIpaDownloadCountsTable)
        .where(eq(cocoxIpaDownloadCountsTable.id, cocoXIpaDownloadCounterId))
        .limit(1);

  res.json(
    GetCocoXIpaDownloadCountResponse.parse({
      count: counter?.count ?? initialCocoXIpaDownloadCount,
    }),
  );
});

router.post(
  "/cocox-ipa-download-count",
  async (_req, res): Promise<void> => {
    const [counter] = await db
      .insert(cocoxIpaDownloadCountsTable)
      .values({
        id: cocoXIpaDownloadCounterId,
        count: initialCocoXIpaDownloadCount + 1,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: cocoxIpaDownloadCountsTable.id,
        set: {
          count: sql`${cocoxIpaDownloadCountsTable.count} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning({ count: cocoxIpaDownloadCountsTable.count });

    res.json(
      RecordCocoXIpaDownloadResponse.parse({
        count: counter?.count ?? 1,
      }),
    );
  },
);

export default router;

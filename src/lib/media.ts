import { getDb } from "./db";

export interface MediaAsset {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  data: string; // base64
  createdAt: string;
}

// In-memory fallback for local development without DB
const inMemoryMedia = new Map<string, { buffer: Buffer; mimeType: string; filename: string }>();

let tableInitialized = false;

export async function ensureMediaTable() {
  if (tableInitialized) return;
  const sql = getDb();
  if (!sql) {
    tableInitialized = true;
    return;
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS studio_media (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        data TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    tableInitialized = true;
  } catch (err) {
    console.error("Failed to initialize studio_media table in Neon:", err);
  }
}

export async function saveMedia({
  filename,
  mimeType,
  buffer,
}: {
  filename: string;
  mimeType: string;
  buffer: Buffer;
}): Promise<{ id: string; url: string; filename: string; size: number }> {
  await ensureMediaTable();

  // Generate safe unique ID
  const cleanName = filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const ext = cleanName.split(".").pop() || "png";
  const id = `media_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const base64Data = buffer.toString("base64");
  const sql = getDb();

  if (sql) {
    try {
      await sql`
        INSERT INTO studio_media (id, filename, mime_type, size_bytes, data, created_at)
        VALUES (${id}, ${filename}, ${mimeType}, ${buffer.length}, ${base64Data}, NOW())
      `;
    } catch (err) {
      console.error("Error saving media to Neon database, using memory fallback:", err);
      inMemoryMedia.set(id, { buffer, mimeType, filename });
    }
  } else {
    inMemoryMedia.set(id, { buffer, mimeType, filename });
  }

  const url = `/api/studio/media/${id}`;
  return { id, url, filename, size: buffer.length };
}

export async function getMedia(
  id: string
): Promise<{ buffer: Buffer; mimeType: string; filename: string } | null> {
  // Check in-memory first
  if (inMemoryMedia.has(id)) {
    return inMemoryMedia.get(id)!;
  }

  await ensureMediaTable();
  const sql = getDb();
  if (!sql) return null;

  try {
    const rows = (await sql`
      SELECT filename, mime_type, data
      FROM studio_media
      WHERE id = ${id}
      LIMIT 1
    `) as any[];

    if (!rows || rows.length === 0) {
      return null;
    }

    const row = rows[0];
    const buffer = Buffer.from(row.data, "base64");
    return {
      buffer,
      mimeType: row.mime_type,
      filename: row.filename,
    };
  } catch (err) {
    console.error("Error fetching media from Neon database:", err);
    return null;
  }
}

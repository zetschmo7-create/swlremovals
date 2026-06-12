/**
 * Minimal Vercel KV / Upstash Redis REST client (no extra dependency).
 * Auto-configured when a KV database is linked to the Vercel project.
 */

async function kvCommand<T>(command: unknown[]): Promise<T | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`KV request failed (${res.status})`);
  }

  const data = (await res.json()) as { result?: T };
  return data.result ?? null;
}

export function isKvStorageReady(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function kvGet<T>(key: string): Promise<T | null> {
  return kvCommand<T>(["GET", key]);
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  if (!isKvStorageReady()) {
    throw new Error(
      "Vercel KV is not linked. Add a KV database to this Vercel project."
    );
  }
  const serialized =
    typeof value === "string" ? value : JSON.stringify(value);
  await kvCommand<string>(["SET", key, serialized]);
}

export async function kvDel(key: string): Promise<void> {
  await kvCommand(["DEL", key]);
}

import { kvGet, kvSet, isKvStorageReady } from "./kv-client";

const SETTINGS_KEY = "jarvis:settings";

export type JarvisSettings = {
  commissionPercent: number;
  leadProviderName: string;
  costPerLead: number;
};

export const DEFAULT_JARVIS_SETTINGS: JarvisSettings = {
  commissionPercent: 10,
  leadProviderName: "Compare My Move",
  costPerLead: 10.95,
};

export async function getJarvisSettings(): Promise<JarvisSettings> {
  if (!isKvStorageReady()) return { ...DEFAULT_JARVIS_SETTINGS };
  const stored = await kvGet<JarvisSettings | string>(SETTINGS_KEY);
  if (!stored) return { ...DEFAULT_JARVIS_SETTINGS };
  const parsed =
    typeof stored === "string"
      ? (JSON.parse(stored) as JarvisSettings)
      : stored;
  return { ...DEFAULT_JARVIS_SETTINGS, ...parsed };
}

export async function saveJarvisSettings(
  settings: Partial<JarvisSettings>
): Promise<JarvisSettings> {
  const current = await getJarvisSettings();
  const next: JarvisSettings = {
    commissionPercent:
      settings.commissionPercent ?? current.commissionPercent,
    leadProviderName:
      settings.leadProviderName ?? current.leadProviderName,
    costPerLead: settings.costPerLead ?? current.costPerLead,
  };
  if (!isKvStorageReady()) {
    throw new Error("Vercel KV is required to save Jarvis settings.");
  }
  await kvSet(SETTINGS_KEY, next);
  return next;
}

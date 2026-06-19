import { readFileSync, existsSync, statSync } from "fs";
import { join } from "path";
import type { SalesGptIntent } from "./types";

const PLAYBOOK_PATH = join(process.cwd(), "docs/jarvis-sales-gpt-playbook.md");

export type PlaybookSection = {
  title: string;
  slug: string;
  content: string;
};

export type SalesPlaybook = {
  loaded: boolean;
  rawContent: string;
  sections: PlaybookSection[];
  loadedAt: string;
};

let cached: SalesPlaybook | null = null;
let cachedMtime = 0;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSections(markdown: string): PlaybookSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: PlaybookSection[] = [];
  let currentTitle: string | null = null;
  let currentLines: string[] = [];

  const flush = () => {
    if (!currentTitle) return;
    const content = currentLines.join("\n").trim();
    if (content.length > 0) {
      sections.push({
        title: currentTitle,
        slug: slugify(currentTitle),
        content,
      });
    }
  };

  for (const line of lines) {
    const heading = line.match(/^#{1,2}\s+(.+)$/);
    if (heading) {
      flush();
      currentTitle = heading[1].trim();
      currentLines = [];
      continue;
    }
    if (currentTitle) currentLines.push(line);
  }
  flush();

  return sections;
}

export function loadSalesPlaybook(): SalesPlaybook {
  if (!existsSync(PLAYBOOK_PATH)) {
    return {
      loaded: false,
      rawContent: "",
      sections: [],
      loadedAt: new Date().toISOString(),
    };
  }

  const mtime = statSync(PLAYBOOK_PATH).mtimeMs;
  if (cached && cachedMtime === mtime) return cached;

  const rawContent = readFileSync(PLAYBOOK_PATH, "utf8");
  const sections = parseSections(rawContent);
  const hasContent =
    sections.length > 0 ||
    rawContent.replace(/<!--[\s\S]*?-->/g, "").trim().length > 200;

  cached = {
    loaded: hasContent,
    rawContent,
    sections,
    loadedAt: new Date().toISOString(),
  };
  cachedMtime = mtime;
  return cached;
}

const INTENT_SECTION_KEYWORDS: Record<
  SalesGptIntent,
  string[]
> = {
  call_script: ["call", "phone", "new lead", "opener", "script"],
  sms: ["sms", "text message", "text"],
  email: ["email", "e-mail"],
  objection: ["objection", "objections", "handle", "expensive", "cheaper"],
  survey_pitch: ["survey", "book survey", "booking survey"],
  deposit_chase: ["deposit", "payment", "chase", "date confirmation", "receipt"],
  follow_up: ["follow up", "follow-up", "followup", "quote follow", "grahame"],
  freeform: ["brand", "voice", "tone", "general", "overview"],
};

function scoreSection(section: PlaybookSection, keywords: string[]): number {
  const haystack = `${section.title} ${section.content}`.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (section.title.toLowerCase().includes(kw)) score += 3;
    if (haystack.includes(kw)) score += 1;
  }
  return score;
}

export function getPlaybookSectionsForIntent(
  intent: SalesGptIntent,
  maxSections = 4
): PlaybookSection[] {
  const playbook = loadSalesPlaybook();
  if (!playbook.loaded || playbook.sections.length === 0) {
    return [];
  }

  const keywords = INTENT_SECTION_KEYWORDS[intent];
  const ranked = [...playbook.sections]
    .map((section) => ({ section, score: scoreSection(section, keywords) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length > 0) {
    return ranked.slice(0, maxSections).map((r) => r.section);
  }

  if (intent === "freeform") {
    return playbook.sections.slice(0, maxSections);
  }

  return playbook.sections.slice(0, Math.min(2, maxSections));
}

export function formatPlaybookExcerpt(sections: PlaybookSection[]): string {
  if (sections.length === 0) return "";
  return sections
    .map((s) => `### ${s.title}\n${s.content}`)
    .join("\n\n");
}

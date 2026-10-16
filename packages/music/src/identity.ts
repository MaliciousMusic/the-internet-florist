import { freezeRecipe, type Recipe } from "./model.ts";

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
      .map(([key, entry]) => [key, canonical(entry)]));
  }
  return value;
}

/** Diagnostic sound commitment; the future chain codec remains a separate P1 deliverable. */
export async function recipeHash(recipe: Recipe): Promise<string> {
  const frozen = freezeRecipe(recipe);
  const stems = [...frozen.stems].sort((a, b) => BigInt(a.id) < BigInt(b.id) ? -1 : BigInt(a.id) > BigInt(b.id) ? 1 : 0);
  const bytes = new TextEncoder().encode(JSON.stringify(canonical({ ...frozen, stems })));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return "0x" + Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

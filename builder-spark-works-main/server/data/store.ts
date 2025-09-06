import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "server", "data");

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  await ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  try {
    const txt = await fs.readFile(file, "utf-8");
    return JSON.parse(txt) as T;
  } catch {
    await fs.writeFile(file, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

export async function writeJson<T>(name: string, data: T): Promise<void> {
  await ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

export function nowISO() {
  return new Date().toISOString();
}

export function newId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

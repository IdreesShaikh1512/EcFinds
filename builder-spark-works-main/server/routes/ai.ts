import { Router, RequestHandler } from "express";
import type {
  AIPriceSuggestRequest,
  AIPriceSuggestResponse,
  Category,
} from "@shared/api";

export const aiRouter = Router();

const baselineMarket: Record<Category, number> = {
  Electronics: 120,
  Fashion: 40,
  Home: 80,
  Books: 12,
  Sports: 70,
  Kids: 35,
  Other: 50,
};

function estimateMarketPrice(category: Category, title: string): number {
  const base = baselineMarket[category] || 50;
  let multiplier = 1;
  const t = title.toLowerCase();
  if (/(pro|max|ultra)/.test(t)) multiplier += 0.4;
  if (/(mini|lite|basic)/.test(t)) multiplier -= 0.1;
  if (/(bundle|set|pack)/.test(t)) multiplier += 0.15;
  return Math.max(5, Math.round(base * multiplier));
}

function estimateSustainability(listedPrice: number): {
  carbonKg: number;
  timeHours: number;
  wasteKg: number;
} {
  const avgTripKm = 10; // round-trip
  const carKgPerKm = 0.12; // kg CO2 per km
  const carbonKg = +(avgTripKm * carKgPerKm).toFixed(2);
  const timeHours = 1; // avg trip & browsing
  const wasteKg = +(Math.min(2, listedPrice / 100) * 1.2).toFixed(2);
  return { carbonKg, timeHours, wasteKg };
}

aiRouter.post("/price-suggest", (async (req, res) => {
  const body = req.body as AIPriceSuggestRequest;
  if (!body?.title || !body?.category || typeof body.listedPrice !== "number") {
    return res
      .status(400)
      .json({ error: "title, category, listedPrice required" });
  }
  const market = estimateMarketPrice(body.category, body.title);
  const qualityAdj = Math.max(0.4, Math.min(1, body.quality || 0.7));
  const fair = Math.round(market * qualityAdj * 100) / 100;
  const savings = estimateSustainability(body.listedPrice);
  const resp: AIPriceSuggestResponse = {
    fairPrice: fair,
    marketPrice: market,
    qualityAdjusted: qualityAdj,
    savings,
    rationale: `Baseline ${market} adjusted by quality factor ${qualityAdj} and title signals.`,
  };
  res.json(resp);
}) as RequestHandler);

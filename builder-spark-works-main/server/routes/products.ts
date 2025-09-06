import { Router, RequestHandler } from "express";
import { readJson, writeJson, newId, nowISO } from "../data/store";
import { requireAuth } from "./auth";
import type {
  CreateProductRequest,
  Product,
  ProductQuery,
  UpdateProductRequest,
  Category,
} from "@shared/api";

const productsKey = "products";

async function getProducts(): Promise<Product[]> {
  return readJson<Product[]>(productsKey, []);
}
async function saveProducts(products: Product[]) {
  return writeJson(productsKey, products);
}

export const productsRouter = Router();

productsRouter.get("/", (async (req, res) => {
  const { q, category } = req.query as any as ProductQuery;
  const list = await getProducts();
  let out = list;
  if (category) out = out.filter((p) => p.category === category);
  if (q) {
    const term = q.toLowerCase();
    out = out.filter((p) => p.title.toLowerCase().includes(term));
  }
  out = out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.json(out);
}) as RequestHandler);

productsRouter.get("/:id", (async (req, res) => {
  const list = await getProducts();
  const found = list.find((p) => p.id === req.params.id);
  if (!found) return res.status(404).json({ error: "Not found" });
  res.json(found);
}) as RequestHandler);

productsRouter.post("/", requireAuth, (async (req, res) => {
  const body = req.body as CreateProductRequest;
  if (
    !body.title ||
    !body.description ||
    !body.category ||
    typeof body.price !== "number"
  ) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const ownerId = (req as any).userId as string;
  const product: Product = {
    id: newId("prd"),
    ownerId,
    title: body.title,
    description: body.description,
    category: body.category as Category,
    price: Math.max(0, Math.round(body.price * 100) / 100),
    imageUrl: body.imageUrl || "/placeholder.svg",
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  const list = await getProducts();
  list.push(product);
  await saveProducts(list);
  res.status(201).json(product);
}) as RequestHandler);

productsRouter.put("/:id", requireAuth, (async (req, res) => {
  const id = req.params.id;
  const userId = (req as any).userId as string;
  const body = req.body as UpdateProductRequest;
  const list = await getProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  if (list[idx].ownerId !== userId)
    return res.status(403).json({ error: "Forbidden" });
  const updated: Product = {
    ...list[idx],
    ...body,
    price:
      body.price !== undefined
        ? Math.max(0, Math.round(body.price * 100) / 100)
        : list[idx].price,
    updatedAt: nowISO(),
  };
  list[idx] = updated;
  await saveProducts(list);
  res.json(updated);
}) as RequestHandler);

productsRouter.delete("/:id", requireAuth, (async (req, res) => {
  const id = req.params.id;
  const userId = (req as any).userId as string;
  const list = await getProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  if (list[idx].ownerId !== userId)
    return res.status(403).json({ error: "Forbidden" });
  const removed = list.splice(idx, 1)[0];
  await saveProducts(list);
  res.json({ ok: true, removed });
}) as RequestHandler);

import { Router, RequestHandler } from "express";
import { readJson } from "../data/store";
import type { User } from "@shared/api";

const usersKey = "users";

async function getUsers(): Promise<User[]> {
  return readJson<User[]>(usersKey, []);
}

export const usersRouter = Router();

usersRouter.get("/:id", (async (req, res) => {
  const { id } = req.params;
  const users = await getUsers();
  const found = users.find((u) => u.id === id);
  if (!found) return res.status(404).json({ error: "User not found" });
  
  // Remove password hash from response
  const { passwordHash, ...publicUser } = found as any;
  res.json(publicUser);
}) as RequestHandler);



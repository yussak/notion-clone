import { Request, Response } from "express";
import client = require("../generated/prisma/client");

const prisma = new client.PrismaClient();

export const createPage = async (req: Request, res: Response) => {
  const page = await prisma.page.create({
    data: {},
  });

  res.json({ id: page.id });
};

import { Request, Response } from 'express';
import client = require('../generated/prisma/client');

const prisma = new client.PrismaClient();

export const createPage = async (req: Request, res: Response) => {
  const a = await prisma.page.create({
    data: {}
  });

  const createdId = a.id;

  res.json({ id: createdId });
};


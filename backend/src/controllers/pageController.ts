import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPage = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Page ID is required" });
  }

  const page = await prisma.page.findUnique({
    where: { id: req.params.id },
    include: {
      blocks: {
        orderBy: { position: "asc" },
      },
    },
  });

  res.json(page);
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.create({
      data: {},
    });

    res.json({ id: page.id });
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// MEMO: 一旦pageに書いてる
export const createBlocks = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const { type, content, position } = req.body;

    if (!pageId) {
      return res.status(400).json({ error: "Page ID is required" });
    }

    const block = await prisma.block.create({
      data: {
        pageId,
        type,
        content,
        position: position ?? 0,
        parentId: parentId ?? null,
        indentLevel: indentLevel ?? 0,
      },
    });

    res.status(201).json(block);
  } catch (error) {
    console.error("Error creating block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// MEMO: 一旦pageに書いてる
export const updateBlocks = async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const { type, content, position } = req.body;

    if (!blockId) {
      return res.status(400).json({ error: "Block ID is required" });
    }

    const block = await prisma.block.update({
      where: { id: blockId },
      data: {
        type,
        content,
        position: position ?? 0,
      },
    });

    res.status(201).json(block);
  } catch (error) {
    console.error("Error updating block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// MEMO: 一旦pageに書いてる
export const deleteBlock = async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;

    if (!blockId) {
      return res.status(400).json({ error: "Block ID is required" });
    }

    await prisma.block.delete({
      where: { id: blockId },
    });

    res.status(200).json({ message: "Block deleted successfully" });
  } catch (error) {
    console.error("Error deleting block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

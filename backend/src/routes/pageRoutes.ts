import { Router } from "express";
import {
  createPage,
  createBlocks,
  updateBlocks,
  deleteBlock,
  getPage,
} from "../controllers/pageController.js";

const pagesRouter = Router();

pagesRouter.post("/pages", createPage);

// MEMO:一旦pageに書いてる
pagesRouter.post("/pages/:pageId/blocks", createBlocks);
pagesRouter.put("/blocks/:blockId", updateBlocks);
pagesRouter.delete("/blocks/:blockId", deleteBlock);
pagesRouter.get("/pages/:id", getPage);

export default pagesRouter;

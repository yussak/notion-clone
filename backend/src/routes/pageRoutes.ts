import { Router } from "express";
import { createPage, createBlocks } from "../controllers/pageController";

const pagesRouter = Router();

pagesRouter.post("/pages", createPage);

// MEMO:一旦pageに書いてる
pagesRouter.post("/pages/:pageId/blocks", createBlocks);

export default pagesRouter;

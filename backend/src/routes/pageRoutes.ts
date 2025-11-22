import { Router } from "express";
  getPage,
} from "../controllers/pageController";

const pagesRouter = Router();

pagesRouter.post("/pages", createPage);

// MEMO:一旦pageに書いてる
pagesRouter.post("/pages/:pageId/blocks", createBlocks);
pagesRouter.get("/pages/:id", getPage);

export default pagesRouter;

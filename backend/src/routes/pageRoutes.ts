import { Router } from 'express';
import { createPage } from '../controllers/pageController';

const pagesRouter = Router();

pagesRouter.post('/pages', createPage);

export default pagesRouter;
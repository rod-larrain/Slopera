import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sloperaRouter from "./slopera";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sloperaRouter);

export default router;

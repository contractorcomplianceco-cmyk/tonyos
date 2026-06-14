import { Router, type IRouter } from "express";
import healthRouter from "./health";
import executiveRouter from "./executive";
import strategyRouter from "./strategy";
import decisionsRouter from "./decisions";
import financialRouter from "./financial";
import strategyDetailRouter from "./strategy-detail";
import reviewsRouter from "./reviews";

const router: IRouter = Router();

router.use(healthRouter);
router.use(executiveRouter);
router.use(strategyRouter);
router.use(decisionsRouter);
router.use(financialRouter);
router.use(strategyDetailRouter);
router.use(reviewsRouter);

export default router;

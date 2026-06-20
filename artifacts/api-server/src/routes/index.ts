import { Router, type IRouter } from "express";
import healthRouter from "./health";
import executiveRouter from "./executive";
import strategyRouter from "./strategy";
import decisionsRouter from "./decisions";
import financialRouter from "./financial";
import strategyDetailRouter from "./strategy-detail";
import reviewsRouter from "./reviews";
import brandsRouter from "./brands";
import departmentsRouter from "./departments";
import projectsRouter from "./projects";
import predictorsRouter from "./predictors";
import reviewersRouter from "./reviewers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(executiveRouter);
router.use(strategyRouter);
router.use(decisionsRouter);
router.use(financialRouter);
router.use(strategyDetailRouter);
router.use(reviewsRouter);
router.use(brandsRouter);
router.use(departmentsRouter);
router.use(projectsRouter);
router.use(predictorsRouter);
router.use(reviewersRouter);

export default router;

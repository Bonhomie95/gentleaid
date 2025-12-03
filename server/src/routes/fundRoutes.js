import { Router } from "express";
import {
  runDailyDistribution,
  runWeeklyDistribution,
} from "../controllers/fundController.js";

import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

router.post("/daily", adminAuth, runDailyDistribution);
router.post("/weekly", adminAuth, runWeeklyDistribution);

export default router;

import express from "express";
import { extractRules, calculateStats } from "../controllers/adminController.js";

const router = express.Router();

// GET /api/admin/rules - list all rules
router.get("/rules", (req, res, next) => {
  try {
    const rules = extractRules();
    res.json({ success: true, count: rules.length, data: rules });
  } catch (error) {
    // If anything fails, pass it to the global errorHandler we made earlier
    next(error);
  }
});

// GET /api/admin/stats - knowledge base statistics
router.get("/stats", (req, res, next) => {
  try {
    const stats = calculateStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

export default router;
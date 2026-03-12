import express from "express";
import { validateDiagnosisParams, diagnoseCrop,explainDiagnosis } from "../controllers/diagnoseController.js";

const router = express.Router();

// Map the POST route to the validation array, then the controller function
router.post("/", validateDiagnosisParams, diagnoseCrop);
router.get("/explain/:id", explainDiagnosis);

export default router;
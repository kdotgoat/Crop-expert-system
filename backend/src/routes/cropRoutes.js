import express from "express";
import {
  getAllCrops,
  getCropById,
  getCropSymptoms,
  getCropDiseases,
} from "../controllers/cropController.js" 
const router = express.Router();


router.get("/", getAllCrops);
router.get("/:cropId", getCropById);
router.get("/:cropId/symptoms", getCropSymptoms);
router.get("/:cropId/diseases", getCropDiseases);

export default router;
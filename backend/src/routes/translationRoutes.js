import express from "express";
import { translateText, getCropDictionary } from "../controllers/translationController.js"
const router = express.Router();


router.post("/", translateText);


router.get("/crop/:cropId", getCropDictionary);

export default router;
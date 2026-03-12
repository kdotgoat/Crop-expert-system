import { body, validationResult } from "express-validator";
import { runDiagnosis,getExplanation } from "../engine/inferenceEngine.js"; 

export const validateDiagnosisParams = [
  body("cropId")
    .notEmpty()
    .withMessage("cropId is required"),
  body("symptoms")
    .isArray({ min: 1 })
    .withMessage("At least one symptom is required"),
  body("weather")
    .optional()
    .isArray(),
  body("variety")
    .optional()
    .isString(),
];


export const diagnoseCrop = (req, res, next) => {
  // 1. Check for validation errors first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
   
    const { cropId, symptoms, weather = [], variety = "" } = req.body;

  
    const result = runDiagnosis({ cropId, symptoms, weather, variety });

  
    res.json({ success: true, data: result });
  } catch (error) {
    
    if (error.message) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
};
export const explainDiagnosis = (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Fetch the trace from the inference engine's memory
    const trace = getExplanation(id);

    if (!trace) {
      return res.status(404).json({ 
        success: false, 
        error: "Explanation not found. It may have expired or the ID is invalid." 
      });
    }

    res.json({ success: true, data: trace });
  } catch (error) {
    next(error);
  }
};
import { translate, getCropTranslations } from "../services/translationService.js";

export const translateText = (req, res, next) => {
  try {
    const { text, direction = "sw-en" } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: "Text is required for translation" 
      });
    }

   
    const validDirection = ["sw-en", "en-sw"].includes(direction) ? direction : "sw-en";

    const result = translate(text, validDirection);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};


export const getCropDictionary = (req, res, next) => {
  try {
    const { cropId } = req.params;
    const dictionary = getCropTranslations(cropId);

    if (!dictionary) {
      return res.status(404).json({ 
        success: false, 
        error: `Crop dictionary for '${cropId}' not found.` 
      });
    }

    res.json({ success: true, data: dictionary });
  } catch (error) {
    next(error);
  }
};
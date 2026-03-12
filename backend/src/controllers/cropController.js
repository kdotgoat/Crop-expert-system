import KNOWLEDGE_BASE from "../config/knowledgeBase.js";


export const getAllCrops = (req, res, next) => {
  try {
    const crops = Object.entries(KNOWLEDGE_BASE).map(([id, crop]) => ({
      id,
      label: crop.label,
      swahili: crop.swahili,
      icon: crop.icon,
      diseaseCount: Object.keys(crop.diseases || {}).length,
      symptomCount: Object.keys(crop.symptoms || {}).length,
      varieties: crop.varieties || [],
    }));

    res.json({ success: true, data: crops });
  } catch (error) {
    next(error);
  }
};


export const getCropById = (req, res, next) => {
  try {
    const { cropId } = req.params;
    const crop = KNOWLEDGE_BASE[cropId];

    if (!crop) {
      return res.status(404).json({ success: false, error: "Crop not found" });
    }

    res.json({ success: true, data: { id: cropId, ...crop } });
  } catch (error) {
    next(error);
  }
};


export const getCropSymptoms = (req, res, next) => {
  try {
    const { cropId } = req.params;
    const crop = KNOWLEDGE_BASE[cropId];

    if (!crop) {
      return res.status(404).json({ success: false, error: "Crop not found" });
    }

    const symptoms = Object.entries(crop.symptoms || {}).map(([id, sym]) => ({
      id,
      label: sym.label,
      swahili: sym.swahili,
    }));

    res.json({ success: true, count: symptoms.length, data: symptoms });
  } catch (error) {
    next(error);
  }
};


export const getCropDiseases = (req, res, next) => {
  try {
    const { cropId } = req.params;
    const crop = KNOWLEDGE_BASE[cropId];

    if (!crop) {
      return res.status(404).json({ success: false, error: "Crop not found" });
    }

    const diseases = Object.entries(crop.diseases || {}).map(([name, disease]) => ({
      name,
      clpRule: disease.clpRule,
      weatherRisk: disease.weatherRisk,
      requiredSymptoms: disease.requiredSymptoms,
    }));

    res.json({ success: true, count: diseases.length, data: diseases });
  } catch (error) {
    next(error);
  }
};
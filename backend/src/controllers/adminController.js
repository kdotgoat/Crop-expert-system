import KNOWLEDGE_BASE  from "../config/knowledgeBase.js";
export const extractRules = () => {
  // flatMap is perfect here: it maps over the crops and flattens the resulting arrays into one
  return Object.entries(KNOWLEDGE_BASE).flatMap(([cropId, crop]) =>
    Object.entries(crop.diseases).map(([diseaseName, disease]) => ({
      cropId,
      cropLabel: crop.label,
      diseaseName,
      clpRule: disease.clpRule,
      requiredSymptoms: disease.requiredSymptoms,
      confirmatorySymptoms: disease.confirmatorySymptoms || [],
      weatherRisk: disease.weatherRisk,
      baseConfidence: disease.baseConfidence,
    }))
  );
};

/**
 * Aggregates statistics from the knowledge base.
 */
export const calculateStats = () => {
  // reduce lets us cleanly accumulate the totals in a single pass
  return Object.entries(KNOWLEDGE_BASE).reduce(
    (acc, [cropId, crop]) => {
      const diseaseCount = Object.keys(crop.diseases || {}).length;
      const symptomCount = Object.keys(crop.symptoms || {}).length;
      const varietyCount = (crop.varieties || []).length;

      acc.totalDiseases += diseaseCount;
      acc.totalSymptoms += symptomCount;
      acc.totalVarieties += varietyCount;

      acc.byCrop[cropId] = {
        label: crop.label,
        diseases: diseaseCount,
        symptoms: symptomCount,
        varieties: varietyCount,
      };

      return acc;
    },
    {
      totalCrops: Object.keys(KNOWLEDGE_BASE).length,
      totalDiseases: 0,
      totalSymptoms: 0,
      totalVarieties: 0,
      byCrop: {},
    }
  );
};
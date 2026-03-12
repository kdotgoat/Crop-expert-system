

import KNOWLEDGE_BASE from "../config/knowledgeBase.js";
import { v4 as uuidv4 } from "uuid";


const explanationStore = new Map();

/**
 * Main diagnosis function
 * @param {Object} params - The user inputs
 * @returns {{ diagnosisId, results, trace }}
 */
export const runDiagnosis = ({ cropId, symptoms, weather = [], variety = "" }) => {
  const cropData = KNOWLEDGE_BASE[cropId];
  if (!cropData) throw new Error(`Unknown crop: ${cropId}`);

  const diagnosisId = uuidv4();
  const timestamp = new Date().toISOString();
  const results = [];

  
  for (const [diseaseName, disease] of Object.entries(cropData.diseases || {})) {
    const requiredMatched = (disease.requiredSymptoms || []).filter(s => symptoms.includes(s));
    const confirmatoryMatched = (disease.confirmatorySymptoms || []).filter(s => symptoms.includes(s));
    
    
    const allMatched = [...new Set([...requiredMatched, ...confirmatoryMatched])];

    // Skip if no required symptoms matched
    if (requiredMatched.length === 0) continue;

   
    const totalRuleSymptoms = (disease.requiredSymptoms?.length || 0) + (disease.confirmatorySymptoms?.length || 0);
    const matchRatio = allMatched.length / totalRuleSymptoms;
    const requiredCoverage = requiredMatched.length / (disease.requiredSymptoms?.length || 1);

    
    let score = (matchRatio * 0.6 + requiredCoverage * 0.4) * (disease.baseConfidence || 100);

    // Weather boost: +15% if any weather conditions match disease risk
    const weatherOverlap = (disease.weatherRisk || []).filter(w => weather.includes(w));
    const weatherBoost = weatherOverlap.length > 0;
    if (weatherBoost) score = Math.min(score * 1.15, 99);

    // Variety-specific susceptibility note
    const varietyNote = getVarietyNote(cropId, variety, diseaseName);

    
    const ruleTrace = {
      rule: disease.clpRule,
      diseaseName,
      requiredSymptoms: disease.requiredSymptoms,
      confirmatorySymptoms: disease.confirmatorySymptoms || [],
      requiredMatched,
      confirmatoryMatched,
      allMatched,
      unmatched: [...(disease.requiredSymptoms || []), ...(disease.confirmatorySymptoms || [])].filter(
        s => !symptoms.includes(s)
      ),
      weatherRisk: disease.weatherRisk,
      weatherPresent: weather,
      weatherOverlap,
      weatherBoost,
      baseConfidence: disease.baseConfidence,
      matchRatio: Math.round(matchRatio * 100),
      requiredCoverage: Math.round(requiredCoverage * 100),
      finalScore: Math.round(score),
      clipsEquivalent: buildCLIPSEquivalent(cropId, disease, requiredMatched),
    };

    results.push({
      disease: diseaseName,
      score: Math.round(score),
      matchedSymptoms: allMatched,
      requiredMatched,
      confirmatoryMatched,
      totalSymptoms: totalRuleSymptoms,
      weatherBoost,
      weatherOverlap,
      treatment: disease.treatment,
      prevention: disease.prevention,
      riskLevel: getRiskLevel(Math.round(score)),
      varietyNote,
      ruleTrace, 
    });
  }

  results.sort((a, b) => b.score - a.score);
  const topResults = results.slice(0, 3); // Return top 3 diagnoses

  
  const trace = {
    diagnosisId,
    timestamp,
    inputs: {
      crop: { id: cropId, label: cropData.label, swahili: cropData.swahili },
      variety,
      symptoms,
      symptomLabels: symptoms.map(s => cropData.symptoms?.[s]?.label || s),
      weather,
      totalRulesEvaluated: Object.keys(cropData.diseases || {}).length,
    },
    inferenceMethod: "Forward Chaining",
    conflictResolution: "Highest weighted score (match ratio × base confidence + weather boost)",
    rulesEvaluated: Object.keys(cropData.diseases || {}).map(d => ({
      disease: d,
      rule: cropData.diseases[d].clpRule,
      fired: topResults.some(r => r.disease === d),
    })),
    topDiagnosis: topResults[0]?.disease || "No match",
    allTraces: topResults.map(r => r.ruleTrace),
  };

  // Store trace for later retrieval (e.g., for an agronomist to review)
  explanationStore.set(diagnosisId, trace);

  // Strip the heavy ruleTrace from the final payload sent to the user
  const cleanResults = topResults.map(({ ruleTrace, ...rest }) => rest);

  return { diagnosisId, results: cleanResults, trace };
};

/**
 * Retrieve stored explanation trace by ID
 */
export const getExplanation = (diagnosisId) => {
  return explanationStore.get(diagnosisId) || null;
};



const buildCLIPSEquivalent = (cropId, disease, matchedSymptoms) => {
  const conditions = matchedSymptoms
    .map(s => `(symptom (name ${s}) (crop ${cropId}))`)
    .join("\n  ");
  return `(defrule ${disease.clpRule}\n  ${conditions}\n  =>\n  (assert (diagnosis (disease "${disease.clpRule}"))))`;
};

const getRiskLevel = (score) => {
  if (score >= 85) return { label: "High Risk", severity: "HIGH" };
  if (score >= 65) return { label: "Moderate Risk", severity: "MODERATE" };
  if (score >= 45) return { label: "Possible", severity: "LOW" };
  return { label: "Low Probability", severity: "MINIMAL" };
};

const getVarietyNote = (cropId, variety, diseaseName) => {
  if (!variety) return null;
  

  const susceptibilityMap = {
    maize: {
      "WEMA": { "Maize Lethal Necrosis (MLN)": "WEMA varieties generally have better resistance to MLN." },
    },
    coffee: {
      "SL28": { "Coffee Leaf Rust (Hemileia vastatrix)": "SL28 is highly susceptible to CLR. Preventive spraying is critical." },
      "SL34": { "Coffee Leaf Rust (Hemileia vastatrix)": "SL34 is susceptible to CLR — spray preventively." },
    },
    banana: {
      "GrossMichel": { "Panama Disease / Fusarium Wilt (FOC)": "⚠️ Gros Michel is extremely susceptible to Panama Disease (FOC Race 1)." },
    },
  };
  
  return susceptibilityMap[cropId]?.[variety]?.[diseaseName] || null;
};
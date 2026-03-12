
import KNOWLEDGE_BASE from "../config/knowledgeBase.js";

export const SW_TO_EN = {
  // General agriculture
  "shamba": "farm",
  "mazao": "crops",
  "mkulima": "farmer",
  "mbegu": "seeds",
  "mbolea": "fertilizer",
  "dawa": "pesticide / medicine",
  "mvua": "rain",
  "ukame": "drought",
  "ugonjwa": "disease",
  "magonjwa": "diseases",
  "dalili": "symptoms",
  "tiba": "treatment",
  "kinga": "prevention",
  "matibabu": "treatment / cure",
  "daktari": "doctor",
  "afisa ugani": "agricultural extension officer",

  // Crop names
  "mahindi": "maize",
  "nyanya": "tomato",
  "viazi": "potato",
  "kahawa": "coffee",
  "ndizi": "banana",
  "maharagwe": "beans",
  "ngano": "wheat",
  "mtama": "sorghum",
  "muhogo": "cassava",
  "sukari": "sugarcane",
  "chai": "tea",
  "pamba": "cotton",
  "alizeti": "sunflower",

  // Symptoms
  "majani kuwa njano": "yellowing of leaves",
  "majani ya njano": "yellow leaves",
  "madoa": "spots",
  "madoa ya kahawia": "brown spots",
  "madoa meusi": "black spots",
  "madoa ya njano": "yellow spots",
  "ukuaji mdogo": "stunted growth",
  "kunyauka": "wilting",
  "kunyauka ghafla": "sudden wilting",
  "majani kuanguka": "leaf drop / defoliation",
  "kuoza": "rot",
  "kuoza kwa kahawia": "brown rot",
  "mistari ya njano": "yellow streaks",
  "vidonda": "lesions",
  "vidonda vya maji": "water-soaked lesions",
  "ukungu": "mold / mildew",
  "ukungu mweupe": "white mold",
  "vipele": "pustules",
  "vipele vya chungwa": "orange pustules",
  "shina kupasuka": "splitting of stem",
  "mmea kuanguka": "plant lodging",
  "mmea kufa": "plant death",
  "matunda kuoza": "fruit rot",
  "matunda kuanguka mapema": "premature fruit drop",

  // Disease names
  "kutu": "rust",
  "ukungu wa marehemu": "late blight",
  "ukungu wa mapema": "early blight",
  "ugonjwa wa kunyauka kwa bakteria": "bacterial wilt",
  "ugonjwa wa mosaic": "mosaic virus",
  "ugonjwa wa damu": "vascular disease",

  // Weather
  "mvua nyingi": "heavy rainfall / rainy season",
  "unyevu wa juu": "high humidity",
  "joto kali": "high temperature / heat",
  "baridi": "cold / cool temperature",
  "kiangazi": "dry season",
  "masika": "long rains season",
  "vuli": "short rains season",

  // Actions
  "ondoa": "remove",
  "choma": "burn",
  "nyunyizia": "spray",
  "panda": "plant",
  "vuna": "harvest",
  "saga": "plow",
  "mwagilia": "irrigate",
  "pangusa": "wipe / disinfect",
  "angalia": "observe / monitor",

  // Common phrases
  "hakuna tiba": "no cure",
  "wasiliana na afisa ugani": "contact agricultural extension officer",
  "tumia mbegu zilizoidhinishwa": "use certified seeds",
  "zungushia mazao": "practice crop rotation",
};

export const EN_TO_SW = {};

// Reverse the base dictionary (only clean, single mappings)
Object.entries(SW_TO_EN).forEach(([sw, en]) => {
  if (!en.includes("/")) EN_TO_SW[en.toLowerCase()] = sw;
});

// Additional English→Swahili explicit overrides
const EN_TO_SW_EXTRA = {
  "maize": "mahindi",
  "tomato": "nyanya",
  "potato": "viazi",
  "coffee": "kahawa",
  "banana": "ndizi",
  "beans": "maharagwe",
  "disease": "ugonjwa",
  "diseases": "magonjwa",
  "symptoms": "dalili",
  "treatment": "matibabu",
  "prevention": "kinga",
  "farmer": "mkulima",
  "farm": "shamba",
  "crop": "zao",
  "crops": "mazao",
  "seeds": "mbegu",
  "fertilizer": "mbolea",
  "pesticide": "dawa ya kuua wadudu",
  "rain": "mvua",
  "drought": "ukame",
  "wilting": "kunyauka",
  "yellowing": "kuwa njano",
  "spots": "madoa",
  "lesions": "vidonda",
  "mold": "ukungu",
  "rust": "kutu",
  "blight": "ugonjwa wa majani",
  "wilt": "kunyauka",
  "rot": "kuoza",
  "spray": "nyunyizia",
  "remove": "ondoa",
  "burn": "choma",
  "harvest": "vuna",
};

Object.assign(EN_TO_SW, EN_TO_SW_EXTRA);



// We build this once when the module loads, rather than every time a function is called.
const SYMBOL_TRANSLATIONS = {};

for (const [cropId, crop] of Object.entries(KNOWLEDGE_BASE)) {
  if (crop.label && crop.swahili) {
    SYMBOL_TRANSLATIONS[crop.label.toLowerCase()] = crop.swahili;
    SYMBOL_TRANSLATIONS[crop.swahili.toLowerCase()] = crop.label;
  }
  
  if (crop.symptoms) {
    for (const [symId, sym] of Object.entries(crop.symptoms)) {
      if (sym.label && sym.swahili) {
        SYMBOL_TRANSLATIONS[sym.label.toLowerCase()] = sym.swahili;
        SYMBOL_TRANSLATIONS[sym.swahili.toLowerCase()] = sym.label;
      }
    }
  }
}



const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};


/**
 * Main translation function (Greedy matching algorithm)
 * @param {string} text - Input text to translate
 * @param {"sw-en"|"en-sw"} direction
 * @returns {{ translated: string, confidence: number, tokens: object[] }}
 */
export const translate = (text, direction = "sw-en") => {
  if (!text || typeof text !== "string") {
    return { translated: "", confidence: 0, tokens: [] };
  }

  const inputLower = text.toLowerCase().trim();
  const dict = direction === "sw-en" ? SW_TO_EN : EN_TO_SW;
  const tokens = [];

  // 1. Try exact full-phrase match first against the dictionary OR the Knowledge Base
  const exactMatch = dict[inputLower] || SYMBOL_TRANSLATIONS[inputLower];

  if (exactMatch) {
    return {
      translated: capitalize(exactMatch),
      confidence: 100,
      tokens: [{ original: text, translated: exactMatch, type: "exact" }],
    };
  }

  // 2. Try multi-word phrase matching (longest match wins)
  let workingText = inputLower;
  let translatedParts = [];
  let overallScore = 0;
  let wordCount = 0;

  // Build sorted phrase list (longest first for greedy matching)
  const allPhrases = Object.keys(dict).sort((a, b) => b.length - a.length);

  while (workingText.length > 0) {
    let matched = false;
    for (const phrase of allPhrases) {
      if (workingText.startsWith(phrase)) {
        translatedParts.push(dict[phrase]);
        tokens.push({ original: phrase, translated: dict[phrase], type: "phrase" });
        workingText = workingText.slice(phrase.length).trimStart();
        overallScore += 90;
        wordCount++;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Take next word as-is (unknown)
      const nextWord = workingText.split(" ")[0];
      translatedParts.push(nextWord);
      tokens.push({ original: nextWord, translated: nextWord, type: "unknown" });
      workingText = workingText.slice(nextWord.length).trimStart();
      overallScore += 30; // Low confidence for unknown words
      wordCount++;
    }
  }

  const avgConfidence = wordCount > 0 ? Math.round(overallScore / wordCount) : 0;

  return {
    translated: capitalize(translatedParts.join(" ")),
    confidence: avgConfidence,
    tokens,
  };
};

/**
 * Appends Swahili translations to a diagnosis result payload.
 * Useful for formatting the final response for the frontend.
 */
export const translateDiagnosisToSwahili = (diagnosis, cropId) => {
  const crop = KNOWLEDGE_BASE[cropId];
  if (!crop) return diagnosis;

  return {
    ...diagnosis,
    matchedSymptomsSwahili: (diagnosis.matchedSymptoms || []).map(s => ({
      id: s,
      english: crop.symptoms?.[s]?.label || s,
      swahili: crop.symptoms?.[s]?.swahili || translate(s, "en-sw").translated,
    })),
  };
};

/**
 * Get all available translations for a specific crop's symptoms.
 * Useful for populating dual-language dropdown menus on the frontend.
 */
export const getCropTranslations = (cropId) => {
  const crop = KNOWLEDGE_BASE[cropId];
  if (!crop) return null;

  return {
    cropName: { english: crop.label, swahili: crop.swahili },
    symptoms: Object.entries(crop.symptoms || {}).map(([id, sym]) => ({
      id,
      english: sym.label,
      swahili: sym.swahili,
    })),
  };
};
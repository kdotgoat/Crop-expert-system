;;; ============================================================
;;; KENYA CROP DISEASE EXPERT SYSTEM - HORTICULTURE & CASH CROPS
;;; Covers: Tomato, Potato, Coffee, Banana, Beans, Maize
;;; ============================================================

;;; ═══════════════════════════════════════════════════════════
;;; TOMATO (Nyanya) RULES
;;; ═══════════════════════════════════════════════════════════

(defrule tomato-early-blight
  "Alternaria solani: most common tomato disease in Kenya"
  (symptom (name brown-spots-concentric-rings) (crop tomato))
  (symptom (name lower-leaf-affected-first) (crop tomato))
  =>
  (assert (diagnosis
    (disease "Early Blight (Alternaria solani)")
    (crop "tomato")
    (confidence 88)
    (matched-count 2)
    (treatment "Apply Mancozeb 80WP (2kg/ha) or Copper Oxychloride every 7-10 days. Remove and destroy infected lower leaves. Avoid working in field when wet to reduce spread.")
    (prevention "Avoid overhead irrigation. Apply mulch to reduce soil splash onto leaves. Use certified disease-free seeds. Maintain proper plant spacing (60cm x 45cm)."))))

(defrule tomato-late-blight
  "Phytophthora infestans: most destructive in cool rainy seasons"
  (symptom (name water-soaked-lesions) (crop tomato))
  (symptom (name white-mold-leaf-underside) (crop tomato))
  ?w <- (weather (condition rainy))
  =>
  (assert (diagnosis
    (disease "Late Blight (Phytophthora infestans)")
    (crop "tomato")
    (confidence 93)
    (matched-count 2)
    (treatment "Apply Ridomil Gold MZ (metalaxyl + mancozeb) urgently at 2.5kg/ha. Spray every 7 days during wet weather. Remove and burn all infected plant material. Do not compost.")
    (prevention "Plant resistant varieties. Avoid waterlogging and overhead irrigation. Apply preventive fungicide sprays at start of rainy season. Destroy infected volunteer plants."))))

(defrule tomato-bacterial-wilt
  "Ralstonia solanacearum: no cure, highly destructive"
  (symptom (name sudden-wilting) (crop tomato))
  (symptom (name milky-bacterial-ooze) (crop tomato))
  =>
  (assert (diagnosis
    (disease "Bacterial Wilt (Ralstonia solanacearum)")
    (crop "tomato")
    (confidence 94)
    (matched-count 2)
    (treatment "No effective chemical cure. Immediately remove and destroy all infected plants and roots - do NOT compost. Disinfect tools with bleach (10% solution). Do not replant tomato, potato, or pepper in that soil for 3+ years.")
    (prevention "Use wilt-resistant varieties. Practice 3-year crop rotation avoiding Solanaceae family. Improve drainage. Use certified planting material. Soil solarization during dry season."))))

(defrule tomato-tylcv
  "Tomato Yellow Leaf Curl Virus: whitefly-transmitted"
  (symptom (name yellow-curled-leaves) (crop tomato))
  (symptom (name flower-drop) (crop tomato))
  ?w <- (weather (condition warm))
  =>
  (assert (diagnosis
    (disease "Tomato Yellow Leaf Curl Virus (TYLCV)")
    (crop "tomato")
    (confidence 92)
    (matched-count 2)
    (treatment "Remove and destroy infected plants. Control whitefly vectors using Imidacloprid 70WG (0.3g/L) or Acetamiprid. Use yellow sticky traps to monitor whitefly populations.")
    (prevention "Use TYLCV-resistant varieties (Tylka F1, Anna F1, Kilele F1). Install insect-proof nets in nursery. Monitor whitefly populations weekly. Remove infected plants immediately."))))

;;; ═══════════════════════════════════════════════════════════
;;; POTATO (Viazi) RULES
;;; ═══════════════════════════════════════════════════════════

(defrule potato-late-blight
  "Phytophthora infestans: #1 potato disease in Kenya highlands"
  (symptom (name water-soaked-leaf-spots) (crop potato))
  (symptom (name white-sporulation-underside) (crop potato))
  ?w <- (weather (condition rainy))
  =>
  (assert (diagnosis
    (disease "Late Blight (Phytophthora infestans)")
    (crop "potato")
    (confidence 95)
    (matched-count 2)
    (treatment "Apply Ridomil Gold MZ 68WP (2.5kg/ha) or Acrobat MZ immediately. Spray every 7-10 days. Remove and destroy infected haulms 2 weeks before harvest to prevent tuber infection. Do not harvest in wet conditions.")
    (prevention "Use certified disease-free seed tubers. Plant resistant varieties (Asante, Sherekea). Apply preventive copper sprays at early growth. Avoid waterlogging. Destroy cull piles."))))

(defrule potato-bacterial-wilt
  "Ralstonia solanacearum Race 3: highland potato threat"
  (symptom (name wilting-upper-leaves) (crop potato))
  (symptom (name brown-ring-tuber) (crop potato))
  (symptom (name milky-ooze-stem) (crop potato))
  =>
  (assert (diagnosis
    (disease "Bacterial Wilt (Ralstonia solanacearum Race 3)")
    (crop "potato")
    (confidence 93)
    (matched-count 3)
    (treatment "No chemical cure. Remove and destroy all infected plants, tubers, and soil immediately. Disinfect tools, boots, and machinery with 2% bleach. Do not use infected tubers as seed.")
    (prevention "Use certified disease-free seed tubers. Practice minimum 3-year rotation avoiding Solanaceae. Improve field drainage. Avoid planting in previously infected fields."))))

(defrule potato-common-scab
  "Streptomyces scabies: soil pH and moisture related"
  (symptom (name rough-scabby-tuber-skin) (crop potato))
  (symptom (name shallow-pits-tuber) (crop potato))
  ?w <- (weather (condition dry))
  =>
  (assert (diagnosis
    (disease "Common Scab (Streptomyces scabies)")
    (crop "potato")
    (confidence 80)
    (matched-count 2)
    (treatment "No in-season chemical cure. Affected tubers are still edible after peeling. Ensure uniform irrigation especially during tuber initiation. Adjust soil pH below 5.2.")
    (prevention "Use certified seed tubers. Maintain soil pH between 5.0-5.2. Ensure consistent soil moisture during tuber development. Avoid fresh manure. Crop rotation."))))

;;; ═══════════════════════════════════════════════════════════
;;; COFFEE (Kahawa) RULES
;;; ═══════════════════════════════════════════════════════════

(defrule coffee-leaf-rust
  "Hemileia vastatrix: most significant Kenyan coffee disease"
  (symptom (name orange-yellow-pustules-underside) (crop coffee))
  (symptom (name yellow-spots-upper-leaf) (crop coffee))
  ?w <- (weather (condition rainy))
  =>
  (assert (diagnosis
    (disease "Coffee Leaf Rust (Hemileia vastatrix)")
    (crop "coffee")
    (confidence 95)
    (matched-count 2)
    (treatment "Apply Copper Oxychloride 50WP (3kg/100L water) or Bayleton (Triadimefon). Spray every 3 weeks during rainy season. Start spraying at first sign of infection. Prune to improve air circulation.")
    (prevention "Use resistant varieties (Ruiru 11, Batian). Regular pruning for canopy airflow. Shade management. Apply preventive copper sprays at onset of rains. Remove infected leaves."))))

(defrule coffee-berry-disease
  "Colletotrichum kahawae: Kenya-specific CBD strain, major threat"
  (symptom (name dark-sunken-berry-lesions) (crop coffee))
  (symptom (name premature-berry-drop) (crop coffee))
  ?w <- (weather (condition rainy))
  =>
  (assert (diagnosis
    (disease "Coffee Berry Disease (CBD - Colletotrichum kahawae)")
    (crop "coffee")
    (confidence 94)
    (matched-count 2)
    (treatment "Apply Copper Oxychloride (3kg/100L) or Benomyl at berry formation stage. Spray every 2-3 weeks during rains. Remove and destroy all infected berries including mummies.")
    (prevention "Use CBD-resistant varieties (Ruiru 11, Batian, SL28). Time sprays with berry development. Remove all mummified berries. Timely harvesting of ripe berries."))))

(defrule coffee-wilt
  "Gibberella xylarioides: Tracheomycosis, vascular wilt"
  (symptom (name sudden-wilting-branches) (crop coffee))
  (symptom (name brown-wood-inside) (crop coffee))
  =>
  (assert (diagnosis
    (disease "Coffee Wilt Disease (Tracheomycosis)")
    (crop "coffee")
    (confidence 88)
    (matched-count 2)
    (treatment "No effective chemical cure. Remove and burn infected trees and stumps completely. Disinfect all cutting tools with 70% alcohol between cuts. Report to local agricultural office.")
    (prevention "Use certified planting material. Disinfect tools before entering plantation. Avoid soil disturbance near roots. Quarantine infected areas. Monitor new plantings closely."))))

;;; ═══════════════════════════════════════════════════════════
;;; BANANA (Ndizi) RULES
;;; ═══════════════════════════════════════════════════════════

(defrule banana-bacterial-wilt
  "Xanthomonas wilt: most destructive banana disease in E. Africa"
  (symptom (name yellow-wilting-leaves) (crop banana))
  (symptom (name yellow-ooze-cut-stem) (crop banana))
  =>
  (assert (diagnosis
    (disease "Banana Bacterial Wilt (Xanthomonas vasicola pv. musacearum)")
    (crop "banana")
    (confidence 96)
    (matched-count 2)
    (treatment "Remove and destroy the ENTIRE infected mat (mother plant + all suckers). Chop into small pieces and bury 50cm deep or burn. Disinfect tools with 10% bleach after each plant. Remove male buds on healthy plants to prevent insect transmission.")
    (prevention "Use disease-free suckers from certified sources. Disinfect all cutting tools. Remove male flower bud after last hand sets. Train one sucker per mat. Monitor regularly."))))

(defrule banana-fusarium-wilt
  "Fusarium oxysporum f.sp. cubense: Panama disease, soil-borne"
  (symptom (name yellowing-lower-leaves) (crop banana))
  (symptom (name splitting-pseudostem) (crop banana))
  (symptom (name brown-vascular-tissue) (crop banana))
  =>
  (assert (diagnosis
    (disease "Panama Disease / Fusarium Wilt (FOC)")
    (crop "banana")
    (confidence 91)
    (matched-count 3)
    (treatment "No effective chemical cure. Remove and destroy infected mats. Avoid moving soil from infected areas. Do not replant banana in infected soil for 10+ years without fumigation.")
    (prevention "Use resistant varieties (FHIA-01, FHIA-17). Use certified clean planting material. Avoid importing soil or suckers from infected areas. Improve drainage."))))

(defrule banana-black-sigatoka
  "Mycosphaerella fijiensis: rapidly evolving fungal pathogen"
  (symptom (name dark-streaks-leaves) (crop banana))
  (symptom (name black-leaf-spots) (crop banana))
  ?w <- (weather (condition rainy))
  =>
  (assert (diagnosis
    (disease "Black Sigatoka (Mycosphaerella fijiensis)")
    (crop "banana")
    (confidence 88)
    (matched-count 2)
    (treatment "Apply Mancozeb 80WP or Propiconazole. Remove and destroy infected leaves by cutting at base. Deleaf regularly - do not leave infected material in field. Oil-based sprays effective.")
    (prevention "Use resistant varieties. Maintain proper plant spacing (3m x 3m). Regular deleafing of 3-4 oldest leaves per plant. Ensure good drainage. Avoid overhead irrigation."))))

;;; ═══════════════════════════════════════════════════════════
;;; BEANS (Maharagwe) RULES
;;; ═══════════════════════════════════════════════════════════

(defrule beans-rust
  "Uromyces appendiculatus: common in cool humid bean zones"
  (symptom (name orange-brown-pustules) (crop beans))
  (symptom (name yellowing-around-pustules) (crop beans))
  ?w <- (weather (condition rainy))
  =>
  (assert (diagnosis
    (disease "Bean Rust (Uromyces appendiculatus)")
    (crop "beans")
    (confidence 88)
    (matched-count 2)
    (treatment "Apply Mancozeb 80WP (2.5kg/ha) or Copper Oxychloride. Spray every 10-14 days starting at first sign. Remove heavily infected plants. Harvest promptly when mature.")
    (prevention "Use rust-resistant varieties (Jesca, Lyamungu 85). Avoid dense planting. Practice crop rotation. Avoid working in field when wet. Destroy crop residues after harvest."))))

(defrule beans-angular-leaf-spot
  "Pseudocercospora griseola: seed and residue-borne"
  (symptom (name angular-water-soaked-spots) (crop beans))
  (symptom (name gray-brown-leaf-lesions) (crop beans))
  =>
  (assert (diagnosis
    (disease "Angular Leaf Spot (Pseudocercospora griseola)")
    (crop "beans")
    (confidence 83)
    (matched-count 2)
    (treatment "Apply Copper Oxychloride 50WP (3kg/ha). Remove heavily infected plant debris. Avoid overhead irrigation. Harvest promptly when mature to minimize losses.")
    (prevention "Use certified disease-free seed. Crop rotation (minimum 2 years). Avoid overhead irrigation. Remove and destroy infected plant debris. Use tolerant varieties."))))

(defrule beans-mosaic-virus
  "Bean Common Mosaic Virus: aphid-transmitted"
  (symptom (name mosaic-mottling) (crop beans))
  (symptom (name leaf-malformation) (crop beans))
  (symptom (name stunted-growth) (crop beans))
  =>
  (assert (diagnosis
    (disease "Bean Common Mosaic Virus (BCMV)")
    (crop "beans")
    (confidence 85)
    (matched-count 3)
    (treatment "No chemical cure. Remove and destroy infected plants. Apply Imidacloprid or Dimethoate to control aphid vectors. Do not save seed from infected plants.")
    (prevention "Use certified virus-free seed. Plant BCMV-resistant varieties (Mwitemania, Selian 97). Control aphids from germination. Remove weed hosts around the field."))))

;;; ═══════════════════════════════════════════════════════════
;;; MAIZE (Mahindi) RULES
;;; ═══════════════════════════════════════════════════════════

(defrule maize-lethal-necrosis
  "MLN: caused by co-infection of MCMV + SCMV/WSMV. Aphid/thrip transmitted."
  (symptom (name yellow-streaks-leaves) (crop maize))
  (symptom (name stunted-growth) (crop maize))
  ?w <- (weather (condition rainy))
  =>
  (assert (diagnosis
    (disease "Maize Lethal Necrosis (MLN)")
    (crop "maize")
    (confidence 90)
    (matched-count 2)
    (treatment "Remove and destroy infected plants immediately. Apply Cypermethrin to control aphid and thrip vectors. Do not replant maize in the same field for at least one season. Use MLN-resistant varieties in subsequent planting.")
    (prevention "Use certified MLN-resistant seeds such as WEMA or DK8031. Control aphids and thrips through regular scouting. Avoid planting near infected fields. Practice crop rotation."))))

(defrule maize-lethal-necrosis-advanced
  "MLN advanced stage: dead heart and ear rot confirm severe infection"
  (symptom (name yellow-streaks-leaves) (crop maize))
  (symptom (name stunted-growth) (crop maize))
  (symptom (name dead-heart) (crop maize))
  (symptom (name ear-rot) (crop maize))
  =>
  (assert (diagnosis
    (disease "Maize Lethal Necrosis (MLN) - Advanced")
    (crop "maize")
    (confidence 97)
    (matched-count 4)
    (treatment "Immediately uproot and burn all infected plants. Do not compost. Apply systemic insecticide (Imidacloprid) to control aphid/thrip vectors in surrounding healthy plants. Notify neighboring farmers.")
    (prevention "Use certified MLN-resistant varieties. Implement strict aphid/thrip control. Avoid mixed-age maize plantings in same field."))))

(defrule maize-gray-leaf-spot
  "GLS: Cercospora zeae-maydis, thrives in humid conditions"
  (symptom (name rectangular-leaf-lesions) (crop maize))
  (symptom (name gray-tan-spots) (crop maize))
  ?w <- (weather (condition humid))
  =>
  (assert (diagnosis
    (disease "Gray Leaf Spot (Cercospora)")
    (crop "maize")
    (confidence 85)
    (matched-count 2)
    (treatment "Apply Mancozeb 80WP (2.5kg/ha) or Propiconazole (0.5L/ha). Remove and burn heavily infected crop residues after harvest. Ensure adequate plant spacing to improve air circulation.")
    (prevention "Use GLS-resistant hybrids. Practice crop rotation with non-host crops (legumes, sunflower). Avoid overhead irrigation. Plow crop residues after harvest."))))

(defrule maize-northern-leaf-blight
  "NLB: Exserohilum turcicum, cigar-shaped lesions starting lower"
  (symptom (name long-cigar-lesions) (crop maize))
  (symptom (name lesions-lower-leaves) (crop maize))
  =>
  (assert (diagnosis
    (disease "Northern Leaf Blight (NLB)")
    (crop "maize")
    (confidence 80)
    (matched-count 2)
    (treatment "Apply Mancozeb 80WP or Chlorothalonil at disease onset. Ensure proper plant spacing (75cm between rows) for airflow. Remove lower infected leaves during growing season.")
    (prevention "Plant resistant varieties. Rotate crops. Plow maize residues after harvest to reduce inoculum. Avoid high-density planting."))))

(defrule maize-streak-virus
  "MSV: transmitted by Cicadulina leafhoppers"
  (symptom (name yellow-streaks-leaves) (crop maize))
  (symptom (name narrow-yellow-streaks) (crop maize))
  ?w <- (weather (condition dry))
  =>
  (assert (diagnosis
    (disease "Maize Streak Virus (MSV)")
    (crop "maize")
    (confidence 88)
    (matched-count 2)
    (treatment "No chemical cure for infected plants. Remove infected plants to reduce viral source. Control leafhopper vectors by applying Imidacloprid 70WS as seed treatment or foliar spray.")
    (prevention "Use MSV-resistant varieties. Early planting to avoid peak leafhopper populations. Monitor and control leafhoppers. Remove volunteer maize plants."))))

(defrule maize-stalk-rot
  "Fusarium stalk rot: common in poorly drained soils"
  (symptom (name stalk-discoloration) (crop maize))
  (symptom (name lodging) (crop maize))
  (symptom (name pink-stalk-interior) (crop maize))
  =>
  (assert (diagnosis
    (disease "Fusarium Stalk Rot")
    (crop "maize")
    (confidence 78)
    (matched-count 3)
    (treatment "No effective in-season chemical cure. Harvest early to minimize losses. Ensure balanced fertilization (avoid excess nitrogen). Improve field drainage.")
    (prevention "Use resistant varieties. Avoid high plant populations. Balanced soil nutrition with adequate potassium. Improve soil drainage. Crop rotation."))))
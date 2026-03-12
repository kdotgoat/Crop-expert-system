import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3000/api';

export default function useDiagnosis() {
  // Data from Backend
  const [crops, setCrops] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  
  // User Selections
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [weather, setWeather] = useState([]);
  const [variety, setVariety] = useState("");

  // UI Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [diagnosisId, setDiagnosisId] = useState(null); // Used for the Explanation Trace

  // 1. Initial Load: Fetch all available crops
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await fetch(`${API_BASE}/crops`);
        const json = await res.json();
        if (json.success) setCrops(json.data);
      } catch (err) {
        setError("Could not connect to the Expert System.");
      }
    };
    fetchCrops();
  }, []);

  // 2. When a crop is selected: Fetch its specific symptoms
  const selectCrop = useCallback(async (cropId) => {
    setSelectedCropId(cropId);
    setSelectedSymptoms([]); 
    setResults(null);        
    setDiagnosisId(null);
    setVariety("");
    setWeather([]);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/crops/${cropId}/symptoms`);
      const json = await res.json();
      if (json.success) {
        setAvailableSymptoms(json.data);
      } else {
        throw new Error(json.error);
      }
    } catch (err) {
      setError("Failed to load symptoms for this crop.");
      setAvailableSymptoms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Toggle a symptom in the checklist array
  const toggleSymptom = useCallback((symptomId) => {
    setSelectedSymptoms((prev) => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  }, []);

  // 4. Run the Engine!
  const runDiagnosis = async () => {
    if (!selectedCropId) return setError("Please select a crop.");
    if (selectedSymptoms.length === 0) return setError("Please select at least one symptom.");

    setLoading(true);
    setError(null);
    setResults(null);

    const payload = {
      cropId: selectedCropId,
      symptoms: selectedSymptoms,
      weather,
      variety
    };

    try {
      const res = await fetch(`${API_BASE}/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      
      if (!json.success) {
        const errMsg = json.errors ? json.errors[0].msg : json.error;
        throw new Error(errMsg || "Diagnosis failed");
      }
      
      setResults(json.data.results);
      setDiagnosisId(json.data.diagnosisId); // ID for the explanation panel
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetDiagnosis = () => {
    setSelectedCropId(null);
    setSelectedSymptoms([]);
    setAvailableSymptoms([]);
    setWeather([]);
    setVariety("");
    setResults(null);
    setDiagnosisId(null);
    setError(null);
  };

  return {
    crops, availableSymptoms, selectedCropId, selectedSymptoms,
    weather, variety, loading, error, results, diagnosisId,
    selectCrop, toggleSymptom, setWeather, setVariety,
    runDiagnosis, resetDiagnosis
  };
}
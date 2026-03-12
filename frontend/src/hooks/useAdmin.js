import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:3000/api/admin';

export default function useAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // 1. Update a Disease (Treatment/Prevention/Confidence)
  const updateDisease = useCallback(async (cropId, diseaseName, updateData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`${API_BASE}/diseases/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropId, diseaseName, ...updateData })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setSuccessMessage(`${diseaseName} updated successfully!`);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Add a new Symptom to a Crop
  const addSymptom = useCallback(async (cropId, symptomId, symptomData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`${API_BASE}/symptoms/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropId, symptomId, ...symptomData })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setSuccessMessage(`New symptom added to ${cropId}!`);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    updateDisease,
    addSymptom,
    loading,
    error,
    successMessage,
    clearMessages
  };
}
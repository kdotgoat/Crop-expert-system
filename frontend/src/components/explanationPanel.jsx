import { useState, useEffect } from 'react';

export default function ExplanationPanel({ diagnosisId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Toggle panel and fetch data if not already loaded
  const handleToggle = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (trace) {
      setIsOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/diagnose/explain/${diagnosisId}`);
      const json = await response.json();

      if (!json.success) throw new Error(json.error);
      
      setTrace(json.data);
      setIsOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explanation-wrapper">
      {/* The "Brain" Toggle Button */}
      <button 
        onClick={handleToggle} 
        className="explanation-toggle-btn group"
      >
        <div className="flex items-center gap-3">
          <span className="p-1 bg-green-500 rounded text-black animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          <span className="font-mono tracking-widest uppercase">
            {isOpen ? 'Close Engine Trace' : 'View Expert System Logic'}
          </span>
        </div>
        <span className="opacity-50 group-hover:opacity-100 transition-opacity">
          {loading ? '...' : isOpen ? '▲' : '▼'}
        </span>
      </button>

      {error && (
        <div className="mt-2 p-3 bg-red-900/20 border border-red-500 text-red-400 text-xs font-mono rounded">
          SYSTEM_ERROR: {error}
        </div>
      )}

      {/* The Expanded Trace Content */}
      {isOpen && trace && (
        <div className="explanation-content animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Metadata Section */}
          <div className="mb-8">
            <h4 className="explanation-section-title">Engine Metadata</h4>
            <div className="explanation-math-grid">
              <div className="math-stat">
                <span className="math-label">Algorithm</span>
                <span className="math-value text-xs uppercase">{trace.inferenceMethod}</span>
              </div>
              <div className="math-stat">
                <span className="math-label">Conflict Res.</span>
                <span className="math-value text-xs uppercase">{trace.conflictResolution}</span>
              </div>
              <div className="math-stat">
                <span className="math-label">Symptoms Count</span>
                <span className="math-value">{trace.inputs.symptoms.length}</span>
              </div>
              <div className="math-stat">
                <span className="math-label">Timestamp</span>
                <span className="math-value text-[10px] leading-tight font-mono">
                  {new Date(trace.timestamp).toISOString()}
                </span>
              </div>
            </div>
          </div>

          {/* Rules & Probability Section */}
          <div>
            <h4 className="explanation-section-title">Rule Firing & Certainty Factor (CF)</h4>
            <div className="space-y-6">
              {trace.allTraces.map((ruleTrace, index) => (
                <div key={index} className="explanation-trace-card">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <h5 className="font-bold text-gray-900">{ruleTrace.diseaseName}</h5>
                    <span className="text-xs font-mono font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      MATCH: {ruleTrace.finalScore}%
                    </span>
                  </div>
                  
                  {/* Calculation Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                    <div className="text-[11px]">
                      <span className="text-gray-400 block uppercase font-bold">Base CF:</span>
                      <span className="text-gray-700">{ruleTrace.baseConfidence}%</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-gray-400 block uppercase font-bold">Weighting:</span>
                      <span className="text-gray-700">{ruleTrace.matchRatio}% symptoms matched</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-gray-400 block uppercase font-bold">Weather Boost:</span>
                      <span className={ruleTrace.weatherBoost ? "text-blue-600 font-bold" : "text-gray-400"}>
                        {ruleTrace.weatherBoost ? "+15% (Applied)" : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Generated CLIPS Rule */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <span className="text-[10px] text-gray-400 font-mono uppercase">CLIPS Syntax Projection</span>
                      <span className="text-[10px] text-gray-500 italic">Forward Chaining Rule</span>
                    </div>
                    <pre className="clips-terminal">
                      <code>{ruleTrace.clipsEquivalent}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
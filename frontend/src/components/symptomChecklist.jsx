export default function SymptomChecklist({ symptoms, selectedSymptoms, onToggleSymptom }) {
  if (!symptoms || symptoms.length === 0) return null;

  const count = selectedSymptoms.length;

  return (
    <div>
      <div className="flex items-end justify-between mb-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
            Step 2 of 3 — Symptoms
          </p>
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            What are you observing?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select all symptoms visible on the crop.
          </p>
        </div>
        {count > 0 && (
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200 dark:border-emerald-800 mb-1">
            {count} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
        {symptoms.map(symptom => {
          const isSelected = selectedSymptoms.includes(symptom.id);
          return (
            <button
              key={symptom.id}
              onClick={() => onToggleSymptom(symptom.id)}
              className={`
                group flex items-center gap-3 p-3.5 rounded-xl text-left
                transition-all duration-150 cursor-pointer
                ${isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 shadow-sm'
                  : 'bg-white dark:bg-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              {/* Checkbox circle */}
              <div className={`
                shrink w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${isSelected
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-gray-300 dark:border-gray-600 group-hover:border-emerald-400'
                }
              `}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="min-w-0">
                <span className={`
                  block text-sm font-bold leading-snug transition-colors
                  ${isSelected
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : 'text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400'
                  }
                `}>
                  {symptom.label}
                </span>
                {symptom.swahili && (
                  <span className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
                    {symptom.swahili}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
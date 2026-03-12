import SeverityBadge from './severityBadge.jsx';

export default function ResultCard({ result, index = 0 }) {
  const isTopResult = index === 0;

  return (
    <div className={`
      relative rounded-2xl overflow-hidden transition-all
      ${isTopResult
        ? 'shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30'
        : 'shadow-sm'
      }
    `}>
      {isTopResult && (
        <div className="bg-emerald-500 dark:bg-emerald-600 px-4 py-1.5 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-white text-xs font-black uppercase tracking-widest">Top Match</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800/80 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 leading-tight">
              {result.disease}
            </h3>
            {/* Confidence bar */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to from-emerald-400 to-emerald-600 transition-all duration-700"
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <span className="text-xs font-black text-gray-600 dark:text-gray-400 w-10 text-right">
                {result.score}%
              </span>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wider font-semibold">
              Confidence Score
            </p>
          </div>
          <SeverityBadge severity={result.riskLevel.severity} label={result.riskLevel.label} />
        </div>

        {/* Variety note */}
        {result.varietyNote && (
          <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4 text-sm">
            <span className="text-blue-500 shrink mt-0.5">ℹ️</span>
            <div>
              <span className="font-bold text-blue-800 dark:text-blue-300 block text-xs uppercase tracking-wider mb-0.5">Variety Note</span>
              <span className="text-blue-700 dark:text-blue-300 leading-relaxed">{result.varietyNote}</span>
            </div>
          </div>
        )}

        {/* Treatment & Prevention */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <span>💊</span>
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Treatment
              </h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.treatment}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Prevention
              </h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.prevention}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
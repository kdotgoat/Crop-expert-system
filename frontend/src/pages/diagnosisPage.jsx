import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDiagnosis from '../hooks/useDiagnosis.js';
import useLanguage from '../hooks/useLanguage.js';
import useTheme from '../hooks/useTheme.js';
import CropSelector from '../components/cropSelector.jsx';
import SymptomChecklist from '../components/symptomChecklist.jsx';
import EnvironmentalInputs from '../components/enviromentalInputs.jsx';
import ResultCard from '../components/resultCard.jsx';
import ExplanationPanel from '../components/explanationPanel.jsx';

const STEPS = [
  { number: 1, label: 'Select Crop',   sw: 'Chagua Zao'  },
  { number: 2, label: 'Symptoms',      sw: 'Dalili'       },
  { number: 3, label: 'Results',       sw: 'Matokeo'      },
];

const CROP_EMOJI_MAP = {
  maize:'🌽',corn:'🌽',wheat:'🌾',rice:'🍚',tomato:'🍅',potato:'🥔',
  cassava:'🥔',beans: '🍃', bean: '🍃', soybean: '🍃',sorghum:'🌾',millet:'🌾',
  banana:'🍌',coffee:'☕',tea:'🍵',sugarcane:'🎋',cotton:'🌸',sunflower:'🌻',
  onion:'🧅',garlic:'🧄',carrot:'🥕',cabbage:'🥬',spinach:'🥬',avocado:'🥑',
  mango:'🥭',orange:'🍊',pineapple:'🍍',watermelon:'🍉',pea:'🫛',peas:'🫛',
  groundnut:'🥜',peanut:'🥜',pepper:'🌶️',chili:'🌶️',eggplant:'🍆',
  cucumber:'🥒',pumpkin:'🎃',yam:'🍠',lemon:'🍋',
};

function getCropEmoji(crop) {
  if (!crop) return '🌱';
  const id = (crop.id || '').toLowerCase();
  return CROP_EMOJI_MAP[id] ||
    Object.entries(CROP_EMOJI_MAP).find(([k]) => id.includes(k))?.[1] || '🌱';
}

export default function DiagnosisPage() {
  const [step, setStep] = useState(1);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage('en');
  const {
    crops, availableSymptoms, selectedCropId, selectedSymptoms,
    weather, variety, loading, error, results, diagnosisId,
    selectCrop, toggleSymptom, setWeather, setVariety,
    runDiagnosis, resetDiagnosis,
  } = useDiagnosis();

  const currentCropData = crops.find(c => c.id === selectedCropId);
  const activeStep = results ? 3 : step;
  const progressPct = ((activeStep - 1) / (STEPS.length - 1)) * 100;

  const handleReset = () => { resetDiagnosis(); setStep(1); };
  const handleRunDiagnosis = async () => { await runDiagnosis(); setStep(3); };

  return (
    <div className="min-h-screen bg-linear-to from-slate-50 via-white to-emerald-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8">

        {/* ── Header ── */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-linear-to from-emerald-700 via-green-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent leading-none mb-1">
              {t('Crop Expert System', 'Mfumo wa Mtaalam')}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-widest uppercase">
              {t('AI-Powered Disease Diagnosis', 'Uchunguzi wa Magonjwa kwa AI')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
            >
              ⚙️ Admin
            </Link>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
            >
              {theme === 'light' ? 'light' : 'dark'}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 shadow-sm transition-all"
            >
              {language === 'en' ? '🇰🇪 Swahili' : '🇬🇧 English'}
            </button>
          </div>
        </header>

        {/* ── Progress Stepper ── */}
        <div className="mb-8">
          <div className="relative flex items-center justify-between">
            {/* Track */}
            <div className="absolute top-5 inset-x-0 h-0.5 bg-gray-200 dark:bg-gray-700 mx-5 z-0" />
            {/* Fill */}
            <div
              className="absolute top-5 left-5 h-0.5 bg-emerald-500 dark:bg-emerald-400 z-0 transition-all duration-500 ease-in-out"
              style={{ width: `calc(${progressPct}% - 10px)` }}
            />
            {STEPS.map(s => {
              const done    = activeStep > s.number;
              const current = activeStep === s.number;
              const display = language === 'en' ? s.label : s.sw;
              return (
                <div key={s.number} className="relative z-10 flex flex-col items-center flex-1">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-300
                    ${done    ? 'bg-emerald-500 dark:bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900' : ''}
                    ${current ? 'bg-white dark:bg-gray-800 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 shadow-md ring-4 ring-emerald-100 dark:ring-emerald-900/50' : ''}
                    ${!done && !current ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400' : ''}
                  `}>
                    {done
                      ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : s.number
                    }
                  </div>
                  <span className={`
                    mt-2 text-[10px] font-black uppercase tracking-widest
                    ${current ? 'text-emerald-600 dark:text-emerald-400' : done ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-600'}
                  `}>
                    {display}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-6 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── Step Card ── */}
        <div className="bg-white dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden">

          {/* STEP 1 — Crop */}
          {activeStep === 1 && (
            <div className="p-6 md:p-8">
              <CropSelector
                crops={crops}
                selectedCropId={selectedCropId}
                onSelectCrop={selectCrop}
              />
              <div className="flex justify-end mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedCropId}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl shadow-md shadow-emerald-200 dark:shadow-emerald-900/40 transition-all"
                >
                  {t('Next', 'Endelea')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Symptoms + Environment */}
          {activeStep === 2 && (
            <div className="p-6 md:p-8">
              {/* Crop context pill */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-2xl">{getCropEmoji(currentCropData)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500">Diagnosing</p>
                  <p className="text-sm font-black text-gray-800 dark:text-gray-200">{currentCropData?.label}</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                >
                  {t('Change', 'Badilisha')}
                </button>
              </div>

              <SymptomChecklist
                symptoms={availableSymptoms}
                selectedSymptoms={selectedSymptoms}
                onToggleSymptom={toggleSymptom}
              />

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <EnvironmentalInputs
                  selectedCrop={currentCropData}
                  variety={variety}
                  setVariety={setVariety}
                  weather={weather}
                  setWeather={setWeather}
                  t={t}
                />
              </div>

              <div className="flex justify-between mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-black rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('Back', 'Rudi')}
                </button>
                <button
                  onClick={handleRunDiagnosis}
                  disabled={loading || selectedSymptoms.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl shadow-md shadow-emerald-200 dark:shadow-emerald-900/40 transition-all"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      {t('Analyzing...', 'Inachanganua...')}
                    </>
                  ) : (
                    <>
                      {t('Run Diagnosis', 'Fanya Uchunguzi')}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Results */}
          {activeStep === 3 && (
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
                    Step 3 of 3
                  </p>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                    {t('Diagnosis Results', 'Matokeo ya Uchunguzi')}
                  </h2>
                  {results && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {results.length} {t('condition(s) found', 'hali zilizopatikana')}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('New Diagnosis', 'Uchunguzi Mpya')}
                </button>
              </div>

              <div className="space-y-4">
                {results?.map((result, index) => (
                  <ResultCard key={index} result={result} index={index} />
                ))}
              </div>

              {diagnosisId && (
                <div className="mt-6">
                  <ExplanationPanel diagnosisId={diagnosisId} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6 font-medium">
          {t('For guidance only. Consult an agronomist for serious cases.', 'Kwa mwongozo tu. Wasiliana na mtaalamu wa kilimo kwa kesi nzito.')}
        </p>
      </div>
    </div>
  );
}
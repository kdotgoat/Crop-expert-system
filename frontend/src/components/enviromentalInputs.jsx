const WEATHER_OPTIONS = [
  { id: 'rainy',  label: 'Rainy',    sw: 'Mvua',    icon: '🌧️' },
  { id: 'humid',  label: 'Humid',    sw: 'Unyevu',  icon: '💧' },
  { id: 'dry',    label: 'Dry season', sw: 'Ukame',   icon: '☀️' },
  { id: 'warm',   label: 'Warm',     sw: 'Joto',    icon: '🌡️' },
  { id: 'cool',   label: 'Cool',     sw: 'Baridi',  icon: '❄️' },
];

export default function EnvironmentalInputs({ selectedCrop, variety, setVariety, weather, setWeather, t }) {
  const toggleWeather = (id) => {
    setWeather(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
        Step 2 of 3 — Environment
      </p>
      <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-1">
        {t('Environment & Variety', 'Mazingira na Aina')}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {t('These details improve diagnosis accuracy.', 'Maelezo haya yanaboresha usahihi wa uchunguzi.')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Variety */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
            {t('Crop Variety', 'Aina ya Mbegu')}
          </label>
          <div className="relative">
            <select
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors cursor-pointer"
            >
              <option value="">— {t('Select Variety', 'Chagua Aina')} —</option>
              {selectedCrop?.varieties?.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {!selectedCrop?.varieties?.length && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 italic">
              {t('No varieties defined for this crop.', 'Hakuna aina zilizofafanuliwa.')}
            </p>
          )}
        </div>

        {/* Weather */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
            {t('Current Weather', 'Hali ya Hewa')}
            <span className="ml-2 text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">
              ({t('select all that apply', 'chagua zote zinazofaa')})
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {WEATHER_OPTIONS.map(opt => {
              const active = weather.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleWeather(opt.id)}
                  className={`
                    flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 text-sm font-bold transition-all
                    ${active
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 shadow-sm scale-105'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-600'
                    }
                  `}
                >
                  <span>{opt.icon}</span>
                  <span>{t(opt.label, opt.sw)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
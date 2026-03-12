export default function CropSelector({ crops, selectedCropId, onSelectCrop }) {
  if (!crops || crops.length === 0) return null;

  const CROP_EMOJI_MAP = {
    maize:'🌽',corn:'🌽',wheat:'🌾',rice:'🍚',tomato:'🍅',potato:'🥔',
    cassava:'🥔',beans: '🍃', bean: '🍃', soybean: '🍃',sorghum:'🌾',millet:'🌾',
    banana:'🍌',coffee:'☕',tea:'🍵',sugarcane:'🎋',cotton:'🌸',sunflower:'🌻',
    onion:'🧅',garlic:'🧄',carrot:'🥕',cabbage:'🥬',spinach:'🥬',avocado:'🥑',
    mango:'🥭',orange:'🍊',pineapple:'🍍',watermelon:'🍉',pea:'🫛',peas:'🫛',
    groundnut:'🥜',peanut:'🥜',pepper:'🌶️',chili:'🌶️',eggplant:'🍆',
    cucumber:'🥒',pumpkin:'🎃',yam:'🍠',sweet_potato:'🍠',lemon:'🍋',
  };

  const getEmoji = (crop) => {
    const id = (crop.id || '').toLowerCase();
    const label = (crop.label || '').toLowerCase();
    return (
      CROP_EMOJI_MAP[id] ||
      CROP_EMOJI_MAP[label] ||
      Object.entries(CROP_EMOJI_MAP).find(([k]) => id.includes(k))?.[1] ||
      Object.entries(CROP_EMOJI_MAP).find(([k]) => label.includes(k))?.[1] ||
      '🌱'
    );
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
        Step 1 of 3
      </p>
      <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1 tracking-tight">
        Which crop needs diagnosis?
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Select the crop you are growing to get started.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {crops.map(crop => {
          const isSelected = selectedCropId === crop.id;
          return (
            <button
              key={crop.id}
              onClick={() => onSelectCrop(crop.id)}
              className={`
                group relative flex flex-col items-center justify-center p-4 rounded-2xl
                transition-all duration-200 cursor-pointer text-center
                ${isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30 scale-[1.02]'
                  : 'bg-white dark:bg-gray-800/80 hover:shadow-md hover:-translate-y-0.5'
                }
              `}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Emoji */}
              <div className={`
                w-14 h-14 mb-3 rounded-xl flex items-center justify-center text-4xl
                transition-all duration-200 group-hover:scale-110
                ${isSelected
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-700/50'
                }
              `}>
                {getEmoji(crop)}
              </div>

              <span className={`
                font-bold text-sm tracking-tight leading-tight
                ${isSelected
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-gray-800 dark:text-gray-200'
                }
              `}>
                {crop.label}
              </span>

              {crop.swahili && (
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wider">
                  {crop.swahili}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
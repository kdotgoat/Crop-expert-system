import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDiagnosis from '../hooks/useDiagnosis.js';
import useAdmin from '../hooks/useAdmin.js';
import DiseaseEditor from '../components/admin/diseaseEditor.jsx';

const CROP_EMOJI_MAP = {
  maize:'🌽',corn:'🌽',wheat:'🌾',rice:'🍚',tomato:'🍅',potato:'🥔',
  cassava:'🥔',beans: '🍃', bean: '🍃', soybean: '🍃',soybean:'🫘',sorghum:'🌾',millet:'🌾',
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

export default function AdminPage() {
  const { crops, selectCrop, selectedCropId } = useDiagnosis();
  const { updateDisease, addSymptom, loading, error, successMessage, clearMessages } = useAdmin();

  const [activeTab, setActiveTab] = useState('diseases');
  const [newSymptom, setNewSymptom] = useState({ id: '', label: '', swahili: '' });

  const currentCrop = crops.find(c => c.id === selectedCropId);
  const diseaseCount = currentCrop?.diseases ? Object.keys(currentCrop.diseases).length : 0;

  const handleAddSymptom = async (e) => {
    e.preventDefault();
    const success = await addSymptom(selectedCropId, newSymptom.id, {
      label: newSymptom.label,
      swahili: newSymptom.swahili,
    });
    if (success) setNewSymptom({ id: '', label: '', swahili: '' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* ── Top Nav ── */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest uppercase text-white">Knowledge Base</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Admin Console</p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 text-xs font-bold transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Diagnosis
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Alerts ── */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 text-sm font-medium">
            <span>⚠️</span> {error}
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-900/20 border border-emerald-800/50 rounded-xl text-emerald-400 text-sm font-medium">
            <span>✅</span> {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 px-1">
              Crops
            </p>
            <div className="space-y-1">
              {crops.map(crop => {
                const isActive = selectedCropId === crop.id;
                return (
                  <button
                    key={crop.id}
                    onClick={() => { selectCrop(crop.id); clearMessages(); setActiveTab('diseases'); }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-semibold
                      ${isActive
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      }
                    `}
                  >
                    <span className="text-lg">{getCropEmoji(crop)}</span>
                    <span className="flex-1 truncate">{crop.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Main Panel ── */}
          <div className="lg:col-span-3">
            {!selectedCropId ? (
              <div className="h-72 flex flex-col items-center justify-center text-gray-600 rounded-2xl bg-gray-900/50">
                <span className="text-4xl mb-3">🌱</span>
                <p className="text-sm font-semibold">Select a crop to start editing</p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-2xl overflow-hidden">

                {/* Panel Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCropEmoji(currentCrop)}</span>
                    <div>
                      <h2 className="font-black text-white text-base">{currentCrop?.label}</h2>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                        {diseaseCount} disease rules
                      </p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex bg-gray-800 rounded-xl p-1 gap-1">
                    {['diseases', 'symptoms'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                          px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all
                          ${activeTab === tab
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-gray-400 hover:text-gray-200'
                          }
                        `}
                      >
                        {tab === 'diseases' ? '🦠 Diseases' : '🔬 Symptoms'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">

                  {activeTab === 'diseases' && (
                    <DiseaseEditor
                      cropId={selectedCropId}
                      diseases={currentCrop?.diseases}
                      onUpdate={updateDisease}
                      loading={loading}
                    />
                  )}

                  {activeTab === 'symptoms' && (
                    <div>
                      <div className="mb-6">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Add New Symptom</p>
                        <p className="text-sm text-gray-400">New symptoms will be immediately available in the diagnosis form.</p>
                      </div>

                      <form onSubmit={handleAddSymptom} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                              Symptom ID
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. yellow-leaves"
                              value={newSymptom.id}
                              onChange={(e) => setNewSymptom({...newSymptom, id: e.target.value})}
                              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                              English Label
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Yellowing leaves"
                              value={newSymptom.label}
                              onChange={(e) => setNewSymptom({...newSymptom, label: e.target.value})}
                              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                              Swahili Label
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Majani ya njano"
                              value={newSymptom.swahili}
                              onChange={(e) => setNewSymptom({...newSymptom, swahili: e.target.value})}
                              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-black rounded-xl transition-all shadow-md shadow-emerald-900/50"
                        >
                          {loading ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                              </svg>
                              Adding...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                              Add Symptom
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
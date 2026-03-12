import { useState } from 'react';

export default function DiseaseEditor({ cropId, diseases, onUpdate, loading }) {
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({ treatment: '', prevention: '', baseConfidence: 0 });

  const handleEditClick = (name, data) => {
    setEditingKey(name);
    setFormData({
      treatment: data.treatment,
      prevention: data.prevention,
      baseConfidence: data.baseConfidence,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onUpdate(cropId, editingKey, formData);
    if (success) setEditingKey(null);
  };

  if (!diseases) return (
    <div className="text-center py-12 text-gray-600 text-sm">
      No disease rules found for this crop.
    </div>
  );

  const entries = Object.entries(diseases);

  return (
    <div className="space-y-3">
      {/* Summary row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">
          {entries.length} disease rules
        </p>
        {editingKey && (
          <button
            onClick={() => setEditingKey(null)}
            className="text-xs text-gray-500 hover:text-gray-300 font-semibold transition-colors"
          >
            ✕ Close editor
          </button>
        )}
      </div>

      {entries.map(([name, data]) => {
        const isEditing = editingKey === name;
        const cf = data.baseConfidence;
        const cfColor = cf >= 80 ? 'text-emerald-400' : cf >= 60 ? 'text-yellow-400' : 'text-red-400';
        const cfBg   = cf >= 80 ? 'bg-emerald-400' : cf >= 60 ? 'bg-yellow-400' : 'bg-red-400';

        return (
          <div
            key={name}
            className={`rounded-xl overflow-hidden transition-all duration-200 ${
              isEditing ? 'bg-gray-800 ring-1 ring-emerald-500/40' : 'bg-gray-800/60 hover:bg-gray-800'
            }`}
          >
            {/* ── Row header ── */}
            <div className="flex items-center gap-4 px-5 py-4">
              {/* CF indicator */}
              <div className="shrink w-10 h-10 rounded-lg bg-gray-900 flex flex-col items-center justify-center">
                <span className={`text-sm font-black leading-none ${cfColor}`}>{cf}</span>
                <span className="text-[9px] text-gray-600 uppercase font-bold">CF</span>
              </div>

              {/* Name + rule */}
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-white text-sm leading-tight truncate">{name}</h4>
                <span className="text-[10px] font-mono text-gray-500">{data.clpRule}</span>
              </div>

              {/* CF bar */}
              <div className="hidden sm:flex flex-col items-end gap-1 w-24">
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cfBg}`}
                    style={{ width: `${cf}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-semibold">{cf}% confidence</span>
              </div>

              {/* Edit / Collapse button */}
              <button
                onClick={() => isEditing ? setEditingKey(null) : handleEditClick(name, data)}
                className={`
                  shrink flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all
                  ${isEditing
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40'
                  }
                `}
              >
                {isEditing ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                    Collapse
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </>
                )}
              </button>
            </div>

            {/* ── Collapsed preview ── */}
            {!isEditing && (
              <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-700/50 pt-3">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">Treatment</span>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{data.treatment}</p>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">Prevention</span>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{data.prevention}</p>
                </div>
              </div>
            )}

            {/* ── Edit Form ── */}
            {isEditing && (
              <form onSubmit={handleSubmit} className="px-5 pb-6 border-t border-gray-700/50 pt-5 space-y-5">

                {/* CF slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Base Certainty Factor
                    </label>
                    <span className={`text-sm font-black ${cfColor}`}>{formData.baseConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.baseConfidence}
                    onChange={(e) => setFormData({...formData, baseConfidence: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[9px] text-gray-600 mt-1 font-semibold">
                    <span>0% — Uncertain</span>
                    <span>100% — Definitive</span>
                  </div>
                </div>

                {/* Treatment */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    💊 Treatment Instructions
                  </label>
                  <textarea
                    value={formData.treatment}
                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none leading-relaxed placeholder-gray-600"
                    placeholder="Describe the treatment approach..."
                  />
                </div>

                {/* Prevention */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    🛡️ Prevention Strategies
                  </label>
                  <textarea
                    value={formData.prevention}
                    onChange={(e) => setFormData({...formData, prevention: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none leading-relaxed placeholder-gray-600"
                    placeholder="Describe prevention strategies..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingKey(null)}
                    className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-black rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
}
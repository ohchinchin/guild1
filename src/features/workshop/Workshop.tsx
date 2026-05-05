import { useGame } from '../../context/GameContext';
import { MATERIALS, SYNTHESIS_RECIPES } from '../../logic/workshop';

export const Workshop = () => {
  const { state, synthesizeItem } = useGame();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-amber-500 tracking-tighter uppercase italic">Workshop</h2>
          <p className="text-stone-500 font-bold text-sm tracking-widest">工廠：素材の錬成と秘宝の創造</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Material Inventory */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-stone-400 font-bold text-xs uppercase tracking-widest border-b border-stone-800 pb-2">所持素材</h3>
          <div className="grid grid-cols-2 gap-2">
            {MATERIALS.map(m => (
              <div key={m.id} className="bg-stone-900/50 p-3 rounded-xl border border-stone-800 flex flex-col items-center text-center">
                <span className="text-stone-500 text-[10px] font-bold uppercase">{m.rank} Rank</span>
                <span className="text-stone-300 font-bold text-sm">{m.name}</span>
                <span className="text-amber-500 font-black text-xl mt-1">x{state.materials[m.id] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Synthesis Recipes */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-stone-400 font-bold text-xs uppercase tracking-widest border-b border-stone-800 pb-2">錬成レシピ</h3>
          <div className="space-y-4">
            {SYNTHESIS_RECIPES.map(r => {
              const canSynthesize = r.requiredMaterials.every(req => (state.materials[req.materialId] || 0) >= req.count) && state.fame >= r.requiredFame;
              
              return (
                <div key={r.id} className={`bg-stone-900/80 p-6 rounded-2xl border ${canSynthesize ? 'border-amber-500/50' : 'border-stone-800'} transition-all`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-stone-200">{r.name}</h4>
                      <p className="text-stone-500 text-sm mt-1">{r.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-500 uppercase font-bold tracking-widest">必要名声</span>
                      <p className={`text-lg font-black ${state.fame >= r.requiredFame ? 'text-amber-400' : 'text-stone-600'}`}>{r.requiredFame}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    {r.requiredMaterials.map(req => {
                      const m = MATERIALS.find(mat => mat.id === req.materialId);
                      const current = state.materials[req.materialId] || 0;
                      return (
                        <div key={req.materialId} className="flex items-center gap-2 bg-stone-950 px-3 py-2 rounded-lg border border-stone-800">
                          <span className="text-stone-400 text-xs font-bold">{m?.name}</span>
                          <span className={`text-sm font-black ${current >= req.count ? 'text-green-500' : 'text-red-500'}`}>
                            {current} / {req.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => synthesizeItem(r.id)}
                    disabled={!canSynthesize}
                    className={`w-full py-3 rounded-xl font-black transition-all ${canSynthesize ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg' : 'bg-stone-800 text-stone-600 cursor-not-allowed'}`}
                  >
                    {canSynthesize ? '錬成を実行する' : '素材不足'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

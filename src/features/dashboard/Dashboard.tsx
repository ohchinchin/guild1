import { useGame } from '../../context/GameContext';
import { Target, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import { GUILD_OBJECTIVES } from '../../logic/objectives';
import { MATERIALS } from '../../logic/workshop';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { state } = useGame();
  
  const currentObjective = GUILD_OBJECTIVES.find(o => o.rank === state.guildRank);

  return (
    <div className="space-y-6">
      {/* Current Objective Panel (Main Backbone) */}
      {currentObjective && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-amber-900/40 to-stone-900 border-2 border-amber-600/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-32 h-32 text-amber-500" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-amber-500 font-black text-xs uppercase tracking-widest">Current Objective</h3>
                <h2 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter uppercase underline decoration-amber-500/30 underline-offset-4">
                  {currentObjective.title}
                </h2>
              </div>
            </div>

            <p className="text-stone-300 text-lg leading-relaxed font-serif italic border-l-4 border-amber-700/50 pl-4">
              「{currentObjective.description}」
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className={`p-4 rounded-2xl border ${state.fame >= currentObjective.requiredFame ? 'bg-amber-900/20 border-amber-500/50' : 'bg-stone-950/50 border-stone-800'}`}>
                <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-1">Required Prestige</p>
                <div className="flex justify-between items-end">
                  <span className={`text-xl font-black ${state.fame >= currentObjective.requiredFame ? 'text-amber-400' : 'text-stone-600'}`}>
                    {state.fame} / {currentObjective.requiredFame}
                  </span>
                  {state.fame >= currentObjective.requiredFame && <Sparkles className="w-4 h-4 text-amber-500 mb-1" />}
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${state.budget >= currentObjective.requiredBudget ? 'bg-amber-900/20 border-amber-500/50' : 'bg-stone-950/50 border-stone-800'}`}>
                <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-1">Required Budget</p>
                <div className="flex justify-between items-end">
                  <span className={`text-xl font-black ${state.budget >= currentObjective.requiredBudget ? 'text-amber-400' : 'text-stone-600'}`}>
                    {state.budget.toLocaleString()} / {currentObjective.requiredBudget.toLocaleString()}
                  </span>
                  {state.budget >= currentObjective.requiredBudget && <Sparkles className="w-4 h-4 text-amber-500 mb-1" />}
                </div>
              </div>

              {currentObjective.requiredMaterials && currentObjective.requiredMaterials.map(req => {
                const m = MATERIALS.find(mat => mat.id === req.materialId);
                const current = state.materials[req.materialId] || 0;
                const isMet = current >= req.count;
                return (
                  <div key={req.materialId} className={`p-4 rounded-2xl border ${isMet ? 'bg-amber-900/20 border-amber-500/50' : 'bg-stone-950/50 border-stone-800'}`}>
                    <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-1">Material: {m?.name}</p>
                    <div className="flex justify-between items-end">
                      <span className={`text-xl font-black ${isMet ? 'text-amber-400' : 'text-stone-600'}`}>
                        {current} / {req.count}
                      </span>
                      {isMet && <Sparkles className="w-4 h-4 text-amber-500 mb-1" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats and Guild Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-stone-900/60 p-6 rounded-2xl border border-stone-800">
          <h3 className="text-stone-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" /> Guild Standing
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-stone-500 uppercase">Rank</p>
              <p className="text-3xl font-black text-white italic tracking-tighter">{state.guildRank}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-stone-500 uppercase">Active Adventurers</p>
              <p className="text-3xl font-black text-blue-400">{state.adventurers.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-stone-500 uppercase">Artifacts Found</p>
              <p className="text-3xl font-black text-purple-400">{state.artifacts.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-stone-500 uppercase">Town Favor</p>
              <p className="text-3xl font-black text-emerald-400">{state.townFavor}%</p>
            </div>
          </div>
        </div>

        <div className="bg-stone-900/60 p-6 rounded-2xl border border-stone-800 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Story Progress</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className={`h-3 flex-1 rounded-full transition-all duration-1000 ${
                  state.storyProgress >= i ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-stone-800'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-stone-500 mt-2 text-center uppercase font-bold tracking-tighter">
            {state.storyProgress} / 4 Relics Restored
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-stone-900/40 p-6 rounded-2xl border border-stone-800/50">
          <h3 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-4">Latest Logs</h3>
          <div className="space-y-3">
            {state.logs.slice(0, 5).map(log => (
              <div key={log.id} className="flex gap-3 text-sm">
                <span className="text-stone-600 font-mono">T{log.turn}</span>
                <span className={
                  log.type === 'success' ? 'text-emerald-400' :
                  log.type === 'danger' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-amber-400' : 'text-stone-300'
                }>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-900/40 p-6 rounded-2xl border border-stone-800/50">
          <h3 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-4">Current Policy</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center">
              <TrendingUp className="text-amber-600" />
            </div>
            <div>
              <p className="text-white font-bold capitalize">{state.policy} Operations</p>
              <p className="text-stone-500 text-xs mt-1">ギルドの基本方針に基づいてリソース配分が行われています。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import { Map, Users, Shield, ArrowRight, XCircle, PlusCircle, RefreshCcw } from 'lucide-react';

export const Dungeons = () => {
  const { state, dispatchDungeon, recallDungeon, addLog } = useGame();
  const availableDungeons = state.dungeons.filter(d => d.isDiscovered);
  const standbyAdventurers = state.adventurers.filter(a => a.status === '待機中');

  const [selectedDungeonId, setSelectedDungeonId] = useState<string | null>(null);
  const [selectedAdvIds, setSelectedAdvIds] = useState<string[]>([]);
  const [isReinforcing, setIsReinforcing] = useState(false);

  const toggleAdventurer = (advId: string) => {
    setSelectedAdvIds(prev => 
      prev.includes(advId) ? prev.filter(id => id !== advId) : [...prev, advId]
    );
  };

  const handleStartDispatch = (dungeonId: string) => {
    setSelectedDungeonId(dungeonId);
    setSelectedAdvIds([]);
    setIsReinforcing(false);
  };

  const handleStartReinforce = (dungeonId: string) => {
    setSelectedDungeonId(dungeonId);
    setSelectedAdvIds([]);
    setIsReinforcing(true);
  };

  const handleExecute = () => {
    if (!selectedDungeonId || selectedAdvIds.length === 0) return;
    
    if (isReinforcing) {
      const dungeon = state.dungeons.find(d => d.id === selectedDungeonId);
      if (dungeon) {
        dispatchDungeon(selectedDungeonId, [...dungeon.assignedAdventurers, ...selectedAdvIds]);
        addLog(`迷宮に援軍を送り出した。`, 'success');
      }
    } else {
      dispatchDungeon(selectedDungeonId, selectedAdvIds);
    }
    
    setSelectedDungeonId(null);
    setSelectedAdvIds([]);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div className="flex justify-between items-end border-b border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
          <Map className="w-6 h-6" /> 未踏迷宮の探索
        </h2>
        <p className="text-stone-400">発見済み: {availableDungeons.length} 箇所</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {availableDungeons.map(dungeon => {
          const isExploring = dungeon.assignedAdventurers.length > 0;
          const progressPercent = Math.min(100, (dungeon.progress / dungeon.maxProgress) * 100);
          const currentTeamPower = dungeon.assignedAdventurers.reduce((sum, advId) => {
             const adv = state.adventurers.find(a => a.id === advId);
             return sum + (adv?.power || 0);
          }, 0);

          return (
            <div key={dungeon.id} className="bg-stone-900 border-2 border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col xl:flex-row">
              {/* Dungeon Basic Info */}
              <div className="p-6 bg-stone-950 border-b xl:border-b-0 xl:border-r border-stone-800 xl:w-1/3 flex flex-col">
                {dungeon.imageUrl && (
                  <div className="w-full h-32 mb-4 rounded-xl overflow-hidden border border-stone-800 shrink-0">
                    <img src={dungeon.imageUrl} alt={dungeon.name} className="w-full h-full object-cover opacity-60" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-stone-100">{dungeon.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                    dungeon.rank === 'S' ? 'bg-amber-600/20 border-amber-500 text-amber-500' :
                    dungeon.rank === 'A' ? 'bg-purple-600/20 border-purple-500 text-purple-500' :
                    dungeon.rank === 'B' ? 'bg-blue-600/20 border-blue-500 text-blue-500' :
                    'bg-stone-700/20 border-stone-600 text-stone-400'
                  }`}>RANK {dungeon.rank}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 flex items-center gap-1"><Shield className="w-3 h-3" /> 推奨戦力:</span>
                    <span className="text-amber-500 font-bold">{dungeon.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 flex items-center gap-1"><RefreshCcw className="w-3 h-3" /> 踏破回数:</span>
                    <span className="text-stone-300">{dungeon.clearedCount} 回</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                      <span className="text-stone-500">Progress</span>
                      <span className="text-blue-400">{Math.floor(progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="bg-gradient-to-r from-blue-900 to-blue-500 h-full shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                      />
                    </div>
                  </div>
                  {isExploring && (
                    <div className="pt-4 mt-4 border-t border-stone-800">
                      <p className="text-[10px] text-stone-500 uppercase font-bold mb-2">現在の部隊 ({dungeon.assignedAdventurers.length}名)</p>
                      <div className="flex -space-x-2">
                        {dungeon.assignedAdventurers.map(advId => {
                          const adv = state.adventurers.find(a => a.id === advId);
                          return (
                            <div key={advId} className="w-8 h-8 rounded-full border-2 border-stone-950 overflow-hidden bg-stone-800" title={adv?.name}>
                              <img src={adv?.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-2 text-xs text-stone-400 flex justify-between">
                        <span>合計戦力:</span>
                        <span className={currentTeamPower >= dungeon.difficulty ? 'text-green-400' : 'text-amber-500'}>
                          {currentTeamPower}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Area */}
              <div className="p-6 flex-1 bg-stone-900/40 backdrop-blur-sm relative overflow-hidden">
                {selectedDungeonId === dungeon.id ? (
                  <div className="h-full flex flex-col">
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-amber-500 mb-2">
                        {isReinforcing ? '援軍の編成' : '派遣部隊の編成'}
                      </h4>
                      {standbyAdventurers.length === 0 ? (
                        <p className="text-stone-600 text-xs italic">待機中の冒険者がいません。</p>
                      ) : (
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                          {standbyAdventurers.map(adv => (
                            <button
                              key={adv.id}
                              onClick={() => toggleAdventurer(adv.id)}
                              className={`px-3 py-1.5 rounded-lg border transition-all text-xs flex items-center gap-2 ${
                                selectedAdvIds.includes(adv.id)
                                  ? 'bg-amber-600 border-amber-400 text-white shadow-lg'
                                  : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                              }`}
                            >
                              <img src={adv.imageUrl} className="w-4 h-4 rounded-full" />
                              {adv.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={handleExecute}
                        disabled={selectedAdvIds.length === 0}
                        className="flex-1 py-3 bg-amber-700 hover:bg-amber-600 disabled:opacity-30 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        {isReinforcing ? '合流させる' : '派遣を開始'} <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => setSelectedDungeonId(null)} className="px-4 py-3 bg-stone-800 text-stone-400 rounded-xl hover:bg-stone-700">止める</button>
                    </div>
                  </div>
                ) : !isExploring ? (
                  <div className="h-full flex items-center justify-center">
                    <button 
                      onClick={() => handleStartDispatch(dungeon.id)}
                      className="w-full py-10 border-2 border-dashed border-stone-800 rounded-2xl text-stone-600 hover:border-amber-700/50 hover:text-amber-500 transition-all flex flex-col items-center justify-center gap-3 group"
                    >
                      <PlusCircle className="w-10 h-10 group-hover:scale-110 transition-transform" />
                      <span className="font-bold tracking-widest uppercase text-sm">部隊を編成して派遣する</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-stone-300 bg-stone-950/30 p-3 rounded-xl border border-stone-800/50">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                        <RefreshCcw className="w-5 h-5 text-amber-500" />
                      </motion.div>
                      <span className="text-xs font-bold">迷宮内を進行中... 次の季節に成果が報告されます。</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <button 
                        onClick={() => handleStartReinforce(dungeon.id)}
                        className="py-4 bg-stone-800 hover:bg-blue-900/30 hover:text-blue-400 text-stone-400 text-xs font-bold rounded-xl transition-all border border-stone-700/50 flex flex-col items-center justify-center gap-2"
                      >
                        <Users className="w-5 h-5" />
                        <span>援軍を送る</span>
                      </button>
                      <button 
                        onClick={() => recallDungeon(dungeon.id)}
                        className="py-4 bg-stone-800 hover:bg-red-900/30 hover:text-red-400 text-stone-400 text-xs font-bold rounded-xl transition-all border border-stone-700/50 flex flex-col items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>部隊を撤退させる</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

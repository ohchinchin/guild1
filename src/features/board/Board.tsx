import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import type { Quest } from '../../types';
import { Trophy, Skull, Heart, Coins, Clock, Swords } from 'lucide-react';

export const Board = () => {
  const { state, dispatchQuest, autoAssignQuest } = useGame();
  const availableQuests = state.quests.filter(q => q.status === '未受注');
  const standbyAdventurers = state.adventurers.filter(a => a.status === '待機中');

  // Local state to keep track of which adventurers are selected for which quest
  const [selectedForQuest, setSelectedForQuest] = useState<Record<string, string[]>>({});

  const toggleAdventurer = (questId: string, advId: string) => {
    setSelectedForQuest(prev => {
      const current = prev[questId] || [];
      if (current.includes(advId)) {
        return { ...prev, [questId]: current.filter(id => id !== advId) };
      } else {
        return { ...prev, [questId]: [...current, advId] };
      }
    });
  };

  const handleDispatch = (quest: Quest) => {
    const selected = selectedForQuest[quest.id] || [];
    if (selected.length === 0) return;
    dispatchQuest(quest.id, selected);
    setSelectedForQuest(prev => {
      const next = { ...prev };
      delete next[quest.id];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-stone-800 pb-4">
        <div>
          <h2 className="text-3xl font-black text-amber-500 italic uppercase tracking-tighter">依頼掲示板</h2>
          <p className="text-stone-500 text-sm font-sans">Guild Mission Board</p>
        </div>
        <p className="text-stone-400 text-sm">現在受注可能な依頼: <span className="text-amber-500 font-bold">{availableQuests.length}</span> 件</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {availableQuests.map(quest => {
          const selectedIds = selectedForQuest[quest.id] || [];
          const selectedAdvs = standbyAdventurers.filter(a => selectedIds.includes(a.id));
          const totalPower = selectedAdvs.reduce((sum, a) => sum + a.power, 0);
          const isEnoughPower = totalPower >= quest.requiredPower;

          return (
            <div key={quest.id} className="bg-stone-900 border-2 border-stone-700 rounded-xl overflow-hidden shadow-2xl flex flex-col group hover:border-amber-900/50 transition-all">
              <div className="p-4 bg-stone-950 border-b border-stone-800 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors">{quest.title}</h3>
                  <p className="text-sm text-stone-400 mt-1 italic">"{quest.description}"</p>
                </div>
                <button 
                  onClick={() => autoAssignQuest(quest.id)}
                  className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold border border-stone-600 rounded uppercase tracking-wider"
                >
                  自動編成
                </button>
              </div>
              
              <div className="p-4 flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2 text-xs bg-stone-950/50 p-3 rounded-lg border border-stone-800/50">
                  <div className="flex flex-col items-center justify-center p-1">
                    <span className="text-stone-500 uppercase mb-1 flex items-center gap-1"><Swords className="w-3 h-3" /> 必要戦力</span>
                    <span className="font-bold text-amber-500 text-base">{quest.requiredPower}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1 border-x border-stone-800">
                    <span className="text-stone-500 uppercase mb-1 flex items-center gap-1"><Coins className="w-3 h-3" /> 報酬金</span>
                    <span className="font-bold text-yellow-400 text-base">{quest.rewardBudget.toLocaleString()} G</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1">
                    <span className="text-stone-500 uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 期間</span>
                    <span className="font-bold text-stone-300 text-base">{quest.duration} ターン</span>
                  </div>
                </div>

                {/* Sub-rewards (Fame, Notoriety, Favor) */}
                <div className="flex justify-around py-2 border-y border-stone-800/50">
                  <div className={`flex items-center gap-2 text-sm ${quest.rewardFame >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    <Trophy className="w-4 h-4" />
                    <span className="font-bold">{quest.rewardFame > 0 ? `+${quest.rewardFame}` : quest.rewardFame}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${quest.rewardNotoriety > 0 ? 'text-red-500' : 'text-stone-600'}`}>
                    <Skull className="w-4 h-4" />
                    <span className="font-bold">+{quest.rewardNotoriety}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${quest.rewardTownFavor >= 0 ? 'text-emerald-400' : 'text-amber-600'}`}>
                    <Heart className="w-4 h-4" />
                    <span className="font-bold">{quest.rewardTownFavor > 0 ? `+${quest.rewardTownFavor}` : quest.rewardTownFavor}</span>
                  </div>
                </div>

                <div className="flex-1 border border-stone-800 rounded-lg p-3 bg-stone-950/20">
                  <div className="text-[10px] text-stone-500 uppercase font-sans mb-2 tracking-widest">派遣メンバー選択</div>
                  {standbyAdventurers.length === 0 ? (
                    <p className="text-stone-600 text-sm italic">待機中の冒険者がいません。</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {standbyAdventurers.map(adv => (
                        <button
                          key={adv.id}
                          onClick={() => toggleAdventurer(quest.id, adv.id)}
                          disabled={Object.entries(selectedForQuest).some(([qId, ids]) => qId !== quest.id && ids.includes(adv.id))}
                          className={`px-3 py-1 text-xs border rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                            selectedIds.includes(adv.id)
                              ? 'bg-amber-900 border-amber-500 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                              : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                          }`}
                        >
                          {adv.name} ({adv.power})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-stone-500 uppercase text-[10px] block">現在戦力</span>
                  <span className={`font-bold text-lg ${isEnoughPower ? 'text-green-400' : 'text-red-400'}`}>
                    {totalPower}
                  </span>
                  <span className="text-stone-500"> / {quest.requiredPower}</span>
                </div>
                <button
                  onClick={() => handleDispatch(quest)}
                  disabled={selectedIds.length === 0}
                  className="px-8 py-3 bg-gradient-to-br from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 disabled:from-stone-800 disabled:to-stone-900 disabled:text-stone-600 text-white font-black rounded-lg shadow-xl transition-all active:scale-95 cursor-pointer border border-red-800/30 uppercase tracking-widest"
                >
                  出撃開始
                </button>
              </div>
            </div>
          );
        })}
        {availableQuests.length === 0 && (
          <div className="col-span-full py-20 text-center bg-stone-900/40 rounded-2xl border-2 border-dashed border-stone-800">
            <Clock className="w-12 h-12 mx-auto text-stone-700 mb-4" />
            <p className="text-stone-500 font-serif italic text-lg">現在、新たな依頼は届いていません。次なる報せを待ちましょう。</p>
          </div>
        )}
      </div>
    </div>
  );
};

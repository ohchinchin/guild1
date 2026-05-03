import { useGame } from '../../context/GameContext';

export const Dashboard = () => {
  const { state } = useGame();

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400 border-green-900/50 bg-green-900/10';
      case 'danger': return 'text-red-400 border-red-900/50 bg-red-900/10';
      case 'warning': return 'text-yellow-400 border-yellow-900/50 bg-yellow-900/10';
      default: return 'text-stone-300 border-stone-800 bg-stone-800/30';
    }
  };

  const activeQuests = state.quests.filter(q => q.status === '進行中');
  
  // Projection calculations
  const baseIncome = (50 * state.facilities.tavern) + (state.policy === 'economic' ? 100 : 0);
  const upkeepPerHead = Math.max(2, 12 - state.shops.item);
  let totalUpkeep = state.adventurers.length * upkeepPerHead;
  state.assistants.forEach(a => { if (a.isHired) totalUpkeep += a.cost; });
  const netIncome = baseIncome - totalUpkeep;

  const nextBossTurn = state.turn < 10 ? 10 : state.turn < 30 ? 30 : 50;
  const turnsToBoss = nextBossTurn - state.turn;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Guild Status */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-stone-900 p-6 rounded-xl border-2 border-stone-700 shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-amber-500 border-b border-stone-700 pb-2">ギルド概況</h2>
          <ul className="space-y-3 text-stone-300 text-sm">
            <li className="flex justify-between"><span>所属冒険者</span> <span className="font-bold text-white">{state.adventurers.length} / {state.facilities.dorm * 5} 名</span></li>
            <li className="flex justify-between"><span>街の好感度</span> <span className="font-bold text-blue-400">{state.townFavor} / 100</span></li>
            
            <div className="border-t border-stone-700 pt-3 mt-3">
              <li className="flex justify-between text-xs text-stone-500"><span>基礎収入</span> <span>+{baseIncome} G</span></li>
              <li className="flex justify-between text-xs text-stone-500"><span>維持費合計</span> <span>-{totalUpkeep} G</span></li>
              <li className="flex justify-between font-bold mt-1">
                <span>次ターン予想収支</span> 
                <span className={netIncome >= 0 ? "text-green-400" : "text-red-400"}>{netIncome > 0 ? '+' : ''}{netIncome} G</span>
              </li>
            </div>
          </ul>
        </div>

        <div className="bg-stone-900 p-6 rounded-xl border-2 border-red-900 shadow-2xl">
          <h2 className="text-lg font-bold mb-2 text-red-500 flex justify-between">
            <span>厄災の接近</span>
            <span>Turn {nextBossTurn}</span>
          </h2>
          <p className="text-stone-400 text-sm mb-2">あと <span className="font-bold text-white text-xl mx-1">{turnsToBoss}</span> ターンでボスが街を襲撃する。</p>
          <p className="text-xs text-stone-500">※全冒険者の戦力、街の好感度、ライバルとの協力が鍵となる。</p>
        </div>

        {activeQuests.length > 0 && (
          <div className="bg-stone-900 p-6 rounded-xl border border-stone-700 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 text-amber-500">進行中の依頼</h2>
            <div className="space-y-4">
              {activeQuests.map(q => (
                <div key={q.id} className="p-3 bg-stone-950 border border-stone-800 rounded">
                  <div className="font-bold text-stone-200">{q.title}</div>
                  <div className="text-xs text-stone-500 mt-1">残り {q.duration} ターン</div>
                  <div className="text-xs text-amber-600 mt-1">派遣中: {q.assignedAdventurers.length} 名</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Activity Log */}
      <div className="lg:col-span-2 bg-stone-900 p-6 rounded-xl border-2 border-stone-700 shadow-2xl flex flex-col h-[600px]">
        <h2 className="text-xl font-bold mb-4 text-amber-500 border-b border-stone-700 pb-2">活動記録 (News)</h2>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {state.logs.map((log) => (
            <div key={log.id} className={`p-3 rounded border-l-4 ${getLogColor(log.type)}`}>
              <div className="text-xs opacity-60 mb-1">Turn {log.turn}</div>
              <div className="text-sm font-medium">{log.message}</div>
            </div>
          ))}
          {state.logs.length === 0 && (
            <div className="text-stone-500 italic">記録はまだありません。</div>
          )}
        </div>
      </div>
    </div>
  );
};

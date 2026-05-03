import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';

type FacilitiesProps = {
  onHover?: (id: string | null) => void;
};

export const Facilities = ({ onHover }: FacilitiesProps) => {
  const { state, upgradeFacility } = useGame();

  const facilities = [
    { id: 'dorm', name: '宿舎', desc: '雇用上限を拡大する', baseCost: 1000 },
    { id: 'tavern', name: '酒場', desc: '毎ターンの基本収入を増加させる', baseCost: 800 },
    { id: 'training', name: '訓練場', desc: '任務成功時のステータス成長率を向上', baseCost: 1500 },
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end border-b border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-amber-500">ギルド本部（施設拡張）</h2>
        <p className="text-stone-400">雇用枠: <span className="text-white">{state.adventurers.length} / {state.facilities.dorm * 5}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {facilities.map(fac => {
          const level = state.facilities[fac.id];
          const cost = fac.baseCost * level;
          return (
            <div 
              key={fac.id} 
              className="bg-stone-900 border-2 border-stone-700 rounded-lg p-5 shadow-xl flex flex-col group hover:border-amber-600 transition-colors"
              onMouseEnter={() => onHover?.(fac.id)}
              onMouseLeave={() => onHover?.(null)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-stone-100">{fac.name}</h3>
                <span className="px-2 py-1 bg-stone-800 rounded text-xs text-amber-500 font-bold">Lv.{level}</span>
              </div>
              <p className="text-sm text-stone-400 mb-6 flex-1">{fac.desc}</p>
              
              <div className="mt-auto pt-4 border-t border-stone-800 flex justify-between items-center">
                <span className="text-yellow-500 font-bold">{cost} G</span>
                <button 
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 disabled:bg-stone-800 disabled:text-stone-600 text-amber-100 rounded transition-all cursor-pointer shadow-lg active:scale-95"
                  disabled={state.budget < cost}
                  onClick={() => upgradeFacility(fac.id, cost)}
                >
                  拡張する
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

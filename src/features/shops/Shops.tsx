import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';

export const Shops = () => {
  const { state, upgradeShop } = useGame();

  const shops = [
    { id: 'smith', name: '鍛冶屋', desc: '戦士系の冒険者の戦力を常時強化', baseCost: 500 },
    { id: 'magic', name: '魔導具店', desc: '魔術師系の冒険者の魔法力を常時強化', baseCost: 500 },
    { id: 'item', name: '道具屋', desc: '冒険者の維持費を削減する', baseCost: 600 },
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end border-b border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-amber-500">提携店舗への投資</h2>
        <p className="text-stone-400">現在の資金: <span className="text-yellow-400">{state.budget} G</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shops.map(shop => {
          const level = state.shops[shop.id];
          const cost = shop.baseCost * level;
          return (
            <div key={shop.id} className="bg-stone-900 border-2 border-stone-700 rounded-lg p-5 shadow-xl flex flex-col group hover:border-emerald-600 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-stone-100">{shop.name}</h3>
                <span className="px-2 py-1 bg-stone-800 rounded text-xs text-emerald-400 font-bold">Invest.{level}</span>
              </div>
              <p className="text-sm text-stone-400 mb-6 flex-1">{shop.desc}</p>
              
              <div className="mt-auto pt-4 border-t border-stone-800 flex justify-between items-center">
                <span className="text-yellow-500 font-bold">{cost} G</span>
                <button 
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 disabled:bg-stone-800 disabled:text-stone-600 text-emerald-100 rounded transition-all cursor-pointer shadow-lg active:scale-95"
                  disabled={state.budget < cost}
                  onClick={() => upgradeShop(shop.id, cost)}
                >
                  投資する
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

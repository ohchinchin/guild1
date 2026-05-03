import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import { Skull, UserMinus, ShieldAlert } from 'lucide-react';

export const Intrigue = () => {
  const { state, executeIntrigue } = useGame();

  const actions = [
    { 
      id: 'rumor', 
      name: '偽情報の流布', 
      desc: 'ライバルを無駄足させ、こちらの名声を相対的に守る。', 
      cost: 500, 
      notoriety: 5,
      icon: <Skull className="w-6 h-6 text-stone-500" />
    },
    { 
      id: 'scout', 
      name: '人材の引き抜き', 
      desc: '高額な支度金で他所から手練れを強引に連れてくる。', 
      cost: 4000, 
      notoriety: 25,
      icon: <UserMinus className="w-6 h-6 text-red-500" />
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end border-b border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
          <ShieldAlert /> 工作・諜報
        </h2>
        <p className="text-stone-400">悪名: <span className="text-red-500 font-bold">{state.notoriety}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map(action => (
          <div key={action.id} className="bg-stone-900 border-2 border-stone-800 rounded-xl p-6 shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {action.icon}
            </div>
            <h3 className="text-xl font-bold text-stone-100 mb-2">{action.name}</h3>
            <p className="text-sm text-stone-500 mb-8">{action.desc}</p>
            
            <div className="flex justify-between items-center bg-stone-950 p-4 rounded-lg border border-stone-800">
              <div className="flex flex-col">
                <span className="text-xs text-stone-600 uppercase">Required</span>
                <span className="text-yellow-600 font-black">{action.cost} G</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-stone-600 uppercase">Risk</span>
                <span className="text-red-700 font-black">+{action.notoriety} Notoriety</span>
              </div>
            </div>

            <button 
              className="w-full mt-4 py-3 bg-stone-800 hover:bg-red-900 text-stone-400 hover:text-white rounded-lg font-bold transition-all cursor-pointer border border-stone-700 hover:border-red-700 active:scale-95"
              disabled={state.budget < action.cost}
              onClick={() => executeIntrigue(action.cost, action.notoriety, `裏工作「${action.name}」を実行した。`)}
            >
              計画を実行する
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

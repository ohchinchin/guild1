import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';

export const PolicyStaff = () => {
  const { state, setPolicy, hireAssistant } = useGame();

  const policies = [
    { id: 'balanced', name: '中庸', desc: 'バランスの取れた運営。特筆すべき効果はない。' },
    { id: 'aggressive', name: '武闘派', desc: '荒事が増え悪名が上がりやすいが、冒険者が集まりやすい。' },
    { id: 'economic', name: '商業主義', desc: 'クエスト報酬や酒場収入が増えるが、街の好感度は上がりにくい。' },
    { id: 'diplomatic', name: '街との融和', desc: '街の好感度が毎ターン上昇する。' }
  ] as const;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Policy Section */}
      <section>
        <div className="flex justify-between items-end border-b border-stone-700 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-amber-500">ギルド運営方針</h2>
          <p className="text-stone-400">現在の方針: <span className="text-white font-bold">{policies.find(p => p.id === state.policy)?.name}</span></p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map(p => (
            <button
              key={p.id}
              onClick={() => setPolicy(p.id)}
              className={`p-4 text-left border-2 rounded-xl transition-all ${
                state.policy === p.id 
                  ? 'border-amber-500 bg-amber-900/20' 
                  : 'border-stone-700 bg-stone-900 hover:border-amber-700'
              }`}
            >
              <h3 className="text-lg font-bold text-stone-100 mb-1">{p.name}</h3>
              <p className="text-sm text-stone-400">{p.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Staff Section */}
      <section>
        <div className="flex justify-between items-end border-b border-stone-700 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-amber-500">補佐NPCの雇用</h2>
          <p className="text-stone-400">運営を助けるスタッフを雇います（毎ターン維持費が発生します）。</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {state.assistants.map(a => (
            <div key={a.id} className="bg-stone-900 border-2 border-stone-700 rounded-xl p-5 shadow-xl flex flex-col">
              <h3 className="text-xl font-bold text-stone-100">{a.name}</h3>
              <span className="text-sm text-amber-500 mb-4 block">{a.role}</span>
              
              <div className="text-sm text-stone-400 mb-6 flex-1">
                {a.buff === 'town_favor_up' && '毎ターン、街の好感度を少し上昇させる。'}
                {a.buff === 'training_up' && '冒険者の任務成功時の成長率を1.5倍にする。'}
                {a.buff === 'notoriety_down' && '毎ターン、裏工作で上がった悪名をもみ消す。'}
              </div>
              
              <div className="flex justify-between items-center border-t border-stone-800 pt-4 mt-auto">
                <div className="text-sm">
                  <span className="text-stone-500">維持費: </span>
                  <span className="text-red-400 font-bold">{a.cost}G / ターン</span>
                </div>
                {a.isHired ? (
                  <span className="px-4 py-2 bg-green-900 text-green-300 rounded font-bold">雇用済み</span>
                ) : (
                  <button 
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 disabled:bg-stone-800 text-white rounded font-bold transition-all"
                    onClick={() => hireAssistant(a.id)}
                  >
                    雇用する
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

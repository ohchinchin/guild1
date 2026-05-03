import { useGame } from '../../context/GameContext'
import { motion } from 'framer-motion'
import { Sparkles, Trophy, Lock, Unlock } from 'lucide-react'

export const Skills = () => {
  const { state, unlockSkill } = useGame()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex justify-between items-end border-b border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <Sparkles className="w-6 h-6" /> マスタースキル (Master Skills)
        </h2>
        <p className="text-stone-400 text-sm">保有名声: <span className="text-blue-400 font-bold">{state.fame}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.masterSkills.map(skill => (
          <div 
            key={skill.id} 
            className={`relative p-6 rounded-2xl border-2 transition-all ${
              skill.unlocked 
                ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                : 'bg-stone-900/60 border-stone-800'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${skill.unlocked ? 'bg-blue-500/20 text-blue-400' : 'bg-stone-800 text-stone-500'}`}>
                {skill.unlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              {!skill.unlocked && (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-stone-500 uppercase font-black mb-1">Required Fame</span>
                  <span className="text-blue-400 font-black">{skill.cost}</span>
                </div>
              )}
            </div>

            <h3 className={`text-xl font-bold mb-2 ${skill.unlocked ? 'text-white' : 'text-stone-400'}`}>
              {skill.name}
            </h3>
            <p className="text-sm text-stone-500 leading-relaxed mb-6">
              {skill.desc}
            </p>

            {skill.unlocked ? (
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Active
              </div>
            ) : (
              <button
                onClick={() => unlockSkill(skill.id)}
                disabled={state.fame < skill.cost}
                className="w-full py-3 bg-blue-700 hover:bg-blue-600 disabled:bg-stone-800 disabled:text-stone-600 text-white font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                習得する
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-stone-950/50 p-6 rounded-2xl border border-stone-800">
        <h4 className="text-xs font-black text-stone-500 uppercase mb-3 tracking-widest flex items-center gap-2">
          <Trophy className="w-3 h-3" /> Skill Philosophy
        </h4>
        <p className="text-sm text-stone-400 font-serif italic">
          「ギルドマスターの知恵は、千の剣に勝る。名声を集め、人知を超えた指揮能力を解禁せよ」
        </p>
      </div>
    </motion.div>
  )
}

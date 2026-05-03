import { useGame } from '../../context/GameContext'
import { motion } from 'framer-motion'
import { ScrollText, Trophy, History, User } from 'lucide-react'

export const Records = () => {
  const { state } = useGame()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-10"
    >
      <div className="flex justify-between items-end border-b border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
          <ScrollText className="w-6 h-6" /> ギルドの歩み
        </h2>
      </div>

      {/* Hall of Fame */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-stone-100 flex items-center gap-2 uppercase tracking-widest">
          <Trophy className="w-5 h-5 text-yellow-500" /> 英雄の殿堂 (Hall of Fame)
        </h3>
        
        {state.hallOfFame.length === 0 ? (
          <div className="bg-stone-900/40 border border-stone-800 p-8 rounded-2xl text-center text-stone-600 italic font-sans">
            まだ殿堂入りした冒険者はいません。引退した伝説たちがここに刻まれます。
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.hallOfFame.map(hero => (
              <div key={hero.id} className="bg-gradient-to-br from-amber-900/20 to-stone-900 border border-amber-600/30 p-4 rounded-xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center text-amber-500">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-stone-100">{hero.name}</h4>
                    <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded font-black">RANK {hero.rank}</span>
                  </div>
                  <p className="text-xs text-stone-400">{hero.cls} | 最終戦力: {hero.finalPower}</p>
                  <p className="text-[10px] text-amber-500/60 mt-1 uppercase">Retired at Turn {hero.retiredTurn}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent History / Logs */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-stone-100 flex items-center gap-2 uppercase tracking-widest">
          <History className="w-5 h-5 text-blue-400" /> 近年のクロニクル (Recent Events)
        </h3>
        
        <div className="bg-stone-950/50 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto font-sans">
            {state.logs.length === 0 ? (
              <div className="p-8 text-center text-stone-600 italic">記録はまだ白紙です。</div>
            ) : (
              <div className="divide-y divide-stone-800/50">
                {state.logs.map(log => (
                  <div key={log.id} className="p-4 flex gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-16 shrink-0 text-[10px] font-black text-stone-500 pt-1">
                      TURN {log.turn}
                    </div>
                    <div className="flex-1 text-sm text-stone-300 leading-relaxed">
                      {log.message}
                    </div>
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      log.type === 'success' ? 'bg-green-500' :
                      log.type === 'danger' ? 'bg-red-500' :
                      log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  )
}

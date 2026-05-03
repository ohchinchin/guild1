import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { Coins, Trophy, Ghost, CheckCircle2, Users, Map, ArrowRight } from 'lucide-react'

export const TurnSummary = () => {
  const { state, closeSummary } = useGame()
  const report = state.lastReport

  if (!report) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-stone-900 border-2 border-amber-600/50 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-amber-900/20 border-b border-amber-600/30 p-6 text-center">
          <h2 className="text-stone-500 uppercase tracking-[0.3em] text-xs mb-1">Turn {report.turn} - 半年間の成果</h2>
          <h3 className="text-3xl font-black text-amber-500 italic uppercase italic">Progress Report</h3>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Main Stats Gained */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-stone-950/50 p-4 rounded-2xl border border-stone-800 text-center">
              <Coins className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
              <div className="text-sm text-stone-500 mb-1">収支</div>
              <div className={`text-xl font-bold ${report.income >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {report.income >= 0 ? '+' : ''}{report.income.toLocaleString()} G
              </div>
            </div>
            <div className="bg-stone-950/50 p-4 rounded-2xl border border-stone-800 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-2 text-blue-400" />
              <div className="text-sm text-stone-500 mb-1">名声</div>
              <div className="text-xl font-bold text-blue-400">+{report.fameGained}</div>
            </div>
            <div className="bg-stone-950/50 p-4 rounded-2xl border border-stone-800 text-center">
              <Ghost className="w-5 h-5 mx-auto mb-2 text-red-500" />
              <div className="text-sm text-stone-500 mb-1">悪名</div>
              <div className="text-xl font-bold text-red-500">+{report.notorietyGained}</div>
            </div>
          </div>

          {/* Quests Summary */}
          {(report.completedQuests.length > 0 || report.failedQuests.length > 0) && (
            <div className="space-y-3">
              <h4 className="text-stone-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> 依頼の結果
              </h4>
              <div className="space-y-2">
                {report.completedQuests.map((q, i) => (
                  <div key={i} className="flex justify-between items-center bg-stone-800/40 p-3 rounded-xl border border-stone-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="text-stone-200 font-bold">{q.title}</span>
                    </div>
                    <span className="text-yellow-500 text-sm font-bold">成功 (+{q.reward}G)</span>
                  </div>
                ))}
                {report.failedQuests.map((q, i) => (
                  <div key={i} className="flex justify-between items-center bg-red-950/20 p-3 rounded-xl border border-red-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                      <span className="text-stone-400">{q.title}</span>
                    </div>
                    <span className="text-red-500 text-sm font-bold uppercase">失敗</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dungeon Progress */}
          {report.dungeonProgress.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-stone-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Map className="w-4 h-4" /> 迷宮探索進捗
              </h4>
              <div className="space-y-2">
                {report.dungeonProgress.map((d, i) => (
                  <div key={i} className="flex justify-between items-center bg-stone-800/40 p-3 rounded-xl border border-stone-700/50">
                    <span className="text-stone-200 font-bold">{d.name}</span>
                    <span className="text-emerald-400 text-sm font-bold italic">Progress +{d.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Random Events */}
          {report.events.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-stone-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Users className="w-4 h-4" /> 出来事
              </h4>
              <div className="bg-stone-950/50 p-4 rounded-2xl border border-stone-800 space-y-2">
                {report.events.map((e, i) => (
                  <p key={i} className="text-stone-300 text-sm flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span> {e}
                  </p>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 bg-stone-950 border-t border-stone-800">
          <button 
            onClick={closeSummary}
            className="w-full py-4 bg-amber-700 hover:bg-amber-600 text-white font-black text-xl rounded-2xl transition-all shadow-[0_10px_20px_rgba(180,83,9,0.3)] active:scale-95 flex items-center justify-center gap-3 group cursor-pointer"
          >
            メイン画面へ戻る <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { GUILD_OBJECTIVES } from '../logic/objectives';
import { Trophy, Sparkles } from 'lucide-react';

export const RankUpModal = () => {
  const { state, closeRankUp } = useGame();
  
  // Previous objective that was just completed
  const objective = GUILD_OBJECTIVES.find(o => {
    const rankOrder = ['E', 'D', 'C', 'B', 'A', 'S'];
    const currentIdx = rankOrder.indexOf(state.guildRank);
    return o.rank === rankOrder[currentIdx - 1];
  });

  if (!objective || state.gameStatus !== 'rank_up') return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-2xl">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        className="max-w-3xl w-full bg-stone-900 border-4 border-amber-500 rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.3)] overflow-hidden"
      >
        <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-12 text-center space-y-6">
          <div className="flex justify-center">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-24 h-24 bg-amber-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)]"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-amber-500 font-black tracking-widest uppercase text-lg">Guild Rank Up</h2>
            <h1 className="text-6xl font-black text-white italic tracking-tighter">RANK {state.guildRank}</h1>
          </div>

          <p className="text-2xl text-amber-200 font-bold italic">
            「{objective.rewardText}」
          </p>
        </div>

        <div className="p-12 pt-0 space-y-8">
          <div className="bg-stone-950/50 p-8 rounded-3xl border border-stone-800 space-y-4">
            <h3 className="text-stone-400 font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Story Milestone
            </h3>
            <p className="text-xl text-stone-200 leading-relaxed font-serif italic">
              {objective.storySnippet}
            </p>
          </div>

          <button 
            onClick={closeRankUp}
            className="w-full py-6 bg-amber-600 hover:bg-amber-500 text-white font-black text-3xl rounded-2xl transition-all shadow-xl active:scale-95 border-b-8 border-amber-800"
          >
            次なる試練へ
          </button>
        </div>
      </motion.div>
    </div>
  );
};

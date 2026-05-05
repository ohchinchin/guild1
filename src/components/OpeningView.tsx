import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { STORY_CHAPTERS } from '../logic/objectives';
import { ArrowRight } from 'lucide-react';

export const OpeningView = () => {
  const { closeOpening } = useGame();
  const chapter = STORY_CHAPTERS[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-110"
        style={{ backgroundImage: `url("https://image.pollinations.ai/prompt/${encodeURIComponent(chapter.imageUrl)}?model=flux&width=1024&height=512&nologo=true")` }}
      />
      
      <div className="max-w-3xl w-full space-y-12 relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center space-y-4"
        >
          <h2 className="text-amber-500 font-sans tracking-[0.5em] uppercase text-sm font-bold">Prologue</h2>
          <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase underline decoration-amber-600/50 underline-offset-8">
            {chapter.title}
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="bg-stone-900/60 backdrop-blur-md p-8 lg:p-12 rounded-3xl border border-stone-800 shadow-2xl"
        >
          <p className="text-xl lg:text-2xl text-stone-200 leading-relaxed font-serif italic text-center">
            「{chapter.text}」
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
          className="flex justify-center"
        >
          <button 
            onClick={closeOpening}
            className="group flex items-center gap-4 px-12 py-5 bg-amber-700 hover:bg-amber-600 text-white font-black text-2xl rounded-full shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            運命を受け入れる
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

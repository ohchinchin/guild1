import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import type { Rank, Adventurer } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sword, Shield, Scroll, Brain, History, User } from 'lucide-react';

const AdventurerImage = ({ src, alt, className = "h-40" }: { src: string, alt: string, className?: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`${className} w-full relative bg-stone-950 flex items-center justify-center overflow-hidden border-b border-stone-800`}>
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent z-10" />
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-opacity duration-300 ${hasError ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-stone-700">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export const Adventurers = () => {
  const { state, retireAdventurer } = useGame();
  const [selectedAdv, setSelectedAdv] = useState<Adventurer | null>(null);

  const getRankColor = (rank: Rank) => {
    switch(rank) {
      case 'S': return 'text-fuchsia-400 border-fuchsia-400 bg-fuchsia-900/20';
      case 'A': return 'text-red-400 border-red-400 bg-red-900/20';
      case 'B': return 'text-amber-400 border-amber-400 bg-amber-900/20';
      case 'C': return 'text-emerald-400 border-emerald-400 bg-emerald-900/20';
      case 'D': return 'text-blue-400 border-blue-400 bg-blue-900/20';
      default: return 'text-stone-400 border-stone-400 bg-stone-800';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === '待機中') return <span className="px-2 py-1 text-xs bg-green-900 text-green-300 rounded border border-green-700">待機中</span>;
    if (status === '任務中') return <span className="px-2 py-1 text-xs bg-amber-900 text-amber-300 rounded border border-amber-700">任務中</span>;
    return <span className="px-2 py-1 text-xs bg-red-900 text-red-300 rounded border border-red-700">負傷</span>;
  };

  const isSkillsRevealed = state.masterSkills.find(s => s.effect === 'reveal_skills')?.unlocked;
  const isDetailsRevealed = state.masterSkills.find(s => s.effect === 'reveal_details')?.unlocked;

  const AdventurerDetailModal = ({ adv, onClose }: { adv: Adventurer, onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-3xl w-full bg-stone-900 border-2 border-amber-600/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        <div className="w-full md:w-1/3 bg-stone-950 flex flex-col border-b md:border-b-0 md:border-r border-stone-800">
          <AdventurerImage src={adv.imageUrl || ''} alt={adv.name} className="h-64 md:h-full" />
        </div>
        
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-3xl font-black text-white">{adv.name}</h3>
                <span className={`px-3 py-1 text-sm font-bold border rounded-full ${getRankColor(adv.rank)}`}>
                  Rank {adv.rank}
                </span>
              </div>
              <p className="text-amber-500 font-bold tracking-widest uppercase text-sm">{adv.cls}</p>
            </div>
            <button onClick={onClose} className="p-2 text-stone-500 hover:text-white transition-colors cursor-pointer bg-stone-800 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-center">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Total Power</p>
              <p className="text-3xl font-black text-amber-500">{adv.power}</p>
            </div>
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-center">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Status</p>
              <div className="flex justify-center mt-1">{getStatusBadge(adv.status)}</div>
            </div>
          </div>

          <section className="space-y-3">
            <h4 className="text-stone-300 font-bold flex items-center gap-2 border-b border-stone-800 pb-2">
              <History className="w-4 h-4 text-amber-500" /> 生い立ち
            </h4>
            <p className="text-sm text-stone-400 leading-relaxed italic">
              {adv.background || '謎に包まれている...'}
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-stone-300 font-bold flex items-center gap-2 border-b border-stone-800 pb-2">
              <Brain className="w-4 h-4 text-amber-500" /> 性格・特徴
            </h4>
            <p className="text-sm text-stone-400 leading-relaxed">
              {isDetailsRevealed ? (adv.personality || '不明') : '「情報網の構築」スキルを習得すると詳細が判明します。'}
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-stone-300 font-bold flex items-center gap-2 border-b border-stone-800 pb-2">
              <Sword className="w-4 h-4 text-amber-500" /> 特殊能力 (Skills)
            </h4>
            <div className="space-y-2">
              {isSkillsRevealed ? (
                adv.skills && adv.skills.length > 0 ? (
                  adv.skills.map((s, idx) => (
                    <div key={idx} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/50">
                      <p className="text-amber-400 font-bold text-sm">{s.name}</p>
                      <p className="text-xs text-stone-500 mt-1">{s.desc}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-600 italic text-center py-2">特筆すべきスキルなし</p>
                )
              ) : (
                <div className="bg-stone-950/50 p-4 rounded-xl border border-dashed border-stone-800 text-center">
                  <p className="text-xs text-stone-600">「洞察の眼」スキルを習得するとスキルが判明します。</p>
                </div>
              )}
            </div>
          </section>

          {['S', 'A', 'B'].includes(adv.rank) && adv.status === '待機中' && (
            <button
              onClick={() => {
                if (confirm(`${adv.name} を名誉引退させますか？この英雄は殿堂入りし、後進に道を譲ります。`)) {
                  retireAdventurer(adv.id);
                  onClose();
                }
              }}
              className="w-full py-4 bg-amber-900/20 hover:bg-amber-800 text-amber-500 hover:text-white font-bold rounded-2xl border border-amber-900/50 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Scroll className="w-4 h-4" /> 名誉引退させる (Honorary Retirement)
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-amber-500">冒険者名簿</h2>
        <p className="text-stone-400">総員: {state.adventurers.length} 名</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.adventurers.map(adv => (
          <div 
            key={adv.id} 
            onClick={() => setSelectedAdv(adv)}
            className="bg-stone-900 border-2 border-stone-700 rounded-lg overflow-hidden shadow-xl flex flex-col relative group transition-transform hover:scale-105 hover:border-amber-700 hover:z-10 cursor-pointer"
          >
            
            {/* Image Area */}
            <AdventurerImage src={adv.imageUrl || ''} alt={adv.name} />
            
            <div className="absolute top-2 right-2 z-20">
              {getStatusBadge(adv.status)}
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-stone-100">{adv.name}</h3>
                <span className={`px-2 py-0.5 text-xs font-bold border rounded ${getRankColor(adv.rank)}`}>
                  Rank {adv.rank}
                </span>
              </div>
              
              <div className="text-sm text-stone-400 mb-4">{adv.cls}</div>

              <div className="bg-stone-950 p-2 rounded border border-stone-800 flex justify-between items-center">
                <span className="text-xs text-stone-500">総合戦力</span>
                <span className="text-lg font-bold text-amber-500">{adv.power}</span>
              </div>
              
              <div className="mt-3 text-[10px] text-stone-600 text-center uppercase tracking-widest group-hover:text-amber-500/50 transition-colors">
                Click for details
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {state.adventurers.length === 0 && (
        <div className="py-12 text-center text-stone-500 bg-stone-900 rounded-xl border border-stone-800">
          現在、所属している冒険者はいません。
        </div>
      )}

      <AnimatePresence>
        {selectedAdv && (
          <AdventurerDetailModal adv={selectedAdv} onClose={() => setSelectedAdv(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

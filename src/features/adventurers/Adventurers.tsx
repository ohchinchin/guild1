import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import type { Rank } from '../../types';

const AdventurerImage = ({ src, alt }: { src: string, alt: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="h-40 w-full relative bg-stone-950 flex items-center justify-center overflow-hidden border-b border-stone-800">
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-amber-500">冒険者名簿</h2>
        <p className="text-stone-400">総員: {state.adventurers.length} 名</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.adventurers.map(adv => (
          <div key={adv.id} className="bg-stone-900 border-2 border-stone-700 rounded-lg overflow-hidden shadow-xl flex flex-col relative group transition-transform hover:scale-105 hover:border-amber-700 hover:z-10">
            
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

              <div className="bg-stone-950 p-2 rounded border border-stone-800 flex justify-between items-center mb-4">
                <span className="text-xs text-stone-500">総合戦力</span>
                <span className="text-lg font-bold text-amber-500">{adv.power}</span>
              </div>

              {/* Retire Button (Only for high ranks and standby status) */}
              {['S', 'A', 'B'].includes(adv.rank) && adv.status === '待機中' && (
                <button
                  onClick={() => {
                    if (confirm(`${adv.name} を名誉引退させますか？この英雄は殿堂入りし、後進に道を譲ります。`)) {
                      retireAdventurer(adv.id);
                    }
                  }}
                  className="mt-auto w-full py-2 bg-stone-800 hover:bg-amber-900/40 text-stone-400 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest rounded border border-stone-700 hover:border-amber-700/50 transition-all cursor-pointer"
                >
                  Honorary Retirement
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {state.adventurers.length === 0 && (
        <div className="py-12 text-center text-stone-500 bg-stone-900 rounded-xl border border-stone-800">
          現在、所属している冒険者はいません。
        </div>
      )}
    </div>
  );
};

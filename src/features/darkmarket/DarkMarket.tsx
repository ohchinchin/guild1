import { motion } from 'framer-motion'
import { Ghost, Lock, ShoppingCart, Info, TrendingUp, AlertTriangle } from 'lucide-react'
import { useGame } from '../../context/GameContext'

export const DarkMarket = () => {
  const { state, buyDarkMarketItem } = useGame();
  
  const isUnlocked = state.notoriety >= 15;

  if (!isUnlocked) {
    return (
      <div className="space-y-6">
        <div className="bg-stone-950/80 border-2 border-stone-800 p-12 rounded-3xl backdrop-blur-md text-center space-y-6">
          <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mx-auto text-stone-600 border border-stone-700">
            <Lock className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-stone-400 uppercase tracking-widest italic">領域外の取引</h2>
            <p className="text-stone-500 max-w-sm mx-auto">「表の世界で誠実に生きる者には、この門は開かれない……」</p>
          </div>
          <div className="pt-4">
            <p className="text-xs text-stone-600 font-sans uppercase tracking-widest">解禁条件: 悪名 (Notoriety) 15 以上</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-stone-900/80 border-2 border-purple-900/50 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="p-3 bg-purple-900/30 rounded-lg text-purple-400 border border-purple-500/20">
            <Ghost className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-purple-400 uppercase tracking-widest italic">闇市場 (Dark Market)</h2>
            <p className="text-stone-400 text-sm italic">「光あるところに影あり。ここには、表には出せない品々が集まる……」</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {state.darkMarketItems.map(item => {
            const canAfford = state.budget >= item.cost;
            const hasRequirement = state.notoriety >= item.requiredNotoriety;
            
            return (
              <motion.div 
                key={item.id}
                whileHover={!item.purchased && hasRequirement ? { y: -4, scale: 1.02 } : {}}
                className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  item.purchased 
                    ? 'bg-stone-950/50 border-stone-800 grayscale' 
                    : !hasRequirement
                    ? 'bg-stone-900/30 border-stone-800/50 opacity-60'
                    : 'bg-stone-900/80 border-purple-900/30 hover:border-purple-500/50 shadow-lg'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-black text-lg ${item.purchased ? 'text-stone-600' : 'text-purple-200'}`}>
                      {item.name}
                    </h3>
                    {item.purchased ? (
                      <span className="text-[10px] bg-stone-800 text-stone-500 px-2 py-0.5 rounded font-sans uppercase font-bold">Sold Out</span>
                    ) : (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-sans uppercase font-bold ${hasRequirement ? 'bg-purple-900/50 text-purple-300' : 'bg-red-900/30 text-red-400'}`}>
                        Req. Notoriety {item.requiredNotoriety}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-400 text-xs mb-4 leading-relaxed">{item.desc}</p>
                  
                  {!item.purchased && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <ShoppingCart className="w-3 h-3" /> {item.cost.toLocaleString()} G
                      </div>
                    </div>
                  )}
                </div>

                {!item.purchased && (
                  <button 
                    onClick={() => buyDarkMarketItem(item.id)}
                    disabled={!canAfford || !hasRequirement}
                    className={`w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      canAfford && hasRequirement
                        ? 'bg-purple-700 hover:bg-purple-600 text-white cursor-pointer'
                        : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                    }`}
                  >
                    取引を行う
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-stone-950/50 rounded-xl border border-stone-800/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-stone-500 leading-relaxed font-sans uppercase tracking-wider">
            闇市場での取引は自己責任で行ってください。これらの品々は強力ですが、正規のルートでは入手不可能な禁忌の品であることをお忘れなく。
          </p>
        </div>
      </div>
    </div>
  )
}

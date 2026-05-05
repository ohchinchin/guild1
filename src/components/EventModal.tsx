import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export const EventModal = () => {
  const { state, handleEventChoice } = useGame();
  const event = state.activeEvent;

  if (!event || state.gameStatus !== 'event') return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="relative h-64 lg:h-96">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              event.type === 'crisis' ? 'bg-red-600' : 
              event.type === 'rival' ? 'bg-purple-600' : 
              event.type === 'national' ? 'bg-amber-600' : 'bg-green-600'
            } text-white`}>
              {event.type} Event
            </span>
            <h2 className="text-4xl font-black text-white mt-2 tracking-tighter italic">{event.title}</h2>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <p className="text-xl text-stone-300 leading-relaxed font-medium">
            {event.description}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {event.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleEventChoice(index)}
                className="group relative p-6 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-500/50 rounded-2xl transition-all text-left"
              >
                <div className="flex justify-between items-center">
                  <span className="text-stone-100 font-black text-lg group-hover:text-amber-400 transition-colors">
                    {choice.label}
                  </span>
                  <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center border border-stone-700 group-hover:border-amber-500 transition-all">
                    <span className="text-amber-500 font-black">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

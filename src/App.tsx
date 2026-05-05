import { useState, useEffect } from 'react'
import { useGame } from './context/GameContext'
import { ImageDisplay } from './components/ImageDisplay'
import { Dashboard } from './features/dashboard/Dashboard'
import { Board } from './features/board/Board'
import { Adventurers } from './features/adventurers/Adventurers'
import { Facilities } from './features/facilities/Facilities'
import { Shops } from './features/shops/Shops'
import { Intrigue } from './features/intrigue/Intrigue'
import { Dungeons } from './features/dungeons/Dungeons'
import { PolicyStaff } from './features/policy/PolicyStaff'
import { DarkMarket } from './features/darkmarket/DarkMarket'
import { Records } from './features/records/Records'
import { Skills } from './features/skills/Skills'
import { Workshop } from './features/workshop/Workshop'
import { EventModal } from './components/EventModal'
import { TurnSummary } from './components/TurnSummary'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { 
  Coins, Users, Trophy, Ghost, ArrowRight, RefreshCcw, 
  Map, Briefcase, Swords, Skull, ScrollText, Sparkles, HelpCircle, X, FlaskConical
} from 'lucide-react'

function App() {
  const { state, nextTurn, startGame, resetGame, fightBoss } = useGame()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [subId, setSubId] = useState<string | null>(null)
  const [showHowToPlay, setShowHowToPlay] = useState(false)

  // Reset subId when changing tabs
  useEffect(() => {
    setSubId(null)
  }, [activeTab])

  useEffect(() => {
    if (state.gameStatus === 'ended' && state.ending?.includes('勝利')) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [state.gameStatus]);

  const tabs = [
    { id: 'dashboard', label: 'ダッシュボード', icon: <Trophy className="w-4 h-4" /> },
    { id: 'board', label: '依頼掲示板', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'dungeons', label: '迷宮探索', icon: <Map className="w-4 h-4" /> },
    { id: 'workshop', label: '錬成工廠', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'adventurers', label: '冒険者名簿', icon: <Users className="w-4 h-4" /> },
    { id: 'policy', label: '運営方針', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'facilities', label: '施設拡張', icon: <RefreshCcw className="w-4 h-4" /> },
    { id: 'shops', label: '提携店舗', icon: <Coins className="w-4 h-4" /> },
    { id: 'intrigue', label: '工作・諜報', icon: <Ghost className="w-4 h-4" /> },
    { id: 'darkmarket', label: '闇市場', icon: <Skull className="w-4 h-4" /> },
    { id: 'records', label: '活動記録', icon: <ScrollText className="w-4 h-4" /> },
    { id: 'skills', label: 'マスタースキル', icon: <Sparkles className="w-4 h-4" /> },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />
      case 'board': return <Board />
      case 'dungeons': return <Dungeons />
      case 'workshop': return <Workshop />
      case 'adventurers': return <Adventurers />
      case 'policy': return <PolicyStaff />
      case 'facilities': return <Facilities onHover={(id) => setSubId(id)} />
      case 'shops': return <Shops />
      case 'intrigue': return <Intrigue />
      case 'darkmarket': return <DarkMarket />
      case 'records': return <Records />
      case 'skills': return <Skills />
      default: return <Dashboard />
    }
  }

  const HowToPlayModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-stone-900 border-2 border-amber-600/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-amber-900/10">
          <h3 className="text-2xl font-black text-amber-500 uppercase tracking-widest italic">遊び方ガイド</h3>
          <button onClick={() => setShowHowToPlay(false)} className="text-stone-500 hover:text-white transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6 text-stone-300 font-sans">
          <section className="space-y-2">
            <h4 className="text-amber-400 font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4" /> ギルドマスターの使命
            </h4>
            <p className="text-sm leading-relaxed">
              あなたは新任のギルドマスターです。50ターンの間、冒険者を雇用し、依頼をこなし、施設を拡張して、大陸一のギルドを作り上げることが目的です。
            </p>
          </section>
          <section className="space-y-2">
            <h4 className="text-amber-400 font-bold flex items-center gap-2">
              <FlaskConical className="w-4 h-4" /> 錬成と素材
            </h4>
            <p className="text-sm leading-relaxed">
              迷宮探索で得られる素材を組み合わせ、「錬成工廠」で強力な秘宝を作ることができます。低ランクの迷宮にも重要な素材が眠っています。
            </p>
          </section>
          <section className="space-y-2">
            <h4 className="text-amber-400 font-bold flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" /> 動的な世界
            </h4>
            <p className="text-sm leading-relaxed">
              ターンの終わりには、ライバルギルドの妨害や王国の勅命といった「劇的なイベント」が発生することがあります。あなたの選択が運命を左右します。
            </p>
          </section>
          <section className="space-y-2">
            <h4 className="text-amber-400 font-bold flex items-center gap-2">
              <Swords className="w-4 h-4" /> 厄災への備え
            </h4>
            <p className="text-sm leading-relaxed text-red-400/80">
              15、30、48ターン目には強力なボスが街を襲います。それまでに十分な戦力を整えなければ、ギルドは崩壊し、バッドエンドを迎えます。
            </p>
          </section>
        </div>
        <div className="p-6 bg-stone-950 border-t border-stone-800 text-center">
          <button 
            onClick={() => setShowHowToPlay(false)}
            className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl transition-all active:scale-95"
          >
            承知した
          </button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      {state.gameStatus === 'start' ? (
        <motion.div 
          key="start-screen"
          className="min-h-screen bg-stone-950 flex items-center justify-center p-4 text-center relative overflow-hidden"
          exit={{ opacity: 1 }} 
        >
          {/* Under-layer: The Guild Hall revealed when doors open */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-40 scale-100"
            style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/bg_title.webp")` }}
          />

          {/* Left Door Half */}
          <motion.div 
            className="absolute inset-y-0 left-0 w-1/2 bg-stone-900 border-r-2 border-amber-900/50 z-50 overflow-hidden shadow-[10px_0_40px_rgba(0,0,0,0.8)]"
            initial={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/bg_guild_door.webp")`, backgroundPosition: 'left center' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 to-transparent" />
          </motion.div>

          {/* Right Door Half */}
          <motion.div 
            className="absolute inset-y-0 right-0 w-1/2 bg-stone-900 border-l-2 border-amber-900/50 z-50 overflow-hidden shadow-[-10px_0_40px_rgba(0,0,0,0.8)]"
            initial={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/bg_guild_door.webp")`, backgroundPosition: 'right center' }} />
            <div className="absolute inset-0 bg-gradient-to-l from-stone-950/40 to-transparent" />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent z-10" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.8 } }}
            className="max-w-lg w-full space-y-8 relative z-[60]"
          >
            <div className="space-y-2">
              <h1 className="text-7xl font-black text-amber-500 tracking-widest drop-shadow-[0_0_30px_rgba(245,158,11,0.6)] italic uppercase">
                Guild Master
              </h1>
              <p className="text-amber-200/60 font-sans tracking-[0.5em] uppercase text-sm">
                Legend of the Obsidian Raven
              </p>
            </div>
            
            <div className="space-y-4 pt-12">
              {!!localStorage.getItem('guildMasterSave') && (
                <button 
                  onClick={() => startGame(true)} 
                  className="w-full py-5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-[0_10px_20px_rgba(180,83,9,0.3)] active:scale-95 text-xl cursor-pointer border border-amber-500/50"
                >
                  続きから始める
                </button>
              )}
              <button 
                onClick={() => startGame(false)} 
                className="w-full py-5 bg-amber-700 hover:bg-amber-600 text-white border border-amber-500/50 shadow-[0_10px_20px_rgba(180,83,9,0.3)] font-bold rounded-2xl transition-all active:scale-95 text-xl cursor-pointer"
              >
                ギルドの門を開く
              </button>
              <button 
                onClick={() => setShowHowToPlay(true)}
                className="w-full py-4 bg-stone-900/80 hover:bg-stone-800 text-stone-400 font-bold rounded-2xl transition-all border border-stone-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-5 h-5" /> 遊び方を確認する
              </button>
            </div>
          </motion.div>
          {showHowToPlay && <HowToPlayModal />}
        </motion.div>
      ) : state.gameStatus === 'boss_battle' ? (
        <motion.div key="boss-battle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-red-950 flex items-center justify-center p-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full bg-stone-900 border-4 border-red-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <Swords className="w-16 h-16 mx-auto text-red-500" />
            <h1 className="text-4xl font-bold text-red-500">厄災の襲来 (Turn {state.turn})</h1>
            <p className="text-stone-300">ボスが街に到達しました。ギルドの全戦力、街の支援、同盟ギルドの力を結集して迎え撃ちます。</p>
            <div className="py-6">
              <button onClick={fightBoss} className="px-12 py-4 bg-red-700 hover:bg-red-600 text-white font-black text-2xl rounded-full shadow-[0_0_30px_rgba(220,38,38,0.6)] active:scale-95 transition-all">
                総力戦を開始する
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : state.gameStatus === 'ended' ? (
        <motion.div key="ending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-stone-950 flex items-center justify-center p-4 py-12">
          {(() => {
            const isGameOver = state.ending?.includes('ゲームオーバー') || state.ending?.includes('敗北');
            const themeColor = isGameOver ? 'text-red-500' : 'text-amber-500';
            const themeBorder = isGameOver ? 'border-red-600/30' : 'border-amber-600/30';
            const themeShadow = isGameOver ? 'shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.5)]';
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-4xl w-full bg-stone-900/80 backdrop-blur-xl border-2 ${themeBorder} rounded-3xl ${themeShadow} overflow-hidden flex flex-col md:flex-row`}
              >
                {/* Left: Image / Visual Side */}
                <div className="md:w-1/2 relative bg-stone-950 min-h-[300px] md:min-h-full">
                  {state.endingImages && state.endingImages.length > 0 ? (
                    <div className="absolute inset-0 flex flex-col">
                      <motion.div 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="flex-1 bg-cover bg-center"
                        style={{ backgroundImage: `url("${state.endingImages[0]}")` }}
                      />
                      {state.endingImages.length > 1 && (
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1, duration: 1 }}
                          className={`h-1/3 border-t ${isGameOver ? 'border-red-900/30' : 'border-amber-900/30'} bg-cover bg-center`}
                          style={{ backgroundImage: `url("${state.endingImages[1]}")` }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
                      {isGameOver ? <Skull className="w-20 h-20 text-red-900/30" /> : <Trophy className="w-20 h-20 text-stone-700" />}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Right: Text / Info Side */}
                <div className="md:w-1/2 p-8 md:p-12 space-y-8 flex flex-col justify-center">
                  <div className="space-y-2">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`${isGameOver ? 'text-red-500/60' : 'text-amber-500/60'} font-sans tracking-[0.3em] uppercase text-xs font-bold`}
                    >
                      {isGameOver ? 'The End of a Dream' : 'The Tale is Told'}
                    </motion.p>
                    <motion.h1 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`text-4xl font-black ${themeColor} tracking-tight`}
                    >
                      {state.ending}
                    </motion.h1>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`prose prose-invert ${isGameOver ? 'prose-red' : 'prose-amber'}`}
                  >
                    <p className="text-stone-300 leading-relaxed italic text-lg font-serif">
                      「{state.endingAfterstory}」
                    </p>
                  </motion.div>

                  <div className="space-y-4 pt-4 border-t border-stone-800">
                    <h3 className="text-stone-500 text-xs font-bold uppercase tracking-widest">Journey Recap</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800/50">
                        <p className="text-stone-500 text-[10px] uppercase">総獲得資金</p>
                        <p className="text-xl font-black text-yellow-500">{state.stats.totalGoldEarned.toLocaleString()} <span className="text-xs">G</span></p>
                      </div>
                      <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800/50">
                        <p className="text-stone-500 text-[10px] uppercase">完遂した依頼</p>
                        <p className="text-xl font-black text-blue-400">{state.stats.totalQuests} <span className="text-xs">件</span></p>
                      </div>
                      <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800/50">
                        <p className="text-stone-500 text-[10px] uppercase">踏破した迷宮</p>
                        <p className="text-xl font-black text-emerald-400">{state.stats.totalDungeons} <span className="text-xs">箇所</span></p>
                      </div>
                      <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800/50">
                        <p className="text-stone-500 text-[10px] uppercase">獲得した秘宝</p>
                        <p className="text-xl font-black text-purple-400">{state.stats.artifactsFound} <span className="text-xs">種</span></p>
                      </div>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetGame}
                    className={`w-full py-4 ${isGameOver ? 'bg-stone-800 hover:bg-stone-700' : 'bg-amber-700 hover:bg-amber-600'} text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 mt-8 border ${isGameOver ? 'border-stone-700' : 'border-amber-500/50'}`}
                  >
                    タイトルへ戻る
                  </motion.button>
                </div>
              </motion.div>
            );
          })()}
        </motion.div>
      ) : (
        <motion.div 
          key="main-game"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="min-h-screen bg-stone-950 text-gray-200 font-serif flex flex-col selection:bg-amber-500/30 relative"
        >
          {/* Global Background Image */}
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center opacity-30 scale-105 pointer-events-none"
            style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/bg_main_guild.webp")` }}
          />
          <div className="fixed inset-0 z-0 bg-gradient-to-b from-stone-950 via-transparent to-stone-950 pointer-events-none" />

          {/* Turn Summary Overlay */}
          {state.gameStatus === 'summary' && <TurnSummary />}
          
          {/* Event Modal Overlay */}
          {state.gameStatus === 'event' && <EventModal />}
          
          {/* Header / Stats Bar */}
          <header className="bg-stone-950/90 backdrop-blur-md border-b border-stone-800 p-4 flex justify-between items-center shadow-2xl sticky top-0 z-[70]">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg"
              >
                <Trophy className="text-white w-6 h-6" />
              </motion.div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-amber-500 tracking-tighter uppercase italic">Guild Master</h1>
                <p className="text-xs text-stone-500 uppercase tracking-widest font-sans">
                  {state.guildName} | 第 {Math.ceil(state.turn / 2)} 年 {state.season === 'Summer' ? '夏季' : '冬季'}
                </p>
              </div>
            </div>

            <div className="hidden md:flex gap-4 lg:gap-8">
              <div className="flex flex-col items-center group">
                <span className="text-[10px] text-stone-500 font-sans uppercase">Treasury</span>
                <span className="text-lg lg:text-xl font-black text-yellow-500 flex items-center gap-1">
                  <Coins className="w-3 h-3 lg:w-4 lg:h-4" /> {state.budget.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-stone-500 font-sans uppercase">Prestige</span>
                <span className="text-lg lg:text-xl font-black text-blue-400">{state.fame}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-stone-500 font-sans uppercase">Town Favor</span>
                <span className="text-lg lg:text-xl font-black text-emerald-400">{state.townFavor}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-stone-500 font-sans uppercase">Infamy</span>
                <span className="text-lg lg:text-xl font-black text-red-500">{state.notoriety}</span>
              </div>
            </div>

            <button 
              onClick={nextTurn}
              className="px-4 py-2 lg:px-6 lg:py-2 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-black rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all hover:scale-105 active:scale-95 border border-amber-500/30 cursor-pointer flex items-center gap-2 group text-xs lg:text-base"
            >
              <span className="hidden sm:inline">{state.season === 'Summer' ? '冬季' : '夏季'}へ進める</span>
              <span className="sm:hidden">{state.season === 'Summer' ? '冬季' : '夏季'}へ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 lg:p-6 flex flex-col gap-6 relative z-10">
            
            {/* Dynamic Image Display Area with Framer Motion */}
            <motion.section 
              key={activeTab + (subId || '')}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.5 }}
            >
              <ImageDisplay activeTab={activeTab} subId={subId || undefined} />
            </motion.section>

            <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
              {/* Sidebar Navigation */}
              <nav className="w-full md:w-48 lg:w-56 shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 lg:gap-3 px-3 py-3 lg:px-5 lg:py-4 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer relative overflow-hidden group ${
                      activeTab === tab.id 
                        ? 'bg-amber-600 text-white shadow-xl shadow-amber-900/20' 
                        : 'bg-stone-900/60 backdrop-blur-sm text-stone-500 hover:text-stone-300 hover:bg-stone-800/80'
                    }`}
                  >
                    <div className="shrink-0">{tab.icon}</div>
                    <span className="font-bold text-xs lg:text-sm">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div layoutId="nav-bg" className="absolute inset-0 bg-white/10" />
                    )}
                  </button>
                ))}
              </nav>

              {/* Tab Content with Animation */}
              <section className="flex-1 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-stone-900/40 backdrop-blur-md rounded-2xl p-6 border border-stone-800/50 min-h-full"
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </section>
            </div>
          </main>

          {/* Flavor Text Bar */}
          <footer className="bg-stone-950/90 backdrop-blur-xl border-t border-amber-900/30 p-3 z-50">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <div className="px-2 py-1 bg-amber-900/30 border border-amber-600/30 rounded text-[10px] text-amber-500 font-bold uppercase tracking-widest">
                Guild Lore
              </div>
              <motion.p 
                key={state.currentFlavor}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-stone-400 text-sm italic font-serif"
              >
                {state.currentFlavor}
              </motion.p>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App

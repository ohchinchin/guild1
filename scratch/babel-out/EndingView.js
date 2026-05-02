'use strict';

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.EndingView = function (_ref) {
    var gameState = _ref.gameState;

    var L = window.LucideReact;
    var SafeIcon = function SafeIcon(name) {
        return L[name] || L[name.replace('2', '')] || L.RotateCcw;
    };

    var RotateCcw = SafeIcon('RotateCcw');

    if (!gameState.ending) return null;
    var endingData = window.G1.Constants.ENDINGS[gameState.ending];
    if (!endingData) return null;

    return React.createElement(
        'div',
        { key: 'ending', className: 'fixed inset-0 bg-black z-[100] flex flex-col animate-in fade-in duration-1000' },
        React.createElement(
            'div',
            { className: 'absolute inset-0 opacity-40' },
            React.createElement('img', { src: endingData.img, className: 'w-full h-full object-cover', alt: '' }),
            React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent' })
        ),
        React.createElement(
            'div',
            { className: 'relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto w-full' },
            React.createElement(
                'div',
                { className: 'space-y-8 animate-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both' },
                React.createElement(
                    'h2',
                    { className: 'text-6xl md:text-8xl font-black ' + endingData.color + ' tracking-tighter title-text-glow italic' },
                    endingData.title
                ),
                React.createElement('div', { className: 'w-24 h-1 bg-stone-700 mx-auto my-8' }),
                React.createElement(
                    'p',
                    { className: 'text-xl md:text-2xl text-stone-300 font-serif leading-loose italic whitespace-pre-wrap' },
                    endingData.desc
                ),
                React.createElement(
                    'div',
                    { className: 'mt-16 flex flex-col items-center gap-6' },
                    React.createElement(
                        'div',
                        { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-stone-400 mb-8' },
                        React.createElement(
                            'div',
                            { className: 'bg-stone-800/50 p-4 rounded-sm border border-stone-700' },
                            React.createElement(
                                'div',
                                { className: 'text-xs font-bold mb-1' },
                                '最終資金'
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-xl font-black text-amber-500' },
                                gameState.budget.toLocaleString(),
                                ' G'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'bg-stone-800/50 p-4 rounded-sm border border-stone-700' },
                            React.createElement(
                                'div',
                                { className: 'text-xs font-bold mb-1' },
                                '最終名声'
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-xl font-black text-indigo-400' },
                                gameState.fame
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'bg-stone-800/50 p-4 rounded-sm border border-stone-700' },
                            React.createElement(
                                'div',
                                { className: 'text-xs font-bold mb-1' },
                                '悪名'
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-xl font-black text-rose-500' },
                                gameState.notoriety
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'bg-stone-800/50 p-4 rounded-sm border border-stone-700' },
                            React.createElement(
                                'div',
                                { className: 'text-xs font-bold mb-1' },
                                '実績'
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-xl font-black text-emerald-400' },
                                gameState.achievements.length
                            )
                        )
                    ),
                    React.createElement(
                        'button',
                        {
                            onClick: function () {
                                return window.location.reload();
                            },
                            className: 'bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] px-8 py-4 rounded-sm font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-stone-600'
                        },
                        React.createElement(RotateCcw, { className: 'w-6 h-6' }),
                        ' 新たな歴史を刻む'
                    )
                )
            )
        )
    );
};
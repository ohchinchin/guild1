'use strict';

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.LogView = function (_ref) {
    var gameState = _ref.gameState;

    var L = window.LucideReact;
    var SafeIcon = function SafeIcon(name) {
        return L[name] || L[name.replace('2', '')] || L.BookOpen;
    };

    var BookOpen = SafeIcon('BookOpen');
    var ArrowRight = SafeIcon('ArrowRight');
    var Activity = SafeIcon('Activity');
    var Skull = SafeIcon('Skull');
    var Coins = SafeIcon('Coins');
    var CheckCircle = SafeIcon('CheckCircle');

    var getLogIcon = function getLogIcon(type) {
        switch (type) {
            case 'danger':
                return React.createElement(Skull, { className: 'w-4 h-4 text-rose-600' });
            case 'success':
                return React.createElement(CheckCircle, { className: 'w-4 h-4 text-emerald-600' });
            case 'warning':
                return React.createElement(Activity, { className: 'w-4 h-4 text-amber-500' });
            case 'finance':
                return React.createElement(Coins, { className: 'w-4 h-4 text-stone-500' });
            default:
                return React.createElement(ArrowRight, { className: 'w-4 h-4 text-stone-300' });
        }
    };

    return React.createElement(
        'div',
        { key: 'logs', className: 'space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col' },
        React.createElement(
            'p',
            { className: 'text-sm font-bold text-stone-600 mb-2' },
            'これまでの活動記録'
        ),
        React.createElement(
            'div',
            { className: 'flex-1 overflow-y-auto space-y-2 pr-1 pb-4' },
            (gameState.history || []).slice().reverse().map(function (log, i) {
                return React.createElement(
                    'div',
                    { key: i, className: 'bg-white border border-stone-200 p-3 rounded-sm shadow-sm flex items-start gap-3' },
                    React.createElement(
                        'div',
                        { className: 'shrink-0 mt-0.5' },
                        getLogIcon(log.type)
                    ),
                    React.createElement(
                        'div',
                        { className: 'flex-1' },
                        React.createElement(
                            'div',
                            { className: 'text-[10px] font-bold text-stone-400 mb-0.5' },
                            log.turn ? 'ターン ' + log.turn : ''
                        ),
                        React.createElement(
                            'div',
                            { className: 'text-xs text-stone-700 font-medium leading-relaxed' },
                            log.text
                        )
                    )
                );
            })
        )
    );
};
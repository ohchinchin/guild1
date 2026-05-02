'use strict';

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.HowToPlayModal = function (_ref) {
    var isOpen = _ref.isOpen;
    var onClose = _ref.onClose;

    var L = window.LucideReact;
    var SafeIcon = function SafeIcon(name) {
        return L[name] || L[name.replace('2', '')] || L.BookOpen;
    };

    var X = SafeIcon('X');
    var BookOpen = SafeIcon('BookOpen');

    if (!isOpen) return null;

    return React.createElement(
        'div',
        { className: 'fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 font-serif backdrop-blur-sm animate-in fade-in duration-200' },
        React.createElement(
            'div',
            { className: 'bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh]' },
            React.createElement(
                'div',
                { className: 'p-4 border-b border-[#D4C3A3] bg-[#E8E0D5] flex justify-between items-center shrink-0' },
                React.createElement(
                    'h2',
                    { className: 'text-lg font-bold text-stone-800 flex items-center gap-2' },
                    React.createElement(BookOpen, { className: 'w-5 h-5 text-indigo-700' }),
                    ' 遊び方と進め方のコツ'
                ),
                React.createElement(
                    'button',
                    { onClick: onClose, className: 'text-stone-500 hover:text-stone-800 transition-colors' },
                    React.createElement(X, { className: 'w-6 h-6' })
                )
            ),
            React.createElement(
                'div',
                { className: 'p-6 overflow-y-auto space-y-6 text-stone-700 leading-relaxed text-sm' },
                React.createElement(
                    'section',
                    null,
                    React.createElement(
                        'h3',
                        { className: 'font-black text-indigo-800 text-base mb-2 border-b border-indigo-100 pb-1' },
                        '1. 50ターンでの攻略'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'ギルドマスターとして50ターンの間に最強のギルドを築いてください。結果により結末が変化します。'
                    )
                ),
                React.createElement(
                    'section',
                    null,
                    React.createElement(
                        'h3',
                        { className: 'font-black text-indigo-800 text-base mb-2 border-b border-indigo-100 pb-1' },
                        '2. 一括派遣と自動編成'
                    ),
                    React.createElement(
                        'p',
                        null,
                        '掲示板の「一括派遣」を使えば、待機中のメンバーを最適な依頼へ自動で割り振ります。個別に編成する場合も「自動選出」が便利です。'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'p-4 bg-stone-50 border-t border-[#D4C3A3] text-center' },
                React.createElement(
                    'button',
                    { onClick: onClose, className: 'bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] px-8 py-3 rounded-sm font-bold active:scale-95' },
                    '理解した'
                )
            )
        )
    );
};
'use strict';

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.AdventurerModal = function (_ref) {
    var adventurer = _ref.adventurer;
    var onClose = _ref.onClose;
    var onFire = _ref.onFire;

    if (!adventurer) return null;

    var L = window.LucideReact;
    var SafeIcon = function SafeIcon(name) {
        return L[name] || L.HelpCircle || L.Activity;
    };

    var X = SafeIcon('X');
    var Heart = SafeIcon('Heart');
    var Star = SafeIcon('Star');
    var Skull = SafeIcon('Skull');

    var ClassData = window.G1.Constants.CLASSES.find(function (c) {
        return c.id === adventurer.advClass.id;
    });
    var AdvIcon = SafeIcon(ClassData ? ClassData.icon : 'User');

    return React.createElement(
        'div',
        { className: 'fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 font-serif backdrop-blur-sm animate-in fade-in duration-200' },
        React.createElement(
            'div',
            { className: 'bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-md w-full shadow-2xl relative flex flex-col max-h-[90vh]' },
            React.createElement(
                'button',
                { onClick: onClose, className: 'absolute top-3 right-3 text-stone-500 hover:text-stone-800 transition-colors bg-white/50 rounded-full p-1 z-10' },
                React.createElement(X, { className: 'w-5 h-5' })
            ),
            React.createElement(
                'div',
                { className: 'p-5 border-b border-[#D4C3A3] bg-[#E8E0D5]' },
                React.createElement(
                    'div',
                    { className: 'flex justify-between items-start' },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            { className: 'flex items-center gap-2 mb-1' },
                            React.createElement(
                                'h2',
                                { className: 'text-xl font-bold text-stone-800' },
                                adventurer.name
                            ),
                            React.createElement(
                                'span',
                                { className: 'text-xs px-2 py-0.5 rounded-sm font-bold border ' + (adventurer.rank === 'S' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-stone-100 text-stone-600 border-stone-300') },
                                adventurer.rank,
                                '級'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'text-sm font-medium flex items-center gap-1.5 text-indigo-700' },
                            React.createElement(AdvIcon, { className: 'w-4 h-4' }),
                            ' ',
                            adventurer.advClass.name,
                            ' ',
                            React.createElement(
                                'span',
                                { className: 'text-stone-400' },
                                '|'
                            ),
                            React.createElement(
                                'span',
                                { className: 'text-amber-700' },
                                adventurer.personality.name
                            ),
                            ' ',
                            React.createElement(
                                'span',
                                { className: 'text-stone-400' },
                                '|'
                            ),
                            React.createElement(
                                'span',
                                { className: 'text-stone-600' },
                                adventurer.age,
                                '歳'
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'text-right' },
                        React.createElement(
                            'div',
                            { className: 'text-[10px] text-stone-500 font-bold mb-0.5 uppercase' },
                            '戦闘力'
                        ),
                        React.createElement(
                            'div',
                            { className: 'text-3xl font-black text-stone-800 leading-none' },
                            adventurer.power
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'flex-1 overflow-y-auto p-5 space-y-6' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h4',
                        { className: 'text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 border-b border-stone-100 pb-1' },
                        '経歴・特徴'
                    ),
                    React.createElement(
                        'p',
                        { className: 'text-sm text-stone-700 leading-relaxed italic' },
                        '「',
                        adventurer.flavor || '特筆すべき経歴はありません。',
                        '」'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'grid grid-cols-2 gap-4' },
                    React.createElement(
                        'div',
                        { className: 'bg-white p-3 border border-stone-100 rounded-sm shadow-sm' },
                        React.createElement(
                            'div',
                            { className: 'text-[10px] font-bold text-stone-400 mb-1 flex items-center gap-1' },
                            React.createElement(Heart, { className: 'w-3 h-3 text-rose-400' }),
                            ' 忠誠度'
                        ),
                        React.createElement(
                            'div',
                            { className: 'text-lg font-bold ' + (adventurer.loyalty < 30 ? 'text-rose-600' : 'text-emerald-700') },
                            adventurer.loyalty,
                            '%'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'bg-white p-3 border border-stone-100 rounded-sm shadow-sm' },
                        React.createElement(
                            'div',
                            { className: 'text-[10px] font-bold text-stone-400 mb-1' },
                            '年俸'
                        ),
                        React.createElement(
                            'div',
                            { className: 'text-lg font-bold text-stone-800' },
                            adventurer.salary.toLocaleString(),
                            ' G'
                        )
                    )
                ),
                adventurer.equippedArtifactId && React.createElement(
                    'div',
                    { className: 'bg-indigo-50 border border-indigo-200 p-4 rounded-sm shadow-sm' },
                    React.createElement(
                        'div',
                        { className: 'text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-widest flex items-center gap-1' },
                        React.createElement(Star, { className: 'w-3 h-3 text-indigo-500' }),
                        ' 装備中のアーティファクト'
                    ),
                    React.createElement(
                        'div',
                        { className: 'font-black text-indigo-900 mb-1' },
                        (window.G1.Constants.ARTIFACT_POOL.find(function (a) {
                            return a.id === adventurer.equippedArtifactId;
                        }) || {}).name
                    ),
                    React.createElement(
                        'p',
                        { className: 'text-xs text-indigo-700 leading-relaxed' },
                        (window.G1.Constants.ARTIFACT_POOL.find(function (a) {
                            return a.id === adventurer.equippedArtifactId;
                        }) || {}).desc
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'bg-white p-4 border border-stone-100 rounded-sm shadow-sm' },
                    React.createElement(
                        'div',
                        { className: 'text-[10px] font-bold text-stone-400 mb-3 flex items-center gap-1' },
                        React.createElement(Star, { className: 'w-3 h-3 text-amber-500' }),
                        ' 特徴: ',
                        adventurer.trait.name
                    ),
                    React.createElement(
                        'p',
                        { className: 'text-xs text-stone-600 leading-relaxed' },
                        adventurer.trait.desc
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h4',
                        { className: 'text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 border-b border-stone-100 pb-1' },
                        '活動履歴'
                    ),
                    React.createElement(
                        'div',
                        { className: 'space-y-1.5' },
                        (adventurer.history || []).map(function (log, i) {
                            return React.createElement(
                                'div',
                                { key: i, className: 'text-[11px] text-stone-500 flex gap-2' },
                                React.createElement(
                                    'span',
                                    { className: 'shrink-0' },
                                    '•'
                                ),
                                React.createElement(
                                    'span',
                                    null,
                                    log
                                )
                            );
                        })
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'p-4 bg-stone-50 border-t border-[#D4C3A3] flex gap-3' },
                React.createElement(
                    'button',
                    {
                        onClick: function () {
                            if (confirm('本当にこの冒険者を解雇しますか？')) onFire(adventurer.id);
                        },
                        className: 'flex-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 py-2.5 rounded-sm font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
                    },
                    React.createElement(Skull, { className: 'w-4 h-4' }),
                    ' ギルドから追放する'
                )
            )
        )
    );
};
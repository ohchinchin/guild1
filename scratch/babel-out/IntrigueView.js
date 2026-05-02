'use strict';

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.IntrigueView = function (_ref) {
    var gameState = _ref.gameState;
    var onSabotage = _ref.onSabotage;
    var onHeadhunt = _ref.onHeadhunt;
    var onIntelligence = _ref.onIntelligence;

    var L = window.LucideReact;
    var SafeIcon = function SafeIcon(name) {
        return L[name] || L[name.replace('2', '')] || L.Zap;
    };

    var EyeOff = SafeIcon('EyeOff');
    var UserMinus = SafeIcon('UserMinus');
    var Zap = SafeIcon('Zap');
    var Search = SafeIcon('Search');

    return React.createElement(
        'div',
        { key: 'intrigue', className: 'space-y-6 animate-in fade-in slide-in-from-right-4 duration-500' },
        React.createElement(
            'p',
            { className: 'text-sm font-bold text-stone-600 mb-4' },
            'ライバルギルドへの工作・諜報活動。リスクを伴いますが、優位に立つための手段です。'
        ),
        React.createElement(
            'div',
            { className: 'grid grid-cols-1 gap-6' },
            gameState.rivals.map(function (rival) {
                return React.createElement(
                    'div',
                    { key: rival.id, className: 'bg-white border-2 border-[#D4C3A3] p-6 rounded-sm shadow-sm relative overflow-hidden group' },
                    React.createElement(
                        'div',
                        { className: 'flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6' },
                        React.createElement(
                            'div',
                            { className: 'flex-1' },
                            React.createElement(
                                'div',
                                { className: 'flex items-center gap-3 mb-2' },
                                React.createElement(
                                    'h3',
                                    { className: 'font-black text-xl text-stone-800' },
                                    rival.name
                                ),
                                React.createElement(
                                    'span',
                                    { className: 'text-[10px] font-bold bg-stone-100 px-2 py-0.5 rounded border border-stone-200 uppercase tracking-tighter' },
                                    rival.style
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'flex items-center gap-4' },
                                React.createElement(
                                    'div',
                                    { className: 'text-sm font-bold text-indigo-700' },
                                    '推定戦力: ',
                                    rival.power
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'text-xs font-bold text-stone-500' },
                                    '友好度: ',
                                    React.createElement(
                                        'span',
                                        { className: rival.relation >= 70 ? 'text-emerald-600' : rival.relation >= 40 ? 'text-amber-600' : 'text-rose-600' },
                                        rival.relation
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto' },
                            React.createElement(
                                'button',
                                {
                                    onClick: function () {
                                        return onSabotage(rival.id);
                                    },
                                    className: 'bg-stone-800 hover:bg-rose-700 text-white px-4 py-3 rounded-sm font-bold text-xs transition-all flex items-center justify-center gap-2 group/btn'
                                },
                                React.createElement(Zap, { className: 'w-4 h-4 group-hover/btn:animate-pulse' }),
                                ' 妨害工作 (500G)'
                            ),
                            React.createElement(
                                'button',
                                {
                                    onClick: function () {
                                        return onHeadhunt(rival.id);
                                    },
                                    className: 'bg-stone-800 hover:bg-amber-600 text-white px-4 py-3 rounded-sm font-bold text-xs transition-all flex items-center justify-center gap-2 group/btn'
                                },
                                React.createElement(UserMinus, { className: 'w-4 h-4 group-hover/btn:scale-110' }),
                                ' 人材引抜 (1500G)'
                            ),
                            React.createElement(
                                'button',
                                {
                                    onClick: function () {
                                        return onIntelligence(rival.id);
                                    },
                                    className: 'bg-stone-800 hover:bg-indigo-600 text-white px-4 py-3 rounded-sm font-bold text-xs transition-all flex items-center justify-center gap-2 group/btn'
                                },
                                React.createElement(Search, { className: 'w-4 h-4 group-hover/btn:rotate-12' }),
                                ' 情報収集 (300G)'
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'w-full bg-stone-100 h-1.5 rounded-full overflow-hidden' },
                        React.createElement('div', { className: 'h-full transition-all duration-1000 ' + (rival.relation >= 70 ? 'bg-emerald-500' : rival.relation >= 40 ? 'bg-amber-500' : 'bg-rose-500'), style: { width: rival.relation + '%' } })
                    )
                );
            })
        ),
        gameState.rivals.length === 0 && React.createElement(
            'div',
            { className: 'text-center p-12 text-stone-400 border-2 border-dashed border-[#D4C3A3] bg-white/50' },
            '現在、競合する有力なギルドは存在しません。'
        )
    );
};
'use strict';

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.RosterView = function (_ref) {
    var gameState = _ref.gameState;
    var onSelectAdv = _ref.onSelectAdv;
    var onSearchAdv = _ref.onSearchAdv;

    var L = window.LucideReact;
    var SafeIcon = function SafeIcon(name) {
        return L[name] || L[name.replace('2', '')] || L.Users;
    };

    var Search = SafeIcon('Search');
    var Users = SafeIcon('Users');

    return React.createElement(
        'div',
        { key: 'roster', className: 'flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500' },
        React.createElement(
            'div',
            { className: 'flex-1 flex flex-col min-h-[300px]' },
            React.createElement(
                'div',
                { className: 'flex justify-between items-center mb-3 shrink-0' },
                React.createElement(
                    'p',
                    { className: 'text-sm font-bold text-stone-600' },
                    '所属冒険者一覧'
                ),
                React.createElement(
                    'div',
                    { className: 'flex gap-2' },
                    React.createElement(
                        'button',
                        {
                            onClick: onSearchAdv,
                            className: 'text-xs font-bold bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95'
                        },
                        React.createElement(Search, { className: 'w-3.5 h-3.5' }),
                        ' 人材を捜索 (500G)'
                    ),
                    React.createElement(
                        'span',
                        { className: 'text-xs font-bold text-stone-600 bg-[#E8E0D5] px-2 py-1 rounded-sm border border-[#D4C3A3] flex items-center' },
                        '所属: ',
                        gameState.adventurers.length,
                        ' / ',
                        gameState.facilities.residence * 5,
                        ' 名'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pb-4 pr-1' },
                gameState.adventurers.map(function (adv) {
                    var ClassData = window.G1.Constants.CLASSES.find(function (c) {
                        return c.id === adv.advClass.id;
                    });
                    var AdvIcon = SafeIcon(ClassData ? ClassData.icon : 'User');
                    return React.createElement(
                        'button',
                        {
                            key: adv.id,
                            onClick: function () {
                                return onSelectAdv(adv);
                            },
                            className: 'p-3 bg-white border ' + (adv.status !== 'idle' ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-[#E8E0D5]') + ' rounded-sm shadow-sm flex justify-between items-center hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all group text-left relative'
                        },
                        adv.status !== 'idle' && React.createElement(
                            'div',
                            { className: 'absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm' },
                            '派遣中'
                        ),
                        React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'div',
                                { className: 'text-sm font-bold text-stone-800 flex items-center gap-2 mb-1 group-hover:text-amber-700 transition-colors' },
                                React.createElement(
                                    'span',
                                    { className: 'truncate max-w-[90px]' },
                                    adv.name
                                ),
                                React.createElement(
                                    'span',
                                    { className: 'text-[10px] px-1.5 py-0.5 rounded-sm font-bold border shrink-0 ' + (adv.rank === 'S' ? 'bg-amber-100 text-amber-800 border-amber-300' : adv.rank === 'A' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-stone-100 text-stone-600 border-stone-300') },
                                    adv.rank,
                                    ' 級'
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-[11px] font-medium flex items-center gap-1 text-indigo-700' },
                                React.createElement(AdvIcon, { className: 'w-3 h-3' }),
                                ' ',
                                adv.advClass.name,
                                ' ',
                                React.createElement(
                                    'span',
                                    { className: 'text-stone-400' },
                                    '|'
                                ),
                                ' ',
                                React.createElement(
                                    'span',
                                    { className: 'text-amber-700' },
                                    adv.personality.name
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'text-right shrink-0' },
                            React.createElement(
                                'div',
                                { className: 'text-sm font-bold text-stone-800' },
                                '戦力 ',
                                adv.power
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-[10px] font-bold mt-1 ' + (adv.loyalty < 30 ? 'text-rose-600' : 'text-emerald-700') },
                                '忠誠 ',
                                adv.loyalty,
                                '%'
                            )
                        )
                    );
                })
            )
        )
    );
};
'use strict';

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.HomeView = function (_ref) {
    var gameState = _ref.gameState;
    var onOpenSpecial = _ref.onOpenSpecial;
    var onDeclineSpecial = _ref.onDeclineSpecial;
    var onHireReceptionist = _ref.onHireReceptionist;
    var onSelectAdv = _ref.onSelectAdv;

    var L = window.LucideReact;
    var SafeIcon = function SafeIcon(name) {
        return L[name] || L[name.replace('2', '')] || L.Activity;
    };

    var Target = SafeIcon('Target');
    var MessageSquare = SafeIcon('MessageSquare');
    var AlertTriangle = SafeIcon('AlertTriangle');
    var ScrollText = SafeIcon('ScrollText');
    var Coins = SafeIcon('Coins');
    var HeartHandshake = SafeIcon('HeartHandshake');
    var Swords = SafeIcon('Swords');
    var ChevronRight = SafeIcon('ChevronRight');
    var Search = SafeIcon('Search');
    var EyeOff = SafeIcon('EyeOff');
    var Star = SafeIcon('Star');
    var Activity = SafeIcon('Activity');

    var currentYear = Math.floor((gameState.turn - 1) / 4) + 1;
    var currentSeason = window.G1.Constants.SEASONS[(gameState.turn - 1) % 4];

    // Forecast Logic
    var getForecast = function getForecast() {
        var salaries = gameState.adventurers.reduce(function (sum, a) {
            return sum + a.salary;
        }, 0) + gameState.receptionist.salary;
        var baseMaintenance = Math.pow(gameState.facilities.residence, 1.5) * 150 + Math.pow(gameState.facilities.tavern, 1.5) * 100 + Math.pow(gameState.facilities.training, 1.5) * 100;
        var maintenance = Math.floor(baseMaintenance * 0.8);
        var choresIncome = gameState.adventurers.filter(function (a) {
            return a.status === 'idle';
        }).length * 40;
        var commerceIncome = Math.floor(gameState.facilities.tavern * 400 * (gameState.alignment.commerce / 25));
        return { income: choresIncome + commerceIncome, expense: salaries + maintenance, net: choresIncome + commerceIncome - (salaries + maintenance) };
    };

    var forecast = getForecast();

    return React.createElement(
        'div',
        { key: 'home', className: 'space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 overflow-y-auto pr-1' },
        gameState.specialRequest && React.createElement(
            'div',
            { className: 'bg-indigo-900 border-2 border-indigo-500 p-5 rounded-sm shadow-xl text-indigo-50 relative overflow-hidden shrink-0' },
            React.createElement(
                'div',
                { className: 'absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4' },
                React.createElement(Target, { className: 'w-48 h-48 text-indigo-400' })
            ),
            React.createElement(
                'div',
                { className: 'relative z-10' },
                React.createElement(
                    'h4',
                    { className: 'font-black text-2xl mb-2 flex items-center gap-2 text-indigo-200' },
                    React.createElement(Target, { className: 'w-8 h-8' }),
                    ' 特殊指名依頼: ',
                    gameState.specialRequest.name
                ),
                React.createElement(
                    'p',
                    { className: 'text-sm text-indigo-100 mb-4 leading-relaxed max-w-2xl' },
                    gameState.specialRequest.desc
                ),
                React.createElement(
                    'div',
                    { className: 'flex gap-6 text-sm font-bold mb-5 bg-indigo-950/50 p-3 rounded-sm border border-indigo-700/50' },
                    React.createElement(
                        'span',
                        null,
                        '推奨戦力: ',
                        React.createElement(
                            'span',
                            { className: 'text-rose-400 text-lg' },
                            gameState.specialRequest.powerReq
                        )
                    ),
                    React.createElement(
                        'span',
                        null,
                        '報奨金: ',
                        React.createElement(
                            'span',
                            { className: 'text-amber-400 text-lg' },
                            gameState.specialRequest.reward.toLocaleString(),
                            ' G'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'flex gap-3' },
                    React.createElement(
                        'button',
                        { onClick: onOpenSpecial, className: 'bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-sm font-black shadow-lg transition-all active:scale-95' },
                        '派遣部隊を編成する'
                    ),
                    React.createElement(
                        'button',
                        { onClick: onDeclineSpecial, className: 'bg-indigo-800 hover:bg-indigo-700 text-indigo-200 px-6 py-2.5 rounded-sm font-bold transition-all active:scale-95' },
                        '辞退する'
                    )
                )
            )
        ),
        gameState.dispatches && gameState.dispatches.length > 0 && React.createElement(
            'div',
            { className: 'bg-white border-2 border-indigo-200 p-5 rounded-sm shadow-sm shrink-0' },
            React.createElement(
                'h3',
                { className: 'text-lg font-black text-indigo-800 mb-4 flex items-center gap-3 border-b border-indigo-50 pb-2' },
                React.createElement(Activity, { className: 'w-5 h-5 text-indigo-500' }),
                ' 現在遂行中の任務 (',
                gameState.dispatches.length,
                ')'
            ),
            React.createElement(
                'div',
                { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
                gameState.dispatches.map(function (d, idx) {
                    return React.createElement(
                        'div',
                        { key: idx, className: 'flex justify-between items-center p-3 bg-indigo-50/30 border border-indigo-100 rounded-sm hover:bg-indigo-50 transition-colors' },
                        React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'div',
                                { className: 'font-bold text-indigo-900 text-sm' },
                                d.quest.name
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-[10px] text-indigo-400 font-bold flex gap-2' },
                                React.createElement(
                                    'span',
                                    null,
                                    '派遣人数: ',
                                    d.partyIds.length,
                                    '名'
                                ),
                                d.isSpecial && React.createElement(
                                    'span',
                                    { className: 'text-rose-500' },
                                    '★ 特殊'
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'text-right' },
                            React.createElement(
                                'span',
                                { className: 'text-[10px] font-black text-indigo-600 animate-pulse bg-indigo-100 px-2 py-0.5 rounded-full' },
                                '任務遂行中'
                            )
                        )
                    );
                })
            )
        ),
        React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            React.createElement(
                'div',
                { className: 'bg-[#F2E8C6] border-2 border-[#D4C3A3] p-5 rounded-sm shadow-sm relative overflow-hidden group' },
                React.createElement(MessageSquare, { className: 'absolute -top-2 -left-2 w-16 h-16 text-amber-700/10 group-hover:scale-110 transition-transform' }),
                React.createElement(
                    'p',
                    { className: 'text-stone-700 italic font-medium leading-relaxed relative z-10 pl-4' },
                    '「',
                    gameState.currentRumor || '最近は特に変わった噂は聞かないな。',
                    '」'
                )
            ),
            gameState.currentEvent && React.createElement(
                'div',
                { className: 'bg-rose-50 border-l-4 border-rose-500 p-4 rounded-sm shadow-sm flex items-start gap-4' },
                React.createElement(AlertTriangle, { className: 'w-8 h-8 text-rose-600 shrink-0' }),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h4',
                        { className: 'font-black text-rose-900 text-sm mb-1' },
                        '【世界情勢】',
                        gameState.currentEvent.name
                    ),
                    React.createElement(
                        'p',
                        { className: 'text-xs text-rose-800 leading-relaxed' },
                        gameState.currentEvent.desc
                    )
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'grid grid-cols-1 xl:grid-cols-2 gap-6' },
            React.createElement(
                'div',
                { className: 'bg-white p-6 border-2 border-[#E8E0D5] rounded-sm shadow-sm flex flex-col' },
                React.createElement(
                    'h3',
                    { className: 'text-xl font-black text-stone-800 mb-4 flex items-center gap-3 border-b-2 border-stone-100 pb-3' },
                    React.createElement(ScrollText, { className: 'w-6 h-6 text-indigo-700' }),
                    ' ギルド概況報告'
                ),
                React.createElement(
                    'div',
                    { className: 'space-y-4 text-stone-700 font-medium flex-1' },
                    React.createElement(
                        'p',
                        { className: 'leading-relaxed' },
                        'マスター、第 ',
                        currentYear,
                        ' 暦 【',
                        currentSeason,
                        '】の状況です。',
                        React.createElement('br', null),
                        '現在、金庫には ',
                        React.createElement(
                            'span',
                            { className: 'font-bold text-amber-600 text-lg' },
                            gameState.budget.toLocaleString(),
                            ' G'
                        ),
                        ' の蓄えがあり、',
                        React.createElement(
                            'span',
                            { className: 'font-bold text-stone-800' },
                            ' ',
                            gameState.adventurers.length,
                            ' 名'
                        ),
                        ' の冒険者が所属しています。'
                    ),
                    React.createElement(
                        'div',
                        { className: 'grid grid-cols-2 gap-4 pt-2' },
                        React.createElement(
                            'div',
                            { className: 'bg-stone-50 p-3 rounded-sm border border-stone-100' },
                            React.createElement(
                                'div',
                                { className: 'text-[10px] font-bold text-stone-400 uppercase' },
                                '名声'
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-xl font-black text-indigo-700' },
                                gameState.fame
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'bg-stone-50 p-3 rounded-sm border border-stone-100' },
                            React.createElement(
                                'div',
                                { className: 'text-[10px] font-bold text-stone-400 uppercase' },
                                '悪名'
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-xl font-black text-rose-800' },
                                gameState.notoriety
                            )
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'bg-stone-800 p-6 border-2 border-stone-700 rounded-sm shadow-xl flex flex-col text-stone-200' },
                React.createElement(
                    'h3',
                    { className: 'text-xl font-black text-[#D9A94E] mb-4 flex items-center gap-3 border-b border-stone-700 pb-3' },
                    React.createElement(Coins, { className: 'w-6 h-6' }),
                    ' 次期収支予測'
                ),
                React.createElement(
                    'div',
                    { className: 'space-y-4 flex-1' },
                    React.createElement(
                        'div',
                        { className: 'flex justify-between items-center bg-stone-900/50 p-3 rounded-sm' },
                        React.createElement(
                            'span',
                            { className: 'text-sm font-bold text-stone-400' },
                            '予想総収入'
                        ),
                        React.createElement(
                            'span',
                            { className: 'text-xl font-black text-emerald-400' },
                            '+',
                            forecast.income.toLocaleString(),
                            ' G'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'flex justify-between items-center bg-stone-900/50 p-3 rounded-sm' },
                        React.createElement(
                            'span',
                            { className: 'text-sm font-bold text-stone-400' },
                            '確定維持費'
                        ),
                        React.createElement(
                            'span',
                            { className: 'text-xl font-black text-rose-400' },
                            '-',
                            forecast.expense.toLocaleString(),
                            ' G'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'pt-4 border-t border-stone-700 flex justify-between items-center' },
                        React.createElement(
                            'span',
                            { className: 'font-black text-[#D9A94E]' },
                            '次期純増減'
                        ),
                        React.createElement(
                            'span',
                            { className: 'text-3xl font-black ' + (forecast.net >= 0 ? 'text-emerald-500' : 'text-rose-500') },
                            forecast.net >= 0 ? '+' : '',
                            forecast.net.toLocaleString(),
                            ' G'
                        )
                    )
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'grid grid-cols-1 xl:grid-cols-2 gap-6' },
            React.createElement(
                'div',
                { className: 'bg-white border-2 border-[#D4C3A3] p-6 rounded-sm shadow-sm' },
                React.createElement(
                    'h3',
                    { className: 'text-xl font-black text-stone-800 mb-4 flex items-center gap-3 border-b-2 border-stone-100 pb-3' },
                    React.createElement(HeartHandshake, { className: 'w-6 h-6 text-rose-600' }),
                    ' 受付嬢・看板娘'
                ),
                React.createElement(
                    'div',
                    { className: 'flex items-start gap-4' },
                    React.createElement(
                        'div',
                        { className: 'w-24 h-24 bg-stone-100 rounded-sm flex items-center justify-center shrink-0 border-2 border-stone-200 overflow-hidden' },
                        React.createElement('img', { src: 'assets/images/hire_receptionist.png', className: 'w-full h-full object-cover', alt: '' })
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            { className: 'text-lg font-black text-indigo-900' },
                            gameState.receptionist.name
                        ),
                        React.createElement(
                            'div',
                            { className: 'text-[10px] font-bold text-stone-400 uppercase mb-2' },
                            '種別: ',
                            gameState.receptionist.type
                        ),
                        React.createElement(
                            'p',
                            { className: 'text-xs text-stone-600 leading-relaxed' },
                            gameState.receptionist.desc
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'bg-white border-2 border-[#D4C3A3] p-6 rounded-sm shadow-sm' },
                React.createElement(
                    'h3',
                    { className: 'text-xl font-black text-stone-800 mb-4 flex items-center gap-3 border-b-2 border-stone-100 pb-3' },
                    React.createElement(Swords, { className: 'w-6 h-6 text-rose-700' }),
                    ' 他ギルドの動向'
                ),
                React.createElement(
                    'div',
                    { className: 'space-y-3' },
                    gameState.rivals && gameState.rivals.slice(0, 3).map(function (rival) {
                        return React.createElement(
                            'div',
                            { key: rival.id, className: 'flex justify-between items-center p-2 hover:bg-stone-50 rounded-sm transition-colors cursor-pointer border border-transparent hover:border-stone-100' },
                            React.createElement(
                                'div',
                                { className: 'flex items-center gap-3' },
                                React.createElement('div', { className: 'w-2 h-2 rounded-full ' + (rival.relation >= 70 ? 'bg-emerald-500' : rival.relation >= 40 ? 'bg-amber-500' : 'bg-rose-500') }),
                                React.createElement(
                                    'span',
                                    { className: 'font-bold text-sm text-stone-700' },
                                    rival.name
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-right' },
                                React.createElement(
                                    'span',
                                    { className: 'text-xs font-black text-stone-400' },
                                    '戦力 ',
                                    rival.power
                                )
                            )
                        );
                    })
                )
            )
        )
    );
};
/* Special Request */ /* Active Dispatches */
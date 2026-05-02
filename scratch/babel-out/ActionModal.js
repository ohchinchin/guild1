'use strict';

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.ActionModal = function (_ref) {
    var actionModal = _ref.actionModal;

    if (!actionModal) return null;

    var ConfettiEffect = window.G1.components.ConfettiEffect;

    var imgPath = '';
    var type = actionModal.type;
    if (type === 'recruit_search') imgPath = 'assets/images/recruit_search.png';else if (type === 'recruit_found') imgPath = 'assets/images/recruit_found.png';else if (type === 'recruit_failed') imgPath = 'assets/images/recruit_failed.png';else if (type === 'skill_upgrade') imgPath = 'assets/images/skill_upgrade.png';else if (type === 'hire_receptionist') imgPath = 'assets/images/hire_receptionist.png';else if (type === 'invest_facility') imgPath = 'assets/images/invest_facility.png';else if (type === 'invest_shop') imgPath = 'assets/images/invest_shop.png';else if (type === 'action_sabotage') imgPath = 'assets/images/action_sabotage.png';else if (type === 'action_intelligence') imgPath = 'assets/images/action_intelligence.png';else if (type === 'action_headhunt') imgPath = 'assets/images/action_headhunt.png';else if (type === 'action_alliance') imgPath = 'assets/images/action_alliance.png';else if (type === 'action_quest') imgPath = 'assets/images/action_quest.png';

    var isHighRank = actionModal.foundRank === 'S' || actionModal.foundRank === 'A';
    var isS = actionModal.foundRank === 'S';
    var isA = actionModal.foundRank === 'A';
    var glowClass = isS ? 'gacha-glow-s' : isA ? 'gacha-glow-a' : '';

    return React.createElement(
        'div',
        { className: 'fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4 font-serif backdrop-blur-md animate-in fade-in duration-300' },
        React.createElement(
            'div',
            { className: 'bg-stone-900 border-2 ' + (glowClass || 'border-stone-700') + ' rounded-sm shadow-2xl max-w-md w-full overflow-hidden relative' },
            isHighRank && actionModal.phase === 'result' && React.createElement(ConfettiEffect, { rank: actionModal.foundRank }),
            isS && actionModal.phase === 'result' && React.createElement('div', { className: 'light-burst' }),
            imgPath && React.createElement(
                'div',
                { className: 'w-full h-64 overflow-hidden relative' },
                React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent z-10' }),
                React.createElement('img', { src: imgPath, className: 'w-full h-full object-cover object-center ' + (actionModal.phase === 'searching' ? 'animate-pulse scale-105' : 'scale-100') + ' transition-transform duration-1000', alt: '' })
            ),
            React.createElement(
                'div',
                { className: 'p-8 text-center bg-stone-900 relative z-20' },
                isHighRank && actionModal.phase === 'result' && React.createElement(
                    'div',
                    { className: 'mb-4 font-black tracking-widest ' + (isS ? 'rank-text-s' : 'rank-text-a') },
                    '★ ',
                    isS ? 'S' : 'A',
                    '-RANK ★'
                ),
                React.createElement(
                    'p',
                    { className: 'text-lg font-bold text-[#E8E0D5] leading-relaxed whitespace-pre-wrap' },
                    actionModal.message
                ),
                actionModal.phase === 'searching' && React.createElement(
                    'div',
                    { className: 'mt-6 flex justify-center gap-2' },
                    React.createElement('div', { className: 'w-2 h-2 bg-amber-500 rounded-full animate-bounce', style: { animationDelay: '0ms' } }),
                    React.createElement('div', { className: 'w-2 h-2 bg-amber-500 rounded-full animate-bounce', style: { animationDelay: '150ms' } }),
                    React.createElement('div', { className: 'w-2 h-2 bg-amber-500 rounded-full animate-bounce', style: { animationDelay: '300ms' } })
                )
            )
        )
    );
};
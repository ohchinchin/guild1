'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.PolicyView = function (_ref) {
    var gameState = _ref.gameState;
    var onUpdateAlignment = _ref.onUpdateAlignment;

    var L = window.LucideReact;
    var SafeIcon = function SafeIcon(name) {
        return L[name] || L[name.replace('2', '')] || L.Shield;
    };

    var Shield = SafeIcon('Shield');
    var MapIcon = SafeIcon('Map');
    var Swords = SafeIcon('Swords');
    var Coins = SafeIcon('Coins');
    var Info = SafeIcon('Info');

    var policies = [{ id: 'safety', label: '安全重視', icon: Shield, desc: '冒険者の安全を第一に。死亡率が低下しますが、戦力の成長は緩やかになります。', color: 'text-emerald-600' }, { id: 'adventure', label: '冒険重視', icon: MapIcon, desc: '未知の探索を。新しいダンジョンの発見率と探索成功率が上がります。', color: 'text-indigo-600' }, { id: 'military', label: '武力重視', icon: Swords, desc: '戦闘能力の向上。戦士系の能力が大幅に上がりますが、維持費が増加します。', color: 'text-rose-600' }, { id: 'commerce', label: '商業重視', icon: Coins, desc: 'ギルドの収益を最優先。酒場などの収入が増えますが、忠誠度が下がりやすくなります。', color: 'text-amber-600' }];

    var total = Object.values(gameState.alignment).reduce(function (a, b) {
        return a + b;
    }, 0);

    var handleSliderChange = function handleSliderChange(id, value) {
        var newVal = parseInt(value);
        var diff = newVal - gameState.alignment[id];
        var otherIds = policies.filter(function (p) {
            return p.id !== id;
        }).map(function (p) {
            return p.id;
        });
        var nextAlignment = _extends({}, gameState.alignment, _defineProperty({}, id, newVal));
        var share = diff / otherIds.length;
        otherIds.forEach(function (oid) {
            nextAlignment[oid] = Math.max(0, Math.min(100, nextAlignment[oid] - share));
        });
        var currentTotal = Object.values(nextAlignment).reduce(function (a, b) {
            return a + b;
        }, 0);
        if (currentTotal !== 100) nextAlignment[otherIds[0]] += 100 - currentTotal;
        onUpdateAlignment(nextAlignment);
    };

    return React.createElement(
        'div',
        { key: 'policies', className: 'space-y-6 animate-in fade-in slide-in-from-right-4 duration-500' },
        React.createElement(
            'div',
            { className: 'flex justify-between items-center' },
            React.createElement(
                'p',
                { className: 'text-sm font-bold text-stone-600' },
                'ギルド運営方針の調整'
            ),
            React.createElement(
                'div',
                { className: 'flex items-center gap-2 bg-stone-100 px-3 py-1 rounded-full border border-stone-200' },
                React.createElement(Info, { className: 'w-3.5 h-3.5 text-stone-400' }),
                React.createElement(
                    'span',
                    { className: 'text-[10px] font-bold text-stone-500' },
                    '合計配分: ',
                    Math.round(total),
                    '%'
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            policies.map(function (policy) {
                return React.createElement(
                    'div',
                    { key: policy.id, className: 'bg-white border border-stone-200 p-5 rounded-sm shadow-sm relative overflow-hidden' },
                    React.createElement(
                        'div',
                        { className: 'flex items-center gap-3 mb-4' },
                        React.createElement(
                            'div',
                            { className: 'p-2 rounded-sm bg-stone-50 ' + policy.color },
                            React.createElement(policy.icon, { className: 'w-5 h-5' })
                        ),
                        React.createElement(
                            'h3',
                            { className: 'font-bold text-stone-800' },
                            policy.label
                        ),
                        React.createElement(
                            'span',
                            { className: 'ml-auto font-black text-xl text-stone-700' },
                            Math.round(gameState.alignment[policy.id]),
                            '%'
                        )
                    ),
                    React.createElement(
                        'p',
                        { className: 'text-xs text-stone-500 mb-6 leading-relaxed' },
                        policy.desc
                    ),
                    React.createElement('input', {
                        type: 'range', min: '0', max: '100', step: '1',
                        value: gameState.alignment[policy.id],
                        onChange: function (e) {
                            return handleSliderChange(policy.id, e.target.value);
                        },
                        className: 'w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-800'
                    })
                );
            })
        )
    );
};
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.MasterSkillView = function (_ref) {
    var gameState = _ref.gameState;
    var onUpgrade = _ref.onUpgrade;

    var L = window.LucideReact;
    var SafeIcon = function SafeIcon(name) {
        return L[name] || L[name.replace('2', '')] || L.Star;
    };

    var Crown = SafeIcon('Crown');
    var Zap = SafeIcon('Zap');
    var Star = SafeIcon('Star');
    var Shield = SafeIcon('Shield');
    var Search = SafeIcon('Search');
    var PieChart = SafeIcon('PieChart');

    var skills = [{ id: 'charisma', name: 'カリスマ', icon: PieChart, desc: '冒険者の忠誠度が自然回復しやすくなる。' }, { id: 'underworld', name: '裏社会の顔', icon: Zap, desc: '諜報や裏工作の成功率、および防諜能力が上昇する。' }, { id: 'business', name: '商才', icon: Star, desc: '酒場などの商業収入と内政収入が増加する。' }, { id: 'leadership', name: '統率力', icon: Shield, desc: '部隊の総合戦力に強力なリーダーシップボーナスを与える。' }, { id: 'recruitment', name: 'スカウト術', icon: Search, desc: '「人材捜索」での発見率と高ランク出現率が向上する。' }];

    return React.createElement(
        'div',
        { key: 'skills', className: 'space-y-6 animate-in fade-in slide-in-from-right-4 duration-500' },
        React.createElement(
            'p',
            { className: 'text-sm font-bold text-stone-600 mb-4' },
            'ギルドマスター自身の能力を強化します。'
        ),
        React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            skills.map(function (skill) {
                var currentLevel = gameState.masterSkills[skill.id] || 0;
                var cost = 2000 * (currentLevel + 1);
                var isMax = currentLevel >= 3;
                var Icon = skill.icon;
                return React.createElement(
                    'div',
                    { key: skill.id, className: 'bg-white border-2 border-[#D4C3A3] p-5 rounded-sm shadow-sm flex flex-col hover:border-indigo-400 transition-all group' },
                    React.createElement(
                        'div',
                        { className: 'flex items-center gap-4 mb-4' },
                        React.createElement(
                            'div',
                            { className: 'p-3 bg-indigo-50 text-indigo-700 rounded-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors' },
                            React.createElement(Icon, { className: 'w-6 h-6' })
                        ),
                        React.createElement(
                            'div',
                            { className: 'flex-1' },
                            React.createElement(
                                'div',
                                { className: 'flex justify-between items-center mb-1' },
                                React.createElement(
                                    'h4',
                                    { className: 'font-black text-lg text-stone-800' },
                                    skill.name
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'flex gap-1' },
                                    [].concat(_toConsumableArray(Array(3))).map(function (_, i) {
                                        return React.createElement('div', { key: i, className: 'w-3 h-3 rounded-full border ' + (i < currentLevel ? 'bg-indigo-600 border-indigo-700' : 'bg-stone-100 border-stone-200') });
                                    })
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'text-[10px] font-bold text-indigo-600 uppercase tracking-widest' },
                                '熟練度: ',
                                currentLevel,
                                ' / 3'
                            )
                        )
                    ),
                    React.createElement(
                        'p',
                        { className: 'text-xs text-stone-500 leading-relaxed mb-6 flex-1' },
                        skill.desc
                    ),
                    React.createElement(
                        'button',
                        {
                            onClick: function () {
                                return onUpgrade(skill.id);
                            },
                            disabled: isMax || gameState.budget < cost,
                            className: 'w-full py-2.5 rounded-sm font-black text-sm transition-all shadow-md active:scale-95 ' + (isMax ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200' : gameState.budget < cost ? 'bg-stone-50 text-stone-400 cursor-not-allowed' : 'bg-stone-800 hover:bg-stone-700 text-[#F2E8C6]')
                        },
                        isMax ? '極みに達しました' : gameState.budget < cost ? cost.toLocaleString() + 'G 必要' : cost.toLocaleString() + 'G で修得する'
                    )
                );
            })
        )
    );
};
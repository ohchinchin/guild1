'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

(function () {
    var _React = React;
    var useState = _React.useState;
    var useEffect = _React.useEffect;
    var useRef = _React.useRef;

    window.G1.components.TypewriterText = function (_ref) {
        var text = _ref.text;
        var _ref$speed = _ref.speed;
        var speed = _ref$speed === undefined ? 40 : _ref$speed;
        var _ref$className = _ref.className;
        var className = _ref$className === undefined ? '' : _ref$className;
        var onComplete = _ref.onComplete;

        var _useState = useState('');

        var _useState2 = _slicedToArray(_useState, 2);

        var displayed = _useState2[0];
        var setDisplayed = _useState2[1];

        var _useState3 = useState(false);

        var _useState32 = _slicedToArray(_useState3, 2);

        var done = _useState32[0];
        var setDone = _useState32[1];

        var indexRef = useRef(0);
        useEffect(function () {
            setDisplayed('');setDone(false);indexRef.current = 0;
            var timer = setInterval(function () {
                indexRef.current++;
                if (indexRef.current >= text.length) {
                    setDisplayed(text);setDone(true);clearInterval(timer);if (onComplete) onComplete();
                } else {
                    setDisplayed(text.slice(0, indexRef.current));
                }
            }, speed);
            return function () {
                return clearInterval(timer);
            };
        }, [text, speed, onComplete]);
        return React.createElement(
            'span',
            { className: className },
            displayed,
            !done && React.createElement('span', { className: 'typewriter-cursor' })
        );
    };

    window.G1.components.ConfettiEffect = function (_ref2) {
        var rank = _ref2.rank;

        var pieces = useRef([]);
        if (pieces.current.length === 0) {
            var colors = rank === 'S' ? ['#fbbf24', '#f59e0b', '#fcd34d', '#fff7ed', '#fef3c7', '#d97706'] : ['#a78bfa', '#8b5cf6', '#c4b5fd', '#e9d5ff', '#7c3aed', '#ddd6fe'];
            for (var i = 0; i < 40; i++) {
                pieces.current.push({ id: i, left: Math.random() * 100, delay: Math.random() * 2, duration: 2 + Math.random() * 3, color: colors[Math.floor(Math.random() * colors.length)], size: 6 + Math.random() * 10, shape: Math.random() > 0.5 ? 'circle' : 'rect' });
            }
        }
        return React.createElement(
            'div',
            { className: 'confetti-container' },
            pieces.current.map(function (p) {
                return React.createElement('div', { key: p.id, className: 'confetti-piece', style: { left: p.left + '%', animationDelay: p.delay + 's', '--duration': p.duration + 's', backgroundColor: p.color, width: p.size + 'px', height: p.size + 'px', borderRadius: p.shape === 'circle' ? '50%' : '2px' } });
            })
        );
    };
})();
window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

(() => {
    const { useState, useEffect, useRef } = React;

    window.G1.components.TypewriterText = ({ text, speed = 40, className = '', onComplete }) => {
        const [displayed, setDisplayed] = useState('');
        const [done, setDone] = useState(false);
        const indexRef = useRef(0);
        useEffect(() => {
            setDisplayed(''); setDone(false); indexRef.current = 0;
            const timer = setInterval(() => {
                indexRef.current++;
                if (indexRef.current >= text.length) {
                    setDisplayed(text); setDone(true); clearInterval(timer); if (onComplete) onComplete();
                } else { setDisplayed(text.slice(0, indexRef.current)); }
            }, speed);
            return () => clearInterval(timer);
        }, [text, speed, onComplete]);
        return <span className={className}>{displayed}{!done && <span className="typewriter-cursor"></span>}</span>;
    };

    window.G1.components.ConfettiEffect = ({ rank }) => {
        const pieces = useRef([]);
        if (pieces.current.length === 0) {
            const colors = rank === 'S' ? ['#fbbf24', '#f59e0b', '#fcd34d', '#fff7ed', '#fef3c7', '#d97706'] : ['#a78bfa', '#8b5cf6', '#c4b5fd', '#e9d5ff', '#7c3aed', '#ddd6fe'];
            for (let i = 0; i < 40; i++) pieces.current.push({ id: i, left: Math.random() * 100, delay: Math.random() * 2, duration: 2 + Math.random() * 3, color: colors[Math.floor(Math.random() * colors.length)], size: 6 + Math.random() * 10, shape: Math.random() > 0.5 ? 'circle' : 'rect' });
        }
        return <div className="confetti-container">{pieces.current.map(p => <div key={p.id} className="confetti-piece" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, '--duration': `${p.duration}s`, backgroundColor: p.color, width: `${p.size}px`, height: `${p.size}px`, borderRadius: p.shape === 'circle' ? '50%' : '2px' }} />)}</div>;
    };
})();

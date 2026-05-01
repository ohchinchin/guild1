const React = window.React;
const { useEffect } = React;

const ConfettiEffect = ({ rank }) => {
    useEffect(() => {
        const colors = rank === 'S' ? ['#fbbf24', '#f59e0b', '#d97706', '#fff'] : ['#a855f7', '#7e22ce', '#9333ea', '#fff'];
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.inset = '0';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '100';
        document.querySelector('.gacha-glow-' + rank.toLowerCase())?.appendChild(container);

        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + '%';
            c.style.top = Math.random() * 100 + '%';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(c);
            
            const animation = c.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${(Math.random() - 0.5) * 200}px, ${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 1000 + 1000,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            });
            animation.onfinish = () => c.remove();
        }
        return () => container.remove();
    }, [rank]);

    return null;
};

export default ConfettiEffect;

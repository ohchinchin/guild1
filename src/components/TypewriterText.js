import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);

const TypewriterText = ({ text, speed = 50, onComplete, className }) => {
    const [displayedText, setDisplayedText] = React.useState("");
    const [index, setIndex] = React.useState(0);
    const [done, setDone] = React.useState(false);

    React.useEffect(() => {
        setDisplayedText("");
        setIndex(0);
        setDone(false);
    }, [text]);

    React.useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[index]);
                setIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else {
            setDone(true);
            if (onComplete) onComplete();
        }
    }, [index, text, speed, onComplete]);

    return html`
        <span className=${className}>
            ${displayedText}
            ${!done && html`<span className="typewriter-cursor"></span>`}
        </span>
    `;
};

export default TypewriterText;

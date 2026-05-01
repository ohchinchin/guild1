import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
export default function LogView({ logs, logsEndRef }) {
    const { Skull, CheckCircle2, AlertTriangle, Activity, Star, ArrowRight } = window.LucideReact || window.lucide || {};
    const getLogColor = (type) => {
        switch (type) {
            case 'danger': return 'text-rose-800 bg-rose-50 border-rose-200';
            case 'success': return 'text-emerald-800 bg-[#Edf3e8] border-[#c5d8c1]';
            case 'warning': return 'text-amber-800 bg-[#Fdf6e3] border-[#e8dcb5]';
            case 'info': return 'text-indigo-900 bg-[#eef1f6] border-[#cdd4e0]';
            case 'accent': return 'text-amber-900 bg-amber-100 border-amber-300';
            default: return 'text-stone-800 bg-[#FAF8F5] border-[#E8E0D5]';
        }
    };

    const getLogIcon = (type) => {
        switch (type) {
            case 'danger': return html`<${Skull} className="w-4 h-4 shrink-0 mt-0.5" />`;
            case 'success': return html`<${CheckCircle2} className="w-4 h-4 shrink-0 mt-0.5" />`;
            case 'warning': return html`<${AlertTriangle} className="w-4 h-4 shrink-0 mt-0.5" />`;
            case 'info': return html`<${Activity} className="w-4 h-4 shrink-0 mt-0.5" />`;
            case 'accent': return html`<${Star} className="w-4 h-4 shrink-0 mt-0.5" />`;
            default: return html`<${ArrowRight} className="w-4 h-4 shrink-0 mt-0.5 text-stone-400" />`;
        }
    };

    return html`
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 relative">
            <p className="text-stone-600 mb-4 shrink-0">ギルドが辿ってきた歴史の記録です。</p>
            <div className="flex-1 overflow-y-auto space-y-2.5 bg-white p-4 border border-[#E8E0D5] rounded-sm shadow-inner relative">
                ${logs.map((log) => html`
                    <div key=${log.id} className=${`p-3 rounded-sm border text-sm flex gap-3 shadow-sm ${getLogColor(log.type)} animate-in fade-in duration-300`}>
                        ${getLogIcon(log.type)}
                        <span className="leading-relaxed font-medium">${log.msg}</span>
                    </div>
                `)}
                <div ref=${logsEndRef} />
            </div>
        </div>
    `;
}

import { AlertCircle } from 'lucide-react';

const TYPE_STYLES = {
    success: "bg-emerald-500/15 text-emerald-400",
    warning: "bg-amber-500/15 text-amber-400",
    error: "bg-rose-500/15 text-rose-400",
    info: "bg-blue-500/15 text-blue-400",
};

export default function Notification({ notification }) {
    if (!notification) return null;

    return (
        <div className="fixed top-5 right-5 z-50 animate-bounce max-w-sm flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className={`p-2 rounded-lg ${TYPE_STYLES[notification.type] || TYPE_STYLES.info}`}>
                <AlertCircle className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-200">{notification.text}</p>
            </div>
        </div>
    );
}

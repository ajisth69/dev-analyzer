import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm font-semibold font-['Outfit'] transition-all animate-slide-up ${
            toast.type === 'success'
              ? 'bg-[#001D33] text-white border-[#0B57D0]'
              : toast.type === 'error'
              ? 'bg-[#FFDAD6] text-[#410002] border-[#BA1A1A]/30'
              : 'bg-[#E8DEF8] text-[#1D192B] border-[#E1E3E1]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#BA1A1A] shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

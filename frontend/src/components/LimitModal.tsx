import React, { useState } from 'react';
import { Key, ExternalLink, X, ShieldAlert } from 'lucide-react';
import { setCustomGroqKey, getDailyUsage, DAILY_FREE_LIMIT } from '../hooks/useDevAnalyzer';

interface LimitModalProps {
  onClose: () => void;
  onSuccess: (savedKey: string) => void;
}

export function LimitModal({ onClose, onSuccess }: LimitModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const usage = getDailyUsage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      setError('Please enter a valid Groq API key starting with gsk_');
      return;
    }
    if (!cleanKey.startsWith('gsk_')) {
      setError('Invalid Groq API key format. Key should start with gsk_');
      return;
    }
    setCustomGroqKey(cleanKey);
    onSuccess(cleanKey);
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 animate-scale-in"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: 'var(--accent-light)', color: '#8B6914', border: '1px solid var(--border-accent)' }}
            >
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Free Daily Limit Exhausted
              </h3>
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {usage.count} of {DAILY_FREE_LIMIT} Free Daily Analyses Used Today
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors shrink-0"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div
          className="p-4 rounded-2xl space-y-2"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-accent)' }}
        >
          <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
            You've used all 10 free daily analyses included in the public tier today. Enter your custom <strong>Groq API Key</strong> below to unlock unlimited profile & repository analyses.
          </p>
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold transition-all pt-1"
            style={{ color: 'var(--accent)' }}
          >
            Get a free Groq API Key at console.groq.com <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Key Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Key className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Groq API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setError(null); }}
              placeholder="gsk_..."
              className="w-full px-4 py-3 rounded-2xl outline-none text-sm font-mono transition-all"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
            {error && <p className="text-xs font-bold pt-1" style={{ color: '#E53E3E' }}>{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all shadow-md"
              style={{
                background: 'var(--accent)',
                color: 'white',
                boxShadow: '0 4px 14px rgba(232, 168, 0, 0.3)',
              }}
            >
              Save Key & Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

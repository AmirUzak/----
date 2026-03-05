'use client';

import { useState } from 'react';
import { MessageCircle, X, ChevronDown } from 'lucide-react';
import { ASSISTANT_FAQ } from '@/lib/assistant-faq';
import { clsx } from 'clsx';

export function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <div
          className={clsx(
            'absolute bottom-14 right-0 w-80 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all duration-300 dark:border-slate-700 dark:bg-slate-900',
            isOpen ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-sky-50 px-4 py-3 dark:border-slate-700 dark:bg-sky-900/30">
            <h3 className="font-semibold text-slate-900 dark:text-white">Помощь</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[320px] overflow-y-auto p-2">
            <p className="mb-3 px-2 text-sm text-slate-500 dark:text-slate-400">
              Выберите вопрос:
            </p>
            {ASSISTANT_FAQ.map((item, i) => (
              <div
                key={i}
                className="mb-1 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 dark:text-white dark:hover:bg-slate-800/50"
                >
                  <span className="flex-1">{item.question}</span>
                  <ChevronDown
                    className={clsx(
                      'h-4 w-4 shrink-0 text-slate-400 transition-transform',
                      expandedIndex === i && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={clsx(
                    'overflow-hidden border-t border-slate-200 transition-all dark:border-slate-700',
                    expandedIndex === i ? 'max-h-48' : 'max-h-0'
                  )}
                >
                  <p className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg hover:bg-sky-600 transition-colors"
          aria-label="Открыть помощника"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}

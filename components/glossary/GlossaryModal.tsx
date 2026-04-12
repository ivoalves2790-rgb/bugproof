"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@/components/ui/Icons";
import { useT } from "@/lib/i18n/use-language";

interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
}

interface GlossaryModalProps {
  entry: GlossaryEntry | null;
  onClose: () => void;
  onOpenRelated?: (termId: string) => void;
}

export function GlossaryModal({ entry, onClose, onOpenRelated }: GlossaryModalProps) {
  const t = useT();

  if (!entry) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-t-2xl border border-border bg-surface p-5 sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-terminal-green">
                {t("glossary.title")}
              </span>
              <h3 className="text-lg font-bold mt-1">{entry.term}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Definition */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {entry.definition}
          </p>

          {/* Example */}
          {entry.example && (
            <div className="mt-4 rounded-lg bg-surface-2 p-3">
              <span className="text-[10px] uppercase tracking-wider text-terminal-amber">
                {t("glossary.example")}
              </span>
              <p className="mt-1 text-xs text-muted-foreground font-mono leading-relaxed">
                {entry.example}
              </p>
            </div>
          )}

          {/* Related terms */}
          {entry.relatedTerms && entry.relatedTerms.length > 0 && onOpenRelated && (
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.relatedTerms.map((termId) => (
                <button
                  key={termId}
                  onClick={() => onOpenRelated(termId)}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1 text-[10px] text-muted-foreground hover:border-terminal-green hover:text-terminal-green transition-colors"
                >
                  {termId.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

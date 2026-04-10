"use client";

import { useState, useMemo } from "react";
import glossaryData from "@/content/glossary.json";
import type { GlossaryTerm } from "@/lib/types/content.types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconSearch } from "@/components/ui/Icons";

const glossary = glossaryData as GlossaryTerm[];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return glossary;
    const q = search.toLowerCase();
    return glossary.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> Glossary
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {glossary.length} terms explained in plain English. No jargon to
          explain jargon.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <IconSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm outline-none focus:border-terminal-green"
        />
      </div>

      {/* Terms */}
      <div className="space-y-3">
        {filtered.map((term) => (
          <Card key={term.id}>
            <h3 className="font-semibold text-terminal-green">{term.term}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {term.definition}
            </p>
            {term.example && (
              <div className="mt-2 rounded-lg bg-surface-2 p-2 text-xs text-muted-foreground">
                <span className="text-terminal-amber">Example: </span>
                {term.example}
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {term.relatedTerms.map((rt) => (
                <Badge key={rt} variant="default">
                  {rt.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No terms found for &quot;{search}&quot;
          </p>
        )}
      </div>
    </div>
  );
}

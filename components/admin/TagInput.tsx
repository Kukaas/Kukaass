'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { fieldLabel } from './styles';

interface TagInputProps {
  label: string;
  placeholder?: string;
  values: string[];
  onChange: (next: string[]) => void;
}

/**
 * A labelled "add item" input with removable chips. Replaces the five
 * copy-pasted purpose/tech/features/challenges/solutions blocks the project
 * forms used to repeat. Built on the shadcn Input/Button primitives.
 */
export default function TagInput({ label, placeholder, values, onChange }: TagInputProps) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();
    if (value && !values.includes(value)) {
      onChange([...values, value]);
    }
    setDraft('');
  };

  const remove = (index: number) => onChange(values.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <Label className={fieldLabel}>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="outline"
          onClick={add}
          className="shrink-0 border-brand/30 bg-brand/15 text-brand hover:bg-brand/25 hover:text-brand"
        >
          <Plus className="size-4" /> Add
        </Button>
      </div>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
            >
              {value}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove ${value}`}
                className="text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

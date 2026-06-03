'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Trash2, Plus } from 'lucide-react';
import { useEditor } from './EditorContext';
import { PROFILE, SOCIALS } from './data';
import { FILES, type FileId } from './files';

const HOST = 'chester@portfolio';
const uid = () => Math.random().toString(36).slice(2, 9);

/** The shell prompt glyphs, reused by echoed history and the live input line. */
function Prompt() {
  return (
    <span aria-hidden="true" className="select-none whitespace-pre">
      <span className="text-foreground/80">{HOST}</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-brand">~</span>
      <span className="text-muted-foreground">$ </span>
    </span>
  );
}

/** A line printed in the scrollback: either an echoed prompt or command output. */
interface Line {
  id: string;
  kind: 'prompt' | 'output';
  text: string;
}

const HELP = `Available commands:
  help            show this message
  ls              list files in this workspace
  open <file>     open a file in the editor
  cat <file>      alias for open
  whoami          who is Chester?
  socials         list social links
  resume          download the résumé
  ask             open the AI assistant (right panel)
  date            print the current date
  clear           clear the terminal

Tip: the file tree on the left is the navigation. Try \`open projects\`.`;

const WHOAMI = `${PROFILE.name} (@${PROFILE.handle})
${PROFILE.role} · ${PROFILE.location}
status: open to roles & freelance
email:  ${PROFILE.email}`;

/** Resolve a typed argument (id, file name, or stem) to a known file. */
function matchFile(arg: string): FileId | undefined {
  const a = arg.toLowerCase().replace(/\/$/, '');
  const hit = FILES.find(
    (f) => f.id === a || f.name.toLowerCase() === a || f.name.toLowerCase().split('.')[0] === a,
  );
  return hit?.id;
}

export default function Terminal() {
  const { setTerminalOpen, openFile, downloadResume, toggleAssistant } = useEditor();
  const [lines, setLines] = useState<Line[]>([
    { id: uid(), kind: 'output', text: `${PROFILE.handle} portfolio shell — type \`help\` to get started.` },
    { id: uid(), kind: 'output', text: 'The AI assistant now lives in the right panel — run `ask` or press ⌘I to open it.' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileList = useMemo(() => FILES.map((f) => (f.folder ? `${f.name}/` : f.name)).join('   '), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lines]);

  // Focus the prompt as soon as the panel opens, like a real terminal.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const print = (text: string) => setLines((prev) => [...prev, { id: uid(), kind: 'output', text }]);

  const run = (raw: string) => {
    const text = raw.trim();
    setLines((prev) => [...prev, { id: uid(), kind: 'prompt', text: raw }]);
    if (text) setHistory((prev) => [...prev, text]);
    setHistIndex(null);
    if (!text) return;

    const [cmd, ...rest] = text.split(/\s+/);
    const arg = rest.join(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        print(HELP);
        break;
      case 'ls':
      case 'dir':
        print(fileList);
        break;
      case 'open':
      case 'cat': {
        if (!arg) {
          print(`usage: ${cmd} <file> — try one of: ${FILES.map((f) => f.name).join(', ')}`);
          break;
        }
        const id = matchFile(arg);
        if (id) {
          openFile(id);
          print(`opening ${arg}…`);
        } else {
          print(`${cmd}: ${arg}: no such file`);
        }
        break;
      }
      case 'whoami':
        print(WHOAMI);
        break;
      case 'socials':
      case 'links':
        print(SOCIALS.map((s) => `${s.name.padEnd(10)} ${s.label}`).join('\n'));
        break;
      case 'resume':
      case 'cv':
        downloadResume();
        print('downloading résumé…');
        break;
      case 'ask':
      case 'chat':
      case 'copilot':
        toggleAssistant();
        print('opening the AI assistant in the right panel →');
        break;
      case 'date':
        print(new Date().toString());
        break;
      case 'echo':
        print(arg);
        break;
      case 'clear':
      case 'cls':
        setLines([]);
        break;
      default:
        print(`command not found: ${cmd}. type \`help\` for a list.`);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(input);
    setInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = histIndex === null ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndex === null) return;
      const next = histIndex + 1;
      if (next >= history.length) {
        setHistIndex(null);
        setInput('');
      } else {
        setHistIndex(next);
        setInput(history[next]);
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-background font-mono text-[12.5px]">
      {/* Panel header */}
      <div className="flex h-8 shrink-0 select-none items-center justify-between border-b border-border pl-1 pr-2 text-muted-foreground">
        <div className="flex h-full items-stretch">
          <span className="tab-accent flex items-center px-3 text-[11px] uppercase tracking-[0.14em] text-foreground/85">
            Terminal
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            aria-label="Focus terminal"
            title="New prompt"
            className="rounded p-1 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Plus className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setLines([])}
            aria-label="Clear terminal"
            title="Clear"
            className="rounded p-1 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setTerminalOpen(false)}
            aria-label="Hide terminal"
            title="Hide panel"
            className="rounded p-1 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Scrollback — the live prompt is the last line, inline like a real shell */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        onClick={() => inputRef.current?.focus()}
        className="editor-scroll editor-selectable min-h-0 flex-1 cursor-text space-y-1 overflow-y-auto px-3 py-2.5 leading-relaxed"
      >
        {lines.map((l) =>
          l.kind === 'prompt' ? (
            <div key={l.id} className="text-foreground">
              <Prompt />
              <span className="whitespace-pre-wrap break-words">{l.text}</span>
            </div>
          ) : (
            <pre key={l.id} className="whitespace-pre-wrap break-words font-mono text-[12.5px] text-muted-foreground">
              {l.text}
            </pre>
          ),
        )}

        <form onSubmit={onSubmit} className="flex items-baseline text-foreground">
          <Prompt />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-foreground caret-brand focus:outline-none"
          />
        </form>

        <div ref={endRef} />
      </div>
    </div>
  );
}

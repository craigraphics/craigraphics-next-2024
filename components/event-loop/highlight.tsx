import React from 'react';

const TOKENS =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|new|return|function|async|await|if|else|for|while|of|in|null|true|false|undefined)\b|\b(\d+(?:\.\d+)?)\b/g;

const CLASS = ['text-muted-foreground italic', 'text-secondary', 'text-primary', 'text-accent'];

/** Deliberately small: keywords, strings, numbers, comments. Enough to read, too small to mangle. */
export function highlight(line: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  TOKENS.lastIndex = 0;
  while ((match = TOKENS.exec(line)) !== null) {
    if (match.index > last) out.push(line.slice(last, match.index));
    const group = [1, 2, 3, 4].find((i) => match![i] !== undefined) ?? 0;
    out.push(
      <span key={`${match.index}`} className={CLASS[group - 1]}>
        {match[group]}
      </span>
    );
    last = match.index + match[0].length;
  }
  if (last < line.length) out.push(line.slice(last));

  return out;
}

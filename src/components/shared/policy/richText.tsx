import { Fragment, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type PolicyBlock =
  | { type: 'p'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'address'; lines: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

const TOKEN_PATTERN = '(\\{\\{LINK:[^|]+\\|[^}]+\\}\\})|(\\*\\*[^*]+\\*\\*)|(https?:\\/\\/[^\\s)]+)|([\\w.+-]+@[\\w-]+\\.[\\w.-]+)';

// Renders a string that may contain **bold** spans, {{LINK:label|/route}} internal
// links, bare emails, and bare URLs into the equivalent inline JSX. **bold** content
// is parsed recursively, so a new regex instance is used per call (a shared global
// regex's lastIndex would otherwise be clobbered by the recursive invocation).
export function renderRich(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  const tokenRe = new RegExp(TOKEN_PATTERN, 'g');

  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }

    const [full, linkToken, boldToken, urlToken, emailToken] = match;

    if (linkToken) {
      const inner = linkToken.slice('{{LINK:'.length, -2);
      const sep = inner.indexOf('|');
      const label = inner.slice(0, sep);
      const route = inner.slice(sep + 1);
      parts.push(
        <Link key={key++} to={route} className="font-semibold text-primary hover:underline">
          {label}
        </Link>
      );
    } else if (boldToken) {
      parts.push(<strong key={key++}>{renderRich(boldToken.slice(2, -2))}</strong>);
    } else if (urlToken) {
      parts.push(
        <a
          key={key++}
          href={urlToken}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {urlToken}
        </a>
      );
    } else if (emailToken) {
      parts.push(
        <a key={key++} href={`mailto:${emailToken}`} className="text-primary hover:underline">
          {emailToken}
        </a>
      );
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return parts;
}

export function renderBlocks(blocks: PolicyBlock[]): ReactNode {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'ul') {
          return (
            <ul key={i} className="mt-3 space-y-2 list-disc list-outside pl-5">
              {b.items.map((item, j) => (
                <li key={j}>{renderRich(item)}</li>
              ))}
            </ul>
          );
        }
        if (b.type === 'subheading') {
          return (
            <p key={i} className="mt-4 mb-1 font-semibold text-foreground">
              {renderRich(b.text)}
            </p>
          );
        }
        if (b.type === 'address') {
          return (
            <address key={i} className="mt-3 not-italic space-y-1 text-muted-foreground">
              {b.lines.map((line, j) => (
                <p key={j}>{renderRich(line)}</p>
              ))}
            </address>
          );
        }
        if (b.type === 'table') {
          return (
            <div key={i} className="mt-3 overflow-x-auto border border-border rounded-sm">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    {b.headers.map((h, j) => (
                      <th key={j} className="text-left font-serif font-medium text-foreground px-4 py-2 border-b border-border">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, j) => (
                    <tr key={j} className="border-b border-border last:border-b-0">
                      {row.map((cell, k) => (
                        <td key={k} className="px-4 py-2 align-top">
                          {renderRich(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={i} className={i === 0 ? '' : 'mt-3'}>
            {renderRich(b.text)}
          </p>
        );
      })}
    </>
  );
}
